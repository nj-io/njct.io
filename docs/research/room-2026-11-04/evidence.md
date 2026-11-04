# Room research evidence: Neil's 3D room portfolio

Compiled 3 Nov 2026 from web sources. Each finding gives its evidence, date and confidence (High, Medium, Low). Findings rated Weak are kept and labelled.

Method note: pages were read with WebSearch and WebFetch. Codrops pages returned 403 to WebFetch and were read through the Mac Mini browser. The three.js manual pages are JavaScript-rendered, so only their navigation text was retrieved.

## 1. Navigating a room

**General guidance.** Visible controls get used, and hidden controls are used less and later. Large virtual spaces need a map or a fixed reference point. Without one, visitors double back and miss rooms. Carousel-style "next" controls mostly get used on the first face.

**Findings**

- **Hidden navigation loses discoverability.** NN/g, 26 Jun 2016; 179 participants on 6 sites. Desktop use of hidden menus was 27%, against 48% for visible navigation and 50% for combo. Content discoverability fell by more than 20%. Desktop tasks were at least 39% slower with hidden navigation. Confidence: Medium-High. The study is from 2016 and covers six sites.
- **Carousel clicks cluster on the first slide.** Notre Dame, reported by Erik Runyon, 22 Jan 2013. About 1% of visitors clicked a feature. On ND.edu, 84% of those clicks hit position 1. On an auto-forwarding carousel, the first feature still took about 40%. Confidence: Low-Medium. This is one institution's analytics.
- **Counter-evidence on carousels.** Smashing Magazine, 9 Feb 2015. Across several mid-sized to large e-commerce sites (about 7.5 million carousel interaction events), 45.9% of deliberate interactions were on slides after the first. These were zoom interactions on mobile. Confidence: Low-Medium.
- **A map and a fixed reference point help.** Darken and Sibert, "Navigating Large Virtual Spaces" (1996; NASA tech report 1994). Maps and an absolute reference point improved search in large virtual worlds. Read from the abstract only. Confidence: Medium.
- **A hidden floor-plan map went unused.** arXiv 2310.11176, 17 Oct 2023. In an online museum tour, the floor-plan map was hidden, and participants did not know it existed. Once shown how it worked, most found it useful. Participants still struggled to tell which rooms they had already visited. Read from the abstract; participant count not retrieved. Confidence: Medium.
- **Map-overview teleport.** Caputo et al., Eurographics GCH 2019. Compares a map-based locomotion method against standard ones on orientation and motion sickness. Outcome data not retrieved. Weak.
- **Floor plan and arrows preferred.** Sulaiman et al., web panoramic museum, 2017. Interviews favoured a floor plan and navigation arrows. Abstract only. Weak.
- **Keyboard operation.** WCAG 2.1.1, Keyboard. Level A in WCAG 2.1; the level was taken from knowledge and not re-checked on the W3C page. Wire the arrow keys to the same turn actions that the buttons trigger. The exception for path-dependent pointer input is narrow for a turn control. Confidence: High.

**For the room.** Keep the wall index and turn arrows visible on every face. Label each arrow with its destination name, and show a room map by default. Give each other wall a visible preview or label. Do not rely on auto-rotation.

## 2. Motion comfort

**General guidance.** Camera moves that the visitor did not start cause disorientation. Reduced-motion users need a version with the motion removed. In VR, discrete turns are the comfort default and smooth turns are opt-in. Evidence for screen-based camera motion is thin.

**Findings**

