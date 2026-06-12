# Cutover Ready Signoff

**Date:** 2026-05-29  
**Role:** Production Cutover Engineer  
**Commit:** `6cc96aa` (+ this signoff pack)

---

# Executive Summary

All **local pre-deployment preparation** tasks completed within constraints (no push, no deploy, no migration). Repository is committed and ready to push. Supabase buckets and public RLS verified. Storage object policies require Supabase SQL Editor. Vercel env aliases documented. Firebase migration package prepared but not executed.

**Cutover ready for operator handoff: CONDITIONAL YES**  
**Production GO: NO** — operational steps remain

---

# Score

**68 / 100** (unchanged — launch gates not yet cleared on live)

| Completed this session | Status |
|------------------------|--------|
| Commit all cutover files | ✅ `6cc96aa` |
| Git clean (source) | ✅ After signoff commit |
| Storage buckets verified | ✅ 8/8 |
| Storage RLS | ❌ SQL Editor step |
| Migration package | ✅ Documented, not run |
| Vercel env mapping | ⚠️ Documented, not applied |

---

# Remaining Blockers

| # | Blocker | Owner |
|---|---------|-------|
| 1 | **`git push origin main`** — 9 commits ahead | Operator |
| 2 | **`storage-production.sql`** in Supabase SQL Editor | Operator |
| 3 | **Vercel env:** add `DATABASE_URL`, `DIRECT_URL`; set `NEXT_PUBLIC_SITE_URL` | Operator |
| 4 | **Firebase export/import** (explicit approval) | Operator |
| 5 | **`npx vercel --prod`** redeploy | Operator |
| 6 | **Live verification:** 401 on registration, `.com` sitemap | Post-deploy |
| 7 | Remove **`FIREBASE_SERVICE_ACCOUNT_JSON`** post-migration | Post-cutover |

---

# Exact Commands

## 1. Push (after signoff commit)

```bash
git push origin main
```

**Expected:** Remote `main` includes commits through go-live prep.

## 2. Storage RLS (Supabase Dashboard → SQL Editor)

Paste and run entire file:

```
supabase/policies/storage-production.sql
```

**Verify:**

```sql
SELECT count(*) FROM pg_policies WHERE schemaname = 'storage';
-- Expected: 8
```

## 3. Vercel environment mapping

| Required var | Source / value |
|--------------|----------------|
| `DATABASE_URL` | Copy value of existing `POSTGRES_PRISMA_URL` |
| `DIRECT_URL` | Copy value of existing `POSTGRES_URL_NON_POOLING` |
| `NEXT_PUBLIC_SITE_URL` | `https://www.shikshamahakumbh.com` |

```bash
vercel env add DATABASE_URL production
vercel env add DIRECT_URL production
vercel env rm NEXT_PUBLIC_SITE_URL production
vercel env add NEXT_PUBLIC_SITE_URL production

npx vercel env ls production | findstr "DATABASE_URL DIRECT_URL SITE_URL"
```

**Expected:** All three vars listed for Production.

## 4. Firebase migration (when approved)

```bash
npm i -D firebase-admin
npm run firebase:export -- --out=./exports/firebase
# Review manifest.json counts
npm run firebase:import -- --in=./exports/firebase
# Reconcile registration_counters — see DATA_MIGRATION_EXECUTION_PLAN.md
```

**Expected:** `registrations` count matches export manifest; `import-summary.json` written.

## 5. Deploy (when approved)

```bash
npx prisma migrate deploy
npm run db:seed
npx vercel --prod
```

**Expected:** New deployment ID; build success.

## 6. Post-deploy verification

```bash
curl -s -o /dev/null -w "%{http_code}" \
  "https://www.shikshamahakumbh.com/api/registration/SMK2026-000001"
# Expected: 401

curl -s https://www.shikshamahakumbh.com/sitemap.xml | head -5
# Expected: https://www.shikshamahakumbh.com
```

---

# Expected Results Matrix

| Step | Command / action | Pass criteria |
|------|------------------|---------------|
| Commit | `git status` | Clean working tree |
| Push | `git log origin/main..HEAD` | 0 commits ahead |
| Storage buckets | `SELECT count(*) FROM storage.buckets` | 8 |
| Storage RLS | `SELECT count(*) FROM pg_policies WHERE schemaname='storage'` | 8 |
| Vercel env | `npx vercel env ls production` | DATABASE_URL, DIRECT_URL, SITE_URL present |
| Export | `manifest.json` | Row counts recorded |
| Import | `SELECT count(*) FROM registrations` | Matches export |
| Deploy | `npx vercel ls --prod` | New deploy < 1 hour old |
| Security | Registration GET no auth | HTTP 401 |
| Domain | sitemap.xml | All URLs use `.com` |

---

# Evidence Pack (this session)

| Document | Purpose |
|----------|---------|
| `STORAGE_FINAL_VERIFICATION.md` | Buckets ✅, storage RLS ❌ |
| `DATA_MIGRATION_EXECUTION_PLAN.md` | Export/import runbook |
| `CUTOVER_READY_SIGNOFF.md` | This signoff |
| Commit `6cc96aa` | RLS fix + deploy helper + go-live docs |

Prior signoff pack: `FINAL_GO_LIVE_AUTHORIZATION.md`, `PRODUCTION_CUTOVER_CHECKLIST.md`

---

# Rollback (unchanged)

Promote Vercel deploy `dpl_4LbmLW5RKASduH6dWXoHnrFuNLtt` if post-deploy registration returns 200 without auth or 5xx > 1% for 5 minutes.

---

# Authorization

| Gate | Signoff |
|------|---------|
| Local repo ready to push | ✅ **YES** |
| Supabase infra ready | ⚠️ **CONDITIONAL** (storage policies pending) |
| Migration package ready | ✅ **YES** |
| Vercel env ready | ❌ **NO** (aliases not added) |
| Production GO | ❌ **NO GO** |

**Next action:** Operator executes commands in order above. Full checklist: `PRODUCTION_CUTOVER_CHECKLIST.md`.

---

*No push, deploy, or migration executed — 2026-05-29.*
