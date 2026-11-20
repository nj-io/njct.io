# v7 prompts (generated 16 Nov 2026)

Model gpt26-sunburst, `--size 1024x1536` on every call (portrait; the prompt text also states the aspect ratio).

Model: gpt-image-2.6-sunburst (script alias `gpt26-sunburst`), 1024x1536. Run 16 Nov 2026. The key came from `OPENAI_API_KEY` for this run, because the laptop's vault copy had an empty token while the Mac Mini was down.

Measured cost:

| Concept | USD |
|---|---|
| 1 | 0.0199 |
| 2 | 0.0340 |
| 3 | 0.0412 |
| 4 | 0.0412 |
| Total | 0.1363 |

References used per concept are in the table below.

Reference choice (every café-light capture in v3/I-cafe-light and v6/I-cafe-light-v3 shows a human shadow on the wall, so none is used; `v7/refs/home-*.png` show only an empty grey wall, so none is used):

| Concept | `--input` |
|---|---|
| 1 (café still life, Thai) | `v3/L-get-in-touch/en.png`, `v7/refs/about-390x844.png` |
| 2 (a cover for you) | `v3/J-cover/en.png`, `v7/refs/about-390x844.png` |
| 3, 4 | none |

Paths are relative to `/Users/neil/dev/njct.io/docs/design/hi-page-2026-11-07/`. Commands, run from that folder (prompt text is each section below, in quotes; `-i` comes last so it does not swallow the prompt):

```
python3 ~/.claude/skills/generate-image/scripts/generate_image.py gpt26-sunburst "<prompt 1>" --size 1024x1536 -o v7/1.png -t hi-page-v7 -i v3/L-get-in-touch/en.png v7/refs/about-390x844.png
python3 ~/.claude/skills/generate-image/scripts/generate_image.py gpt26-sunburst "<prompt 2>" --size 1024x1536 -o v7/2.png -t hi-page-v7 -i v3/J-cover/en.png v7/refs/about-390x844.png
python3 ~/.claude/skills/generate-image/scripts/generate_image.py gpt26-sunburst "<prompt 3>" --size 1024x1536 -o v7/3.png -t hi-page-v7
python3 ~/.claude/skills/generate-image/scripts/generate_image.py gpt26-sunburst "<prompt 4>" --size 1024x1536 -o v7/4.png -t hi-page-v7
```

## 1

A tall portrait phone screenshot, 9:19.5 aspect ratio, filling the whole frame edge to edge as a finished mobile web page, no phone hardware, no browser chrome, no status bar. The page background is the soft grey wall from the reference image, with late amber sun coming through a window and casting soft frangipani and monstera leaf shadows across the wall. The only objects are an open laptop and a flat white coffee in a cup, both on a high café table, seen in shadow in the lower part of the screen. There is no person, no hands and no human shadow anywhere. Over the scene sits the page content in a clean Inter-like sans-serif typeface, set in Thai. Greeting headline: "สวัสดีครับ ผม Neil". Below it, in smaller text: "ยินดีที่ได้รู้จักครับ ติดต่อผมได้ทางนี้". Then four rounded pill buttons stacked vertically, in this order: "LINE" (solid black pill with white text), "WhatsApp", "LinkedIn", "WeChat" (light pills with dark text). At the bottom a full-width button reading "บันทึกรายชื่อ". All text crisp, legible and spelled exactly as given. Real-looking, restrained, photographic atmosphere, no lorem ipsum.

## 2

A tall portrait phone screenshot, 9:19.5 aspect ratio, filling the whole frame edge to edge as a finished mobile web page, no phone hardware, no browser chrome, no status bar. Warm cream page in the style of the reference about page: Inter-like sans-serif, near-black ink, thin hairline dividers. In the upper middle, a square record-sleeve cover, like the project covers a record shelf would hold, leaning slightly lit by soft late sun on a soft grey wall; the cover reads "Hi" in large type and beneath it "Great to meet you". It is a cover made for the visitor who has just been handed it. No person, no hands, no shadow of a person. Below the cover, four rounded pill buttons stacked vertically in this order: "LinkedIn" (solid black pill, white text), "WhatsApp", "LINE", "WeChat" (light pills, dark text). At the bottom a full-width button "Save contact". All text crisp, legible and spelled exactly as given, no lorem ipsum.

## 3

A tall portrait phone screenshot, 9:19.5 aspect ratio, filling the whole frame edge to edge as a finished mobile web page, no phone hardware, no browser chrome, no status bar. Concept: a personal "hi" page opened by scanning the QR code on a business card. Someone has just met Neil, founder of a small studio of software products. The page greets the visitor and offers four contact buttons: "LinkedIn", "WhatsApp", "LINE", "WeChat", plus a "Save contact" button. Phone first, loads fast, meant to be fun. Greeting in English: "Hi, I'm Neil. Great to meet you." Make it a bold, playful, memorable concept that a design studio would pitch to a client, with a confident visual idea, strong colour and typography. No human figure, no face and no shadow of a person. All text crisp, legible and spelled exactly as given, no lorem ipsum.

## 4

A tall portrait phone screenshot, 9:19.5 aspect ratio, filling the whole frame edge to edge as a finished mobile web page, no phone hardware, no browser chrome, no status bar. Concept: a personal "hi" page opened by scanning the QR code on a business card. Someone has just met Neil, founder of a small studio of software products. The page greets the visitor and offers four contact buttons: "LinkedIn", "WhatsApp", "LINE", "WeChat", plus a "Save contact" button. Phone first, loads fast, meant to be fun. Greeting in English: "Hi, I'm Neil. Great to meet you." Take a clearly different direction from a typical bold graphic layout: something tactile and unexpected, such as real physical materials (paper, tape, stitched fabric, enamel pins or wood) photographed close up, that could still load fast on a phone. No human figure, no hands, no face and no shadow of a person. All text crisp, legible and spelled exactly as given, no lorem ipsum.
