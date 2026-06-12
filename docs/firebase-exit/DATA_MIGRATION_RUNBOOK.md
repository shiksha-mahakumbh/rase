# Data Migration Runbook (Phase F5)

**Date:** 2026-06-11  
**Objective:** Export Firestore + Firebase Storage → Import Supabase Postgres + Storage  
**Constraint:** **No production migration executed** — runbook only

---

## Prerequisites

- [ ] Staging Supabase project with all Prisma migrations applied (7/7)
- [ ] `REGISTRATION_BACKEND=supabase` on staging
- [ ] F1 auth migration complete (admin users in `users` table)
- [ ] F4 RLS policies deployed to staging
- [ ] Maintenance window scheduled
- [ ] Full Firestore + Storage backup taken

---

## Phase 1 — Export Firestore

### 1.1 Collections to export

| Collection | Priority | Target table |
|------------|----------|--------------|
| `registrations` | **P0** | `registrations` + type extensions |
| `registrationCounters` | **P0** | `registration_counters` |
| `paymentRecords` | **P0** | `payment_records` |
| `adminUsers` | **P1** | `users` + `user_roles` |
| `audit_logs` | **P2** | `audit_logs` |
| `accommodationRequests` | **P2** | `accommodation_requests` |

### 1.2 Export methods

**Option A — Firebase Admin SDK script (recommended)**

```bash
# Create: scripts/firebase-exit/export-firestore.mjs (not yet implemented)
node scripts/firebase-exit/export-firestore.mjs \
  --project shiksha-mahakumbh-abhiyan \
  --collections registrations,registrationCounters,paymentRecords \
  --output ./migration-data/firestore-export.jsonl
```

**Option B — `gcloud firestore export`**

```bash
gcloud firestore export gs://<backup-bucket>/firestore-export-$(date +%Y%m%d) \
  --project=shiksha-mahakumbh-abhiyan
```

**Option C — Existing audit script**

```bash
node scripts/production-registration-audit.mjs
# Produces sample data + counts — use for validation, not full export
```

### 1.3 Export validation

| Check | Gate |
|-------|------|
| Total registration count | Match Firebase Console |
| Max `registrationId` | Record for counter sync |
| Sample doc has all required fields | Schema mapping test |
| Export file checksum | Store SHA-256 |

---

## Phase 2 — Export Firebase Storage

### 2.1 List objects

```bash
# Pseudocode script: scripts/firebase-exit/export-storage-manifest.mjs
# Uses firebase-admin listAll() on bucket
# Output: migration-data/storage-manifest.json
# [{ "firebasePath": "registrations/NGO/abc.pdf", "size": 12345, "contentType": "application/pdf" }]
```

### 2.2 Download files

```bash
# Parallel download to local staging
node scripts/firebase-exit/download-storage.mjs \
  --manifest ./migration-data/storage-manifest.json \
  --output ./migration-data/files/
```

**Do not delete Firebase Storage objects until validation complete.**

---

## Phase 3 — Transform

### 3.1 Registration transform

```bash
node scripts/firebase-exit/transform-registrations.mjs \
  --input ./migration-data/firestore-export.jsonl \
  --output ./migration-data/registrations-import.jsonl
```

**Transform rules:**

| Rule | Detail |
|------|--------|
| Preserve `registrationId` | No regeneration |
| Map `registrationType` | Use `toPrismaRegistrationType` logic |
| Set `source` | `'migration'` |
| Set `firebaseMasterDocId` | Original Firestore doc ID |
| Timestamps | Firestore Timestamp → ISO 8601 |
| Unknown fields | Store in `metadata` JSON |

### 3.2 Counter sync

```javascript
// After import
const maxNum = await prisma.registration.findFirst({
  where: { registrationId: { startsWith: 'SMK2026-' } },
  orderBy: { registrationId: 'desc' },
});
// Upsert registration_counters.lastNumber = parsed max
```

### 3.3 Storage path remap

| Firebase path | Supabase path |
|---------------|---------------|
| `registrations/{type}/{file}` | `registrations/{type_lower}/{regId}/{file}` |

---

## Phase 4 — Import Supabase Postgres

### 4.1 Import order (FK dependencies)

```
1. registration_counters
2. registrations (master)
3. type extension tables (conclave, volunteer, ngo, etc.)
4. uploaded_files (with storage paths)
5. payment_records
6. webhook_events (if exported)
7. audit_logs (optional)
```

### 4.2 Import script

```bash
# Create: scripts/firebase-exit/import-to-supabase.mjs
node scripts/firebase-exit/import-to-supabase.mjs \
  --input ./migration-data/registrations-import.jsonl \
  --dry-run   # first pass

node scripts/firebase-exit/import-to-supabase.mjs \
  --input ./migration-data/registrations-import.jsonl \
  --execute   # second pass after dry-run review
```

**Use Prisma transactions** — batch size 100, rollback on error.

### 4.3 Idempotency

| Key | Strategy |
|-----|----------|
| `registrationId` | `upsert` on unique constraint |
| `firebaseMasterDocId` | Skip if already imported |
| `payment_records.razorpayPaymentId` | Unique — skip duplicates |

---

## Phase 5 — Import Supabase Storage

```bash
node scripts/firebase-exit/upload-to-supabase-storage.mjs \
  --manifest ./migration-data/storage-manifest.json \
  --files ./migration-data/files/ \
  --bucket registrations
```

**After upload:** Update `uploaded_files.storage_path` and regenerate signed URLs.

---

## Phase 6 — Validation

### Count reconciliation

| Metric | Firestore | Postgres | Match? |
|--------|-----------|----------|:------:|
| Total registrations | | | |
| By type (Conclave, Volunteer, etc.) | | | |
| Paid count | | | |
| Files with attachments | | | |

### Spot checks (minimum 10)

- [ ] Random registration: all fields match
- [ ] Razorpay order ID links correctly
- [ ] File download works via signed URL
- [ ] Counter generates next ID without collision
- [ ] Anonymous lookup returns 401
- [ ] Token lookup returns correct summary

### Scripts

```bash
node scripts/staging-db-check.mjs
node scripts/staging-security-check.mjs
```

---

## Rollback plan

| Scenario | Action |
|----------|--------|
| Import fails mid-batch | Transaction rollback; fix transform; re-run |
| Validation mismatch | Keep Firebase live; `REGISTRATION_BACKEND=firebase` |
| Post-cutover issues | Flip env back to `firebase`; Firebase data untouched |

**Firebase data is never deleted in this runbook.**

---

## Timeline estimate

| Phase | Duration |
|-------|----------|
| Export Firestore + Storage | 2-4 hours |
| Transform + dry-run import | 2-3 hours |
| Staging import + validation | 3-4 hours |
| Production import (future) | 4-6 hours + soak |

---

## Scripts to implement (F5 deliverables)

| Script | Purpose |
|--------|---------|
| `scripts/firebase-exit/export-firestore.mjs` | Full collection export |
| `scripts/firebase-exit/export-storage-manifest.mjs` | Storage inventory |
| `scripts/firebase-exit/download-storage.mjs` | File download |
| `scripts/firebase-exit/transform-registrations.mjs` | Field mapping |
| `scripts/firebase-exit/import-to-supabase.mjs` | Prisma batch import |
| `scripts/firebase-exit/upload-to-supabase-storage.mjs` | Storage upload |
| `scripts/firebase-exit/validate-migration.mjs` | Count + spot check |

---

**No production migration executed.**
