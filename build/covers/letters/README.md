# Cover letters

`editions/covers/letters/chairtax.json` holds the Chairtax cover's letters as SVG paths, traced from the concept tile. To regenerate it from the tile, run these commands in an empty work directory, with `REPO` set to the checkout:

```sh
TILE=$REPO/.captures/concepts/tiles/chairtax-e3.jpg   # the 554 px concept tile (gitignored, not committed)
L=$REPO/build/covers/letters
python3 $L/comps.py $TILE && python3 $L/bearmask.py $TILE
node $L/glyphs.mjs
python3 $L/fields.py $TILE && python3 $L/trace.py $REPO/editions/covers/letters/chairtax.json
```

The steps:
- `comps.py` finds the concept's letters.
- `bearmask.py` finds its bear.
- `glyphs.mjs` (with `glyphs.html`) renders the fitted Nunito glyphs that fill the parts the bear hides.
- `fields.py` builds each letter's coverage at 4×.
- `trace.py` traces it.

## Other covers

LikeWiki and Clauded have their letters traced from their concept tiles the same way, without the hidden-part steps. The best fonts of a per-letter sweep (Inter 800 for LikeWiki, IoU 0.93; Newsreader 800 for Clauded, IoU 0.88) left the band 5 px either side of the concept's letter edges at a mean ΔE76 of 14.0 and 12.7, so the concept's own letters are traced. Each cover has a config beside these scripts (`likewiki.json`, `clauded.json`). The config names the tile, each word's colour rule, rows, ink and ground, the trace settings, and any repairs. A repair fills a part of a concept letter that a field or shadow bites into, or cuts a stray flare, with a polygon in tile pixels. To regenerate a cover's letters, run these commands in an empty work directory:

```sh
SLUG=likewiki   # or clauded
TILE=$REPO/.captures/concepts/tiles/$(python3 -c "import json;print(json.load(open('$L/$SLUG.json'))['tile'])").jpg
python3 $L/comps.py --config $L/$SLUG.json $TILE
python3 $L/fields.py --config $L/$SLUG.json $TILE
python3 $L/trace.py $REPO/editions/covers/letters/$SLUG.json
```

- `comps.py --config` finds each word's letters by its colour rule.
- `fields.py --config` unmixes each letter's ink from the ground it stands on, at 4x the tile, and applies the repairs.
- `trace.py` traces the fields as for Chairtax. A tile that is not square maps to the cover with its own scale on each axis.

The Python steps need Pillow. `glyphs.mjs` needs headless Chrome and the board-tools puppeteer-core.

## Font

`nunito-900-cover.woff2` is the Nunito the glyphs come from. `glyphs.mjs` reads it from this folder unless it is given another file.

- Nunito (Vernon Adams, Cyreal, Jacques Le Bailly), gstatic v32, wght 900.
- Glyphs "Caihrtx" (from "Chair" and "tax"), fetched with `css2?family=Nunito:wght@900&text=Chairtx`.
- 1 492 bytes, sha256 a0749318d5c4164bcc4ace46f2dfc5d1fcefa0ae6a9e04cc3e7ffa91c21eac01.
- Licence OFL-1.1 (https://github.com/googlefonts/nunito).

It was chosen by fitting 35 OFL candidates (Fredoka, Baloo 2, Rubik, Lilita One, Gabarito, Inter and others) letter by letter to the concept. Gabarito and Inter 900 fit a little closer (IoU 0.87 against 0.85), but their terminals are square and the concept's lettering is rounded. The glyph placements in `glyphs.html` put every letter box within 1.4% of the concept's.
