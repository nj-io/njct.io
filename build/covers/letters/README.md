# Cover letters

`editions/covers/letters/<cover>.json` holds a cover's letters as SVG paths, traced from its concept tile: Chairtax, stet, Social Hook and About Neil. The scripts take `--cover chairtax|stet|social-hook|about` (Chairtax by default; `comps.py` serves Chairtax, Social Hook and About Neil).

## Chairtax

To regenerate `chairtax.json` from the tile, run these commands in an empty work directory, with `REPO` set to the checkout:

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

The Python steps need Pillow. `glyphs.mjs` needs headless Chrome and the board-tools puppeteer-core.

## stet

To regenerate `stet.json` from the tile, in an empty work directory:

```sh
TILE=$REPO/.captures/concepts/tiles/stet-a3.jpg   # the 546 px concept tile (gitignored, not committed)
L=$REPO/build/covers/letters
python3 $L/fields.py $TILE --cover stet && python3 $L/trace.py $REPO/editions/covers/letters/stet.json --cover stet
```

- `fields.py --cover stet` finds the letters as the parts of the tile above luma 95: the s, the first t, and the e with the last t, which touch along the t's stem. Every pixel above luma 50 goes to the part nearest it, so the one-pixel gap between the s and the t keeps them apart. Each letter's coverage at 4× is its luma between the ground and the letter's own interior near the pixel, since its letters are shaded in many colours. The tile's last two columns are its crop border, and the last t runs on through them.
- `trace.py --cover stet` traces at 546 px and moves each corner to where the straight edges either side of it meet, so the cuts stay as sharp as the concept's.
- The shader parts the joined e and t's colour fields along the seam (`SEAM` in the stet motif).

Only Pillow is needed.

## Chairtax font

`nunito-900-cover.woff2` is the Nunito the glyphs come from. `glyphs.mjs` reads it from this folder unless it is given another file.

- Nunito (Vernon Adams, Cyreal, Jacques Le Bailly), gstatic v32, wght 900.
- Glyphs "Caihrtx" (from "Chair" and "tax"), fetched with `css2?family=Nunito:wght@900&text=Chairtx`.
- 1 492 bytes, sha256 a0749318d5c4164bcc4ace46f2dfc5d1fcefa0ae6a9e04cc3e7ffa91c21eac01.
- Licence OFL-1.1 (https://github.com/googlefonts/nunito).

It was chosen by fitting 35 OFL candidates (Fredoka, Baloo 2, Rubik, Lilita One, Gabarito, Inter and others) letter by letter to the concept. Gabarito and Inter 900 fit a little closer (IoU 0.87 against 0.85), but their terminals are square and the concept's lettering is rounded. The glyph placements in `glyphs.html` put every letter box within 1.4% of the concept's.

## Social Hook

`editions/covers/letters/social-hook.json` holds the Social Hook cover's white letters, traced from its concept tile. Letters that touch in the concept (S with H, o with c, the two o's of Hook) stay one outline. To regenerate it, run in an empty work directory:

```sh
TILE=$REPO/.captures/concepts/tiles/social-hook-a1.jpg   # 577 x 571 with a grey margin; comps.py cuts the cover out and scales it to 554 px
L=$REPO/build/covers/letters
python3 $L/comps.py $TILE --cover social-hook
python3 $L/fields.py $TILE --cover social-hook
python3 $L/trace.py $REPO/editions/covers/letters/social-hook.json --cover social-hook
```

- `comps.py` cuts the tile to the cover (`TILE_BOX`), saves `tile554.png` and finds the white letter parts.
- `fields.py` fills the ground in under the letters from the pixels around them and takes each pixel's coverage as its distance from that ground towards white, at 4×.
- `trace.py` traces it as for Chairtax.

A font fit came first: 66 OFL faces fitted letter by letter, Geologica 900 best at IoU 0.937. Set that way, the letter-edge band measured 14.6 ΔE, above the gate's 12. Traced, it measures 4.0.

## About Neil

`editions/covers/letters/about.json` holds the About Neil cover's gold "Neil", traced from its concept tile. To regenerate it, run in an empty work directory:

```sh
TILE=$REPO/.captures/concepts/tiles/about-b4.jpg   # 581 x 580 with a grey margin; comps.py cuts the cover out and scales it to 554 px
L=$REPO/build/covers/letters
python3 $L/comps.py $TILE --cover about
python3 $L/fields.py $TILE --cover about
python3 $L/trace.py $REPO/editions/covers/letters/about.json --cover about
```

`fields.py` takes each pixel's coverage as its distance from the local paper towards the letter's own gold. The gold is filled out from the letter's interior, because it shades top to bottom and carries grain. The paper fill widens its blur where the gaps inside the word leave too little paper near.
