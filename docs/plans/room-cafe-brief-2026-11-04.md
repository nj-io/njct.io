# Editions v2: the café

- **Branch:** `feat/room`. Supersedes `room-skeleton-brief-2026-11-04.md` (the four-wall room).
- **Status:**
  - The operator chose the direction on 4 November 2026 on the Café Art Direction page (https://claude.ai/artifact/5pPJ24QXhTFdNq2BXX2oXC).
  - The plan was reviewed the same day by a read-only agent, and the operator approved its edits.
  - v1, the record wall, lives on `feat/editions`, which other sessions keep updating.
- **Keeping up with `feat/editions`:**
  - This branch merges it in, never the other way. Nothing here is pushed to `feat/editions` or `main`.
  - Last merged at `0bed68c` ("Ship"). The site now lives at the repo root (`main.js`, `scene/`, `index.html`, `dist/`), and the old portfolio is at `/classic`. `main` is at the same commit and deploys to Cloudflare Pages on push (`.github/workflows/deploy.yml`, with the token held in GitHub's secrets).
  - Before each round, merge the latest `feat/editions`. The v1 baseline for every comparison is that head.
- **Branches beside this one** (operator, 4 November 2026):
  - **`feat/sun`** holds the sun alone, cut from `feat/editions` at `0bed68c`, so it can merge to `main` and deploy before the room is done. Sun work happens there first; this branch merges it in.
  - **`feat/cover-motion`** (worktree `/home/user/wt-cover-motion`): slow, purposeful motion for the covers, each cover's direction chosen by the operator from a list. Also cut from `feat/editions`; it touches `main.js` and `covers/covers.js`, so expect a small merge with the sun's ambient clock in `main.js`.
- **Skeleton commit** `1950bd1` is superseded and has been reverted, so this branch's code is v1's again:
  - **Recover from that commit in round 2:** the turn controller (`editions/room/room.js` there, `room/room.js` now), the edge buttons and keys, the hash routes, each view's HTML mirror, lazy loading, the guards on Details and project pages, and the reduced-motion cut.
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
- **The garden outside the window** (operator, 4 November 2026):
  - A garden, highly detailed, seen only in part through the glass, with a gap in its canopy where the sun comes through, so the patch keeps its bright core.
  - Its plants and trees are real shapes in the scene that move with the wind, and they cast the record wall's leaf shadows: the shadows on the wall, the sleeves and the covers are those plants, met along the sun, moving with them. Some licence in placing them is fine.
- **Covers outside the patch** may warm slightly with the sun's bounce light: a mean ΔE of at most 2 from v1, measured with `build/compare/deltae.py` (operator ruling, 4 November 2026). Inside the patch they take the sun fully.
- **Table:**
  - **A MacBook Pro.** Its screen is a live render of the record wall, with a terminal window on top typing curated lines from this repo; the lid's logo faces away from the camera.
  - **A Thai tea** (cha yen) in a glass with condensation, and plants.
- **Counter:**
  - The menu board lists the services: **Cross-platform content** and **Community management**.
  - "Order here" opens the Get in touch form, the same modal as the header's button.
  - Order slips on a rail above the counter are kept; the operator hasn't given the three steps yet.
- **Window lettering:** "njct.io", gilded on the inside of the glass, seen reversed from inside.
- **Tagline:** "Products I've designed and built." (replaces "Systems I've designed and built.").
- **Procedural:**
  - Shapes, materials, light and motion are drawn in code.
  - A file loads only where code can't reach the quality: the menu face, a `text=` subset of a family already vendored (Fraunces or Bricolage Grotesque, as in `vendor/fonts/SOURCE.txt`), at most 8 KB.
  - Leaves and the terminal's type are code.
- **Desktop only:**
  - Turning needs `(hover: hover) and (pointer: fine)`, a window of at least 1024×640, and an aspect of at least 1.2.
  - Everything else keeps v1: the crate on phones, with no turning and no sun.

## Bangkok: proposals to confirm in round 2's greybox
- **The room:** a shophouse café: a tall, narrow room with a high ceiling, a slow ceiling fan, a patterned cement-tile or terrazzo floor, and a steel-framed window with a decorative grille.
  - The right wall reads as the street front, since a shophouse's side walls are shared with its neighbours.
  - The counter is at the back.
- **Outside the window:** tropical leaves (banana, monstera, frangipani) and a soi in hazy golden light, with air-conditioner units and the tangle of overhead cables Bangkok streets are known for.
- **The drink:** Thai tea, its orange glow in a glass with condensation, beside the laptop (decided by the operator).
- **The leaf shadows:** large, slow-moving and tropical.

## Rounds
Each round is build, capture, measure, critique and fix, as in v1. Units: one scene unit is about 1.77 mm (a 177-unit sleeve is a 31.4 cm LP).

### 1. The sun on the record wall (cloud)
- **The plan, first.** These go into `scene/config.js` as numbers:
  - the room's size;
  - the window's size and position, its grille, and where the lettering sits;
  - the sun's azimuth and elevation.

  The operator chooses them from a nine-frame sun study of the real record wall. Later rounds build to them, and keep the beam's path clear unless round 1 put something in it.
- **The window** is an exact signed-distance shape (frame, mullions, transoms, a shophouse grille), projected onto the wall along the sun.
  - Each penumbra grows with its distance from the window (the sun is 0.53° across).
  - The gilded "njct.io" casts faintly into the patch.
- **Headroom.** The wall has 0.4–0.7 stop of headroom (sRGB 206–225, no tone curve), so the patch reads by hue:
  - a warm near-white core with a soft shoulder, never clipped;
  - a saturated amber penumbra.

  Editions' shade stays v1's neutral; cool skylight belongs to the room views.
- **The leaves.** Procedural foliage (shredded banana, holed monstera, frangipani) is drawn from the sun into a mask, then blurred with a disc the size of the sun's image at each distance. Every gap becomes an elliptical image of the sun, with a faint halo for the haze.
  - **Wind:** slow sway, gusts entering from the window side, flutter only in gusts.
  - **The same leaves** are seen through the window in round 5.
- **The studio bake stays as it is.** `wall.js`'s BAKE_FRAG is unchanged and re-runs only when a sleeve moves. The sun is computed every frame in the wall's display shader, at screen resolution, from a sun-space leaf mask that updates on the ambient clock.
- **Plaster that only the sun reveals:** a trowelled relief that changes only the sun's lighting term. With the sun off it is invisible.
- **The sleeves and shelves** receive the sun and cast its shadows:
  - Each sleeve's right edge catches the sun.
  - Each sleeve's own quad is projected along the sun: sharp where it meets the wall, softer toward its foot.
  - The shelves cast shadows as boxes.
  - The hovered sleeve shades its neighbour.
  - Sunlit covers tint the wall beside them, through v1's halo shape.
- **Files:**
  - A new `scene/sun.js` holds SUN_GLSL (the window shape, mask sampling, the sleeves' and shelves' sun shadows) and the mask builder.
  - `wall.js`'s display pass, `shelves.js` and `neutral()` in `sleeves.js` include it behind `#ifdef NJ_SUN`, with the define in each program's cache key, so with the sun off they run v1's own programs.
  - It loads after the first frame, compiles with `compileAsync`, draws once under the shelf, and fades in over about 1.2 s once the sleeves have landed. Its source is off-frame to the right, so the light itself invites "Table →".
- **The tagline** changes in its own commit, after the sun-off proof.
- **Checks:**
  - **Sun off:** the canvas matches `feat/editions` pixel for pixel at 1440×900, at rest and in Details: read from the canvas, or with page controls hidden. The DOM is compared on its own. In Details, compare a sleeve without a film, or before its film starts.
  - **Determinism:** every ambient motion is a function of one clock that a test can set (`__editionsTest.ambientT`).
  - **Legibility:** in the patch, each cover keeps at least 85% of its sun-off title contrast, and no cover pixel clips. Outside the patch, covers stay within a mean ΔE of 2.
  - **Captures:** at three fixed ambient times, and 4× crops at DPR 2. Check the dapples' shape against 1/cos(incidence).
  - **Timing:** not measured in the cloud, which has no GPU. Measure it on the Mac Mini.

### 2. The room shell, in greybox
- **Geometry** in code: walls, floor, ceiling, window, counter, table.
- **The rest of the record wall.** Beyond the widest Editions frame and up to the ceiling: record spines and a ladder (InstancedMesh), lit by a coarser bake of the same studio light. The floor and ceiling stay outside every Editions frame from 4:3 to 21:9.
- **The move:**
  - For its first half, the camera dollies in as the lens widens, holding the record wall at its size, so the café opens around it. Then it turns and settles.
  - It stays level and frames by shifting the lens (`setViewOffset`).
  - 1.1–1.4 s. A second press retargets.
  - Arriving at Editions, it takes `layout()`'s camera exactly.
- **The render path:**
  - The room views draw linear light into a half-float target.
  - One finishing pass is the identity up to 0.9 with a shoulder above it, blooms only the energy above it, then grades and dithers.
  - Editions keeps v1's forward path; the switch happens on a move's first frame.
  - The room views cap the pixel ratio at 1.5 until it's measured.
- **The two angled views,** composed like photographs.
- **Edge buttons** replace the map. The arrow keys turn only when focus is off the sleeve list and the Projects menu (as in `1950bd1`), and the buttons' descriptions say so.
- **Routes:** `#counter` and `#table` replace `#wall-N`.
- **One HTML mirror per view.**
- **The device gate** under Decisions.

### 3. Light in the room
- **Bounce light** from a radiosity solve in a Worker at idle, stored as small lightmaps:
  - sources: the sun patch averaged over the leaves, the sky through the window, the lamps;
  - three bounces;
  - you see warm bounce from the floor on the ceiling and counter, and cool skylight on surfaces facing the window.
- **Interior sun shadows,** baked once, in GPU tiles of at most 2 ms each.
- **Contact shadows** by analytic box occlusion.
- **Reflections:** a room probe from `PMREMGenerator`, so the floor reflects the window softly.
- **Bloom and halation:** the street outside sits 2–3 stops brighter than the room.
- **No GPU job runs during a move.**

### 4. The counter
- **The menu board** is drawn in the scene in the menu face, lit by the lamps.
  - Its HTML is the transparent, positioned mirror for focus, screen readers and search, and the hit area for "Order here".
  - Its body text, and the slips', is at least 16 CSS px at 1440×900.
- **The hi-fi:** a turntable turning a record, with a pair of speakers above the counter.
- **Pendant lamps** with glowing filaments and warm pools of light.
- **The order slips** stir in the fan's air.
- **Wear** along the counter's edge.
- **The espresso machine.**

### 5. The table
- **The laptop:**
  - The Editions view is rendered to 640×400 at up to 15 Hz, so the same dapples move on its screen.
  - The terminal is a canvas texture in the system monospace font, showing curated lines.
  - The glossy screen reflects the window, and its light falls on the keys.
- **The Thai tea:**
  - It glows when backlit, with a milk swirl and ice.
  - Condensation forms only below the liquid line and glints in the sun; a drop runs down about every 30 s.
  - The glass throws an orange caustic on the table.
- **The garden** (the operator's decision above; it may move earlier, as a round of its own, since it changes the shadows on Editions):
  - **What's there:** a frangipani or tamarind whose canopy hangs over the upper window, banana and monstera low on the left, climbers on the neighbour's wall, a planted bed and pots, and the soi's hazy far side beyond. A gap in the canopy along the sun's path.
  - **Built in code:** trunks and branches as tapered tubes, leaves as instanced cards from the leaf atlas (holes, torn tips, veins), no image files.
  - **Wind:** sway in the vertex shader (trunks bend, branches swing, leaves flutter only in gusts, gusts arriving from the window side), on the sun's ambient clock, so a test can hold it still.
  - **The shadows come from it.** Round 1's sun-space leaf mask is rendered from these plants along the sun (an orthographic view, the leaves alpha-tested into one channel) on the ambient clock, then blurred by the sun's disc at three distances as now. Round 1's drawn shapes retire. Every dapple on the wall is then a gap in a canopy you can see through the window.
  - **Seen from inside:** the leaves lit from behind, yellow-green; trunks and branches dark; the far side soft with haze.
  - **Checks:** Editions with the sun off stays v1 exactly; the garden is outside every Editions frame; the patch's legibility and ΔE checks rerun; the mask render's cost is measured on the Mac Mini.
  - **feat/sun** keeps round 1's mask for `main` until the café merges, unless the operator wants the garden's shadows on the live site sooner.
- **The window:** the garden seen through it, translucent leaves against an overexposed street. The lettering is dark from inside, gold at its edges.
- **Plants** in code: holes, torn tips, and translucency masked by their veins.

### 6. Life and sound
- **The visible beam:** the window's shape extruded along the sun, sampled 8–16 times at half resolution.
  - It shows shafts with leaf structure, and dust lit only inside them.
  - At most 2% added brightness in Editions.
- **Steam, condensation, the leaves, the fan.**
- **A passer-by's soft shadow** crosses the patch every 60–120 s (to be judged in this round).
- **Sound,** mixed by view and muted by default:
  - a generated record (FM keys and vinyl crackle);
  - the street through the window;
  - the espresso machine.
- **The light-switch easter egg:** night, with the lamps and the laptop glow.

### 7. Polish
- **Depth of field** at half resolution, based on a physical lens, in the angled views only.
- **A grade per view** that leaves Editions unchanged.
- **A governor** that sets the room's pixel ratio between 1.0 and 1.5 from measured frame times.
- **Frame rate** measured on the Mac Mini, and an accessibility pass.

## References
- **The page:** the Café Art Direction page lists the references for A and B, with what to look at in each.
- **For Bangkok:** its listening bars and vinyl cafés, e.g. Studio Lam on Sukhumvit 51.
- **Techniques** the review named from memory, unchecked:
  - Fernando 2005 (soft-shadow penumbrae);
  - Karis 2013 (representative-point reflections);
  - Jimenez 2014 (bloom);
  - Quílez (analytic box occlusion).

## Rules
- **Copy:** visible strings are proposals until the operator approves them. Rows 66 onward of `docs/plans/editions-copy-proposals.md` hold this brief's strings.
- **The terminal's text** is curated at build time (commit subjects and the build table, with no trailers or URLs) and approved as copy row 75.
- **The record wall:** v1's camera, layout and behaviour stay exactly as built, and only the light changes. Prove it as in round 1.
- **Budgets:**
  - **Frame rate:** 60 fps while turning, on a machine with a GPU.
  - **First view:** grows by no more than 30 KB gzip (estimate: +4.5 KB).
  - **Room code:** about 65 KB gzip, loaded after the record wall's first frame. Files: the menu face only, at most 8 KB.
  - **Fallback:** the no-WebGL fallback still works.
  - **Ambient motion:**
    - runs on its own clock at up to 30 Hz, and at up to 10 Hz in Details;
    - stops in hidden tabs, and under reduced motion freezes on a chosen frame;
    - pauses during moves.
  - **Where to measure:** frame rate and first-compile times on the Mac Mini, and on one Intel Iris Xe machine (Chrome on Windows).
- **Git:** author `nj-io <26359601+nj-io@users.noreply.github.com>`. Make new commits only, and never push to `main` (a push to `main` deploys the live site).
- **Paths:** keep the site free of any path containing `/.vscode/` or ending in `.orc`.
- **Tests:** add no test files. Check with headless Chrome captures and probes. Without a GPU, use SwiftShader for correctness only, and say that timing is unmeasured.

## Round 1 outcome (4 November 2026)
- **The pick:** 13° high, 38° round (the study's middle frame, https://claude.ai/artifact/GA9kdSBmMBQpjBiV83AuZc), now `CAFE.sun` in `scene/config.js`.
- **Built,** on `feat/sun`, as the brief describes, except:
  - The gilded lettering's shadow is left out. At this distance the sun's disc blurs 6 cm letters into a smudge, and it fell across the Stats title. The lettering returns on the glass in round 5.
  - The sun on the covers is set per cover (`CAFE.sun.coverGain`): 0.85 of their fitted light, and 0.34 for About Neil, whose gold title on cream lost contrast at 0.85.
  - The tint the sunlit covers throw on the wall beside them moves to round 3, with the rest of the bounce light.
- **Checks** (headless Chrome with SwiftShader, 1440×900):
  - **Sun off:** pixel-identical to `feat/editions` at rest (0 of 1,296,000 differ), and in Details outside the focused sleeve (0 of 1,125,850). On the focused sleeve, v1 itself differs from run to run.
  - **Legibility:** every cover's title keeps at least 86% of its sun-off contrast; the whole covers keep at least 87%; no pixel clips. The covers outside the patch shift by a mean ΔE of 0.67.
  - **Motion:** on a plain load the sun starts by itself and fades in, and only the patch moves with the leaves.
  - **Size:** the sun chunk is 7.1 KB gzip, and the first view grows by 1.2 KB.
  - **Timing:** unmeasured, since there is no GPU here. Measure it on the Mac Mini.

## Done when
- **Round 1:** done (see above), apart from the Mac Mini timing.
  - The operator has chosen the sun and window from the study.
  - With the sun off, the canvas is pixel-identical to v1 at rest and in Details.
  - With the sun on, the frame-and-leaves patch crosses the wall and the sleeves, moving with the wind.
  - The legibility and ΔE checks pass.
  - The tagline lands in its own commit.
  - `npm run check` passes.
  - A short report lists the captures and anything still open.
- **Rounds 2 to 7:** each closes with captures of the views it touched, and the operator's sign-off before the next.
