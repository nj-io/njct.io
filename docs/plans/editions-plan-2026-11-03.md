# njct.io Editions — plan

**Branch:** `feat/editions` · **Worktree:** `~/dev/njct.io-editions` · **Dev URL:** `http://127.0.0.1:8750/editions/`

The live site stays on `main` until the operator rules ship. During the 2026-11-02 credential incident this branch is local only: no push, no `git fetch`/pull/merge from `origin`, no `npm install`, no Cloudflare deploy.

## The design

Each project is a record sleeve on a shelf wall, in the interaction model of Shopify Editions (`https://www.shopify.com/editions`). The experience is matched; every asset, word and image is njct.io's own. Everything visual is generated at runtime in three.js: shelf geometry, lighting, shadows, covers, record. The page downloads code only — no model files, no cover images.

| Shopify Editions | njct.io Editions |
|---|---|
| 10 editions on 2 shelves (5 + 5) | 10 sleeves on 2 shelves (5 + 5): the 9 projects plus "About Neil" |
| Illustrated cover images | Procedural cover shader per project, seeded from its name, in its accent colours; the hovered sleeve's cover animates |
| Shadow catcher baked into a model | Soft contact shadows rendered once at load into a texture; studio light from three.js `RoomEnvironment` through `PMREMGenerator` |
| Record model | Procedural vinyl disc: groove normal pattern with anisotropic sheen, the project's logo on the label |
| Details: sleeve to front, background blur, Space flips | Same; the back cover carries the project's figures, stack and link |
| Open: the edition's own WebGL world, then a long page | The project's own procedural scene (its Gray-Scott culture from the current site), then its dossier |
| Bottom timeline | Bottom index: year and name per project |
| Phone: record-crate stack, bottom bar | Same model |

## Reference measurements (teardown 2026-11-03)

| Item | Measured |
|---|---|
| Engine | three.js r181, one full-viewport canvas |
| Ground | `rgb(205,205,205)`, lighter toward the centre |
| Type | Inter Variable — 14 px / 500 header, 14 px / 400 tagline and buttons, 11 px timeline |
| Layout at 1440×900 | Two shelves centred; sleeves about 200 px square; Open/Details pills at the sleeve's lower left (y 351 row 1, y 602–607 row 2; x 191, 418, 648, 879, 1106) |
| Intro | Empty ground, then sleeves land one after another between about 0.9 s and 1.8 s after first paint |
| Cursor | No camera parallax |
| Hover | Sleeve lifts toward the camera; Open and Details pills appear on it |
| Details | Sleeve flies to the centre-right at about 2.5× size; shelf blurs; title and tagline at left; "Now playing" sticker; Open button below; Space flips; Escape exits |
| Open | Cut to the edition's world (dark navy, network-graph scene, giant vertical title), then a page about 46,600 px tall |
| Phone (390×844) | Sleeves stacked in perspective like a crate; scroll rail at right; bottom bar with season, name, Details, Open; mute toggle top right |
| Weight | 1.2 MB scripts, 1.2 MB images (62), 2 videos 0.5 MB, models 49 KB |

## Budgets

| Budget | Target |
|---|---|
| Total transfer, first view | under 600 KB |
| First rendered frame | under 1.5 s on a phone over 4G |
| Frame rate | 60 fps on iPhone 13 and M1; never below 50 during motion |
| three.js | `vendor/three-0.181.0` (verified against the npm registry integrity hash; see `SOURCE.txt`) |

## Phases

| # | Phase | Exit |
|---|---|---|
| 0 | Worktree, vendored three.js, comparison harness, stub page | Harness produces a side-by-side sheet for every moment |
| 1 | Shelf, light, soft shadows, intro drop with placeholder sleeves | Shelf, light and drop timing match on the checklist |
| 2 | Procedural cover system, titles, hover-alive state | Operator approves all covers |
| 3 | Hover, record slide, Details, blur, flip, keyboard | Motion checklist clear |
| 4 | Open: project scene and dossier | Every sleeve opens and returns cleanly |
| 5 | Phone crate view | Clean at 360 and 390 px |
| 6 | Speed, reduced motion, keyboard and screen-reader paths | Every budget met, measured |
| 7 | Ship: replaces njct.io, current site to `/classic` | Operator rules ship |

## Iteration

Every phase runs in rounds: build, capture ours and theirs at the same moments with `build/compare/capture.mjs`, critique against the checklist, fix. A round that finds nothing worth a fix closes the phase. Each round's capture is kept under `.captures/<round>/` (gitignored: it holds screenshots of a third-party site).

Checklist dimensions: per-motion timing and easing, lift height, blur strength, shadow softness and position, sleeve size and spacing, type size and weight, ground colour and falloff, frame rate, transfer size.

## Test hooks

The page exposes `window.__editions` for the harness only: `ready` (promise resolving after the first rendered frame), `firstFrameAt` (ms since navigation start), `sleeveRect(i)` (viewport rect of sleeve `i`), `count`.

## Decisions (operator, 2026-11-03)

1. Ten sleeves: the nine projects plus "About Neil", shelved 5 + 5.
2. Sound is in: procedural Web Audio (room tone, sleeve and record sounds) generated in code, behind a toggle that starts muted. Audio starts only after the visitor's first interaction.
3. One light studio look. Dark mode is out of scope for this version.
4. Every implementation step on this branch, first builds and fix rounds alike, runs on Opus at xhigh effort.
