# python3 geom_specs.py <concept tile> : the orbs' highlight streaks, elliptical Gaussians fitted to the residual peaks
# (concept minus sim.npy from a fit.py run without streaks) inside each orb. Prints params.json's "specs" entries.
import numpy as np, json, math, sys, os
from PIL import Image
from scipy import ndimage as ndi
from scipy.optimize import least_squares
W=574
c=np.asarray(Image.open(sys.argv[1]).convert('RGB'))[:W,:W].astype(float)/255
L=np.where(c<=0.04045,c/12.92,((c+0.055)/1.055)**2.4)
sim=np.load('sim.npy'); P=json.load(open(os.path.join(os.path.dirname(os.path.abspath(__file__)), 'params.json')))
res=(L-sim).mean(-1)
yy,xx=np.mgrid[0:W,0:W]+0.5
out=[]
for (cx,cy,R) in P['orbs']:
    inside=np.hypot(xx-cx,yy-cy)<R-3
    r=np.where(inside,ndi.gaussian_filter(res,1.0),-1)
    pk=(r==ndi.maximum_filter(r,size=9))&(r>0.08)
    ys,xs=np.nonzero(pk)
    for x,y in zip(xs,ys):
        x0,y0=x+0.5,y+0.5
        win=(np.abs(xx-x0)<10)&(np.abs(yy-y0)<10)
        X,Y,Z=xx[win],yy[win],res[win]
        def f(v):
            a,px,py,sx,sy,th,b=v; ct,st=math.cos(th),math.sin(th)
            u=(X-px)*ct+(Y-py)*st; w=-(X-px)*st+(Y-py)*ct
            return a*np.exp(-(u/sx)**2-(w/sy)**2)+b-Z
        best=None
        for th0 in (-0.8,-0.4,0,0.4,0.8):
            rr=least_squares(f,[r[y,x],x0,y0,4,2,th0,0],bounds=([0,x0-5,y0-5,0.8,0.8,-3.2,-0.2],[2,x0+5,y0+5,12,12,3.2,0.2]))
            if best is None or rr.cost<best.cost: best=rr
        a,px,py,sx,sy,th,b=best.x
        print('orb',cx,'peak',x0,y0,'amp %.3f at (%.1f,%.1f) s %.1f %.1f th %.0f deg'%(a,px,py,sx,sy,math.degrees(th)))
        out.append([round(px,2),round(py,2),round(sx,2),round(sy,2),round(math.degrees(th),1)])
print(json.dumps(out))
