# Topshine field codec (topshineKeys in editions/covers/covers.js decodes it).
# Per block: the mask of controls the fit used, as run lengths (dropped first, alternating), then three planes
# (g, r - g, b - g) on one step per block for those controls in row order, each value sent as its error from a
# prediction (its left neighbour when that was used, else the one above, else the last value sent). Symbols:
# alpha[k] is a run length k, or an error k - 31; '~' and two alpha symbols a run length a * 63 + b, or an error
# (a * 63 + b) - 1984. Dropped controls are filled from used neighbours on decode, one ring at a time.
import numpy as np
ALPHA = ''.join(chr(c) for c in range(40, 127) if chr(c) not in '\\\'`~')[:63]
def fill(C, keep, n):
    C = C.reshape(n, n, 3).copy(); k = keep.reshape(n, n).copy()
    if not k.any(): return C.reshape(n * n, 3)
    while not k.all():
        nk = k.copy()
        for y in range(n):
            for x in range(n):
                if k[y, x]: continue
                acc = [C[y + dy, x + dx] for dy in (-1, 0, 1) for dx in (-1, 0, 1)
                       if (dy or dx) and 0 <= y + dy < n and 0 <= x + dx < n and k[y + dy, x + dx]]
                if acc: C[y, x] = np.mean(acc, 0); nk[y, x] = True
        k = nk
    return C.reshape(n * n, 3)
def sym(v, off):
    v += off
    if 0 <= v < 63: return ALPHA[v]
    v = v - off + 1984 if off else v
    assert 0 <= v < 63 * 63, v
    return '~' + ALPHA[v // 63] + ALPHA[v % 63]
def encode(blocks, arrs, keeps, steps):
    # steps: {'amp', 'base'}: a block's step as a multiple of its g range / 255; 'chroma': the differences' step multiple
    out = []; meta = []; dec = []; boxes = []
    for (b, n, kind), C, K in zip(blocks, arrs, keeps):
        runs = []; cur = False; r = 0
        for v in K:
            if bool(v) == cur: r += 1
            else: runs.append(r); cur = not cur; r = 1
        runs.append(r)
        out.append(sym(len(runs), 0)); out += [sym(r, 0) for r in runs]
        X = np.c_[C[:, 1], C[:, 0] - C[:, 1], C[:, 2] - C[:, 1]]
        lo = X[K].min(0)
        step = max((X[K, 0].max() - lo[0]) / 255, 1e-6) * steps['amp' if kind == 'amp' else 'base']
        CH = steps['chroma']
        sv = np.array([step, step * CH, step * CH])
        Q = np.round((X - lo) / sv).astype(int)
        k2 = K.reshape(n, n)
        for ch in range(3):
            a = Q[:, ch].reshape(n, n); last = 0
            for y in range(n):
                for x in range(n):
                    if not k2[y, x]: continue
                    p = a[y, x - 1] if x and k2[y, x - 1] else a[y - 1, x] if y and k2[y - 1, x] else last
                    out.append(sym(int(a[y, x] - p), 31)); last = a[y, x]
        bx = [round(b[0], 4), round(b[1], 4), round(b[2], 4)]
        if bx not in boxes: boxes.append(bx)
        meta.append([boxes.index(bx), n] + [float('%.4g' % x) for x in lo] + [float('%.4g' % step)])
        lo = np.array(meta[-1][2:5]); sv = np.array([1, CH, CH]) * meta[-1][5]   # decode with the stored values
        Xd = lo + Q * sv
        dec.append(fill(np.c_[Xd[:, 1] + Xd[:, 0], Xd[:, 0], Xd[:, 2] + Xd[:, 0]], K, n))
    return (boxes, meta), ''.join(out), dec
