# Firebase Migration Execution Guide

**Date:** 2026-05-29  
**Role:** Production Release Commander  
**Scripts:** `npm run firebase:export` / `npm run firebase:import`  
**Constraint:** Do not run migration during documentation — operator executes with explicit approval

---

## Overview

One-time migration from Firebase Firestore to Supabase Postgres. Export is read-only on Firebase. Import writes to `registrations` table via Prisma.

| Phase | Risk | Reversible |
|-------|------|------------|
| Export | Read-only Firebase | Yes — no writes |
| Import | Writes Supabase | Partial — see rollback |

---

## Prerequisites

- [ ] Stakeholder approval for production Firebase read
- [ ] `FIREBASE_SERVICE_ACCOUNT_JSON` available (Vercel legacy env or local `.env`)
- [ ] `DATABASE_URL` configured locally (Supabase pooler)
- [ ] Supabase schema migrated (`npx prisma migrate status` → up to date)
- [ ] RBAC seeded (`npm run db:seed`)
- [ ] Temporary dependency: `firebase-admin`

```bash
npm i -D firebase-admin
```

---

## Phase 1 — Export Sequence

### Command

```bash
npm run firebase:export -- --out=./exports/firebase
```

### What it does

1. Loads `FIREBASE_SERVICE_ACCOUNT_JSON` from environment
2. Connects to Firestore via `firebase-admin`
3. Exports 18 collections to JSON files
4. Writes `manifest.json` with row counts

### Collections exported

```
registrations
registrationCounters
conclave_registrations
delegate_registrations
RegestrationNGOsm24
RegestrationVolsm24
ParticipantRegsm24
AbstractSubmissionDataSM24
FullLengthSubmissionDataSM24
BestPractices
talent
Accommodation2025
organiserregistration
SchoolProjectFormdata
heiprojectformdata
events
wishesReceived
keynoteSpeakers
```

### Expected console output

```
exported registrations: N docs
exported registrationCounters: N docs
exported conclave_registrations: N docs
...
export complete: /path/to/exports/firebase
```

### Expected filesystem

```
exports/firebase/
├── manifest.json
├── registrations.json
├── conclave_registrations.json
├── delegate_registrations.json
├── RegestrationNGOsm24.json
├── RegestrationVolsm24.json
├── ParticipantRegsm24.json
├── AbstractSubmissionDataSM24.json
├── FullLengthSubmissionDataSM24.json
├── BestPractices.json
├── talent.json
├── Accommodation2025.json
├── organiserregistration.json
├── SchoolProjectFormdata.json
├── heiprojectformdata.json
├── events.json
├── wishesReceived.json
└── keynoteSpeakers.json
```

### Export validation

```bash
# View manifest
cat exports/firebase/manifest.json
```

**Expected structure:**

```json
{
  "exportedAt": "2026-05-29T...",
  "collections": {
    "registrations": { "count": 123, "file": "registrations.json" },
    "conclave_registrations": { "count": 45, "file": "conclave_registrations.json" }
  }
}
```

**Record these counts** — they are the acceptance criteria for import.

---

## Phase 2 — Pre-Import Validation

Confirm Supabase is empty (or note existing rows):

```bash
npx prisma db execute --stdin --schema prisma/schema.prisma <<'SQL'
SELECT count(*) AS registrations FROM registrations;
SELECT prefix, last_number FROM registration_counters;
SQL
```

**Expected (pre-import):**

| registrations | prefix | last_number |
|---------------|--------|-------------|
| 0 | SMK2026 | 1 |

---

## Phase 3 — Import Sequence

### Command

```bash
npm run firebase:import -- --in=./exports/firebase
```

### What it does

For each collection in `COLLECTION_TYPE_MAP`:

| Collection | Registration type |
|------------|-------------------|
| `registrations` | Legacy_Other |
| `conclave_registrations` | Conclave |
| `delegate_registrations` | Delegate |
| `RegestrationNGOsm24` | NGO |
| `RegestrationVolsm24` | Volunteer |
| `ParticipantRegsm24` | Delegate |
| `AbstractSubmissionDataSM24` | Legacy_Other |
| `FullLengthSubmissionDataSM24` | Legacy_Other |
| `BestPractices` | Best_Practices |
| `talent` | Talent |
| `Accommodation2025` | Accommodation |
| `organiserregistration` | Legacy_Other |
| `SchoolProjectFormdata` | Participant |
| `heiprojectformdata` | Exhibition |

