# python3 trace.py [out.json] [--cover social-hook]  ->  chairtax.json   (needs fields.json, field-*.png)
# Traces each letter field at its 0.5 level into closed loops (marching squares), removes the generation wobble
# by smoothing along the outline between corners, keeps the corners sharp, and writes SVG path data in 1024
# cover units: quadratic B-splines through the simplified points, clamped so each run ends on its corners.
import json, math, sys
from PIL import Image
U=4*554/1024          # field px per cover unit
COVER=sys.argv[sys.argv.index('--cover')+1] if '--cover' in sys.argv else 'chairtax'
ARGS=[a for i,a in enumerate(sys.argv[1:],1) if a!='--cover' and sys.argv[i-1]!='--cover']
OUT=ARGS[0] if ARGS else COVER+'.json'
SM=6.0       # smoothing sigma, field px along the outline (about 2.8 px on a 1024 cover)
CORNER=50    # turning in degrees over +-K samples (1 field px apart) that marks a corner
K=12
TOL=0.6      # simplification tolerance, field px
meta=json.load(open('fields.json'))
def loops_of(img):
    w,h=img.size; P=list(img.getdata()); f=lambda x,y: P[y*w+x]/255.0
    T=0.5; pos={}; adj={}
    def node(key,x0,y0,x1,y1,v0,v1):
        if key not in pos:
            t=(T-v0)/(v1-v0); pos[key]=(x0+(x1-x0)*t, y0+(y1-y0)*t)
        return key
    def link(a,b): adj.setdefault(a,[]).append(b); adj.setdefault(b,[]).append(a)
    for y in range(h-1):
        for x in range(w-1):
            a,b,c,d=f(x,y),f(x+1,y),f(x+1,y+1),f(x,y+1)
            ia,ib,ic,id_=a>=T,b>=T,c>=T,d>=T
            e={}
            if ia!=ib: e['t']=node(('h',x,y),x,y,x+1,y,a,b)
            if ib!=ic: e['r']=node(('v',x+1,y),x+1,y,x+1,y+1,b,c)
            if id_!=ic: e['b']=node(('h',x,y+1),x,y+1,x+1,y+1,d,c)
            if ia!=id_: e['l']=node(('v',x,y),x,y,x,y+1,a,d)
            if len(e)==2: k=list(e.values()); link(k[0],k[1])
            elif len(e)==4:
                inside_c=(a+b+c+d)/4>=T
                if ia:   # a and c inside, b and d outside
                    if inside_c: link(e['t'],e['r']); link(e['b'],e['l'])
                    else: link(e['l'],e['t']); link(e['r'],e['b'])
                else:    # b and d inside
                    if inside_c: link(e['l'],e['t']); link(e['r'],e['b'])
                    else: link(e['t'],e['r']); link(e['b'],e['l'])
    seen=set(); loops=[]
    for start in adj:
        if start in seen: continue
        loop=[start]; seen.add(start); prev=None; cur=start
        while True:
            nb=[n for n in adj[cur] if n!=prev]
            nxt=nb[0] if nb else None
            if nxt is None or nxt==start: break
            if nxt in seen: break
            loop.append(nxt); seen.add(nxt); prev,cur=cur,nxt
        loops.append([pos[k] for k in loop])
    return loops
def area(l): return 0.5*sum(l[i][0]*l[i-1][1]-l[i-1][0]*l[i][1] for i in range(len(l)))
def resample(l, step=1.0):
    pts=l+[l[0]]; out=[pts[0]]; acc=0.0
    for i in range(1,len(pts)):
        (x0,y0),(x1,y1)=pts[i-1],pts[i]; d=math.hypot(x1-x0,y1-y0); t=0.0
        while acc+d-t*d>=step:
            t+=(step-acc)/d; acc=0.0; out.append((x0+(x1-x0)*t,y0+(y1-y0)*t))
        acc+=d*(1-t)
    return out[:-1] if math.hypot(out[-1][0]-out[0][0],out[-1][1]-out[0][1])<step*0.5 else out
