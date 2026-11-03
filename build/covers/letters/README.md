# Chairtax cover letters

`editions/covers/letters/chairtax.json` holds the Chairtax cover's letters as SVG paths, traced from the concept tile. To regenerate it from the tile, run these commands in an empty work directory, with `REPO` set to the checkout:

```sh
TILE=$REPO/.captures/concepts/tiles/chairtax-e3.jpg   # the 554 px concept tile (gitignored, not committed)
L=$REPO/build/covers/letters
python3 $L/comps.py $TILE && python3 $L/bearmask.py $TILE
node $L/glyphs.mjs nunito-900.woff2
python3 $L/fields.py $TILE && python3 $L/trace.py $REPO/editions/covers/letters/chairtax.json
```

The steps:
- `comps.py` finds the concept's letters.
- `bearmask.py` finds its bear.
- `glyphs.mjs` (with `glyphs.html`) renders the fitted Nunito glyphs that fill the parts the bear hides.
- `fields.py` builds each letter's coverage at 4×.
- `trace.py` traces it.

`nunito-900.woff2` is any Nunito 900 file with the glyphs C h a i r t x, for example `https://fonts.googleapis.com/css2?family=Nunito:wght@900&text=Chairtx` (gstatic v32).

The Python steps need Pillow. `glyphs.mjs` needs headless Chrome and the board-tools puppeteer-core.
