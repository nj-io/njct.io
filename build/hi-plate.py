#!/usr/bin/env python3
"""Encode the /hi background plates (plan § 1).

    python3 -m venv build/.venv && build/.venv/bin/pip install pillow==11.3.0
    build/.venv/bin/python -I build/hi-plate.py PORTRAIT.png LANDSCAPE.png [--out hi/]

Per plate it measures the text zone, rejects a plate with no shade reference (Ls/Ll > 0.75) or too little
contrast under full leaf shade (p5 < 0.18), then writes content-hashed AVIF / WebP / JPEG encodes, the sun mask
and, from the landscape plate, the 1200 x 630 link-preview image. hi/plates.json names every file; files the
new plates.json no longer names are deleted. Nothing is written when a plate is rejected.

plates.json keys this script owns, per plate: w h avif webp jpg sun shade shade_source ls_ll contrast_p5 top
bottom, and the top-level og. Hand-written keys (leaves, shade_override, anything else) survive every run.
"""
import argparse
import hashlib
import io
import json
import re
import sys
from pathlib import Path

from PIL import Image, ImageFilter, ImageStat

KB = 1000
LS_LL_MAX = 0.75          # above this the plate has no shade reference
CONTRAST_P5_MIN = 0.18    # solid black text then has at least 4.6:1 over 95 % of the zone
URL = '/hi/'

# name: (width, height, text zone as fractions x0 y0 x1 y1, budgets in KB for avif / webp / jpg)
PLATES = {
    'p': dict(w=1024, h=1536, zone=(0.155, 0.0, 0.845, 0.64), budget=dict(avif=90, webp=140, jpg=190)),
    'l': dict(w=1536, h=1024, zone=(0.0, 0.0, 0.55, 0.80), budget=dict(avif=120, webp=180, jpg=240)),
}
SUN_BUDGET = 4 * KB
OG_BUDGET = 120 * KB
START_Q = dict(avif=55, webp=80, jpg=82, og=82)
MIN_Q = 20

OWNED = ['w', 'h', 'avif', 'webp', 'jpg', 'sun', 'shade', 'shade_source', 'ls_ll', 'contrast_p5', 'top', 'bottom']


def die(msg):
    print(msg, file=sys.stderr)
    sys.exit(1)


def percentile_from_hist(hist, q):
    """Smallest value v whose cumulative count reaches q of the total."""
    n = sum(hist)
    need = q * n
    cum = 0
    for v, c in enumerate(hist):
        cum += c
        if cum >= need:
            return v
    return len(hist) - 1


def hex_of(rgb):
    return '#%02x%02x%02x' % tuple(int(round(c)) for c in rgb)


def lin(v):
    v /= 255
    return v / 12.92 if v <= 0.04045 else ((v + 0.055) / 1.055) ** 2.4


def zone_box(spec):
    x0, y0, x1, y1 = spec['zone']
    return (round(x0 * spec['w']), round(y0 * spec['h']), round(x1 * spec['w']), round(y1 * spec['h']))