def turning(l,i,k):
    n=len(l); a=l[(i-k)%n]; b=l[i]; c=l[(i+k)%n]
    v1=(b[0]-a[0],b[1]-a[1]); v2=(c[0]-b[0],c[1]-b[1])
    return abs(math.degrees(math.atan2(v1[0]*v2[1]-v1[1]*v2[0], v1[0]*v2[0]+v1[1]*v2[1])))
def corners_of(l):
    n=len(l); tr=[turning(l,i,K) for i in range(n)]; cs=[]
    for i in range(n):
        if tr[i]>=CORNER and all(tr[i]>=tr[(i+j)%n] for j in range(-K,K+1)):
            if not cs or i-cs[-1]>K: cs.append(i)
    if len(cs)>1 and cs[0]+n-cs[-1]<=K: cs.pop()
    return cs
def smooth_open(seg, s):
    # Gaussian along a run whose ends are fixed corners (kernel truncated at the ends, renormalised)
    n=len(seg); r=int(3*s); w=[math.exp(-0.5*(j/s)**2) for j in range(-r,r+1)]; out=[seg[0]]
    for i in range(1,n-1):
        lo=max(0,i-r); hi=min(n-1,i+r); m=min(i-lo,hi-i)   # symmetric window so the ends stay put
        sx=sy=sw=0.0
        for j in range(-m,m+1):
            ww=w[j+r]; sx+=ww*seg[i+j][0]; sy+=ww*seg[i+j][1]; sw+=ww
        out.append((sx/sw,sy/sw))
    out.append(seg[-1]); return out
def smooth_closed(l, s):
    n=len(l); r=int(3*s); w=[math.exp(-0.5*(j/s)**2) for j in range(-r,r+1)]; sw=sum(w); out=[]
    for i in range(n):
        sx=sum(w[j+r]*l[(i+j)%n][0] for j in range(-r,r+1)); sy=sum(w[j+r]*l[(i+j)%n][1] for j in range(-r,r+1))
        out.append((sx/sw,sy/sw))
    return out
def dp(pts, tol):
    if len(pts)<3: return pts
    (x0,y0),(x1,y1)=pts[0],pts[-1]; dx,dy=x1-x0,y1-y0; L=math.hypot(dx,dy) or 1e-9
    i_max,d_max=0,0.0
    for i in range(1,len(pts)-1):
        d=abs(dy*(pts[i][0]-x0)-dx*(pts[i][1]-y0))/L
        if d>d_max: i_max,d_max=i,d
    if d_max<=tol: return [pts[0],pts[-1]]
    return dp(pts[:i_max+1],tol)[:-1]+dp(pts[i_max:],tol)
def simplify(seg):
    # an open run whose ends meet (a loop with one corner) is split at its farthest point first
    if math.hypot(seg[-1][0]-seg[0][0],seg[-1][1]-seg[0][1])<1.0:
        j=max(range(len(seg)),key=lambda i: math.hypot(seg[i][0]-seg[0][0],seg[i][1]-seg[0][1]))
        return dp(seg[:j+1],TOL)[:-1]+dp(seg[j:],TOL)
    return dp(seg,TOL)
