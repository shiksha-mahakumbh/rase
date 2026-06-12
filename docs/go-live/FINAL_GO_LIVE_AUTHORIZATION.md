# Final Go-Live Authorization

**Date:** 2026-05-29  
**Role:** Lead Production Release Engineer  
**Platform:** Shiksha Mahakumbh (`dhe-projects/rase-co-in`)

---

# Executive Summary

The Firebase Exit Program and 8-phase remediation are **complete in source**. Supabase infrastructure (8 buckets, 55 public RLS policies, RBAC seed) is **provisioned**. Build and security tests pass locally. **Production launch is not authorized** — all remaining blockers are operational (env, deploy, data migration, storage RLS, git push).

This document constitutes the **deployment-ready release package** signoff. No deployment, push, or data migration was executed during this audit.

---

# Score

## Production Readiness Score: **68 / 100**

| Category | Max | Score | Evidence |
|----------|-----|-------|----------|
| Source & remediation (8 phases) | 15 | 15 | Commits `d758002`–`469381e` |
| Build & TypeScript | 10 | 9 | 303 pages; SEO UUID warnings |
| Security (source + tests) | 15 | 15 | 15/15 PASS |
| Supabase infra | 15 | 11 | 8 buckets, 55 RLS; storage.objects pending; 0 data |
| Domain (source) | 10 | 8 | Source `.com`; live stale |
| Vercel environment | 10 | 4 | DATABASE_URL/DIRECT_URL missing; Preview empty |
| Production deployed | 15 | 0 | Stale 2026-06-09 deploy |
| Data migration | — | -4 | Tooling ready; not executed |

**GO threshold:** ≥ 85/100

---

# GO / NO GO

## **NO GO**

Production go-live is **denied** until P0 blockers are cleared and live verification passes.

---

# Remaining Blockers

| # | Blocker | Signoff doc |
|---|---------|-------------|
| 1 | 8 commits + cutover fixes **not pushed** | `REPOSITORY_RELEASE_STATUS.md` |
| 2 | **`DATABASE_URL` / `DIRECT_URL`** missing on Vercel | `VERCEL_PRODUCTION_SIGNOFF.md` |
| 3 | **`NEXT_PUBLIC_SITE_URL`** wrong on live (sitemap → `rase.co.in`) | `DOMAIN_SIGNOFF.md` |
| 4 | **Production not redeployed** — live PII leak (200 without auth) | `SECURITY_RELEASE_GATE.md` |
| 5 | **`storage-production.sql`** not applied (0 storage policies) | `SUPABASE_PRODUCTION_SIGNOFF.md` |
| 6 | **Firebase → Supabase import** not executed (0 registrations) | `PRODUCTION_CUTOVER_CHECKLIST.md` Step 5 |
| 7 | **Preview env** lacks app secrets | `VERCEL_PRODUCTION_SIGNOFF.md` |
| 8 | **`FIREBASE_SERVICE_ACCOUNT_JSON`** still on Vercel | `FIREBASE_EXIT_SIGNOFF.md` |

**Estimated launch effort:** **8–12 operator hours** (see Launch Sequence).

---

# Launch Sequence

Execute in order per `PRODUCTION_CUTOVER_CHECKLIST.md`:

1. **Commit** remaining files (RLS fix, deploy helper, go-live docs)
2. **Push** to GitHub (`git push origin main`)
3. **Apply** `storage-production.sql` in Supabase SQL Editor
4. **Configure** Vercel env: `DATABASE_URL`, `DIRECT_URL`, `NEXT_PUBLIC_SITE_URL`
5. **Export/import** Firebase data (with explicit approval)
6. **Deploy** production (`npx vercel --prod`)
7. **Verify** registration endpoint → **401** without credentials
8. **Verify** sitemap/robots emit `www.shikshamahakumbh.com`
9. **Verify** Razorpay payment + webhook persistence
10. **Verify** Supabase row counts and counter alignment
11. **Start** 48-hour observation period

### Exact commands (summary)

```bash
# 1–2 Repository
git add supabase/policies/registrations.sql scripts/ docs/go-live/
git commit -m "Go-live prep: RLS fix, deploy helper, release signoff pack"
git push origin main

# 3 Storage RLS (Supabase SQL Editor)
# → Run supabase/policies/storage-production.sql

# 4 Vercel env
vercel env add DATABASE_URL production      # = POSTGRES_PRISMA_URL
vercel env add DIRECT_URL production        # = POSTGRES_URL_NON_POOLING
vercel env add NEXT_PUBLIC_SITE_URL production  # https://www.shikshamahakumbh.com

# 5 Data migration
npm i -D firebase-admin
npm run firebase:export -- --out=./exports/firebase
npm run firebase:import -- --in=./exports/firebase

# 6 Deploy
npx prisma migrate deploy
npm run db:seed
npx vercel --prod

# 7–8 Post-deploy verification
curl -s -o /dev/null -w "%{http_code}" \
  "https://www.shikshamahakumbh.com/api/registration/SMK2026-000001"
curl -s https://www.shikshamahakumbh.com/sitemap.xml | head -5
```

---

# Rollback Plan

### Immediate (application)

1. Vercel Dashboard → Deployments → **Promote** `dpl_4LbmLW5RKASduH6dWXoHnrFuNLtt` (2026-06-09)
2. Restore prior `NEXT_PUBLIC_SITE_URL` if needed
3. Re-enable `FIREBASE_SERVICE_ACCOUNT_JSON` if Firebase remains authoritative during rollback window

### Database

1. **No destructive DDL rollback**
2. If import partially applied: use Supabase PITR snapshot if available
3. Reset `registration_counters.last_number` if ID collision detected

### Data retention

- Keep Firebase project **read-only** for 30 days post-cutover (not deleted)
- Retain `./exports/firebase` manifest as audit trail

### Rollback triggers

| Condition | Action |
|-----------|--------|
| Registration lookup returns 200 without auth | **Immediate rollback** |
| API 5xx > 1% for 5 minutes | Rollback + investigate |
| Payment webhooks fail 3+ consecutive | Pause registrations; check secrets |

---

# Release Package Index

| Phase | Document |
|-------|----------|
| 1 — Repository | `REPOSITORY_RELEASE_STATUS.md` |
| 2 — Supabase | `SUPABASE_PRODUCTION_SIGNOFF.md` |
| 3 — Vercel | `VERCEL_PRODUCTION_SIGNOFF.md` |
| 4 — Domain | `DOMAIN_SIGNOFF.md` |
| 5 — Security | `SECURITY_RELEASE_GATE.md` |
| 6 — Firebase Exit | `FIREBASE_EXIT_SIGNOFF.md` |
| 7 — Cutover steps | `PRODUCTION_CUTOVER_CHECKLIST.md` |
| 8 — Authorization | `FINAL_GO_LIVE_AUTHORIZATION.md` (this document) |

---

# Re-Authorization Criteria

Grant **GO** when:

1. Production score ≥ **85/100**
2. Live `GET /api/registration/{id}` → **401** without token/email
3. Live sitemap uses `https://www.shikshamahakumbh.com`
4. Supabase registration count matches Firebase export manifest
5. Storage RLS policies applied (`storage` schema > 0)
6. All checklist steps signed off by operator

---

**Authorization:** DENIED — 2026-05-29  
**Next action:** Operator executes `PRODUCTION_CUTOVER_CHECKLIST.md` Steps 1–11.

*No deployment, push, or data migration performed during this audit.*
