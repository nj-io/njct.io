# python3 geom_disc.py <image> <cx> <cy> <r0> <r1> : a disc's circle (the orbs': cx, cy, r0..r1 as fractions of the width)
# from the strongest edge along rays between r0 and r1, refitted without points more than 2.5 px off
import sys, math
from PIL import Image
import numpy as np
im = np.asarray(Image.open(sys.argv[1]).convert('RGB')).astype(float)
W = im.shape[1]
im = im[:W, :W]
def samp(x, y):
    x0, y0 = int(x), int(y); fx, fy = x - x0, y - y0
    a = im[y0, x0] * (1 - fx) + im[y0, x0 + 1] * fx; b = im[y0 + 1, x0] * (1 - fx) + im[y0 + 1, x0 + 1] * fx
    return a * (1 - fy) + b * fy
R0 = (float(sys.argv[4]), float(sys.argv[5])) if len(sys.argv) > 5 else (0.18, 0.32)
cx, cy = float(sys.argv[2]) * W, float(sys.argv[3]) * W
def fit(cx, cy):
    res = []
    for k in range(360):
        a = math.radians(k + 0.5)
        # skip rays near the quadrant splits and the wedge diagonals
        if min(abs(((k + 0.5) % 45) - 0), abs(((k + 0.5) % 45) - 45)) < 4: continue
        prof = [samp(cx + r * math.cos(a), cy - r * math.sin(a)) for r in np.arange(R0[0] * W, R0[1] * W, 0.25)]
        g = [np.linalg.norm(prof[i + 2] - prof[i - 2]) for i in range(2, len(prof) - 2)]
        i = int(np.argmax(g)); res.append((k, R0[0] * W + (i + 2) * 0.25, g[i]))
    return res
res = fit(cx, cy)
# least-squares circle through the edge points
pts = np.array([(cx + r * math.cos(math.radians(k + 0.5)), cy - r * math.sin(math.radians(k + 0.5))) for k, r, g in res])
A = np.c_[2 * pts[:, 0], 2 * pts[:, 1], np.ones(len(pts))]; b = (pts ** 2).sum(1)
s = np.linalg.lstsq(A, b, rcond=None)[0]; X, Y = s[0], s[1]; R = math.sqrt(s[2] + X * X + Y * Y)
print(f'W {W} circle centre ({X:.2f},{Y:.2f}) = ({X/W:.4f},{Y/W:.4f}) R {R:.2f} = {R/W:.4f}')
for q, (lo, hi) in enumerate([(0, 90), (90, 180), (180, 270), (270, 360)]):
    rr = [math.hypot(px - X, py - Y) for (k, r, g), (px, py) in zip(res, pts) if lo <= k < hi]
    print(f'  quadrant {lo}-{hi} deg (ccw from +x): R {np.median(rr):.2f} = {np.median(rr)/W:.4f}  min {min(rr):.1f} max {max(rr):.1f}  n {len(rr)}')
# robust refit: drop points more than 2.5 px off, refit, and an axis-aligned ellipse
keep = np.ones(len(pts), bool)
for it in range(5):
    P = pts[keep]; A = np.c_[2 * P[:, 0], 2 * P[:, 1], np.ones(len(P))]; b = (P ** 2).sum(1)
    s = np.linalg.lstsq(A, b, rcond=None)[0]; X, Y = s[0], s[1]; R = math.sqrt(s[2] + X * X + Y * Y)
    d = np.abs(np.hypot(pts[:, 0] - X, pts[:, 1] - Y) - R); keep = d < 2.5 * W / 569
print(f'robust: centre ({X/W:.4f},{Y/W:.4f}) R {R/W:.4f} ({R:.1f}px) kept {keep.sum()} rms {np.sqrt((d[keep]**2).mean()):.2f}px')
P = pts[keep]; A = np.c_[P[:, 0] ** 2, P[:, 1] ** 2, P[:, 0], P[:, 1], np.ones(len(P))]
e = np.linalg.lstsq(A, np.zeros(len(P)) - 0 + 0, rcond=None)
# ellipse a x^2 + c y^2 + d x + e y = 1
A2 = np.c_[P[:, 0] ** 2, P[:, 1] ** 2, P[:, 0], P[:, 1]]; s2 = np.linalg.lstsq(A2, np.ones(len(P)), rcond=None)[0]
a_, c_, d_, e_ = s2; x0 = -d_ / (2 * a_); y0 = -e_ / (2 * c_); k = 1 + a_ * x0 * x0 + c_ * y0 * y0
print(f'ellipse: centre ({x0/W:.4f},{y0/W:.4f}) rx {math.sqrt(k/a_)/W:.4f} ry {math.sqrt(k/c_)/W:.4f}')
for q, (lo, hi) in enumerate([(0, 90), (90, 180), (180, 270), (270, 360)]):
    rr = [math.hypot(px - X, py - Y) for (kk, r, g), (px, py), kp in zip(res, pts, keep) if lo <= kk < hi and kp]
    print(f'  q {lo}-{hi}: R {np.median(rr)/W:.4f} n {len(rr)}')
