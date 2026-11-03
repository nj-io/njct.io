"""Compose side-by-side pairs (theirs left, ours right) and index.html for one capture round.

usage: python3 build/compare/compose.py .captures/<round>
Reads <round>/<site>/meta.json, metrics.json and the PNGs next to them. Times are ms after the
moment's origin (navigation start, or the mouse, click or key that started the motion). A side that was not captured
(or whose moment is missing) is drawn as a blank panel.
"""
import html
import json
import os
import sys
from PIL import Image, ImageDraw, ImageFont

round_dir = os.path.abspath(sys.argv[1])
SIDES = ["theirs", "ours"]
GAP = 4
PANEL_W = 798          # two panels and the gap = 1600 px wide
LABEL_H = 34


def load_json(side, name):
    p = os.path.join(round_dir, side, name)
    return json.load(open(p)) if os.path.exists(p) else None


def font(size):
    for path in ("/System/Library/Fonts/Helvetica.ttc", "/System/Library/Fonts/SFNS.ttf"):
        try:
            return ImageFont.truetype(path, size)
        except OSError:
            pass
    return ImageFont.load_default(size)


F = font(16)
flat = lambda n: n.replace("/", "-")
meta = {s: load_json(s, "meta.json") for s in SIDES}
metrics = {s: load_json(s, "metrics.json") for s in SIDES}
recs = {s: {r["name"]: r for r in meta[s]["moments"]} if meta[s] else {} for s in SIDES}

# Capture order: theirs first, then any moment only ours has.
order = []
for s in SIDES:
    for r in meta[s]["moments"] if meta[s] else []:
        if r["name"] not in order:
            order.append(r["name"])


def timing(r):
    if r.get("ms") is None:
        return f"no frame (target {r['target']} ms)"
    return f"frame at {r['ms']} ms (target {r['target']}), on screen {r['ageMs']} ms by then"


def label(side, name):
    if not meta[side]:
        return f"{side.upper()} · not captured"
    r = recs[side].get(name)
    if not r:
        return f"{side.upper()} · {name} · missing"
    flag = "" if r["status"] == "ok" else f" · {r['status'].upper()}"
    at = "no frame" if r.get("ms") is None else f"{r['ms']} ms"
    return f"{side.upper()} · {name} · {at}{flag}"