def measure(name, img, spec, override):
    """Everything the page needs from one plate, before any file is written. Returns (result, problems)."""
    w, h = spec['w'], spec['h']
    box = zone_box(spec)
    zone = img.crop(box)
    luma = img.convert('L')
    hist = luma.crop(box).histogram()
    ls, ll = percentile_from_hist(hist, 0.10), percentile_from_hist(hist, 0.95)
    ls_ll = ls / ll if ll else 1.0
    problems = []
    print(f'[{name}] text zone {box}: Ls {ls}, Ll {ll}, Ls/Ll {ls_ll:.3f}')
    if ls_ll > LS_LL_MAX:
        problems.append(f'[{name}] no shade reference: Ls/Ll = {ls_ll:.3f}')

    # Sun mask: s = clamp((L - Ls) / (Ll - Ls), 0, 1), blurred 4 px (plaster grain), 8-bit.
    span = max(ll - ls, 1)
    lut = [max(0, min(255, round(255 * (v - ls) / span))) for v in range(256)]
    s_full = luma.point(lut).filter(ImageFilter.GaussianBlur(4))

    # Shade colour: per channel, mean(plate where s < 0.1) / mean(plate where s > 0.9), over the zone, at most 1.
    s_zone = s_full.crop(box)
    dark = s_zone.point(lambda v: 255 if v < 25.5 else 0)
    lit = s_zone.point(lambda v: 255 if v > 229.5 else 0)
    n_dark, n_lit = dark.histogram()[255], lit.histogram()[255]
    print(f'[{name}] zone pixels in shade (s<0.1): {n_dark}, in full sun (s>0.9): {n_lit}')
    measured = None
    for label, n in (('shade', n_dark), ('full sun', n_lit)):
        if 0 < n < 1000:
            print(f'[{name}] warning: only {n} {label} pixels in the zone, the measured shade colour is unreliable')
    if n_dark and n_lit:
        md = ImageStat.Stat(zone, dark).mean
        ml = ImageStat.Stat(zone, lit).mean
        measured = [min(1.0, d / l) for d, l in zip(md, ml)]
        print(f'[{name}] measured shade ratios k = ({measured[0]:.3f}, {measured[1]:.3f}, {measured[2]:.3f})')
    if override:
        ratios, source = override, 'override'
    elif measured:
        ratios, source = measured, 'measured'
    else:
        ratios, source = None, None
        problems.append(f'[{name}] no shade reference: the zone has no pixels in full shade or in full sun')
    result = dict(box=box, ls_ll=ls_ll, s_full=s_full, shade_source=source)
    if ratios:
        shade = [round(255 * k) for k in ratios]
        result['shade'] = shade
        # Contrast rule: the zone multiplied by shade/255 (full leaf shade everywhere), WCAG relative luminance.
        shaded = [zone.getchannel(i).point([round(v * shade[i] / 255) for v in range(256)]) for i in range(3)]
        tabs = [[lin(v) for v in range(256)] for _ in range(3)]
        ys = sorted(0.2126 * tabs[0][r] + 0.7152 * tabs[1][g] + 0.0722 * tabs[2][b]
                    for r, g, b in zip(*(c.getdata() for c in shaded)))
        p5 = ys[int(0.05 * len(ys))]
        result['contrast_p5'] = p5
        print(f'[{name}] shade {shade} ({source}), contrast p5 after full shade {p5:.4f} (needs {CONTRAST_P5_MIN})')
        if p5 < CONTRAST_P5_MIN:
            problems.append(f'[{name}] contrast: p5 {p5:.4f} < {CONTRAST_P5_MIN} after full shade with {shade}')
    band = max(1, round(0.03 * h))
    result['top'] = hex_of(ImageStat.Stat(img.crop((0, 0, w, band))).mean)
    result['bottom'] = hex_of(ImageStat.Stat(img.crop((0, h - band, w, h))).mean)
    return result, problems


def encode(img, fmt, q, **kw):
    buf = io.BytesIO()
    img.save(buf, fmt, quality=q, **kw)
    return buf.getvalue()


def fit(label, img, fmt, budget, **kw):
    """Encode at the start quality and step down by 5 until the file fits its budget."""
    q = START_Q[label]
    while True:
        data = encode(img, fmt, q, **kw)
        if len(data) <= budget:
            print(f'  {label}: quality {q}, {len(data) / KB:.1f} KB (budget {budget / KB:.0f} KB)')
            return data
        if q - 5 < MIN_Q:
            die(f'{label}: {len(data) / KB:.1f} KB at quality {q} still over its {budget / KB:.0f} KB budget')
        q -= 5


