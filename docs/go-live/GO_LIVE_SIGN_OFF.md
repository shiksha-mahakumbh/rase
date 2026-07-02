# Go-live sign-off checklist

Final enterprise audit items **139–150**. Complete before declaring production ready.

## Infrastructure (139–142)

| # | Item | Verification | Owner sign-off |
|---|------|--------------|----------------|
| 139 | Domain | `NEXT_PUBLIC_SITE_URL` = `https://www.rase.co.in`; Vercel domains assigned | ☐ |
| 140 | SSL | HTTPS enforced; HSTS + `upgrade-insecure-requests` in CSP | ☐ |
| 141 | DNS | [`DNS_AND_DOMAIN.md`](./DNS_AND_DOMAIN.md) records live; apex → www | ☐ |
| 142 | CDN | Vercel edge + `next/image` AVIF/WebP; Supabase storage CDN patterns | ☐ |

## Quality gates (143–146)

| # | Item | Command | Pass criteria |
|---|------|---------|---------------|
| 143 | Final security | `npm run test:security` | All phases 1–14 green |
| 144 | Final SEO | Included in `test:security` phase 5 + `npm run audit:public` | Sitemap, robots, metadata |
| 145 | Lighthouse | `npm run audit:site-performance` | CI guardrails pass |
| 146 | Accessibility | `npm run test:e2e` (a11y specs) + phase 7 | Skip link, landmarks |

## Launch verification (147–149)

| # | Item | Command | Pass criteria |
|---|------|---------|---------------|
| 147 | Production smoke | `npm run test:smoke` | All HTTP probes pass |
| 148 | Rollback | `npm run verify:rollback` | Playbook + Vercel promote path documented |
| 149 | Monitoring | `npm run verify:monitoring` | `/status` + `/api/v2/status` healthy |

## Final sign-off (150)

| Role | Name | Date | Signature |
|------|------|------|-----------|
| Engineering lead | | | |
| DevOps / SRE | | | |
| Product / DHE coordinator | | | |

### One-command certification (local)

```bash
npm run certify:go-live
```

With live probes against production:

```bash
RUN_LIVE_GO_LIVE=1 npm run certify:go-live
```

### Post sign-off

1. Monitor Sentry and `/status` for 24 hours.
2. Run one real registration + payment test in production.
3. Archive this checklist with deployment SHA in internal records.
