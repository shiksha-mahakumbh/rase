# Supabase Production Signoff

**Date:** 2026-05-29  
**Connection:** DIRECT_URL (port 5432)

---

## Executive Summary

| Component | Target | Actual | Status |
|-----------|--------|--------|--------|
| Storage buckets | 8 | **8** | ✅ |
| Public RLS policies | ≥ 55 | **55** | ✅ |
| Storage RLS (`storage.objects`) | Applied | **0** | ❌ Pending |
| RBAC roles | 4 | **4** | ✅ |
| Permissions | 18 | **18** | ✅ |
| Registration counter | SMK2026 | **SMK2026, lastNumber=1** | ✅ |
| Production data | Migrated | **0 rows** | ❌ Import pending |

---

## Storage Buckets — ✅ PASS

| id | public |
|----|--------|
| brochures | false |
| committee | false |
| downloads | true |
| media | true |
| papers | false |
| receipts | false |
| registrations | false |
| resumes | false |

Applied via `supabase/sql/001_storage_buckets.sql` + DIRECT_URL.

---

## RLS Policies — ⚠️ PARTIAL

| Schema | Count | Status |
|--------|-------|--------|
| `public` | **55** | ✅ Meets ≥55 target |
| `storage` | **0** | ❌ `storage-production.sql` not applied |

### `storage-production.sql` status: **PENDING**

Last apply attempt error:

```
ERROR: must be owner of table objects
```

**Resolution:** Run `supabase/policies/storage-production.sql` in **Supabase Dashboard → SQL Editor** (elevated ownership context).

Until applied: uploads remain service-role-only via Next.js (acceptable short-term; not full signoff).

---

## Registration Tables — ✅ SCHEMA READY

Tables present and RLS-enabled (public policies):

- `registrations`, `registration_counters`, `registration_status_history`
- `conclave_registrations`, `delegate_registrations`, `exhibition_registrations`
- `award_registrations`, `best_practice_registrations`, `olympiad_registrations`
- `talent_registrations`, `ngo_registrations`, `participant_registrations`

**Row count:** 0 (Firebase import not executed)

---

## Payment Tables — ✅ SCHEMA READY

| Table | Rows | RLS |
|-------|------|-----|
| `payment_records` | 0 | ✅ Admin + deny policies |
| `webhook_events` | 0 | ✅ Admin + deny policies |

---

## Uploaded Files — ✅ SCHEMA READY

| Table | Rows | RLS |
|-------|------|-----|
| `uploaded_files` | 0 | ✅ Deny anon + admin policies |

---

## RBAC Tables — ✅ SEEDED

| Table | Count |
|-------|-------|
| `roles` | 4 |
| `permissions` | 18 |
| `users` | 0 (post-cutover) |

Roles: `super-admin`, `admin`, `data-entry`, `coordinator`

---

## Helper Functions

- `public.is_admin_user()` — ✅ Created (RLS deploy)

---

## Verification Commands

```bash
# Buckets
SELECT count(*) FROM storage.buckets;  -- 8

# Policies
SELECT schemaname, count(*) FROM pg_policies
WHERE schemaname IN ('public','storage') GROUP BY schemaname;
-- public: 55, storage: 0

# Counter
SELECT prefix, last_number FROM registration_counters;
-- SMK2026, 1
```

---

## Signoff

| Gate | Signoff |
|------|---------|
| Schema + migrations | ✅ **APPROVED** |
| Buckets | ✅ **APPROVED** |
| Public RLS (55+) | ✅ **APPROVED** |
| Storage object RLS | ❌ **NOT APPROVED** — manual SQL Editor step |
| Production data | ❌ **NOT APPROVED** — import pending |

**Supabase production signoff: CONDITIONAL NO GO** — infrastructure ready; storage RLS + data migration remain.

---

*Evidence: DIRECT_URL queries — 2026-05-29.*
