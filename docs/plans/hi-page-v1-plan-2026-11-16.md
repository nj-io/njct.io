# njct.io/hi, stage v1 — build plan

**Branch:** `feat/hi` (from `main` 14dadd6, local, never pushed) · **Worktree:** `/Users/neil/dev/njct.io-hi` · **Dev URL:** `http://127.0.0.1:8750/hi.html` (`build/serve.sh`); with the country Function, `http://127.0.0.1:8788/hi` (`npx wrangler pages dev . --port 8788`)

Plan of 2026-11-16. Nothing in it is built. Cloudflare Pages deploys the whole repo root of `main` (`.github/workflows/deploy.yml`: `pages deploy .`), so every file in the repo is public once merged, this plan included; `main` deploys on every push, and merging happens only on Neil's word. Nothing private goes into `content/`, `hi/` or `docs/`.

Before /hi ships, `https://njct.io/hi` answers 200 with the home page: Pages serves `index.html` for any path it has no file for. The printed cards already point there.

## What v1 is

The page a business card's QR code opens (`https://njct.io/hi`, fixed: the cards are printed, with no query string). It greets the visitor in their language and gives them one tap to each of Neil's contact channels.

- **Look:** concept 1 of v7 (`/Users/neil/dev/_brand/creatives/njct/2026-11-07-hi-page/v7/1.png`): a café corner, a pale wall in late sun and shade, a high table with an open laptop and a flat white low in the frame. The scene is a photograph with no text and no leaf shadows (the plate), one for portrait screens and one for landscape. Leaf shadows moving in the wind are drawn in code over it, with the canvas renderer of the I rounds (v6, I v3) minus its human figure.
- **Content:** the site's header (the `njct.io` wordmark linking home, and a language picker built as the site's Projects menu), a greeting, a role line carrying the company name, a lead line, one line about Neil's work, four contact pills with icons (LinkedIn, WhatsApp, LINE, WeChat; the first is black), and a full-width Save contact button. All text is solid black.
- **Languages:** English, Thai, Simplified Chinese, Traditional Chinese, Hebrew (right to left), Spanish. The device's language list picks the language; the visitor's country, read by a small Pages Function, orders the pills for English-language visitors.
- **Files:** one static page (`hi.html`, served at `/hi`) with its CSS, scripts and copy inline; the plate images (content-hashed names), sun masks, the link-preview image, font subsets, a vCard and a WeChat QR image under `hi/` and `vendor/fonts/hi/`; one Pages Function (`functions/hi.js`); copy and contact details in `content/`, written into the page by `build/hi.mjs`.
- **Analytics:** new-site-analytics (PostHog through a same-origin proxy) on /hi, the home page and the privacy page.

## Decisions (ruled by Neil, 16 Nov 2026)

**D1. Language.** The device's language list (`navigator.languages`) decides. A supported non-English language anywhere in the list beats English; when two supported non-English languages appear, the first listed wins; otherwise the page is English. `?lang=` and a stored picker choice come before the list (§ 3). The country never picks the language.

| Visitor | Device languages | Country | Page | First pill |
|---|---|---|---|---|
| Expat in Bangkok | `en-GB` | TH | English | LINE (country order) |
| Thai person, phone in Thai | `th-TH` | TH | Thai | LINE |
| Thai person, phone in English with Thai added | `en-US, th-TH` | TH | Thai | LINE |
| Thai person, phone in English only | `en-US` | TH | English | LINE (country order); Thai one tap away in the picker |
| Chinese visitor on a Thai SIM | `zh-Hans-CN` | TH | 简体中文 | WeChat |
| Taiwanese visitor | `zh-TW, en` | TW | 繁體中文 | WeChat |
| Israeli, phone in Hebrew, in Spain | `he-IL` | ES | Hebrew | WhatsApp |
| Spanish speaker who also reads Thai | `en, es, th` | US | Spanish | WhatsApp |
| German visitor | `de-DE` | DE | English | LinkedIn |

The first supported language in the list as the rule (which gives `en-US, th-TH` an English page) rejected: Neil ruled that a supported non-English language anywhere in the list beats English (16 Nov 2026).

**D2. Pill orders.** By language: English LinkedIn, WhatsApp, LINE, WeChat; Thai LINE, WhatsApp, LinkedIn, WeChat; Simplified and Traditional Chinese WeChat, LinkedIn, WhatsApp, LINE; Hebrew and Spanish WhatsApp, LinkedIn, LINE, WeChat. The country reorders the pills only for an English-language page, by picking one of those orders: TH → Thai order; CN, HK, MO, TW → Chinese order; IL → Hebrew order; ES and the Spanish-speaking Americas (AR BO CL CO CR CU DO EC GT HN MX NI PA PE PR PY SV UY VE) → Spanish order; every other country → English order. A Chinese page puts WeChat first in every country. Taiwan → LINE first and Hong Kong or Macau → WhatsApp first for Chinese-language visitors rejected: Neil ruled WeChat first for all Chinese visitors (16 Nov 2026).

**D3. Desktop and landscape.** A second, landscape plate: the same scene recomposed 3:2 with the table in the right third (§ 1, § 2). The portrait plate as a feathered panel at the right of a wide screen rejected: Neil ruled a landscape plate (16 Nov 2026).

**D4. Chinese.** Simplified and Traditional, as separate copy locales `zh-Hans` and `zh-Hant`. Detection maps `zh-TW`, `zh-HK`, `zh-MO` and every `zh-Hant*` tag to `zh-Hant`, and every other `zh` tag to `zh-Hans`. The picker shows both, labelled 简体中文 and 繁體中文. Both use the system's CJK face (§ 2) and both put WeChat first (D2).

**D5. Analytics scope.** /hi and the home page in this build (§ 6). The home page's whole change is the tool's tag region in `index.html`.

**D6. The paid plate edits.** Approved up to USD 0.30 in total for both plates, at most three attempts per plate (§ 1). The builder shows the plates to Neil before they are used.

**D7. Text on the wall.** Every line of text on the photograph is solid black (`#000`). Contrast is reported, not gated (§ 1, step 4): where a leaf shadow crosses a shade band the darkest spots may give small text about 3.4:1. Neil accepted this (16 Nov 2026). Fading leaf shadows out behind the text, a brighter high-key wall and a frosted panel behind the text rejected: each changes concept 1's look, and Neil ruled to keep concept 1 and accept the lower contrast.

Contact details, the company name, the extra text, the vCard fields and the remaining copy are needed before release, not before building (§ 9).

## Files

| Path | What it is | Written by |
|---|---|---|
| `hi.html` | the page: markup, CSS, inline scripts; marker regions written by `build/hi.mjs`; the analytics tag region written by new-site-analytics | hand (C3, C3b, C4), `build/hi.mjs` (its regions), `new-site-analytics --inject` (C6) |
| `hi/locale.mjs` | the language and pill-order rules, as an ES module | hand (C2) |
| `content/copy.json` | every customer string, per key and locale, with its approval status | hand; Neil approves |
| `content/contact.json` | names, links, numbers and IDs, one place for the pills and the vCard | hand, from Neil |
| `build/hi.mjs` | writes the page's regions and `hi/neil.vcf`; `--check`, `--release` | C2 |
| `build/hi-fonts.mjs` | downloads the font subsets for the copy's glyphs | C2 |
| `build/hi-plate.py` | encodes the plates under content-hashed names, makes the sun masks and the link-preview image, measures shade colour and contrast, writes `hi/plates.json` | C1 |
| `build/test/hi.test.mjs`, `build/test/fixtures/` | the three tests of § 8 | C2 |
| `hi/plate-p.<hash>.{avif,webp,jpg}`, `hi/plate-l.<hash>.{avif,webp,jpg}` | portrait and landscape plates | `build/hi-plate.py` |
| `hi/sun-p.<hash>.png`, `hi/sun-l.<hash>.png` | sun masks (where the plate's wall is in sunlight) | `build/hi-plate.py` |
| `hi/og.<hash>.jpg` | the link-preview image, 1200 × 630, cut from the landscape plate | `build/hi-plate.py` |
| `hi/plates.json` | per plate: size, file names, shade colour, sun-mask name, page colours, measured ratios; the link-preview name; the hand-placed `leaves` and an optional `shade_override` | `build/hi-plate.py`, and C4 by hand for `leaves` |
| `hi/neil.vcf` | the vCard | `build/hi.mjs` |
| `hi/wechat-qr.png` | Neil's WeChat QR code | from Neil's export, re-encoded |
| `vendor/fonts/hi/*.woff2`, `vendor/fonts/hi/glyphs.json`, `vendor/fonts/hi/SOURCE.txt` | Inter, Noto Sans Thai and Noto Sans Hebrew subsets, and the glyphs each holds | `build/hi-fonts.mjs` |
| `functions/hi.js` | the country Function | C5 |
| `_headers` | cache and content-type rules for `/hi/*` and `/vendor/fonts/hi/*` | C3 |
| `functions/<P>/[[rest]].js`, `vendor/analytics/analytics.js`, `docs/analytics.md` | the analytics proxy, snippet and profile | new-site-analytics setup (C6) |
| `index.html` | the home page; this branch adds only the analytics tag region before `</body>` | `new-site-analytics --inject` (C6) |
| `privacy.html` | the privacy page the consent banner links to, with the cookie settings control | C6 |
| `.gitignore` | adds `build/.venv/` (C1) and `.wrangler/` (C5) | C1, C5 |
| `package.json` | scripts `build:hi`, `check:hi`, `release:hi`, `test:hi` | C2 |

The plates' source PNGs and the prompts that made them live in the brand hub, `/Users/neil/dev/_brand/creatives/njct/2026-11-07-hi-page/v8/` (its own repo; commits there on Neil's ask).

## 1. The background plates

### What they show

Concept 1's scene as a clean photograph: the pale plaster wall in low warm sun from the upper left, falling in broad soft diagonal bands with cooler shade between them, at concept 1's depth of contrast between sun and shade; the high round café table, the open laptop, the flat white on its saucer. No text, no buttons, no leaf or flower shadows, no people. The shade bands are what the leaf renderer measures its shade colour from (step 2 below): a wall lit evenly gives it no shade reference, and the plate is rejected.

Composition of the portrait plate (1024 × 1536), as fractions:

