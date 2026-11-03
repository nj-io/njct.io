"""Copy the approved dossiers out of the live site into one file per project for the Editions pages.

usage: python3 build/extract-dossiers.py [path/to/njct.io/index.html]

Reads the built DOSSIERS block (between DOSSIERS:BEGIN and DOSSIERS:END) of the live index.html and writes
editions/data/dossiers/<slug>.json for every project on the shelf that has one. Text fields are copied
verbatim; the diagram is the light mermaid SVG (loLight). The AI pictures (hi, img) are left out.
"""
import json
import os
import re
import sys

HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.dirname(HERE)
SRC = sys.argv[1] if len(sys.argv) > 1 else os.path.expanduser("~/dev/njct.io/index.html")
OUT = os.path.join(ROOT, "editions", "data", "dossiers")
FIELDS = ["what", "glance", "archHi", "arch", "proc", "loCap"]


def slug(name):
    return re.sub(r"[^a-z0-9]+", "-", name.lower()).strip("-")


html = open(SRC, encoding="utf-8").read()
block = html[html.index("// DOSSIERS:BEGIN"):html.index("DOSSIERS:END")]
dossiers = json.loads(re.search(r"const DOSSIERS = (\{.*\});\s*\n", block, re.S).group(1))
shelf = json.load(open(os.path.join(ROOT, "editions", "data", "projects.json"), encoding="utf-8"))
os.makedirs(OUT, exist_ok=True)
for entry in shelf:
    d = dossiers.get(entry["name"])
    if not d:
        continue
    out = {"name": entry["name"], **{k: d[k] for k in FIELDS if k in d}, "diagram": d.get("loLight")}
    path = os.path.join(OUT, slug(entry["name"]) + ".json")
    with open(path, "w", encoding="utf-8") as f:
        json.dump(out, f, ensure_ascii=False, separators=(",", ":"))
    print(f"{os.path.relpath(path, ROOT)}  {os.path.getsize(path):>7} bytes")
