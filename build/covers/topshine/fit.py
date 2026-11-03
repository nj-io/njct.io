# python3 fit.py <concept tile> : fits Topshine's colour model to its concept and writes fields.json (and sim.png, sim.npy)
# into the current directory. Every block is a uniform cubic B-spline (bsfit) in linear light, fitted by least squares:
#   the room: a base field, the ring's lines, fill and inner band, the mark's halo, the haze ring's two bands
#   the star: a base field, its rim line, rim zone, body (fading where the arms thin), each arm's spine, and the crease
#             lines (superellipse levels through the tips) per quadrant
#   the orbs: a base field, two limb lines and the highlight streaks
# The features are the ones the shader computes (MOTIFS.topshine). Geometry and sizes come from params.json beside this.
import numpy as np, math, json, sys, os
from PIL import Image, ImageDraw
from scipy import ndimage as ndi
from scipy.sparse import hstack, vstack, diags, identity
from scipy.sparse.linalg import lsqr
HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, HERE)
from bsfit import design, smooth
W = 574
c = np.asarray(Image.open(sys.argv[1]).convert('RGB'))[:W, :W].astype(float) / 255   # 574 x 575: the last row dropped
L = np.where(c <= 0.04045, c / 12.92, ((c + 0.055) / 1.055) ** 2.4)
P = json.load(open(os.path.join(HERE, 'params.json')))
yy, xx = np.mgrid[0:W, 0:W] + 0.5
# ---- features ----
# star outline: supersampled polygon of the Bezier path, coverage and signed distance (px, negative inside)
segs = P['star']
def starpoly(k):
    pts = []
    for P0, P1, P2, P3 in segs:
        P0, P1, P2, P3 = map(np.array, (P0, P1, P2, P3))
        for t in np.linspace(0, 1, 400, endpoint=False): pts.append(tuple(((1-t)**3*P0 + 3*(1-t)**2*t*P1 + 3*(1-t)*t*t*P2 + t**3*P3) * k))
    return pts
K = 4
im = Image.new('L', (W * K, W * K), 0); ImageDraw.Draw(im).polygon(starpoly(K), fill=255)
hm = np.asarray(im) > 127
dist_hi = (ndi.distance_transform_edt(~hm) - ndi.distance_transform_edt(hm)) / K
dS = ndi.zoom(dist_hi, 1 / K, order=1)   # approx at pixel centres
covS = np.asarray(im.resize((W, W), Image.BOX)).astype(float) / 255
# superellipse radial coordinate per quadrant around the star centre
O = P['O']; A = P['A']; B = P['B']
def rho(q):
    x = xx - O[0]; y = yy - O[1]
    a = np.where(x > 0, A[0], A[1]); b = np.where(y < 0, B[0], B[1])
    g = (np.abs(x) / a) ** q + (np.abs(y) / b) ** q
    r = np.hypot(x, y)
    return r * (1 - g ** (-1 / q))           # radial px from the level curve: negative inside
# crease lines fade out where the arm is thin (within 2..6 px of the outline), so they never stack along a tip's axis
def sstep(a, b, x): t = np.clip((x - a) / (b - a), 0, 1); return t * t * (3 - 2 * t)
star_lines = {q: np.exp(-(rho(q) / 1.3) ** 2) for q in P['qlines']}
body = 1 / (1 + np.exp(rho(P['qbody']) / 1.5))                  # 1 inside the body level
rimline = np.exp(-((dS + 1.0) / 0.9) ** 2)
thin = sstep(2.0, 6.0, -dS)
# each crease level per quadrant (upper right, upper left, lower left, lower right), blended over a px at the axes
qx, qy = xx - O[0], yy - O[1]
sg = lambda t: 1 / (1 + np.exp(-t / 0.7))
QUADS = [sg(qx) * sg(-qy), sg(-qx) * sg(-qy), sg(-qx) * sg(qy), sg(qx) * sg(qy)]
# the body hugs each arm's axis near its tip: it fades out where the arm is thin
deep = sstep(6.0, 20.0, -dS)
star_lines = {q: v * thin for q, v in star_lines.items()}
body = body * deep
# each arm's spine: a line along its axis, from its tip to near the centre
spine = np.exp(-(np.minimum(np.abs(qx), np.abs(qy)) / 1.0) ** 2) * thin * sstep(40.0, 70.0, np.hypot(qx, qy))
rimzone = np.exp(np.minimum(dS, 0) / 6.0)
# orbs
def orb(cx, cy, R):
    dd = np.hypot(xx - cx, yy - cy) - R
    return np.clip(0.5 - dd, 0, 1), dd
