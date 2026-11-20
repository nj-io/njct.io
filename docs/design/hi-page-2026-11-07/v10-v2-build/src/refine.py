import sys, numpy as np
from PIL import Image
plate = Image.open(sys.argv[1]).convert('L'); frame = Image.open(sys.argv[2]).convert('L')
sc = 0.5
P = np.asarray(plate.resize((512, 768), Image.BILINEAR), float)
best = None
for s in np.arange(1.770, 1.7905, 0.002):
    fw, fh = round(480*s*sc), round(864*s*sc)
    F = np.asarray(frame.resize((fw, fh), Image.BILINEAR), float)
    for dx in range(36, 50):
        for dy in range(-6, 7):
            ys, xs = max(0, dy), max(0, dx); ye, xe = min(768, dy+fh), min(512, dx+fw)
            a = P[ys:ye, xs:xe]; b = F[ys-dy:ye-dy, xs-dx:xe-dx]
            e = np.abs(a - b - (a.mean()-b.mean())).mean()
            if best is None or e < best[0]: best = (e, s, dx/sc, dy/sc)
print('err %.2f scale %.3f dx %.0f dy %.0f' % best)
