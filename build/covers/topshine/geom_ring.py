# python3 geom_ring.py <concept tile> : the glass ring's outer edge, an ellipse fitted to the ridge pixels (white top-hat)
# near a first guess, the star's pixels left out; weights by ridge strength, the band narrowed 10 > 6 > 4 > 3 px.
import numpy as np, math, json, sys, os
from PIL import Image, ImageDraw
from scipy import ndimage as ndi
from scipy.optimize import least_squares
c=np.asarray(Image.open(sys.argv[1]).convert('L'))[:574,:574].astype(float)
th=c-ndi.grey_opening(c,size=(7,7))
P = json.load(open(os.path.join(os.path.dirname(os.path.abspath(__file__)), 'params.json')))
im = Image.new('L', (574 * 4, 574 * 4), 0); pts = []
for P0, P1, P2, P3 in P['star']:
    P0, P1, P2, P3 = map(np.array, (P0, P1, P2, P3))
    pts += [tuple(((1-t)**3*P0 + 3*(1-t)**2*t*P1 + 3*(1-t)*t*t*P2 + t**3*P3) * 4) for t in np.linspace(0, 1, 400, endpoint=False)]
ImageDraw.Draw(im).polygon(pts, fill=255); star = np.asarray(im.resize((574, 574), Image.BOX)) > 127
def edist(P, cx, cy, a, b, ang):
    ca, sa = math.cos(ang), math.sin(ang)
    x = (P[:,0]-cx)*ca + (P[:,1]-cy)*sa; y = -(P[:,0]-cx)*sa + (P[:,1]-cy)*ca
    f = np.sqrt((x/a)**2 + (y/b)**2); g = np.sqrt((x/a/a)**2 + (y/b/b)**2)
    return (f-1)*f/np.maximum(g,1e-6)
v = np.array([272, 318, 253, 30, math.radians(28.4)])
ys, xs = np.nonzero((th > 6) & ~ndi.binary_dilation(star, iterations=3))
P = np.c_[xs, ys].astype(float); W = th[ys, xs]
for band in (10, 6, 4, 3):
    d = edist(P, *v); sel = np.abs(d) < band
    r = least_squares(lambda q: edist(P[sel], *q) * np.sqrt(W[sel]), v); v = r.x
    print(band, sel.sum(), np.round(v[:4], 2), round(math.degrees(v[4]), 2))
print(json.dumps(dict(cx=round(v[0], 2), cy=round(v[1], 2), a=round(v[2], 2), b=round(v[3], 2), ang=round(math.degrees(v[4]), 2))))
im = Image.open(sys.argv[1]).convert('RGB'); k = 2
big = im.resize((574*k, 575*k), Image.LANCZOS); dr = ImageDraw.Draw(big)
t = np.linspace(0, 2*math.pi, 600); a = v[4]
ex = v[0] + v[2]*np.cos(t)*math.cos(a) - v[3]*np.sin(t)*math.sin(a); ey = v[1] + v[2]*np.cos(t)*math.sin(a) + v[3]*np.sin(t)*math.cos(a)
dr.line(list(zip(ex*k, ey*k)), fill=(255, 0, 0), width=1)
big.save('ring-fit.png')
