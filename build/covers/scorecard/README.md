# Scorecard cover fit

Scorecard's front (`MOTIFS.scorecard` in editions/covers/covers.js) is fitted to its concept tile:

    /Users/neil/dev/njct.io-editions-covers/.captures/concepts/tiles/scorecard-a1.jpg

The tile is gitignored and stays out of git. It is a photo of the sleeve: the scripts cut it to the cover's box
(3, 1, 568, 562) and resample it to 566 px. They need numpy, pillow and scipy:

    uv run -q --with numpy --with pillow --with scipy python <script> ...

## Regenerate the motif

    python fit.py <tile> fit.json        # refits from fit.json's geometry; writes fit.json and sim.png to the cwd (about 2 minutes)
    python gen.py fit.json <repo>/editions/covers/covers.js

`fit.json` here is the committed fit; `gen.py` on it writes the motif in covers.js byte for byte.

The model: the vertical and horizontal splits, three field diagonals (the blue triangle top left, the dark green
lower left, the navy lower right), the disc (an ellipse 151.8 x 148.9 px, as the photo shows it) with its own splits
and one wedge line across it (the light blue and yellow wedges, 43.4 degrees), an edge 2 px wide and a dark seam
where regions meet. Each of the 13 regions' colour is a cubic in x and y in linear light. The letters are traced
(build/covers/letters, `--cover scorecard`).
