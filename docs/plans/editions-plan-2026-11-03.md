# njct.io Editions — plan

**Branch:** `feat/editions` · **Worktree:** `~/dev/njct.io-editions` · **Dev URL:** `http://127.0.0.1:8750/editions/`

The live site stays on `main` until the operator rules ship. During the 2026-11-02 credential incident this branch is local only: no push, no `git fetch`/pull/merge from `origin`, no `npm install`, no Cloudflare deploy.

## The design

Each project is a record sleeve on a shelf wall, in the interaction model of Shopify Editions (`https://www.shopify.com/editions`). The experience is matched; every asset, word and image is njct.io's own. Everything visual is generated at runtime in three.js: shelf geometry, lighting, shadows, covers, the sticker. The page downloads code only — no model files, no cover images.

| Shopify Editions | njct.io Editions |
|---|---|
| 10 editions on 2 shelves (5 + 5) | 11 sleeves on 2 shelves (6 + 5): 10 projects plus "About Neil" (Decision 1) |
| Illustrated cover images | Procedural cover shader per project, seeded from its name, in its accent colours; the hovered sleeve's cover animates |
| Shadow catcher baked into a model | Soft contact shadows rendered once at load into a texture; studio light from three.js `RoomEnvironment` through `PMREMGenerator` |
| Details: sleeve to front, background blur, Space flips | Same; the back cover carries the project's figures, stack and link |
| Now playing sticker on the newest edition | Now playing sticker on the newest sleeve, Stats (Decision 12) |
| Header: wordmark, Search, Shopify.com, Start for free; on edition pages an Editions menu | Header: wordmark, the Projects menu (Decision 15), Get in touch (Decision 5) |
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
| Details | Sleeve flies to the centre-right at about 2.5× size; shelf blurs; title and tagline at left; Open button below; Space flips; Escape exits. No record leaves the sleeve |
| Now playing sticker | Part of the newest edition's cover, on the shelf, in the crate and in Details: centre at 0.82 of the face's width from its left and 0.825 of its height from its bottom, 0.235 of its width across (bounding box), type turned about 13°, black caps on pastel foil, no shadow; it leans, lifts and flips with the sleeve |
| Editions menu (edition pages) | Trigger 40 px after the wordmark: label 14 px / 500, −1% tracking, 16 px chevron, 34 px tall, 8 px side padding, 4 px radius. Panel 8 px below, left-aligned, 220 px wide, white, 4 px radius, shadow 0 1px 3px and 0 1px 2px −1px at 10% black; rows 46.8 px: 24 px icon at 10 px, name 14 / 16.8 px black over a 12 / 12 px line in rgb(140,140,140), rules 1 px rgb(236,236,236), hover rgb(244,244,244). Opens 0.1 s late, then opacity and a 10 px rise over 0.3 s cubic-bezier(0.4, 0, 0.2, 1); closes over 0.3 s. Escape closes it with focus on the trigger; a click outside closes it. Phone: a sheet from the bottom, full width, rows 49.2 px with 16 / 19.2 px names, rising 50 px |
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
| 3 | Hover, Details, blur, flip, keyboard | Motion checklist clear |
| 4 | Open: project scene and dossier | Every sleeve opens and returns cleanly |
| 5 | Phone crate view | Clean at 360 and 390 px |
| 6 | Speed, reduced motion, keyboard and screen-reader paths | Every budget met, measured |
| 7 | Ship: replaces njct.io, current site to `/classic` | Operator rules ship |

## First version

The first version is the complete experience (phases 1–6), built in waves, then judged under the review protocol below before the operator sees it. The iteration job starts after the operator's review.

| Wave | Builds | Depends on |
|---|---|---|
| 1a | Cover system `editions/covers/` | `editions/data/projects.json` |
| 1b | Sound engine `editions/audio/` | nothing |
| 1c | Scene: shelf, light, shadows, intro, layout, bottom index, header (`editions/main.js`) | harness (Phase 0) |
| 2 | Interactions: hover, Details, background blur, flip, back cover, keyboard; covers and sound wired in | 1a, 1b, 1c |
| 3 | Open: each project's own scene and its dossier; About Neil's page | 2 |
| 4 | Phone crate view, speed budgets, reduced motion, screen-reader path | 3 |

### Shared data

`editions/data/projects.json` — eleven entries in shelf order (left to right, top shelf first): `name, kind ("project" | "about"), year, tag, blurb, url, stack, figs[[value, label]], accent {light, dark} | null, logo (data URI) | null`, and for About Neil `about[]` (four paragraphs). Optional: `urlText`, the text the link shows in place of the url's host and path; `newest`, the sleeve that wears the Now playing sticker. A back carries up to three figures, and fewer leave its lower part empty. All strings are the copy already approved and live on njct.io. Stellar Explorer and Scorecard carry no brand accent or logo: their covers derive a palette from the name. Topshine takes its colours and star mark from its current waitlist theme (`~/dev/topshine-design-waitlist/design/ui/tokens.css`), and likewiki its mark from `~/dev/_brand/kits/likewiki/`. Cover concepts for every sleeve: `.captures/concepts/` (board artifact `93sAKCyJDdgYshNWoQ9wWW`).

### Module contracts

**Covers** — `editions/covers/covers.js`:
`createCover(renderer, entry, index, { size }) → Promise<{ front: THREE.Texture, back: THREE.Texture, setAlive(on), update(dt, t), dispose() }>`.
A cover renders once into a render target; `setAlive(true)` re-renders it every frame with animated uniforms (at most one alive cover at a time). `back` holds the project's figures, stack and link (About Neil: the About text). Textures are sRGB, mipmapped, with the renderer's maximum anisotropy. A preview page `editions/covers/preview.html` shows every front and back and an alive toggle. The sleeve entering Details gets a 1024² back rendered on demand, because a 512² back is visibly soft when magnified at DPR 2; the shelf keeps 512² backs.

