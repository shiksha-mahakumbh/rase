# FULL GO Launch Certification

**Date:** 2026-06-08  
**Production:** https://www.rase.co.in  
**Certified local commit:** `3380ce9` (`3380ce94d31877930a5787e2ef19cd7ba7632714`)  
**Artifacts:** `docs/production-go-live-results.json`, `docs/lighthouse/launch/summary.json`

---

## Executive Verdict

### **CONDITIONAL GO** (not FULL GO)

Production **cannot** be certified FULL GO. **2/9** automated go-live checks pass. Deployment, environment, captcha, webhook, sitemap, and Lighthouse performance blockers remain on the **live** host.

| Criterion | Required | Production now |
|-----------|----------|----------------|
| Commit `3380ce9` deployed | Yes | **Unknown / stale** |
| `/glimpses` → 200 | Yes | **404** |
| Sitemap ≥ 107 URLs | Yes | **104** |
| reCAPTCHA configured | Yes | **Missing** |
| Razorpay webhook configured | Yes | **503** |
| Lighthouse Performance ≥ 90 | Yes | **35–48** |

**Production Readiness Score: 38 / 100**

---

## PHASE 1 — Deployment Verification Report

### Production vs certified build

| Signal | Production (live) | Certified local (`3380ce9`) |
|--------|-------------------|-----------------------------|
| `/glimpses` | **404** | 200 + `PublicPageShell` |
| `/accommodation` | 200 (legacy page) | 200 + certified shell |
| `/coming-soon` | 200 (wrong canonical) | 200 + metadata layout |
| Sitemap URLs | **104** | **107** |
| Shell migrations | Not deployed | Complete |
| Perf optimizations (Framer removal, etc.) | Partially stale | Complete in repo |

**Conclusion:** Production deploy **does not match** `3380ce9`. Drift confirmed.

### Exact deployment steps (Vercel)

```bash
# 1. From repo root (rase/)
git fetch origin
git checkout 3380ce9   # or merge certified branch to main first
git log -1 --oneline     # must show 3380ce9

# 2. Install & build locally (verify before promote)
npm ci
npm run build            # expect 206 static pages

# 3. Vercel Dashboard → Project → Deployments
#    - Connect repo OR upload build
#    - Production branch: main (or certified branch)
#    - Trigger "Redeploy" with "Use existing Build Cache" OFF

# 4. CLI (if installed):
#    npm i -g vercel
#    vercel login
#    vercel --prod

# 5. Post-deploy verification:
node scripts/production-go-live.mjs https://www.rase.co.in
```

### Post-deploy route checks

| Route | Current | Required after deploy |
|-------|---------|---------------------|
| `/glimpses` | 404 | **200** |
| `/accommodation` | 200 | **200** |
| `/coming-soon` | 200 | **200** |

---

## PHASE 2 — Environment Readiness Report

### Hosting-provider checklist (Vercel → Settings → Environment Variables → **Production**)

| Variable | Status on prod | Action |
|----------|----------------|--------|
| `NEXT_PUBLIC_SITE_URL` | **Present** (canonicals OK) | Set explicitly: `https://www.rase.co.in` |
| `NEXT_PUBLIC_RECAPTCHA_SITE_KEY` | **Missing** | Add from Google reCAPTCHA admin (domain: `rase.co.in`) |
| `RECAPTCHA_SECRET_KEY` | **Missing** | Add matching secret |
| `RAZORPAY_WEBHOOK_SECRET` | **Missing** | Add from Razorpay Dashboard → Webhooks |
| `NEXT_PUBLIC_RAZORPAY_KEY_ID` | Not probed | Add if using Standard Checkout |
| `RAZORPAY_KEY_ID` / `RAZORPAY_KEY_SECRET` | Not probed | Add for order creation |

**After adding vars:** Redeploy (env changes require new deployment on Vercel).

### Verification commands (no secrets printed)

```bash
# Captcha — must NOT return "reCAPTCHA not configured"
curl -s -X POST https://www.rase.co.in/api/registration/verify-captcha \
  -H "Content-Type: application/json" \
  -d '{"token":"test"}'

# Webhook — must NOT return "Webhook not configured" (expect 401 invalid sig)
curl -s -X POST https://www.rase.co.in/api/payments/razorpay-webhook \
  -H "Content-Type: application/json" \
  -H "x-razorpay-signature: test" \
  -d '{}'
```

---

## PHASE 3 — Captcha Certification Report

| Stage | Status | Evidence |
|-------|--------|----------|
| Frontend widget on `/registration` | **FAIL** | No reCAPTCHA script in HTML |
| `POST /api/registration/verify-captcha` | **FAIL** | `{"ok":false,"error":"reCAPTCHA not configured"}` |
| End-to-end | **FAIL** | Blocked until env + redeploy |

**Remediation:** Set `NEXT_PUBLIC_RECAPTCHA_SITE_KEY` + `RECAPTCHA_SECRET_KEY` → redeploy → submit test registration.

---

## PHASE 4 — Payment Certification Report

| Stage | Status | Evidence |
|-------|--------|----------|
| Webhook endpoint reachable | PASS | Returns JSON |
| `RAZORPAY_WEBHOOK_SECRET` | **FAIL** | `503 {"error":"Webhook not configured"}` |
| Signature validation | **Not testable** | Secret unset |
| Firestore update / audit log | **Not testable** | Requires valid signed webhook |

