# Production Readiness Checklist

**Date:** 29 May 2026  
**Branch:** Local P0 remediation (uncommitted)  
**Production baseline:** https://www.rase.co.in — 14/14 smoke tests (pre-P0 deploy)

---

## 1. Build Status

| Check | Status | Notes |
|-------|--------|-------|
| `npm run lint` | ✅ PASS | 1 warning (HeroLcpImage `<img>`) |
| `npm run typecheck` | ✅ PASS | |
| `npm run test:security` | ✅ PASS | 35/35 security assertions |
| `npm run test:visitor-analytics` | ⚠️ 9/10 | DB pooler unreachable locally (env) |
| `npm run build` | ⚠️ INCONCLUSIVE | Local build exceeded 30min on ~6GB RAM; typecheck passed separately; Vercel CI builds on deploy |

---

## 2. Type Safety

| Check | Status |
|-------|--------|
| TypeScript strict compile | ✅ PASS |
| New modules typed | ✅ `registration-submit-guard.ts`, `sanitize-html.ts` |
| Build skips TS in OOM mode | ⚠️ `SKIP_NEXT_STATIC_CHECKS=1` on low RAM — CI should enforce typecheck |

---

## 3. Test Coverage

| Suite | Result |
|-------|--------|
| Security (staging) | 13/13 |
| Firebase removal | PASS |
| Registration lookup | 6/6 |
| Registration types | 7/7 |
| v2 registration security | 9/9 |
| Visitor analytics (unit) | 9/9 source checks |
| Visitor analytics (DB) | FAIL — network to Supabase pooler |
| E2E registration | Not run this session |
| Production smoke | 14/14 (last run on deployed main) |

---

## 4. Accessibility

| Metric | Target | Actual | Status |
|--------|--------|--------|--------|
| Lighthouse Accessibility | 100 | 92–95 (prod lab, May 2026) | ❌ |
| Skip link | All routes | ~7 routes only | ❌ P1 |
| `html lang` per locale | Yes | Fixed `en-IN` | ❌ P1 |
| WCAG 2.2 marquee pause | Yes | No pause control | ❌ P2 |

---

## 5. SEO

| Metric | Target | Actual | Status |
|--------|--------|--------|--------|
| Lighthouse SEO | 100 | 83 (home), 92 (inner) | ❌ |
| Sitemap | 200 | ✅ | |
| Robots.txt | 200 | ✅ | |
| Hreflang (4 routes) | Complete | Partial | ❌ P1 |
| JSON-LD | Rich | ✅ | |

---

## 6. Core Web Vitals

| Metric | Target | Production (May 2026) | Post-P0 Local | Status |
|--------|--------|----------------------|---------------|--------|
| LCP | < 2.5s | 9.2–11.9s | Not re-measured (P0 perf deferred) | ❌ |
| CLS | < 0.1 | 0.023 (May mobile lab) / **0.374** (Jun desktop lab) | ❌ |
| INP | < 200ms | **~980ms** max-potential FID (Jun 2026 prod) | ❌ |
| Performance score | ≥ 95 | **43** (Jun 2026 prod) / 32–38 (May mobile) | ❌ |

*Latest artifact: `docs/audit/lighthouse-prod-home.json` (26 Jun 2026, production URL)*

---

## 7. Mobile Responsiveness

| Check | Status |
|-------|--------|
| Mobile nav drawer | ✅ |
| 44px touch targets (public) | ✅ |
| Responsive breakpoints | ✅ |
| `overflow-x-hidden` reflow risk | ⚠️ P2 |

---

## 8. Cross-Browser Compatibility

| Check | Status |
|-------|--------|
| Browserslist (Chrome 92+, Safari 15.4+) | ✅ Configured |
| Automated cross-browser tests | ❌ Not in CI |

---

## 9. Infrastructure Readiness

| Check | Status |
|-------|--------|
| Vercel deploy workflow | ✅ |
| Prisma migrate on main | ✅ |
| CI quality gates (lint/test/build) | ❌ P1 |
| Upstash rate limits | ⚠️ Optional |
| Sentry | ❌ P1 |
| Node.js version | ⚠️ 20.x — upgrade before Oct 2026 |

---

## 10. Error Handling

| Check | Status |
|-------|--------|
| `error.tsx` / `global-error.tsx` | ✅ |
| API `{ error, code }` standard (v2) | ✅ |
| Client ErrorBoundary | ✅ |
| Sentry/monitoring | ❌ |

---

## 11. Monitoring & Logging

| Check | Status |
|-------|--------|
| Structured console logs (registration, payment) | ✅ |
| Audit log writes | ✅ |
| Production smoke script | ✅ 14 probes |
| Alerting | ❌ Manual |

---

## 12. Backup Strategy

| Check | Status |
|-------|--------|
| Supabase automated backups | ✅ Documented |
| Manual `pg_dump` guide | ✅ |
| Restore drill automated | ❌ P2 |
| Visitor data retention job | ❌ P2 |

---

## 13. P0 Remediation Completed

- [x] v2 registration submit payment guard
- [x] v2 upload server-side bucket
- [x] DOMPurify + SafeHtml on CMS
- [x] CSP header
- [x] Legacy admin cookie rejection
- [x] Security test suite extended

---

## 14. Blocking Issues for Production Certification

| # | Issue | Severity | Fix |
|---|-------|----------|-----|
| 1 | Lighthouse Performance 32–38 (LCP 9–12s) | Critical | P1 performance sprint |
| 2 | 42 npm audit vulnerabilities (3 critical) | High | P1 `npm audit fix` |
| 3 | Lighthouse Accessibility 92–95 (target 100) | High | P1–P2 a11y fixes |
| 4 | Lighthouse SEO 83 on homepage | High | P1 metadata/hreflang |
| 5 | First-party analytics without consent | High | P1 legal + consent gate |
| 6 | No CI pipeline (lint/test/build on PR) | Medium | P1 GitHub Actions |
| 7 | Sentry not wired | Medium | P1 |
| 8 | P0 changes not yet deployed to production | Medium | Deploy + smoke |

---

## Deployment Recommendations (When Unblocked)

1. Deploy P0 branch to Vercel preview; run `npm run smoke:prod` against preview URL
2. Verify Razorpay checkout + registration E2E on preview
3. Confirm CSP does not block GTM/Razorpay in browser console
4. Promote to production; re-run 14-point smoke test
5. Re-run Lighthouse on 5 canonical URLs; update `docs/FINAL_LIGHTHOUSE_REPORT.md`

## Post-Deployment Monitoring

1. Watch Vercel function errors for 24h
2. Monitor Razorpay webhook success rate in admin
3. Search Console → Core Web Vitals (field INP/LCP)
4. Check `/api/v2/health` every 5 min (existing smoke cadence)
5. Review audit logs for `registration_saved` with `source: v2`

---

*Generated as part of enterprise audit remediation workflow.*