- **WCAG 2.3.3, Animation from Interactions (AAA).** W3C Understanding page, updated 16 Sep 2025. Motion triggered by interaction can be disabled unless the motion is essential. Sufficient techniques: C39 (CSS prefers-reduced-motion), SCR40 (the same query in JavaScript), and Gx (a user preference that prevents animation). Confidence: High.
- **Reduced motion in practice.** web.dev, "prefers-reduced-motion"; date not shown in the fetched text. Non-essential movement should be removed, "preferably to the point where all non-essential movement is removed". For JavaScript animation, listen for changes to the query and stop any in-flight animation. Confidence: High for the content.
- **Snap turns versus smooth turns.** Meta developer docs, locomotion user preferences, last updated 8 Sep 2026. Snap turns minimise motion sickness but can disorient. Smooth turns give more control but can cause sickness. The page recommends comfort-friendly defaults and opt-in intensity, and suggests 30, 45 or 90 degree snap options. VR guidance only. Confidence: Medium. The transfer to a screen is an inference.
- **VR evidence is mixed.** ACM 2019, "Comfortable Locomotion in VR: Teleportation is Not a Complete Solution": teleport caused less sickness on average, but some participants were worse off. Nie et al., arXiv 2502.15227, Feb 2025: teleport and snap turns cut cybersickness but can disorient. A 2026 Frontiers study found continuous locomotion gave only a minimal spatial-orientation gain. Second-hand snippets. Confidence: Low-Medium.
- **Vection and sickness.** Kuiper, Bos and Diels, 2019: vection is not necessarily the cause of visually induced motion sickness. Patent application (Weak): multi-axis camera motion provokes more sickness than a single simple rotation. A 2023 study (DOI 10.1177/20416695231201463) found that small-field stimuli can still induce vection. Both Weak.
- **Scrolljacking.** NN/g, "Scrolljacking 101", 6 Aug 2023. The majority of participants were at least mildly disoriented. Disorientation was worse where navigation did not stay visible. The authors conclude that scrolljacking "leads to more user pain than benefits". Sample size is not stated in the fetched text. Confidence: Medium-High.

**For the room.** Under prefers-reduced-motion, make each turn an instant cut. The 90-degree stepped turn is the comfort default, and it needs an orientation cue such as the wall name and a highlighted map position. Do not move the camera on scroll or without a click or key press.

## 3. Exploratory 3D portfolios

**General guidance.** I found no independent, sourced measurement of time on site or bounce for exploratory 3D portfolios. The usual answer is a plain HTML view for weak devices, for crawlers, and for visitors who need the content quickly, with the 3D version as the main experience.

**Findings**

- **Vendor figures (Weak).** CrossFire Studio, reported by RealPage, 2009. Apartment-community sites with 3D floor plans reported bounce falling from a 33% industry average to under 3%, and visits of 7 to 8 minutes against 1.5 to 2 minutes. No method or sample given.
- **Agency anecdote (Weak).** DesignRush, undated. An agency reports longer time on site after adding scroll-linked 3D. No figures. It cites an unnamed study saying 69% of users found 3D elements held their attention.
- **Dropped.** A CMSmart claim of 50% more engagement and 30% lower bounce, attributed to an unnamed retailer. Unverifiable.
- **Fallback need.** Shopify's Spring '26 build has a tier-0 static fallback for devices without usable WebGL (see section 6). A web3dsurvey page, undated, puts WebGL 1 and WebGL 2 at about 98% of the browsers that ran its test. The sample is self-selected. So a fallback serves weak devices, context loss and crawlers, not most visitors. Confidence: Low-Medium.
- **Core Web Vitals.** Good LCP is 2.5 seconds or less, and good INP is 200 ms or less, both at the 75th percentile of real visits. INP replaced FID in March 2024. Confirmed only through third-party summaries; web.dev was not fetched. Confidence: Medium.
- **When an express view is needed.** No sourced threshold exists. The triggers the sources support are WebGL failure or context loss, weak device tiers, crawlers and screen readers. Wanting the services fast is a judgment call, not evidence.

**For the room.** No benchmark exists to predict engagement. Measure reach per wall, time per wall, use of the express link, and LCP and INP per device class from launch, using new-site-analytics. Ship an HTML view with the same content as the fallback.

## 4. Presenting services and getting in touch

**General guidance.** Services and contact belong in persistent, visible navigation. Hiding them inside a wall or a menu cuts discoverability. I found no sourced study of "what I do" and "hire me" placement in interactive portfolios.

**Findings**

- **Only sourced evidence.** NN/g, 26 Jun 2016, on hidden navigation (section 1). The reasonable reading is a persistent index for services and contact.
- **Review-time figures conflict and are unsourced (Weak).** Creative Bloq, citing UX coach Christina Wodtke, says reviewers give a portfolio about five minutes at a time. A 2026 guide says a first pass takes 90 seconds to three minutes. Penn State's careers page gives benchmarks of roughly 2 and 30 seconds.
- **NN/g hiring-manager portfolio study (Unverified).** A blog says NN/g interviewed more than 200 hiring managers. I could not find the study on nngroup.com.
- **Practice examples (Low-Medium).** Codrops, 5 Mar 2025: Stefan Vitasović's portfolio opens on a welcome screen, then moves to projects on scroll. Codrops, 5 Mar 2026: Corentin Bernadou's navigation is a hover mask that resizes to each link, so the links stay visible.

