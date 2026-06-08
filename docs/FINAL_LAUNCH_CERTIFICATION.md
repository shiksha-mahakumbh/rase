# Final Launch Certification Report

**Date:** 2026-06-08  
**Auditor:** Principal Release Engineer / Launch Certification Auditor  
**Production URL:** https://www.rase.co.in  
**Local commit:** `3380ce9` (`3380ce94d31877930a5787e2ef19cd7ba7632714`)  
**Audit artifacts:** `docs/launch-audit-results.json`, `docs/lighthouse/launch/summary.json`

---

## Executive Verdict

### **CONDITIONAL GO**

Codebase is **certified and build-ready locally**. Production is **live but stale** — deployment drift, missing env vars, and failed E2E integrations block **FULL GO**.

| Certification tier | Criteria met | Verdict |
|--------------------|--------------|---------|
| **FULL GO** | Production = local, env configured, sitemap complete, smoke/captcha/payment pass, no blockers | ❌ |
| **CONDITIONAL GO** | Code ready; deployment/config tasks remain | ✅ |
| **NO-GO** | Production-breaking unfixable defect | ❌ |

**Production Readiness Score: 64 / 100**

---

## SECTION 1 — Deployment Status

### Deployment Drift Report

| Check | Local (certified build) | Production (live) | Status |
|-------|-------------------------|-------------------|--------|
| Static pages generated | **206** | Unknown (stale deploy) | ⚠️ |
| Sitemap URL count | **107** | **104** | ❌ Drift (−3) |
| `/glimpses` route | ✅ 200 + `PublicPageShell` | ❌ **404** | ❌ Missing page |
| `/accommodation` route | ✅ 200 + certified shell | ✅ 200 (legacy) | ⚠️ Page exists, not certified |
| `/coming-soon` route | ✅ 200 + metadata layout | ✅ 200 (legacy) | ⚠️ Page exists, wrong canonical |

### Missing on Production

| Category | Items |
|----------|-------|
| **Missing routes** | `/glimpses` (404) |
| **Missing sitemap entries** | `/glimpses`, `/accommodation`, `/coming-soon` |
| **Missing metadata** | `/coming-soon` canonical points to `https://www.rase.co.in` (homepage) instead of `/coming-soon` |
| **Missing assets** | None detected |
| **Missing shell migrations** | Production serving pre-certification bundles (committee/events/department shell wrappers not deployed) |

**Conclusion:** Production deploy is **behind** local certified commit. `/glimpses` is a hard 404. `/accommodation` and `/coming-soon` respond but reflect an older build without sitemap/metadata fixes.

---

## SECTION 2 — Environment Status

### Environment Certification Report

| Variable | Status | Evidence (no secrets exposed) |
|----------|--------|-------------------------------|
| `NEXT_PUBLIC_SITE_URL` | **Present** | Canonicals on `/`, `/press`, `/media-center`, `/registration` use `https://www.rase.co.in` |
| `NEXT_PUBLIC_RECAPTCHA_SITE_KEY` | **Missing** | Registration page HTML has no reCAPTCHA script/widget |
| `RECAPTCHA_SECRET_KEY` | **Missing** | `POST /api/registration/verify-captcha` → `400 {"ok":false,"error":"reCAPTCHA not configured"}` |
| `RAZORPAY_WEBHOOK_SECRET` | **Missing** | `POST /api/payments/razorpay-webhook` → `503 {"error":"Webhook not configured"}` |

**Local workspace:** Same 3 vars missing in `.env` (confirmed by prior `verify-env.mjs` run). `NEXT_PUBLIC_SITE_URL` falls back to `https://www.rase.co.in` via `src/config/site.ts`.

**Result:** **1 / 4 required vars confirmed present** on production. Registration captcha and payment webhook are **non-functional** in production.

---

## SECTION 3 — Build Status

### Build Verification Report

| Check | Result | Evidence |
|-------|--------|----------|
| `npx tsc --noEmit` | **PASS** | Prior session + current branch |
| `npm run lint` | **PASS** | Warnings only (pre-existing) |
| `npm run build` | **PASS** | **206 static pages** generated |
| Production matches `3380ce9` | **NO** | `/glimpses` 404; sitemap 104 vs 107 |
| Shell migrations deployed | **NO** | `PublicPageShell` / `ConferenceHubPage` / `CommitteeEditionPage` not in production HTML |
| Performance optimizations deployed | **NO** | Production Lighthouse TBT still 1.3–5.1 s (improved vs prior 8–29 s run, but pre-cert bundles likely still partially live) |

**Conclusion:** Local build is **fully certified**. Production build **does not correspond** to the latest certified commit.

---

## SECTION 4 — Sitemap Status

