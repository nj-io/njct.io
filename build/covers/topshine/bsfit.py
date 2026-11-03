# least-squares uniform cubic B-spline colour grid over a region, fitted to the concept (linear light) where weight > 0
import numpy as np
from scipy.sparse import coo_matrix, vstack, diags
from scipy.sparse.linalg import lsqr
def basis(u):
    # u in grid units (knot spacing 1); returns index of first of 4 controls and their weights
    i = np.floor(u).astype(int); t = u - i
    w = np.stack([(1 - t) ** 3 / 6, (3 * t ** 3 - 6 * t ** 2 + 4) / 6, (-3 * t ** 3 + 3 * t ** 2 + 3 * t + 1) / 6, t ** 3 / 6], -1)
    return i - 1, w
def design(xs, ys, x0, y0, size, n):
    # controls: n x n over [x0, x0+size]^2 with one control beyond each edge: grid spacing size / (n - 3)
    h = size / (n - 3)
    ix, wx = basis((xs - x0) / h + 1); iy, wy = basis((ys - y0) / h + 1)
    rows, cols, vals = [], [], []
    for a in range(4):
        for b in range(4):
            cx = np.clip(ix + 1 + a - 1, 0, n - 1); cy = np.clip(iy + 1 + b - 1, 0, n - 1)
            rows.append(np.arange(len(xs))); cols.append(cy * n + cx); vals.append(wx[:, a] * wy[:, b])
    return coo_matrix((np.concatenate(vals), (np.concatenate(rows), np.concatenate(cols))), shape=(len(xs), n * n)).tocsr()
def smooth(n, lam):
    # second differences in x and y
    R = []
    for k in range(n):
        for j in range(1, n - 1):
            R.append({(k * n + j - 1): 1, (k * n + j): -2, (k * n + j + 1): 1}); R.append({((j - 1) * n + k): 1, (j * n + k): -2, ((j + 1) * n + k): 1})
    rows, cols, vals = [], [], []
    for r, d in enumerate(R):
        for cc, v in d.items(): rows.append(r); cols.append(cc); vals.append(v * lam)
    return coo_matrix((vals, (rows, cols)), shape=(len(R), n * n)).tocsr()
def fit(img_lin, wmask, x0, y0, size, n, lam=0.02, W=574):
    ys, xs = np.nonzero(wmask > 0)
    w = wmask[ys, xs]
    A = design((xs + 0.5) / W, (ys + 0.5) / W, x0, y0, size, n)
    Aw = diags(np.sqrt(w)) @ A
    S = smooth(n, lam * np.sqrt(len(xs) / (n * n)))
    M = vstack([Aw, S]).tocsr()
    C = np.zeros((n * n, 3))
    for ch in range(3):
        b = np.r_[img_lin[ys, xs, ch] * np.sqrt(w), np.zeros(S.shape[0])]
        C[:, ch] = lsqr(M, b, atol=1e-8, btol=1e-8, iter_lim=4000)[0]
    return C
def evaluate(C, n, x0, y0, size, W=574):
    yy, xx = np.mgrid[0:W, 0:W]
    A = design((xx.ravel() + 0.5) / W, (yy.ravel() + 0.5) / W, x0, y0, size, n)
    return (A @ C).reshape(W, W, 3)