**For the room.** Put "What I do" and "Hire me" in a persistent index visible on every wall, and keep the same text in HTML. Place neither behind an easter egg or a hidden menu.

## 5. Easter eggs

**General guidance.** Practitioner guidance agrees on three points. Eggs reward the visitor who finds them. They must not block the main path. They must not slow the page. I found no empirical study of discoverability or reward for web easter eggs.

**Findings**

- **Google Images, Atari Breakout.** TechCrunch, 13 May 2013. A game ran inside image search, triggered by a query people already type. A "Return to image search" exit was available. Facts: High. Why it worked: an inference from the design, Medium.
- **Shopify Winter '25 hub.** Codrops, 17 Dec 2024. Eggs sit on top of a working hub. Drag the "boring" text to hear it. Buy merchandise through Shopify Checkout. Call a phone number. One click turns the hub into a CRT TV with 150+ AI-generated videos. A QR code turns a phone into a remote. Confidence: Medium. This is a Codrops write-up, not Shopify's engineering blog.
- **Discovery rate.** Treyarch's creative director, as reported in March 2021 coverage: under 2% of Zombies players found the eggs without YouTube. One studio's estimate. Confidence: Low-Medium.
- **Autodesk Ideas Exchange, undated.** Suggests keyboard-triggered changes. Warns that hidden features must not slow page loads and must be tested across browsers. Confidence: Low.
- **Dropped.** A 2008 Christian Science Monitor claim that 95% of visitors never see hidden flourishes (no source). A Zelda "2023 study" (no institution named).
- **Open leads.** The origin date of Google's "do a barrel roll" egg is not verified here. Politowski et al., "Creativity Beyond Functionality: An Observational Study of Easter Eggs in Video Games" (2026) exists; I did not read it. Weak.

**For the room.** Eggs add content and never gate it. Give each egg a visible hint on its wall. Every service and contact path must work without finding an egg. The number of eggs per room is a judgment call; no source supports a number.

## 6. Engineering a multi-wall WebGL room

**General guidance.** The strongest sources are MDN's WebGL guidance and Shopify's shipped build. Frame budgets on phones have no primary-source numbers.

**Frame and GPU budget on phones**

- MDN, "WebGL best practices", last modified 31 Oct 2026. Compressed textures (ETC1 on Android, PVRTC on iOS) are smaller in GPU memory and "precious on mobile". Avoid unconditional highp in fragment shaders. Handle webglcontextlost. Batch draw calls and use texture atlases. Mipmaps add about 33%. Size the canvas with ResizeObserver on device-pixel-content-box. Confidence: High for the advice.
- The 16.7 ms-per-frame budget at 60 fps is a common figure from secondary sources. One blog estimates about 200 microseconds per draw call. No primary source; not verified. Confidence: Low.
- Shopify Spring '26 (Codrops, 2026): device tiers 0 to 3; DPR capped by quality and viewport; mobile capped because "memory pressure matters more than peak benchmark score". Confidence: Medium-High. One case, no published numbers.
- The three.js manual has pages titled "Optimizing Lots of Objects", "Freeing Resources" and "Rendering On Demand". Their text was not retrieved. Claims about InstancedMesh, geometry merging and dispose are general knowledge and need checking before use.

**Render only what faces the camera; lazy-load each wall**

- Shopify mounts only the active and adjacent scenes, and unmounts and disposes the rest. Scroll-driven values are read from refs in the render loop, not React state. Confidence: High for the description.
- A tutorial recommends pausing the render loop when the canvas is off-screen, using IntersectionObserver. Secondary. Confidence: Low-Medium.

**Baked against real-time lighting**

- Three.js forum, thread 46759 (undated). Baking all lighting into one map is the cheapest to render and suits weak mobile GPUs. MeshBasicMaterial skips lighting. Confidence: Low-Medium.
- Unity manual, "Lighting in Unity" (2019.1). Baked lightmaps are fixed; dynamic lights and shadows cost per frame. Engine documentation, not Three.js. Confidence: Low-Medium.
- No 2025 mobile benchmark found.

**Text legibility in 3D**

- troika-three-text documentation (undated). Signed-distance-field text with antialiasing. It patches any Three.js material, so lighting and fog still work. Default SDF size is 64. An outline or halo helps on low-contrast backgrounds. Parsing and SDF generation run in a web worker, with a JavaScript fallback. preloadFont avoids first-frame stalls. renderOrder can fix edge artefacts. Confidence: Medium. Library documentation; no legibility study.

**Accessibility**

