# njct.io Editions — copy proposals

Every string here waits for operator approval before it ships. Approved copy already live on njct.io (project names, tags, blurbs, figures, stacks, the About text) is not repeated here.

| # | Where | Proposed text | Source |
|---|---|---|---|
| 1 | Every cover front (top-left) and back (bottom-right): edition mark | njct.io | Covers, Wave 1a |
| 2 | About Neil cover front, top-right (where other covers carry the year) | About | Covers, Wave 1a |
| 3 | About Neil cover front title | Neil | Covers, Wave 1a |
| 4 | Back-cover link format | host and path without protocol, e.g. `github.com/nj-io/clauded`, `getstet.github.io` | Covers, Wave 1a |
| 5 | Header tagline | Systems I've designed and built. | Scene, Wave 1c |
| 6 | Header call-to-action button | Get in touch | Scene, Wave 1c |
| 7 | Topshine entry: name | Topshine (the product's own site writes it lowercase: "topshine") | Wave 2, from the lineup ruling |
| 8 | Topshine entry: tag | A video studio on open video models | Wave 2, drafted from the Topshine waitlist page |
| 9 | Topshine entry: blurb | Make a whole ad campaign, music video or film on open video models: every variant in one run, with a price before every run. | Wave 2, drafted from the Topshine waitlist page ("Make your whole ad campaign. Every variant, one run."; "A price before every run.") |
| 10 | Topshine entry: figures | $2.29 · 16-shot film plan; $0.24 · 4 clips on two models; $0.07 · 8-second clip | Wave 2, the three example plans on the Topshine waitlist page |
| 11 | Topshine entry: stack, year, url | Python · FastAPI · Postgres · rented RTX 5090s; 2026; no url (the waitlist is not public yet) | Wave 2, from `~/dev/topshine/docs/topshine-production-plan-2026-10-28.md` § 2 |
| 12 | Scorecard entry: tag | How websites win their traffic | Wave 2, drafted from the operator's description |
| 13 | Scorecard entry: blurb | A dashboard comparing how websites win traffic: their sources, links, social footprint and apps, every number with its source and date. | Wave 2, the operator's description plus `~/dev/site-scorecard/COVERAGE.md` ("Every number carries its source and date") |
| 14 | Scorecard entry: figures | 10 · sites compared side by side; 4 · views: sources, links, social, apps; Free first · paid data only where free routes fail | Wave 2, from the dashboard's compare limit and `~/dev/site-scorecard/RECIPE.md` |
| 15 | Scorecard entry: stack, year, url | Python · D3 · DataForSEO; 2026; no url (its only home is a private artifact) | Wave 2, from `~/dev/site-scorecard/` |
| 16 | Details: sticker on the sleeve's front, top right | Now playing (set in capitals on the sticker: NOW PLAYING) | Wave 2, the reference's Details sticker |
| 17 | Details: button under the sleeve | Open | Wave 2, the reference's Details button |
| 18 | Shelf: the two pills on a hovered or focused sleeve | Open; Details | Scene, Wave 1c, the reference's pills |
| 19 | Accessible names of the pills and the Details button | Open: <project name>; Details: <project name> | Scene, Waves 1c and 2 |
| 20 | Accessible names: sound toggle, the bottom index, the Details text | Sound on / Sound off; Projects; Project details | Scene, Waves 1c and 2 |
| 21 | Page title (browser tab) | njct.io Editions | Scene, Wave 1c |
| 22 | Record label of a project without a logo (Scorecard) | the project name, e.g. Scorecard | Wave 2 |
| 23 | Project page header, button | Back | Wave 3 |
| 24 | Project page footer, button | Back to the shelf | Wave 3 |
| 25 | Project page footer, link to the project | the project's host and path (row 4 format), e.g. `mirra.to`; no link when the project has no url | Wave 3 |
| 26 | Project page: the hero's index box and the left rail | Overview 01, Under the hood 02, Build process 03 (approved section names; the numbers are new) | Wave 3 |
| 27 | Project page: the vertical line beside the giant title | the project's tag (approved), e.g. "Real-time X→Telegram mirror and digest"; About Neil: its third About paragraph | Wave 3 |
| 28 | Project page: the hero's figure cards | the dossier's glance rows (approved), one card each | Wave 3 |
| 29 | Topshine and Scorecard pages, above the Overview lead | Draft for review | Wave 3; shown until rows 32 and 33 are approved |
| 30 | Project page when its file fails to load | This page did not load. | Wave 3 |
| 31 | Accessible names on the project page | Sections; Projects; a diagram is named by its caption (e.g. "Under the hood — the working architecture.") | Wave 3 |
| 32 | About Neil page layout | Heading: "Hi, I’m Neil." (about[0]); lead: about[1]; text: about[2] and about[3]; then every project's name and tag (approved) as links to its page; hero index box: the project names numbered 01–09 | Wave 3, from the approved about[] text |
| 33 | Topshine dossier | All of it: below | Wave 3, drafted from the Topshine repo |
| 34 | Scorecard dossier | All of it: below | Wave 3, drafted from the Scorecard memory note and `~/dev/site-scorecard/` |

## Row 33: Topshine dossier (proposal)

Ships as `editions/data/dossiers/topshine.json` with `"proposal": true`. Fields as the page shows them: **what** is the Overview lead, **glance** the figure rows and cards, **archHi** the Overview narration, **arch** Under the hood, **proc** Build process.

**what**

Plan a whole ad campaign, music video or film on open video models, see an expected price and a cap before it runs, and pay only for the clips that are made.

**glance**

| Label | Value |
|---|---|
| Models | LTX-2.5, H3 and FastH3, run on rented RTX 5090s |
| Price | An expected price and a cap on every session, shown before it runs |
| Billing | Charged only for clips that are made, never above the cap |
| Access | Planning, review and stitching screens, and an API with scoped keys |

**archHi**

```html
<p>Topshine is a hosted video studio on open-weights video models. It rents an RTX 5090 for each session of work and charges for the machine time the clips take.</p>
<ol>
<li><strong>Plan.</strong> A scene is a plan of shots, each with its prompt, length, frames and takes. A comparison runs the same prompts across models. Several plans can go into one session, built on the planning page or posted to the API.</li>
<li><strong>Quote.</strong> The session gets an expected price and a cap. Confirming holds the cap from prepaid credits, and the quote stays valid for 30 minutes.</li>
<li><strong>Run.</strong> The service takes the cheapest machine that fits the cap, watches its speed and makes the clips. The progress screen shows each clip as it lands and what has been spent so far. Clips can be added while the paid time still covers them.</li>
<li><strong>Review.</strong> Pick a take for each shot, trim, lay in music, a voiceover and captions, and stitch the cut into a film.</li>
</ol>
<p>When the session ends, the customer pays what the made clips cost, up to the cap. Failed clips cost nothing, a machine that fails its checks is replaced at the service's expense, and the rest of the hold returns to the balance.</p>
```

**arch**

```html
<p>The engine is videogen, a Python library that rents GPUs from live offers and drives the video models on them. Topshine vendors it unchanged and wraps it in accounts, credits, storage, a session queue, screens, email and operations.</p>
<ul>
<li><strong>Offers come from a snapshot.</strong> A supervisor fetches RTX 5090 offers from Vast.ai, RunPod and CloudRift every 60 seconds. Quotes and Confirm read that snapshot only while it is under two minutes old, so no customer request waits on a provider's feed.</li>
<li><strong>Two figures per quote.</strong> The expected price is the cheapest offer's typical estimate. The cap is the highest estimate among the three cheapest offers. The quote stores its offers and their rates, and a machine whose rate has risen since is skipped.</li>
<li><strong>The cap fixes the paid time.</strong> A machine's deadline is set from the cap when it is created and is never extended. Clips added mid-session are accepted only while the queue still fits before that deadline, so an addition needs no second hold. A file lock on the session's queue settles the race between an addition and the run closing.</li>
<li><strong>Waiting has a limit.</strong> When no offer fits the cap, the session waits and tries again every 5 minutes. After 30 minutes it fails and the hold is released in full.</li>
<li><strong>Credits move through a ledger.</strong> Purchases, holds, settlements, releases, refunds and adjustments are ledger rows, each with an idempotency key. Balances change in the same transaction under a row lock, and database constraints refuse an overdraw. A nightly task checks every balance against the ledger's sums and alerts on any difference.</li>
<li><strong>The charge follows the made clips.</strong> A session costs the GPU time of its made clips plus a share of the machine's startup, model download and idle time, in proportion to the generating time those clips took. Failed clips, and sessions that made nothing, are booked to the service.</li>
<li><strong>One task settles a session.</strong> Every path that ends a run queues the same settlement task under one key, so a session settles exactly once, whichever process noticed the end first. On restart the supervisor finds sessions whose process died by their free session lock, and settles them.</li>
<li><strong>The engine's ledger file is the record.</strong> Each engine row is appended to the session's own file first and mirrored to Postgres through a spool that retries every 10 seconds. The settlement re-imports the file before it computes, so a database outage mid-run loses no charge.</li>
</ul>
<p>Every rented machine is watched while it works:</p>
<table>
<tr><th>Check</th><th>When</th><th>On a fail</th></tr>
<tr><td>Download guard</td><td>during the 61 GB model download</td><td>after two slow windows in a row the machine is ended and the next offer is tried, at the service's cost</td></tr>
<tr><td>Pace check</td><td>while clips run</td><td>a clip over 1.5&times; its expected time ends the session on the clips made, and Retry quotes the rest</td></tr>
<tr><td>Destroy and verify</td><td>at the end of every session</td><td>a sweep every 10 minutes destroys any machine past its deadline, and an unverified destroy alerts the operator</td></tr>
</table>
<ul>
<li><strong>Bad hosts are remembered.</strong> A machine that fails a check ranks last for 14 days, for every account.</li>
<li><strong>Retries skip what cannot change.</strong> A failed clip gets a second pass while the machine is still up. Out of memory at that length, a refused input and a passed deadline are never retried.</li>
<li><strong>Accounts are sealed off.</strong> Every table carries the account, with row-level security, and an id that belongs to another account answers 404, the same as one that does not exist.</li>
</ul>
```

**proc**

```html
<ul>
<li><strong>One Python container with two processes.</strong> Python 3.12 on Railway. A FastAPI web process serves the screens, the <code>/v1</code> API and the Stripe and Clerk webhooks. A supervisor runs the session loop, the task pools and the schedules, and each session runs in its own subprocess that drives the engine on a rented RTX 5090. Postgres on Supabase holds accounts, money, sessions and clips through plain psycopg and numbered SQL migrations. Plan files live on a volume and finished clips in Cloudflare R2. Sign-in is Clerk, payments are Stripe Checkout and email is Resend.</li>
<li><strong>Ports and adapters at the engine boundary.</strong> The engine takes its side effects as injected hooks: the ledger writer, the cancel check, the queue refresh and close, and the alert sink. Topshine supplies its own, and every hook's default keeps the standalone tool's behaviour, so the same engine runs both.</li>
<li><strong>An explicit state machine with guarded transitions.</strong> A session moves through queued, starting, running and finishing to one of four end states. Each move is a conditional update that matches only from the expected state, so when a cancel and the supervisor's start race for the same session, exactly one wins.</li>
<li><strong>A transactional work queue in Postgres.</strong> Sessions and background tasks are claimed with <code>FOR UPDATE SKIP LOCKED</code>, and each task carries a unique key, so a retried or duplicated task does nothing.</li>
<li><strong>Idempotency at every entry point.</strong> Stripe webhooks are deduplicated by event id, API writes take an <code>Idempotency-Key</code> header, and ledger rows and emails carry unique keys. A retry anywhere writes nothing twice.</li>
<li><strong>An append-only log with a replayable projection.</strong> The engine's per-session usage file is the source of truth for billing. The ledger, clip and machine rows in Postgres are a projection of it, which the settlement rebuilds before it computes.</li>
<li><strong>Reconciliation as a scheduled job.</strong> Nightly, every account's balances are recomputed from the credit ledger and compared, and a mismatch alerts the operator.</li>
</ul>
```

**Sources** (field or bullet lead → file)

- what: /Users/neil/dev/topshine-design-waitlist/docs/copy.md § Public pages (home.lead, pricing.lead); /Users/neil/dev/topshine-design-waitlist/design/data/copy.js line 399 (waitlist.pill: ads, music videos and films)
- glance Models: /Users/neil/dev/topshine-design-waitlist/AGENTS.md line 3; /Users/neil/dev/topshine/docs/topshine-production-plan-2026-10-28.md § 1
- glance Price: /Users/neil/dev/topshine-design-waitlist/docs/copy.md § Confirm (confirm.typical, confirm.cap) and § Public pages (pricing.lead); /Users/neil/dev/topshine-design-waitlist/docs/backend-report-2026-10-28.md § 3.2
- glance Billing: /Users/neil/dev/topshine-design-waitlist/docs/copy.md § Public pages (terms.credits); /Users/neil/dev/topshine-design-waitlist/docs/api.md § The quote → session flow, step 4
- glance Access: /Users/neil/dev/topshine-design-waitlist/docs/backend-report-2026-10-28.md § 2 (Screens, API rows); /Users/neil/dev/topshine-design-waitlist/docs/api.md § Authentication
- archHi intro: /Users/neil/dev/topshine-design-waitlist/AGENTS.md line 3; /Users/neil/dev/topshine/docs/topshine-production-plan-2026-10-28.md § 1
- archHi Plan: /Users/neil/dev/topshine-design-waitlist/docs/copy.md § Header and projects (Scene, Comparison), § Planner and progress (editor.kept_note: takes; plan.count.label), § Confirm (quote.empty: 'these plans'); /Users/neil/dev/topshine-design-waitlist/docs/clicktest-issues-2026-10-29.md rows 9, 17 (creations × models, takes, seeds); /Users/neil/dev/topshine/docs/topshine-production-plan-2026-10-28.md § 5 (Planning row)
- archHi Quote: /Users/neil/dev/topshine-design-waitlist/docs/api.md § The quote → session flow, steps 2–3; /Users/neil/dev/topshine-design-waitlist/docs/backend-report-2026-10-28.md § 3.2
- archHi Run: /Users/neil/dev/topshine-design-waitlist/docs/backend-report-2026-10-28.md § 3.2 step 3, § 3.3, § 2 (Screens row); /Users/neil/dev/topshine-design-waitlist/docs/copy.md § Progress (progress.spend, progress.add.rule)
- archHi Review: /Users/neil/dev/topshine-design-waitlist/topshine/routes/review.py lines 10–14, 255–345 (music, voiceover, beats, captions); /Users/neil/dev/topshine/docs/topshine-production-plan-2026-10-28.md § 5 (Review and trim row); /Users/neil/dev/topshine-design-waitlist/docs/backend-report-2026-10-28.md § 1 step 5
- archHi closer: /Users/neil/dev/topshine-design-waitlist/docs/copy.md § Progress (progress.final, progress.machine.swapped, progress.final.partial); /Users/neil/dev/topshine/docs/topshine-production-plan-2026-10-28.md § 1 (The promise)
- arch intro: /Users/neil/dev/topshine-design-waitlist/AGENTS.md line 3; /Users/neil/dev/topshine/docs/topshine-production-plan-2026-10-28.md § 3.1 (ComfyUI on rented machines), § 3.2 (Reused as is)
- Offers come from a snapshot: /Users/neil/dev/topshine/docs/topshine-production-plan-2026-10-28.md § 3.8 (The offer snapshot), § 3.1 (Vast.ai, RunPod, CloudRift)
- Two figures per quote: /Users/neil/dev/topshine-design-waitlist/docs/backend-report-2026-10-28.md § 3.2 step 1; /Users/neil/dev/topshine/docs/topshine-production-plan-2026-10-28.md § 3.8 (The quote: rate promise)
- The cap fixes the paid time: /Users/neil/dev/topshine/docs/topshine-production-plan-2026-10-28.md § 3.6 (intro, The arbiter)
- Waiting has a limit: /Users/neil/dev/topshine-design-waitlist/docs/backend-report-2026-10-28.md § 3.2 step 3 and Gaps
- Credits move through a ledger: /Users/neil/dev/topshine/docs/topshine-production-plan-2026-10-28.md § 3.3 (Balances paragraph), § 3.7 (Entries table); /Users/neil/dev/topshine-design-waitlist/docs/backend-report-2026-10-28.md § 2 (Credits and payments row)
- The charge follows the made clips: /Users/neil/dev/topshine-design-waitlist/docs/backend-report-2026-10-28.md § 3.1 (What machine cost covers); /Users/neil/dev/topshine/docs/topshine-production-plan-2026-10-28.md § 3.7 (What the customer pays)
- One task settles a session: /Users/neil/dev/topshine/docs/topshine-production-plan-2026-10-28.md § 3.5 (One rule for terminal states; live state → finishing row)
- The engine's ledger file is the record: /Users/neil/dev/topshine/docs/topshine-production-plan-2026-10-28.md § 3.5 (The ledger hook, steps 1 and 4; settlement import paragraph)
- Machine checks table: /Users/neil/dev/topshine-design-waitlist/docs/backend-report-2026-10-28.md § 3.3 (table); /Users/neil/dev/topshine/docs/topshine-production-plan-2026-10-28.md § 3.8 (Machine faults), § 4 (Machine end row)
- Bad hosts are remembered: /Users/neil/dev/topshine-design-waitlist/docs/backend-report-2026-10-28.md § 3.3 (Memory of failures); /Users/neil/dev/topshine/docs/topshine-production-plan-2026-10-28.md § 3.8 (Machine faults)
- Retries skip what cannot change: /Users/neil/dev/topshine-design-waitlist/docs/backend-report-2026-10-28.md § 2 (Retries row)
- Accounts are sealed off: /Users/neil/dev/topshine-design-waitlist/docs/backend-report-2026-10-28.md § 2 (Accounts and login row); /Users/neil/dev/topshine-design-waitlist/docs/api.md § Authentication (last line)
- One Python container with two processes: /Users/neil/dev/topshine/docs/topshine-production-plan-2026-10-28.md § 2 (Stack table), § 3.1 (Components); /Users/neil/dev/topshine-design-waitlist/docs/backend-report-2026-10-28.md § 1 (stack table)
- Ports and adapters at the engine boundary: /Users/neil/dev/topshine/docs/topshine-production-plan-2026-10-28.md § 3.2 (rent/session.py row: 'Every default keeps the tool's behaviour'; session.notify row), § 3.5 (The driver, step 3)
- An explicit state machine with guarded transitions: /Users/neil/dev/topshine/docs/topshine-production-plan-2026-10-28.md § 3.5 (state table; queued → cancelled row: 'exactly one of them matches'); /Users/neil/dev/topshine-design-waitlist/docs/backend-report-2026-10-28.md § 2 (Job queue and recovery row)
- A transactional work queue in Postgres: /Users/neil/dev/topshine/docs/topshine-production-plan-2026-10-28.md § 3.1 (job loop FOR UPDATE SKIP LOCKED), § 3.3 (tasks table)
- Idempotency at every entry point: /Users/neil/dev/topshine/docs/topshine-production-plan-2026-10-28.md § 2 (Payments: webhook idempotency by event id), § 3.3 (credit_ledger, emails, stripe_events); /Users/neil/dev/topshine-design-waitlist/docs/api.md § The quote → session flow, step 3
- An append-only log with a replayable projection: /Users/neil/dev/topshine/docs/topshine-production-plan-2026-10-28.md § 3.3 (ledger_rows: 'the file is the truth'), § 3.5 (settlement import)
- Reconciliation as a scheduled job: /Users/neil/dev/topshine/docs/topshine-production-plan-2026-10-28.md § 3.3 (Balances paragraph); /Users/neil/dev/topshine-design-waitlist/docs/launch-2026-10-30.md § Stand-in runs (reconcile found no mismatch)

## Row 34: Scorecard dossier (proposal)

Ships as `editions/data/dossiers/scorecard.json` with `"proposal": true`. Fields as the page shows them: **what** is the Overview lead, **glance** the figure rows and cards, **archHi** the Overview narration, **arch** Under the hood, **proc** Build process.

**what**

Works out how a website gets its traffic, from rank, visits and channel mix to ads, search, links and mentions, with a source and date on every figure and sites compared side by side.

**glance**

| Label | Value |
|---|---|
| Covers | Traffic, ads, organic search, links, mentions and apps for each site |
| Compare | Up to ten sites side by side, sorted by rank, growth, visits or ad spend |
| Read-out | How each site gets its traffic, with a confidence level and the evidence |
| Cost | About $0.35 of paid data for a full analysis of one site |

**archHi**

```html
<p>Scorecard is a research dashboard that works out how a website gets its traffic. Every site goes through the same analysis, in the same order:</p>
<ol>
<li><strong>Profile.</strong> Category, pricing model, launch date with the evidence for it, the company, its technology and its apps.</li>
<li><strong>Size and trend.</strong> Daily traffic rank, monthly visits, countries, and how visitors behave once they arrive.</li>
<li><strong>Traffic mix.</strong> The share of visits from direct, search, paid, social, referrals and email. The mix decides where the rest of the analysis looks hardest.</li>
<li><strong>Paid.</strong> Ads found in the public ad libraries, the keywords and brands it bids on, and an estimate of monthly ad spend.</li>
<li><strong>Search and links.</strong> The keywords it ranks for, the searches similar sites win that it does not, and the domains linking to it over time.</li>
<li><strong>Mentions.</strong> Posts, videos, listings and reviews that name the site, channel by channel.</li>
<li><strong>Read-out.</strong> A few lines on how the site gets its traffic, with a confidence level and the evidence behind each.</li>
</ol>
<p>Sites sit in one sortable table and open side by side, up to ten at a time. Every figure names its source and date, so any finding can be checked, and the next site is analysed the same way. The findings feed the marketing of the other products in this portfolio.</p>
```

**arch**

```html
<p>A Python collector gathers the data and writes the dashboard's JSON data files, and the dashboard draws them with D3. Sources are chosen free first: a paid or credit source is used only where every free route failed, or where it adds depth a free route cannot give.</p>
<table>
<tr><th>Data</th><th>Source</th></tr>
<tr><td>Traffic rank</td><td>Tranco top-sites list, daily; Chrome UX Report top 1M, monthly</td></tr>
<tr><td>Visits, channel mix, countries, audience</td><td>Similarweb public estimates, collected through Apify</td></tr>
<tr><td>Phone and desktop split</td><td>Chrome UX Report, weekly</td></tr>
<tr><td>Organic search, keyword gap, top pages, links</td><td>DataForSEO Labs and Backlinks</td></tr>
<tr><td>Ads</td><td>Google Ads Transparency Center and the Meta, Microsoft, LinkedIn and TikTok ad libraries</td></tr>
<tr><td>Mentions</td><td>TikTok, Instagram, Reddit, X, YouTube, Hacker News, Product Hunt and directory listings</td></tr>
<tr><td>Profile</td><td>The site's own pages, Wayback captures, certificate records, App Store, Google Play and Trustpilot</td></tr>
</table>
<ul>
<li><strong>One part per source.</strong> The collector runs a fixed sequence of parts for each domain, and each part owns its own dashboard files. Parts that combine evidence run after the parts they read.</li>
<li><strong>Raw responses are kept.</strong> Every part saves its raw responses per site and reads them back on the next run, so a re-run costs nothing. A refresh flag re-collects.</li>
<li><strong>Paid calls are capped per run.</strong> Every paid call passes a guard that stops the run before a service would go past its cap, and each call's cost goes into a spend ledger. A dry run lists every paid call a run would make, with its estimated cost, and makes none.</li>
<li><strong>Mentions are graded.</strong> Brand names collide, so a hit counts only when it names the domain, the site's own handle or one of its artefacts, such as an export filename that creators leave in their captions. Hits on the brand word alone are listed for review, and known collisions are excluded. Counts show confirmed hits only.</li>
<li><strong>A verdict per ad platform.</strong> Eleven platforms each get Yes, No or Unknown from the platform's ad library, tracking code found on the site and campaign tags in archived links, with the reason and a confidence level. A platform whose library covers only the EU, or that has no library, stays Unknown unless the site's ads turn up there.</li>
<li><strong>Ads are sampled at both ends.</strong> For each format the gallery keeps the newest ads and the longest-running ones, and long runners are marked. Text ads that the library stores as images are read with macOS Vision.</li>
<li><strong>Ad spend is an estimate with its working.</strong> Visits &times; paid share &times; the cost per click of the site's top keywords, plus display, shown as a low-to-high range with the calculation beside it.</li>
<li><strong>Every row carries its date.</strong> Rows are stamped with the date they were collected, and every panel names its source. A channel searched with nothing found shows 0, and one not yet checked shows a dash. Known limits print beside the figure: Similarweb's two-month lag, Tranco's 30-day average, and a device split that counts Chrome only.</li>
<li><strong>Merges are per site.</strong> A merge replaces one site's rows and keeps every other site's, after copying the dashboard's data folder to a backup.</li>
<li><strong>Re-runs are requests.</strong> Each analysis runs once. Update now and monthly auto-update are recorded in the dashboard's database, and queued requests run on the next collection pass. Sites that appear as a similar site or a targeted brand for two or more tracked sites are listed as suggestions.</li>
</ul>
```

**proc**

```html
<ul>
<li><strong>A Python collector and a D3 dashboard.</strong> The collector is a run script with one module per family of sources. It loads pages in Playwright's headless Chromium, reads ad images through a small Swift helper that calls macOS Vision, and sends pages that block automated reads, such as the ad libraries, through a real-browser reader on an always-on Mac mini. DataForSEO supplies the search, keyword-gap and link data, paid per call from a deposit. The dashboard is one page drawn with D3 from the JSON data files, kept as a private artifact whose database holds update requests and settings.</li>
<li><strong>Pipes and filters.</strong> Each part reads raw responses and the outputs of the parts before it, and writes its own files. The ad-platform verdict is a filter over the ad-library, site-scan, archive and Similarweb outputs.</li>
<li><strong>Idempotent, cached collection.</strong> Raw responses are a read-through cache per site, and writing a part's rows replaces that site's rows and keeps every other site's. Running the same collection twice changes nothing and costs nothing.</li>
<li><strong>Dry-run planning with spend caps.</strong> Each paid call is declared to a guard before it is made. In a dry run the guard records the plan and skips the call; in a real run it enforces a per-service cap and writes the cost to the ledger.</li>
<li><strong>Data provenance on every value.</strong> Each row carries its collection date and each panel its source and method, and the dashboard's sources section lists where every number comes from.</li>
<li><strong>Precision-first entity matching.</strong> Mentions and ads are matched on the domain, the handle and known artefacts. Each site's profile records its brand word and its collision patterns, so a common word never inflates a count.</li>
<li><strong>Secrets read once into memory.</strong> All keys are read in one vault call per run and held only in that process's memory. A dry run reads none.</li>
</ul>
```

**Sources** (field or bullet lead → file)

- what: /Users/neil/.claude/projects/-Users-neil/memory/project_site_scorecard.md (description; 'Keep source, date and method visible for every number'); /Users/neil/dev/site-scorecard/RECIPE.md intro and § 1; /Users/neil/dev/site-scorecard/dashboard/index.html (Side by side; 'Where the data comes from')
- glance Covers: /Users/neil/dev/site-scorecard/dashboard/index.html (site sections: Traffic, Paid, Organic search, Similar sites, Links, Social and mentions, Apps, About the site)
- glance Compare: /Users/neil/.claude/projects/-Users-neil/memory/project_site_scorecard.md ('compare ticks (up to 10 sites)'); /Users/neil/dev/site-scorecard/dashboard/index.html (Sort: best rank, fastest growing, most visits, highest ad spend)
- glance Read-out: /Users/neil/dev/site-scorecard/RECIPE.md § 1 step 8, § 5; /Users/neil/dev/site-scorecard/dashboard/index.html ('How it gets traffic — Confidence'); /Users/neil/dev/site-scorecard/dashboard/data/readout.json
- glance Cost: /Users/neil/dev/site-scorecard/COVERAGE.md § Cost of one full analysis (Total ~$0.35)
- archHi list: /Users/neil/dev/site-scorecard/RECIPE.md § 1 (Order of work); /Users/neil/dev/site-scorecard/collect/README.md § Parts and costs per site (company, site_scan, keyword_gap); /Users/neil/dev/site-scorecard/dashboard/index.html (section headings)
- archHi closer: /Users/neil/dev/site-scorecard/RECIPE.md intro ('The findings feed our own products'); /Users/neil/.claude/projects/-Users-neil/memory/project_site_scorecard.md (Purpose)
- arch intro: /Users/neil/dev/site-scorecard/RECIPE.md intro ('free first'); /Users/neil/dev/site-scorecard/collect/README.md intro and § Run; /Users/neil/dev/site-scorecard/dashboard/build.js, d3.min.js
- Sources table: /Users/neil/dev/site-scorecard/RECIPE.md § 2; /Users/neil/dev/site-scorecard/collect/README.md § Parts and costs per site; /Users/neil/dev/site-scorecard/dashboard/data/mentions.json, channel_checks.json
- One part per source: /Users/neil/dev/site-scorecard/collect/run.py lines 17–38 (PARTS, 'Order matters')
- Raw responses are kept: /Users/neil/dev/site-scorecard/collect/run.py docstring; /Users/neil/dev/site-scorecard/collect/README.md § Run
- Paid calls are capped per run: /Users/neil/dev/site-scorecard/collect/common.py lines 175–206 (CAPS, guard, record); /Users/neil/dev/site-scorecard/collect/README.md § Caps
- Mentions are graded: /Users/neil/dev/site-scorecard/RECIPE.md § 3
- A verdict per ad platform: /Users/neil/dev/site-scorecard/collect/sources/ad_platforms.py docstring and PLATFORMS; /Users/neil/dev/site-scorecard/collect/README.md § Verdicts in ad_platforms; /Users/neil/dev/site-scorecard/dashboard/data/ad_platforms.json (verdict, confidence, reason)
- Ads are sampled at both ends: /Users/neil/dev/site-scorecard/collect/README.md § Parts (google_ads) and § Ad gallery sampling; /Users/neil/dev/site-scorecard/dashboard/index.html ('Ads running — days or more are marked')
- Ad spend is an estimate with its working: /Users/neil/dev/site-scorecard/COVERAGE.md § 5 (Estimated ad spend); /Users/neil/dev/site-scorecard/dashboard/data/site_facts.json (ad_spend_basis); /Users/neil/dev/site-scorecard/dashboard/index.html ('Estimate, low to high'; 'Worked out as')
- Every row carries its date: /Users/neil/dev/site-scorecard/collect/common.py write_rows (as_of); /Users/neil/dev/site-scorecard/dashboard/index.html ('0: searched, none —: not checked yet'; Tranco 30-day note; 'iPhone Safari is not counted'); /Users/neil/dev/site-scorecard/collect/README.md § Known limits
- Merges are per site: /Users/neil/dev/site-scorecard/collect/merge.py main(); /Users/neil/dev/site-scorecard/collect/README.md § Run
- Re-runs are requests: /Users/neil/.claude/projects/-Users-neil/memory/project_site_scorecard.md (Running costs); /Users/neil/dev/site-scorecard/dashboard/index.html (Updates; Suggested sites)
- A Python collector and a D3 dashboard: /Users/neil/dev/site-scorecard/collect/README.md § Run (Python 3.9, Playwright, swiftc OCR helper), § Parts (Mac Mini reader); /Users/neil/dev/site-scorecard/RECIPE.md § 2 (DataForSEO: $50 deposit, pay per call); /Users/neil/.claude/projects/-Users-neil/memory/project_site_scorecard.md (Dashboard-type artifact; database collections)
- Pipes and filters: /Users/neil/dev/site-scorecard/collect/run.py PARTS; /Users/neil/dev/site-scorecard/collect/sources/ad_platforms.py docstring
- Idempotent, cached collection: /Users/neil/dev/site-scorecard/collect/common.py write_rows ('Idempotent'); /Users/neil/dev/site-scorecard/collect/run.py docstring
- Dry-run planning with spend caps: /Users/neil/dev/site-scorecard/collect/common.py guard()
- Data provenance on every value: /Users/neil/.claude/projects/-Users-neil/memory/project_site_scorecard.md ('Keep source, date and method visible'); /Users/neil/dev/site-scorecard/dashboard/index.html ('Where the data comes from')
- Precision-first entity matching: /Users/neil/dev/site-scorecard/RECIPE.md § 3; /Users/neil/dev/site-scorecard/collect/README.md § Run (SITES profile: confirm and exclude patterns, brand word)
- Secrets read once into memory: /Users/neil/dev/site-scorecard/collect/README.md § Keys
