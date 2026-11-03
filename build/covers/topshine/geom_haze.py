# python3 geom_haze.py : the haze ring behind the star, an ellipse through ridge points of its two arcs (difference of
# Gaussians, sigma 2 and 10, on the concept's luminance: the local maxima at x = 105..225 every 10 px on the upper-left
# arc and y = 220..340 every 10 px on the right one). Prints params.json's "haze".
import numpy as np, math, json
from scipy.optimize import least_squares
Lp = [(105, 190), (115, 181), (125, 172), (135, 166), (145, 160), (155, 154), (165, 148), (175, 144), (185, 141), (195, 137), (205, 136), (215, 135), (225, 131)]
Rp = [(497, 220), (505, 230), (514, 240), (510, 260), (527, 270), (524, 280), (514, 290), (514, 300), (510, 310), (500, 320), (485, 330), (468, 340)]
pts = np.array(Lp + Rp, float)
def ed(v, P):
    cx, cy, a, b, ang = v; ca, sa = math.cos(ang), math.sin(ang)
    x = (P[:, 0] - cx) * ca + (P[:, 1] - cy) * sa; y = -(P[:, 0] - cx) * sa + (P[:, 1] - cy) * ca
    f = np.sqrt((x / a) ** 2 + (y / b) ** 2); g = np.sqrt((x / a / a) ** 2 + (y / b / b) ** 2); return (f - 1) * f / g
r = least_squares(lambda v: ed(v, pts), [316, 252, 208, 125, 0.0]); v = r.x
print(json.dumps(dict(cx=v[0], cy=v[1], a=v[2], b=v[3], ang=math.degrees(v[4]))), 'rms', round(float(np.sqrt((r.fun ** 2).mean())), 2))
