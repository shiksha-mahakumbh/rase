# H2 — Supabase Runtime Audit

**Audit date:** 2026-05-29  
**Database:** `db.rcpbfrauyyyorptckrlp.supabase.co` (via local `DATABASE_URL` / `DIRECT_URL`)  
**Verdict:** ⚠️ **Schema PASS / Runtime FAIL** — connected, migrated, empty, no buckets, no RLS

---

## 1. Prisma Connection

| Check | Result | Evidence |
|-------|--------|----------|
| `npx prisma validate` | ✅ PASS | 2026-05-29 |
| `npx prisma migrate status` | ✅ **7/7 applied**, up to date | Datasource: `db.rcpbfrauyyyorptckrlp.supabase.co:5432` |
| Prisma client query | ✅ Connected | Row count query succeeded |

---

## 2. Migrations

```
7 migrations found in prisma/migrations
Database schema is up to date!
```

**Migration drift:** None detected between repo and connected database.

---

## 3. Required Tables

**Query:** `SELECT tablename FROM pg_tables WHERE schemaname = 'public'`

| Metric | Value |
|--------|-------|
| Total public tables | **64** |

| Required table | Exists |
|----------------|--------|
| `registrations` | ✅ |
| `payment_records` | ✅ |
| `uploaded_files` | ✅ |
| `registration_counters` | ✅ |
| `users` | ✅ |
| `webhook_events` | ✅ |

---

## 4. Registration & Payment Data

**Prisma counts (2026-05-29):**

```json
{
  "registrations": 0,
  "paymentRecords": 0,
  "uploadedFiles": 0,
  "counters": [],
  "users": 0
}
```

| Expectation | Status |
|-------------|--------|
| Migrated production registrations | ❌ **0 rows** |
| Payment history | ❌ **0 rows** |
| Registration ID counter (SMK2026-*) | ❌ **Empty** |
| Uploaded file metadata | ❌ **0 rows** |

**Cross-check:** Live production returns `SMK2026-000001` via API — data exists on **old backend**, not in Supabase.

---

## 5. Storage Buckets

**Query:** `SELECT id, name, public FROM storage.buckets`

```json
"storageBuckets": []
```

❌ **Zero storage buckets** configured in Supabase project.

**Code expects buckets** (`src/server/services/storage.service.ts`):
- `registrations`, `resumes`, `papers`, `brochures`, `media`, `committee`, `downloads`

**Documentation reference** (`supabase/policies/storage.sql`):
- `registrations`, `awards`, `best-practices`, `brochures`, `gallery`, `committee`, `documents`, `receipts`, `exports`

**Supabase Storage API probe:** `SUPABASE_SERVICE_ROLE_KEY` not confirmed in audit script output (local env may lack key name match). Bucket table query is authoritative: **none exist**.

---

## 6. RLS Policies

**Query:** `SELECT schemaname, tablename, policyname FROM pg_policies WHERE schemaname IN ('public', 'storage')`

```json
{
  "policyCount": 0,
  "policies": []
}
```

❌ **Zero RLS policies applied** in database.

**Repo SQL files exist (not applied):**
- `supabase/policies/registrations.sql`
- `supabase/policies/admin.sql`
- `supabase/policies/cms.sql`
- `supabase/policies/analytics.sql`
- `supabase/policies/phase_b.sql`
- `supabase/policies/storage.sql` (comment-only examples)

---

## 7. Empty Tables Summary

| Table | Rows | Blocker? |
|-------|------|----------|
| `registrations` | 0 | **P0** |
| `payment_records` | 0 | **P0** |
| `uploaded_files` | 0 | **P0** |
| `registration_counters` | 0 | **P0** |
| `users` | 0 | P1 (RBAC seed) |

---

## 8. Migration Drift

| Check | Result |
|-------|--------|
| Repo migrations vs DB | ✅ No drift |
| Repo RLS SQL vs DB policies | ❌ **Drift** — SQL not applied |
| Repo storage docs vs buckets | ❌ **Drift** — buckets not created |
| Firebase export/import executed | ❌ **Not verified** — tables empty |

---

## H2 Summary

| Area | Status |
|------|--------|
| Prisma ↔ Postgres connect | ✅ |
| Migrations applied | ✅ |
| Table schema | ✅ |
| Production data | ❌ Empty |
| Storage buckets | ❌ Missing |
| RLS policies | ❌ Missing |

**P0 blockers:** Data migration, storage bucket creation, RLS policy application must complete before cutover.

---

*Evidence: `npx prisma migrate status`, Prisma `$queryRaw` on `pg_tables`, `pg_policies`, `storage.buckets`. No schema changes.*
