# python3 fields.py <tile.jpg>  ->  field-<letter>.png, fields.json   (needs comps.json, bear.png, nunito-*.png)
# Per-letter coverage fields at 4x the concept tile (2216 px): the concept's own letter by colour unmixing
# (cream / amber / ground), completed from the fitted Nunito glyph only where the concept's bear covers it.
# Each field-<letter>.png (L, 0..255 = coverage) is cropped to the letter's box; fields.json keeps the offsets.
import json, sys
from PIL import Image, ImageFilter, ImageChops
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
con=Image.open(sys.argv[1]).convert('RGB')
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
