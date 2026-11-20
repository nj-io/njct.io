# Matte review, 17 Nov 2026

The man's matte for the hi-page loop, re-done end to end. Source: `src/matte.py` (the method) and `src/composite.py`
(the frame loop); encode: `src/encode.sh`. Before/after sheets in this folder; "before" is the thresholded
difference matte the page had at 00:04, "after" is the known-background matte now installed.

## Method chosen: known-background matting (analytic), in `src/matte.py`

Each clip's own still frame (A: its first frame, B: its last) is the exact background of every video pixel, so in the
band around the man a pixel is a mix I = a F + (1 - a) B with B known per pixel. The alpha is the size of the change
relative to the local foreground contrast:

    a = (|I - B| - n) / (|F - B| - n)        F = colour of the nearest solid-foreground pixel, n = 5 (noise floor)

Dark curls against the bright wall give a long, clean ramp (|F - B| about 180), so the alpha follows each curl's
silhouette instead of a thresholded blob; skin and shirt (contrast 50-80) get a shorter ramp and a hard edge. Pieces
around it:

- the still is corrected per frame by a smooth drift field (the generated clip's flicker and slow glow, sampled where
  nothing moves), which keeps the band's noise floor at about 5 levels;
- a quarter-res footprint (threshold 13, closed, opened, holes filled) bounds the work; 12 px inside its edge alpha is
  forced to 1, so the white shirt or the cup against a same-coloured plate never go see-through; sizeable patches
  deep inside that still equal the still (the wall between the raised arm and the body during the sip) are carved
  back out;
- the composite is I + (1 - a)(P - B): the video pixel with its share of the video's wall swapped for the plate's, so
  curl fringes keep their exact look and the plate's grain and leaf shadows show through them; below a = 0.12 the
  video's residual change is faded out so the plate shows exactly;
- over the plate's cup and saucer (`CUP_RECTS`, two plate rectangles) the alpha is a hard threshold on the change
  widened by 2 px: the plate's crisp cup must be hidden completely wherever the video shows something else (the
  cup's shaded side matches the wall, and its lower body matches the saucer, so the ratio alpha alone leaves a ghost
  rim and handle); the carve-out above skips the table top (`OBJECT_ZONE`);
- left of plate x = 400 (`MAN_X0`) alpha is zero: the man never crosses it, and the laptop lid's sun stripe and the
  table stem drift in the generated clip B's first second (frames 108-128), which used to put a blocky patch of the
  video's lid over the plate's.

Why this over the alternatives: the background is known exactly, aligned to the pixel, and the video's wall is within
2-4 levels (p90 under 7) of the plate once colour-fitted, so the colour-difference signal is as good as it gets; a
learned matte cannot use that and adds its own blur.

## Tried and rejected

| Method | Result | Sheet |
|---|---|---|
| Thresholded difference matte (before) | a blob with a 6-10 px soft rim: a shadow-free halo around the hair and the quarter-res staircase at the hairline; stray lines on the laptop edge | `hair-all.png` cols 2-4 |
| Projection alpha, F = nearest core pixel 12 px in | right for hair, wrong at the brow and jaw where the edge is darker than the skin F (alpha 0.1-0.3 on solid pixels) | `rejected-projection-alpha.png` |
| RobustVideoMatting resnet50 (local, MPS, 13 s for 213 frames) | hair rim bloated by about 5 px and blurry, cuts the arm at frame 100, misses the cup and his back at the video's edge; no use of the known background | `rejected-rvm-resnet50.png` |
| Real-ESRGAN x2 on the frames before matting | hair visibly crisper (Laplacian energy 4.5 -> 8.3) but frame-to-frame change in the hair doubles (0.38 -> 0.69 mean abs), i.e. it boils; skin goes painterly; the page shows the plate at about 0.6x, where the gain vanishes | `rejected-realesrgan-x2.png` |
| BackgroundMattingV2 (learned, takes the background) | not run: weights only on Google Drive, and the analytic method already uses the exact background | |

No paid calls were made (USD 0).

## Measured

- Hair edge: the 50 % alpha contour sits 5-6 px inside the footprint edge; the band's alpha is non-zero only 2-3 px
  beyond the visible curls (`hair-zoom3x.png`, `hair-all.png`: the test shade reaches the hair, no shade-free rim).
- Stability (`stability.txt`): mean |alpha(t+1) - alpha(t)| over the band is the same as before (0.003-0.03 per
  frame in the still and walking stretches, 0.17 while he walks out), with no temporal widening; the consecutive
  mattes in `matte-consecutive.png` do not boil.
- Clip join (frame 107 -> 108): the man's mean colour moves 0.5 levels.
- Enclosed wall forced to alpha 1 (outside the cup zone): worst frame 194 px (was 1249 px before the carve-out).
- Files (864 x 2624, 24 fps, 213 frames, BT.709 matrix, limited range, sRGB transfer tag 13 in both):
  `out/loop.mp4` 1,367,270 bytes (H.264 CRF 23, was 1,491,937), `out/loop.webm` 1,135,635 bytes (VP9 CRF 34, was
  1,325,125). Both under the 1.6 MB line without touching the CRFs; the cleaner matte half compresses better.
  Installed as `hi/loop.41992fe2.mp4` and `hi/loop.ea856905.webm` (sha256 prefixes), `hi/plates.json` video.mp4
  and video.webm updated, `node build/hi.mjs --release` run (hi.html differs by that one PLATES line).

## Remaining weaknesses

- The source is 480p: the curls are soft by nature and the alpha cannot be crisper than the video's edge (2-3 px
  ramp at full size). The page shows the plate at roughly 0.6x, which hides most of it.
- Where the sunlit stripe crosses the hair, faint fringe pixels (alpha under 0.15) take a little shade; physically
  right, but the fringe reads marginally thinner there.
- Inside `CUP_RECTS` the hard alpha shows the video's wall and table (not the plate's) in a cup-sized patch while
  the cup is lifted; the two differ by under 6 levels. Right of the saucer, on the table top, the man's reflection
  and the clip's glow give a partial alpha (0.3-0.6) in some sipping frames (100-130); it only matters if the sun
  mask lets leaf shade fall on the table there.
- At the video's right edge (plate x = 937) the man is cut by the clip, as before; the plate continues beyond it.
- Frames 108-128: the laptop lid in clip B drifts against its still; it is now excluded by `MAN_X0`, not matched.

## For the page side

- Use the matte as it is: no dilation or erosion and no threshold. It is a true alpha (0..255); the leaf cut should
  scale with it (destination-out with the matte's value), which the page already does.
- The matte's fine fringe is 2-3 px at full size; the 432 x 656 mask canvas halves that, which is fine.
- The matte half is zero outside the man, so the bottom half compresses well; at CRF 23 the files are under 1.5 MB.
