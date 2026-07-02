# Production Readiness Checklist

**Date:** July 2026  
**Branch:** `main`  
**Production:** https://www.rase.co.in

---

## 1. Build & CI

| Check | Status | Notes |
|-------|--------|-------|
| `npm run lint` | ✅ PASS | |
| `npm run typecheck` | ✅ PASS | |
| `npm run test:unit` | ✅ PASS | Wired in CI |
| `npm run test:integration` | ✅ PASS | Contract checks in CI |
| `npm run test:e2e` | ✅ PASS | Playwright smoke + a11y in CI |
| `npm run test:security` | ✅ PASS | Phases 1–14 |
| Docker build | ✅ PASS | `docker` job in CI |
| GitHub Actions CI | ✅ PASS | lint, typecheck, security, build, e2e, docker |
| Vercel deploy | ✅ PASS | Auto on `main` push + post-deploy ops verify |

---

## 2. P0–P3 Remediation

| Priority | Status |
|----------|--------|
| P0 Security (submit guard, upload, DOMPurify, CSP, admin cookies) | ✅ Complete |
| P1 SEO/a11y (hreflang, lang, consent, newsletter, Sentry, CI) | ✅ Complete |
| P2 UX/content (FAQ, loading/error, footer, backup drill) | ✅ Complete |
| P3 (funnel sync, SEO API, upload magic bytes) | ✅ Complete |

**Deferred (low ROI):** P2-15 Hindi `[locale]` consolidation; P3-15 entity directory export; full `npm audit` in `pdfjs`/`xlsx`.

---

## 3. Production Smoke & Ops

| Probe | Status |
|-------|--------|
| `npm run smoke:prod` | ✅ 24/24 PASS |
| `npm run verify:production-ops` | ✅ RLS + Upstash + Sentry + Cron |
| `npm run certify:go-live:live` | ✅ Full bundle |

---

## 4. Vercel Environment (ops)

```bash
npm run verify:env
npm run setup:vercel:audit
```

| Variable | Purpose | Production |
|----------|---------|------------|
| `NEXT_PUBLIC_SITE_URL` | Canonical domain | `https://www.rase.co.in` |
| `UPSTASH_REDIS_REST_URL` + token | Distributed rate limits | ✅ |
| `NEXT_PUBLIC_SENTRY_DSN` | Error monitoring | ✅ |
| `CRON_SECRET` | `/api/cron/analytics-retention` | ✅ |
| `DIRECT_URL` | Prisma migrations / RLS deploy | Required for `db:deploy-supabase` |

Verify: `curl https://www.rase.co.in/api/v2/status` — see `checks.rlsPolicyCount`, `anonRolesBlocked`, `rateLimitMode`.

---

## 5. External / content items

| Blocker | Owner | Status |
|---------|-------|--------|
| Privacy policy legal sign-off | DHE legal | ⚠️ Code fallback complete |
| Lighthouse Performance ≥ 95 | Engineering | PSI verify ≥85 in CI; tune with `MIN_LIGHTHOUSE_PERF` |
| Full Hindi body translation | Content team | ⚠️ Metadata + hero localized |

---

## 6. Post-Deploy Monitoring

1. `/api/v2/status` — database, RLS, Sentry, Upstash, cron
2. Vercel function errors (Sentry)
3. Razorpay webhook success in admin
4. Search Console Core Web Vitals
5. `npm run smoke:prod` after each production promote

---

*Updated July 2026 — gap audit remediation.*
