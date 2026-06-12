# Final Go-Live Decision

**Audit date:** 2026-06-12  
**Program:** Production Cutover Readiness (G0–G8)  
**Firebase Exit:** F1–F7 complete (code)  
**Deployment:** None performed during this audit

---

## Decision

# NO GO

Production cutover is **not approved**.

| Environment | Decision |
|-------------|----------|
| **Production launch** | **NO GO** |
| **Staging / Preview QA** | **CONDITIONAL GO** (after Preview env vars + staging migration dry-run) |
| **Local / CI build** | **GO** |

---

## Scorecard

| Dimension | Weight | Score | Evidence |
|-----------|--------|-------|----------|
| **Security** | 20% | **72/100** | 9/9 automated checks pass; Firebase secret still on Vercel; live prod not on new stack |
| **Performance** | 10% | **78/100** | `npm run build` exit 0; no load test run |
| **SEO** | 15% | **28/100** | Live sitemap/robots on `shikshamahakumbh.com` point to `rase.co.in` |
| **Payments** | 15% | **55/100** | Webhook code solid; 0 payment rows in Supabase; E2E not verified |
| **Database** | 25% | **40/100** | Schema migrated; **0 registrations**; migration scripts incomplete |
| **Operations** | 15% | **50/100** | Preview env broken; `.env.example` stale; RLS/buckets unverified |

### Weighted overall: **52 / 100**

---

## Pass / fail matrix

| # | Criterion | Required | Actual | Pass? |
|---|-----------|----------|--------|-------|
| 1 | Firebase runtime removed | 0 imports | 0 imports | ✅ |
| 2 | Build + TS + Prisma | Pass | Pass | ✅ |
| 3 | Supabase schema applied | 7/7 | 7/7 | ✅ |
| 4 | Production data migrated | >0 registrations | **0** | ❌ |
| 5 | Payment history migrated | Reconciled | **0 rows** | ❌ |
| 6 | Storage buckets + RLS | Verified | Unverified | ❌ |
| 7 | Canonical domain SEO | `www.shikshamahakumbh.com` | Live → `rase.co.in` | ❌ |
| 8 | Vercel Production env complete | All vars | Gaps + stale Firebase | ⚠️ |
| 9 | Vercel Preview env | QA-ready | **FAIL** | ❌ |
| 10 | Live deploy of Firebase-free build | Deployed | **Not deployed** | ❌ |
| 11 | Razorpay E2E on prod URL | Verified | Not run | ❌ |
| 12 | Staging migration dry-run | Complete | Not run | ❌ |

**Pass: 3/12**

---

## P0 blockers (must fix before GO)

1. **Execute data migration** — Firestore → Supabase (registrations, payments, files, counter); extend import script for payments/attachments
2. **Fix canonical domain** — `NEXT_PUBLIC_SITE_URL=https://www.shikshamahakumbh.com` + redeploy
3. **Deploy Firebase-free build** to production — live site still serves stale SEO/build (2026-06-09 sitemap)
4. **Verify Supabase RLS + storage buckets** in console
5. **Remove `FIREBASE_SERVICE_ACCOUNT_JSON`** from Vercel after migration

---

## P1 blockers (before sign-off)

6. Complete Preview environment variables  
7. Staging dry-run of full migration + smoke tests  
8. Razorpay webhook test on canonical production URL  
9. Run `seed-rbac` + confirm `registration_counters` row  
10. Update `.env.example` and `verify-env.mjs` for Supabase-only stack  
11. Clean stale Firebase string references in privacy policy / admin UI  

---

## Evidence summary by phase

| Phase | Doc | Verdict |
|-------|-----|---------|
| G0 | `FIREBASE_EXIT_VERIFICATION.md` | Runtime exit ✅; ops templates stale |
| G1 | `DATA_MIGRATION_READINESS.md` | Scripts MVP; DB empty; gaps on payments/files |
| G2 | `SUPABASE_PRODUCTION_READINESS.md` | Schema ✅; data/console ❌ |
| G3 | `SECURITY_GO_LIVE_AUDIT.md` | Code ✅; live parity ❌ |
| G4 | `DOMAIN_AND_SEO_AUDIT.md` | **FAIL** |
| G5 | `PAYMENTS_AUDIT.md` | Code ✅; data/E2E ❌ |
| G6 | `VERCEL_ENV_AUDIT.md` | Production partial; Preview fail |
| G7 | `GO_LIVE_EXECUTION_PLAN.md` | Plan ready |

---

## Risk summary

| Risk | Level |
|------|-------|
| Launch without migration | 🔴 Critical — empty database |
| Wrong canonical / split SEO | 🔴 High |
| Stale production deployment | 🔴 High |
| Preview cannot QA | 🟡 Medium |
| In-memory rate limits at scale | 🟢 Low (post-launch) |

---

## Estimated timeline to GO

| Milestone | Duration |
|-----------|----------|
| Fix migration scripts + staging dry-run | 2–3 days |
| Production migration + validation | 1 day |
| Env + domain + deploy | 0.5 day |
| Smoke + Razorpay E2E | 0.5 day |
| 48h soak | 2 days |
| **Earliest GO** | **~6–8 business days** (assuming no data quality surprises) |

---

## Approvals required

| Role | Sign-off |
|------|----------|
| Engineering lead | Migration scripts complete + staging validated |
| DBA / Supabase owner | RLS + buckets + backup |
| Product / SEO | Canonical domain confirmed |
| Finance | Razorpay webhook cutover |
| Release manager | This document updated to **GO** |

---

## Conditional path to GO

When all P0 items are complete and P1 items are scheduled:

1. Re-run this audit (G0–G8)
2. Confirm live sitemap uses `www.shikshamahakumbh.com`
3. Confirm `registrations` count matches Firestore export ± tolerance
4. Update decision to **GO** or **CONDITIONAL GO** (with documented accepted risks)

---

**Signed audit type:** Read-only — no deploy, push, migration, or production modification performed.