| Zone | Rule | Why |
|---|---|---|
| Text zone: top 0–64 % of the height, central 69 % of the width (15.5–84.5 %) | calm open wall in sun and shade bands, no objects; contrast reported | the header, greeting, lines and pills sit here; a phone shows the central 69 % of the plate's width (box maths in § 2) |
| Objects, 66–88 % of the height | top of the laptop screen at or below 66 %; tabletop about 84 %; pedestal runs off the bottom | the Save contact bar covers 91–97 % |
| Horizontal | laptop, cup and table inside the middle 60 % of the width (20–80 %) | they stay in the visible crop |

The landscape plate (1536 × 1024): the same wall, light and objects; the table, laptop and cup in the right third, tabletop about 80 % of the height. Its text zone is the left 55 % of the width and the top 80 % of the height (the text column of § 2, plus the crop a 16:10 screen takes off the top).

### How they are made

Image edits with `gpt26-sunburst` through `~/.claude/skills/generate-image`, run from `/Users/neil/dev/_brand/creatives/njct/2026-11-07-hi-page/`. About USD 0.02–0.05 per attempt (v7 concept 1 measured USD 0.0199; an edit adds input-image tokens). Neil approved the job up to USD 0.30 in total, at most three attempts per plate (D6); the measured cost of each attempt goes in the C1 report and in `v8/prompts.md`.

Portrait, input `v7/1.png`:

```
python3 ~/.claude/skills/generate-image/scripts/generate_image.py gpt26-sunburst "<portrait prompt>" --size 1024x1536 -o v8/plate-portrait-1.png -t hi-page-v8 -i v7/1.png
```

Portrait prompt:

> Edit this image into a clean background photograph with nothing on top of it. Remove every piece of text and every button: the Thai headline, the Thai line under it, the four rounded buttons and the black bar at the bottom, and paint the wall in behind them. Remove every leaf, flower and plant shadow from the wall. Keep the same pale warm grey plaster wall in the same light as the original: low late-afternoon sun from a window at the upper left, falling in broad, soft diagonal bands of warm light from upper left to lower right, with cooler soft shade between the bands, and the same depth of contrast between sun and shade as in the original. No plant, leaf or flower shapes anywhere in the light or in the shade, and no window frame in view. The upper two thirds of the image is calm open wall with only these bands of sun and shade, no objects. Keep the same high round café table with the same open silver laptop and the same flat white on its saucer, in the same style and light, a little smaller than in the original and lower in the frame: the top of the laptop screen at about two thirds of the image height, the tabletop at about 84 percent of the height, the table's pedestal running off the bottom edge. Keep the laptop, the cup and the table inside the middle 60 percent of the image width. No people, no hands, no human shadows. Photographic and natural, with the same colour and grain as the original. No text, no logos, no watermark, no border. Tall portrait, 2:3.

Landscape, input the accepted portrait plate:

```
python3 ~/.claude/skills/generate-image/scripts/generate_image.py gpt26-sunburst "<landscape prompt>" --size 1536x1024 -o v8/plate-landscape-1.png -t hi-page-v8 -i v8/plate-portrait.png
```

Landscape prompt:

> Recompose this photograph as a wide 3:2 landscape of the same café corner, from the same camera height, with the same light, colour and grain. The same pale warm grey plaster wall fills the frame, in the same light as this photograph: the same low warm sun from the upper left in broad, soft diagonal bands, with cooler soft shade between them, at the same depth of contrast between sun and shade. No leaf, plant or flower shadows and no window frame in view. Place the same high round café table, with the same open silver laptop and the same flat white on its saucer, in the right third of the frame and low: the tabletop at about 80 percent of the height, its pedestal running off the bottom edge. The left 55 percent of the frame is calm open wall with only these bands of sun and shade. No people, no hands, no human shadows, no text, no logos, no watermark, no border.

An attempt is accepted when it has no remnant of text or buttons, no leaf shapes, the objects in their zones, a shade reference (step 2) and a contrast report (step 4). The builder then shows the accepted plates to Neil, who approves them before use (a checkpoint). The accepted files are copied to `v8/plate-portrait.png` and `v8/plate-landscape.png`; every attempt stays in `v8/` with its prompt and cost in `v8/prompts.md`.

### Delivered files and budgets

`build/hi-plate.py` runs in its own virtual environment, since Pillow is installed only in the user site, which `-I` hides:

```
python3 -m venv build/.venv && build/.venv/bin/pip install pillow==11.3.0
build/.venv/bin/python -I build/hi-plate.py v8/plate-portrait.png v8/plate-landscape.png
```

(paths to the brand hub's `v8/` given in full). Pillow 11.3 encodes AVIF and WebP. The script writes:

| File | Size | Budget |
|---|---|---|
| `hi/plate-p.<hash>.avif` | 1024 × 1536 | ≤ 90 KB |
| `hi/plate-p.<hash>.webp` | 1024 × 1536 | ≤ 140 KB |
| `hi/plate-p.<hash>.jpg` (progressive) | 1024 × 1536 | ≤ 190 KB |
| `hi/plate-l.<hash>.avif` / `.webp` / `.jpg` | 1536 × 1024 | ≤ 120 / 180 / 240 KB |
| `hi/sun-p.<hash>.png`, `hi/sun-l.<hash>.png` | one eighth of the plate (128 × 192, 192 × 128) | ≤ 4 KB each |
| `hi/og.<hash>.jpg` (the link preview) | 1200 × 630: the landscape plate scaled to 1200 wide, its lower 630 px (table and cup in frame) | ≤ 120 KB |

`<hash>` is the first 8 hex characters of the file's SHA-256. The script names every file it writes in `hi/plates.json`, deletes the `hi/plate-*`, `hi/sun-*` and `hi/og.*` files the new `plates.json` no longer names, and rewrites only the keys it owns: `leaves` and `shade_override`, written by hand, survive every run. No file name is ever typed by hand; `build/hi.mjs` writes the page's `<picture>`, preloads and link-preview tags from `plates.json` (§ 2, C2).

```json
{
  "p": { "w": 1024, "h": 1536,
         "avif": "/hi/plate-p.1a2b3c4d.avif", "webp": "/hi/plate-p.5e6f7081.webp", "jpg": "/hi/plate-p.92a3b4c5.jpg",
         "sun": "/hi/sun-p.d6e7f809.png", "shade": [168, 176, 199], "shade_source": "measured",
         "ls_ll": 0.62, "contrast_p5": 0.21, "top": "#ddd6cb", "bottom": "#8a7e70", "leaves": { } },
  "l": { "w": 1536, "h": 1024, "…": "the same keys" },
  "og": "/hi/og.0a1b2c3d.jpg"
}
```

The encoder starts at AVIF quality 55, WebP 80, JPEG 82 and steps each down by 5 until the file fits its budget, printing the quality used. One size per plate: on a 390 × 844 phone the plate box is 563 CSS px wide, so 1024 px is 1.8 device px per CSS px; the photograph is soft by nature, and the 3× screenshot in C7 is the check. The page loads exactly one plate (the `<picture>` in § 2); the JPEG is reached only by browsers without AVIF and WebP.

### How the code-drawn shadows sit on the photograph

A leaf shadow on a sunlit wall is that wall without the sun's share of its light. The plate already holds both states: wall in sun and wall in shade. The renderer reproduces that ratio exactly. Each step runs per plate, over that plate's text zone (the wall zone).

1. **The sun mask.** `build/hi-plate.py` measures the luma of every pixel in the wall zone, takes the 10th percentile as `Ls` (shade) and the 95th as `Ll` (full sun). When `Ls / Ll > 0.75` the plate has no shade reference, and the script rejects it (exit 1, `no shade reference: Ls/Ll = <x>`); the ratio is written to `plates.json` as `ls_ll`. Otherwise it maps each pixel of the plate to `s = clamp((L − Ls) / (Ll − Ls), 0, 1)`, blurs `s` with a Gaussian of radius 4 px (removing plaster grain), scales it to one eighth, and saves it as a PNG that is black with `s` as alpha. Below the tabletop line the mask is computed the same way, so leaves also shade a lit tabletop. Inside the plate's own shade (and the bars of the window's light), `s` is near 0, so a leaf adds nothing there: shade cannot be shaded twice.
2. **The shade colour.** Per channel, in sRGB values (the space CSS blending works in): `k = mean(plate over pixels with s < 0.1) / mean(plate over pixels with s > 0.9)`, both over the wall zone, clamped to at most 1. Concept 1 measures `k = (0.66, 0.69, 0.78)`: the shade is cooler than the sun. Written to `hi/plates.json` as `shade: [r, g, b]` in 0–255 (`round(255 × k)`), with `shade_source: "measured"`. When the plate carries a hand-written `shade_override: [r, g, b]` (ratios 0–1), the script writes `shade` from it instead, with `shade_source: "override"`, and uses it in step 4. The documented fallback is concept 1's measured ratio, `shade_override: [0.66, 0.69, 0.78]`, for a plate whose measured shade fails C4's numeric check.
3. **Drawing.** One canvas over the plate, inside the same box (§ 2). Each frame: clear; draw every leaf sprite (blurred by its distance, as v6) with `source-over` in the shade colour `rgb(shade)`. Overlapping leaves accumulate alpha as `1 − (1 − a1)(1 − a2)`, the product of the sun's visibility through each, so an overlap is never darker than full shade. Then draw the sun mask over the whole canvas with `destination-in`, so the leaves exist only where the sun falls. The canvas has `mix-blend-mode: multiply`. Where a leaf's alpha is `a`, the pixel becomes `plate × (1 − a + a × k)`: at full alpha exactly the plate's own shade, at its blurred edges the partial light of a penumbra.
4. **Contrast report.** `build/hi-plate.py` multiplies the text zone's sRGB values by `shade / 255` (full leaf shade everywhere, the worst case), converts each pixel to WCAG relative luminance (linearised channels weighted 0.2126, 0.7152, 0.0722), and reports the 5th percentile as `contrast_p5` with the black-text ratio (p5 + 0.05) / 0.05, labelled informational. The report never rejects a plate and the script's exit code is unaffected by it; only the shade-reference rule (step 2) rejects. With concept 1's mid-toned wall, the darkest spots (a leaf shadow over a shade band) give small text about 3.4:1; Neil accepted this (16 Nov 2026). The script also reports the mean colour of the plate's top 3 % (`top`, for `theme-color`) and bottom 3 % (`bottom`, for the `html` background, which shows in iOS overscroll).

