# Builds index.html from template.html: the café's leaf shadows (scene/sun.js LEAF_FRAG, drawn as SVG paths)
# and the Noto Sans SC subset for the Chinese copy.
import math, pathlib, random, urllib.parse
here = pathlib.Path(__file__).parent
f = lambda v: ('%.1f' % v).rstrip('0').rstrip('.')

def frame(bx, by, ang):
    """A leaf's own frame: x along the midrib from its base, y across (sun.js rot())."""
    a = math.radians(ang); c, s = math.cos(a), math.sin(a)
    return lambda x, y: (bx + c * x - s * y, by + s * x + c * y)

def poly(pts):
    return 'M' + ' L'.join('%s %s' % (f(x), f(y)) for x, y in pts) + 'Z'

def ellipse(cx, cy, rx, ry, rot):
    a = math.radians(rot); pts = []
    for i in range(10):
        t = 2 * math.pi * i / 10
        x, y = rx * math.cos(t), ry * math.sin(t)
        pts.append((cx + x * math.cos(a) - y * math.sin(a), cy + x * math.sin(a) + y * math.cos(a)))
    return poly(pts)

def crown(cx, cy, rx, ry, seed):
    """A distant tree's crown: small leaves, small gaps between them, thinning to open sky at its edge."""
    r = random.Random(seed); out = []
    for _ in range(1100):
        u, v = r.uniform(-1.15, 1.15), r.uniform(-1.15, 1.15)
        e = math.hypot(u, v)
        if e > 1.12 or r.random() > (0.95 if e < 0.55 else 0.95 - (e - 0.55) * 1.4):
            continue
        out.append(ellipse(cx + u * rx, cy + v * ry, r.uniform(3.4, 6.4), r.uniform(1.8, 3.2), r.uniform(0, 180)))
    return ' '.join(out)

def plumeria(T, len_, wid):
    """A frangipani leaf: obovate, widest two thirds of the way out."""
    n = 16; top = []; bot = []
    for i in range(n + 1):
        u = i / n
        w = wid * 1.9 * u ** 0.75 * (1 - u) ** 0.4 if 0 < u < 1 else 0
        top.append(T(u * len_, -w)); bot.append(T(u * len_, w))
    return poly(top + bot[::-1])

def rosette(cx, cy, a0, len_, wid, seed):
    r = random.Random(seed); out = []
    for i in range(7):
        a = math.degrees(a0 + i * 0.82 + 0.18 * math.sin(i * 2.7))
        out.append(plumeria(frame(cx, cy, a), len_ * (0.8 + 0.25 * r.random()), wid))
    return ' '.join(out)

def capsule(ax, ay, bx, by, rad):
    a = math.atan2(by - ay, bx - ax); nx, ny = -math.sin(a) * rad, math.cos(a) * rad
    return poly([(ax + nx, ay + ny), (bx + nx, by + ny), (bx - nx, by - ny), (ax - nx, ay - ny)])

def monstera(bx, by, ang, len_, seed):
    """A broad heart, slits running in from the margin between the veins, oval holes by the midrib (evenodd)."""
    T = frame(bx, by, ang); r = random.Random(seed); n = 40
    hw = lambda u: len_ * 0.5 * max(math.sin(math.pi * min(max(u + 0.06, 0), 1)), 0) ** 0.6 * (1.12 - 0.3 * u)
    top = [T(u * len_, -hw(u)) for u in (i / n for i in range(n + 1))]
    bot = [T(u * len_, hw(u)) for u in (i / n for i in range(n + 1))]
    out = [poly(top + bot[::-1])]
    for side in (-1, 1):
        for k in range(1, 9):
            u0 = k * 0.105 + (0.03 if side > 0 else 0)
            if u0 > 0.9: break
            u1 = u0 - 0.12            # the slit runs in toward the base as it nears the midrib
            h0, h1 = hw(u0), hw(u1) * (0.55 + 0.12 * r.random())
            w0, w1 = 0.03 + 0.008 * r.random(), 0.008
            out.append(poly([T((u0 - w0) * len_, side * h0 * 1.0), T((u1 - w1) * len_, side * h1),
                             T((u1 + w1) * len_, side * h1), T((u0 + w0) * len_, side * h0 * 1.0)]))
            if r.random() > 0.35 and 0.1 < u0 < 0.8:
                hx, hy = T((u0 - 0.07) * len_, side * hw(u0 - 0.07) * 0.3)
                out.append(ellipse(hx, hy, len_ * 0.05, len_ * 0.024, ang + side * 50))
    return ' '.join(out)

leaves = {
    'CROWN': crown(52, 196, 112, 90, 7),
    'BRANCH': ' '.join([capsule(470, 26, 356, 116, 6), capsule(400, 78, 196, 102, 3.6)]),
    'ROSETTES': ' '.join([rosette(356, 116, 0.4, 64, 10, 1), rosette(196, 102, 1.9, 56, 9, 2)]),
    'MONSTERA': monstera(432, 664, -146, 178, 3),
    'CROWN2': crown(860, -10, 150, 110, 11),
    'MONSTERA2': monstera(960, 560, -150, 230, 5),
}
html = (here / 'template.html').read_text()
for k, v in leaves.items():
    html = html.replace('%%' + k + '%%', v)
sc = ''.join(sorted(set('你好，我是很高兴认识你，可以在这里找到我。保存联系人中文')))
html = html.replace('%%SCTEXT%%', urllib.parse.quote(sc, safe=''))
(here / 'index.html').write_text(html)
print(len(html))
