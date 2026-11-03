# Topshine cover fit

Topshine's front (`TOPSHINE` in editions/covers/covers.js) is fitted to its concept tile:

    /Users/neil/dev/njct.io-editions-covers/.captures/concepts/tiles/topshine-a2.jpg

The tile is gitignored and stays out of git. The scripts need numpy, pillow and scipy:

    uv run -q --with numpy --with pillow --with scipy python <script> ...

## Regenerate TOPSHINE

Run from a scratch folder; both scripts write to the current directory.

    python fit.py <tile>                          # fields.json, sim.png, sim.npy (about 5 minutes)
    python gen.py <repo>/editions/covers/covers.js  # replaces the TOPSHINE block

`fit.py` fits the colour fields: uniform cubic B-spline fields (bsfit.py) for the ground and each analytic
feature's amplitude (rim, body, spine, quadrant creases, ring, haze, halo, orbs, streaks), in linear light.
`gen.py` quantises and packs them (codec.py) with the geometry from params.json.

## Geometry (params.json)

Each script prints its part of params.json; copy the result in by hand.

| Script | Part |
|---|---|
| `geom_star.py <tile>` | `star`: the four Bezier arcs of the star's outline |
| `geom_ring.py <tile>` | `ring`: the glass ring's ellipse |
| `geom_haze.py` | `haze`: the haze ring's ellipse |
| `geom_disc.py <tile> <cx> <cy> <r0> <r1>` | `orbs`: each orb's circle |
| `geom_specs.py <tile>` | `specs`: the orbs' highlight streaks, from sim.npy of a fit without them |