## 2. Layout

### The scene box

The plate, the leaf canvas and (in v2) the video share one box with the plate's own aspect ratio, sized to cover the stage and anchored at the bottom centre. Every layer fills the box, so they align by construction; nothing uses `object-fit`, and the canvas never repeats CSS's cover maths.

```css
:root { --pw: 1024; --ph: 1536; }
@media (orientation: landscape) { :root { --pw: 1536; --ph: 1024; } }      /* one media query, three places: here, <source media>, and WIDE in the script */
.page  { position: relative; min-height: 100vh; min-height: 100svh; }
.stage { position: absolute; top: 0; left: 0; right: 0; height: max(100%, 100vh); height: max(100%, 100lvh);
         overflow: hidden; container-type: size; pointer-events: none; z-index: 0; }
.scene { position: absolute; left: 50%; bottom: 0; transform: translateX(-50%); isolation: isolate;
         width: max(100cqw, 100cqh * var(--pw) / var(--ph)); aspect-ratio: var(--pw) / var(--ph); }
.scene > *, .scene img { position: absolute; top: 0; left: 0; width: 100%; height: 100%; display: block; }
.scene canvas { mix-blend-mode: multiply; opacity: 0; transition: opacity 1.2s var(--ease); }
/* v2: a <video> joins .scene between the <picture> and the <canvas>, in the same box. */
```

