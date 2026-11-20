# Builds index.html from template.html: the About Neil cover's traced letters and the generated leaf shadows.
import json, math, pathlib, urllib.parse
here = pathlib.Path(__file__).parent
letters = json.load(open('/Users/neil/dev/njct.io/covers/letters/about.json'))['letters']
neil = ' '.join(l['d'] for l in letters)

def frond(bx, by, ang, L, bend, n, seed):
    """A palm frond as one path: leaflets either side of a curved rib (viewBox units)."""
    out = []
    pts = []
    for i in range(n + 1):
        t = i / n
        a = math.radians(ang + bend * t)
        if i == 0:
            x, y = bx, by
        else:
            x, y = pts[-1][0] + math.cos(a) * L / n, pts[-1][1] + math.sin(a) * L / n
        pts.append((x, y, a))
    # rib
    rib = 'M%.1f %.1f' % pts[0][:2] + ''.join(' L%.1f %.1f' % p[:2] for p in pts[1:])
    for i, (x, y, a) in enumerate(pts[1:], 1):
        t = i / n
        ll = (58 - 36 * t) * (0.85 + 0.3 * ((i * 7 + seed) % 5) / 5)
        w = 8 - 4 * t
        for side in (-1, 1):
            la = a + side * math.radians(40 + 14 * t) + (0.12 * side if (i + seed) % 3 == 0 else 0)
            ex, ey = x + math.cos(la) * ll, y + math.sin(la) * ll
            # a pointed leaflet: two quadratic curves through offset controls
            mx, my = (x + ex) / 2, (y + ey) / 2
            nx, ny = -math.sin(la) * w, math.cos(la) * w
            out.append('M%.1f %.1f Q%.1f %.1f %.1f %.1f Q%.1f %.1f %.1f %.1fZ' % (x, y, mx + nx, my + ny, ex, ey, mx - nx, my - ny, x, y))
    return rib, ' '.join(out)

fronds = [frond(470, 30, 172, 250, 26, 11, 1), frond(450, 250, 196, 200, -20, 9, 3), frond(470, 560, 168, 210, 22, 9, 2)]
leaf_ribs = ' '.join(f[0] for f in fronds)
leaf_blades = ' '.join(f[1] for f in fronds)

html = (here / 'template.html').read_text()
html = html.replace('%%NEIL%%', neil).replace('%%RIBS%%', leaf_ribs).replace('%%BLADES%%', leaf_blades).replace('%%SCTEXT%%', urllib.parse.quote(''.join(sorted(set('你好，我是很高兴认识你，可以在这里找到我。保存联系人中文'))), safe=''))
(here / 'index.html').write_text(html)
print(len(html))
