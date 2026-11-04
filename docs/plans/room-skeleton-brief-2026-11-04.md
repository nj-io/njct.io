# Editions v2: the room skeleton

- **Branch:** `feat/room`, cut from `feat/editions`.
- **Status:** v1 (the record wall) is built and frozen on `feat/editions`. This brief starts v2.

## Goal
The record wall becomes one wall of a 3D room. Left and right arrows turn the camera 90° to the room's other walls. Those walls will carry more about Neil, the services he provides, and easter eggs.

This first step builds the skeleton every direction shares. The operator hasn't yet chosen how the walls are dressed: see `docs/research/room-2026-11-04/proposals.md`, where A (the record shop) is recommended.

## What exists (v1)
- **Site:** `editions/`, built with esbuild into `editions/dist/` (`npm run build`). `npm run check` fails if `dist/` differs from a fresh build. `?src` runs straight from the source modules.
- **Scene:** `editions/scene/`: wall, shelves, sleeves, lighting, motion, crate (the phone layout), sticker, post. `editions/main.js` wires it together, including the intro, Details, flip, Open and hash routes (`#mirra`).
- **Covers:** `editions/covers/`, procedural cover shaders. Don't change them in this step.
- **Project pages:** `editions/project/`. **Projects menu:** `editions/menu.js`. **No-WebGL fallback:** `editions/fallback.js`.
- **Plan and rulings:** `docs/plans/editions-plan-2026-11-03.md` (Decisions 1–15).
- **Copy:** `docs/plans/editions-copy-proposals.md`. Every visible string is a proposal until the operator approves it.

## Build
1. **Room.** Four walls around the camera. Wall 1 is the v1 record wall, unchanged: shelf, covers, light, Details, flip, Open and the phone crate. Walls 2–4 are plain lit placeholder walls in the record wall's materials, each with a working label: "Wall 2", "Wall 3", "Wall 4".
2. **Turning.** Left and right buttons, always visible, each labelled with the name of the wall it turns to. The left and right arrow keys do the same.
   - A turn is a 90° camera move, started only by the visitor, with an orientation cue during the move.
   - Under `prefers-reduced-motion`, a turn is an instant cut.
   - Turning is blocked while Details or a project page is open.
3. **Room map.** A small, always-visible map shows the four walls and which one is facing. Each wall on it can be clicked to turn there.
4. **HTML mirror.** Each wall's content exists as HTML, for screen readers and search engines, as v1's shelf list does. Focus order follows the wall that's facing.
5. **Loading.** Only the current wall and its two neighbours are built. A wall is built when it becomes a neighbour, and the intro never waits on it.
6. **Routes.** `#wall-2` and so on open facing that wall, while project hashes keep working.
7. **Phone.** The phone keeps the v1 crate on wall 1. Turning works with swipe and buttons, with touch targets at least 44 px and no sideways scroll at 360 px.

## Research to follow
From `docs/research/room-2026-11-04/evidence.md`:
- Keep navigation visible: NN/g 2016 found hidden navigation used far less.
- Give each other wall a visible name.
- Move the camera only when the visitor asks: NN/g 2023, WCAG 2.3.3.
- Keep wall text in HTML: Googlebot doesn't run WebGL.
- Follow Shopify's own structure: HTML over one canvas, and only the active and adjacent scenes mounted.

The references are in `references.md` in the same folder.

## Rules
- **Copy:** visible strings are placeholders. Add any new one to `docs/plans/editions-copy-proposals.md` as a proposal.
- **v1 stays as it is.** Wall 1 must look and behave exactly as v1 when facing it. Prove it with a capture compared against `feat/editions`.
- **Budgets:**
  - 60 fps while turning, on a machine with a GPU.
  - The first view grows by no more than 30 KB gzip.
  - The no-WebGL fallback still works.
- **Git:** author `nj-io <26359601+nj-io@users.noreply.github.com>`. Make new commits only, and never push to `main` (a push to `main` deploys the live site).
- **Paths:** keep the site free of any path containing `/.vscode/` or ending in `.orc`, because a firewall rule blocks them.
- **Tests:** add no test files. Check with headless Chrome captures and probes.
- **Without a GPU** (a cloud machine): use SwiftShader for correctness only, and say that timing is unmeasured.

## Done when
- All four walls are reachable by buttons, keys, the map and swipe.
- Reduced motion cuts instantly.
- Wall 1 is pixel-identical to v1 at rest, in Details and on the phone crate.
- The HTML mirror and focus order are correct.
- Only adjacent walls are built.
- `npm run check` passes.
- A short report lists what was built, the captures and anything open.
