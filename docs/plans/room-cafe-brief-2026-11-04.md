# Editions v2: the café

- **Branch:** `feat/room`. Supersedes `room-skeleton-brief-2026-11-04.md` (the four-wall room).
- **Status:** the direction was chosen by the operator on 4 November 2026 on the Café Art Direction page (https://claude.ai/artifact/5pPJ24QXhTFdNq2BXX2oXC). v1, the record wall, is frozen on `feat/editions`.
- **Skeleton commit** `1950bd1` is superseded:
  - **Carries over:** the turn controller (`editions/room/room.js`), the edge buttons and keys, the hash routes, each view's HTML mirror, lazy loading, the guards on Details and project pages, and the reduced-motion cut.
  - **Dropped:** the room map, the four placeholder walls, the yaw-only turn on the long lens, swipe, and the phone controls.

## Goal
The record wall becomes one wall of a café in Bangkok where Neil works. Two more views show the counter, where clients learn what he does for them, and his table by the window, where they see him at work. Every object answers a client's question:
- **Record wall:** what has he built?
- **Table:** who is he, and how does he work?
- **Counter:** what can he do for me, and how do I start?

## Decisions (operator, 4 November 2026)
- **Direction:** A, Golden Hour Kissa, staged with B's restraint. That means a listening café in warm cinematic realism with few objects and simple forms, where the light does the work. A and B were both marked Love; C and D were not marked.
- **Place:** Bangkok.
- **Views:** three, in a line: Counter ← Editions → Table.
  - The left and right arrow keys and the edge buttons move between them.
  - There's no map and no wrap-around. At each end, the button on that side is hidden.
- **Camera:**
  - Editions is the v1 view: flat, on the long lens.
  - Counter and Table are angled. Leaving Editions, the camera walks into the room as its lens widens (about 20° to about 50°), turning as it goes.
  - The camera moves only when the visitor asks.
- **Sun:**
  - It comes through a window on the right wall, at golden hour.
  - Its shape is the window frame with leaf shadows moving inside it ("frame and leaves").
  - It falls across the record wall from the upper right, the side v1's key light already comes from, so the sleeves' shading stays consistent.
- **Table:**
  - **A MacBook Pro.** Its screen is a live render of the record wall, with a terminal window on top typing real output from this repo; the lid's logo faces away from the camera.
  - **Coffee and plants.**
- **Counter:**
  - The menu board lists the services: **Cross-platform content** and **Community management**.
  - "Order here" leads to Get in touch.
  - Order slips on a rail above the counter are kept; the operator hasn't given the three steps yet.
- **Window lettering:** "njct.io", seen reversed from inside.
- **Tagline:** "Products I've designed and built." (replaces "Systems I've designed and built.").
- **Procedural:**
  - Shapes, materials, light and motion are drawn in code.
  - A file loads only where code can't reach the quality: a menu-board typeface subset (about 30 KB at most), and realistic leaf shapes (about 60 KB at most) if code-drawn leaves fall short.
  - The room code totals about 40–80 KB gzip and loads after the record wall's first frame.
- **Desktop only:** phones keep the v1 crate, with no turning.

## Bangkok: proposals to confirm in round 2's greybox
- **The room:** a shophouse café: a tall, narrow room with a high ceiling, a slow ceiling fan, a patterned cement-tile or terrazzo floor, and a steel-framed window with a decorative grille. The grille adds to the frame's shadow on the record wall.
- **Outside the window:** tropical leaves (banana, monstera, frangipani) and a soi in hazy golden light, with the tangle of overhead cables Bangkok streets are known for.
- **The coffee:** Thai iced coffee in a glass with condensation, beside the laptop.
- **The leaf shadows:** large, slow-moving and tropical.

## Rounds
Each round is build, capture, measure, critique and fix, as in v1.

### 1. The sun on the record wall (cloud)
- **The window mask.** The frame and grille are worked out analytically.
  - Each shadow's penumbra grows with its distance from the window (the sun is 0.53° across).
  - The patch is warm against the cooler shade.
- **The leaf shadows.**
  - Procedural and moving slowly; a gap between leaves shows a soft image of the sun.
  - The motion re-bakes the wall only as often as it needs to.
- **The sleeves and shelves** receive the sun and cast sun shadows onto the wall.
- **Files:** the sun is a term in `scene/lighting.js` (the wall bake and the shelves) and in the sleeves' shading. The covers keep their fitted colour outside the patch.
- **The tagline** changes in this round.
- **Checks:**
  - **Sun off:** every pixel matches `feat/editions` at 1440×900, at rest and in Details. This proves only the light changed.
  - **Sun on:** captures at rest and in Details, and the covers in the patch stay legible.
  - **Timing:** not measured in the cloud, which has no GPU; it's measured on the Mac Mini.

### 2. The room shell, in greybox
- **Geometry** in code: walls, floor, ceiling, window, counter, table.
- **The camera move** from Editions into each angled view.
- **The two angled views,** composed like photographs.
- **Edge buttons** replace the map.
- **Routes:** `#counter` and `#table` replace `#wall-N`.
- **One HTML mirror per view.**
- **Desktop only.**

### 3. Light in the room
- The sun through the window.
- Bounce light and contact shadows baked in the browser at idle after the intro.
- Lamps over the counter.

### 4. The counter
- The menu board: its text is HTML placed in 3D.
- The espresso machine, the order rail and "Order here".

### 5. The table
- The laptop: the screen render and the terminal.
- The iced coffee, the plants, the window lettering.

### 6. Life and sound
- Steam, condensation, dust in the light, the leaves, the fan.
- Café sound.
- The light switch easter egg: night, with the lamps and the laptop glow.

### 7. Polish
- Grading and depth of field.
- Frame rate measured on the Mac Mini, and an accessibility pass.

## References
- **The page:** the Café Art Direction page lists the references for A and B, with what to look at in each.
- **For Bangkok:** its listening bars and vinyl cafés, e.g. Studio Lam on Sukhumvit 51.

## Rules
- **Copy:** visible strings are proposals until the operator approves them. Rows 65 onward of `editions-copy-proposals.md` hold this brief's strings.
- **The record wall:** v1's camera, layout and behaviour stay exactly as built, and only the light changes. Prove it as in round 1.
- **Budgets:**
  - 60 fps while turning, on a machine with a GPU.
  - The first view grows by no more than 30 KB gzip.
  - The no-WebGL fallback still works.
- **Git:** author `nj-io <26359601+nj-io@users.noreply.github.com>`. Make new commits only, and never push to `main` (a push to `main` deploys the live site).
- **Paths:** keep the site free of any path containing `/.vscode/` or ending in `.orc`.
- **Tests:** add no test files. Check with headless Chrome captures and probes. Without a GPU, use SwiftShader for correctness only, and say that timing is unmeasured.

## Done when
- **Round 1:**
  - With the sun off, the record wall is pixel-identical to v1 at rest and in Details.
  - With the sun on, the frame-and-leaves patch crosses the wall and the sleeves, moving slowly.
  - The covers stay legible.
  - `npm run check` passes.
  - A short report lists the captures and anything still open.
- **Rounds 2 to 7:** each closes with captures of the views it touched, and the operator's sign-off before the next.
