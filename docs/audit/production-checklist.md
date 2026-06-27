# Production Readiness Checklist

**Date:** 27 June 2026  
**Branch:** `main` (`11ed3eb` + audit env setup)  
**Production:** https://www.rase.co.in — **16/16** smoke tests

---

## Engineering status

| Area | Status |
|------|--------|
| P0 security remediation | ✅ Complete |
| P1–P3 code remediation | ✅ Complete |
| CI (lint, typecheck, security, build) | ✅ Green |
| Production smoke | ✅ 16/16 |
| Vercel Git deploy | ✅ Auto on `main` |

---

## Ops env (Vercel → rase-co-in)

Run once (local CLI or GitHub Action **Setup Audit Production Env**):

```bash
node scripts/setup-audit-vercel-env.mjs
# or: gh workflow run setup-audit-env.yml --repo shiksha-mahakumbh/rase
```

| Variable | Auto-set by script | Manual / integration |
|----------|-------------------|----------------------|
| `CRON_SECRET` | ✅ Generated | — |
| `REGISTRATION_EMAIL_SECRET` | ✅ Generated | — |
| `REGISTRATION_EMAIL_REQUIRE_SECRET` | ✅ `true` | — |
| `DIRECT_URL` | ✅ From `POSTGRES_URL_NON_POOLING` if missing | — |
| `UPSTASH_REDIS_REST_URL` + `TOKEN` | — | [Vercel Upstash integration](https://vercel.com/integrations/upstash) |
| `NEXT_PUBLIC_SENTRY_DSN` | — | [Vercel Sentry integration](https://vercel.com/integrations/sentry) |

Verify after deploy:

```bash
curl -s https://www.rase.co.in/api/v2/health | jq .ops
```

Target: `cronConfigured`, `emailSecretConfigured`, `upstashConfigured`, `sentryConfigured` all `true`.

---

## Remaining non-code items

| Item | Owner |
|------|-------|
| Privacy policy legal sign-off | Legal / DHE |
| Full Hindi body translations | Content team |
| Lighthouse performance ≥ 95 | Perf sprint (LCP still high on last measure) |
| npm audit residual (~47) | `pdfjs` / `xlsx` — replace libs to clear |
| Hindi `[locale]` routing consolidation | Deferred (P2-15) |

---

## Quick validation

```bash
npm run typecheck
npm run lint
npm run test:security
npm run smoke:prod
```

---

*Updated after audit remediation completion — June 2026.*
