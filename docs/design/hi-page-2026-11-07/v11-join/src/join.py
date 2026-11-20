"""Smooth the join between the picked loop's two clips (frame 107, clip A's last, to frame 108, clip B's second).

Clip B starts from a re-render of A's last frame, so at the join the man moves by a pixel or two and the background
changes from the before plate to the after plate. Both clips are almost still there (he is mid-sip), so the join is
replaced by a flow morph over WIN frames on each side: the dense optical flow F from A's last frame to B's first
kept frame, each window frame t = (k + 0.5) / (2 WIN) drawn as (1 - t) * warp(A_k, t F) + t * warp(B_k, -(1 - t) F),
where A_k is A's frame at that position (A's last after the join) and B_k is B's (B's first before it). The matte is
warped and blended the same way, so the leaf cut-out follows the colour.

    ../v10-v2-build/.venv/bin/python -I src/join.py      (run from v11-join)

Reads ../v10-v2-build/work/out and work/matte (src/composite.py there), writes work/out and work/matte here.
"""
import shutil
from pathlib import Path

import cv2
import numpy as np

HERE = Path(__file__).resolve().parents[1]
SRC = HERE.parent / 'v10-v2-build/work'
LAST_A = 107          # out/107.png is clip A's last frame; 108 is clip B's frame 1 (its frame 0 repeats A's last)
WIN = 8               # frames each side of the join: 16 frames, 0.67 s at 24 fps


def read(kind, n, flags=cv2.IMREAD_COLOR):
    return cv2.imread(str(SRC / kind / f'{n:03d}.png'), flags)


def warp(img, flow, s):
    h, w = flow.shape[:2]
    gx, gy = np.meshgrid(np.arange(w, dtype=np.float32), np.arange(h, dtype=np.float32))
    # backward map: the pixel at p in the warped image comes from p - s * flow(p) (flow is smooth here, so sampling
    # it at the destination is close enough for a sub-3-pixel move)
    return cv2.remap(img, gx - s * flow[..., 0], gy - s * flow[..., 1], cv2.INTER_LINEAR, borderMode=cv2.BORDER_REPLICATE)


def main():
    for kind in ('out', 'matte'):
        d = HERE / 'work' / kind
        if d.exists(): shutil.rmtree(d)
        shutil.copytree(SRC / kind, d)
    a, b = read('out', LAST_A), read('out', LAST_A + 1)
    dis = cv2.DISOpticalFlow_create(cv2.DISOPTICAL_FLOW_PRESET_ULTRAFAST + 2)      # PRESET_MEDIUM
    flow = dis.calc(cv2.cvtColor(a, cv2.COLOR_BGR2GRAY), cv2.cvtColor(b, cv2.COLOR_BGR2GRAY), None)
    mag = np.hypot(flow[..., 0], flow[..., 1])
    print(f'flow A{LAST_A} -> B{LAST_A + 1}: mean {mag.mean():.2f} px, p99 {np.percentile(mag, 99):.2f} px, max {mag.max():.2f} px')
    first, last = LAST_A - WIN + 1, LAST_A + WIN
    for n in range(first, last + 1):
        t = (n - first + 0.5) / (2 * WIN)
        na, nb = min(n, LAST_A), max(n, LAST_A + 1)
        for kind, flags in (('out', cv2.IMREAD_COLOR), ('matte', cv2.IMREAD_GRAYSCALE)):
            fa = read(kind, na, flags).astype(np.float32)
            fb = read(kind, nb, flags).astype(np.float32)
            m = (1 - t) * warp(fa, flow, t) + t * warp(fb, flow, -(1 - t))
            cv2.imwrite(str(HERE / 'work' / kind / f'{n:03d}.png'), np.clip(m + 0.5, 0, 255).astype(np.uint8))
    print(f'morphed frames {first}..{last}')


if __name__ == '__main__':
    main()
