# Cutover Execution Report

**Date:** 2026-06-12  
**Role:** Production Cutover Engineer  
**Platform:** Shiksha Mahakumbh (`dhe-projects/rase-co-in`)  
**Git ref deployed:** `a0e2c08` (origin/main)  
**Production deployment:** `dpl_FZMihrmetbpUJfEHZKamsiizjMvq`  
**Inspector:** https://vercel.com/dhe-projects/rase-co-in/FZMihrmetbpUJfEHZKamsiizjMvq

---

## Executive Summary

Final production cutover was **partially executed**. Application deploy, Vercel env alignment, Firebase export/import, and live security/SEO verification **passed**. **Storage RLS policies remain unapplied (0/8)** — this is the sole remaining P0 infrastructure blocker.

| Task | Status | Evidence |
|------|--------|----------|
| 1. Storage RLS (8 policies) | ❌ **FAIL** | `pg_policies` schema `storage` → **0** |
| 2. Vercel `DATABASE_URL` + `DIRECT_URL` | ✅ **PASS** | `npx vercel env ls production` |
| 3. `NEXT_PUBLIC_SITE_URL` = `.com` | ✅ **PASS** | Set via cutover script; live sitemap/robots/canonical |
| 4. Firebase migration | ✅ **PASS** | Export + import completed |
| 5. Data import verification | ⚠️ **PARTIAL** | Registrations ✅; payments/files N/A by design |
| 6. Deploy main → Production | ✅ **PASS** | New deploy ~6m old at verification |
| 7. Post-deploy security probes | ✅ **PASS** | Registration 401; webhook 401 unsigned |
| 8. Registration lookup without auth | ✅ **PASS** | HTTP **401** both hostnames |
| 9. SEO domain alignment | ✅ **PASS** | Sitemap, robots, canonical, OG, JSON-LD → `.com` |
| 10. Razorpay webhook flow | ✅ **PASS** (partial) | Unsigned POST → **401** `Invalid signature` |
| 11. Reports generated | ✅ **PASS** | This document + security + authorization |

---

## Task 1 — Storage RLS

**Expected:** 8 policies on `storage.objects`  
**Actual:** **0** policies

```json
{
  "storageCount": [{ "n": 0 }],
  "publicCount": [{ "n": 55 }],
  "buckets": [{ "n": 8 }]
}
```

**Attempt:** `node scripts/apply-deploy-production.mjs --rls-only`  
**Result:** `ERROR: must be owner of table objects` on `storage-production.sql`

**Required operator action:** Supabase Dashboard → SQL Editor → run `supabase/policies/storage-production.sql` (8 policies: 6 deny + 1 public read + 1 admin read).

---

## Task 2–3 — Vercel Production Environment

Executed `node scripts/_cutover-vercel-env.mjs`:

| Variable | Production | Notes |
|----------|------------|-------|
| `DATABASE_URL` | ✅ Present | Added 2026-06-12 |
| `DIRECT_URL` | ✅ Present | Added 2026-06-12 |
| `NEXT_PUBLIC_SITE_URL` | ✅ Present | Set to `https://www.shikshamahakumbh.com` |

Legacy `FIREBASE_SERVICE_ACCOUNT_JSON` remains on Production/Preview/Development (post-cutover cleanup recommended).

---

## Task 4–5 — Firebase Migration

### Export

```bash
npm run firebase:export -- --out=./exports/firebase
```

**Fix applied (migration blocker):** `firebase-export.mjs` — ESM imports via `firebase-admin/app` + named database `"default"`.

| Collection | Exported |
|------------|----------|
| registrations | 1 |
| registrationCounters | 1 |
| conclave_registrations | 1 |
| All others | 0 |

Artifact: `exports/firebase/manifest.json`

### Import

```bash
npm run firebase:import -- --in=./exports/firebase
```