**Sound** — `editions/audio/audio.js`:
`createAudio() → { enabled, setEnabled(on), unlock(), play(name, opts?), setRoomTone(on), dispose() }`, names `hover | lift | details | flip | open | close | tick`. Every sound is synthesised (oscillators, noise buffers, filters, envelopes) through one master bus with a soft limiter (a waveshaper: transparent below −9 dBFS, ceiling −6 dBFS; Chrome’s DynamicsCompressorNode was rejected because it plays about 12 dB quiet for the first 0.4 s after the context starts and adds +5.4 dB make-up gain). Muted by default; the preference persists in `localStorage` behind try/catch. `unlock()` runs on the first user gesture. A preview page `editions/audio/preview.html` plays each sound and renders each offline (`OfflineAudioContext`) to a waveform and spectrogram with peak dBFS, RMS and duration, so reviewers can check sound without hearing it.

### Copy

The first version uses only copy already approved and live. New strings — the header line, the About sleeve text layout, stickers, back-cover labels — are drafted, marked as proposals, and listed in the handover for approval. Nothing ships without approval.

## Review protocol

Review rounds run one at a time, a fresh reviewer each round. Rounds 1 and 2 are Fable at high effort; later rounds are Opus at high effort. A round reads the harness capture (every moment, ours beside theirs), zoomed crops, and the code.

- Every finding names the moment, the region (a crop), what is wrong, the fix, a severity (blocker, major, minor, nit), and a label: *mechanical, builder applies* or *design, operator decides*.
- The scope covers fidelity to the reference (motion timing and easing, sizes, spacing, light, shadow, blur, type) and craft defects on their own: aliasing, banding, shadow acne, z-fighting, blurry or misaligned text, colour-space errors, sub-pixel jitter, layout shift, dropped frames, audio clipping or harshness.
- Captures cover 1440×900 at DPR 1 and 2, and 390×844 at DPR 2. The harness adds 4× crops of sleeve edges, shadow contact, type and the sticker. `build/compare/menu.mjs` captures the header menu, theirs and ours, closed, open and in motion.
- An Opus xhigh builder fixes every blocker, major and minor between rounds. Design items go to the operator.
- Exit: at least three rounds, ending only when a full round finds nothing above a nit at every capture size.

## Iteration

Every phase runs in rounds: build, capture ours and theirs at the same moments with `build/compare/capture.mjs`, critique against the checklist, fix. A round that finds nothing worth a fix closes the phase. Each round's capture is kept under `.captures/<round>/` (gitignored: it holds screenshots of a third-party site).

Checklist dimensions: per-motion timing and easing, lift height, blur strength, shadow softness and position, sleeve size and spacing, type size and weight, ground colour and falloff, frame rate, transfer size.

## Test hooks

The page exposes `window.__editions` for the harness only: `ready` (promise resolving after the first rendered frame), `firstFrameAt` (ms since navigation start), `sleeveRect(i)` (viewport rect of sleeve `i`), `count`.

## Decisions (operator, 2026-11-03)

1. Eleven sleeves, shelved 6 + 5 in this order: Mirra, stet, Social Hook, Clauded, LikeWiki, Topshine / Stellar Explorer, Chairtax, Scorecard, Stats, About Neil. Track Record, Claude Historian and Xactions are off the shelf. A shelf of more than five sleeves scales sleeve size and pitch by √(5 ÷ sleeves per shelf): 177 px sleeves at six a shelf.
2. Sound is in: procedural Web Audio (room tone, sleeve and record sounds) generated in code, behind a toggle that starts muted. Audio starts only after the visitor's first interaction.
3. One light studio look. Dark mode is out of scope for this version.
4. Every implementation step on this branch, first builds and fix rounds alike, runs on Opus at xhigh effort.
5. Get in touch is an email link, `mailto:neil@njct.io`, on the shelf header and on every project page. It is a plain link, so it works without script and on the no-WebGL shelf.
6. The first frame comes from a bundle: three.js and the shelf's modules are bundled with esbuild, tree-shaken, once the header and project-page branches have merged. The yardstick is Shopify's own first frame, measured on the same network and CPU throttle.
7. No record leaves the sleeve, as on the reference: no peek on hover, no slide-out in Details and no slide sound. The sleeves hold no record.
8. Scorecard's back carries "Free first · paid data only where free routes fail" and the facts the copy proposals offer beside it; no counts and no cost figure.
9. Topshine's back carries facts without numbers (copy proposals row 53); until they are approved it carries no figures.
10. Topshine, Scorecard, Chairtax and Stats present their finished vision: planned features read as live, without hedges, and every quoted number is real. The copy goes through the proposals.
11. Stats links to `https://stats.njct.io/live` and shows `stats.njct.io`. The address redirects to `/login?next=live`; it is linked as ruled.
12. The Now playing sticker sits on the newest sleeve on the shelf, as on the reference: Stats, live 2026-11-01. It is on the shelf, in the crate and in Details, and no other sleeve wears it.
13. The back covers keep the light paper.
14. The project page is full-bleed colour sections in each project's colour, as on the reference's page.
15. The header has a Projects menu listing all 11 projects in shelf order, without search, as the reference's Editions menu: a dropdown beside the wordmark, a sheet from the bottom on a phone. Choosing one opens its page through the hash route. Its rows carry the project's mark, its name and its tag (copy proposals row 63).
