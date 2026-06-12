# Final Production Authorization

**Date:** 2026-05-29  
**Platform:** Shiksha Mahakumbh (rase-co-in)  
**Authorization level:** Principal Release Engineer

---

## Decision

# NO GO

Production launch is **not authorized**. Source and Supabase infrastructure prep advanced significantly during this audit; operational cutover remains incomplete.

---

## Production Score: 68 / 100

| Category | Max | Score | Evidence |
|----------|-----|-------|----------|
| Source committed (Firebase Exit + 8 phases) | 15 | 15 | 8 commits on local `main` |
| Build & TypeScript | 10 | 9 | 303 pages, `tsc` pass; SEO UUID warnings |
| Security source + tests | 15 | 15 | 15/15 PASS |
| Supabase schema + seed | 15 | 10 | Migrations OK; RBAC seeded; **0 registrations** |
| Storage + RLS | 10 | 9 | 8 buckets; 55 public RLS; storage.objects pending |
| Domain alignment (source) | 10 | 8 | Source correct; live stale |
| Vercel environment | 10 | 4 | DATABASE_URL/DIRECT_URL missing; SITE_URL wrong live |
| Production deployed | 15 | 0 | Stale ~3-day deploy; live PII leak |
| Data migration penalty | — | **-2** | Import not run (reduced from -7 — tooling ready) |

**GO threshold:** ≥ 85/100

---

## Exact Remaining Blockers (P0)

| # | Blocker | Owner action |
|---|---------|--------------|
| 1 | **Production not redeployed** | `git push` + `npx vercel --prod` from remediated HEAD |
| 2 | **Live registration PII leak** | Resolved by #1 — verify `GET /api/registration/{id}` → **401** |
| 3 | **`DATABASE_URL` / `DIRECT_URL` on Vercel** | Add aliases from POSTGRES_* vars |
| 4 | **`NEXT_PUBLIC_SITE_URL` incorrect on live** | Set to `https://www.shikshamahakumbh.com` + redeploy |
| 5 | **Firebase → Supabase data migration** | Approved export/import; reconcile counter |
| 6 | **`storage.objects` RLS** | Run `storage-production.sql` in Supabase SQL Editor |
| 7 | **Uncommitted cutover fixes** | Commit `award_registrations` RLS fix + deploy helper |
| 8 | **Unpushed commits** | Push 8 remediation commits to remote |

---

## P1 (Post-GO Hardening)

- Remove `FIREBASE_SERVICE_ACCOUNT_JSON` from all Vercel environments
- Sync Preview env vars for staging smoke tests
- Verify Razorpay webhook URL points to production canonical domain
- Resolve Prisma SEO UUID build warnings (legacy CMS data)

---

## Estimated Hours to Production Launch

| Phase | Hours | Notes |
|-------|-------|-------|
| Commit + push cutover fixes | 0.5 | Include RLS typo fix |
| Vercel env (DATABASE_URL, DIRECT_URL, SITE_URL) | 1 | + redeploy trigger |
| Storage RLS via Supabase dashboard | 0.5 | `storage-production.sql` |
| Firebase export + validation | 1–2 | Requires approval + firebase-admin |
| Production import + counter reconcile | 2–3 | Idempotent; monitor errors |
| Post-deploy validation (security, SEO, payments) | 2–3 | Registration 401, sitemap, webhook |
| **Total** | **8–12 hours** | Assumes no import data anomalies |

---

## Rollback Strategy

If post-cutover issues occur within the stabilization window:

### Application (Vercel)

1. **Instant rollback:** Vercel Dashboard → Deployments → promote previous production deployment (`dhe-projects/rase-co-in`, ~2026-06-09 build)
2. **Env rollback:** Restore prior `NEXT_PUBLIC_SITE_URL` and re-enable `FIREBASE_SERVICE_ACCOUNT_JSON` if Firebase still authoritative
3. **DNS:** No DNS change required if rollback is deploy-only

### Database (Supabase)

1. **Do not** run destructive DDL rollback in production
2. If import partially applied: identify imported `registration_id` range; disable new registrations briefly; restore from pre-import snapshot if Supabase PITR available
3. Registration counter: manually set `last_number` to pre-cutover value if ID collision detected

### Data

1. Firebase remains source of truth until import verified — keep Firebase project read-only post-cutover, not deleted, for 30 days
2. Export manifest (`./exports/firebase`) serves as migration audit trail

### Communication

1. Halt new registrations banner if API errors spike
2. Notify ops if registration lookup returns 5xx > 1% for 5 minutes

---

## Safe Work Completed (This Audit)

✅ Storage buckets (8/8) applied via DIRECT_URL  
✅ Public RLS (55 policies) applied  
✅ RLS table name fix (`award_registrations`)  
✅ Full build + security test verification  
✅ Evidence reports generated  
❌ No production deploy  
❌ No git push  
❌ No Firebase import  
❌ No destructive DB operations  

---

## Authorization Statement

**Production launch for Shiksha Mahakumbh is DENIED as of 2026-05-29.**

Re-authorization requires:

1. All P0 blockers cleared with evidence
2. Live registration lookup returns **401** without credentials
3. Live sitemap/robots use `https://www.shikshamahakumbh.com`
4. Supabase registration count matches Firebase export manifest
5. Production score ≥ **85/100**

---

## Report Pack

```
docs/go-live/
├── CUTOVER_READINESS_REPORT.md      ← this audit summary
├── STORAGE_RLS_VERIFICATION.md
├── DOMAIN_CANONICAL_AUDIT.md
├── SECURITY_GATE_VERIFICATION.md
├── SUPABASE_DEPLOYMENT_STATUS.md
├── VERCEL_ENV_VERIFICATION.md
├── DATA_MIGRATION_READINESS.md
└── FINAL_PRODUCTION_AUTHORIZATION.md ← authoritative GO/NO GO
```

---

*Signed: Principal Release Engineer audit — evidence-backed, no automatic deployment.*