| Collection | Imported | Skipped | Reason |
|------------|----------|---------|--------|
| registrations | 1 | 0 | — |
| conclave_registrations | 0 | 1 | Duplicate `registrationId` (same SMK2026-000001) |
| All others | 0 | 0 | Empty export |

Artifact: `exports/firebase/import-summary.json`

### Post-import Supabase counts

| Table | Count | Expected |
|-------|-------|----------|
| `registrations` | **1** | Match Firebase master export |
| `payment_records` | **0** | Not migrated by script (documented) |
| `uploaded_files` | **0** | Not migrated by script (documented) |
| `registration_counters` | SMK2026, `lastNumber=1` | Matches max ID `SMK2026-000001` ✅ |

---

## Task 6 — Production Deploy

```bash
git fetch origin main   # → a0e2c08
npx vercel --prod --yes
```

| Field | Value |
|-------|-------|
| Deployment ID | `dpl_FZMihrmetbpUJfEHZKamsiizjMvq` |
| URL | `https://rase-co-87o889e5v-dhe-projects.vercel.app` |
| Aliased | `https://www.rase.co.in` |
| Build duration | ~5m |
| Prior production | ~3 days old (`dpl_4LbmLW5RKASduH6dWXoHnrFuNLtt` rollback target) |

---

## Task 7–10 — Live Verification Summary

Probe timestamp: **2026-06-12T17:05:47Z** (`scripts/_post-deploy-probes.mjs`)

| Probe | www.shikshamahakumbh.com | www.rase.co.in |
|-------|--------------------------|----------------|
| `GET /api/registration/SMK2026-000001` | **401** | **401** |
| PII in response body | None | None |
| `/sitemap.xml` loc hosts | `shikshamahakumbh.com` | `shikshamahakumbh.com` |
| `/robots.txt` Sitemap | `https://www.shikshamahakumbh.com/sitemap.xml` | Same |
| `POST /api/payments/razorpay-webhook` `{}` | **401** Invalid signature | **401** |

### SEO metadata (homepage)

| Surface | Value |
|---------|-------|
| Canonical | `https://www.shikshamahakumbh.com` |
| OG URL | `https://www.shikshamahakumbh.com` |
| JSON-LD URLs | All `https://www.shikshamahakumbh.com/...` |

Sitemap `lastmod`: **2026-06-12** (confirms fresh deploy).

---

## Local Test Suite (pre/post cutover)

```bash
npm run test:security  → 15/15 PASS
```

---

## Script / Code Changes During Cutover

| File | Change | Rationale |
|------|--------|-----------|
| `scripts/firebase-export.mjs` | ESM import fix + `.env.local` load + named Firestore DB | Migration blocker (export failed without fix) |

No application business logic (`src/`) modified.

---

## Rollback Recommendation

If live registration returns **200 without auth**, or 5xx > 1% for 5 minutes:

1. Vercel Dashboard → Promote `dpl_4LbmLW5RKASduH6dWXoHnrFuNLtt` (~2026-06-09)
2. Restore prior env if needed
3. Database partial rollback:
   ```sql
   DELETE FROM registrations WHERE metadata IS NOT NULL;
   UPDATE registration_counters SET last_number = 1 WHERE prefix = 'SMK2026';
   ```
4. Keep Firebase read-only 30 days

**Current status:** Rollback **not required** — live security gates pass on new deploy.

---

## Remaining Operator Actions

1. **P0:** Apply `supabase/policies/storage-production.sql` in Supabase SQL Editor → re-query until storage policies = **8**
2. **P1:** Remove `FIREBASE_SERVICE_ACCOUNT_JSON` from Vercel after 48h observation
3. **P2:** Razorpay Dashboard — send signed test webhook event; confirm `payment_records` update
4. **P2:** Commit migration script fixes to `main` if desired

---

*Cutover executed 2026-06-12. Evidence: live HTTP probes, Supabase queries, Vercel CLI, export/import artifacts.*
