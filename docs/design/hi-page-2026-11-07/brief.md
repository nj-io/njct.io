# njct.io/hi page designs, 2026-11-07

Requested by Neil in session `6ba60b26-2cfa-4839-8dfa-df933b8889b4` (project njct.io), 2026-11-07. Recovered 2026-11-16 from the session transcripts, because macOS deleted the session scratchpad. The only real numbers quoted are the measured v7 image costs.

## Goal (Neil, 16:49 UTC, verbatim)

> I want to create a customised njct.io/hi page, which is mobile first, which in stage 2 might use my own ai avatar head. It's supposed to be fun. In stage 1, I want it to be personalised to the users device, ie if its a thai person, I want to know from their fingerprint. Same goes for chinese, israeli, spanish, english. 
> 
> The basic thing that should tie it together - links to my contact, so pills for linkedin, wechat, line, whatsapp. The /hi link will be from my businesscard, which they will scan, so it needs to load fast

Follow-up at 16:55 UTC: "we will do one deeper pass. the hi page should allow a change of language from a picker. give me 4 mobile first renders, with different design inspirations. No mono text. Make none of them look like they were created by ai. Employ a skill if you need to. Run a very critical review to remove every ai typical trope"

## Constraints

- Mobile first (checked at 390x844 and 360 wide); loads fast, since the link comes from a business card QR code.
- Language picker; five languages: English, Thai, Chinese, Hebrew (right to left), Spanish.
- Contact pills: LinkedIn, WeChat, LINE, WhatsApp.
- No mono text; nothing that reads as AI-made; stage 2 may use Neil's AI avatar head.
- Must follow the existing njct.io design (Neil's round 1 verdict); from round 2 each design starts from the live site's world.

## Direction

Concept 1 of v7 (café still life, Thai) is the basis for the build.

**Stage v1 (to build):** concept 1's look, with more room for text, icons on the contact buttons, the company name, and the leaf shadows moving in the wind programmatically (as in the I rounds' canvas code).

**Stage v2 (later):** a smart loop made with AI video generation. Someone who looks like Neil, seen only from behind or in an angled back profile, goes to drink the coffee. The video is combined with the programmatic parts (the tree shadows moving in the wind) so it looks good. Neil, 16 Nov 2026: "v2 we can do some kind of smart loop where someone that looks like me from the back goes to drink the coffee, but you only ever see an angled profile of him. We will do it with AI vidgen, and combine the video with programatic parts (ie the tree shadows moving in the wind like before), so that it looks good"

## Rounds

### v7: ChatGPT concepts (16 Nov 2026)

- `v7/1.png` to `v7/4.png`: 1 Café still life (Thai), 2 A cover for you, 3 Unbounded: bold and playful, 4 Unbounded: tactile. Model gpt-image-2.6-sunburst, 1024x1536; measured cost USD 0.0199 / 0.0340 / 0.0412 / 0.0412 = 0.1363 total. Prompts and references: `v7/prompts.md`.

Neil, 16 Nov 2026: picked 1. "I think I like 1 the best. we need to add a bit more space for some more text, where necessary and icons, and maybe the company name somewhere." 2, 3 and 4 not chosen.

### v6: I v3: desk, laptop, stool, high table (2026-11-07 18:22 UTC)

- `v6/I-cafe-light-v3/index.html`: I v3: the shadow of Neil working at his desk by a laptop, with a stool and a high table

Neil, 16 Nov 2026: "Looks unrealistic and still pretty creepy". The human shadow is dropped. Built in response to "Maybe change the orientation so its more like its a shadow of me working at my desk by my laptop."

### v5: I v2: full-body shadow (2026-11-07 18:03 UTC)

- `v5/I-cafe-light-v2/index.html`: I v2 (copy taken 18:03): full-body shadow standing at the glass, wind, wave, tilt; 13.9 KB gzipped

Neil: "the new design is creepy. Maybe change the orientation so its more like its a shadow of me working at my desk by my laptop. New version. Keep this version"

### v5-early: I v2, early copy (2026-11-07 17:54 UTC)

- `v5-early/I-cafe-light-v2-early/index.html`: I v2 as copied at 17:54:14, before later tweaks to the tilt and light values

