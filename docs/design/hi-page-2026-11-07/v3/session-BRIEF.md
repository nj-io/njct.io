# njct.io/hi: design render brief, round 2 (shared by all four directions)

Round 1 was rejected because it ignored the existing site. This page is a room in the njct.io world, not a new brand. Study the existing design before you plan anything, and make every choice traceable to it.

## What it is
Neil (njct.io, products he designs and builds) hands out a business card with a QR code. The person who scans it met him minutes ago, in person, on a phone, often in Bangkok, Shanghai, Tel Aviv, Madrid or London. The page greets them in their language and gives one tap to each of his contact channels. It should be fun and personal. Stage 2 puts an animated AI avatar of Neil's head on the page.

## The existing design (study it first)
- Live: https://njct.io (desktop: a record shelf; phone below 600 px: a "crate" of stacked sleeves) and https://njct.io/#about (About Neil page).
- Screenshots of it: `/private/tmp/claude-501/-Users-neil-dev-njct-io/6ba60b26-2cfa-4839-8dfa-df933b8889b4/scratchpad/site/` (phone.png, desk.png, phone-about.png). Look at them.
- Repo (read only, do not edit): `/Users/neil/dev/njct.io`.
  - `index.html` lines 1 to 120: the UI chrome. Ground is a light grey wall (rgb 220, darker ~204 on phones) with a soft radial light. Type is Inter variable, self-hosted as `vendor/fonts/ui/inter-variable-ui.woff2` (family name "NJ Text"), 14/20 px UI, weight 500 wordmark. Ink #000 and rgba(0,0,0,.6). Buttons are pills: black #000 with white text (Get in touch, Open), and a light grey pill (Details). The "Projects ⌄" control in the header is a dropdown, the model for the language picker.
  - The café: late golden sun through a window with tropical leaf shadows falls across the grey wall (`scene/sun.js`, `scene/config.js` lines 86 to 101). On desk.png it is the warm peach light patch.
  - **The About Neil cover** (`covers/covers.js` around line 1750, `MOTIFS.about` around line 1173, `covers/thumbs/about.webp`, traced letters `covers/letters/about.json`): gold "Neil" lettering (inks #D2A64E, #A8771F) over an orange sphere lit like a sundial, on paper #F2E7D3 / #E8D8BC. Back: paper #F4EADA, ink #4A3212, soft #86704E, accent #B8862C, headline "Hi, I'm Neil." in Fraunces 144pt bold (`vendor/fonts/fraunces-144pt-bold-cover.woff2`, a subset holding only the glyphs of "Stellar Explorer" and "Hi, I’m Neil.").
  - The About page (phone-about.png): beige ground, very large Inter "Hi, I'm Neil.", the project list in rows divided by thin lines.
  - Other cover faces in `vendor/fonts/` (Bricolage Grotesque 800, Hanken Grotesk 600) are subsets; for the render you may load the full families from Google Fonts.
- **The orange sphere on the Neil cover is the stage-2 head.** Every direction keeps the sphere as the avatar's place (in stage 2 the head replaces it, lit the same way). In the render it is the sphere, drawn in CSS/SVG (radial shading, the sundial light from the right), not an image of a person.

## Content (verbatim; do not invent other visible text)

| code | picker label | greeting | line below | save button |
|---|---|---|---|---|
| en | English | Hi, I’m Neil. | Great to meet you. Here's where to find me. | Save contact |
| th | ไทย | สวัสดีครับ ผม Neil | ยินดีที่ได้รู้จักครับ ติดต่อผมได้ทางนี้ | บันทึกรายชื่อ |
| zh | 中文 | 你好，我是 Neil | 很高兴认识你，可以在这里找到我。 | 保存联系人 |
| he | עברית | היי, אני ניל | נעים להכיר! כאן אפשר למצוא אותי. | שמירת איש קשר |
| es | Español | ¡Hola! Soy Neil. | Encantado de conocerte. Aquí me encuentras. | Guardar contacto |

Channels (brand names, same in every language): LinkedIn, WhatsApp, LINE, WeChat. Order: en LinkedIn, WhatsApp, LINE, WeChat · th LINE, WhatsApp, LinkedIn, WeChat · zh WeChat, LinkedIn, WhatsApp, LINE · he and es WhatsApp, LinkedIn, LINE, WeChat. Links are `#`. Small one-colour channel glyphs as inline SVG are fine. The wordmark `njct.io` sits where the site puts it (top left, weight 500). If the design needs another string, don't render it; list it in your report.

## Language picker (required)
Built like the site's "Projects ⌄" dropdown. It shows the current language's name; opening lists all five by own-script name; choosing swaps all copy and the channel order in place, no reload. Hebrew switches to `dir="rtl"` and must hold up mirrored. URL params: `?lang=xx`, `?picker=open`.

## Hard rules
- Mobile first: 390 × 844, holds at 360 with no horizontal scroll, touch targets ≥ 44 px. Desktop centres it sensibly.
- No monospace anywhere.
- Latin in Inter (load the repo's woff2 by absolute file path or Inter from Google Fonts) unless your direction calls for one of the cover faces listed above. Thai, Hebrew, Simplified Chinese faces that sit with Inter (e.g. Noto Sans Thai, Noto Sans Hebrew, Noto Sans SC). No line may render in a system fallback.
- One self-contained `index.html` (inline CSS/JS/SVG; only the repo's own assets by absolute path or Google Fonts). No WebGL, no libraries, no photos. It must load fast from a QR scan.
- At most one orchestrated motion on load; respect `prefers-reduced-motion`; the resting state is the finished design.
- Avoid AI tropes: decorative gradient washes (the sun patch and sphere shading are the site's own light, so they are allowed), glassmorphism, neon, blobs, noise overlays, tracked-out ALL-CAPS eyebrows, middle-dot meta strings, spaced em-dash labels, `→` on buttons, one accented word in a headline, 01/02/03 markers, emoji, sparkles, identical rounded cards with the same soft grey shadow, fade-and-slide-up on every element.

## Rendering (important)
`Google Chrome --headless=new` on this Mac won't go narrower than 500 px and silently crops. Use
`~/.cache/puppeteer/chrome-headless-shell/mac_arm-154.0.8037.57/chrome-headless-shell-mac-arm64/chrome-headless-shell --hide-scrollbars --force-device-scale-factor=2 --window-size=390,844 --virtual-time-budget=4000 --screenshot=<out.png> "file://<path>/index.html?lang=en"`.
Make `en.png`, `picker.png` (`?lang=en&picker=open`), `he.png`, `th.png`, `zh.png`, `en-360.png` (360 × 780). Put en.png next to `/private/tmp/claude-501/-Users-neil-dev-njct-io/6ba60b26-2cfa-4839-8dfa-df933b8889b4/scratchpad/site/phone.png` in your head and ask: does this look like the same site? Fix what doesn't before you report.

## Report (short)
How the design follows the existing site (which elements it reuses), palette as named hexes, type per script, the one memorable thing, and any extra strings you'd propose. Write only inside your own folder.

## Round 3 change (overrides the stage-2 head rule above)
Round 2 (in `round-2/`) looked like the site but all four led with the same element, the Neil cover and its orange sphere. In round 3 each design leads with a *different* element of the home page, named in its own prompt. The Neil cover and the sphere are not the lead and are not the stage-2 head's place; each prompt names that place. Round 2's code is in `round-2/{e-sleeve,f-back,g-about,h-crate}/` (index.html, and template/src + build.py where present); reuse whatever helps, especially the header, picker, fonts and render scripts, which were already correct. Known round-2 defects not to repeat: e-sleeve's LINE glyph clipped to "LIN"; h-crate's greeting too small to read as the welcome. The repo's Inter woff2 is ASCII-only, so take Inter from Google Fonts. chrome-headless-shell freezes CSS animations under virtual time: drive the one load motion from JS with a timeout snap to rest, and check it by stepping frames.