The page is at least `100svh` tall (the screen with the browser's bars showing), so Save contact is on screen when they show; the stage is at least `100lvh` (the screen with them hidden), so the plate never shows a gap when they hide and never rescales as they move. The `html` background is the plate's measured bottom colour. On a 390 × 844 phone the box is 563 × 844: the plate's height fills the screen and its central 69 % of width shows.

`.scene` uses `transform` and physical `top`/`left` (no `translate` property, no `inset`) so that the box still centres in the in-app browser of older WeChat on Android (the X5 engine, Chromium 86), which lacks container units and `aspect-ratio`. There the box is sized by the renderer's `build()` (C4): when `!CSS.supports('width: 100cqw') || !CSS.supports('aspect-ratio: 1')`, it reads the stage's rect (`W × H`) and the current plate's size (`pw × ph` from `PLATES`), and sets `.scene`'s `style.width = max(W, H × pw / ph)` px and `style.height = width × ph / pw` px, on start and on every resize and orientation change.

`build/hi.mjs` writes the `<picture>` from `hi/plates.json` (region `<!-- picture: written by build/hi.mjs -->` … `<!-- /picture -->`):

```html
<div class="stage" aria-hidden="true"><div class="scene">
  <!-- picture: written by build/hi.mjs -->
  <picture>
    <source media="(orientation: landscape)" type="image/avif" srcset="/hi/plate-l.<hash>.avif">
    <source media="(orientation: landscape)" type="image/webp" srcset="/hi/plate-l.<hash>.webp">
    <source media="(orientation: landscape)" srcset="/hi/plate-l.<hash>.jpg">
    <source type="image/avif" srcset="/hi/plate-p.<hash>.avif">
    <source type="image/webp" srcset="/hi/plate-p.<hash>.webp">
    <img src="/hi/plate-p.<hash>.jpg" alt="" width="1024" height="1536" fetchpriority="high">
  </picture>
  <!-- /picture -->
  <canvas id="leaves"></canvas>
</div></div>
```

The head's generated region (`<!-- head: written by build/hi.mjs -->` … `<!-- /head -->`) holds, from `plates.json` and the English copy: `<title>`; `<meta name="description">`; `og:title` (`hi_title`), `og:description` (`hi_description`), `og:url` (`https://njct.io/hi`), `og:image` (`https://njct.io` + `plates.og`, with `og:image:width` 1200 and `og:image:height` 630), `twitter:card` `summary_large_image`, as `index.html` carries them; `<meta name="theme-color">` with the portrait plate's `top`; a `<style>` setting `html { background: <p.bottom> }` and, under the landscape query, `<l.bottom>`; and the plate preloads, `<link rel="preload" as="image" href="<p.avif>" type="image/avif" media="(orientation: portrait)" fetchpriority="high">` and its landscape twin with `media="(orientation: landscape)"`.

### Phone (portrait, 360–430 px wide)

Positions at 390 × 844 (y in CSS px from the top, below `env(safe-area-inset-top)`):

| Element | Position | Notes |
|---|---|---|
| Header | 0–54 | wordmark `njct.io` at the gutter (16 px), linking `/` (same-origin on previews too, so `check`'s navigation pass follows it to the home page); the language picker 32 px after it (flex row, gap 32 px plus the button's 8 px padding = the site's 40 px) |
| Greeting | from 96 | |
| Role line | 10 px under the greeting | title and company name |
| Lead line | 16 px under the role line | |
| About line | 8 px under the lead | the extra text |
| Pills | 24 px under the about line | four stacked, full column width, 48 px tall, 8 px apart (216 px) |
| (objects of the plate) | about 560–760 | |
| Save contact | bottom, 56 px tall, above `env(safe-area-inset-bottom)` + 20 px | full width less the gutters, black, white text, person-plus icon |

The text block ends near y 540 at 390 × 844. When the viewport is under 720 px tall (iPhone SE 375 × 667, small Androids 360 × 640) the pills form a 2 × 2 grid (`grid-template-columns: 1fr 1fr`, gap 8 px, 104 px in all); if the content is still taller than the screen the page scrolls and the plate grows with it.

Gutters: `max(16px, env(safe-area-inset-left))` and the right twin. `viewport-fit=cover`; the plate runs under the notch and the home indicator.

### Wider screens

- **Portrait, 600 px and wider (tablets):** the same layout in a column 480 px wide, centred; header at the column's edge.
- **Landscape:** the landscape plate; a text column at the left, `margin-left: max(32px, 6vw)`, width `min(520px, 45vw)`, starting at `max(96px, 16vh)`; pills stacked, 360 px wide; Save contact a black pill 52 px tall, 24 px under the pills (no full-width bar). The column's offset is physical (`margin-left`), so a Hebrew page keeps the column over the open wall at the left, its text aligned right inside it, clear of the table in the right third. A phone held sideways (844 × 390) gets the same layout with 2 × 2 pills and scrolls.

### Type ramp

Inter for Latin script, Noto Sans Thai and Noto Sans Hebrew for those scripts, the system's CJK face for Chinese: `:lang(zh-Hans)` takes `"PingFang SC", "Noto Sans CJK SC", "Microsoft YaHei", sans-serif`, `:lang(zh-Hant)` takes `"PingFang TC", "Noto Sans CJK TC", "Microsoft JhengHei", sans-serif` (Inter stays first in both stacks, for the Latin words in the Chinese copy). Weights 400 and 500 only.

| Element | Phone (size / line, weight, tracking) | 600 px and wider |
|---|---|---|
| Wordmark, picker label | 16 / 20, 500, −0.01em | same |
| Greeting en, he | 48 / 52, 500, −0.035em (he −0.015em) | 72 / 76 |
| Greeting th | 38 / 54, 500, −0.01em | 56 / 80 |
| Greeting zh-Hans, zh-Hant | 42 / 54, 500, 0 | 64 / 80 |
| Greeting es | 44 / 50, 500, −0.03em | 66 / 72 |
| Role line | 17 / 24, 500 | 19 / 26 |
| Lead line | 17 / 25, 400 | 19 / 28 |
| About line | 15 / 22, 400, max 34ch | 17 / 26 |
| Pills | 17 / 20, 500, 20 px icon, 8 px icon gap | same |
| Save contact | 17 / 20, 500 | same |

Thai body lines get 4 px more line height (stacked vowels and tone marks). All text on the photograph is `#000`; hierarchy comes from size and weight, and the plate's contrast report (§ 1, step 4) states the black-text ratio under full leaf shade, which in the darkest spots (leaf shadow over a shade band) gives small text about 3.4:1; Neil accepted this (16 Nov 2026). A secondary grey ink rejected: Neil ruled every line solid black (16 Nov 2026). The v6 template's `:root` tokens, which C3 reuses, carry `--ink-soft` (60 % black, the colour of its `.line`), as the site does; /hi uses no ink but `#000` on the photograph. Light pills are `rgba(255, 255, 255, 0.85)` with black text; the lead pill is `#000` with white text, as the site's Open pill.

The headline uses `text-wrap: balance`, the lines `text-wrap: pretty`.

### Hebrew (right to left)

`dir="rtl"` on `html` mirrors the flex rows and text alignment: the wordmark and picker swap sides, each pill's icon sits at its right, the text column aligns right. The wordmark keeps `<span dir="ltr">njct.io</span>`. The plate and the leaves are not mirrored: the scene is a photograph, and v2's video must match the plate.

### No dark theme

The page is a photograph in daylight and has one theme. `<meta name="color-scheme" content="only light">` keeps Chrome's automatic dark mode and in-app dark modes from inverting it; `theme-color` is the plate's measured top colour.

## 3. Language and pill order

### Where each decision is made

| Decision | Where | Input |
|---|---|---|
| Language | client, an inline script in `<head>` that runs before the body is parsed | `?lang=`, a stored picker choice, `navigator.languages` |
| Country | server, `functions/hi.js` | `request.cf.country`, written into `<html data-cc="TH">` |
| Pill order | client, when the copy is applied | language, then country (D2) |

The language never depends on the server, so a missing or failing Function changes nothing but the pill order for English-language visitors. Reading the country from the analytics proxy's `/region` answer rejected: it arrives after first paint, so the pills would reorder on screen.

### The rules (`hi/locale.mjs`, inlined into the head by `build/hi.mjs`)

```js
export const LANGS = ['en', 'th', 'zh-Hans', 'zh-Hant', 'he', 'es'];
// A language tag (any case, '-' or '_') to a supported locale, or null. An explicit script subtag wins.
export function norm(t) {
  const [p, ...sub] = String(t || '').toLowerCase().split(/[-_]/);
  if (p === 'iw') return 'he';
  if (p === 'zh') {
    if (sub.includes('hant')) return 'zh-Hant';
    if (sub.includes('hans')) return 'zh-Hans';
    return sub.some((s) => s === 'tw' || s === 'hk' || s === 'mo') ? 'zh-Hant' : 'zh-Hans';
  }
  return ['en', 'th', 'he', 'es'].includes(p) ? p : null;
}
// D1: ?lang=, then the stored picker choice, then the first supported non-English language anywhere in the
// device's list, then English.
export function resolveLang({ query, stored, languages }) {
  const q = norm(query);
  if (q) return { lang: q, source: 'query' };
  const s = norm(stored);
  if (s) return { lang: s, source: 'stored' };
  let en = false;
  for (const t of languages || []) {
    const l = norm(t);
    if (l && l !== 'en') return { lang: l, source: 'device' };
    if (l === 'en') en = true;
  }
  return { lang: 'en', source: en ? 'device' : 'default' };
}
const ZH = ['wechat', 'linkedin', 'whatsapp', 'line'];
const WA = ['whatsapp', 'linkedin', 'line', 'wechat'];
export const ORDER = {
  en: ['linkedin', 'whatsapp', 'line', 'wechat'],
  th: ['line', 'whatsapp', 'linkedin', 'wechat'],
  'zh-Hans': ZH, 'zh-Hant': ZH, he: WA, es: WA,
};
// D2: for an English page only, the country picks one of the orders above.
export const COUNTRY_ORDER = Object.assign(
  { TH: 'th', CN: 'zh-Hans', HK: 'zh-Hans', MO: 'zh-Hans', TW: 'zh-Hans', IL: 'he' },
  Object.fromEntries('AR BO CL CO CR CU DO EC ES GT HN MX NI PA PE PR PY SV UY VE'.split(' ').map((c) => [c, 'es'])),
);
export function pillOrder(lang, cc) {
  return ORDER[lang !== 'en' ? lang : COUNTRY_ORDER[String(cc || '').toUpperCase()] || 'en'];
}
```

The locale codes are the copy file's locales and the `<html lang>` values; the page uses no short codes. Test T3 (§ 8) holds the rulings' worked examples.

### Order of events in the page

1. **Head, inline, before any body element.** Runs `resolveLang` with `query = ?lang`, `stored = localStorage['hi.lang']` (read in `try`/`catch`; webviews and private modes may throw), `languages = navigator.languages` (or `[navigator.language]` when the list is missing or empty). Sets `html.lang = lang`, `html.dir` (`rtl` for Hebrew), replaces the class `no-js` with `js`, keeps `{lang, source}` on `window.__hi`. For Thai or Hebrew it appends `<link rel="preload" as="font" type="font/woff2" crossorigin>` for that face. When the language is not English it adds the class `hi-wait`, and starts `setTimeout(() => html.classList.remove('hi-wait'), 1500)`.
2. **CSS:** `.hi-wait [data-stet] { visibility: hidden; }`. Only the text elements hide, never the plate or the layout, so nothing moves when they fill.
3. **Body, inline, directly after the Save contact button.** `hiApply(lang)` (defined in the head) fills every `[data-stet]` element's text from `COPY[lang][key]`, falling back to `COPY.en[key]` per key; reorders the pills by `pillOrder(lang, cc)` (`cc` from `html.dataset.cc`, or `?cc=` for tests) and marks the first `lead`; sets the WhatsApp `href` with the language's prefilled text; sets the nav's `aria-label`; removes `hi-wait`.
4. **End of body:** the picker, the WeChat dialog and the leaf renderer, then the analytics tag region (§ 6).

The English copy and the English pill order are written into the HTML by `build/hi.mjs`, so the page is complete before any script runs.

### Picker

The site's Projects menu look (v6's `.pm` CSS, which copies `index.html`'s `.pm` rules): a button showing the current language's own name and a chevron; a dropdown on wider screens, a sheet from the bottom under 600 px. Items are `<button type="button" lang="th">ไทย</button>` (each item carries its own `lang`), in the order English, ไทย, 简体中文, 繁體中文, עברית, Español, the current one checked. Item labels use the system font stack, so opening the picker never downloads a Thai or Hebrew face. Behaviour as `menu.js` `start()` (lines 58–90), copied into the page: `inert` on the closed list, Escape closes with focus back on the trigger, a press outside closes, focus leaving closes, arrow keys, Home and End move. `menu.js` is not imported: it renders `LINEUP` and starts `contact.js`.

Choosing a language, in order: `hiApply(lang)`; `localStorage['hi.lang'] = lang` (in `try`); when the URL carries `lang`, `history.replaceState(history.state, '', url)` with `url = new URL(location.href)` after `url.searchParams.delete('lang')` (every other parameter and the hash kept), so the stored choice wins on reload and a shared link no longer forces the old language; the `hi_lang_changed` event. `?lang=` stays a deliberate override for links Neil makes and for tests.

### Without JavaScript

`no-js` stays on `html`: the picker is hidden (`.no-js .pm { display: none; }`); the page shows the English copy and English pill order, every pill is a working link, Save contact downloads the vCard, and the WeChat pill links to `/hi/wechat-qr.png`. On older WeChat for Android (X5) without JavaScript the scene box has no size and the plate does not show; the text, pills and Save contact work over the `html` background colour.

### The country Function (`functions/hi.js`)

```js
// /hi (and /hi/): the static page (hi.html) with the visitor's country in <html data-cc>, which orders the
// contact pills for an English-language visitor. The response differs per visitor, so no shared cache keeps it
// and it is never answered with a 304 from the asset's validators (that would return a page written for
// another country). Any answer from the asset layer that is not a 200 HTML page (the 308 for /hi/) passes as is.
export async function onRequestGet({ request, env }) {
  try {
    const headers = new Headers(request.headers);
    headers.delete('if-none-match');
    headers.delete('if-modified-since');
    const res = await env.ASSETS.fetch(new Request(request, { headers }));
    if (res.status !== 200 || !(res.headers.get('content-type') || '').startsWith('text/html')) return res;
    const out = new Response(res.body, res);
    out.headers.set('cache-control', 'private, no-cache');
    out.headers.delete('etag');
    out.headers.delete('last-modified');
    const c = String(request.cf?.country || '').toUpperCase();
    if (!/^[A-Z]{2}$/.test(c) || c === 'XX') return out;
    return new HTMLRewriter().on('html', { element(e) { e.setAttribute('data-cc', c); } }).transform(out);
  } catch {
    return env.ASSETS.fetch(request);
  }
}
```

- **Routing.** The page is `hi.html` at the repo root, which Pages serves at `/hi` with 200 (measured on njct.io 2026-11-16: `/covers/preview` 200, `/covers/preview.html` and `/covers/preview/` 308 to it; a folder index answers `/classic` with a 308 to `/classic/`, which would cost a scan one round trip). `functions/hi.js` takes `/hi` and `/hi/`; for `/hi/` the asset layer answers a 308 to `/hi`, which the Function returns unchanged. Wrangler compiles `functions/` from the directory it deploys from (the repo root) and writes `_routes.json` so that only `/hi` and the analytics path invoke a Function; every other file stays static. Wrangler leaves the `functions/` sources out of the static upload.
- **Caching.** The HTML is `private, no-cache` with no validators: every load fetches it whole (about 24 KB). Cloudflare does not cache Function responses. `?lang=` and `?cc=` are part of the URL. The plates, masks, link-preview image, fonts, vCard and QR are the same for everyone and cache under `_headers` (`/hi/*` and `/vendor/fonts/hi/*`: `Cache-Control: public, max-age=604800`); the plate, mask and preview files carry a content hash in their names (§ 1), so a changed plate is a new URL. `_headers` rules do not apply to Function responses, which set their own.
- **Failure modes.**

| Failure | What the visitor gets |
|---|---|
| Function missing (local static server, a deploy without `functions/`) | no `data-cc`; pill order by language |
| Function throws | the plain asset, no `data-cc` |
| Country unknown (`XX`, Tor `T1`, absent) | no `data-cc` |
| Workers daily request limit reached (free plan, 100 000 a day across the account; /hi, `/region` and the analytics posts of every tagged page count) | Function requests fail; far beyond a business card's traffic |
| `localStorage` throws | no stored choice; the device rule applies on every visit |
| `navigator.languages` empty (old webviews) | `navigator.language`, else English |
| The inline apply script throws | after 1.5 s the English text shows |
| Visitor travels and revisits | fresh HTML, current country |

## 4. Copy

### The file

`content/copy.json` is the single place for /hi's customer strings. The editions copy table (`docs/plans/editions-copy-proposals.md`) stays the place for the home page's; each links to the other. Its `copy` block has the shape of a stet snapshot (`{locale: {key: text}}`, as `~/dev/chairtax/mvp/content/defaults.json`), so moving it into stet as `(project, key, locale)` versions is a copy; the page's text elements carry `data-stet="<key>"`, the attribute stet's HTML host reads.

```json
{
  "project": "njct",
  "default_locale": "en",
  "locales": ["en", "th", "zh-Hans", "zh-Hant", "he", "es"],
  "copy": {
    "en": { "hi_greet": "Hi, I’m Neil.", "hi_save": "Save contact", "hi_vcard_note": "Met through njct.io/hi" },
    "th": { "hi_greet": "สวัสดีครับ ผม Neil", "hi_save": "บันทึกรายชื่อ" }
  },
  "status": {
    "hi_greet": { "en": "approved: reused verbatim from njct.io About (data/projects.json about[0])", "th": "pending" },
    "hi_save": { "en": "pending", "th": "pending" },
    "hi_vcard_note": { "en": "pending" }
  }
}
```

Every `(key, locale)` in `copy` has a status: `pending`, or `approved <date>` with Neil's words or the source of reused approved copy. `build/hi.mjs --release` refuses any `pending` string and any `[[` placeholder (test T1). Keys written in English only (`hi_description`, `hi_vcard_note`) have an `en` entry alone and are English on every page; the other keys have all six locales.

### Proposal for Neil (all PENDING APPROVAL unless marked)

Every non-English line also needs a native speaker's read before release (§ 9, question 7). The Traditional column is the Simplified text in Traditional characters with Taiwan usage (創辦人, 聯絡, 儲存, 相簿, 搜尋, QR 碼).

| Key | Where | en | th | zh-Hans | zh-Hant | he | es |
|---|---|---|---|---|---|---|---|
| `hi_title` | browser tab, `og:title` | Neil · njct.io | Neil · njct.io | Neil · njct.io | Neil · njct.io | Neil · njct.io | Neil · njct.io |
| `hi_description` | meta description, `og:description` (read in English by crawlers and link previews) | Neil’s contact details: LinkedIn, WhatsApp, LINE and WeChat. | — | — | — | — | — |
| `hi_lang_name` | picker | English | ไทย | 简体中文 | 繁體中文 | עברית | Español |
| `hi_lang_label` | picker's accessible name | Language | ภาษา | 语言 | 語言 | שפה | Idioma |
| `hi_greet` | headline | Hi, I’m Neil. (**approved**: About, `about[0]`) | สวัสดีครับ ผม Neil | 你好，我是 Neil | 你好，我是 Neil | היי, אני ניל | ¡Hola! Soy Neil. |
| `hi_role` | under the headline | [[TITLE]], [[COMPANY]] (draft: Founder, [[COMPANY]]) | ผู้ก่อตั้ง [[COMPANY]] | [[COMPANY]] 创始人 | [[COMPANY]] 創辦人 | מייסד [[COMPANY]] | Fundador de [[COMPANY]] |
| `hi_lead` | lead line | Great to meet you. Here’s where to find me. | ยินดีที่ได้รู้จักครับ ติดต่อผมได้ทางนี้ | 很高兴认识你，可以在这里找到我。 | 很高興認識你，可以在這裡找到我。 | נעים להכיר! כאן אפשר למצוא אותי. | Encantado de conocerte. Aquí me encuentras. |
| `hi_about` | the extra line | B: I design and build end-to-end systems for companies that use AI. (A, verbatim approved `about[2]`: "Now I create end-to-end scalable architecture for companies that use AI") | ผมออกแบบและสร้างระบบครบวงจรให้บริษัทที่ใช้ AI ครับ | 我为使用 AI 的公司设计和搭建端到端的系统。 | 我為使用 AI 的公司設計和建置端到端的系統。 | אני מתכנן ובונה מערכות מקצה לקצה לחברות שמשתמשות ב-AI. | Diseño y construyo sistemas de principio a fin para empresas que usan IA. |
| `hi_channels_label` | the pills' accessible name | Contact | ช่องทางติดต่อ | 联系方式 | 聯絡方式 | יצירת קשר | Contacto |
| `hi_ch_linkedin` | pill | LinkedIn | LinkedIn | 领英 | LinkedIn | LinkedIn | LinkedIn |
| `hi_ch_whatsapp` | pill | WhatsApp | WhatsApp | WhatsApp | WhatsApp | WhatsApp | WhatsApp |
| `hi_ch_line` | pill | LINE | LINE | LINE | LINE | LINE | LINE |
| `hi_ch_wechat` | pill | WeChat | WeChat | 微信 | 微信 | WeChat | WeChat |
| `hi_save` | button | Save contact | บันทึกรายชื่อ | 保存联系人 | 儲存聯絡人 | שמירת איש קשר | Guardar contacto |
| `hi_wechat_title` | WeChat dialog heading | Add me on WeChat | เพิ่มผมเป็นเพื่อนใน WeChat | 加我微信 | 加我微信 | הוסיפו אותי ב-WeChat | Agrégame en WeChat |
| `hi_wechat_steps` | WeChat dialog text | Take a screenshot of this code. In WeChat, tap + then Scan, and choose the screenshot from your photos. Or search for my WeChat ID. | แคปหน้าจอโค้ดนี้ไว้ แล้วเปิด WeChat แตะ + แล้วเลือก Scan และเลือกภาพจากอัลบั้ม หรือค้นหา WeChat ID ของผม | 截图保存这个二维码，在微信里点“+”→“扫一扫”，从相册中选择截图。也可以搜索我的微信号。 | 截圖保存這個 QR 碼，在微信裡點「+」→「掃一掃」，從相簿中選擇截圖。也可以搜尋我的微信號。 | צלמו מסך של הקוד. ב-WeChat הקישו על + ואז Scan, ובחרו את צילום המסך מהתמונות. אפשר גם לחפש את מזהה ה-WeChat שלי. | Haz una captura de este código. En WeChat, toca + y luego Escanear, y elige la captura de tus fotos. O busca mi ID de WeChat. |
| `hi_wechat_qr_alt` | QR image's alt text | My WeChat QR code | QR code WeChat ของผม | 我的微信二维码 | 我的微信 QR 碼 | קוד ה-QR שלי ב-WeChat | Mi código QR de WeChat |
| `hi_wechat_id_label` | label by the ID | WeChat ID | WeChat ID | 微信号 | 微信號 | מזהה WeChat | ID de WeChat |
| `hi_copy` | copy button | Copy | คัดลอก | 复制 | 複製 | העתקה | Copiar |
| `hi_copied` | after copying | Copied | คัดลอกแล้ว | 已复制 | 已複製 | הועתק | Copiado |
| `hi_close` | dialog close | Close | ปิด | 关闭 | 關閉 | סגירה | Cerrar |
| `hi_wa_text` | WhatsApp prefilled message (§ 9, question 5) | Hi Neil, we just met. | สวัสดี Neil เราเพิ่งเจอกัน | 你好 Neil，我们刚刚见过面。 | 你好 Neil，我們剛剛見過面。 | היי ניל, נפגשנו הרגע. | Hola Neil, nos acabamos de conocer. |
| `hi_save_inapp` | shown only if C7 finds that an in-app browser cannot save the vCard | To save the contact, open this page in your browser. | เปิดหน้านี้ในเบราว์เซอร์เพื่อบันทึกรายชื่อ | 请在浏览器中打开此页面以保存联系人。 | 請在瀏覽器中開啟此頁面以儲存聯絡人。 | כדי לשמור את איש הקשר, פתחו את הדף בדפדפן. | Para guardar el contacto, abre esta página en tu navegador. |
| `hi_vcard_note` | the vCard's `NOTE` (§ 5; only if Neil keeps the field, § 9, question 4) | Met through njct.io/hi | — | — | — | — | — |

The Thai greeting and lead come from the v7 concept and v6, which Neil has seen; seen is not approved. The consent banner's wording and the cookie settings label are the analytics tool's (§ 9, question 9), and the privacy page's comes from `new-site-analytics privacy --product njct` (C6); both go to Neil the same way.

### Contact details (`content/contact.json`, placeholders until Neil supplies them)

```json
{
  "given_name": "Neil", "family_name": "[[FAMILY_NAME]]",
  "org": "[[COMPANY]]", "title": "[[TITLE]]",
  "email": "neil@njct.io", "web": "https://njct.io",
  "linkedin": "https://www.linkedin.com/in/[[HANDLE]]",
  "whatsapp": "[[E164_DIGITS]]",
  "line": "https://line.me/ti/p/[[LINE_LINK]]",
  "wechat_id": "[[WECHAT_ID]]"
}
```

## 5. Contacts

| Channel | Link | Behaviour |
|---|---|---|
| LinkedIn | `https://www.linkedin.com/in/<handle>` | opens the LinkedIn app through its universal / app link, else the web profile; unreachable in mainland China without a VPN (hence its place in the Chinese order) |
| WhatsApp | `https://wa.me/<digits>?text=<hi_wa_text, encoded>` (digits: the international number without `+`, spaces or leading zeros) | opens a chat with the message typed, not sent; without question 5's text, no `text` parameter |
| LINE | the link the LINE app gives under Add friends → My QR code → Copy link (`https://line.me/ti/p/<token>`) | opens the add-friend screen; works whatever Neil's "Allow others to add by ID" setting is. `https://line.me/ti/p/~<LINE ID>` is the fallback, and works only with that setting on |
| WeChat | opens a dialog: Neil's QR code (`hi/wechat-qr.png`, loaded when the dialog first opens), the steps, the WeChat ID in a box with Copy | WeChat has no web link that adds a contact; a phone cannot scan its own screen, hence the screenshot step. Copy uses `navigator.clipboard.writeText`; the ID box has `user-select: all` so a long press copies it where the clipboard API is refused |
| Save contact | `/hi/neil.vcf` | iOS Safari shows the contact card with Create New Contact; Android Chrome downloads the file and opens it in Contacts; desktop downloads it |

**WeChat dialog:** a `<dialog>` with the lifecycle of `contact.js`: `build()` (lines 18–46) makes it on first open and wires `cancel` (Escape) and a click on the backdrop to `close()`, and the close button; `open()` (91–107) calls `showModal()` and remembers the pill that opened it; `close()` (109–132) closes it and returns focus to that pill. It is styled as the picker's phone sheet, with no grow-from-pill animation. Without `HTMLDialogElement`, the pill's link to the QR image applies. The QR image is Neil's export from WeChat (Me → QR code → Save image), cropped to the code and re-encoded as a 2-colour PNG (≤ 6 KB).

**The vCard** is static: its content is the same for every visitor and language. `build/hi.mjs` writes it from `content/contact.json` and `content/copy.json` as vCard 3.0 (the version iOS and Android both import): CRLF line ends, UTF-8, lines folded at 75 octets, `\`, `,`, `;` and newlines escaped. Fields, pending Neil (§ 9, question 4): `N`, `FN`, `ORG`, `TITLE`, `TEL;TYPE=CELL` (the WhatsApp number), `EMAIL;TYPE=INTERNET`, `URL` (njct.io), `item1.URL` with `item1.X-ABLabel:LinkedIn`, `X-SOCIALPROFILE;TYPE=linkedin`, and optionally `NOTE` (the copy key `hi_vcard_note`, English, under the same approval status and `--release` gate as every other string) and `PHOTO` (a base64 JPEG adds 20–40 KB to the file only). `_headers` serves it with `Content-Type: text/vcard; charset=utf-8` and no `Content-Disposition`, so iOS shows the card in place. Everything in the vCard is public to anyone with the URL.

**In-app browsers.** Card scans open in the phone's browser from the camera, but a visitor scanning from inside LINE or WeChat lands in that app's webview. C7 tests Save contact and every pill in LINE's and WeChat's webviews on iOS and Android; if the vCard fails there, Save contact shows `hi_save_inapp` in those webviews (user agent contains `MicroMessenger` or `Line/`).

**Icons:** v6's SVGs (template lines 161–176; the Save contact glyph is on line 175), unchanged: the masks `m-li`, `m-line`, `m-wc` and the four channel glyphs, plus the person-plus glyph for Save contact.

## 6. Analytics

njct.io has no analytics yet. new-site-analytics is set up for it as product `njct` (`~/dev/new-site-analytics/docs/reference.md`), on /hi, the home page and the privacy page (D5). Setup creates a PostHog project in Neil's organisation (free) and reads the PostHog key from the vault (one Touch ID).

```
~/dev/new-site-analytics/analytics-personal/bin/new-site-analytics \
  --product njct --display-name "njct.io" --domain njct.io --host cloudflare \
  --site-dir . --functions-dir functions --snippet-path vendor/analytics/analytics.js \
  --prod-hosts njct.io --hosts njct.io,.njct-io.pages.dev --privacy-url /privacy --inject --dry-run
```

then the same without `--dry-run`, after `hi.html` and `privacy.html` exist. `--inject` puts the tag between `<!-- analytics:tag:begin -->` and `<!-- analytics:tag:end -->` before `</body>` in every top-level `*.html` of the site folder: `hi.html`, `index.html` and `privacy.html`. A re-run rewrites a page only when its tag differs, and `--inject` is not recorded in the profile, so every later setup run that should keep the pages current passes it again. `build/hi.mjs` rewrites only its own regions and leaves the tag region as it is. The tag is a classic script at the end of the body: it never blocks the first paint of the content above it, and posthog-js loads asynchronously after it.

**Events on /hi.**

| Event | Sent | Properties |
|---|---|---|
| `cta_clicked` (core; the snippet sends it from the tool's CTA marker, with the location marker beside it, per the reference's Integration contract) | a pill, Save contact, WeChat Copy | `cta`: `linkedin`, `whatsapp`, `line`, `wechat`, `save_contact`, `wechat_copy` (the CTA marker's value); `location`: `hi` (the location marker's value) |
| `hi_viewed` | once per load, on `DOMContentLoaded` (the snippet has run by then), through `window.siteAnalytics?.capture` | `lang` (a locale code), `lang_source` (`query`, `stored`, `device`, `default`), `cc` (or empty), `lead` (the first pill), `langs` (the first three entries of `navigator.languages`) |
| `hi_lang_changed` | a picker choice | `from`, `to` (locale codes) |

`hi_viewed` and `hi_lang_changed` are listed under `## Product events` in `docs/analytics.md`, so `lint` knows them. PostHog's own country (from the proxied IP) and `$browser_language` arrive with every event; `hi_viewed` adds what the page decided, so the D1 and D2 rules can be checked against real visits later. A pill opens another app at once; posthog-js flushes on page hide, and some taps may still be lost.

**Events on the home page and the privacy page.** `$pageview`, sent by posthog-js with the snippet's boot properties (`ac_version`, `env`, `ad_consent`, `internal`, and the first and last touch on consent). The integration contract asks nothing more of a page than the tag; the home page gets no markers and no product events in this build, so its whole change is the tag region.

**Consent.** Visitors from the EEA, the UK and Switzerland (Spain among them) see the consent banner; until they choose, visits are counted without cookies. /hi carries its own banner markup per the tool's Banner markup rules (the banner, text, privacy-link, accept and reject markers): a container with the class `consent`, a white sheet fixed to the bottom, two 48 px buttons, the site's pill style. While it shows, `body:has(.consent:not([hidden])) .page { padding-bottom: var(--consent-h); }` keeps Save contact reachable; a `ResizeObserver` on the banner writes its height to `--consent-h` on `html`. (On X5 WebViews without `:has()` the banner covers Save contact until the visitor chooses.) The home page and the privacy page show the snippet's default banner, which adds nothing to their markup. The banner's wording comes from `analytics-personal/copy.json`, which has English only: a Spanish page shows an English banner until Neil approves translations there (§ 9, question 9; a change in the new-site-analytics repo).

**Privacy page.** The banner links to `/privacy`, which njct.io lacks. C6 adds `privacy.html` (the site's type and colours, plain text) with the wording `new-site-analytics privacy --product njct` prints, after a `privacy.products.njct` entry is added to `analytics-personal/analytics.config.json` (the new-site-analytics repo; Neil approves the wording and the entry). The page ends with a "Cookie settings" control: an empty `<button type="button">` carrying the tool's settings marker, which the snippet fills with the copy's `settings_link` label and which reopens the banner. The label is new-site-analytics' own copy and goes to Neil for approval with the banner wording.

**The home page and `feat/room`.** On 16 Nov 2026 the only branch that changes `index.html` against `main` is `feat/room` (12 commits; checked with `git log --oneline main..<branch> -- index.html` over every local and remote `feat/*` branch; `feat/editions` has none), worktree `/Users/neil/dev/njct.io-editions`, pushed to origin. This branch's whole change to `index.html` is the tag region: three lines between the closing `</script>` of the shelf's module script and `</body>`, lines `feat/room` leaves as `main` has them. Whichever branch Neil approves first merges first; neither waits for the other.

- **`feat/hi` merges first.** `feat/room` takes `main` the way it takes every upstream change, by a merge commit in its own worktree (`git merge main`); it is pushed and its history holds merges, so it is never rebased. The tag region arrives as its own hunk.
- **`feat/room` merges first.** `feat/hi` (local, never pushed) rebases onto the new `main`: `git -C /Users/neil/dev/njct.io-hi rebase main`. If the C6 commit's `index.html` hunk conflicts, take `main`'s file (`git checkout main -- index.html`), re-run setup with `--inject` (it writes the region afresh), `git add index.html`, `git rebase --continue`.
- **After either,** on the branch that merged second: `grep -c 'analytics:tag:begin' index.html` prints 1, `new-site-analytics lint` exits 0, and `npm run check` exits 0.

**Done:** `new-site-analytics lint` exits 0; on the preview, `check --url https://feat-hi.njct-io.pages.dev/hi` and `check --url https://feat-hi.njct-io.pages.dev/` exit 0 (the /hi check's navigation pass follows the wordmark to the home page); after merge, `check --url https://njct.io/hi --production --nav-path /` and `check --url https://njct.io/ --production` exit 0. Neil opens `https://njct.io/?internal=1` once on his phones and main browsers so his own visits are tagged internal.

## 7. Performance and motion

A scan happens on mobile data, often with a weak signal. Budgets, transferred bytes (compressed):

| Item | Budget |
|---|---|
| `hi.html` (CSS, scripts, copy for six locales, icons, the analytics tag) | ≤ 24 KB |
| Inter subset (`vendor/fonts/hi/inter-hi.woff2`, weights 400–500, exactly the Latin-script glyphs of the copy) | ≤ 24 KB |
| Thai or Hebrew subset, only for that language (`unicode-range` U+0E00–0E7F, U+0590–05FF and U+FB1D–FB4F) | ≤ 14 KB |
| Portrait plate, AVIF | ≤ 90 KB |
| Sun mask | ≤ 4 KB |
| First view on a phone in English, before analytics | ≤ 145 KB |
| WeChat QR (on first open of the dialog) | ≤ 6 KB |
| Analytics after first paint: snippet, posthog-js, `/region`; the session-replay recorder for the sampled half of sessions | measured and reported in C7 |

Timing, under Lighthouse's mobile throttling (150 ms round trip, 1.6 Mbps down, 4× CPU slowdown), on the preview deploy: text visible (first contentful paint) ≤ 1.8 s; plate visible (largest contentful paint) ≤ 2.5 s.

**Fonts.** `build/hi-fonts.mjs` takes the sorted unique characters of the copy per face (Latin script for Inter, from every locale including the Latin words in the Chinese copy; Thai; Hebrew), requests Google Fonts `css2?family=<face>:wght@400..500&text=<chars>` (free, no key; a modern Chrome user agent so the answer is woff2), downloads the one `url(...)` in each answer, and records file, glyph set, request, byte size and sha256 in `vendor/fonts/hi/SOURCE.txt` and the glyph sets in `glyphs.json`, as `vendor/fonts/SOURCE.txt` does for the covers. The site's `inter-variable-ui.woff2` is not reused: it leaves out Latin-1 letters, which Spanish needs (¡, í, ñ). `@font-face` uses `font-display: fallback` (at most 100 ms of invisible text, then the fallback face); the head preloads Inter always, and Thai or Hebrew only for that language. Both Chinese locales use the system face and download no CJK font.

**Motion.**

- The leaves move in the café's wind at 30 Hz (v6's `tick`: frames at the display's rate only while the canvas fades in, then at most one every 29 ms).
- The canvas fades in over 1.2 s after its first frame.
- `prefers-reduced-motion: reduce`: one still frame at a fixed wind time, drawn at full opacity; no animation, no tilt.
- A hidden tab stops the loop (`visibilitychange`, as v6); so does the scene leaving the viewport (an `IntersectionObserver` on `.scene`).
- Tilt: on Android, where `deviceorientation` needs no permission, the leaves shift with the phone's tilt as in v6 (`onTilt`, the 150 ms low-pass). iOS asks permission for motion through a system dialog; the page never asks (§ 9, question 8).
- Test hooks, kept from v6: `?still` (no motion), `?t=<seconds>` (a still frame at that wind time), `?tilt=x,y`.

## 8. Chunks

Commit per chunk on `feat/hi`, messages starting `Hi:` (the repo's `Area: what changed` style), authored as `nj-io <26359601+nj-io@users.noreply.github.com>`. No push or merge without Neil's word. Each builder runs the suite once per run (`npm run test:hi`, `npm run check:hi`, and `npm run check` to confirm `dist/` is untouched).

Repo docs (this plan, `README.md`, everything under `docs/` but the generated `docs/analytics.md`) name the analytics tool's markers by role (the banner marker, the CTA marker, the settings marker) and never spell their attribute names: `new-site-analytics lint` scans `.md` files, and a doc that spells the banner marker without the other banner markers fails its `banner markers` check. Every builder that touches a doc greps it for the tool's attribute prefix before committing.

### Tests

Only these three. Each is seen failing before the code that makes it pass.

| Test | Guards | Red first |
|---|---|---|
| T1 `release gate` | publishing unapproved copy or a `[[` placeholder on the page every printed card opens, or in its vCard | `node build/hi.mjs --check --release` on the first `content/copy.json` (everything pending) exits 1, naming each pending key and locale, `hi_vcard_note` among them |
| T2 `glyph coverage` | a character drawn in a fallback face because its font subset lacks it (silent) | a fixture copy with a Thai character missing from the fixture `glyphs.json` makes `--check` exit 1, naming the character, face and key; a second fixture with a `zh-Hant` string holding a Latin letter missing from the fixture Inter set exits 1 naming the letter, `inter`, the key and `zh-Hant` (CJK characters are never checked: they use the system face) |
| T3 `language rules` | Neil's D1, D2 and D4 rulings | written before `hi/locale.mjs` exists, so it fails on the missing module; the rows below |

T3's rows (`resolveLang` unless marked):

| Input | Expected |
|---|---|
| languages `['en-US', 'th-TH']` | `th`, `device` |
| languages `['en-GB', 'he-IL']` | `he`, `device` |
| languages `['en', 'es', 'th']` | `es`, `device` |
| languages `['de-DE']` | `en`, `default` |
| languages `['en-GB']` | `en`, `device` |
| languages `['zh-TW', 'en']` | `zh-Hant`, `device` |
| languages `['zh-CN']` | `zh-Hans`, `device` |
| languages `['zh-HK']`, `['zh-MO']`, `['zh-Hant-TW']` | `zh-Hant` each |
| languages `['zh-Hans-CN']`, `['zh']` | `zh-Hans` each |
| languages `['iw-IL']` | `he` |
| languages `[]` | `en`, `default` |
| query `'xx'`, languages `['th-TH']` | `th`, `device` |
| query `'zh-hant'`, languages `['en']` | `zh-Hant`, `query` |
| stored `'es'`, languages `['th-TH']` | `es`, `stored` |
| query `'he'`, stored `'es'` | `he`, `query` |
| `pillOrder('en', 'TH')` | `line, whatsapp, linkedin, wechat` |
| `pillOrder('en', 'TW')`, `pillOrder('en', 'CN')` | `wechat, linkedin, whatsapp, line` |
| `pillOrder('en', 'MX')`, `pillOrder('en', 'IL')` | `whatsapp, linkedin, line, wechat` |
| `pillOrder('en', 'US')`, `pillOrder('en', undefined)` | `linkedin, whatsapp, line, wechat` |
| `pillOrder('zh-Hant', 'TW')`, `pillOrder('zh-Hant', 'HK')`, `pillOrder('zh-Hans', 'TH')` | `wechat, linkedin, whatsapp, line` |
| `pillOrder('th', 'US')` | `line, whatsapp, linkedin, wechat` |

`build/test/hi.test.mjs`, `node --test build/test/`, no dependencies. Everything else (the Function, the vCard, layout, motion) is verified by the checks in each chunk.

### C1 · The plates

- **Files:** `build/hi-plate.py`; `.gitignore` (`build/.venv/`); `hi/plate-*`, `hi/sun-*`, `hi/og.*`, `hi/plates.json`; in `_brand`: `v8/plate-portrait-<n>.png`, `v8/plate-landscape-<n>.png`, `v8/plate-portrait.png`, `v8/plate-landscape.png`, `v8/prompts.md`.
- **Builds:** the two image edits of § 1 (approved up to USD 0.30, at most three attempts per plate); the venv; `build/hi-plate.py` with § 1's hashing, budgets, shade-reference guard, sun masks, shade colour and override, contrast report and link-preview image.
- **Reuses:** `generate-image`'s `generate_image.py` with `-i` (as `v7/prompts.md`); Pillow.
- **Done:** each plate meets § 1's composition, has `ls_ll ≤ 0.75` and a printed contrast report; budgets met; `plates.json` written with hashed names; a second run of the script on the same inputs changes no file; a 390 × 844 overlay screenshot of the § 2 layout boxes on the portrait plate, and a 1440 × 900 one on the landscape plate, show no object under the text block; the measured cost per attempt is in the report; Neil sees and approves the plates before use (checkpoint).
- **Builder:** `implementer-sonnet-high`.

### C2 · Copy, contact data, language rules, fonts and the page build

- **Files:** `build/test/*` (first), `hi/locale.mjs`, `content/copy.json` (the § 4 proposal, all pending except the approved reuse), `content/contact.json` (placeholders), `build/hi.mjs`, `build/hi-fonts.mjs`, `vendor/fonts/hi/*`, `package.json` scripts (`build:hi`, `check:hi` = `--check`, `release:hi` = `--check --release`, `test:hi`).
- **Order:** T3 is written first and seen failing on the missing module; then `hi/locale.mjs` exactly as § 3, and T3 passes. T1 and T2 are written and seen failing before the parts of `build/hi.mjs` they guard.
- **`build/hi.mjs`**, on the pattern of `build/bundle.mjs` (marker regions rewritten in place; `--check` exits 1 when anything on disk differs from a fresh build):
  - `/* locale: written by build/hi.mjs */ … /* /locale */` in the head script: `hi/locale.mjs` with each leading `export ` removed;
  - `/* copy: … */ … /* /copy */`: `const COPY = {…}` from `content/copy.json`, keyed by the locale codes;
  - `/* plates: … */ … /* /plates */`: `const PLATES = {…}` from `hi/plates.json`;
  - `/* contact: … */ … /* /contact */`: `const CONTACT = {…}` (the links the script needs);
  - `<!-- head: … -->` and `<!-- picture: … -->` (§ 2): title, description, link-preview tags, `theme-color`, the `html` background, the plate preloads and the `<picture>`, every file name taken from `hi/plates.json`;
  - text: every element `<tag … data-stet="key">text</tag>` gets the English text (elements carrying `data-stet` hold text only; a pill's label is its own `<span data-stet>`);
  - links: every `<a … data-href="linkedin|whatsapp|line|wechat|vcf">` gets its `href` from `content/contact.json` (WeChat's is `/hi/wechat-qr.png`, the vCard's `/hi/neil.vcf`), the English pill order is the markup's order;
  - writes `hi/neil.vcf` (§ 5);
  - glyph check (T2): every character of the copy that belongs to a subset face is in that face's set in `glyphs.json`;
  - `--release` (T1): any `pending` status or `[[` in `copy`, `contact.json` or the vCard exits 1;
  - leaves every other part of `hi.html`, the analytics tag region included, as it is;
  - prints the count of pending strings on every run.
- **Done:** T1, T2 and T3 red then green; `npm run build:hi` writes the regions into a skeletal `hi.html`; `npm run check:hi` exits 0.
- **Builder:** `implementer-sonnet-high`.

### C3 · The page

- **Needs:** C2; C1's plates (a flat stand-in image of the same size, entered in `plates.json`, serves until then).
- **Files:** `hi.html`, `_headers`.
- **Builds:** the head (meta, `color-scheme`, `@font-face`, the inline resolver of § 3, with the generated head region), the scene box (§ 2), the header with the wordmark and the picker's trigger and list markup and CSS (closed and open states styled; the behaviour is C3b's), the text block, the pills, Save contact, `hiApply`, the no-JS behaviour, the type ramp, the phone, tablet and landscape layouts (the physical left offset of the landscape column), Hebrew RTL, safe areas. `hi/locale.mjs` is consumed as C2 left it.
- **Reuses**, from `/Users/neil/dev/_brand/creatives/njct/2026-11-07-hi-page/v6/I-cafe-light-v3/template.html`: the `:root` tokens and body setup (lines 12–36, without the softer ink), the picker CSS (61–101), the pill CSS (117–132), the icon masks and SVGs (161–176), `setLang`'s reordering of the pills (195–207, adapted into `hiApply`). From `index.html`: the wordmark's style and the `.pm` look.
- **Done:** screenshots in `.captures/hi/` (headless Chrome with `--use-mock-keychain --password-store=basic`, `?still`): 360 × 640, 375 × 667, 390 × 844 at 3×, 430 × 932, 844 × 390, 768 × 1024, 1440 × 900; all six locales at 390 × 844 and 1440 × 900, English, Thai and Hebrew at the others (Hebrew at 1440 × 900 shows the column at the left). Each shows: no sideways scroll, every control at least 44 px, Save contact on screen at load at 390 × 844, no text over the plate's objects at 390 × 844, 430 × 932 and 1440 × 900. JS off: English page, working links. `html.dataset.cc` set by hand to `TH` reorders an English page's pills and leaves a Chinese page's WeChat first. The first-paint check: with CPU at 4× slowdown, a Thai device shows no English text in any frame (a Chrome performance trace's screenshots). Neil sees the screenshots (checkpoint).
- **Builder:** `implementer-opus-high` (first build of an intricate step).

### C3b · Picker behaviour and the WeChat dialog

- **Needs:** C3.
- **Files:** `hi.html` (the picker script; the WeChat dialog's markup, CSS and script), `hi/wechat-qr.png` (a placeholder until Neil's export).
- **Builds:** the picker's behaviour (§ 3): open and close, keyboard, focus, the choice (`hiApply`, the stored choice, the `history.replaceState` that removes `lang`, `hi_lang_changed`); the WeChat dialog (§ 5): QR loaded on first open, steps, the ID box, Copy with its `hi_copied` state and the long-press fallback.
- **Reuses:** `menu.js` `start()` lines 58–90 (keyboard, focus and close behaviour), copied into the page; `contact.js` `build()`, `open()` and `close()` (lines 18–46, 91–107, 109–132) as the dialog's lifecycle. `menu.js` is not imported: it renders `LINEUP` and starts `contact.js`.
- **Done:** screenshots of the picker open on a phone (sheet) and on desktop (dropdown), and of the WeChat dialog in English, 简体中文 and 繁體中文; keyboard run (arrows, Home, End, Escape returns focus to the trigger; Escape on the dialog returns focus to the WeChat pill); `/hi?lang=th&cc=TH`, choose Español: the address becomes `/hi?cc=TH`, and a reload shows Spanish. Neil sees the screenshots with C3's (checkpoint).
- **Builder:** `implementer-sonnet-high`.

### C4 · The leaf shadows

- **Needs:** C1, C3.
- **Files:** `hi.html` (the renderer script); `hi/plates.json` (`leaves`, by hand; `shade_override` only if the numeric check below fails on the measured shade).
- **Builds:** v6's leaf renderer redrawn in plate coordinates as § 1 describes: one canvas the size of `.scene` at 0.75 bitmap pixels per CSS pixel (v6's `RES`), sprites in the shade colour, the sun mask by `destination-in`, `mix-blend-mode: multiply`. `build()` first sizes `.scene` in px when the browser lacks container units or `aspect-ratio` (§ 2), then builds the sprites. Leaf placement per plate in `PLATES.<p>.leaves` (crown, monsteras, frangipani branch; frangipani upper left and monstera at the right, as concept 1), placed where the plate's sun mask is above 0.5. Sizes, blurs (`SIG`), drifts and tilt amplitudes are v6's frame units times `PX = 1024 / 563` (plate pixels per CSS pixel on a 390 × 844 phone) for the portrait plate, and that times 1024 / 1536 for the landscape plate (its pixels cover 1.5 times as much wall). The plate changes with orientation (`matchMedia(WIDE)`), which runs `build()` again. § 7's motion rules.
- **Reuses**, from the v6 template: `rng`, `h1`, `poly`, `oval`, `crown`, `plumeria`, `monstera`, `stroke` (lines 250–283); `mk`, `blurred`, `sprite` with one bitmap per occluder (338–362; `raise` and the core/edge pair go); `rose`, `twig` and the crowns, monsteras and branch of `S` (372–390); the wind of `paint` (446–470: `gust`, `sway`, the crowns' drift, the monstera's turn, the branch tips, the rosettes' flutter); `tick`, `start`, `stop`, `rest`, `onTilt`, the resize rebuild (491–557, without iOS's permission request). Dropped: the window sprite, `table`, `stool`, `legs`, `torso`, `cranium`, `face`, the arms, `pose`, `reach`, the hello, `.seat`.
- **Done:** a 6-second screen recording at 390 × 844 (and one at 1440 × 900) shows the leaves swaying and fluttering in gusts, only inside the plate's sunlit areas; the shade colour checked in numbers: two screenshots at the same `?t=`, one with `#leaves` hidden by an injected style, and at a pixel where a monstera leaf's core covers a sunlit point (sun mask above 0.9), with-leaf ÷ without-leaf per channel equals `shade / 255` within ±0.02; the frame-time trace at 4× CPU slowdown holds the 30 Hz draws; reduced motion gives one still frame; a hidden tab draws nothing (rAF count); with `CSS.supports` forced false for both features (an injected stub), `.scene` gets the § 2 px size and the screenshot matches the normal one. Neil sees the recording (checkpoint).
- **Builder:** `implementer-opus-high`.

### C5 · The country Function

- **Files:** `functions/hi.js` (§ 3, as written there); `.gitignore` (`.wrangler/`).
- **Done:** under `npx wrangler pages dev . --port 8788` (no login needed): `/hi` answers 200 with `data-cc` on `<html>`, `cache-control: private, no-cache`, no `etag`; a request with `If-None-Match` set to the asset's ETag still answers 200; `/hi?lang=th` likewise; `/hi/` answers one 308 to `/hi` through the Function (wrangler's log shows the Function ran for it); `/hi.html` answers one redirect to `/hi`; `/` and a plate file named in `plates.json` are served static (no `private, no-cache`); every `/hi/*` asset `plates.json` names, and `/hi/neil.vcf` and `/hi/wechat-qr.png`, answers with its own content type (Pages answers an unknown path with the home page and 200, so a wrong asset path shows only here).
- **Builder:** `implementer-sonnet-high`.

### C6 · Analytics and the privacy page

- **Needs:** C3, C3b; Neil's approval of the privacy wording, the cookie settings label and the `privacy.products.njct` config entry.
- **Files:** in this repo, `functions/<P>/[[rest]].js`, `vendor/analytics/analytics.js`, `docs/analytics.md` (all generated; never edited by hand, apart from the profile's `## Product events` section), the tag regions in `hi.html`, `index.html` and `privacy.html` (written by `--inject`), the banner markup and the CTA and location markers in `hi.html`, `hi_viewed` and `hi_lang_changed`, `privacy.html` with the cookie settings control; in new-site-analytics, `analytics-personal/analytics.config.json` (`privacy.products.njct`), only on Neil's yes.
- **Order:** `privacy.html` first, so `--inject` finds it; then the dry run and the setup run of § 6.
- **Done:** `lint` exits 0; `git diff main -- index.html` shows only the tag region; the C5 checks still pass with the proxy Function present; `check` on the preview exits 0 for /hi and the home page (in C7, once the preview is deployed).
- **Builder:** `implementer-sonnet-high`.

### C7 · Verification and release

- **Validation run** (a separate Sonnet agent): re-runs every chunk's checks on the branch; measures § 7's bytes and timings on the preview; reports one table.
- **Preview deploy** (Neil's yes; wrangler has been logged out since the November compromise, so it uses the Cloudflare deploy token from the vault, read at the point of use into wrangler's environment only). It deploys a clean export of the committed branch, so nothing untracked (`build/.venv/`, `.wrangler/`, `.captures/`, `node_modules/`, `.env*`) is uploaded:

  ```
  out="$(mktemp -d)/njct-hi"; mkdir -p "$out"
  git -C /Users/neil/dev/njct.io-hi archive feat/hi | tar -x -C "$out"
  cd "$out" && CLOUDFLARE_API_TOKEN="$(vault-session --get --as wrangler '<item>')" \
    npx wrangler pages deploy . --project-name njct-io --branch feat-hi
  ```

  giving `https://feat-hi.njct-io.pages.dev/hi` (`CLOUDFLARE_ACCOUNT_ID` is added the same way if the token reaches more than one account). Then C5's checks against the preview, `curl` showing `data-cc` with the real country, `og:image` answering 200 `image/jpeg`, and the two `new-site-analytics check` runs of § 6.
- **Old WeChat on Android (X5):** the page in an X5 WebView (Neil's Android phone with WeChat's in-app browser, if it still runs X5; otherwise a Chromium 86 build in headless Chrome): the plate fills the screen behind the text, the leaves draw, the picker opens and closes, the pills and Save contact work.
- **Neil's device checks** on the preview, each a row in the report: iPhone camera scan of a QR for the preview URL, then each pill opens its app, Save contact creates the contact with every field, WeChat dialog, Copy; the same on an Android phone; LINE's and WeChat's in-app browsers on both; the six locales through the picker; a phone set to Thai, one set to Hebrew, and one set to Traditional Chinese; a link to `/hi` pasted into WhatsApp or LINE shows the preview image and title.
- **Release gate:** contact details and every string approved; `npm run release:hi` exits 0; `npm run check` exits 0; the merge order with `feat/room` followed (§ 6); Neil's word to merge.
- **After merge:** the production `curl` checks, including `cf-cache-status: DYNAMIC` on `/hi` and on `/hi?lang=th`, and a response body that ends with `</html>` (the rewriter passed the whole page); the two production `new-site-analytics check` runs of § 6; Neil scans a printed card with an iPhone and an Android phone.
- **Docs:** `README.md` gets a short `/hi` section (what it is, `npm run build:hi`, `build/hi-plate.py` and its venv, the dev URLs, `content/` as the copy's home).

## 9. Open questions for Neil

None blocks the start of C1. All are needed before release.

1. **Contact details:** LinkedIn profile URL; the WhatsApp number; the LINE add-friend link from the app (or the LINE ID); the WeChat ID and the QR image saved from WeChat; confirm `neil@njct.io` for the vCard.
2. **The extra text:** `hi_about` option A (verbatim approved), B, or other words; whether a second line is wanted.
3. **Company name and title:** the exact company name as it should appear (for example NJCT, NJCT Co., Ltd., or njct.io) and Neil's title, for the role line and the vCard.
4. **vCard fields:** which of name, company, title, mobile number, email, website, LinkedIn, a note (`hi_vcard_note`, drafted as "Met through njct.io/hi") and a photo.
5. **WhatsApp prefilled message:** on or off, and its wording (`hi_wa_text`).
6. **Link-preview copy:** `hi_title` and `hi_description`, which also fill `og:title` and `og:description`.
7. **Native readers** for the Thai, Simplified Chinese, Traditional Chinese, Hebrew and Spanish strings, or Neil's own read.
8. **iOS tilt:** leave the leaves untilted on iOS rather than show the motion permission dialog (recommended), or ask on the first tap as v6 did.
9. **Consent banner, cookie settings label and privacy page:** the banner wording in other languages (approve Spanish, and Thai, Chinese, Hebrew, in `analytics-personal/copy.json`, or leave the banner in English); the "Cookie settings" label from the tool's copy; the privacy wording from `privacy --product njct`; the snippet's default banner as it looks on the home page.
10. **Chinese channel names:** 微信 and 领英 on the Simplified page and 微信 with LinkedIn on the Traditional page (as proposed), or the Latin names.
11. **Search engines:** `noindex` on /hi (recommended: the WhatsApp link carries the phone number), or indexed.
12. **A link to the portfolio:** the header wordmark only (planned), or also a line under the pills reusing the live tagline "Products I've designed and built.".
13. **Preview deploy:** the go-ahead and the vault item for the Cloudflare deploy token.

## 10. v2 hooks

v2 adds a looping video, made with AI video generation, of a man who looks like Neil, seen only from behind or in an angled back profile, who comes to the table and drinks the coffee, combined with the code-drawn leaf shadows. v1 does these things so it drops in:

- **A layer slot.** `.scene` holds the plate, then the canvas; the video goes between them as `<video muted playsinline loop preload="none" poster="<the portrait plate's AVIF, from plates.json>">`, filling the same box, so the video, the plate and the leaves align by construction. The renderer's mask step (sun mask by `destination-in`) is one function, so v2 can add a matte that keeps leaf shade off the figure where he stands between the light and the wall.
- **Plate parity.** The plate is the loop's first and last frame: v2 generates image-to-video from the plate file itself, at the plate's framing, with a locked-off camera and the light unchanged, so the still, the video's ends and the code shadows all match. Plate-dependent values (file names, size, shade colour, sun mask, leaf layout, page colours) live only in `hi/plates.json`, so a v2 plate swaps them in one place.
- **Loop and pose constraints for v2's prompts:** the figure enters and leaves within the loop, so it starts and ends on the empty plate; he is never seen face-on; the sun does not move. A man standing at a high table puts his head near the text zone (around 40 % of the height), so v2 chooses between a framing that keeps him low (on a stool, leaning in) and a new plate, which then replaces v1's.
- **Loading and motion:** v2 loads the video after first paint and only when reduced motion is off; the plate stays the poster and the reduced-motion frame. The landscape plate gets a video only if v2 makes a landscape loop; until then wide screens keep the still plate with moving leaves.

## Changelog

- 2026-11-16: Neil's rulings (D1–D7) and the exit-gate review's findings folded in.
- 2026-11-16: D7, § 1 step 4 and § 2 ink: contrast is reported, not gated; small text may dip to about 3.4:1 in the darkest spots (Neil, 16 Nov 2026); three alternatives recorded as rejected.