orbs = [orb(*o) for o in P['orbs']]
# ring: ellipse distance (px), front = lower half in the ellipse frame
r = P['ring']
ca, sa = math.cos(math.radians(r['ang'])), math.sin(math.radians(r['ang']))
u = (xx - r['cx']) * ca + (yy - r['cy']) * sa; v = -(xx - r['cx']) * sa + (yy - r['cy']) * ca
f = np.sqrt((u / r['a']) ** 2 + (v / r['b']) ** 2); g = np.sqrt((u / r['a'] ** 2) ** 2 + (v / r['b'] ** 2) ** 2)
rd = (f - 1) * f / np.maximum(g, 1e-6)
front = 1 / (1 + np.exp(-v / 2.0))
ring_lines = {o: np.exp(-((rd - o) / 1.0) ** 2) for o in P['rlines']}
ring_fill = 1 / (1 + np.exp(rd / 0.8)) * 1 / (1 + np.exp(-(rd + P['rwidth']) / 0.8))
ring_wide = 1 / (1 + np.exp((rd + P['rwidth']) / 1.5)) * 1 / (1 + np.exp(-(rd + P['rwide']) / 1.5))
# the haze ring behind the star: a soft bright band on an ellipse and a darker one just inside it
hz = P['haze']
ch_, sh_ = math.cos(math.radians(hz['ang'])), math.sin(math.radians(hz['ang']))
hu = (xx - hz['cx']) * ch_ + (yy - hz['cy']) * sh_; hv = -(xx - hz['cx']) * sh_ + (yy - hz['cy']) * ch_
hf = np.sqrt((hu / hz['a']) ** 2 + (hv / hz['b']) ** 2); hg = np.sqrt((hu / hz['a'] ** 2) ** 2 + (hv / hz['b'] ** 2) ** 2)
hd = (hf - 1) * hf / np.maximum(hg, 1e-6)
haze_lines = [np.exp(-((hd - o) / P['hazew']) ** 2) for o in P['hazeo']]
# the brand mark (drawn by the overlay): its halo, from the mark's shape (a superellipse star and two dots)
MK = P['mark']   # [cx, cy, A, B, q, dot0 x, y, r, dot1 x, y, r] in concept px
def mark_dist():
    x = xx - MK[0]; y = yy - MK[1]
    g = np.maximum((np.abs(x) / MK[2]) ** MK[4] + (np.abs(y) / MK[3]) ** MK[4], 1e-9)
    ds = np.hypot(x, y) * (1 - g ** (-1 / MK[4]))
    d0 = np.hypot(xx - MK[5], yy - MK[6]) - MK[7]; d1 = np.hypot(xx - MK[8], yy - MK[9]) - MK[10]
    return np.minimum(ds, np.minimum(d0, d1))
