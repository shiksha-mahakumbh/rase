# Data Migration Execution Plan

**Date:** 2026-05-29  
**Status:** Ready to execute — **NOT RUN** (awaiting explicit approval)  
**Auditor:** Production Cutover Engineer

---

## Overview

One-time migration from Firebase Firestore to Supabase Postgres using existing scripts. This plan documents verification of tooling, target tables, execution order, and rollback — **no import was executed**.

---

## Script Verification

### Export — `scripts/firebase-export.mjs`

| Check | Status |
|-------|--------|
| npm script | `npm run firebase:export` |
| Entry point | Valid ESM, exits on missing deps |
| Auth | `FIREBASE_SERVICE_ACCOUNT_JSON` (present on Vercel legacy env) |
| Dependency | `firebase-admin` — **not in package.json**; install temporarily |
| Output | `./exports/firebase/*.json` + `manifest.json` |
| Collections | 18 Firestore collections |

**Collections exported:**

```
registrations, registrationCounters, conclave_registrations,
delegate_registrations, RegestrationNGOsm24, RegestrationVolsm24,
ParticipantRegsm24, AbstractSubmissionDataSM24, FullLengthSubmissionDataSM24,
BestPractices, talent, Accommodation2025, organiserregistration,
SchoolProjectFormdata, heiprojectformdata, events, wishesReceived, keynoteSpeakers
```

### Import — `scripts/firebase-import-supabase.mjs`

| Check | Status |
|-------|--------|
| npm script | `npm run firebase:import` |
| Prisma client | Uses `DATABASE_URL` |
| Idempotency | Skips existing `registrationId` |
| Output | `import-summary.json` in export dir |
| Mapped collections | 14 registration-related collections |

**Not imported by script:** `events`, `wishesReceived`, `keynoteSpeakers`, `registrationCounters` (counter handled separately).

---

## Target Supabase Tables — ✅ VERIFIED

| Prisma model | Table | Import target | Current rows |
|--------------|-------|---------------|--------------|
| `Registration` | `registrations` | Primary import table | **0** |
| `RegistrationCounter` | `registration_counters` | Manual reconcile post-import | SMK2026, lastNumber=1 |
| `ConclaveRegistration` | `conclave_registrations` | Not auto-populated by import script | 0 |
| `PaymentRecord` | `payment_records` | Not in import script | 0 |
| `UploadedFile` | `uploaded_files` | Not in import script | 0 |

**Import script behavior:** Creates rows in `registrations` only with `metadata` JSON blob containing full Firestore document. Subtype tables (conclave, delegate, etc.) are **not** populated — legacy data lives in `metadata` field.

### Schema readiness

```bash
npx prisma migrate status
→ 7 migrations, up to date
```

All target tables exist with RLS enabled (55 public policies).

---

## Pre-Execution Checklist

- [ ] Stakeholder approval for production Firebase read
- [ ] Maintenance window communicated
- [ ] `npm i -D firebase-admin` (temporary)
- [ ] `FIREBASE_SERVICE_ACCOUNT_JSON` available locally or pulled from Vercel
- [ ] `DATABASE_URL` / `DIRECT_URL` configured
- [ ] Backup: export manifest row counts recorded before import

---

## Execution Sequence

### Phase A — Export (read-only Firebase)

```bash
npm i -D firebase-admin

# Pull Firebase creds (optional)
npx vercel env pull .env.local

npm run firebase:export -- --out=./exports/firebase
```

**Expected result:**

```
exports/firebase/
├── manifest.json          # row counts per collection
├── registrations.json
├── conclave_registrations.json
└── ... (18 collection files)
```

**Verify:**

```bash
cat exports/firebase/manifest.json
# Record total registration count
```

### Phase B — Pre-import validation

```bash
# Confirm Supabase empty
npx prisma db execute --stdin <<'SQL'
SELECT count(*) AS registrations FROM registrations;
SELECT prefix, last_number FROM registration_counters;
SQL
```

**Expected:** registrations=0, counter SMK2026 last_number=1

### Phase C — Import (requires approval)

```bash
npm run firebase:import -- --in=./exports/firebase
```

**Expected result:**

```
exports/firebase/import-summary.json
# imported/skipped counts per collection
```

**Verify:**

```sql
SELECT count(*) FROM registrations;
SELECT registration_id, registration_type FROM registrations LIMIT 5;
```

### Phase D — Counter reconciliation

After import, set counter to max registration number:

```sql
-- Example: if highest ID is SMK2026-000042
UPDATE registration_counters
SET last_number = 42, updated_at = now()
WHERE prefix = 'SMK2026';
```

Match against live Firebase `registrationCounters` collection from export manifest.

---

## Rollback (import failure)

1. **Do not delete Firebase** — remains source of truth during cutover window
2. If partial import: `DELETE FROM registrations WHERE metadata IS NOT NULL` (only imported legacy rows — verify WHERE clause against test IDs first)
3. Reset counter: `UPDATE registration_counters SET last_number = 1 WHERE prefix = 'SMK2026'`
4. Re-run import after fixing errors (idempotent skip on existing IDs)

---

## Known Limitations

| Limitation | Impact |
|------------|--------|
| Subtype tables not populated | Legacy detail in `metadata` JSON only |
| Files not migrated | `uploaded_files` empty; re-upload or separate migration |
| Payment records not migrated | Historical payments stay in Firebase export JSON |
| Email required for import | Rows without email are skipped |

---

## Post-Migration Verification

```bash
# Count match
node -e "
const m=require('./exports/firebase/manifest.json');
const s=require('./exports/firebase/import-summary.json');
console.log({ manifest: m.collections.registrations?.count, import: s.summary.registrations });
"

# Live API (post-deploy)
curl -s -o /dev/null -w '%{http_code}' \
  'https://www.shikshamahakumbh.com/api/registration/SMK2026-000001'
# Expected: 401 without token
```

---

## Signoff

| Gate | Status |
|------|--------|
| Export script verified | ✅ Ready |
| Import script verified | ✅ Ready |
| Target tables exist | ✅ Ready |
| Production import executed | ❌ **NOT RUN** (by design) |

---

*Scripts reviewed from source; Supabase table counts queried — 2026-05-29. No migration executed.*
