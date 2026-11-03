# python3 fields.py <tile.jpg> [--cover chairtax|stet|social-hook|about|scorecard]  ->  field-<letter>.png, fields.json
# Per-letter coverage fields at 4x the concept tile, cropped to each letter's box (fields.json keeps the offsets).
#   chairtax (the default; needs comps.json, bear.png, nunito-*.png): the concept's own letter by colour unmixing
#     (cream / amber / ground), completed from the fitted Nunito glyph only where the concept's bear covers it.
#   stet: each letter's coverage from the tile's luma, between the ground and the letter's own interior near the
#     pixel (its letters are shaded in many colours); the e and the last t, which touch, are one field.
#   social-hook, about, scorecard (need comps.json and tile554.png from comps.py): each pixel's coverage as its distance from the
#     local ground towards the local ink (white, or About Neil's gold filled out from the letter's interior).
# Each field-<letter>.png is L, 0..255 = coverage.
import json, sys
from PIL import Image, ImageFilter, ImageChops, ImageMath

def chairtax(tile):
    W=554; U=4; WU=W*U
    CRE=(252,238,206); AMB=(249,178,36); GND=(20,15,11)
    def unmix(im, ink_idx):
        # least squares c - G = a (CRE - G) + b (AMB - G); returns the chosen ink's coverage as an L image
        u=[c-g for c,g in zip(CRE,GND)]; v=[c-g for c,g in zip(AMB,GND)]
        uu=sum(x*x for x in u); vv=sum(x*x for x in v); uv=sum(x*y for x,y in zip(u,v)); det=uu*vv-uv*uv
        out=[]
        for c in im.getdata():
            d=[c[i]-GND[i] for i in range(3)]
            du=sum(x*y for x,y in zip(d,u)); dv=sum(x*y for x,y in zip(d,v))
            a=(du*vv-dv*uv)/det; b=(dv*uu-du*uv)/det
            out.append(max(0,min(255,round(255*(a if ink_idx==0 else b)))))
        o=Image.new('L',im.size); o.putdata(out); return o
    def comp_mask(pts, size):
        m=Image.new('L',(W,W)); p=m.load()
        for x,y in pts: p[x,y]=255
        return m
    con=Image.open(tile).convert('RGB')
    cc=json.load(open('comps.json'))
    bear=Image.open('bear.png').filter(ImageFilter.MaxFilter(3))
    zone=bear.filter(ImageFilter.MaxFilter(13))          # the bear plus 6 px (its dark outline too): where the concept's letter is hidden
    alpha_c=[unmix(con,0), unmix(con,1)]
    letters=[('C','chair',0,0),('h','chair',1,0),('a','chair',2,0),('idot','chair',3,0),('i','chair',4,0),('r','chair',5,0),('t','tax',0,1),('a2','tax',1,1),('x','tax',2,1)]

    # a hidden stem top (the h's ascender under the sleeve): the concept's stem edges, fitted as lines on the rows
    # just below the hidden zone, carried up to Nunito's ascender height and closed with a flat top whose corners
    # are rounded by a blur, like the concept's visible stem tops (the i). STEMS: name -> (x0, x1, y0, y1) stem columns and the
    # visible straight rows the edges are fitted on, at 2216.
    STEMS={'h':(670,900,830,900)}
    # Nunito is used only inside these boxes (2216 px): the a's visible terminal cut stays the concept's
    NCLIP={'a':(1185,0,WU,WU)}
    def fit_stem(g, A, Z, cols):
        from PIL import ImageDraw
        x0,x1,y0,y1=cols; zp=Z.load(); ap=A.load()
        yz=max(y for y in range(WU) for x in range(x0,x1,4) if zp[x,y]>127)
        rows=list(range(y0,y1,2))
        def edges(y):
            xs=[x for x in range(x0,x1) if ap[x,y]>=128]; return min(xs),max(xs)
        def line(pts):   # x = p + q*y, least squares
            n=len(pts); my=sum(y for y,_ in pts)/n; mx=sum(x for _,x in pts)/n
            q=sum((y-my)*(x-mx) for y,x in pts)/sum((y-my)**2 for y,_ in pts); return mx-q*my, q
        L=line([(y,edges(y)[0]) for y in rows]); R=line([(y,edges(y)[1]) for y in rows])
        top=g.getbbox()[1]
        poly=[(L[0]+L[1]*top,top),(R[0]+R[1]*top,top),(R[0]+R[1]*(yz+60),yz+60),(L[0]+L[1]*(yz+60),yz+60)]
        m=Image.new('L',g.size,0); ImageDraw.Draw(m).polygon(poly,fill=255)
        m=m.filter(ImageFilter.GaussianBlur(8))
        cut=Image.new('L',g.size,0); cut.paste(255,(0,0,WU,y1)); m=ImageChops.multiply(m,cut.filter(ImageFilter.GaussianBlur(4)))
        print('  stem edges at the seam', round(L[0]+L[1]*yz,1), round(R[0]+R[1]*yz,1), 'top', top)
        return m
    meta={}
    for name,row,k,ink in letters:
        same=[i for i in range(len(cc[row])) if i!=k and not (row=='tax' and i==3)]
        win=comp_mask(cc[row][k]['pts'],W).filter(ImageFilter.MaxFilter(5))
        for i in same: win=ImageChops.subtract(win, comp_mask(cc[row][i]['pts'],W))
        a=ImageChops.multiply(alpha_c[ink], win)
        z=ImageChops.multiply(zone, win.filter(ImageFilter.MaxFilter(21)))   # the hidden zone near this letter
        hidden=z.getbbox() is not None
        a=ImageChops.multiply(a, ImageChops.invert(bear))                     # the bear's own pixels are never letter
        A=a.resize((WU,WU),Image.BICUBIC).filter(ImageFilter.GaussianBlur(2.0))
        if hidden:
            g=Image.open('nunito-%s.png' % {'idot':'i'}.get(name,name)).convert('L')
            if name in ('i','idot'):   # the dot and the stem of the i apart, by the concept's own split
                g=ImageChops.multiply(g, win.filter(ImageFilter.MaxFilter(15)).resize((WU,WU),Image.BILINEAR).point(lambda v: 255 if v>0 else 0))
            Z=z.resize((WU,WU),Image.BILINEAR).filter(ImageFilter.GaussianBlur(3))
            if name in STEMS:   # the whole rebuilt stem top stands, above the rows it was fitted on
                A=ImageChops.lighter(A, fit_stem(g, A, Z, STEMS[name]))
            else:
                if name in NCLIP:
                    m=Image.new('L',g.size,0); m.paste(255,NCLIP[name]); g=ImageChops.multiply(g,m)
                N=g.filter(ImageFilter.GaussianBlur(2.0))
                A=ImageChops.lighter(A, ImageChops.multiply(N, Z))               # the concept's letter, plus Nunito where it is hidden
        bb=A.point(lambda v: 255 if v>=128 else 0).getbbox()
        pad=8; bb=(max(0,bb[0]-pad),max(0,bb[1]-pad),min(WU,bb[2]+pad),min(WU,bb[3]+pad))
        A.crop(bb).save(f'field-{name}.png'); meta[name]={'box':bb,'ch':ink,'hidden':hidden}
        print(name, bb, 'hidden zone' if hidden else '')
    json.dump(meta,open('fields.json','w'))


