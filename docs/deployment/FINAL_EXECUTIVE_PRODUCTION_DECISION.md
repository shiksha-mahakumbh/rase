# Final Executive Production Decision

**Date:** 2026-06-10  
**Role:** Principal Release Engineer / Security Auditor / DevOps Lead / Production SRE  
**Method:** Fresh verification — source, build, Vercel, Supabase, Firebase, live HTTP  
**Prior audits:** Not assumed correct

---

# Verdict: NO GO

# Production Score: 67 / 100

---

## Status table

| Category | Score | Status | Key evidence |
|----------|------:|--------|--------------|
| **Security** | 35/100 | **NO GO** | Live lookup 200+PII; source 9/9 PASS |
| **Domain** | 20/100 | **NO GO** | Traffic `.com`, SEO `rase.co.in`, env `.org` |
| **SEO** | 18/100 | **NO GO** | Live canonical/sitemap/robots = `rase.co.in` |
| **Database** | 82/100 | **CONDITIONAL GO** | 7/7 migrations, cloud connected |
| **Supabase** | 80/100 | **CONDITIONAL GO** | Ports correct; Vercel URL alias gap |
| **Firebase** | 50/100 | **NO GO** | **UNVERIFIED_FIREBASE_DEPLOYMENT** |
| **Razorpay** | 62/100 | **CONDITIONAL GO** | Code OK; domain E2E unverified |
| **Build** | 88/100 | **GO** | 300 pages, exit 0 |
| **Deployment** | 25/100 | **NO GO** | **STALE_PRODUCTION_DEPLOYMENT** |

---

## Critical finding

### STALE_PRODUCTION_DEPLOYMENT

| Probe | Expected (source) | Live (2026-06-10) |
|-------|-------------------|-------------------|
| `GET /api/registration/SMK2026-000001` | **401** | **200** + email + contactNumber |
| Response fields | Summary-only (no email/phone) | Includes `email`, `contactNumber` |
| `GET /api/v2/health` | 200 JSON | **404** HTML |

**Security fixes exist in repository but are NOT running in production.**

---

## P0 blockers

| # | Blocker | Evidence | Remediation |
|---|---------|----------|-------------|
| 1 | Stale production deploy | Live 200 vs source 401 | `npx vercel --prod` |
| 2 | `NEXT_PUBLIC_SITE_URL` ineffective | Live SEO = `rase.co.in` | Set `https://www.shikshamahakumbh.com` all envs |
| 3 | Unauthenticated PII on live URL | HTTP probe body | Redeploy + verify 401 |
| 4 | Firebase rules unverified | No Console confirmation | `firebase deploy --only firestore:rules,storage` |
| 5 | Vercel Preview missing security secrets | `vercel env ls` | Copy vars to Preview |
| 6 | `DATABASE_URL`/`DIRECT_URL` not on Vercel | Naming gap | Map from `POSTGRES_*` |

---

## P1 blockers

| # | Blocker | Remediation |
|---|---------|-------------|
| 7 | Seeds incomplete (notices=0, downloads=0) | `npm run seed:cms` |
| 8 | Razorpay webhook domain alignment | Dashboard → `www.shikshamahakumbh.com` |
| 9 | Razorpay E2E not verified | Test webhook post-deploy |
| 10 | Supabase RLS not verified live | Run policy SQL check in console |

---

## P2 improvements

| # | Item |
|---|------|
| 11 | Change `site.ts` fallback from `rase.co.in` to `shikshamahakumbh.com` |
| 12 | Align 15 hardcoded `rase.co.in` refs in `src/` to `SITE_URL` |
| 13 | Fix `seo_metadata.entity_id` UUID vs route-key mismatch |
| 14 | ESLint warnings (hooks, img elements) |
| 15 | 48-hour production soak post-launch |

---

## Recommended canonical domain

# `https://www.shikshamahakumbh.com`

| Domain | Role |
|--------|------|
| `www.shikshamahakumbh.com` | **Canonical** (serves traffic) |
| `shikshamahakumbh.com` | Apex → 308 redirect |
| `shikshamahakumbh.org` | No DNS — not viable |
| `www.rase.co.in` | Current live SEO — must redirect or demote |

---

## Exact remediation sequence (manual)

```bash
# 1. Vercel Dashboard
NEXT_PUBLIC_SITE_URL=https://www.shikshamahakumbh.com
DATABASE_URL=<POSTGRES_PRISMA_URL>
DIRECT_URL=<POSTGRES_URL_NON_POOLING>
# Copy security + Supabase vars to Preview

# 2. Verify local build
cd rase
npx prisma validate && npx tsc --noEmit && npm run build

# 3. Firebase
firebase deploy --only firestore:rules,storage

# 4. Deploy
npx vercel --prod

# 5. Smoke tests (MUST PASS)
curl -s -o /dev/null -w "%{http_code}" \
  https://www.shikshamahakumbh.com/api/registration/SMK2026-000001
# Expected: 401

curl -s https://www.shikshamahakumbh.com/api/v2/health
# Expected: 200 JSON

curl -s https://www.shikshamahakumbh.com/sitemap.xml | findstr /i "shikshamahakumbh"
# Expected: all URLs on shikshamahakumbh.com
```

---

## Earliest Production GO estimate

| Milestone | Duration |
|-----------|----------|
| P0 remediation | 1 business day |
| P1 + staging QA | +2 business days |
| 48h soak | +2 days |
| **Earliest GO** | **~5–7 calendar days** |

---

## Reports delivered (this audit)

| Phase | Document |
|-------|----------|
| 1 | `DOMAIN_ALIGNMENT_VERIFICATION.md` |
| 2a | `SECURITY_SOURCE_VERIFICATION.md` |
| 2b | `SECURITY_RUNTIME_VERIFICATION.md` |
| 3 | `VERCEL_ENVIRONMENT_VERIFICATION.md` |
| 4 | `SUPABASE_RUNTIME_AUDIT.md` |
| 5 | `FIREBASE_RUNTIME_AUDIT.md` |
| 6 | `RAZORPAY_RUNTIME_AUDIT.md` |
| 7 | `BUILD_RUNTIME_AUDIT.md` |
| 8 | `FINAL_EXECUTIVE_PRODUCTION_DECISION.md` (this file) |

---

## Final recommendation

| Question | Answer |
|----------|--------|
| **GO or NO GO?** | **NO GO** |
| **Production score** | **67/100** |
| **Can launch today?** | **No** |
| **Primary reason** | Stale deploy exposes PII; domain/SEO split |
| **Code ready?** | **Yes** (build + security source pass) |
| **Ops ready?** | **No** |

**STOP — No deploy, commit, push, or env changes made. No Phase D.**
