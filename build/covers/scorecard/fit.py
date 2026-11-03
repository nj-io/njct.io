# python3 fit.py <tile> [fit.json] : Scorecard's front, fitted to its concept tile -> fit.json and sim.png in the cwd.
# The tile (a photo of the sleeve) is cut to the cover's box and resampled to 566 px. Geometry (the two splits, three
# field diagonals, the disc as a slight ellipse, its wedge line, the edge width and a dark seam where regions meet) is
# fitted by least squares on linear-light pixels outside the letters, weighted by dL*/dY; each step re-solves every
# region's colour as a cubic in x, y (variable projection). A given fit.json starts from its geometry.
import sys, json, math
import numpy as np
from PIL import Image
from scipy import ndimage as ndi
from scipy.optimize import least_squares
W = 566
BOX = (3, 1, 568, 562)   # the cover inside the photo (build/covers/letters/comps.py's TILE_BOX)
C8 = np.asarray(Image.open(sys.argv[1]).convert('RGB').transform((W, W), Image.EXTENT, BOX, Image.BICUBIC)).astype(float) / 255
LIN = np.where(C8 <= 0.04045, C8 / 12.92, ((C8 + 0.055) / 1.055) ** 2.4)
# the letters: white ink in the title band
mx, mn = C8.max(-1), C8.min(-1); sat_ = np.where(mx > 0, (mx - mn) / np.maximum(mx, 1e-6), 0)
let = ndi.median_filter((mx > 0.75) & (sat_ < 0.32) & (np.arange(W)[:, None] < 140), 3)
excl = ndi.binary_dilation(let, np.ones((3, 3), bool), 4)
def at(k):
    n = W // k
    im = np.stack([np.asarray(Image.fromarray(LIN[:n * k, :n * k, c].astype(np.float32), 'F').resize((n, n), Image.BOX)) for c in range(3)], -1)
    ex = np.asarray(Image.fromarray(excl[:n * k, :n * k].astype(np.float32), 'F').resize((n, n), Image.BOX)) > 0.01
    yy, xx = (np.mgrid[0:n, 0:n] + 0.5) * k   # concept px
    return im, ex, xx, yy, k
NAMES = ['navy', 'triTL', 'blueTR', 'green', 'dgreen', 'yellow', 'navyBR', 'red', 'qtrA', 'qtrB', 'qbr', 'white', 'qyel']
DEG = 3
def mono(xx, yy, deg):
    x = (xx - 283) / 283; y = (yy - 283) / 283
    return [x ** i * y ** j for i in range(deg + 1) for j in range(deg + 1 - i)]
def cov(d, bl):   # d in px, positive = inside
    return np.clip(0.5 + d / bl, 0, 1)
def line(xx, yy, rho, th):   # signed px distance to n.p = rho
    return xx * math.cos(th) + yy * math.sin(th) - rho
def weights(g, xx, yy):
    vx, hy, dcx, dcy, R, r1, t1, r2, t2, r3, t3, ra, ta, rb, tb, bl, vx2, hy2, Ry, tilt, sa = g[:21]
    L = cov(vx - xx, bl); T = cov(hy - yy, bl)
    L2 = cov(vx2 - xx, bl); T2 = cov(hy2 - yy, bl)
    tri = cov(-line(xx, yy, r1, t1), bl)      # side of (0, hy)
    dg = cov(line(xx, yy, r2, t2), bl)        # side of (vx, 566)
    nb = cov(line(xx, yy, r3, t3), bl)        # side of (566, 566)
    ct, st = math.cos(tilt), math.sin(tilt); ex_ = (xx - dcx) * ct + (yy - dcy) * st; ey_ = -(xx - dcx) * st + (yy - dcy) * ct
    rr = np.hypot(ex_ / R, ey_ / Ry); gg = np.hypot(ex_ / R ** 2, ey_ / Ry ** 2) + 1e-9
    D = cov(-(rr - 1) * rr / gg, bl)
    # the disc's wedges: lines of their own (A: the TR quarter's upper part; B: the BL quarter's white part)
    A = cov(line(xx, yy, ra, ta), bl); B = cov(line(xx, yy, rb, tb), bl)
    w = {}
    w['navy'] = T * L * (1 - tri) * (1 - D); w['triTL'] = T * L * tri * (1 - D)
    w['blueTR'] = T * (1 - L) * (1 - D)
    w['green'] = (1 - T) * L * (1 - dg) * (1 - D); w['dgreen'] = (1 - T) * L * dg * (1 - D)
    w['yellow'] = (1 - T) * (1 - L) * (1 - nb) * (1 - D); w['navyBR'] = (1 - T) * (1 - L) * nb * (1 - D)
    w['red'] = T2 * L2 * D; w['qtrA'] = T2 * (1 - L2) * D * A; w['qtrB'] = T2 * (1 - L2) * D * (1 - A)
    w['qbr'] = (1 - T2) * (1 - L2) * D
    w['white'] = (1 - T2) * L2 * D * B; w['qyel'] = (1 - T2) * L2 * D * (1 - B)
    ws = [w[n] for n in NAMES]
    # a dark seam where regions meet: 1 - sum w^2 is 0 inside a region and 0.5 on a two-region edge
    seam = 1 - sa * 2 * (1 - sum(x * x for x in ws))
    return [x * seam for x in ws]