**Skip conditions:** missing file, duplicate `registrationId`, missing email.

**Not imported:** `events`, `wishesReceived`, `keynoteSpeakers`, `registrationCounters` (handle counter separately).

### Expected console output

```
registrations { imported: N, skipped: M }
conclave_registrations { imported: N, skipped: M }
delegate_registrations { imported: N, skipped: M }
...
```

### Expected artifact

```
exports/firebase/import-summary.json
```

```json
{
  "importedAt": "2026-05-29T...",
  "summary": {
    "registrations": { "imported": 100, "skipped": 5 },
    "conclave_registrations": { "imported": 40, "skipped": 2 }
  }
}
```

---

## Phase 4 — Row-Count Validation

### SQL validation

```sql
-- Total imported rows
SELECT count(*) AS total FROM registrations;

-- By type
SELECT registration_type, count(*) AS n
FROM registrations
GROUP BY registration_type
ORDER BY n DESC;

-- Sample rows
SELECT registration_id, registration_type, email, created_at
FROM registrations
ORDER BY created_at DESC
LIMIT 5;
```

### Cross-check against manifest

```bash
node -e "
const m = require('./exports/firebase/manifest.json');
const s = require('./exports/firebase/import-summary.json');
const cols = ['registrations','conclave_registrations','delegate_registrations'];
for (const c of cols) {
  console.log(c, {
    exported: m.collections[c]?.count,
    imported: s.summary[c]?.imported,
    skipped: s.summary[c]?.skipped
  });
}
"
```

**Pass criteria:**

| Check | Rule |
|-------|------|
| Total imported | `imported + skipped` ≈ manifest count per collection |
| Skipped (duplicates) | 0 on first run |
| Skipped (no email) | Document count; investigate if high |
| Known live ID | `SMK2026-000001` exists in `registrations` |

### Counter reconciliation

After import, align counter with highest registration number:

```sql
-- Find max numeric suffix
SELECT registration_id FROM registrations
WHERE registration_id LIKE 'SMK2026-%'
ORDER BY registration_id DESC LIMIT 1;

-- Update counter (example: max is SMK2026-000042)
UPDATE registration_counters
SET last_number = 42, updated_at = now()
WHERE prefix = 'SMK2026';
```

Cross-reference `registrationCounters.json` from export manifest.

---

## Phase 5 — Post-Import Verification

```bash
# Confirm row accessible via API (post-deploy only)
curl -s -o /dev/null -w "%{http_code}" \
  "https://www.shikshamahakumbh.com/api/registration/SMK2026-000001"
# Expected: 401 (no token)

curl -s -o /dev/null -w "%{http_code}" \
  "https://www.shikshamahakumbh.com/api/registration/SMK2026-000001?token=VALID_TOKEN"
# Expected: 200 with NO email/phone in body
```

---

## Rollback Procedure

### If import fails mid-run

1. **Stop import** — Ctrl+C
2. **Do not delete Firebase** — remains source of truth
3. Review `import-summary.json` for partial progress

### Remove imported rows (use with caution)

```sql
-- Preview count first
SELECT count(*) FROM registrations WHERE metadata IS NOT NULL;

-- Remove only Firebase-imported rows (metadata populated)
DELETE FROM registrations WHERE metadata IS NOT NULL;
```

**Expected:** Row count returns to 0.

### Reset counter

```sql
UPDATE registration_counters
SET last_number = 1, updated_at = now()
WHERE prefix = 'SMK2026';
```

### Re-import

Import is idempotent on `registrationId` — safe to re-run after fixing errors:

```bash
npm run firebase:import -- --in=./exports/firebase
```

---

## Known Limitations

| Limitation | Impact |
|------------|--------|
| Subtype tables empty | Detail stored in `metadata` JSON only |
| Files not migrated | `uploaded_files` stays empty |
| Payments not migrated | `payment_records` stays empty |
| CMS collections exported but not imported | events/speakers/wishes remain in JSON only |

---

## Signoff Checklist

- [ ] `manifest.json` recorded with row counts
- [ ] `import-summary.json` generated
- [ ] SQL row counts match expectations
- [ ] `registration_counters.last_number` reconciled
- [ ] Export directory retained as audit trail (do not commit to git)

---

*Scripts reviewed from source — no export or import executed — 2026-05-29.*
