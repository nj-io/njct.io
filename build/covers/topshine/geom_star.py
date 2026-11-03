# python3 geom_star.py <concept tile> : the star's outline, per quadrant a cubic Bezier between two tips (read off the
# concept), its controls fitted by least squares to edge points picked by eye on 5x crops. Prints params.json's "star";
# writes star-fit.png (the outline over the concept).
import sys
import numpy as np, json
from scipy.optimize import least_squares
from PIL import Image, ImageDraw
T = {'top': (295.5, 61.5), 'right': (471.5, 252), 'bottom': (296, 440.5), 'left': (120, 251.5)}
Q = {
 ('top', 'right'): [(307,100),(330,150),(344,180),(356,200),(384,220),(414,235),(440,245)],
 ('right', 'bottom'): [(402,277),(380,291),(360,305),(344,325),(330,345),(318,365),(310,385),(304,405),(300,425)],
 ('bottom', 'left'): [(287,405),(275,369),(255,335),(235,311),(195,271),(175,265),(155,257)],
 ('left', 'top'): [(150,244),(170,236),(180,231),(200,223),(230,205),(250,183),(260,170),(270,149),(280,115),(290,75)],
}
def bez(P0, P1, P2, P3, t):
    t = t[:, None]; return (1-t)**3*P0 + 3*(1-t)**2*t*P1 + 3*(1-t)*t*t*P2 + t**3*P3
segs = []
for (a, b), pts in Q.items():
    P0, P3 = np.array(T[a]), np.array(T[b]); pts = np.array(pts, float)
    ts = np.linspace(0, 1, 400)
    def res(v):
        P1, P2 = v[:2], v[2:]
        c = bez(P0, P1, P2, P3, ts)
        d = np.sqrt(((pts[:, None, :] - c[None]) ** 2).sum(-1)).min(1)
        return d
    # start: the logo's shape (controls near the tips' axis lines)
    corner = np.array([P0[0], P3[1]]) if a in ('top', 'bottom') else np.array([P3[0], P0[1]])
    v0 = np.r_[P0 + 0.5 * (corner - P0), P3 + 0.5 * (corner - P3)]
    r = least_squares(res, v0)
    print(a, b, 'rms %.2f max %.2f' % (np.sqrt((r.fun ** 2).mean()), r.fun.max()), np.round(r.x, 1))
    segs.append((P0, r.x[:2], r.x[2:], P3))
print(json.dumps([[[round(float(v), 3) for v in p] for p in seg] for seg in segs]))
# draw overlay on the concept
c = Image.open(sys.argv[1]).convert('RGB')
k = 3; big = c.resize((574 * k, 575 * k), Image.LANCZOS); d = ImageDraw.Draw(big)
for P0, P1, P2, P3 in segs:
    pts = bez(P0, np.array(P1), np.array(P2), P3, np.linspace(0, 1, 200)) * k
    d.line([tuple(p) for p in pts], fill=(255, 0, 0), width=1)
for pts in Q.values():
    for x, y in pts: d.ellipse((x*k-3, y*k-3, x*k+3, y*k+3), outline=(0, 160, 0))
big.crop((300, 150, 1450, 1360)).save('star-fit.png')