def stet(tile):
    # the 546 px tile; its letters, the s, the first t, and the joined e and last t, are apart in the tile above
    # luma SPLIT, each pixel of the letter mask (above THR) going to the part nearest it
    W=546; U=4; WU=W*U; P=48
    MARK=(0,0,110,110)       # the mark's box at the tile, never letter
    THR=50                   # luma at the tile above which a pixel may be letter (the dark teal runs down to about 75)
    SPLIT=95                 # the letters are apart above this luma; each pixel goes to the nearest of those parts
    con=Image.open(tile).convert('RGB'); luma=con.convert('L')
    # the tile's last two columns are its crop border (dark across the last t): the letters run on through them
    luma.paste(luma.crop((W-3,0,W-2,W)).resize((2,W)),(W-2,0))
    def pad(im, p=P):
        # edge-replicated margin, so letters that leave the tile trace as closed loops beyond it
        w,h=im.size; o=Image.new(im.mode,(w+2*p,h+2*p))
        o.paste(im,(p,p))
        o.paste(im.crop((0,0,1,h)).resize((p,h)),(0,p)); o.paste(im.crop((w-1,0,w,h)).resize((p,h)),(w+p,p))
        o.paste(o.crop((0,p,w+2*p,p+1)).resize((w+2*p,p)),(0,0)); o.paste(o.crop((0,h+p-1,w+2*p,h+p)).resize((w+2*p,p)),(0,h+p))
        f=Image.new(im.mode,(w+2*p+32,h+2*p+32)); f.paste(o,(16,16))   # and a clear frame, so every outline closes
        return f
    def above(t):
        m=luma.point(lambda v: 255 if v>t else 0); m.paste(0,MARK); return m
    thr=above(THR)   # unfiltered: the gap between the s and the first t is one pixel wide
    # letters: connected parts of the threshold mask at the tile
    def comps(m, minpx=200):
        q=m.load(); seen=bytearray(W*W); out=[]
        for y in range(W):
            for x in range(W):
                if q[x,y]>127 and not seen[y*W+x]:
                    st=[(x,y)]; seen[y*W+x]=1; pts=[]
                    while st:
                        u,v=st.pop(); pts.append((u,v))
                        for du,dv in ((1,0),(-1,0),(0,1),(0,-1)):
                            a,b=u+du,v+dv
                            if 0<=a<W and 0<=b<W and not seen[b*W+a] and q[a,b]>127: seen[b*W+a]=1; st.append((a,b))
                    if len(pts)>=minpx: out.append(pts)
        return sorted(out,key=lambda pts: min(u for u,_ in pts))
    cc=comps(above(SPLIT).filter(ImageFilter.MedianFilter(3))); print('parts', [ (min(u for u,_ in p),max(u for u,_ in p),len(p)) for p in cc])
    assert len(cc)==3
    def mask_of(pts):
        m=Image.new('L',(W,W)); p=m.load()
        for x,y in pts: p[x,y]=255
        return m
    cm=[mask_of(p) for p in cc]
    # coverage at 4x: luma between the ground and the letter's own interior luma near the pixel
    up=luma.resize((WU,WU),Image.BICUBIC)
    gl=sorted(v for v in luma.getdata() if v<THR//2); g=gl[len(gl)//2]
    inner=thr.resize((WU,WU),Image.BILINEAR).point(lambda v: 255 if v>127 else 0).filter(ImageFilter.MinFilter(25))
    # each pixel near an edge takes the luma of the interior nearest it: the interior's values spread out one ring at a
    # time, each new pixel the mean of its known neighbours
    Yi=ImageChops.multiply(up,inner); K=inner
    for _ in range(24):
        S=Yi.filter(ImageFilter.BoxBlur(1)); N=K.filter(ImageFilter.BoxBlur(1))
        new=ImageChops.subtract(N.point(lambda v: 255 if v>0 else 0),K)
        fill=ImageMath.lambda_eval(lambda a: a['convert'](a['min'](a['s']*255/a['max'](a['n'],1),255),'L'),s=S,n=N)
        Yi=ImageChops.lighter(Yi,ImageChops.multiply(fill,new)); K=ImageChops.lighter(K,new)
    # the lowest of those within a pixel: a fold's dark line that meets an edge stays letter
    Yi=Yi.filter(ImageFilter.MinFilter(9))
    A=ImageMath.lambda_eval(lambda a: a['convert'](a['min'](a['max']((a['u']-g)*255/a['max'](a['y']-g,30),0),255),'L'),u=up,y=Yi)
    A=ImageChops.lighter(A,inner)
    A=ImageChops.multiply(A,thr.resize((WU,WU),Image.BILINEAR).point(lambda v: 255 if v>0 else 0).filter(ImageFilter.MaxFilter(17)))
    print('ground luma', g)
    # the parts grow one pixel at a time, in turn: first over the letter mask, so a dark gap stops them, then over
    # the rest, until they fill the tile. Each pixel goes to the part nearest it, and the windows partition the tile.
    lab=list(cm); taken=ImageChops.lighter(ImageChops.lighter(cm[0],cm[1]),cm[2])
    for over in (thr, None):
        while True:
            grew=False
            for k in range(len(lab)):
                g_=ImageChops.subtract(lab[k].filter(ImageFilter.MaxFilter(3)),taken)
                if over: g_=ImageChops.multiply(g_,over)
                if g_.getbbox(): grew=True
                lab[k]=ImageChops.lighter(lab[k],g_); taken=ImageChops.lighter(taken,g_)
            if not grew: break
    def win(k): return lab[k].resize((WU,WU),Image.NEAREST)
    # the e and the last t touch along the t's stem: one outline, and the shader parts their colour fields at the seam
    letters=[('t',0,win(1)),('s',1,win(0)),('et',1,win(2))]
    meta={}
    for name,ch,w in letters:
        F=pad(ImageChops.multiply(A,w)).filter(ImageFilter.GaussianBlur(2.0))
        bb=F.point(lambda v: 255 if v>=128 else 0).getbbox(); q=8
        bb=(max(0,bb[0]-q),max(0,bb[1]-q),min(F.width,bb[2]+q),min(F.height,bb[3]+q))
        F.crop(bb).save(f'field-{name}.png'); meta[name]={'box':[bb[0]-P-16,bb[1]-P-16,bb[2]-P-16,bb[3]-P-16],'ch':ch,'hidden':False}
        print(name,meta[name]['box'])
    json.dump(meta,open('fields.json','w'))

def ink_over_ground(tile, COVER):
    W=554; U=4; WU=W*U
    # python3 fields.py <tile.jpg> --cover social-hook|about  (needs comps.json, tile554.png from comps.py)
    # Letters on a ground that changes under them (Social Hook: deep blue and the light wedge by the k and the l;
    # About Neil: the cream paper's vignette): each pixel's coverage is its distance from the local ground towards
    # the local ink, the ground filled in under the letters from the pixels around them. The ink is white (Social
    # Hook), or the gold of the letter's own interior filled out to its edges (About Neil, whose gold shades and
    # carries grain). One field per connected part (touching letters stay one outline).
    con=Image.open('tile554.png').convert('RGB')
    cc=json.load(open('comps.json'))['title']
    NAMES={'social-hook':['SH','oc','oo','idot','i','k','a','l'],'about':['N','e','idot','i','l'],'scorecard':['Sc','o','r','e','ca','rd']}[COVER]   # the parts, by left edge (comps.py's order)
    allm=Image.new('L',(W,W)); ap_=allm.load()
    for c in cc:
        for x,y in c['pts']: ap_[x,y]=255
    out=ImageChops.invert(allm.filter(ImageFilter.MaxFilter(9)))            # ground only: 4 px clear of every letter
    def blur(im,r): return im.filter(ImageFilter.GaussianBlur(r))
    num=[ImageChops.multiply(b,out) for b in con.split()]
    # About Neil: the ground's blur widens where too little ground is near (in the narrow gaps inside the word):
    # radius 10, then 25, 60. Social Hook's letters were traced with radius 10 alone.
    RADII=(10,25,60) if COVER=='about' else (10,); dens=[blur(out,r).load() for r in RADII]; nums=[[blur(b,r).load() for r in RADII] for b in num]; gnd=[]
    for k in range(3):
        g=Image.new('F',(W,W)); q=g.load()
        for y in range(W):
            for x in range(W):
                for j in range(len(RADII)):
                    if dens[j][x,y]>=8 or j==len(RADII)-1: break
                dv=dens[j][x,y]; q[x,y]=nums[k][j][x,y]/max(dv,1)*255.0 if dv>0 else 0.0
        gnd.append(g)
    cp=con.load(); gl=[g.load() for g in gnd]
    if COVER=='about':
        core=allm.filter(ImageFilter.MinFilter(7))                          # letter interiors, 3 px in from the edge
        cden=blur(core,6); ink=[]
        for b in [ImageChops.multiply(b,core) for b in con.split()]:
            bb=blur(b,6); bp=bb.load(); dq=cden.load(); g=Image.new('F',(W,W)); q=g.load()
            for y in range(W):
                for x in range(W): q[x,y]=bp[x,y]/max(dq[x,y],1)*255.0 if dq[x,y]>0 else 255.0
            ink.append(g)
        il=[g.load() for g in ink]
    alpha=Image.new('L',(W,W)); al=alpha.load()
    for y in range(W):
        for x in range(W):
            g=[gl[k][x,y] for k in range(3)]; d=[cp[x,y][k]-g[k] for k in range(3)]
            u=[(il[k][x,y] if COVER=='about' else 255)-g[k] for k in range(3)]
            uu=sum(v*v for v in u) or 1.0
            al[x,y]=max(0,min(255,round(255*sum(a*b for a,b in zip(d,u))/uu)))
    meta={}
    for k,(name,c) in enumerate(zip(NAMES,cc)):
        m=Image.new('L',(W,W)); mp=m.load()
        for x,y in c['pts']: mp[x,y]=255
        win=m.filter(ImageFilter.MaxFilter(5))
        for j,o in enumerate(cc):
            if j==k: continue
            om=Image.new('L',(W,W)); op=om.load()
            for x,y in o['pts']: op[x,y]=255
            win=ImageChops.subtract(win,om)
        A=ImageChops.multiply(alpha,win).resize((WU,WU),Image.BICUBIC).filter(ImageFilter.GaussianBlur(2.0))
        bb=A.point(lambda v: 255 if v>=128 else 0).getbbox()
        pad=8; bb=(max(0,bb[0]-pad),max(0,bb[1]-pad),min(WU,bb[2]+pad),min(WU,bb[3]+pad))
        A.crop(bb).save(f'field-{name}.png'); meta[name]={'box':bb,'ch':0,'hidden':False}
        print(name, bb)
    json.dump(meta,open('fields.json','w'))


cover = sys.argv[sys.argv.index('--cover') + 1] if '--cover' in sys.argv else 'chairtax'
if cover in ('social-hook', 'about', 'scorecard'): ink_over_ground(sys.argv[1], cover)
else: {'chairtax': chairtax, 'stet': stet}[cover](sys.argv[1])