Neil: Same round as v5; the version Neil was looking at when he called it creepy is closest to this copy.

### v4: I v1 (2026-11-07 17:38 UTC)

- `v4/I-cafe-light-v1/index.html`: I v1: café light, head and shoulders shadow

Neil: "I like I, I just wonder how we could bring it to life and make the shadow look a bit more realistic. Right now the body is just suspended in mid air" (sent 17:35 UTC while v1 was being built)

### v3: Round 3: I, J, K, L (2026-11-07 17:23 to 17:38 UTC)

- `v3/I-cafe-light/index.html`: I. The café light
- `v3/J-cover/index.html`: J. A cover for them
- `v3/K-crate/index.html`: K. The crate
- `v3/L-get-in-touch/index.html`: L. Get in touch pill

Neil: I picked. J, K and L not chosen: "I like I, I just wonder how we could bring it to life and make the shadow look a bit more realistic. Right now the body is just suspended in mid air"

### v2: Round 2: E, F, G, H (2026-11-07 17:08 to 17:23 UTC)

- `v2/E-sleeve/index.html`: E. Neil sleeve
- `v2/F-sleeve-back/index.html`: F. Sleeve back
- `v2/G-about/index.html`: G. About page
- `v2/H-phone-crate/index.html`: H. Phone crate

Neil: "looking better. But essentially all 4 now lead with the same design element.... why not 4 different ones, that all are relevant to the home page?"

### v1: Round 1: A, B, C, D (2026-11-07 16:56 to 17:06 UTC)

- `v1/A-wayfinding/index.html`: A. Airport wayfinding
- `v1/B-riso/index.html`: B. Risograph zine
- `v1/C-postcard/index.html`: C. Airmail postcard
- `v1/D-chat/index.html`: D. Chat thread

Neil: "these are all so terrible. They don't consider for a second the existing design"

## Recovery

`recover.py` replays every Write, Edit and Bash command that touched `hi-designs/` in the main transcript and the 14 subagent transcripts, in timestamp order, in a sandbox: 244 tool calls, 0 Edit mismatches (reconstruction gaps). `replay.log` is the run log. `assemble.py` files the sandbox into `v1/` to `v6/`; `check.cjs` opens each page in headless Chrome and writes `preview-390x844.png` beside it.

Cross-check: the replayed I v2 is 13.9 KB gzipped and I v3 is 15.1 KB, the figures the building agent reported.

Not recovered, or different from the original:
- Screenshots (`en.png`, `picker.png`, `desk.png` and the like) are regenerated by replaying the same Chrome commands, not original bytes. Rounds A to D had playwright screenshot scripts, so their screenshots were not regenerated; each folder has the `preview-390x844.png` from `check.cjs` instead. Frame strips and scratch images in `work/`, `frames/`, `check/`, `shots/` are dropped; scripts in them are kept.
- Files built by `build.py` (E, F, H, I to K) read `/Users/neil/dev/njct.io` as it is on 2026-11-16, not on 7 Nov.
- `v3/session-gallery.html` is the session's work-in-progress gallery; its links expect the original folder layout.
- `v2/session-REVIEW.md` is the critic's review of round 2; the session's `BRIEF.md` files are in `v1/` and `v3/`.
- Critic crop images at the scratchpad root (`e-line.png`, `line-glyphs.png`) are not filed.
- G about page: its first font source is the site path `/vendor/fonts/...`, which fails from `file://` (one console error); the second source, the local file, loads.
- `v4/I-cafe-light-v1` is identical to `v3/I-cafe-light`.

## v2: the coffee loop (asked 16 Nov 2026, built 17 Nov 2026)

Asked by Neil: "some kind of smart loop where someone that looks like me from the back goes to drink the coffee, but you only ever see an angled profile of him. We will do it with AI vidgen, and combine the video with programatic parts." Later: the cup is held in his left hand; he turns to his right and walks off, never toward the camera; the whole action takes about 6–8 s; "4+4 is perfect". For the page (17 Nov): "this video loads in the background, so that people see the normal page first. Then we need a smooth transition to account for the shadows, and the shadows need to somehow continue behind the model (not on top)". Reference photos and a walking video of Neil, supplied 16 Nov, are in v9-video/refs/src/. Budget for the overnight build: USD 5.