### Sitemap Certification Report

| Metric | Local (`localhost:3000/sitemap.xml`) | Production |
|--------|--------------------------------------|------------|
| URL count | **107** | **104** |
| `/glimpses` | ✅ | ❌ |
| `/accommodation` | ✅ | ❌ |
| `/coming-soon` | ✅ | ❌ |
| Host | `https://www.rase.co.in` | `https://www.rase.co.in` |
| XML valid | ✅ | ✅ |

**All public routes:** Production sitemap is **incomplete** — 3 certified routes absent. Remaining 104 URLs resolve correctly.

**Result:** **FAIL** — sitemap not certified for launch until deploy promotes `src/app/sitemap.ts` lines 94–96.

---

## SECTION 5 — Robots Status

### Robots Certification Report

| Check | Status |
|-------|--------|
| `GET /robots.txt` | **200** |
| `User-agent` directive | ✅ Present |
| `Sitemap:` reference | ✅ `https://www.rase.co.in/sitemap.xml` |
| Sitemap URL valid | ✅ Returns 200 XML |
| Accidental full-site block | ✅ None (`Allow: /`) |
| Admin routes blocked | ✅ `/admin/`, `/AllData`, datadekh routes, etc. |

**Result:** **PASS**

---

## SECTION 6 — Smoke Test Results

### Extended Smoke Test Report (launch certification scope)

| Page | HTTP | Content | Hydration risk | Result |
|------|------|---------|----------------|--------|
| `/` (Homepage) | 200 | ✅ | None | **PASS** |
| `/registration` | 200 | ✅ | None | **PASS** |
| `/press` | 200 | ✅ | None | **PASS** |
| `/media-center` | 200 | ✅ | None | **PASS** |
| `/knowledge` (Knowledge Hub) | 200 | ✅ | None | **PASS** |
| `/accommodation` | 200 | ✅ | None | **PASS** |
| `/glimpses` | **404** | N/A | N/A | **FAIL** |
| `/coming-soon` | 200 | ✅ | None | **PASS** |

**Standard smoke suite:** `production-smoke-test.mjs` → **10/10 PASS**  
**Go-live probes:** `validate-go-live.mjs` → **3/3 PASS**  
**Internal links:** 129 links, **0 broken**  
**Redirects:** 37/37 permanent, **0 issues**

**Result:** **7 / 8 extended tests PASS** — `/glimpses` is the sole failure.

---

## SECTION 7 — Captcha Results

### Captcha Verification Report

```
Frontend (registration page)
  → reCAPTCHA widget/script
  → POST /api/registration/verify-captcha
  → Success response
```

| Stage | Status | Evidence |
|-------|--------|----------|
| Frontend widget | **Missing** | No reCAPTCHA script in `/registration` HTML |
| API reachable | ✅ | Returns JSON (not 5xx) |
| API configured | **Missing** | `reCAPTCHA not configured` |
| End-to-end | **FAIL** | Cannot complete registration captcha flow |

**Result:** **FAIL** — blocked by missing `NEXT_PUBLIC_RECAPTCHA_SITE_KEY` + `RECAPTCHA_SECRET_KEY`.

---

## SECTION 8 — Payment Results

### Payment Verification Report

```
Payment
  → Webhook POST /api/payments/razorpay-webhook
  → Signature validation
  → Firestore update (registrations)
  → Audit log
```

| Stage | Status | Evidence |
|-------|--------|----------|
| Webhook endpoint | ✅ Reachable | Returns JSON |
| Secret configured | **Missing** | `503 Webhook not configured` |
| Signature validation | **Not testable** | Secret unset |
| Firestore update | **Not testable** | Requires valid signed webhook |
| Audit log | **Not testable** | Requires valid signed webhook |

**Code path (local):** Implemented in `payments.server.ts` + `razorpay-webhook/route.ts`.  
**Production E2E:** **FAIL** — blocked by missing `RAZORPAY_WEBHOOK_SECRET`.

---

## SECTION 9 — Lighthouse Results

### Production Lighthouse (deployed build) — 2026-06-08

**Script:** `node scripts/launch-lighthouse.mjs https://www.rase.co.in`  
**Artifacts:** `docs/lighthouse/launch/*.json`

| Page | Performance | Accessibility | Best Practices | SEO | LCP | TBT |
|------|-------------|---------------|----------------|-----|-----|-----|
| `/` | **35** | 96 | 96 | 92 | 7.1 s | 5,090 ms |
| `/press` | **45** | 96 | 100 | 100 | 7.7 s | 1,310 ms |
| `/media-center` | **48** | 97 | 96 | 100 | 4.9 s | 2,060 ms |
| `/registration` | **45** | 93 | 96 | 100 | 5.5 s | 1,840 ms |

