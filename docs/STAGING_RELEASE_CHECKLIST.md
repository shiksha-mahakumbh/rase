# Staging & Production Release Checklist — RC1

**Release tag:** `vRC1`  
**Feature freeze:** Active  
**Related reports:** `RC1_VALIDATION_REPORT.md`, `P3C_STAGING_SIGNOFF_REPORT.md`

---

## PRE-STAGING CHECKLIST

Complete **before** deploying RC1 to staging.

| # | Task | Status | Notes / Command |
|---|------|--------|-----------------|
| 1 | **Backup current production deployment** | ⏳ Manual | Export hosting snapshot, DB/Firestore rules, env secrets vault |
| 2 | **Tag release in Git: `vRC1`** | ⏳ Manual | `git tag -a vRC1 -m "RC1: P2 URL + P3 quality + P3b/P3c performance"` then `git push origin vRC1` |
| 3 | **Export current sitemap** | ✅ Done | `docs/releases/rc1/sitemap-production-baseline.xml` (62 URLs — live prod) |
| 4 | **Export current robots.txt** | ✅ Done | `docs/releases/rc1/robots-production-baseline.txt` |
| 5 | **Verify environment variables** | ⚠️ Partial | Run `npm run verify:env` — **4 required vars missing locally** (see below) |
| 6 | **Verify Firebase production credentials** | ⚠️ Manual | Project: `shiksha-mahakumbh-abhiyan` in `lib/firebase/client.ts`; confirm Firestore rules + Storage rules in Firebase Console |
| 7 | **Verify email delivery configuration** | ⚠️ Manual | SMTP_* present locally; send test via `/api/registration/send-email` on staging |
| 8 | **Verify registration workflows** | ⏳ Staging | Test participant, volunteer, abstract, payment webhook on staging |
| 9 | **Verify analytics tracking** | ⚠️ Manual | Set `NEXT_PUBLIC_GA_ID` / `NEXT_PUBLIC_GTM_ID` on staging; confirm events in AnalyticsLoader |
| 10 | **Verify Google Search Console ownership** | ⏳ Manual | Confirm `rase.co.in` property; delegated access for DHE team |

### RC1 local exports (post-build reference)

| File | URLs / content |
|------|----------------|
| `docs/releases/rc1/sitemap-rc1-local.xml` | **104 URLs** (P2 canonical sitemap) |
| `docs/releases/rc1/robots-rc1-local.txt` | Matches `src/app/robots.ts` |

**Important:** Production sitemap has **62 URLs** today; RC1 expands to **104** — expect Search Console coverage changes after deploy.

### Environment variables (`npm run verify:env`)

**Required for staging/production deploy:**

| Variable | Purpose |
|----------|---------|
| `NEXT_PUBLIC_SITE_URL` | Canonical base (e.g. `https://staging.rase.co.in`) |
| `SMTP_HOST`, `SMTP_USER`, `SMTP_PASS` | Registration confirmation emails |
| `NEXT_PUBLIC_RECAPTCHA_SITE_KEY` | Registration spam protection (production) |
| `RECAPTCHA_SECRET_KEY` | Server-side reCAPTCHA (production) |
| `RAZORPAY_WEBHOOK_SECRET` | Payment webhooks (production) |

**Optional but recommended:**

| Variable | Purpose |
|----------|---------|
| `NEXT_PUBLIC_GA_ID` / `NEXT_PUBLIC_GTM_ID` | Analytics |
| `NEXT_PUBLIC_CLARITY_ID` | Microsoft Clarity |
| `REGISTRATION_EMAIL_SECRET` | Email API auth |
| `NEXT_PUBLIC_ADSENSE_ENABLED=true` | AdSense (post-approval) |
| `NEXT_PUBLIC_SENTRY_DSN` | Error monitoring |

### Pre-staging commands

```bash
cd rase
npm run build
npm run verify:env
node scripts/verify-internal-links.mjs
node scripts/test-redirects.mjs

# After deploy target is chosen:
# git tag -a vRC1 -m "RC1 release candidate"
# git push origin vRC1
```

---

## POST-STAGING CHECKLIST

Complete **on staging URL** after RC1 deploy.