def solve(g, data, deg=DEG, ret=False):
    im, ex, xx, yy, k = data
    ws = weights(g, xx, yy); M = mono(xx, yy, deg)
    keep = ~ex
    Y = im @ np.array([0.2126, 0.7152, 0.0722]); pw = ((Y + 0.01) ** (-2 / 3))[keep]; pw /= pw.mean()   # dL*/dY
    sw = np.sqrt(pw)
    cols = [(wr * m)[keep] * sw for wr in ws for m in M]
    A = np.stack(cols, 1)
    lam = 1e-4
    out = np.zeros(im.shape); coefs = []
    AtA = A.T @ A + lam * np.eye(A.shape[1])
    for c in range(3):
        b = im[..., c][keep] * sw; x = np.linalg.solve(AtA, A.T @ b); coefs.append(x)
    coefs = np.array(coefs).T   # (regions*mono, 3)
    full = np.stack([(wr * m) for wr in ws for m in M], -1) @ coefs
    if ret: return full, coefs, keep
    return ((full - im)[keep] * sw[:, None]).ravel()
def ln(p0, p1, inside):
    (x0, y0), (x1, y1) = p0, p1
    th = math.atan2(x1 - x0, -(y1 - y0)); rho = x0 * math.cos(th) + y0 * math.sin(th)
    if (inside[0] * math.cos(th) + inside[1] * math.sin(th) - rho) < 0: th += math.pi; rho = -rho
    return rho, th
if __name__ == '__main__':
    r1, t1 = ln((0, 155), (130, 287), (0, 400)); t1v = (r1, t1)
    # tri uses -line: inside = side of (0, hy) negative; build so that (0, 287) is negative
    r1, t1 = ln((0, 155), (130, 287), (300, 0))
    r2, t2 = ln((160, 390), (0, 550), (275, 566))
    r3, t3 = ln((566, 360), (355, 566), (566, 566))
    ra, ta = ln((287, 289), (390, 200), (330, 150))        # qtrA: upper side
    rb, tb = ln((275, 301), (180, 390), (150, 300))        # white: upper-left side
    g0 = [275, 287, 277, 285, 148, r1, t1, r2, t2, r3, t3, ra, ta, rb, tb, 1.5, 275, 287, 148, 0.0, 0.2]
    if len(sys.argv) > 2: g0 = json.load(open(sys.argv[2]))['g']
    for k, it in ((4, 60), (2, 60), (1, 30)):
        data = at(k)
        res = least_squares(solve, g0, args=(data,), diff_step=1e-4, max_nfev=it * 14, x_scale='jac')
        g0 = list(res.x); print('k', k, 'rms', float(np.sqrt((res.fun ** 2).mean())), flush=True)
    full, coefs, keep = solve(g0, at(1), ret=True)
    json.dump(dict(g=g0, deg=DEG, names=NAMES, coefs=coefs.tolist()), open('fit.json', 'w'))
    g = g0; print('vx %.2f hy %.2f disc (%.2f, %.2f) R %.2f Ry %.2f tilt %.2f  blur %.2f  disc splits %.2f %.2f' % (g[0], g[1], g[2], g[3], g[4], g[18], math.degrees(g[19]), g[15], g[16], g[17]))
    for nm, (r, t) in [('L1', g[5:7]), ('L2', g[7:9]), ('L3', g[9:11]), ('A', g[11:13]), ('B', g[13:15])]:
        print(nm, 'rho %.2f theta %.3f deg' % (r, math.degrees(t)))
    o = np.clip(full, 0, 1); o = np.where(o <= 0.0031308, o * 12.92, 1.055 * o ** (1 / 2.4) - 0.055)
    o8 = (o * 255).round().astype(np.uint8); o8[excl] = (C8[excl] * 255).astype(np.uint8)
    Image.fromarray(o8).save('sim.png')
