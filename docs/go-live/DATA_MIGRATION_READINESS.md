# G1 — Data Migration Readiness

**Audit date:** 2026-06-12  
**Constraint:** Scripts reviewed only — **not executed**

---

## Scripts audited

| Script | Purpose | Status |
|--------|---------|--------|
| `scripts/firebase-export.mjs` | Firestore → JSON | Implemented |
| `scripts/firebase-import-supabase.mjs` | JSON → Prisma `Registration` | Implemented |
| `docs/firebase-exit/DATA_MIGRATION_RUNBOOK.md` | Full runbook | Exists (partially outdated paths) |

---

## Target Supabase state (live read-only probe)

Connected database: `db.rcpbfrauyyyorptckrlp.supabase.co`  
Prisma migrate status: **7/7 applied, schema up to date**

| Table | Row count (2026-06-12) | Expected at cutover |
|-------|------------------------|---------------------|
| `registrations` | **0** | Firestore production count |
| `payment_records` | **0** | Firestore payment count |
| `uploaded_files` | **0** | Storage manifest count |
| `registration_counters` | **0 rows** | Must match `SMK2026` counter |

**Critical finding:** Production Supabase Postgres is **empty**. No cutover has occurred.

---

## Export script coverage

### Included collections

`registrations`, `registrationCounters`, type-specific legacy collections (NGO, Volunteer, papers, etc.), CMS-ish (`events`, `wishesReceived`, `keynoteSpeakers`).

### Gaps vs runbook

| Gap | Severity |
|-----|----------|
| No dedicated `paymentRecords` export collection | **P0** — payments not in export list |
| No `adminUsers` → `users` / `user_roles` export | **P1** |
| No Firebase Storage object export / manifest | **P0** — attachments orphaned after DB-only import |
| No `audit_logs` export | **P2** |
| Requires temporary `firebase-admin` install | Documented |

---

## Import script analysis

### What it does

- Maps 14 collection JSON files → `Registration.registrationType`
- Idempotent skip when `registrationId` already exists
- Stores full Firestore doc in `Registration.metadata` JSON
- Sets defaults for payment/accommodation status (`Not_Required`, `Submitted`)

### What it does **not** do

| Gap | Impact |
|-----|--------|
| **No `PaymentRecord` import** | Razorpay history lost; webhook dedup weakened |
| **No `UploadedFile` rows** | File URLs in metadata only; no signed-url pipeline |
| **No type extension tables** | `ConclaveRegistration`, `DelegateRegistration`, etc. not populated |
| **No counter sync** | `registrationCounters` export ignored by import script |
| **No `firebaseMasterDocId` / `source=migration` fields set** | Traceability reduced |
| **Synthetic IDs** when `registrationId` missing | `LEGACY-{collection}-{docId}` — may break user-facing lookups |
| **Skips rows without email** | Silent data loss for incomplete legacy docs |
| **No transaction/batch** | Large imports slow; partial failure possible |

### ID preservation

| ID type | Preserved? |
|---------|------------|
| Public `registrationId` (SMK2026-*) | Yes, if present in export doc |
| Firestore document ID | Only inside `metadata.id` |
| Prisma UUID (`Registration.id`) | **New** on import |
| Payment Razorpay IDs | **Not imported** |

### Foreign keys

Import creates flat `Registration` rows only. Relations to `payment_records`, `uploaded_files`, and type-specific tables are **not wired**.

---

## Rollback strategy

| Scenario | Rollback |
|----------|----------|
| Pre-cutover (Firebase still live) | Do not switch DNS/env; no rollback needed |
| Post-import, pre-traffic switch | `DELETE FROM registrations WHERE source = 'migration'` (after adding source flag); restore counter from export |
| Post-cutover with dual-write failure | **No automated rollback** — requires Firestore backup restore + redeploy previous build |
| Storage migration failure | Re-point URLs to Firebase Storage until re-upload completes |

**Recommendation:** Take Firestore + Storage backup; run import on **staging** clone first; validate counts ±0.1%.

---

## G1 readiness checklist

| Item | Ready? |
|------|--------|
| Export script exists | ✅ |
| Import script exists | ✅ |
| Payment migration path | ❌ |
| Attachment/storage migration path | ❌ |
| Counter sync | ❌ |
| Staging dry-run completed | ❌ |
| Production Supabase has data | ❌ |

**G1 verdict:** **NOT READY** — scripts are MVP; runbook gaps remain; production DB empty.
