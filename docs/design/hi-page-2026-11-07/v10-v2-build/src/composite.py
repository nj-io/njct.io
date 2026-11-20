"""Composite the picked H3 loop (4 s + 4 s) onto the full-resolution plates, so only the man (and the cup he
moves) comes from the 480p video and every other pixel is the plate the page shows.

    .venv/bin/python -I src/composite.py          (venv: uv venv .venv; uv pip install numpy pillow scipy opencv-contrib-python-headless)

Inputs (paths relative to the brief folder):
  v9-video/keys4/empty.png, end.png      the 1024x1536 plates (before the sip, after the sip)
  v10-v2-build/work/a/*.png, work/b/*.png frames of clip A (empty -> sip) and clip B (sip -> end), 480x864
Registration (src/refine.py): a video pixel (u, v) sits at plate (84 + 1.778 u, 1.778 v).

Per frame, src/matte.py gives the alpha against the clip's own still end (A: its first frame, B: its last frame)
by known-background matting (see its docstring) and the composite onto the plate.
Writes work/out/NNN.png (the composite, cropped to BOX), work/matte/NNN.png (the alpha, white = the man, same crop)
and work/box.json. BOX is fixed: the page and the encoder are built for it.
"""
import json
import sys
from pathlib import Path

import numpy as np
from PIL import Image

sys.path.insert(0, str(Path(__file__).resolve().parent))      # -I leaves the script folder off the path
from matte import W, H, place, matte_frame

HERE = Path(__file__).resolve().parents[1]
BRIEF = HERE.parent
BOX = dict(x=72, y=224, w=888, h=1312, plate_w=W, plate_h=H)


def main():
    plates = {k: np.asarray(Image.open(BRIEF / f'v9-video/keys4/{k}.png').convert('RGB').resize((W, H)), np.float32) for k in ('empty', 'end')}
    out_dir = HERE / 'work/out'; out_dir.mkdir(exist_ok=True)
    matte_dir = HERE / 'work/matte'; matte_dir.mkdir(exist_ok=True)
    for d in (out_dir, matte_dir):
        for f in d.glob('*.png'): f.unlink()
    x0, y0 = BOX['x'], BOX['y']; x1, y1 = x0 + BOX['w'], y0 + BOX['h']
    n = 0
    outside = 0.0
    for name, ref_i, plate in (('a', 0, 'empty'), ('b', -1, 'end')):
        files = sorted((HERE / f'work/{name}').glob('*.png'))
        ref, valid = place(Image.open(files[ref_i]))
        rng = range(len(files)) if name == 'a' else range(1, len(files))     # B's first frame repeats A's last
        for i in rng:
            frame, _ = place(Image.open(files[i]))
            alpha, comp, fit = matte_frame(frame, ref, valid, plates[plate])
            n += 1
            Image.fromarray(comp[y0:y1, x0:x1].astype(np.uint8)).save(out_dir / f'{n:03d}.png')
            Image.fromarray((alpha[y0:y1, x0:x1] * 255 + 0.5).astype(np.uint8)).save(matte_dir / f'{n:03d}.png')
            outside = max(outside, float(alpha.sum() - alpha[y0:y1, x0:x1].sum()))
            if n % 20 == 0 or n == 1:
                print(f'{n:3d} {name}{i:03d} alpha px {int((alpha > 0).sum()):7d} solid px {int((alpha == 1).sum()):7d} '
                      f'band px {int(((alpha > 0) & (alpha < 1)).sum()):6d} fit {[(round(a, 3), round(b, 1)) for a, b in fit]}', flush=True)
    box = dict(BOX, frames=n, fps=24)
    (HERE / 'work/box.json').write_text(json.dumps(box, indent=2))
    print('box', box, 'max alpha outside the box', outside)


if __name__ == '__main__':
    main()
