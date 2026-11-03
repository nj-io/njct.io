# python3 bearmask.py <tile.jpg>  ->  bear.png   (needs comps.json)
# The concept's bear silhouette: pixels brighter than the ground around the bear, the letters and the rays taken
# out, small gaps closed, the part connected to his face kept and its holes filled.
import sys, json
from PIL import Image, ImageFilter, ImageChops, ImageDraw
im = Image.open(sys.argv[1]).convert('RGB'); W = im.width
L = im.convert('L'); cc = json.load(open('comps.json'))
let = Image.new('L', (W, W)); lp = let.load()
for c in cc['chair'] + cc['tax'][:3]:
    for x, y in c['pts']: lp[x, y] = 255
let = let.filter(ImageFilter.MaxFilter(3))
# the amber mask (comps.py's thresholds): amber outside the bear's middle is a ray
import colorsys
P = im.load(); amb = Image.new('L', (W, W)); qp = amb.load()
for y in range(W):
    for x in range(W):
        h, s, v = colorsys.rgb_to_hsv(*(q / 255 for q in P[x, y]))
        if v > 0.6 and s > 0.55 and 0.08 < h < 0.16: qp[x, y] = 255
qp = amb.filter(ImageFilter.MedianFilter(3)).load()
m = L.point(lambda v: 255 if v > 34 else 0); m = ImageChops.subtract(m, let); mp = m.load()
for y in range(W):
    for x in range(W):
        if not (140 <= x < 420 and y < 345): mp[x, y] = 0
        elif qp[x, y] and not (190 <= x < 380): mp[x, y] = 0
m = m.filter(ImageFilter.MaxFilter(3)).filter(ImageFilter.MinFilter(3))
ImageDraw.floodfill(m, (245, 60), 128)                        # a point on his forehead
m = m.point(lambda v: 255 if v == 128 else 0)
inv = m.point(lambda v: 0 if v else 255); ImageDraw.floodfill(inv, (0, 0), 128)
m = ImageChops.lighter(m, inv.point(lambda v: 255 if v == 255 else 0))
ImageChops.subtract(m, let).save('bear.png')
