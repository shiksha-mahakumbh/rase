# Executive Staging Action Plan

**Date:** June 2026  
**Current state:** Code ready · Environment not ready · Staging **NOT APPROVED**

---

## Executive summary

Shiksha Mahakumbh has completed Phase A through C and P0 security remediation in code. TypeScript and Prisma validate successfully. The **sole blockers to staging approval are operational**: local database configuration without a running Supabase instance, eight missing environment variables, and no executed staging deployment.

**Root cause of DB failure:** `.env` points to `127.0.0.1:54322` (Supabase local CLI per `supabase/config.toml`) but `supabase start` is not running. This is not a schema or Prisma defect.

**Estimated time to staging approval:** **4–8 hours** of focused ops work (assuming Supabase staging project exists).

---

## Priority 1 — Critical (must complete today)

| # | Action | Owner | Time |
|---|--------|-------|------|
| 1 | Create/use **Supabase staging** cloud project | DevOps | 30 min |
| 2 | Set `DATABASE_URL` (pooler :6543) + `DIRECT_URL` (:5432) on Vercel Preview | DevOps | 15 min |
| 3 | Set `NEXT_PUBLIC_SUPABASE_URL`, `ANON_KEY`, `SERVICE_ROLE_KEY` | DevOps | 10 min |
| 4 | Generate and set `ADMIN_OPS_SECRET`, `ADMIN_SESSION_SECRET`, `REGISTRATION_LOOKUP_SECRET` | DevOps | 15 min |
| 5 | Set `NEXT_PUBLIC_SITE_URL` to staging domain | DevOps | 5 min |
| 6 | Run `npm run db:migrate:deploy` against staging DB | DevOps | 10 min |
| 7 | Run seed sequence (4 scripts, `--publish` where noted) | DevOps | 15 min |
| 8 | `firebase deploy --only firestore:rules,storage` on staging Firebase | DevOps | 15 min |
| 9 | Deploy to Vercel Preview / staging branch | DevOps | 20 min |
| 10 | Run `staging-env-check.mjs` + `staging-db-check.mjs` → 0 failures | QA | 10 min |

**Exit criteria:** All P1 items complete → re-run Go/No-Go → target **GO**.

---

## Priority 2 — Required (before staging sign-off)

| # | Action | Owner | Time |
|---|--------|-------|------|
| 11 | Set `RAZORPAY_WEBHOOK_SECRET` (test mode for staging) | DevOps | 10 min |
| 12 | Security smoke tests (lookup 401, cookie rejection, admin session) | QA | 1 hr |
| 13 | Admin CMS CRUD smoke test (all 20 modules) | QA | 2 hr |
| 14 | Registration E2E (Firebase submit → success token → admin view) | QA | 1 hr |
| 15 | Public page verification (11 CMS routes) | QA | 1 hr |
| 16 | Add `postinstall: prisma generate` to `package.json` | Engineering | 5 min |
| 17 | Apply Supabase RLS policies (`supabase/policies/*.sql`) | DevOps | 1 hr |

**Exit criteria:** Staging QA report updated with runtime PASS → **Staging APPROVED**.

---

## Priority 3 — Recommended (before production candidate)

| # | Action | Owner | Time |
|---|--------|-------|------|
| 18 | Merge `.env.example` + `.env.supabase.example` into unified checklist | Engineering | 30 min |
| 19 | Extend `verify-env.mjs` for P0 + Supabase vars | Engineering | 1 hr |
| 20 | Lock down `/api/v2/registration/upload` | Engineering | 4 hr |
| 21 | Distributed rate limiting (Upstash/Vercel KV) | Engineering | 4 hr |
| 22 | 48-hour staging soak period | Ops | 48 hr |
| 23 | Lighthouse audit on top 10 routes | QA | 2 hr |

---

## Transition path

```
CURRENT (NO GO)
    │
    ▼ Priority 1 (4–8 hours)
STAGING ENVIRONMENT LIVE
    │
    ▼ Priority 2 (1 day QA)
STAGING APPROVED (GO)
    │
    ▼ Priority 3 + 48h soak (3–5 days)
PRODUCTION CANDIDATE
    │
    ▼ Production env + live Razorpay + final QA
PRODUCTION GO
```

---

## Exact missing environment variables

1. `ADMIN_OPS_SECRET`
2. `ADMIN_SESSION_SECRET`
3. `REGISTRATION_LOOKUP_SECRET`
4. `NEXT_PUBLIC_SUPABASE_URL`
5. `NEXT_PUBLIC_SUPABASE_ANON_KEY`
6. `SUPABASE_SERVICE_ROLE_KEY`
7. `RAZORPAY_WEBHOOK_SECRET`
8. `NEXT_PUBLIC_SITE_URL`

Plus: `DATABASE_URL` / `DIRECT_URL` must change from `127.0.0.1:54322` to **Supabase cloud staging** URLs.

---

## Documents produced (this sprint)

| Task | Document |
|------|----------|
| 1 | `ENVIRONMENT_REMEDIATION_REPORT.md` |
| 2 | `DATABASE_CONNECTIVITY_REPORT.md` |
| 3 | `MIGRATION_READINESS_REPORT.md` |
| 4 | `SEED_READINESS_REPORT.md` |
| 5 | `SECURITY_PREDEPLOY_CHECKLIST.md` |
| 6 | `VERCEL_DEPLOYMENT_REPORT.md` |
| 7 | `STAGING_GO_NO_GO_FINAL.md` |
| 8 | `EXECUTIVE_STAGING_ACTION_PLAN.md` |

---

## Final answers

| Question | Answer |
|----------|--------|
| Staging approved? | **NO** |
| Production candidate? | **NO** |
| Code ready? | **YES** |
| Time to staging GO | **4–8 hours** (ops) |
| Time to production candidate | **~1–2 weeks** after staging GO |

**STOP — Awaiting Priority 1 ops execution.**