fmt=lambda v: ('%.1f'%v).rstrip('0').rstrip('.').replace('-0','-').replace('-','-') if abs(v)>=0.05 else '0'
def path_of(runs, ox, oy):
    # runs: list of point lists, each from corner to corner (closed loop when only one run without corners: flag)
    d=[]
    for kind,pts in runs:
        if kind=='closed':
            P=[((x+ox)/U,(y+oy)/U) for x,y in pts]
            # a smooth loop: on-curve points are midpoints between controls
            n=len(P); mid=lambda i: ((P[i][0]+P[(i+1)%n][0])/2,(P[i][1]+P[(i+1)%n][1])/2)
            s=mid(n-1); d.append(('M',s)); cur=s
            for i in range(n):
                e=mid(i); d.append(('Q',P[i],e)); cur=e
            d.append(('Z',))
        else:
            # loop of corner-to-corner runs: each run is a clamped quadratic B-spline (ends on the corners)
            first=True
            for seg in pts:
                Q=[((x+ox)/U,(y+oy)/U) for x,y in seg]
                if first: d.append(('M',Q[0])); first=False
                if len(Q)==2: d.append(('L',Q[1])); continue
                ctrl=Q[1:-1]
                for j,c in enumerate(ctrl):
                    e=Q[-1] if j==len(ctrl)-1 else ((c[0]+ctrl[j+1][0])/2,(c[1]+ctrl[j+1][1])/2)
                    d.append(('Q',c,e))
            d.append(('Z',))
    # relative, one decimal
    out=[]; cur=(0,0); start=None; last=None
    for c in d:
        if c[0]=='M':
            p=c[1]; out.append('M%s %s'%(fmt(p[0]),fmt(p[1]))); cur=p; start=p
        elif c[0]=='L':
            p=c[1]; out.append('l%s %s'%(fmt(p[0]-cur[0]),fmt(p[1]-cur[1]))); cur=p
        elif c[0]=='Q':
            a,e=c[1],c[2]; out.append('q%s %s %s %s'%(fmt(a[0]-cur[0]),fmt(a[1]-cur[1]),fmt(e[0]-cur[0]),fmt(e[1]-cur[1]))); cur=e
        else: out.append('z'); cur=start
    s=''.join(out)
    return s.replace(' -','-').replace('q-','q-')
result=[]; stats={}
for name,m in meta.items():
    img=Image.open(f'field-{name}.png').convert('L'); ox,oy=m['box'][0],m['box'][1]
    loops=[l for l in loops_of(img) if abs(area(l))>400]       # drop specks (< 20 x 20 field px)
    runs=[]; npts=0
    for l in loops:
        l=resample(l,1.0); cs=corners_of(l)
        if not cs:
            sm=smooth_closed(l,SM); j=max(range(len(sm)),key=lambda i: math.hypot(sm[i][0]-sm[0][0],sm[i][1]-sm[0][1]))
            pts=dp(sm[:j+1],TOL)[:-1]+dp(sm[j:]+[sm[0]],TOL)[:-1]; runs.append(('closed',pts)); npts+=len(pts)
        else:
            n=len(l); segs=[]
            for j,c in enumerate(cs):
                e=cs[(j+1)%len(cs)]; idx=list(range(c,(e if e>c else e+n)+1)); seg=[l[i%n] for i in idx]
                seg=smooth_open(seg,SM); seg=simplify(seg); segs.append(seg); npts+=len(seg)
            runs.append(('corners',segs))
    d=path_of(runs,ox,oy); result.append([name,m['ch'],d]); stats[name]=(len(loops),npts,len(d))
ABOUT=("Chairtax cover letters traced from the concept tile chairtax-e3 (554 px): each letter's coverage by colour unmixing "
  "(cream, amber, ground), its hidden parts under the concept's bear completed from the fitted Nunito 900 glyph (the h's "
  "ascender top rebuilt on the concept's stem edges), traced at 4x, smoothed along the outline between corners. SVG path "
  "data in 1024 cover units, filled even-odd; ch is the type-mask channel.")
if COVER=='social-hook':
    ABOUT=("Social Hook cover letters traced from the concept tile social-hook-a1 (cut to the cover, 554 px): each part's coverage "
      "as its distance from the local ground towards white, the ground filled in from the pixels around the letters; letters "
      "that touch in the concept stay one outline. Traced at 4x, smoothed along the outline between corners. SVG path data "
      "in 1024 cover units, filled even-odd; ch is the type-mask channel.")
if COVER=='about':
    ABOUT=("About Neil cover letters traced from the concept tile about-b4 (cut to the cover, 554 px): each part's coverage as "
      "its distance from the local paper towards the letter's own gold, the paper filled in from the pixels around the "
      "letters. Traced at 4x, smoothed along the outline between corners. SVG path data in 1024 cover units, filled even-odd; "
      "ch is the type-mask channel.")
s=json.dumps({'about':ABOUT,'letters':[{'name':n,'ch':c,'d':d} for n,c,d in result]},separators=(',',':'))
open(OUT,'w').write(s+'\n')
print(stats, 'total chars', sum(v[2] for v in stats.values()))
