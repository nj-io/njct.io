#!/usr/bin/env python3
"""Integrates dossier content (text, mermaid diagrams, images) into index.html.

Reads dossiers.json from the content directory (default: the session scratchpad),
renders each project's mermaid source to dark+light inline SVG via mermaid-cli
(system Chrome), compresses any referenced images to embeddable JPEGs, and
replaces the block between the DOSSIERS:BEGIN / DOSSIERS:END markers.

Usage: python3 build/integrate-dossiers.py [content-dir]
"""
import base64
import json
import pathlib
import re
import subprocess
import sys
import tempfile

REPO = pathlib.Path(__file__).resolve().parent.parent
INDEX = REPO / "index.html"
BUILD = REPO / "build"
CONTENT = pathlib.Path(sys.argv[1]) if len(sys.argv) > 1 else REPO / "content"

SLUGS = {
    "Mirra": "mirra", "Social Hook": "social-hook", "Clauded": "clauded",
    "LikeWiki": "likewiki", "Track Record": "track-record",
    "Claude Historian": "historian", "Xactions": "xactions",
    "Stellar Explorer": "stellar",
}
LO_CAP = "Under the hood — the working architecture."


def render_mermaid(src: str, theme_cfg: pathlib.Path, out_svg: pathlib.Path) -> str:
    with tempfile.NamedTemporaryFile("w", suffix=".mmd", delete=False) as f:
        f.write(src)
        mmd = f.name
    subprocess.run(
        ["npx", "-y", "@mermaid-js/mermaid-cli", "-p", str(BUILD / "pptr.json"),
         "-c", str(theme_cfg), "-i", mmd, "-o", str(out_svg), "-b", "transparent"],
        check=True, capture_output=True)
    return out_svg.read_text()


def namespace_svg(svg: str, prefix: str) -> str:
    """Prefix every id — including the id SELECTORS inside mermaid's embedded
    stylesheet, or the whole theme sheet stops matching and the diagram
    renders SVG-default black."""
    ids = set(re.findall(r'id="([^"]+)"', svg))
    for i in sorted(ids, key=len, reverse=True):
        svg = svg.replace(f'id="{i}"', f'id="{prefix}-{i}"')
        svg = svg.replace(f'#{i}', f'#{prefix}-{i}')
    svg = re.sub(r'<\?xml[^>]*\?>', '', svg).strip()
    return svg


def embed_image(path: pathlib.Path, max_w: int = 1100, quality: int = 68) -> str:
    out = path.with_suffix(".embed.jpg")
    subprocess.run(["sips", "-Z", str(max_w), "-s", "format", "jpeg",
                    "-s", "formatOptions", str(quality), str(path), "--out", str(out)],
                   check=True, capture_output=True)
    data = base64.b64encode(out.read_bytes()).decode()
    return f"data:image/jpeg;base64,{data}"


def main() -> None:
    data = json.loads((CONTENT / "dossiers.json").read_text())
    dossiers = {}
    for name, d in data.items():
        slug = SLUGS[name]
        entry = {"what": d["what"], "arch": d["arch"], "proc": d["proc"], "loCap": LO_CAP}
        if d.get("glance"):
            entry["glance"] = d["glance"]
        if d.get("archHi"):
            entry["archHi"] = d["archHi"]
        if d.get("mermaid"):
            for theme in ("dark", "light"):
                svg = render_mermaid(d["mermaid"], BUILD / f"mm-{theme}.json",
                                     CONTENT / f"{slug}-{theme}.svg")
                entry["loDark" if theme == "dark" else "loLight"] = \
                    namespace_svg(svg, f"{slug}-{theme}")
        hi = d.get("hiImage")
        if hi and (CONTENT / hi).exists():
            entry["hi"] = embed_image(CONTENT / hi)
            entry["hiCap"] = d.get("hiCaption") or ""
        img = d.get("image")
        if img and (CONTENT / img).exists():
            entry["img"] = embed_image(CONTENT / img)
            entry["imgCap"] = d.get("imageCaption") or ""
        dossiers[name] = entry
        print(f"{name}: mermaid={'yes' if 'loDark' in entry else 'no'} "
              f"hi={'yes' if 'hi' in entry else 'no'} img={'yes' if 'img' in entry else 'no'}")

    block = ("// DOSSIERS:BEGIN — replaced by build/integrate-dossiers.py\n"
             "const DOSSIERS = " + json.dumps(dossiers, ensure_ascii=False) + ";\n"
             "// DOSSIERS:END")
    src = INDEX.read_text()
    # replacement must be a callable: a literal replacement string would have
    # its \n escape sequences interpreted, splitting JS strings mid-literal
    new = re.sub(r"// DOSSIERS:BEGIN.*?// DOSSIERS:END", lambda m: block, src, count=1, flags=re.S)
    assert new != src, "markers not found or content unchanged"
    INDEX.write_text(new)
    print(f"index.html now {INDEX.stat().st_size / 1024:.0f} KB")


if __name__ == "__main__":
    main()
