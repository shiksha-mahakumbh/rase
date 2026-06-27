# Production Readiness Checklist

**Date:** 27 June 2026  
**Branch:** `main` (`11ed3eb` + follow-up)  
**Production:** https://www.rase.co.in

---

## 1. Build & CI

| Check | Status | Notes |
|-------|--------|-------|
| `npm run lint` | ✅ PASS | HeroLcpImage `<img>` warning only |
| `npm run typecheck` | ✅ PASS | |
| `npm run test:security` | ✅ PASS | 35+ assertions |
| GitHub Actions CI | ✅ PASS | lint, typecheck, security, build |
| Vercel deploy | ✅ PASS | Auto on `main` push |

---

## 2. P0–P3 Remediation

| Priority | Status |
|----------|--------|
| P0 Security (submit guard, upload, DOMPurify, CSP, admin cookies) | ✅ Complete |
| P1 SEO/a11y (hreflang, lang, consent, newsletter, Sentry wired, CI) | ✅ Code complete |
| P2 UX/content (FAQ, loading/error, footer, Hindi intro, backup drill) | ✅ Complete |
| P3 (funnel sync, SEO API, upload magic bytes, nav/cookie/JSON-LD) | ✅ Complete |

**Deferred (low ROI / high risk):** P2-15 Hindi `[locale]` consolidation; P3-15 entity directory export; full npm audit in `pdfjs`/`xlsx`.

---

## 3. Production Smoke

| Probe | Status |
|-------|--------|
| `npm run smoke:prod` | ✅ **16/16 PASS** |

Includes `/faq`, `/hi/introduction`, health, sitemap, registration, admin entry.

---

## 4. Vercel Environment (ops)

Run after integrations or when adding secrets:

```bash
npm run setup:vercel:audit
```

Or install marketplace integrations:

```bash
npx vercel integration add upstash/upstash-kv -e production -e preview -n rase-rate-limit
npx vercel integration add sentry -e production -e preview -n rase-monitoring
npm run setup:vercel:audit
```

| Variable | Purpose | Required |
|----------|---------|----------|
| `UPSTASH_REDIS_REST_URL` + `UPSTASH_REDIS_REST_TOKEN` | Distributed rate limits | Recommended |
| `NEXT_PUBLIC_SENTRY_DSN` | Error monitoring | Recommended |
| `CRON_SECRET` | `/api/cron/analytics-retention` | Required for cron |
| `REGISTRATION_EMAIL_SECRET` | Email resend API | Required in prod |
| `DIRECT_URL` | Prisma migrations / build | Recommended |

Verify: `curl -s https://www.rase.co.in/api/v2/health` → all `ops.*Configured` should be `true`.

**Cron:** `vercel.json` runs analytics retention monthly (`0 3 1 * *`).

---

## 5. External Blockers

| Blocker | Owner | Status |
|---------|-------|--------|
| Privacy policy legal sign-off | DHE legal | ⚠️ Code fallback complete; CMS review pending |
| Lighthouse Performance ≥ 95 | Engineering | ⚠️ Re-measure after deploy; LCP sprint if needed |
| Full Hindi body translation | Content team | ⚠️ Metadata + hero localized; body English |

---

## 6. Post-Deploy Monitoring

1. `/api/v2/health` — database + ops flags
2. Vercel function errors (Sentry when DSN set)
3. Razorpay webhook success in admin
4. Search Console Core Web Vitals (field data)
5. `npm run smoke:prod` after each production promote

---

*Updated as part of audit remediation close-out — June 2026.*
