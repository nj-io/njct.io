"""Find the affine (scale s, offset dx, dy) that maps an H3 frame (480x864) onto the 1024x1536 plate.
The clips were made from the plate cropped to x 80..944 (864x1536), so s is near 1.8 and dx near 80."""
import sys
import numpy as np
from PIL import Image
def g(im, sc=0.25):
    im = im.convert('L'); return np.asarray(im.resize((round(im.width*sc), round(im.height*sc)), Image.BILINEAR), float)
plate = Image.open(sys.argv[1]); frame = Image.open(sys.argv[2])
P = g(plate)                                   # 256x384
best = None
for s in np.arange(1.76, 1.84, 0.004):
    fw, fh = round(480*s*0.25), round(864*s*0.25)
    F = np.asarray(frame.convert('L').resize((fw, fh), Image.BILINEAR), float)
    for dx in range(0, 45):
        for dy in range(-12, 13):
            y0, x0 = dy, dx
            ys, xs = max(0, y0), max(0, x0)
            ye, xe = min(P.shape[0], y0+fh), min(P.shape[1], x0+fw)
            if ye-ys < 300 or xe-xs < 150: continue
            a = P[ys:ye, xs:xe]; b = F[ys-y0:ye-y0, xs-x0:xe-x0]
            e = np.abs(a - b - (a.mean()-b.mean())).mean()
            if best is None or e < best[0]: best = (e, s, dx*4, dy*4)
print('err %.2f scale %.3f dx %d dy %d' % best)
