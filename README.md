# njct.io

The NJCT product portfolio. A single self-contained page: the project menu sits
inside a living Gray-Scott reaction–diffusion ecosystem. Each project's name
seeds its culture — the hash picks the growth regime, the letters place the
founding colonies — and selecting a project replays its adoption arc: arrival,
early drop-off, critical mass, then the daily ebb and flow of its audience.

## Run

Any static server from the repo root, e.g.

    python3 -m http.server 8477

then open `http://localhost:8477/`.

## Structure

- `index.html` — everything: markup, styles, WebGL simulation (three shader
  passes: climate field, Gray-Scott step, display lens), interaction engine,
  and project data.
- Project data lives in the `PROJECTS` array near the top of the script.
  Figures are sourced from the brand system (`dev/_brand/loop/cards/*.json`)
  and project repos; forward-looking values are marked (e.g. "modeled").

## Interface

- Arrows, scroll, or drag change project; click a name selects it.
- The project card expands into a centred dossier modal (click the card;
  figures tap to zoom; click anywhere else closes).
- `aA` in the card cycles text size (persists). `T` or ◐ toggles theme.
- Developer mode: press the theme button seven times. It reveals the
  Variations sheet (live simulation controls), the lifecycle phase word,
  the footer hints, and the card's algorithm line. Resets on refresh.

## Provenance

Prototype history lives in `dev/research/portfolio-menu/` (variations A–F).
