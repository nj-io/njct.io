"""Line a generated image back up with its base: image models re-frame edits slightly (zoom and shift). For each scale
from 0.85 to 1.25, phase correlation over a region the edit leaves alone gives the shift; the best (scale, shift) is
applied to the generated image so it sits on the base pixel for pixel."""
import numpy as np
from PIL import Image

def _gray(im, w):
    h = round(im.height * w / im.width)
    return np.asarray(im.convert('L').resize((w, h), Image.BILINEAR), float)

def align(gen, base, roi=(0.0, 0.0, 0.38, 1.0), w=256):
    """roi: (x0, y0, x1, y1) fractions of the base where the edit changes nothing. Returns gen warped onto base."""
    B = _gray(base, w); H, W = B.shape
    x0, y0, x1, y1 = int(roi[0]*W), int(roi[1]*H), int(roi[2]*W), int(roi[3]*H)
    win = np.zeros_like(B); win[y0:y1, x0:x1] = 1
    best = None
    for s in np.arange(0.85, 1.251, 0.005):
        # gen scaled by 1/s about the centre, so content zoomed in by s returns to base size
        G = _gray(gen, w)
        g = Image.fromarray(G).transform((W, H), Image.AFFINE, (s, 0, W/2*(1-s), 0, s, H/2*(1-s)), Image.BILINEAR)
        G2 = np.asarray(g)
        a = (B - B[win > 0].mean()) * win; b = (G2 - G2[win > 0].mean()) * win
        F = np.fft.fft2(a) * np.conj(np.fft.fft2(b)); F /= np.abs(F) + 1e-9
        r = np.real(np.fft.ifft2(F)); iy, ix = np.unravel_index(r.argmax(), r.shape)
        dy = iy if iy < H/2 else iy - H; dx = ix if ix < W/2 else ix - W
        g3 = np.roll(np.roll(G2, dy, 0), dx, 1)
        err = np.abs((g3 - B))[y0:y1, x0:x1].mean()
        if best is None or err < best[0]: best = (err, s, dx, dy)
    err, s, dx, dy = best
    k = base.width / W
    S, TX, TY = s, base.width/2*(1-s) - dx*k*s, base.height/2*(1-s) - dy*k*s
    out = gen.convert('RGB').resize(base.size).transform(base.size, Image.AFFINE, (S, 0, TX, 0, S, TY), Image.BICUBIC)
    return out, dict(scale=round(float(s), 3), dx=int(dx*k), dy=int(dy*k), err=round(float(err), 2))
