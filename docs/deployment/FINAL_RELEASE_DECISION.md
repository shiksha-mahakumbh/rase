# Final Release Decision

**Date:** 2026-06-11  
**Role:** Principal Release Engineer + Security Auditor  
**Method:** Fresh verification — source, build, Vercel CLI, Supabase scripts, live HTTP  
**Prior reports:** Not assumed correct

---

# Verdict: NO GO

# Production Score: 66 / 100

---

## Phase 1 — Current state verification

### Security remediation in source — **PASS**

| Control | File | Lines | Verified |
|---------|------|-------|:--------:|
| Token validation | `registration-lookup.ts` | 43-70 | ✅ |
| Email query param | `[registrationId]/route.ts` | 26-27, 51-56 | ✅ |
| No credential → 401 | `[registrationId]/route.ts` | **51-56** | ✅ |
| Rate limit 10/min | `[registrationId]/route.ts` | 34-44 | ✅ |
| PII stripped (no email/phone) | `registration-lookup.ts` | **78-87, 99-108** | ✅ |
| Admin HMAC cookie | `admin-session.ts` | 23-24, 40-43 | ✅ |
| `ADMIN_SESSION_SECRET` | `admin-session.ts` | 15-20 | ✅ |
| Legacy `smk_admin_session=1` rejected | `middleware.ts` | **42-43** | ✅ |
| Automated tests | `staging-security-check.mjs` | — | **9/9 PASS** |

### Build — **PASS**

| Command | Exit | Result |
|---------|:----:|--------|
| `npx prisma validate` | 0 | Valid |
| `npx prisma generate` | 0 | Client v6.19.3 |
| `npx tsc --noEmit` | 0 | No errors |
| `npm run build` | 0 | **300/300 pages** |

Warnings: ESLint hooks, `no-img-element`; non-fatal Prisma UUID errors during SSG.

### Supabase local — **PASS**

| Check | Result |
|-------|--------|
| `DATABASE_URL` port | **6543** (pooler) |
| `DIRECT_URL` port | **5432** (direct) |
| localhost / 127.0.0.1 | **None** |
| Migrations | **7/7** |
| Tables | **15/15** |
| Connected | **true** |

---

## Status table

| Category | Score | Status | Key evidence |
|----------|------:|--------|--------------|
| **Security** | 30/100 | **NO GO** | Source PASS; live 200+PII |
| **SEO** | 18/100 | **NO GO** | Live canonical/sitemap = `rase.co.in` |
| **Build** | 88/100 | **GO** | 300 pages, exit 0 |
| **Database** | 82/100 | **CONDITIONAL GO** | Cloud connected; seeds partial |
| **Supabase** | 78/100 | **CONDITIONAL GO** | Local OK; Vercel URL alias gap |
| **Firebase** | 50/100 | **NO GO** | `UNVERIFIED_FIREBASE_DEPLOYMENT` |
| **Razorpay** | 62/100 | **CONDITIONAL GO** | Code OK; domain E2E unverified |
| **Environment** | 55/100 | **WARNING** | Preview FAIL; Prod env without redeploy |
| **Deployment** | 20/100 | **NO GO** | **STALE_PRODUCTION_DEPLOYMENT** |

---

## GO approval criteria — checklist

| Criterion | Required for GO | Met? |
|-----------|:---------------:|:----:|
| Production security vulnerability fixed | 401 on anonymous lookup | ❌ |
| Domain alignment complete | All SEO on `www.shikshamahakumbh.com` | ❌ |
| Firebase rules verified deployed | Console confirmation | ❌ |
| Build passes | exit 0 | ✅ |
| Environment complete | All required vars all envs | ❌ |

**Cannot approve GO — 2 of 5 hard gates failed; 2 more unverified.**

---

## P0 blockers

| # | Blocker | Evidence | Remediation |
|---|---------|----------|-------------|
| 1 | **Stale production deploy** | Live 200 vs source 401; response has `email`+`contactNumber` | `npx vercel --prod` |
| 2 | **PII exposed on live URL** | HTTP probe 2026-06-11 | Redeploy + verify 401 |
| 3 | **Domain/SEO split** | Sitemap/canonical = `rase.co.in` | Set `NEXT_PUBLIC_SITE_URL` + redeploy |
| 4 | **Firebase rules unverified** | No Console proof | `firebase deploy --only firestore:rules,storage` |
| 5 | **Vercel Preview env FAIL** | Missing all security secrets | Copy vars from Production |
| 6 | **`DATABASE_URL`/`DIRECT_URL` missing** | Vercel naming gap | Map from `POSTGRES_*` |

---

## P1 blockers

| # | Blocker |
|---|---------|
| 7 | Seeds: `notices=0`, `downloads=0` — run `npm run seed:cms` |
| 8 | Razorpay webhook URL → `www.shikshamahakumbh.com` |
| 9 | Razorpay E2E test post-deploy |
| 10 | Local `.env` still `.org` — align before next build |

---

## P2 improvements

| # | Item |
|---|------|
| 11 | Change `site.ts`/`layout.tsx` fallback from `rase.co.in` |
| 12 | Replace hardcoded `rase.co.in` in TrustStrip, committee-editions |
| 13 | Fix `seo_metadata.entity_id` UUID vs route-key mismatch |
| 14 | 48-hour production soak |
| 15 | Vercel redirect `rase.co.in` → `shikshamahakumbh.com` |

---

## Root cause (security runtime)

**STALE_PRODUCTION_DEPLOYMENT** — see `STALE_DEPLOYMENT_ROOT_CAUSE.md`

Live bundle predates P0 fixes. Vercel env vars updated ~15h ago without redeploy.

---

## Earliest Production GO estimate

| Milestone | Time |
|-----------|------|
| Execute remediation plan (Steps 1–7) | **~3 hours** |
| 48-hour soak | **+2 days** |
| **Earliest GO sign-off** | **~3 calendar days** |

---

## Recommended path: NO GO → GO

Execute `PRODUCTION_REMEDIATION_PLAN.md` in order. **Gate:** Step 7 smoke tests all pass.

```bash
# Critical gate command
curl -s -o /dev/null -w "%{http_code}" \
  "https://www.shikshamahakumbh.com/api/registration/SMK2026-000001"
# Must print: 401
```

---

## Reports delivered (this sprint)

| Document |
|----------|
| `DOMAIN_REFERENCE_MATRIX.md` |
| `VERCEL_ENV_GAP_ANALYSIS.md` |
| `FIREBASE_RULES_VERIFICATION.md` |
| `STALE_DEPLOYMENT_ROOT_CAUSE.md` |
| `PRODUCTION_REMEDIATION_PLAN.md` |
| `FINAL_RELEASE_DECISION.md` (this file) |

---

## Final recommendation

| Question | Answer |
|----------|--------|
| **GO / NO GO / CONDITIONAL GO?** | **NO GO** |
| **Production score** | **66/100** |
| **Code ready?** | **YES** |
| **Production ready?** | **NO** |
| **Primary blocker** | Stale deploy exposing PII |
| **Canonical domain** | `https://www.shikshamahakumbh.com` |

**STOP — No deploy, commit, push, or production changes made.**
