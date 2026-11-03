# Mean and 95th-percentile CIE76 dE between two screenshots, optionally only where a third (the bare wall)
# is within `tol` grey levels of the second (the wall region: no shelf, no shelf shadow).
import sys, math
from PIL import Image
def lab(c):
    def f(u):
        u /= 255; u = u / 12.92 if u <= 0.04045 else ((u + 0.055) / 1.055) ** 2.4; return u
    r, g, b = (f(v) for v in c)
    X = (0.4124 * r + 0.3576 * g + 0.1805 * b) / 0.95047; Y = 0.2126 * r + 0.7152 * g + 0.0722 * b; Z = (0.0193 * r + 0.1192 * g + 0.9505 * b) / 1.08883
    g3 = lambda t: t ** (1 / 3) if t > 0.008856 else 7.787 * t + 16 / 116
    fx, fy, fz = g3(X), g3(Y), g3(Z)
    return 116 * fy - 16, 500 * (fx - fy), 200 * (fy - fz)
a = Image.open(sys.argv[1]).convert('RGB'); b = Image.open(sys.argv[2]).convert('RGB')
bare = Image.open(sys.argv[3]).convert('RGB') if len(sys.argv) > 3 else None
tol = float(sys.argv[4]) if len(sys.argv) > 4 else 2
W, H = a.size; pa, pb = a.load(), b.load(); pc = bare.load() if bare else None
ds = []; cache = {}
L = lambda c: cache.setdefault(c, lab(c))
for y in range(0, H, 2):
    for x in range(0, W, 2):
        if pc and abs(pc[x, y][0] - pb[x, y][0]) > tol: continue
        la, lb = L(pa[x, y]), L(pb[x, y])
        ds.append(math.dist(la, lb))
ds.sort()
print(f'pixels {len(ds)} ({100 * len(ds) / ((W // 2) * (H // 2)):.0f}% of frame)  mean dE {sum(ds) / len(ds):.2f}  p95 {ds[int(0.95 * len(ds))]:.2f}  max {ds[-1]:.2f}')
