# Final Release Authorization V2

**Date:** 2026-05-29  
**Role:** Principal Release Engineer  
**Platform:** Shiksha Mahakumbh  
**Audit scope:** Phases 1–8 (fresh evidence, no prior report assumed)

---

# Executive Summary

Remediation code is complete and pushed to GitHub (`a0e2c08`). Build and automated tests pass. **Production launch is NOT authorized.** Live production remains on a stale deploy with active PII exposure, wrong canonical domain, incomplete Vercel env, missing storage RLS, and empty Supabase registration data.

---

# Production Readiness Score

## **56 / 100 — NO GO**

(GO threshold: ≥ 85/100)

| Phase | Area | Max | Score | Evidence |
|-------|------|-----|-------|----------|
| 1 | Repository | 10 | 9 | Clean tree; `0dd6736` unpushed locally |
| 1 | Build + tests | 10 | 10 | 25/25 PASS |
| 2 | Supabase infra | 15 | 11 | 8 buckets, 55 RLS; 0 storage RLS; 0 data |
| 3 | Vercel env | 10 | 4 | DATABASE_URL/DIRECT_URL missing |
| 4 | Domain (live) | 10 | 0 | All surfaces `rase.co.in` |
| 4 | Domain (source) | 5 | 5 | Fallback `.com` correct |
| 5 | Security (source) | 15 | 15 | 15/15 tests |
| 5 | Security (live) | 15 | 0 | 200 + PII without auth |
| 6 | Data migration | 10 | 2 | Scripts ready; not executed |
| 7 | Production deploy | 10 | 0 | ~3-day-old deploy |

---

# GO / NO GO

# **NO GO**

Production cutover is **denied** until all P0 blockers below are cleared with live verification evidence.

---

# Exact Remaining Blockers (P0)

| # | Blocker | Phase | Verification |
|---|---------|-------|--------------|
| 1 | **Live registration PII leak** — HTTP 200 without auth | 5 | `GET /api/registration/SMK2026-000001` → must be **401** |
| 2 | **Stale production deploy** — not from current HEAD | 7 | `npx vercel ls --prod` → new deploy |
| 3 | **`DATABASE_URL` missing** on Vercel | 3, 7 | `npx vercel env ls production` |
| 4 | **`DIRECT_URL` missing** on Vercel | 3, 7 | Same |
| 5 | **`NEXT_PUBLIC_SITE_URL` wrong** — live SEO uses `rase.co.in` | 4, 7 | Sitemap/robots/canonical probes |
| 6 | **Storage RLS 0/8** — `storage.objects` policies not applied | 2, 7 | SQL Editor required |
| 7 | **Firebase → Supabase import not executed** — 0 registrations | 6 | Row count match manifest |
| 8 | **Counter reconciliation** post-import | 6 | `last_number` ≥ max ID |
| 9 | **Push verification docs** — `0dd6736` local only | 1 | Optional: `git push` |

---

# Ordered Cutover Sequence

1. **Supabase SQL Editor** — run `supabase/policies/storage-production.sql` → verify storage policies = 8
2. **Vercel env** — add `DATABASE_URL`, `DIRECT_URL`; set `NEXT_PUBLIC_SITE_URL=https://www.shikshamahakumbh.com`
3. **Firebase export** — `npm run firebase:export` (with approval + `firebase-admin`)
4. **Firebase import** — `npm run firebase:import` → verify row counts
5. **Counter update** — align `registration_counters.last_number`
6. **Deploy** — `npx vercel --prod`
7. **Live verify** — registration 401, sitemap `.com`, Supabase rows > 0
8. **48-hour observation** — monitor 5xx, PII leak, webhooks
9. **Cleanup** — remove `FIREBASE_SERVICE_ACCOUNT_JSON`; sync Preview env

Full commands: `docs/go-live/FINAL_DEPLOYMENT_SEQUENCE.md`

---

# Rollback Sequence

1. **Vercel:** Dashboard → Promote prior production deployment (~2026-06-09)
2. **Env:** Restore prior `NEXT_PUBLIC_SITE_URL` if changed
3. **Database:** No destructive DDL; partial import rollback:
   ```sql
   DELETE FROM registrations WHERE metadata IS NOT NULL;
   UPDATE registration_counters SET last_number = 1 WHERE prefix = 'SMK2026';
   ```
4. **Firebase:** Keep read-only 30 days — do not delete
5. **Trigger immediate rollback if:** registration lookup returns 200 without auth post-deploy

---

# Phase Evidence Index

| Phase | Report |
|-------|--------|
| 1 | `REPOSITORY_FINAL_VERIFICATION.md` |
| 2 | `STORAGE_RLS_FINAL_VERIFICATION.md` |
| 3 | `VERCEL_ENV_FINAL_VERIFICATION.md` |
| 4 | `DOMAIN_FINAL_VERIFICATION.md` |
| 5 | `SECURITY_FINAL_VERIFICATION.md` |
| 6 | `FIREBASE_MIGRATION_READINESS_FINAL.md` |
| 7 | `DEPLOYMENT_EXECUTION_FINAL.md` |
| 8 | `FINAL_RELEASE_AUTHORIZATION_V2.md` (this document) |

---

# Estimated Hours to Production Launch

| Phase | Hours |
|-------|-------|
| Storage RLS (SQL Editor) | 0.5 |
| Vercel env + redeploy | 1.5 |
| Firebase export/import + counter | 2–4 |
| Post-deploy verification | 2 |
| 48-hour observation (passive) | 48 wall-clock |
| **Active operator time** | **6–8 hours** |

---

# Recommended Next Operator Action

**Apply storage RLS in Supabase SQL Editor** (15 minutes, unblocks infra signoff), then **configure Vercel `DATABASE_URL`, `DIRECT_URL`, and `NEXT_PUBLIC_SITE_URL`** and **trigger production redeploy**. Do not proceed with public traffic cutover until live registration endpoint returns **401** without credentials.

---

**Authorization:** DENIED — 2026-05-29  
**Next reassessment:** After deploy + live verification gates pass.

---

*Aggregated from fresh Phases 1–8 evidence. No production modifications performed during this audit.*
