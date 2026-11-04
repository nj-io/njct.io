# Proposals: the room, and how we move forward (team lead, 2026-11-03)

These are the page builder's source for the Proposals and Decisions sections. Keep the wording. Light edits for layout are fine.

## What the research says, for this room
Each point names its finding in evidence.md.
- **Navigation stays visible.** Arrows show on every wall, labelled with the wall they lead to, and a small room map shows where you are. Hidden navigation is used far less (NN/g 2016), and a hidden map in an online museum tour went unnoticed (arXiv 2023).
- **Each other wall gets a visible preview and a name.** Visitors mostly stay on the first face of anything that turns, the way they do with carousels (Notre Dame 2013; weaker counter-evidence from Smashing 2015).
- **The camera moves only when the visitor asks.** Turns are stepped 90° moves with an orientation cue, and an instant cut under reduced motion. Motion the visitor didn't start disorients people (NN/g 2023, WCAG 2.3.3).
- **Every wall's text lives in HTML,** so search engines and screen readers get it. Googlebot doesn't run WebGL.
- **Shopify's own structure:** HTML content over one full-screen canvas, only the current wall and its neighbours loaded, device tiers with a still fallback (Codrops, Spring '26 write-up).
- **Easter eggs never hold anything a visitor needs.** Services and contact work without finding one.
- **No sourced data exists on time-on-site for 3D portfolios,** so we measure from launch day which walls get reached and the time spent on each, through new-site-analytics.

## Three directions for the room
All three keep today's record wall exactly as built: the same shelf, covers, light, Details and Open. Each is a four-wall room, and left and right arrows turn 90°.

### A. The record shop (recommended)
The record wall becomes one wall of a small, warmly lit record shop.
- **Wall 1, the record wall:** the projects, as today.
- **Wall 2, the counter:** a menu board above the till lists the services, the till is "Get in touch" (the email link), and a sign-up card sits by the register.
- **Wall 3, the listening corner:** a turntable plays the About Neil record. Beside it hangs a pinboard: a short timeline, the asset-management years, and photos or press.
- **Wall 4, the back room:** a workbench and a crate of other work, including open-source contributions such as Claude Historian and Xactions, which have no sleeve on the shelf. The easter eggs hide here and around the shop.

Why: it extends the shelf's own idea, so every wall has an obvious reason to exist. Services read naturally as a shop's menu board.

Borrows from:
- taha-shajarian: arrow controls in a room, contact inside the scene;
- cratedigger-js: a crate you flick through;
- Shopify Editions: the wall and the light;
- jcedrik: a hidden terminal as one easter egg.

Cost: the largest of the three. Each wall needs props (counter, turntable, pinboard, workbench), built procedurally in the same three.js style as the shelf.

### B. Four lit walls
The same room, but every wall is a lit display wall in the record wall's materials and light: a services board, an about wall, and a contact and easter-egg wall. There are few props: shelves, boards and framed cards.

Why: it's the fastest to build and the most consistent with v1. The risk of a wall looking unfinished is lowest.

Cost: the smallest. It's plain next to A, and the room reads more like a gallery than a place.

### C. The studio
The room is Neil's own workspace:
- the record wall;
- a desk and monitor, with services as open windows on the screen;
- a window with a bookshelf, for about;
- a noticeboard, for contact and easter eggs.

Why: the most personal of the three.

Cost: between A and B. Services sit less naturally on a monitor than on a shop board, and a desk-and-monitor room is the most common room portfolio (see the room portfolios group).

### Staging, whichever direction
1. Build B's skeleton first: the room, the turn, the arrows and map, the HTML mirror of each wall, and loading only the current wall and its neighbours.
2. Then dress the walls toward the chosen direction, one wall per round.
3. Every round is build, capture, measure, critique and fix, as with v1, so each wall can be judged on its own.

## How we wrap up v1
Already running:
- the six cover reworks and stet: 4 accepted, 3 in progress;
- the review round 1 fixes and the lighting re-fit;
- the operator's 11 rulings: Projects menu, sticker, Get in touch, colour bands, and the rest;
- the copy redrafts.

Still to do:
1. Bundle three.js (ruling 2) and measure Shopify's own first frame.
2. One sign-off page for the operator: the 8 covers beside their concepts, and the copy (53 items).
3. One full test round on a quiet machine, then the version is frozen as v1.

## Decisions for the operator
1. **Which direction for the room:** A (recommended), B or C, or a mix described in the notes.
2. **How many faces turn:** four walls in all, the record wall plus three (recommended); or the record wall plus four other faces, adding the floor or ceiling as a fifth view.
3. **Which services go on the services wall,** in the operator's own words. The site only says "Now I create end-to-end scalable architecture for companies that use AI", and nothing will be invented.
4. **Easter eggs to include,** multi-choice:
   - a hidden terminal (a key opens it);
   - a key code that unlocks a secret crate;
   - playing a record on the turntable;
   - a jukebox of the site's own sounds;
   - a lost-and-found 404 room;
   - something of the operator's own, in the notes.
5. **Concept images for the room before building.** Like the covers, a round of generated concept images per wall (about 12 images; the price is quoted for a yes before running), then pick per wall (recommended). Or go straight to the build. Or wireframe sketches only.
6. **Review of v1 before freezing:** one final strict round on Opus, then freeze (recommended), since the room will rebuild much of the scene. Or the two Fable rounds as planned. Or no more review, and freeze now.
7. **Publishing v1:** keep it local until the room ships (recommended). Or publish v1 to njct.io/editions/ after sign-off. That needs a push to main, which deploys through Actions.
