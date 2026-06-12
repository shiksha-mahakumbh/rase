# Final Production Go / No-Go

**Date:** June 2026  
**Release Manager:** Principal Release Manager audit  
**Platform:** Shiksha Mahakumbh — Phases A, B, S, C + P0  
**Deployment score:** **78 / 100** (unchanged)

---

## Decision

# NO GO

Production launch is **not approved** at this time.

| Environment | Decision |
|-------------|----------|
| **Production** | **NO GO** |
| **Staging / Preview** | **CONDITIONAL GO** (after Preview env vars) |
| **Local / CI build** | **GO** |

---

## Decision rationale

| Criterion | Required | Actual | Pass? |
|-----------|----------|--------|-------|
| Build compiles | exit 0 | ✅ exit 0, 300 pages | ✅ |
| TypeScript | pass | ✅ | ✅ |
| Prisma | valid + migrated | ✅ 7/7 | ✅ |
| Local env | 21/21 | ✅ | ✅ |
| Security code | 9/9 | ✅ | ✅ |
| DB connected | cloud Supabase | ✅ | ✅ |
| Domain aligned | single canonical | ❌ `.org` env vs `.com` infra | ❌ |
| Firebase rules deployed | verified | ❌ unverified | ❌ |
| Seeds complete | all 4 scripts | ⚠️ partial | ❌ |
| Vercel Preview env | complete | ❌ 8+ vars missing | ❌ |
| Live smoke tests | executed | ❌ not done | ❌ |
| Razorpay E2E | verified on prod URL | ❌ not done | ❌ |

**Pass: 7/12**

---

## Remaining blockers (ordered)

### P0 — Must resolve before production GO

| # | Blocker | ETA |
|---|---------|-----|
| 1 | **Domain alignment** — set `NEXT_PUBLIC_SITE_URL=https://shikshamahakumbh.com` everywhere | 1 hour |
| 2 | **Firebase rules deploy** + Console verification | 30 min |
| 3 | **Live security smoke tests** on production URL | 2 hours |
| 4 | **DATABASE_URL / DIRECT_URL** explicit on Vercel Production | 30 min |

### P1 — Must resolve before sign-off

| # | Blocker | ETA |
|---|---------|-----|
| 5 | Re-run `seed:cms` + `seed-s2-hi.mjs --publish` | 15 min |
| 6 | Vercel Preview env vars (5 security + Supabase) | 1 hour |
| 7 | Razorpay webhook test on production domain | 1 hour |
| 8 | Rotate secrets exposed in chat (DB password, webhook, API keys) | 1 hour |
| 9 | Supabase RLS policies apply (`supabase/policies/*.sql`) | 2 hours |

### P2 — Post-launch

| # | Item |
|---|------|
| 10 | 48-hour production soak |
| 11 | Align hardcoded `.com` / `.org` strings in code (separate PR) |
| 12 | Lock down `/api/v2/registration/upload` |
| 13 | Distributed rate limiting |

---

## Risk level

| Dimension | Level | Notes |
|-----------|-------|-------|
| **Technical (code)** | 🟢 LOW | Build passes; security patterns sound |
| **Infrastructure** | 🟡 MEDIUM | Vercel env gaps; DB URL naming |
| **Domain / SEO** | 🔴 HIGH | Wrong canonical in sitemap until fixed |
| **Payments** | 🟡 MEDIUM | Webhook on `.com` but site URL `.org` |
| **Security ops** | 🔴 HIGH | Firebase rules deploy unverified |
| **Overall launch risk** | 🔴 **HIGH** | Do not launch without P0 resolution |

---

## Estimated launch date

| Milestone | Estimate |
|-----------|----------|
| P0 blockers resolved | **1 business day** |
| P1 + staging QA complete | **+2 business days** |
| 48h soak | **+2 days** |
| **Earliest production GO** | **~5–7 calendar days** (June 17–19, 2026) |

*Assumes stakeholder confirms `.com` canonical within 24 hours.*

---

## Exact deployment commands

### Pre-deploy (run in order)

```bash
# 1. Local verification
cd rase
node scripts/staging-env-check.mjs
node scripts/staging-db-url-audit.mjs
node scripts/staging-security-check.mjs
npx tsc --noEmit
npx prisma validate
npm run build

# 2. Database seeds (after env points to production Supabase)
npm run db:migrate:deploy
npm run seed:cms
node scripts/seed-s2-content.mjs --publish
node scripts/seed-s2-hi.mjs --publish
node scripts/seed-phase-c-content.mjs --publish
node scripts/staging-db-check.mjs

# 3. Firebase rules
firebase use shiksha-mahakumbh-abhiyan
firebase deploy --only firestore:rules,storage

# 4. Vercel (after env vars updated in dashboard)
npx vercel --prod
```

### Post-deploy verification

```bash
# Security
curl -s -o /dev/null -w "%{http_code}" https://shikshamahakumbh.com/api/registration/SMK2026-000001
# Expect: 401

# Health
curl -s https://shikshamahakumbh.com/api/v2/health

# Sitemap domain check
curl -s https://shikshamahakumbh.com/sitemap.xml | findstr /i "shikshamahakumbh"
# All URLs should use ONE domain only
```

### Rollback

```bash
# Vercel Dashboard → Deployments → [previous] → Promote to Production
# Disable Razorpay webhook if payment corruption suspected
# DO NOT run prisma migrate reset on production
```

---

## Domain mismatch — resolution (no auto-change)

| Question | Answer |
|----------|--------|
| Does domain mismatch exist? | **YES** |
| Authoritative domain | **`shikshamahakumbh.com`** |
| How to resolve | Update `NEXT_PUBLIC_SITE_URL` to `.com` on Vercel + local env; redeploy; verify Razorpay webhook stays on `.com` |
| Full plan | `FINAL_DOMAIN_DECISION.md` |

---

## Safe fixes applied this audit

| File | Change |
|------|--------|
| `src/server/services/seo.service.ts` | `sameAs[0]` uses `SITE_URL` instead of hardcoded `.com` |

**No changes to:** schema, payments, registration, Firebase architecture, or domain env vars.

---

## Documents produced

| # | Document |
|---|----------|
| 1 | `FINAL_DOMAIN_DECISION.md` |
| 2 | `FINAL_VERCEL_READINESS.md` |
| 3 | `FIREBASE_PRODUCTION_READINESS.md` |
| 4 | `PRODUCTION_DEPLOYMENT_CHECKLIST.md` |
| 5 | `FINAL_PRODUCTION_GO_NO_GO.md` (this file) |

---

## Final answers

| Question | Answer |
|----------|--------|
| **GO or NO GO?** | **NO GO** |
| Production-ready? | **NO** (78/100) |
| Staging-ready? | **CONDITIONAL GO** |
| Domain mismatch? | **YES** — resolve via `.com` canonical |
| Launch risk | **HIGH** until P0 cleared |
| Earliest launch | **~5–7 days** |

**STOP — Awaiting stakeholder domain confirmation and P0 ops execution. No Phase D.**