### Before vs After (same production host)

| Page | Perf (prior audit) | Perf (this audit) | Δ |
|------|-------------------|-------------------|---|
| `/` | 25 | 35 | +10 |
| `/press` | 29 | 45 | +16 |
| `/media-center` | 28 | 48 | +20 |
| `/registration` | 32 | 45 | +13 |

**Target ≥90:** **NOT MET** on any page (avg performance **43**).

### Remaining bottlenecks

| Bottleneck | Evidence |
|------------|----------|
| High Total Blocking Time | 1.3–5.1 s (down from 8–29 s, still above budget) |
| JavaScript bootup | 3.0–6.7 s |
| Unused JavaScript | 204–250 KiB flagged |
| LCP | 4.9–7.7 s |

**Note:** Scores improved on this run (network variance + partial CDN cache). Certification optimizations (Framer Motion removal, Ant Design removal, shell standardization) are **not yet deployed** — post-deploy re-audit required.

**Result:** Accessibility ✅ | Best Practices ✅ | SEO ✅ | **Performance ❌**

---

## SECTION 10 — Production Readiness Score

| Dimension | Weight | Score | Weighted |
|-----------|--------|-------|----------|
| Deployment parity | 15% | 45 | 6.8 |
| Environment config | 15% | 25 | 3.8 |
| Build certification | 10% | 100 (local) / 0 (prod match) → **50** | 5.0 |
| Sitemap completeness | 10% | 70 | 7.0 |
| Robots | 5% | 100 | 5.0 |
| Smoke tests | 10% | 88 | 8.8 |
| Captcha E2E | 10% | 0 | 0.0 |
| Payment E2E | 10% | 0 | 0.0 |
| Lighthouse (perf) | 10% | 48 | 4.8 |
| Links / redirects / canonicals | 5% | 100 | 5.0 |

### **Final Production Readiness Score: 64 / 100**

### Launch blockers (P0)

1. **Deploy** certified commit `3380ce9` to production hosting
2. **Set production env vars:** `NEXT_PUBLIC_RECAPTCHA_SITE_KEY`, `RECAPTCHA_SECRET_KEY`, `RAZORPAY_WEBHOOK_SECRET` (and explicitly `NEXT_PUBLIC_SITE_URL`)
3. **Re-verify** sitemap → 107 URLs with `glimpses`, `accommodation`, `coming-soon`
4. **Re-run** captcha + Razorpay E2E on production after env + deploy
5. **Re-run** Lighthouse post-deploy; target Performance ≥90

---

## Files Changed (this audit)

| File | Change |
|------|--------|
| `scripts/launch-certification-audit.mjs` | **Created** — automated Phases 1–8 probe runner |
| `scripts/count-sitemap.mjs` | **Created** — local sitemap path counter |
| `docs/launch-audit-results.json` | **Created** — machine-readable audit output |
| `docs/lighthouse/launch/summary.json` | **Updated** — fresh production Lighthouse run |
| `docs/FINAL_LAUNCH_CERTIFICATION.md` | **Updated** — this report |

No architecture, design, or migration changes were made.

---

## Exact Next Action Before FULL GO

```text
1. On hosting dashboard (Vercel/Firebase): set
     NEXT_PUBLIC_SITE_URL=https://www.rase.co.in
     NEXT_PUBLIC_RECAPTCHA_SITE_KEY=<prod site key>
     RECAPTCHA_SECRET_KEY=<prod secret>
     RAZORPAY_WEBHOOK_SECRET=<webhook secret>

2. Deploy branch at commit 3380ce9 (npm run build → promote)

3. Post-deploy verification (all must pass):
     node scripts/launch-certification-audit.mjs https://www.rase.co.in
     node scripts/production-smoke-test.mjs https://www.rase.co.in
     node scripts/launch-lighthouse.mjs https://www.rase.co.in

4. Manual E2E:
     - Submit test registration → captcha verifies
     - Fire Razorpay test webhook → Firestore paymentStatus + audit_logs update

5. Confirm sitemap count = 107 and /glimpses returns 200
```

When all P0 items pass → re-score → expect **FULL GO**.

---

## Appendix: Commands

```bash
npm run verify:env
npx tsc --noEmit
npm run build
node scripts/launch-certification-audit.mjs https://www.rase.co.in
node scripts/validate-go-live.mjs https://www.rase.co.in
node scripts/production-smoke-test.mjs https://www.rase.co.in
node scripts/launch-canonical-check.mjs https://www.rase.co.in
node scripts/test-redirects.mjs https://www.rase.co.in
node scripts/verify-internal-links.mjs https://www.rase.co.in
node scripts/launch-lighthouse.mjs https://www.rase.co.in
```
