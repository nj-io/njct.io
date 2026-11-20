# njct.io/hi — design render brief (shared by all four directions)

## What it is
Neil (founder of njct.io, a small product studio; he builds software products) hands out a business card with a QR code. The person who scans it has just met him, in person, minutes ago. They are on a phone, often standing, often in Bangkok, Shanghai, Tel Aviv, Madrid or London. The page greets them in their language and gives them one tap to each of Neil's contact channels. It is supposed to be fun and personal. Stage 2 will put an animated AI avatar of Neil's head at the top, so every design has one clear place where a face/head can go (in the render: a placeholder that suits the design, e.g. a drawn head shape, a stamp portrait, a sticker. No stock photo, no grey circle with a person icon).

## Content (verbatim; do not invent other visible text)
Languages and copy (picker labels are the language names in their own script):

| code | picker label | greeting | line below | save button |
|---|---|---|---|---|
| en | English | Hi, I'm Neil. | Great to meet you. Here's where to find me. | Save contact |
| th | ไทย | สวัสดีครับ ผม Neil | ยินดีที่ได้รู้จักครับ ติดต่อผมได้ทางนี้ | บันทึกรายชื่อ |
| zh | 中文 | 你好，我是 Neil | 很高兴认识你，可以在这里找到我。 | 保存联系人 |
| he | עברית | היי, אני ניל | נעים להכיר! כאן אפשר למצוא אותי. | שמירת איש קשר |
| es | Español | ¡Hola! Soy Neil. | Encantado de conocerte. Aquí me encuentras. | Guardar contacto |

Contact channels (labels are brand names, same in every language): LinkedIn, WhatsApp, LINE, WeChat. Order per language: en LinkedIn, WhatsApp, LINE, WeChat · th LINE, WhatsApp, LinkedIn, WeChat · zh WeChat, LinkedIn, WhatsApp, LINE · he and es WhatsApp, LinkedIn, LINE, WeChat. Links can be placeholders (`#`). Small brand glyphs for the four channels are fine, drawn as inline SVG.

Also: the wordmark `njct.io` somewhere small. Nothing else. No taglines, no "Let's connect", no footer boilerplate, no emoji. If the design truly needs another string, do not render it; list it in your report as a proposal.

## Language picker (required)
A visible control lets the visitor change language. It shows the current language's name. Opening it lists all five by their own-script names. Choosing one swaps all copy and the channel order in place, without reload. Hebrew switches the whole layout to right-to-left (`dir="rtl"`), and the design must still hold up mirrored. The picker is part of the design, not a browser `<select>` dropped in. Support URL params so renders are reproducible: `?lang=xx` sets the language, `?picker=open` renders with the picker open.

## Hard rules
- Mobile first. Design at 390 × 844; must hold at 360 wide with no horizontal scroll; touch targets ≥ 44 px. Desktop just centres the phone layout sensibly.
- **No monospace type anywhere.**
- Fonts from Google Fonts are fine for the render. Every script must render well: pick faces for Thai, Hebrew and Simplified Chinese that sit with your Latin face (e.g. Noto/IBM Plex Sans Thai/Hebrew, Noto Sans SC, or better matches you find). Name them in your report.
- Single self-contained `index.html` per direction (inline CSS/JS/SVG), no frameworks. The real page must load fast from a QR scan, so keep it light: no WebGL, no big images, no libraries.
- One orchestrated moment of motion at most on load; respect `prefers-reduced-motion`. Renders are static screenshots, so the resting state must be the finished design.

## AI tropes that are banned (the operator wants nothing that looks AI-made)
Purple/indigo/blue-violet gradients; any decorative gradient wash; glassmorphism/frosted blur; glowing neon on near-black; blob or mesh backgrounds; film-grain/noise overlay used as a shortcut; warm cream (#F4F1EA-ish) + high-contrast serif + terracotta accent; near-black + one acid-green or vermilion accent; broadsheet hairlines and newspaper columns; identical rounded cards with the same soft grey shadow; one border-radius on everything; tracked-out ALL-CAPS eyebrow labels; middle-dot meta strings (A · B · C); spaced em-dash labels; `→` on buttons/links; accenting one word of a headline in italic/colour; numbered 01/02/03 markers; sparkles, waving-hand emoji or any emoji; centred hero + gradient text; Inter/Space Grotesk/DM Sans/Poppins as the default reach; tinted near-black (#0B0B0B/#111) used as black; fade-and-slide-up on every element; generic pill row of identical outlined buttons with icons.

## Deliverables (in your direction's folder)
1. `index.html`
2. Screenshots at 390 × 844, device scale 2, taken with headless Chrome after fonts load, e.g.
   `"/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" --headless=new --hide-scrollbars --force-device-scale-factor=2 --window-size=390,844 --virtual-time-budget=4000 --screenshot=<out.png> "file://<path>/index.html?lang=en"`
   - `en.png` (`?lang=en`), `picker.png` (`?lang=en&picker=open`), `he.png` (`?lang=he`), `th.png` (`?lang=th`), `zh.png` (`?lang=zh`), and `en-360.png` at 360 × 780.
3. Look at every screenshot yourself (Read the PNG) and fix what's wrong before you report. Clipped text, a Thai or Chinese line in a fallback system font, a broken RTL mirror, or an empty-looking first screen all count as wrong.
4. Report (short): the design plan (palette as named hexes, typefaces per script, layout idea, the one memorable thing), what you changed after reviewing your own plan against the trope list and why, and any extra strings you'd propose.

Write only inside your own folder. Do not touch the njct.io repo.
