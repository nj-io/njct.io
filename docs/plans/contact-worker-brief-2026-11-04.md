# Get in touch: sending the contact form

- **Branch:** `feat/editions`. A single small feature, so it needs no worktree of its own.
- **Ruling (Neil, 2026-11-04):** the form sends through a small Cloudflare Worker.
- **Gate:** the product wording (round 2 in `docs/plans/editions-copy-proposals.md`) is approved first. The Worker is built after that.

## What exists
- `editions/contact.js` opens the modal from every "Get in touch" link: the shelf header and every project page. Links are matched on `href = CONTACT` from `editions/scene/config.js`, which is `mailto:neil@njct.io`.
- The form has Name, Email and Message fields. Send composes an email in the visitor's mail app (`location.href = mailto:…`), then closes the modal.
- The link's `mailto:` stays the fallback when scripts don't run.

## Build
1. **Worker** `njct-contact`, routed at `njct.io/api/contact`, accepting POST only.
   - It reads JSON `{ name, email, message, website }`. `website` is a hidden honeypot field: when it's filled, the Worker answers 200 and sends nothing.
   - **Validation:** name 1–100 characters, a plausible email address (up to 200 characters), message 1–5000 characters. Anything else gets a 400 with `{ error: "invalid" }`.
   - **Rate limit:** 5 sends per IP per hour, using the Workers rate-limiting binding. Over the limit gets a 429.
   - **Sending:** through Cloudflare Email Routing's `send_email` binding, to the verified destination `neil@njct.io`. Each message is built with `mimetext`: from `contact@njct.io`, `Reply-To` set to the visitor's address, subject `njct.io: {name}`, and the body holding the message, the name and email, and the page it was sent from.
   - Success answers 200 with `{ ok: true }`. A send failure answers 502.
   - **Origin:** only `https://njct.io` and the local dev origin `http://127.0.0.1:8750` are accepted.
   - The binding needs no API key, so nothing goes into SOPS or the vault.
2. **Form** (`editions/contact.js`):
   - Send posts to `/api/contact` with `fetch`. While waiting, the button is disabled and reads "Sending…".
   - On 200, the panel shows a sent message, then closes after 2 s, shrinking back into the pill.
   - On any error, the panel shows an error message with a link that opens the email app (the current mailto compose) as a fallback.
   - Add the hidden `website` field, kept off-screen and out of the tab order.
   - The success, error and "Sending…" strings are copy proposals for Neil before they ship.
3. **Cloudflare setup (Neil, in the dashboard):**
   - Turn on Email Routing for njct.io.
   - Verify `neil@njct.io` as a destination address.
   - `wrangler` is logged out since the November compromise (memory: GitHub compromise). Deploying the Worker needs Neil's login, or a deploy token from the vault.

## Rules
- Deploying the site is a push to `main` (Actions). Ask Neil before pushing.
- Commit as `nj-io <26359601+nj-io@users.noreply.github.com>`.
- Add no test files. Check by sending one real message from the dev origin, then one from production after deploy, and confirm both arrive.

## Done when
- A message sent from njct.io arrives at neil@njct.io with Reply-To set to the visitor's address.
- A filled honeypot sends nothing, a sixth send within the hour is refused, and an invalid payload gets a 400.
- The form shows the sent and error states, and the mailto fallback works when the Worker is down.
