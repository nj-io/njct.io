<!-- analytics:state:begin -->
```json
{
  "tool": "new-site-analytics",
  "version": 1,
  "product": "njct",
  "product_name": "njct.io",
  "project_id": 742847,
  "host": "cloudflare",
  "domain": "njct.io",
  "proxy_path": "/s7",
  "sells": false,
  "google_conversions": "browser",
  "site_dir": ".",
  "snippet_path": "vendor/analytics/analytics.js",
  "functions_dir": "functions",
  "prod_hosts": [
    "njct.io"
  ],
  "hosts": [
    "njct.io",
    ".njct-io.pages.dev"
  ],
  "privacy_url": "/privacy"
}
```
<!-- analytics:state:end -->

# Analytics: njct

<!-- analytics:generated:begin -->
## Project

- Product: njct
- PostHog project: njct (#742847), https://us.posthog.com/project/742847
- Project key: `phc_m94SGTM2YZg8oLEB8XixuAA6XKDcjUHVv3VCk4vPKseU`
- Key configured: the `data-key` attribute of the script tag below
- Tracking-stopped alert: not created
- Sells: no
- Google conversions: `browser` (the Google tag sends the conversion from the browser)

## Host and proxy

- Host type: cloudflare
- Domain: njct.io
- Proxy path: `/s7`, served at `https://njct.io/s7/`
- Proxy: Pages Function `functions/s7/[[rest]].js`

## Script tag

The snippet is vendored at `vendor/analytics/analytics.js`. The tag goes before `</body>` on every page; `--inject` keeps it between the `analytics:tag` markers in `*.html` at the top of the site directory.

```html
<script src="/vendor/analytics/analytics.js" data-key="phc_m94SGTM2YZg8oLEB8XixuAA6XKDcjUHVv3VCk4vPKseU" data-path="/s7" data-hosts="njct.io,.njct-io.pages.dev" data-prod-hosts="njct.io" data-product="njct" data-product-name="njct.io" data-privacy-url="/privacy"></script>
```

## Checkout data

`siteAnalytics.checkoutData()` returns the object a checkout or a form passes to the server as custom data:
- after consent or outside the consent regions: `consent: "y"`, `ph_distinct_id`, the `first_*` and `last_*` campaign values, `fbp`, `fbc`, `ua`, `url`, `ip`, `env`;
- before consent: `consent: "n"`, the current page's campaign tags under `first_*`, `url` and `env`.

## Tagged example links

Campaigns are named `<push>-<yymm>` in 30 characters or fewer; content is the variant or the post.

`new-site-analytics link` checks a link against the scheme, prints the ad platform's parameters and records it in the Links table.

| Source | Link |
| --- | --- |
| meta | `https://njct.io/?utm_source=meta&utm_medium=paid&utm_campaign=launch-2610&utm_content=variant-a` |
| google | `https://njct.io/?utm_source=google&utm_medium=paid&utm_campaign=launch-2610&utm_content=variant-a` |
| instagram | `https://njct.io/?utm_source=instagram&utm_medium=bio&utm_campaign=launch-2610&utm_content=variant-a` |
| tiktok | `https://njct.io/?utm_source=tiktok&utm_medium=organic&utm_campaign=launch-2610&utm_content=variant-a` |
| reddit | `https://njct.io/?utm_source=reddit&utm_medium=community&utm_campaign=launch-2610&utm_content=variant-a` |
| x | `https://njct.io/?utm_source=x&utm_medium=organic&utm_campaign=launch-2610&utm_content=variant-a` |
| linkedin | `https://njct.io/?utm_source=linkedin&utm_medium=organic&utm_campaign=launch-2610&utm_content=variant-a` |
| bluesky | `https://njct.io/?utm_source=bluesky&utm_medium=organic&utm_campaign=launch-2610&utm_content=variant-a` |
| threads | `https://njct.io/?utm_source=threads&utm_medium=organic&utm_campaign=launch-2610&utm_content=variant-a` |
| facebook | `https://njct.io/?utm_source=facebook&utm_medium=organic&utm_campaign=launch-2610&utm_content=variant-a` |
| youtube | `https://njct.io/?utm_source=youtube&utm_medium=organic&utm_campaign=launch-2610&utm_content=variant-a` |
| mastodon | `https://njct.io/?utm_source=mastodon&utm_medium=organic&utm_campaign=launch-2610&utm_content=variant-a` |
| whatsapp | `https://njct.io/?utm_source=whatsapp&utm_medium=organic&utm_campaign=launch-2610&utm_content=variant-a` |
| producthunt | `https://njct.io/?utm_source=producthunt&utm_medium=organic&utm_campaign=launch-2610&utm_content=variant-a` |
| github | `https://njct.io/?utm_source=github&utm_medium=organic&utm_campaign=launch-2610&utm_content=variant-a` |
| newsletter | `https://njct.io/?utm_source=newsletter&utm_medium=email&utm_campaign=launch-2610&utm_content=variant-a` |

## Browser steps

The API does not cover these:
- the Meta Ads destination's connection screen, after `enable meta`;
- optional, for a product that sells: PostHog's own spend view in the marketing-analytics sources (Meta, Google), since `report` reads spend from the ad accounts;
- one visit per browser with `?internal=1`, so the operator's own traffic is excluded.

## Deletion requests

A request to delete a person's data is answered within 30 days.

1. Find the visitor's `ph_distinct_id`: sign-ups store the id the form sent, when it sent one.
2. Run `new-site-analytics forget --distinct-id <id>` for each id, then again with `--yes` to delete the person and queue their events for deletion.
3. Ids that start with `paddle:` or `waitlist:` belong to personless events: they carry no email, name or buyer IP, so there is no person to find; report that in the reply.
4. Reply to the requester when PostHog has accepted the deletion.
<!-- analytics:generated:end -->

## Checkout and stores

Not recorded yet.

## How checkout passes custom data

Not recorded yet.

## Product events

Events beyond the core set, with their properties.

| Event | Sent | Properties |
| --- | --- | --- |
| `hi_viewed` | /hi, once per load on DOMContentLoaded | `lang`, `lang_source` (`query`, `stored`, `device`, `default`), `cc`, `lead` (the first pill), `langs` (first three of `navigator.languages`) |
| `hi_lang_changed` | /hi, a language picker choice | `from`, `to` (locale codes) |

## Spend log

One row per day of spend on a channel with no connector, added with `new-site-analytics spend add`.

| date | utm_campaign | platform | usd |
| --- | --- | --- | ---: |

## Links

Every link printed by `new-site-analytics link`, one row each.

| date | source | medium | campaign | content | url |
| --- | --- | --- | --- | --- | --- |
