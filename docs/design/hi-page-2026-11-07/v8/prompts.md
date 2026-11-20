# v8 prompts (the /hi background plates)

Model gpt26-sunburst (`gpt-image-2.6-sunburst`), image edits through `~/.claude/skills/generate-image`. Plan: `docs/plans/hi-page-v1-plan-2026-11-16.md` § 1 in the njct.io-hi worktree (`/Users/neil/dev/njct.io-hi`, branch `feat/hi`). Approved by Neil (D6) up to USD 0.30 in total for both plates, at most three attempts per plate.

Paths are relative to `/Users/neil/dev/njct.io/docs/design/hi-page-2026-11-07/`. Neil runs each attempt with the key in the process environment:

```
cd /Users/neil/dev/njct.io-hi && OPENAI_API_KEY="$(pbpaste)" build/hi-plates-generate.py portrait; pbcopy </dev/null
cd /Users/neil/dev/njct.io-hi && OPENAI_API_KEY="$(pbpaste)" build/hi-plates-generate.py landscape; pbcopy </dev/null
```

`build/hi-plates-generate.py` makes one attempt per run: it reads the prompt below, calls `generate_image.py` with the `-i` input and `--size` below, writes the next free `v8/plate-<kind>-<n>.png` and appends the attempt to `## Attempts`. It refuses a fourth attempt for a plate and any attempt that could take the total past USD 0.30 (ledger tag `hi-plate`). `--dry-run` prints the request body without a key.

| Plate | `--size` | `-i` input | Output |
|---|---|---|---|
| portrait | 1024x1536 | `v7/1.png` | `v8/plate-portrait-<n>.png` |
| landscape | 1536x1024 | `v8/plate-portrait.png` (the accepted portrait plate: copy the chosen attempt to this name first) | `v8/plate-landscape-<n>.png` |

The accepted attempts are copied to `v8/plate-portrait.png` and `v8/plate-landscape.png`. `v8/src/` points at the scripts in the worktree.

## portrait

Edit this image into a clean background photograph with nothing on top of it. Remove every piece of text and every button: the Thai headline, the Thai line under it, the four rounded buttons and the black bar at the bottom, and paint the wall in behind them. Remove every leaf, flower and plant shadow from the wall. Keep the same pale warm grey plaster wall in the same light as the original: low late-afternoon sun from a window at the upper left, falling in broad, soft diagonal bands of warm light from upper left to lower right, with cooler soft shade between the bands, and the same depth of contrast between sun and shade as in the original. No plant, leaf or flower shapes anywhere in the light or in the shade, and no window frame in view. The upper two thirds of the image is calm open wall with only these bands of sun and shade, no objects. Keep the same high round café table with the same open silver laptop and the same flat white on its saucer, in the same style and light, a little smaller than in the original and lower in the frame: the top of the laptop screen at about two thirds of the image height, the tabletop at about 84 percent of the height, the table's pedestal running off the bottom edge. Keep the laptop, the cup and the table inside the middle 60 percent of the image width. No people, no hands, no human shadows. Photographic and natural, with the same colour and grain as the original. No text, no logos, no watermark, no border. Tall portrait, 2:3.

## landscape

Recompose this photograph as a wide 3:2 landscape of the same café corner, from the same camera height, with the same light, colour and grain. The same pale warm grey plaster wall fills the frame, in the same light as this photograph: the same low warm sun from the upper left in broad, soft diagonal bands, with cooler soft shade between them, at the same depth of contrast between sun and shade. No leaf, plant or flower shadows and no window frame in view. Place the same high round café table, with the same open silver laptop and the same flat white on its saucer, in the right third of the frame and low: the tabletop at about 80 percent of the height, its pedestal running off the bottom edge. The left 55 percent of the frame is calm open wall with only these bands of sun and shade. No people, no hands, no human shadows, no text, no logos, no watermark, no border.

## Attempts

- 2026-11-16 09:57 portrait attempt 1: `v8/plate-portrait-1.png`, input `v7/1.png`, cost: $0.0199  (664 output tokens, measured)  [hi-plate]
- 2026-11-16 10:45 landscape attempt 1: `v8/plate-landscape-1.png`, input `v8/plate-portrait.png`, cost: $0.0199  (664 output tokens, measured)  [hi-plate]