- @react-three/a11y documentation (undated). A semantic DOM layer absolutely positioned over the canvas, with focus, tab order and labels. Confidence: Medium.
- Figma, "Building accessibility into a canvas-based product" (date not retrieved). A hidden semantic counterpart for each meaningful object, with two-way sync between selection and focus. Confidence: Medium.
- Three.js forum, thread 87092 (undated). Canvas text is unreadable to screen readers, and a hidden mirror is the community workaround. Confidence: Low-Medium.
- Shopify Winter '25 uses React Three Fiber's A11y component so interactive elements work with screen readers. Confidence: Medium.
- Shopify Spring '26 removes scroll-driven splats under reduced motion but keeps pointer response. Confidence: Medium-High.

**SEO for canvas-heavy sites**

- Google, "Fix Search-related JavaScript problems" (no date in the retrieved text). Googlebot does not support WebGL, per the page's feature-detection example. Check that the rendered HTML holds all expected content. Confidence: High for the WebGL statement.
- Canvas text is not indexed. This is the consensus across vendor blogs, not a Google statement. Confidence: Medium.
- utsubo, "WebGL & Three.js Site SEO" (2026, per the title; vendor). Pages need HTML or server-rendered fallback text. Confidence: Low.

**For the room.** Put every wall's text in HTML beside or over the canvas, and use WebGL for atmosphere. Compress textures. Mount only the current and adjacent walls. Handle context loss. Cap pixel ratio by tier. Set frame and memory budgets by measuring on a real phone.

## 7. Trends, 2025 to 2026

**General guidance.** The sources are mostly practitioner write-ups and opinion. The strongest signal is that 3D and WebGL remain a main theme, and that scroll hijacking has measured costs.

**Findings**

- **Codrops year in review, 29 Dec 2025.** 3D and WebGL were the dominant recurring theme of the year's tutorials. Confidence: Medium.
- **Corentin Bernadou portfolio, 5 Mar 2026.** Three.js with GLSL, GSAP for animation, Lenis for smooth scroll, and a navigation hover mask. Confidence: Low-Medium. Practitioner write-up.
- **Stefan Vitasović portfolio, 5 Mar 2025.** The hardest part was merging WebGL scroll with navigation scroll. Confidence: Low-Medium.
- **Svilenković, "3D portfolio trends 2026" (undated, © 2026; the author sells Three.js sites).** Rising: restraint with one strong visual idea; scroll-driven case studies as chapters; phone-first review; custom type; respect for reduced motion. Overused: the "particle field hero with rotating logo", described as over-saturated. Dismissed: NFT-style 3D and metaverse sites. Forecasts for late 2026: WebGPU on Safari, and Gaussian splats for capture-driven tours. Opinion, no data. Confidence: Low.
- **Digidop, citing IONOS (undated).** Tactile, almost plastic 3D effects. 2026 mostly builds on earlier trends. Confidence: Low.
- **Awwwards Site of the Year 2025.** Digidop attributes it to a Lando Norris site built with Webflow, GSAP and WebGL. Not verified on Awwwards. Unverified.
- **Overuse with measured cost.** Scroll hijacking (NN/g, 2023; section 2). The particle hero is opinion only.

**For the room.** Keep to one visual idea per room. Avoid the particle hero and scroll hijacking.

## 8. Shopify Editions

**General guidance.** Shopify publishes no performance numbers, and I found no Shopify engineering post on the Editions build. The best material is Codrops walkthroughs, one of them based on interviews with Shopify's team.

**Findings**

