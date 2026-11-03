# python3 comps.py <tile.jpg> [--cover social-hook|about|scorecard|likewiki|clauded]  ->  comps.json
# The concept's letters as connected parts of its letter colour masks, each with its box and pixels at 554 px.
# Chairtax (the default): its cream ("Chair") and amber ("tax") masks: chair = C, h, a, i dot, i, r; tax = t, a, x,
# then the bottom tick. Social Hook: its white letters, as they touch (S with H, o with c, the two o's), left to right.
# About Neil: its gold letters (N, e, the i's dot, i, l). Their tiles are first cut to the cover (TILE_BOX) and scaled
# to 554 px, saved as tile554.png for fields.py. Scorecard: its white letters, as they touch, left to right.
# LikeWiki and Clauded: each word's letters as the connected parts of its config's colour rule inside its rows
# (likewiki.json, clauded.json beside this script), at the tile's own size.
import sys, json, colorsys, os
from PIL import Image, ImageFilter
COVER = sys.argv[sys.argv.index('--cover') + 1] if '--cover' in sys.argv else 'chairtax'
CONFIGS = ('likewiki', 'clauded')   # covers set up by a config file (<cover>.json beside this script)
if COVER in CONFIGS:
    cfg = json.load(open(os.path.join(os.path.dirname(os.path.abspath(__file__)), COVER + '.json')))
    im = Image.open(sys.argv[1]).convert('RGB'); W, H = im.size; p = im.load()
    def comps_of(rule, y0, y1, x0, x1, minpx):
        m = Image.new('L', (W, H)); q = m.load()
        for y in range(y0, y1):
            for x in range(x0, x1):
                r, g, b = p[x, y]; L = (r + g + b) / 3; s = max(r, g, b) - min(r, g, b)
                if eval(rule, {}, {'r': r, 'g': g, 'b': b, 'L': L, 's': s, 'x': x, 'y': y}): q[x, y] = 255
        q = m.filter(ImageFilter.MedianFilter(3)).load(); seen = bytearray(W * H); out = []
        for y in range(y0, y1):
            for x in range(x0, x1):
                if q[x, y] > 127 and not seen[y * W + x]:
                    st = [(x, y)]; seen[y * W + x] = 1; pts = []
                    while st:
                        u, v = st.pop(); pts.append((u, v))
                        for du, dv in ((1, 0), (-1, 0), (0, 1), (0, -1)):
                            a_, b_ = u + du, v + dv
                            if x0 <= a_ < x1 and y0 <= b_ < y1 and not seen[b_ * W + a_] and q[a_, b_] > 127: seen[b_ * W + a_] = 1; st.append((a_, b_))
                    if len(pts) >= minpx: out.append(sorted(pts))
        return sorted(out, key=lambda pts: (min(u for u, _ in pts), min(v for _, v in pts)))
    def entry(pts):
        xs = [u for u, _ in pts]; ys = [v for _, v in pts]
        return {'box': [min(xs), min(ys), max(xs), max(ys)], 'pts': pts}
    res = {'W': W, 'H': H}
    for w in cfg['words']:
        x0, x1 = w.get('x', [0, W])
        res[w['name']] = [entry(q) for q in comps_of(cfg['rules'][w['rule']], w['y'][0], w['y'][1], x0, x1, w.get('minpx', 200))]
    json.dump(res, open('comps.json', 'w'))
    print({k: [e['box'] for e in v] for k, v in res.items() if k not in ('W', 'H')})
    sys.exit()
TILE_BOX = {'social-hook': (3, 2, 576, 566), 'about': (5, 1, 578, 573), 'scorecard': (3, 1, 568, 562)}   # the cover inside its tile's grey margin
im = Image.open(sys.argv[1]).convert('RGB')
if COVER in TILE_BOX:
    im = im.crop(TILE_BOX[COVER]).resize((554, 554), Image.LANCZOS); im.save('tile554.png')
W = im.width
p = im.load()
if COVER == 'social-hook':
    m = Image.new('L', (W, W)); mp = m.load()
    for y in range(300):
        for x in range(500):
            r, g, b = p[x, y]
            if r > 200 and b - r < 45: mp[x, y] = 255
    m = m.filter(ImageFilter.MedianFilter(3))
if COVER == 'about':
    m = Image.new('L', (W, W)); mp = m.load()
    for y in range(170):
        for x in range(W):
            if colorsys.rgb_to_hsv(*(q / 255 for q in p[x, y]))[1] > 0.42: mp[x, y] = 255
    m = m.filter(ImageFilter.MedianFilter(3))
if COVER == 'scorecard':
    m = Image.new('L', (W, W)); mp = m.load()
    for y in range(140):
        for x in range(W):
            h, s, v = colorsys.rgb_to_hsv(*(q / 255 for q in p[x, y]))
            if v > 0.75 and s < 0.32: mp[x, y] = 255
    m = m.filter(ImageFilter.MedianFilter(3))
c = Image.new('L', (W, W)); a = Image.new('L', (W, W)); cp, ap = c.load(), a.load()
for y in range(W):
    for x in range(W):
        h, s, v = colorsys.rgb_to_hsv(*(q / 255 for q in p[x, y]))
        if v > 0.75 and s < 0.32: cp[x, y] = 255
        if v > 0.6 and s > 0.55 and 0.08 < h < 0.16: ap[x, y] = 255
c = c.filter(ImageFilter.MedianFilter(3)); a = a.filter(ImageFilter.MedianFilter(3))
def comps(m, y0, y1, minpx=200):
    q = m.load(); seen = bytearray(W * W); out = []
    for y in range(y0, y1):
        for x in range(W):
            if q[x, y] > 127 and not seen[y * W + x]:
                st = [(x, y)]; seen[y * W + x] = 1; pts = []
                while st:
                    u, v = st.pop(); pts.append((u, v))
                    for du, dv in ((1, 0), (-1, 0), (0, 1), (0, -1)):
                        a_, b_ = u + du, v + dv
                        if 0 <= a_ < W and y0 <= b_ < y1 and not seen[b_ * W + a_] and q[a_, b_] > 127: seen[b_ * W + a_] = 1; st.append((a_, b_))
                if len(pts) >= minpx: out.append(sorted(pts))
    # left to right; the i's dot before its stem
    return sorted(out, key=lambda pts: (min(u for u, _ in pts), min(v for _, v in pts)))
def entry(pts):
    xs = [u for u, _ in pts]; ys = [v for _, v in pts]
    return {'box': [min(xs), min(ys), max(xs), max(ys)], 'pts': pts}
if COVER == 'social-hook': res = {'title': [entry(q) for q in comps(m, 0, 300)]}
elif COVER == 'about': res = {'title': [entry(q) for q in comps(m, 0, 170)]}
elif COVER == 'scorecard': res = {'title': [entry(q) for q in comps(m, 0, 140)]}
else: res = {'chair': [entry(q) for q in comps(c, 150, 352)], 'tax': [entry(q) for q in comps(a, 320, 500)]}
json.dump(res, open('comps.json', 'w'))
print({k: [e['box'] for e in v] for k, v in res.items()})