def panel(side, name, height):
    img = Image.new("RGB", (PANEL_W, height + LABEL_H), (255, 255, 255))
    d = ImageDraw.Draw(img)
    r = recs[side].get(name)
    d.rectangle([0, 0, PANEL_W, LABEL_H], fill=(20, 20, 20) if not r or r["status"] == "ok" else (150, 0, 30))
    d.text((10, 8), label(side, name), fill=(255, 255, 255), font=F)
    src = os.path.join(round_dir, side, f"{name}.png")
    if os.path.exists(src):
        im = Image.open(src).convert("RGB")
        scale = min(PANEL_W / im.width, height / im.height)
        im = im.resize((round(im.width * scale), round(im.height * scale)), Image.LANCZOS)
        img.paste(im, ((PANEL_W - im.width) // 2, LABEL_H))
    else:
        d.text((10, LABEL_H + 10), "(no image)", fill=(120, 120, 120), font=F)
    return img


for name in order:
    height = 800 if name.startswith("phone") else 500   # 1440x900 scales to 798x499
    pair = Image.new("RGB", (PANEL_W * 2 + GAP, height + LABEL_H), (255, 0, 255))
    for i, s in enumerate(SIDES):
        pair.paste(panel(s, name, height), (i * (PANEL_W + GAP), 0))
    pair.save(os.path.join(round_dir, f"pair-{flat(name)}.jpg"), quality=88)


# ---- 4x crops: the same CSS-pixel rectangle from both sides, side by side ----------
# (name, moment, x, y, w, h) in CSS px at 1440x900. A dpr2 moment's PNG is 2x, so it is enlarged 2x.
CROPS = [
    ("sleeve0-topleft", "rest", 150, 190, 80, 60),
    ("sleeve0-contact", "rest", 150, 370, 130, 60),
    ("shelf-front", "rest", 1240, 380, 90, 50),
    ("header-type", "rest", 8, 8, 240, 92),
    ("index-label", "rest", 180, 826, 110, 52),
    ("pills", "hover0-1000", 150, 320, 200, 70),
    ("details-title", "details-held", 20, 370, 300, 100),
    ("details-open", "details-held", 660, 645, 120, 70),
    ("details-sticker", "details-held", 790, 235, 130, 120),
    ("details-record", "details-held", 880, 300, 220, 280),
    ("flip-back-type", "flip-held", 515, 230, 300, 300),   # theirs' back list (y 240-365) and ours' back type (y 375-530)
]
crops = []
for cname, moment, x, y, w, h in CROPS:
    for prefix in ("", "dpr2/"):
        m = prefix + moment
        srcs = {s: os.path.join(round_dir, s, f"{m}.png") for s in SIDES}
        if not any(os.path.exists(v) for v in srcs.values()):
            continue
        panels = []
        for s in SIDES:
            img = Image.new("RGB", (w * 4, h * 4 + LABEL_H), (255, 255, 255))
            d = ImageDraw.Draw(img)
            d.rectangle([0, 0, w * 4, LABEL_H], fill=(20, 20, 20))
            d.text((8, 8), f"{s.upper()} · {prefix}{cname}", fill=(255, 255, 255), font=F)
            if os.path.exists(srcs[s]):
                im = Image.open(srcs[s]).convert("RGB")
                k = im.width / 1440
                c = im.crop((round(x * k), round(y * k), round((x + w) * k), round((y + h) * k)))
                img.paste(c.resize((w * 4, h * 4), Image.NEAREST), (0, LABEL_H))
            panels.append(img)
        out_img = Image.new("RGB", (w * 8 + GAP, h * 4 + LABEL_H), (255, 0, 255))
        out_img.paste(panels[0], (0, 0)); out_img.paste(panels[1], (w * 4 + GAP, 0))
        fname = f"crop-{flat(prefix)}{cname}.png"
        out_img.save(os.path.join(round_dir, fname))
        crops.append((f"{prefix}{cname}", fname, m, (x, y, w, h)))


# ---- index.html ---------------------------------------------------------------
def kb(n):
    return "-" if n is None else f"{n / 1024:.0f} KB"


def metric_rows():
    g = lambda s, k: metrics[s].get(k) if metrics[s] else None
    rows = []
    for key, title in [("requests", "Requests (first 10 s)"), ("transferredBytes", "Transferred (first 10 s)"),
                       ("domContentLoadedMs", "DOMContentLoaded (ms)"), ("loadMs", "Load event (ms)"),
                       ("firstFrameAtMs", "First rendered frame (ms)"), ("fps", "rAF rate at rest (fps, 3 s)")]:
        cells = [kb(g(s, key)) if key == "transferredBytes" else ("-" if g(s, key) is None else g(s, key)) for s in SIDES]
        rows.append((title, *cells))
    for key, title in [("introCadence", "Intro frames (2.5 s from first canvas frame)"), ("hoverCadence", "Hover frames (1 s)")]:
        cells = []
        for s in SIDES:
            c = (metrics[s] or {}).get(key)
            cells.append(f"{c['fps']} fps, {c['longFrames']} gaps > 25 ms, worst {c['worstMs']} ms" if c else "-")
        rows.append((title, *cells))
    types = sorted(set().union(*[(metrics[s] or {}).get("byType", {}).keys() for s in SIDES]))
    for t in types:
        cells = []
        for s in SIDES:
            bt = (metrics[s] or {}).get("byType", {}).get(t)
            cells.append(f"{bt['requests']} req, {kb(bt['bytes'])}" if bt else "-")
        rows.append((f"{t}", *cells))
    rows.append(("URL after Open", *[g(s, "urlAfterOpen") or "-" for s in SIDES]))
    return rows


esc = lambda v: html.escape(str(v))
rname = os.path.basename(round_dir)
out = [f"<!doctype html><html lang=en><meta charset=utf-8><meta name=viewport content='width=device-width,initial-scale=1'>"
       f"<title>Capture round {esc(rname)}</title>",
       "<style>body{font:14px system-ui,sans-serif;margin:16px;background:#f4f4f4;color:#111}"
       "table{border-collapse:collapse;background:#fff}td,th{border:1px solid #ccc;padding:4px 10px;text-align:left}"
       "img{max-width:100%;height:auto;display:block;border:1px solid #999}section{margin:24px 0}h2{margin:0 0 6px;font-size:16px}"
       ".bad{color:#b00020;font-weight:600}.meta{color:#444;margin:0 0 6px}nav a{margin-right:8px}</style>",
       f"<h1>Capture round {esc(rname)}</h1>",
       "<p>" + "<br>".join(f"{s}: {esc(meta[s]['url'])} · captured {esc(meta[s]['capturedAt'])}" if meta[s] else f"{s}: not captured" for s in SIDES) + "</p>",
       "<h2>Metrics</h2><table><tr><th></th><th>theirs</th><th>ours</th></tr>"]
for title, a, b in metric_rows():
    out.append(f"<tr><td>{esc(title)}</td><td>{esc(a)}</td><td>{esc(b)}</td></tr>")
out.append("</table>")
for s in SIDES:
    errs = (metrics[s] or {}).get("pageErrors")
    if errs:
        out.append(f"<p class=bad>{s} page errors: {esc('; '.join(errs))}</p>")
out.append("<h2 style='margin-top:24px'>Moments, in capture order</h2><nav>"
           + "".join(f"<a href='#{esc(flat(n))}'>{esc(n)}</a>" for n in order) + "</nav>")
for name in order:
    parts = []
    for s in SIDES:
        r = recs[s].get(name)
        if r:
            cls = "" if r["status"] == "ok" else " class=bad"
            note = f" · {esc(r['note'])}" if r.get("note") else ""
            parts.append(f"<span{cls}>{s}: {esc(timing(r))}, {esc(r['status'])}{note}</span>")
        else:
            parts.append(f"{s}: -")
    full = " ".join(f"<a href='{s}/{esc(name)}.png'>{s} full size</a>"
                    for s in SIDES if os.path.exists(os.path.join(round_dir, s, f"{name}.png")))
    out.append(f"<section id='{esc(flat(name))}'><h2>{esc(name)}</h2><p class=meta>{' | '.join(parts)} | {full}</p>"
               f"<img loading=lazy src='pair-{esc(flat(name))}.jpg' alt='{esc(name)}'></section>")
if crops:
    out.append("<h2 style='margin-top:24px'>Crops at 4x (CSS px rectangle, theirs left, ours right)</h2>")
    for cname, fname, m, (x, y, w, h) in crops:
        out.append(f"<section><h2>{esc(cname)}</h2><p class=meta>from {esc(m)} · x {x}, y {y}, {w}×{h}</p>"
                   f"<img loading=lazy src='{esc(fname)}' alt='{esc(cname)}' style='width:auto'></section>")
open(os.path.join(round_dir, "index.html"), "w").write("\n".join(out))
print(f"composed {len(order)} pairs -> {os.path.join(round_dir, 'index.html')}")