- **Editions index (fetched).** Ten editions, about two a year: Summer 2022 "Connect to Consumer", Winter 2023 "Built to Last", Summer 2023 "Imagine My Business", Winter 2024 "Foundations", Summer 2024 "Unified", Summer 2025 "Horizons", Winter 2025 "Boring", Spring 2026 "Everywhere", Winter 2026 "Renaissance", Fall 2026 "Exponential". The page says nothing about how the site is built. Confidence: High for the list.
- **Awwwards, Summer '24 Edition site.** Site of the Day, 4 Jan 2025. Credited to "Shopify Design". Tags include 3D, Interaction Design, Microinteractions and Web & Interactive. No stack named. Confidence: Medium-High.
- **Codrops, Winter '25 hub, 17 Dec 2024.** A text-first hub with a CRT TV scene. The CRT shader is adapted from Martin Upitis's CRT shader. Built with React Three Fiber, Drei Text and RenderTexture, React Spring, a Blender-exported GLTF, VTT subtitles, and a Firebase QR remote. Accessibility through R3F's A11y component. Confidence: Medium-High. The write-up's own account.
- **Codrops, Spring '26 "Everywhere" (2026; date not in the fetched text).** Based on interviews with Shopify's creative director, Maggie Fost, and principal product designer, Andy Thelander. The editor's note says every Editions release comes with an interactive web experience. Architecture: DOM for content and interaction, one fullscreen WebGL canvas behind it, with atmosphere and scroll transitions in WebGL. Video preprocessed into KTX2 array textures and raymarched for soft light. A custom .mdpc point-cloud format, chosen because Gaussian splats were too heavy. Stacked RGB and alpha video for Safari, with the poster shown until the first frame paints. Context-loss recovery, especially on mobile Safari. Quality tiers, a DPR cap, and a mount window of the active and adjacent scenes. Scroll values kept out of React state. Confidence: High for what it describes.
- **Performance.** No published numbers. A social-media recap says the biggest gain came from removing a render-blocking CSS wait. Secondary. Confidence: Low.

**For the room.** Shopify's transferable pattern has four parts: the DOM-over-canvas split, device tiers with a static fallback, the mount window, and easter eggs layered over a working hub.

## Gaps and unverified items

- NN/g's carousel article returned 404 twice. The NN/g attribution for carousel findings is unverified; the figures above come from Notre Dame and Smashing.
- The NN/g hiring-manager portfolio study was not found.
- Darken and Sibert (1996), Sulaiman (2017) and Caputo (2019): abstracts only.
- Three.js manual optimisation and dispose pages: titles seen, text not retrieved.
- Awwwards Site of the Year 2025: not verified.
- The date of the Codrops Spring '26 article is not in the retrieved text.
- No sourced phone frame-time numbers exist. The Bozgeyikli 2016 paper was not read.

## Sources, with dates