**Remediation:** Set `RAZORPAY_WEBHOOK_SECRET` in Vercel → configure Razorpay webhook URL `https://www.rase.co.in/api/payments/razorpay-webhook` → fire test event.

---

## PHASE 5 — Top 10 Performance Offenders (production `/`)

From `docs/lighthouse/launch/home.json` (live deploy):

| # | Offender | Impact | Evidence |
|---|----------|--------|----------|
| 1 | Main chunk `1517-*.js` | **2.6 s** bootup | Script eval 2.2 s |
| 2 | React chunk `4bd1b696-*.js` | **1.9 s** bootup | Framework bundle |
| 3 | Chunk `d441faa4-*.js` | **0.9 s** bootup | 95% scripting |
| 4 | Chunk `2170a4aa-*.js` | **204 KiB** unused JS | 84% wasted |
| 5 | Chunk `bc9e92e6-*.js` | **72 KiB** unused JS | 95% wasted |
| 6 | Chunk `4778-*.js` | **27 KiB** unused JS | 74% wasted |
| 7 | Sync **NavBar** client bundle | High TBT on all pages | 445-line client mega-menu |
| 8 | **ClientChrome** Modal + Toaster | Main-thread on every route | Global client wrapper |
| 9 | Homepage **above-fold** client sections | LCP **7.1 s** | Hero + notices hydrate early |
| 10 | **Stale production bundle** | Pre-certification JS | Deploy not promoted |

**Measured:** TBT **5,090 ms** · Bootup **6.7 s** · LCP **7.1 s** · Main-thread **14.2 s**

---

## PHASE 6 — Performance Optimization Report (code changes this session)

Allowed targeted fixes applied (no redesign):

| Change | File | Expected benefit |
|--------|------|------------------|
| Removed Framer Motion from registration shell | `RegistrationShell.tsx` | −framer-motion on `/registration` |
| Dynamic import NavBar | `HomePage.tsx` | Defer mega-menu JS on homepage |
| Dynamic import Modal | `ClientChrome.tsx` | Defer modal JS until client |

**Honest assessment:** These changes alone **will not** reach Performance **90+** on production without:

1. **Deploying** certified build (eliminates stale heavy bundles)
2. Further splitting NavBar / noticeboard / announcement client islands
3. Re-auditing with post-deploy Lighthouse

**After deploy**, run:

```bash
node scripts/launch-lighthouse.mjs https://www.rase.co.in
```

---

## PHASE 7 — Lighthouse Before / After

### Before (production — current live deploy)

| Page | Perf | A11y | BP | SEO | TBT | LCP |
|------|------|------|-----|-----|-----|-----|
| `/` | **35** | 96 | 96 | 92 | 5,090 ms | 7.1 s |
| `/press` | **45** | 96 | 100 | 100 | 1,310 ms | 7.7 s |
| `/media-center` | **48** | 97 | 96 | 100 | 2,060 ms | 4.9 s |
| `/registration` | **45** | 93 | 96 | 100 | 1,840 ms | 5.5 s |

### After (post-deploy + env + perf fixes)

**NOT YET MEASURED** — requires production promotion of latest certified build and env configuration.

Target: Performance **≥ 90** on all four URLs.

---

## PHASE 8 — Final Launch Checklist

| Item | Status |
|------|--------|
| Production matches certified build | ❌ |
| Sitemap = 107 URLs | ❌ (104) |
| `/glimpses` = 200 | ❌ (404) |
| Env vars configured | ❌ (3 missing) |
| Captcha works | ❌ |
| Razorpay webhook works | ❌ |
| No deployment drift | ❌ |
| Lighthouse ≥ 90 | ❌ |

---

## Go / No-Go Matrix

| Verdict | Result | Reason |
|---------|--------|--------|
| **FULL GO** | ❌ | 7/8 blockers active on production |
| **CONDITIONAL GO** | ✅ | Code certified locally; production ops pending |
| **NO-GO** | ❌ | No unfixable defects — ops/config fixable |

---

## Exact Next Actions (ordered)

1. **Deploy** commit `3380ce9` (or current certified `main`) to Vercel production — clear build cache.
2. **Set** `NEXT_PUBLIC_RECAPTCHA_SITE_KEY`, `RECAPTCHA_SECRET_KEY`, `RAZORPAY_WEBHOOK_SECRET` in Vercel Production env.
3. **Redeploy** after env changes.
4. **Run** `node scripts/production-go-live.mjs https://www.rase.co.in` → must be **9/9 PASS**.
5. **Run** `node scripts/launch-lighthouse.mjs https://www.rase.co.in` → Performance ≥ 90.
6. If Lighthouse still &lt; 90 post-deploy, continue bundle splitting (NavBar, NoticeBoard) — second perf pass.

---

## Files Added/Updated (this certification)

| File | Purpose |
|------|---------|
| `scripts/production-go-live.mjs` | Automated 9-check go-live gate |
| `docs/production-go-live-results.json` | Latest probe output |
| `docs/FULL_GO_LAUNCH_CERTIFICATION.md` | This report |
| `src/app/component/ui/RegistrationShell.tsx` | Framer → CSS |
| `src/components/home/HomePage.tsx` | Dynamic NavBar |
| `src/app/ClientChrome.tsx` | Dynamic Modal |
