"""Key poses for the /hi coffee loop: K3 is the anchor; K4, K2, K5 take K3 as their position reference.
After each image, only the pixels that differ from the base plate (the man and his shadow) are pasted onto it."""
import subprocess, sys
from pathlib import Path
from PIL import Image, ImageChops, ImageFilter
B = Path(__file__).resolve().parents[2]
G = Path.home() / '.claude/skills/generate-image/scripts/generate_image.py'
POS = ('Keep the photo framing exactly as it is: same camera, same zoom, the table top at the same height in the frame, the table '
       'base not shown. He is close to the camera, so the bottom edge of the photo cuts him off at mid-thigh. He stands at the '
       'right-hand side of the table, just right of the cup, turned toward the table at a slight angle, the table edge at his hips, '
       'the cup and laptop still visible. Realistic scale for a man about 180 cm tall at this high table. His back is '
       'to the camera the whole time: back of the head, curly hair, neck and shoulders; his face is never visible, not even '
       'his cheek or beard, only the outline of an ear. White crew-neck t-shirt, beige chino shorts, black watch on his left '
       'wrist, white sneakers. Same warm late-afternoon sun on his back; soft natural shadow on the table and floor. Keep the '
       'wall, light, table, laptop, cup and saucer exactly as they are except where he touches them. Photorealistic, no text.')
SHOTS = {
 'k3': ('plate', ['v9-video/character-sheet-4.png', 'v9-video/keys/rejected/k3-raw-1.png'],
        'Edit this photo of a cafe table by a sunlit grey wall. Add the man from the character reference sheet (view 1), standing in the same spot relative to the table as in the last reference image but at the scale this framing gives him. ' + POS +
        ' He has just reached the table: his LEFT hand holds the handle of the white cappuccino cup, which is still resting on its saucer; his right arm hangs relaxed; his head is tipped slightly down toward the cup.'),
 'k4': ('plate', ['v9-video/character-sheet-4.png', 'v9-video/keys/k3-raw.png'],
        'Edit this photo of a cafe table by a sunlit grey wall. Add the same man, in exactly the same place and size as in the last reference image. ' + POS +
        ' He is drinking: the cup is raised in his LEFT hand to his mouth in front of his face, hidden by his head, elbow lowered close to his body; the saucer stays on the table; right arm relaxed.'),
 'k2': ('plate', ['v9-video/character-sheet-4.png', 'v9-video/keys/k3-raw.png'],
        'Edit this photo of a cafe table by a sunlit grey wall. Add the same man, at exactly the same size and distance from the camera as in the last reference image, cut off by the bottom edge of the photo at mid-thigh, so no knees or feet are visible. Keep the photo framing exactly as it is: same camera, same zoom, the table top at the same height. He is walking in from the right, mid-stride, one step to the right of where he stands in the last reference image, his back to the camera, his head facing the wall. Both hands empty, arms swinging naturally. His face is never visible. White crew-neck t-shirt, beige chino shorts, black watch on his left wrist. Keep the wall, light, table, laptop, cup and saucer exactly as they are. Photorealistic, no text.'),
 'k5': ('end', ['v9-video/character-sheet-4.png', 'v9-video/keys/k3-raw.png'],
        'Edit this photo of a cafe table by a sunlit grey wall. Add the same man, in exactly the same place and size as in the last reference image. ' + POS +
        ' He has just put the cup back on its saucer and let go; his LEFT hand is moving away from the cup, and his body is starting to turn to his right to walk away, still with his back to the camera. Keep the cup exactly as in this photo, with its faint foam mark on the rim.'),
}
BASES = {'plate': B / 'v9-video/frames/plate-p.jpg', 'end': B / 'v9-video/frames/end-full-composite.png'}

def paste_onto(base, gen):
    """Paste the man (and his hands, cup and contact shadow) onto the base. The changed pixels are found at a low
    threshold, closed, and every hole is filled (a white shirt against the bright wall leaves holes); only the largest
    changed region is kept, so stray wall smudges and re-lit patches elsewhere stay as the base."""
    import numpy as np
    from collections import deque
    d = np.asarray(ImageChops.difference(gen, base).convert('L').filter(ImageFilter.GaussianBlur(3)))
    m = Image.fromarray(((d > 16) * 255).astype('uint8')).filter(ImageFilter.MaxFilter(21)).filter(ImageFilter.MinFilter(13))
    a = np.asarray(m) > 0
    h, w = a.shape
    lab = np.zeros((h, w), int); best, best_n, n = 0, 0, 0
    for y0 in range(0, h, 2):
        for x0 in range(0, w, 2):
            if a[y0, x0] and not lab[y0, x0]:
                n += 1; q = deque([(y0, x0)]); lab[y0, x0] = n; c = 0
                while q:
                    y, x = q.popleft(); c += 1
                    for yy, xx in ((y+1, x), (y-1, x), (y, x+1), (y, x-1)):
                        if 0 <= yy < h and 0 <= xx < w and a[yy, xx] and not lab[yy, xx]:
                            lab[yy, xx] = n; q.append((yy, xx))
                if c > best_n: best, best_n = n, c
    keep = lab == best
    # fill holes: background reachable from the border stays background
    out = np.zeros((h, w), bool); q = deque()
    for y in range(h):
        for x in (0, w - 1):
            if not keep[y, x] and not out[y, x]: out[y, x] = True; q.append((y, x))
    for x in range(w):
        for y in (0, h - 1):
            if not keep[y, x] and not out[y, x]: out[y, x] = True; q.append((y, x))
    while q:
        y, x = q.popleft()
        for yy, xx in ((y+1, x), (y-1, x), (y, x+1), (y, x-1)):
            if 0 <= yy < h and 0 <= xx < w and not keep[yy, xx] and not out[yy, xx]:
                out[yy, xx] = True; q.append((yy, xx))
    mask = Image.fromarray((~out * 255).astype('uint8')).filter(ImageFilter.GaussianBlur(4))
    return Image.composite(gen, base, mask)

def repaste(keys):
    for k in keys:
        base = Image.open(BASES[SHOTS[k][0]]).convert('RGB')
        g = Image.open(B / f'v9-video/keys/{k}-raw.png').convert('RGB').resize(base.size)
        out = paste_onto(base, g); out.save(B / f'v9-video/keys/{k}.png')
        out.crop((160, 0, 1024, 1536)).save(B / f'v9-video/keys/{k}-9x16.png')

if sys.argv[1:2] == ['--repaste']:
    repaste(sys.argv[2:]); sys.exit()
for k in sys.argv[1:]:
    base_key, refs, prompt = SHOTS[k]
    base = BASES[base_key]
    raw = f'v9-video/keys/{k}-raw.png'
    r = subprocess.run(['python3', str(G), 'gpt26-sunburst', prompt, '--size', '1024x1536', '-o', raw, '-t', 'hi-v9-video',
                        '-i', str(base), *refs], cwd=B, capture_output=True, text=True)
    print(k, r.returncode, [l for l in r.stderr.splitlines() if l.startswith('cost')], r.stdout.strip()[-80:])
    if r.returncode: continue
    b = Image.open(base).convert('RGB'); g = Image.open(B / raw).convert('RGB').resize(b.size)
    out = paste_onto(b, g); out.save(B / f'v9-video/keys/{k}.png')
    out.crop((160, 0, 1024, 1536)).save(B / f'v9-video/keys/{k}-9x16.png')