halo = np.exp(-np.maximum(mark_dist(), 0) / P['halo'])
# ---- regions ----
a8 = c.max(-1); s8 = (a8 - c.min(-1)) / np.maximum(a8, 1e-6)
markpix = np.zeros((W, W), bool); markpix[15:110, 15:110] = (s8 > 0.3)[15:110, 15:110]
# the letters (dark, below 430 px) and the mark: drawn by the type and the overlay, left out of the fit
letters = (c.max(-1) < 0.36); letters[:430] = False; letters = ndi.binary_dilation(letters, iterations=3)
excl = letters | ndi.binary_dilation(markpix, iterations=1)
covO = [o[0] for o in orbs]
partcov = np.clip(covS + covO[0] + covO[1], 0, 1)
def solve(blocks, pix, target, lam=0.02, ridge=0.0):
    ys, xs = pix
    cols = []; regs = []; offs = [0]
    for (box, n, feat, kind) in blocks:
        A_ = design((xs + 0.5) / W, (ys + 0.5) / W, box[0], box[1], box[2], n)
        if feat is not None: A_ = diags(feat[ys, xs]) @ A_
        cols.append(A_)
        S = smooth(n, lam * math.sqrt(len(xs) / (n * n)) * (3 if kind == 'amp' else 1))
        R = S
        if kind == 'amp' and ridge: R = vstack([S, identity(n * n) * ridge * math.sqrt(len(xs) / (n * n))])
        regs.append(R); offs.append(offs[-1] + n * n)
    Aall = hstack(cols).tocsr()
    from scipy.sparse import block_diag
    Rall = block_diag(regs).tocsr()
    # controls the region barely touches are left out of the fit (fixed at 0, filled for storage later)
    sup = np.asarray(abs(Aall).sum(0)).ravel(); keep = sup > 0.5
    M = vstack([Aall[:, keep], Rall[:, keep]]).tocsr()
    C = np.zeros((offs[-1], 3))
    for ch in range(3):
        b = np.r_[target[ys, xs, ch], np.zeros(Rall.shape[0])]
        C[keep, ch] = lsqr(M, b, atol=1e-9, btol=1e-9, iter_lim=6000)[0]
    global KEEP; KEEP = [keep[offs[i]:offs[i + 1]] for i in range(len(blocks))]
    return [C[offs[i]:offs[i + 1]] for i in range(len(blocks))]
def render(blocks, Cs):
    out = np.zeros((W, W, 3))
    for (box, n, feat, kind), C in zip(blocks, Cs):
        A_ = design((xx.ravel()) / W, (yy.ravel()) / W, box[0], box[1], box[2], n)
        F = (A_ @ C).reshape(W, W, 3)
        out += F * (feat[..., None] if feat is not None else 1)
    return out
full = [0, 0, 1]
ground_blocks = [(full, P['groundn'], None, 'base')] + [(full, P['ringn'], ring_lines[o], 'amp') for o in P['rlines']] + [(full, P['ringn'], ring_fill, 'amp'), (full, P['ringn'], ring_wide, 'amp'), (P['markbox'], 6, halo, 'amp')] + [(full, P['hazen'], hl, 'amp') for hl in haze_lines]
selA = (partcov < 0.01) & ~ndi.binary_dilation(excl, iterations=1)
CA = solve(ground_blocks, np.nonzero(selA), L, ridge=0.01); KA = KEEP
ground = render(ground_blocks, CA)
NRING = len(P['rlines']) + 2
ring_only = render(ground_blocks[1:1 + NRING], CA[1:1 + NRING])
sb = P['starbox']
star_blocks = [(sb, P['starn'], None, 'base'), (sb, P['rimn'], rimline, 'amp'), (sb, P['rimn'], rimzone, 'amp'), (sb, P['rimn'], body, 'amp'), (sb, P['creasen'], spine, 'amp')] + [(sb, P['creasen'], star_lines[q] * QUADS[j], 'amp') for q in P['qlines'] for j in range(4)]
selB = (covS > 0.99)
targetB = L - ring_only * front[..., None]
CB = solve(star_blocks, np.nonzero(selB), targetB, ridge=0.01); KB = KEEP
star = render(star_blocks, CB) + ring_only * front[..., None]
orb_blocks = []; CO = []; orb_img = []; KO = []
for k, (cx, cy, R) in enumerate(P['orbs']):
    ob = [cx / W - 1.15 * R / W, cy / W - 1.15 * R / W, 2.3 * R / W]
    dd = orbs[k][1]
    spec = np.zeros((W, W))
    for px, py, sx, sy, th in P['specs'][k]:
        ct, st = math.cos(math.radians(th)), math.sin(math.radians(th))
        uu = (xx - px) * ct + (yy - py) * st; ww = -(xx - px) * st + (yy - py) * ct
        spec += np.exp(-(uu / sx) ** 2 - (ww / sy) ** 2)
    bl = [(ob, P['orbn'], None, 'base'), (ob, 8, np.exp(-((dd + 1.0) / 1.0) ** 2), 'amp'), (ob, 8, np.exp(-((dd + 3.5) / 1.5) ** 2), 'amp'), (ob, 4, spec, 'base')]
    sel = covO[k] > 0.99
    Ck = solve(bl, np.nonzero(sel), L, ridge=0.01); KO.append(KEEP)
    orb_blocks.append(bl); CO.append(Ck); orb_img.append(render(bl, Ck))
