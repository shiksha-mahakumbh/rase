# P3 — Supabase Go-Live Report

**Audit date:** 2026-05-29  
**Prior reports:** H2, `docs/firebase-exit/RLS_SECURITY_AUDIT.md`  
**Database:** `db.rcpbfrauyyyorptckrlp.supabase.co`

---

## Subsystem Status Matrix

| Subsystem | Status | Evidence |
|-----------|--------|----------|
| `DATABASE_URL` usage | **PASS** | `prisma/schema.prisma` → `env("DATABASE_URL")`; local connects |
| `DIRECT_URL` usage | **PASS** | `prisma/schema.prisma` → `env("DIRECT_URL")`; migrate uses direct host |
| Prisma validate | **PASS** | `npx prisma validate` exit 0 |
| Prisma migrations | **PASS** | 7/7 applied, up to date |
| Table schema | **PASS** | 64 public tables; required tables exist |
| RLS policies | **BLOCKER** | `pg_policies` count = **0** |
| Storage buckets | **BLOCKER** | `storage.buckets` count = **0** |
| Storage policies | **BLOCKER** | No policies; SQL files in repo not applied |
| Registration persistence | **BLOCKER** | 0 rows; live data on old backend |
| Payment persistence | **BLOCKER** | 0 `payment_records`; 0 `webhook_events` |
| Upload persistence | **BLOCKER** | 0 `uploaded_files`; no buckets |
| Registration counters | **BLOCKER** | Empty — no SMK ID sequence |
| RBAC users | **WARNING** | 0 users — seed may be needed |
| Vercel `DATABASE_URL` name | **BLOCKER** | Missing on Production (alias only) |
| Production on Supabase | **BLOCKER** | Live API serves Firebase-era data |

---

## 1. DATABASE_URL / DIRECT_URL

**Prisma schema:**
```prisma
datasource db {
  provider  = "postgresql"
  url       = env("DATABASE_URL")
  directUrl = env("DIRECT_URL")
}
```

**Local `.env`:** Pooler + direct Supabase hosts — connection verified via row count query.

**Vercel Production:** `POSTGRES_PRISMA_URL` / `POSTGRES_URL_NON_POOLING` present; **`DATABASE_URL` / `DIRECT_URL` absent by name** (P5).

---

## 2. Migrations

```
7 migrations found in prisma/migrations
Database schema is up to date!
```

**Migration drift:** None between repo and connected DB.

---

## 3. Required Tables

```json
{
  "tableCount": 64,
  "requiredTables": {
    "registrations": true,
    "payment_records": true,
    "uploaded_files": true,
    "registration_counters": true
  }
}
```

---

## 4. Row Counts

```json
{
  "registrations": 0,
  "paymentRecords": 0,
  "uploadedFiles": 0,
  "counters": [],
  "users": 0,
  "webhookEvents": 0
}
```

**Cross-check:** Live returns `SMK2026-000001` — data not in Supabase.

---

## 5. RLS Status

**Query:** `SELECT * FROM pg_policies WHERE schemaname IN ('public','storage')`

```json
{ "policyCount": 0, "policies": [] }
```

**Repo SQL (not applied):**
- `supabase/policies/registrations.sql`
- `supabase/policies/admin.sql`
- `supabase/policies/cms.sql`
- `supabase/policies/analytics.sql`
- `supabase/policies/phase_b.sql`
- `supabase/policies/storage.sql` (comment templates)

---

## 6. Storage Buckets

**Query:** `SELECT id, name, public FROM storage.buckets`

```json
"storageBuckets": []
```

**Code expects** (`storage.service.ts`): `registrations`, `resumes`, `papers`, `brochures`, `media`, `committee`, `downloads`

---

## 7. Persistence Paths (Source)

| Path | Service | Target |
|------|---------|--------|
| Registration submit | `registration.service.ts` | `prisma.registration` |
| Payment webhook | `payment.service.ts` | `payment_records` + `registrations` |
| File upload | `storage.service.ts` | Supabase Storage + `uploaded_files` |

All paths **implemented in source**; **untested** against empty DB.

---

## P3 Summary Counts

| Status | Count |
|--------|-------|
| **BLOCKER** | 9 |
| **WARNING** | 1 |
| **PASS** | 5 |

---

*Evidence: `npx prisma migrate status`, Prisma `$queryRaw`, H2 audit. No schema changes.*