1. NN/g, "Hamburger Menus", 26 Jun 2016. https://www.nngroup.com/articles/hamburger-menus/
2. Erik Runyon, "Carousel stats", 22 Jan 2013. https://erikrunyon.com/2013/01/carousel-stats/
3. Smashing Magazine, "An Exploration of Carousel Usage on Mobile E-commerce Websites", 9 Feb 2015. https://www.smashingmagazine.com/2015/02/carousel-usage-exploration-on-mobile-e-commerce-websites
4. NN/g, "Scrolljacking 101", 6 Aug 2023. https://www.nngroup.com/articles/scrolljacking-101/
5. W3C, Understanding SC 2.3.3 (WCAG 2.1), updated 16 Sep 2025. https://www.w3.org/WAI/WCAG21/Understanding/animation-from-interactions.html
6. web.dev, "prefers-reduced-motion" (date not shown). https://web.dev/articles/prefers-reduced-motion
7. Meta developers, "Locomotion user preferences", updated 8 Sep 2026. https://developers.meta.com/horizon/design/locomotion-user-preferences/
8. Meta developers, "Locomotion best practices", updated Dec 2025 (per search snippet). https://developers.meta.com/vr/design/locomotion-best-practices/
9. Darken and Sibert, "Navigating Large Virtual Spaces", 1996; NASA NTRS tech report, 1994. https://ntrs.nasa.gov/api/citations/19940029520/downloads/19940029520.pdf
10. arXiv 2310.11176, "Analyzing Behavior and User Experience in Online Museum Virtual Tours", 17 Oct 2023. https://arxiv.org/abs/2310.11176
11. Caputo et al., "A Comparison of Navigation Techniques in a Virtual Museum Scenario", Eurographics GCH 2019. https://diglib.eg.org/items/605e4941-b702-45d5-b60f-a04601cfa132/full
12. Sulaiman et al., web panoramic museum, 2017 (abstract only). https://diglib.eg.org/signposting/describedby/605e4941-b702-45d5-b60f-a04601cfa132
13. Kuiper, Bos and Diels, "Vection does not necessitate visually induced motion sickness", 2019. https://research.vu.nl/ws/files/118981466/Vection_does_not_necessitate_visually_induced_motion_sickness.pdf
14. Nie et al., arXiv 2502.15227, Feb 2025. https://www.arxiv.org/pdf/2502.15227
15. ACM 2019, "Comfortable Locomotion in VR: Teleportation is Not a Complete Solution". https://ro.uow.edu.au/sspapers/4617
16. Google Search Central, "Fix Search-related JavaScript problems" (date not shown). https://developers.google.com/search/docs/crawling-indexing/javascript/fix-search-javascript
17. MDN, "WebGL best practices", last modified 31 Oct 2026. https://developer.mozilla.org/en-US/docs/Web/API/WebGL_API/WebGL_best_practices
18. three.js manual, optimisation and dispose pages (titles only retrieved). https://threejs.org/manual/en/optimize-lots-of-objects.html
19. troika-three-text documentation (undated). https://protectwise.github.io/troika/troika-three-text
20. @react-three/a11y documentation (undated). https://docs.pmnd.rs/a11y
21. Figma, "Building accessibility into a canvas-based product" (date not retrieved). https://www.figma.com/blog/building-accessibility-into-a-canvas-based-product/
22. Three.js forum, "Accessibility for 3D websites", thread 87092 (undated). https://discourse.threejs.org/t/accessibility-for-3d-websites/87092
23. Three.js forum, "Why should I use lightmap instead of draw shadow in diffusemap", thread 46759 (undated). https://discourse.threejs.org/t/why-should-i-use-lightmap-instead-of-draw-shadow-in-diffusemap/46759
24. Unity manual, "Lighting in Unity" (2019.1). https://docs.unity.cn/2019.1/Documentation/Manual/LightingInUnity.html
25. utsubo, "WebGL & Three.js Site SEO" (2026, per the title; vendor). https://www.utsubo.com/blog/webgl-three-js-site-seo-rankable-guide
26. Shopify, Editions index (undated; fetched 3 Nov 2026). https://www.shopify.com/editions
27. Awwwards, "Shopify Editions | Summer '24", site of the day 4 Jan 2025. https://www.awwwards.com/sites/shopify-editions-summer-24
28. Codrops, "Shopify Winter '25 Edition: The 'Boring' Site That's Anything But", 17 Dec 2024. https://tympanus.net/codrops/2024/12/17/shopify-winter-25-edition-the-boring-site-thats-anything-but/
29. Codrops, "Engineering the Web Experience Behind Shopify's Spring '26 Edition: Everywhere" (2026; date not in retrieved text). https://tympanus.net/codrops/?p=116711
30. TechCrunch, Google Atari Breakout image-search easter egg, 13 May 2013. https://techcrunch.com/2013/05/13/google-commemorates-the-37th-anniversary-of-ataris-breakout-with-image-search-easter-egg
31. Gfinity, Treyarch Zombies easter-egg discovery rate, reporting March 2021. https://www.gfinityesports.com/article/cod-black-ops-cold-war-zombies-easter-eggs-easier-secrets-ps4-xbox-pc
32. Autodesk Ideas Exchange, "Ideas Easter Eggs" (undated). https://origin-exchange.autodesk.com/ideas-easter-eggs
33. Politowski et al., "Creativity Beyond Functionality", 2026 (lead only, not read). https://researchr.org/publication/PolitowskiSBFS26/bibtex
34. Codrops, year in review, 29 Dec 2025. https://tympanus.net/codrops/2025/12/29/2025-a-very-special-year-in-review/
35. Codrops, Corentin Bernadou portfolio, 5 Mar 2026. https://tympanus.net/codrops/2026/03/05/inside-corentin-bernadous-portfolio-swiss-inspired-layouts-webgl-geometry-and-thoughtful-motion/
36. Codrops, Stefan Vitasović portfolio case study, 5 Mar 2025. https://tympanus.net/codrops/2025/03/05/case-study-stefan-vitasovic-portfolio-2025/
37. Svilenković, "3D portfolio trends 2026" (undated, © 2026; the author sells services). https://svilenkovic.com/3d/3d-portfolio-trends-2026
38. Digidop, "5 web design trends" (undated; cites IONOS). https://www.digidop.com/blog/5-web-design-trends-2025/index.md
39. web3dsurvey.com, WebGL 2 support (undated; self-selected sample). https://web3dsurvey.com/webgl2
40. RealPage, CrossFire Studio 3D floor-plan release, 2009 (vendor). https://realpage.com/news/strategically-placed-3d-floor-plans-increase-site-usage-by-400
41. DesignRush, "When 3D Web Design Drives Real UX Performance" (undated; agency case). https://www.designrush.com/best-designs/websites/trends/how-3d-web-design-drives-real-ux-performance
42. Creative Bloq, "Design a winning UX portfolio" (undated; cites Christina Wodtke). https://www.creativebloq.com/portfolios/design-winning-ux-portfolio-61620753
