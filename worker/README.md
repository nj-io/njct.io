# njct-contact

The Worker behind the njct.io "Get in touch" form (`editions/contact.js`). Brief:
`docs/plans/contact-worker-brief-2026-11-04.md`.

- Route: `njct.io/api/contact` (the Pages site serves the domain; the route takes this path).
- POST only, JSON `{ name, email, message, website, page? }`. `website` is the honeypot: filled
  means a bot, answered `{ok: true}` with nothing sent.
- Validation: name 1–100, a plausible email ≤ 200, message 1–5000. Anything else: `400 {error:"invalid"}`.
- Rate limit: 5 per IP per hour. The Workers rate-limiting binding's window can only be 10 or 60
  seconds, so the exact 5-a-minute cap rides the `CONTACT_LIMITER` binding and the hourly rule is
  a KV counter (`CONTACT` namespace, key `hour:<ip>`, 1 h TTL from the first send). Over: `429`.
- Sending: the `send_email` binding (`CONTACT_MAIL`) to the verified destination `neil@njct.io`,
  from `contact@njct.io`, `Reply-To` the visitor. Built with `mimetext`. No API key, so there is
  no secret anywhere.
- Origins: `https://njct.io` and the dev origin `http://127.0.0.1:8750` (`ALLOWED_ORIGIN` var).
  OPTIONS answers the preflight the cross-origin dev origin raises.

## One-time setup (Neil, Cloudflare dashboard)

1. **Email Routing** on for `njct.io` (Email → Email Routing). This creates the DNS records.
2. Verify **neil@njct.io** as a destination address (Email Routing → Destination addresses).
   `contact@njct.io` needs no rule or mailbox: it is only the From of the sent mail.
3. Deploy: `cd worker && npm install && npx wrangler deploy` (wrangler is logged out since the
   November compromise — `npx wrangler login`, or a deploy token from the vault as
   `CLOUDFLARE_API_TOKEN`). The route and both bindings are created by the deploy.

## Check (brief: no test files)

1. From the dev origin (allowed by `ALLOWED_ORIGIN`):
   `curl -i -X POST https://njct.io/api/contact -H 'origin: http://127.0.0.1:8750' -H 'content-type: application/json' -d '{"name":"Check","email":"you@example.com","message":"Worker check from the dev origin.","website":""}'`
   → `200 {ok:true}`, and the mail arrives at neil@njct.io with Reply-To set.
2. After deploy, send once from the page on njct.io and confirm it arrives.
3. A filled `website` sends nothing (still `200`); a sixth send within the hour gets `429`;
   an invalid payload gets `400`; a wrong origin gets `403`.
