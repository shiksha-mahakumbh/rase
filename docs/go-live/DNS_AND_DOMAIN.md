# DNS and domain configuration

Canonical production hosts for **rase.co.in** / Shiksha Mahakumbh.

## Required DNS records (Vercel)

| Host | Type | Target | Purpose |
|------|------|--------|---------|
| `www.rase.co.in` | CNAME | `cname.vercel-dns.com` | Primary production site |
| `rase.co.in` (apex) | A / ALIAS | Vercel apex IPs or Vercel DNS | Redirect apex → `www` |
| `www.shikshamahakumbh.com` | CNAME | Vercel project | Legacy / marketing alias (if assigned) |

Configure in [Vercel → rase-co-in → Settings → Domains](https://vercel.com/dhe-projects/rase-co-in/settings/domains).

## Environment alignment

Set on **Production** in Vercel:

```
NEXT_PUBLIC_SITE_URL=https://www.rase.co.in
```

Verify:

```bash
npm run verify:env
```

Code default: `src/config/site.ts` → `https://www.rase.co.in`.

## Post-DNS verification

```bash
npm run validate:go-live https://www.rase.co.in
npm run verify:monitoring https://www.rase.co.in
npm run test:smoke https://www.rase.co.in
```

Expect:

- HTTPS only (HTTP redirects to HTTPS)
- `Strict-Transport-Security` response header
- `/sitemap.xml` and `/robots.txt` served on canonical host
- `/api/v2/health` returns `{ "status": "ok" }`

## Razorpay / webhooks

Webhook URL must match the live host:

`https://www.rase.co.in/api/payments/razorpay-webhook`

Whitelist checkout domains in Razorpay Dashboard for every production hostname users may visit.

## Related

- [`docs/deployment/DOMAIN_REFERENCE_MATRIX.md`](../deployment/DOMAIN_REFERENCE_MATRIX.md)
- [`docs/go-live/GO_LIVE_SIGN_OFF.md`](./GO_LIVE_SIGN_OFF.md)
