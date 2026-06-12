# Firebase Migration Readiness — Final

**Date:** 2026-05-29  
**Auditor:** Principal Release Engineer  
**Constraint:** No export/import executed

---

## Executive Summary

| Component | Status |
|-----------|--------|
| Export script | ✅ Ready (needs `firebase-admin` temp install) |
| Import script | ✅ Ready |
| Supabase target schema | ✅ Migrations applied |
| Supabase data | ❌ **0 registrations** |
| Counter | ✅ SMK2026 seeded (`lastNumber=1`) |
| Rollback plan | ✅ Documented |

**Migration readiness: TOOLS READY — EXECUTION PENDING**

---

## Export Script Verification

**Command:** `npm run firebase:export -- --out=./exports/firebase`  
**File:** `scripts/firebase-export.mjs`

| Check | Result |
|-------|--------|
| Script exists | ✅ |
| npm script in `package.json` | ✅ |
| Requires `FIREBASE_SERVICE_ACCOUNT_JSON` | ✅ (present on Vercel legacy env) |
| Requires `firebase-admin` package | ⚠️ Not in lockfile — `npm i -D firebase-admin` before run |
| Collections exported | 18 (registrations, counters, conclave, delegate, NGO, volunteer, etc.) |
| Output manifest | `exports/firebase/manifest.json` |

**Not executed.**

---

## Import Script Verification

**Command:** `npm run firebase:import -- --in=./exports/firebase`  
**File:** `scripts/firebase-import-supabase.mjs`

| Check | Result |
|-------|--------|
| Script exists | ✅ |
| Uses Prisma `DATABASE_URL` | ✅ |
| Idempotent on `registrationId` | ✅ skips duplicates |
| Maps 14 collection types | ✅ |
| Output | `import-summary.json` |

**Not executed.**

---

## Supabase Target State (live query 2026-05-29)

| Table / item | Count | Expected post-import |
|--------------|-------|----------------------|
| `registrations` | **0** | Match Firebase export manifest |
| `registration_counters` | SMK2026, `lastNumber=1` | Reconcile to max ID after import |
| `roles` | **4** | Unchanged |
| `permissions` | **18** | Unchanged |
| `payment_records` | 0 | Not migrated by script |
| `uploaded_files` | 0 | Not migrated by script |

```bash
npx prisma migrate status
→ 7 migrations, Database schema is up to date
```

### Target tables exist

`registrations`, subtype tables, `registration_counters`, `payment_records`, `uploaded_files` — all present with RLS enabled on public schema.

---

## Counter Alignment Risk

| Source | Value |
|--------|-------|
| Supabase counter | SMK2026, `lastNumber=1` |
| Live Firebase (via prod API) | SMK2026-000001 exists |

Post-import **must** update `registration_counters.last_number` to max imported suffix to prevent ID collision.

---

## Rollback Plan (documented, not tested)

1. **Do not delete Firebase** — keep read-only 30 days post-cutover
2. **Partial import rollback:**
   ```sql
   DELETE FROM registrations WHERE metadata IS NOT NULL;
   UPDATE registration_counters SET last_number = 1 WHERE prefix = 'SMK2026';
   ```
3. **Re-import:** Idempotent — safe to re-run `firebase:import`
4. **Application rollback:** Promote prior Vercel deployment if API errors spike

---

## Pre-Execution Checklist

- [ ] Stakeholder approval for production Firebase read
- [ ] `npm i -D firebase-admin`
- [ ] Export + record manifest counts
- [ ] Import during maintenance window
- [ ] Reconcile counter
- [ ] Verify row counts
- [ ] Remove `FIREBASE_SERVICE_ACCOUNT_JSON` from Vercel post-verification

---

## Signoff

| Gate | Result |
|------|--------|
| Scripts verified | ✅ PASS |
| Schema ready | ✅ PASS |
| Data migrated | ❌ NOT DONE |
| Rollback documented | ✅ PASS |

---

*Fresh DB queries — 2026-05-29. No migration executed.*