import codec
allb = [(b, n, k) for b, n, _, k in ground_blocks] + [(b, n, k) for b, n, _, k in star_blocks] + [(b, n, k) for bl in orb_blocks for b, n, _, k in bl]
meta, data, dec = codec.encode(allb, CA + CB + [c_ for Ck in CO for c_ in Ck], KA + KB + [k_ for Kk in KO for k_ in Kk], P['steps'])
na, nb = len(CA), len(CB)
CA, CB = dec[:na], dec[na:na + nb]
o_ = na + nb; CO = []
for bl in orb_blocks: CO.append(dec[o_:o_ + len(bl)]); o_ += len(bl)
ground = render(ground_blocks, CA); NRING = len(P['rlines']) + 2
ring_only = render(ground_blocks[1:1 + NRING], CA[1:1 + NRING])
star = render(star_blocks, CB) + ring_only * front[..., None]
orb_img = [render(bl, Ck) for bl, Ck in zip(orb_blocks, CO)]
json.dump(dict(boxes=meta[0], blocks=meta[1], data=data, chroma=P['steps']['chroma']), open('fields.json', 'w'))
import gzip; print('fields: chars', len(data), 'gzip', len(gzip.compress((json.dumps(meta) + data).encode(), 6)))
comp = ground * (1 - partcov[..., None]) + star * covS[..., None] + orb_img[0] * covO[0][..., None] + orb_img[1] * covO[1][..., None]
comp = np.where(excl[..., None], L, comp)   # letters and mark: the concept's own pixels stand in for the type and overlay
np.save('sim.npy', comp)
def lab(a):
    r_, g_, b_ = a[..., 0], a[..., 1], a[..., 2]
    X = 0.4124 * r_ + 0.3576 * g_ + 0.1805 * b_; Y = 0.2126 * r_ + 0.7152 * g_ + 0.0722 * b_; Z = 0.0193 * r_ + 0.1192 * g_ + 0.9505 * b_
    fn = lambda t: np.where(t > 0.008856, np.cbrt(np.maximum(t, 0)), 7.787 * t + 16 / 116)
    fx, fy, fz = fn(X / 0.9505), fn(Y), fn(Z / 1.089)
    return np.stack([116 * fy - 16, 500 * (fx - fy), 200 * (fy - fz)], -1)
def d128(a): return np.stack([np.asarray(Image.fromarray(a[..., k].astype(np.float32), 'F').resize((128, 128), Image.BOX)) for k in range(3)], -1)
dE = np.linalg.norm(lab(d128(np.clip(comp, 0, 1))) - lab(d128(L)), axis=-1)
print('sim mean dE', dE.mean().round(2), '3x3', [[round(float(dE[j*42:j*42+42, i*42:i*42+42].mean()), 1) for i in range(3)] for j in range(3)])
for nm, mk in [('star', covS > 0.5), ('orbs', (covO[0] + covO[1]) > 0.5), ('ground', partcov < 0.5)]:
    v = np.asarray(Image.fromarray((mk * 255).astype(np.uint8)).convert('F').resize((128, 128), Image.BOX)) > 127
    print('  ', nm, 'cells', v.sum(), 'mean', dE[v].mean().round(2), 'p95', np.percentile(dE[v], 95).round(2))
o = np.clip(comp, 0, 1); o = np.where(o <= 0.0031308, o * 12.92, 1.055 * o ** (1 / 2.4) - 0.055)
Image.fromarray((o * 255).round().astype(np.uint8)).save('sim.png')
