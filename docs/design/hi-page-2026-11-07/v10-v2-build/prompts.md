# v10 prompts (17 Nov 2026)

## landscape plate (outpaint of v9-video/keys4/empty.png, cropped to x 0..936, scaled to 624x1024, placed at x 912 of 1536x1024)

Extend this photo to the left so it becomes a wide landscape photo. The right part, with the small round cafe table, the laptop and the coffee cup, stays exactly as it is. Fill the whole left part with the same plain warm-grey wall and continue the same diagonal stripes of late-afternoon sunlight across it, seamlessly, matching the light and texture. No other objects, no people, no text.

Try 1 (work/l-raw-1-corner.png, $0.0199) rejected: the stripes turned horizontal on the left, reading as a wall corner.

Try 2:

Extend this photo to the left so it becomes a wide landscape photo of one flat wall. The right part, with the small round cafe table, the laptop and the coffee cup, stays exactly as it is. The wall is one flat surface with no corner. The diagonal stripes of warm late-afternoon sunlight continue straight across the whole wall at exactly the same slope as on the right, rising toward the upper left, each stripe one continuous straight band. Plain warm-grey wall texture, no other objects, no people, no text.

- try 2: $0.0199, kept (stripes sweep in one curve). The exact photo is pasted back over x 912..1536 with a 48 px ramp.

## Matting (17 Nov 2026)
No model generations. Known-background matting in `src/matte.py` (local, free). Tried locally and rejected: RobustVideoMatting resnet50 (MPS), Real-ESRGAN x2. Cost USD 0.

## Spend for the v2 build
Landscape outpaint, gpt-image-2.6-sunburst, 2 tries: USD 0.0398 (measured). Everything else local. Total USD 0.04 of the USD 5 allowed.