| # | Task | Command / method | Pass criteria |
|---|------|----------------|---------------|
| 1 | Run `validate:p3c` | `LH_BASE_URL=https://<staging> npm run validate:p3c` | See production criteria below |
| 2 | Run `validate-go-live` | `node scripts/validate-go-live.mjs https://<staging>` | 3/3 pass |
| 3 | Lighthouse (6 pages) | Included in `validate:p3c` or manual | Homepage + major pages ≥ **85** |
| 4 | Validate redirects | `node scripts/test-redirects.mjs` + HTTP spot-check | 37 rules, 308/301 to canonical |
| 5 | Validate sitemap | `curl https://<staging>/sitemap.xml` | 104 URLs, no legacy paths |
| 6 | Validate structured data | [Rich Results Test](https://search.google.com/test/rich-results) | Home Event, FAQ, Organization |
| 7 | Test mobile navigation | Manual — 320px / 375px | Hamburger, drawers, no overflow |
| 8 | Test registration E2E | Manual on staging | Submit → email → Firestore record |
| 9 | Test contact form | Manual | Footer + `/contact-us` → Firestore `contactMessages` |
| 10 | Review browser console | DevTools on 6 key pages | Zero errors, zero hydration warnings |

### Lighthouse pages (required)

1. `/` — Homepage  
2. `/past-events`  
3. `/media-center`  
4. `/contact-us`  
5. `/departments/academic-council`  
6. `/committees`

### Redirect spot-check (HTTP)

```bash
curl -sI https://<staging>/pastevent | findstr /i "location HTTP"
curl -sI https://<staging>/ContactUs
curl -sI https://<staging>/media
curl -sI https://<staging>/VibhagRoute/AcademicCouncil24
```

### Structured data pages to test

- `/` — Organization, Event, FAQPage, ItemList  
- `/contact-us` — LocalBusiness + BreadcrumbList  
- `/past-events` — BreadcrumbList + edition JSON-LD  
- `/departments/academic-council` — EducationEvent + BreadcrumbList

---

## PRODUCTION RELEASE CRITERIA

**All must pass before production cutover:**

| Criterion | RC1 local status | Staging required |
|-----------|------------------|------------------|
| Performance target (≥85 homepage + major pages) | ❌ Local 72 best | ✅ Must pass on staging+CDN |
| No critical defects | ✅ No 500 on fresh build | ✅ Re-verify on staging |
| No SEO regressions | ✅ SEO 100, 104-url sitemap | ✅ Compare to baseline export |
| No accessibility regressions | ✅ A11y 96–97 | ✅ Re-run Lighthouse |
| No broken links | ✅ 0 / 128 | ✅ Re-run on staging |
| No failed registrations | ⏳ | ✅ E2E on staging |
| Stakeholder approval | ⏳ | ✅ DHE sign-off document |

### Additional gates (from RC1 validation)

| Gate | Status |
|------|--------|
| CLS = 0 | ✅ |
| Redirect loops | ✅ None |
| Hydration errors | ⏳ Manual console check |
| AdSense readiness | ✅ CLS-safe layouts |

---

## GO / NO-GO DECISION MATRIX

| Staging outcome | Production decision |
|-----------------|---------------------|
| Homepage Performance ≥ 85, all gates green | **GO** |
| Homepage 80–84, all other gates green | **CONDITIONAL GO** — P4 academic-council sprint within 14 days |
| Homepage < 80 OR critical defect | **NO-GO** |
| Stakeholder not signed off | **NO-GO** |

**Current RC1 recommendation (pre-staging):** **NO-GO for production** — deploy to staging first.

---

## GOOGLE SEARCH CONSOLE — POST-PRODUCTION

| Step | Action |
|------|--------|
| 1 | Submit new sitemap: `https://www.rase.co.in/sitemap.xml` |
| 2 | URL inspect: `/past-events`, `/contact-us`, `/media-center`, `/departments/academic-council` |
| 3 | Monitor **Page indexing** for 2 weeks — watch redirect recognition |
| 4 | Validate **Coverage** — no spike in "Excluded by redirect" errors |
| 5 | Request indexing for top 10 canonical URLs |

---

## ARTIFACTS

```
docs/releases/rc1/
  sitemap-production-baseline.xml   (62 URLs — current live)
  sitemap-rc1-local.xml               (104 URLs — RC1 build)
  robots-production-baseline.txt
  robots-rc1-local.txt

docs/lighthouse/p3c/                  (Lighthouse JSON/HTML)
docs/RC1_VALIDATION_REPORT.md
scripts/verify-env.mjs
scripts/p3c-staging-validation.mjs
```

---

## QUICK REFERENCE

```bash
# Pre-staging
npm run build && npm run verify:env
node scripts/verify-internal-links.mjs
node scripts/test-redirects.mjs

# Post-staging
LH_BASE_URL=https://<staging-url> npm run validate:p3c
node scripts/validate-go-live.mjs https://<staging-url>
```

---

*Only proceed to production after post-staging checklist is complete and stakeholder approval is recorded.*