def sun_png(s_full, w, h):
    """The mask at one eighth: black with s as alpha, a palette PNG whose tRNS holds s. Fewer levels until it fits."""
    small = s_full.resize((w // 8, h // 8), Image.BOX)
    for levels in (256, 128, 64, 32, 16):
        step = 255 / (levels - 1)
        q = small.point([round(round(v / step) * step) for v in range(256)])
        pal = sorted(set(q.getdata()))
        idx = q.point([pal.index(v) if v in pal else 0 for v in range(256)])
        out = Image.new('P', small.size)
        out.putdata(list(idx.getdata()))
        out.putpalette([0, 0, 0] * len(pal))
        buf = io.BytesIO()
        out.save(buf, 'PNG', optimize=True, transparency=bytes(pal))
        data = buf.getvalue()
        if len(data) <= SUN_BUDGET:
            print(f'  sun: {levels} levels, {small.size[0]}x{small.size[1]}, {len(data) / KB:.1f} KB (budget 4 KB)')
            return data
    die(f'sun mask {len(data) / KB:.1f} KB at 16 levels still over its 4 KB budget')


def hashed(stem, ext, data):
    return f'{stem}.{hashlib.sha256(data).hexdigest()[:8]}.{ext}'


def main():
    ap = argparse.ArgumentParser(description=__doc__.split('\n')[0])
    ap.add_argument('portrait')
    ap.add_argument('landscape')
    ap.add_argument('--out', default=str(Path(__file__).resolve().parent.parent / 'hi'),
                    help='output folder (default: hi/ at the repo root)')
    args = ap.parse_args()
    out = Path(args.out)
    out.mkdir(parents=True, exist_ok=True)
    meta_path = out / 'plates.json'
    meta = json.loads(meta_path.read_text()) if meta_path.exists() else {}

    imgs, results, problems = {}, {}, []
    for key, src in (('p', args.portrait), ('l', args.landscape)):
        spec = PLATES[key]
        img = Image.open(src).convert('RGB')
        if img.size != (spec['w'], spec['h']):
            die(f'{src}: {img.size[0]}x{img.size[1]}, expected {spec["w"]}x{spec["h"]}')
        override = (meta.get(key) or {}).get('shade_override')
        imgs[key] = img
        results[key], probs = measure(key, img, spec, override)
        problems += probs
    if problems:
        die('rejected, nothing written:\n  ' + '\n  '.join(problems))

    files, new_meta = {}, dict(meta)
    for key in ('p', 'l'):
        spec, res, img = PLATES[key], results[key], imgs[key]
        print(f'[{key}] encoding')
        entry = dict((meta.get(key) or {}))
        names = {}
        for ext, fmt, kw in (('avif', 'AVIF', {}), ('webp', 'WEBP', {'method': 6}),
                             ('jpg', 'JPEG', {'progressive': True, 'optimize': True})):
            data = fit(ext, img, fmt, spec['budget'][ext] * KB, **kw)
            name = hashed(f'plate-{key}', ext, data)
            files[name] = data
            names[ext] = URL + name
        sun = sun_png(res['s_full'], spec['w'], spec['h'])
        sun_name = hashed(f'sun-{key}', 'png', sun)
        files[sun_name] = sun
        entry.update(w=spec['w'], h=spec['h'], **names, sun=URL + sun_name, shade=res['shade'],
                     shade_source=res['shade_source'], ls_ll=round(res['ls_ll'], 3),
                     contrast_p5=round(res['contrast_p5'], 3), top=res['top'], bottom=res['bottom'])
        entry.setdefault('leaves', {})
        # owned keys first, in a fixed order, then the hand-written ones
        new_meta[key] = {**{k: entry[k] for k in OWNED}, **{k: v for k, v in entry.items() if k not in OWNED}}

    # Link preview: the landscape plate scaled to 1200 wide (1200 x 800), its lower 630 px.
    og_img = imgs['l'].resize((1200, 800), Image.LANCZOS).crop((0, 170, 1200, 800))
    print('[og] encoding')
    og = fit('og', og_img, 'JPEG', OG_BUDGET, progressive=True, optimize=True)
    og_name = hashed('og', 'jpg', og)
    files[og_name] = og
    new_meta['og'] = URL + og_name

    for name, data in files.items():
        (out / name).write_bytes(data)
    meta_path.write_text(json.dumps(new_meta, indent=2, ensure_ascii=False) + '\n')

    named = set(files)
    for f in sorted(out.iterdir()):
        if re.match(r'(plate-.*|sun-.*|og\..*)$', f.name) and f.name not in named:
            f.unlink()
            print(f'deleted stale {f.name}')
    print(f'wrote {len(files)} files and plates.json to {out}')


if __name__ == '__main__':
    main()
