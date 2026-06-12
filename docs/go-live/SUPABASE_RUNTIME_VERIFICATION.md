# G1 — Supabase Runtime Verification

**Audit date:** 2026-05-29  
**Auditor role:** Principal Release Engineer (Phase G — evidence only)  
**Project:** Shiksha Mahakumbh (`dhe-projects/rase-co-in`)  
**Verdict:** ⚠️ **PARTIAL PASS** — schema and migrations OK; **data empty**; storage buckets **UNKNOWN**

---

## 1. Prisma → Supabase Postgres

| Check | Result | Evidence |
|-------|--------|----------|
| Datasource provider | ✅ `postgresql` | `prisma/schema.prisma` lines 9–13 |
| `url` env | ✅ `env("DATABASE_URL")` | Same |
| `directUrl` env | ✅ `env("DIRECT_URL")` | Same |
| `npx prisma validate` | ✅ PASS | Run 2026-05-29 |
| `npx prisma migrate status` | ✅ **7/7 applied**, schema up to date | DB host: `db.rcpbfrauyyyorptckrlp.supabase.co:5432` |

---

## 2. Local `.env` URL Mapping

Verified from local environment (values redacted):

| Variable | Target (observed) |
|----------|-------------------|
| `DATABASE_URL` | Supabase **pooler** (`aws-1-ap-southeast-1.pooler.supabase.com`) |
| `DIRECT_URL` | Supabase **direct** host (`db.rcpbfrauyyyorptckrlp.supabase.co`) |

Mapping is correct for Prisma pooled connections + migration/direct operations.

**Production Vercel note:** `DATABASE_URL` and `DIRECT_URL` are **not** set by exact name on Vercel Production. Aliases exist as `POSTGRES_PRISMA_URL` and `POSTGRES_URL_NON_POOLING`. Prisma schema requires `DATABASE_URL` / `DIRECT_URL` — see G3.

---

## 3. Migrations

```
7 migrations found in prisma/migrations
Database schema is up to date!
```

All migration folders under `prisma/migrations/` are applied to the connected Supabase instance.

---

## 4. Required Tables

Queried `public` schema via Prisma (2026-05-29). **64 tables** present. Critical tables verified:

| Table / model | Present | Row count |
|---------------|---------|-----------|
| `registrations` | ✅ | **0** |
| `payment_records` | ✅ | **0** |
| `uploaded_files` | ✅ | **0** |
| `registration_counters` | ✅ | **0 rows** (empty array) |
| `users` | ✅ | **0** |
| `roles` | ✅ | present (RBAC seed not verified) |
| `webhook_events` | ✅ | not counted separately |

**Evidence command:**
```json
{"registrations":0,"paymentRecords":0,"uploadedFiles":0,"counters":[]}
```

---

## 5. Registration Data Expectations

| Expectation | Status |
|-------------|--------|
| Historical Firebase registrations migrated | ❌ **NOT MET** — 0 rows |
| Counter seeded for SMK2026 IDs | ❌ **NOT MET** — no counter rows |
| Live production has registrations | ✅ **YES on old stack** — `GET https://www.shikshamahakumbh.com/api/registration/SMK2026-000001` returned `SMK2026-000001` (2026-06-09) **without auth** |

**Conclusion:** Supabase Postgres is schema-ready but **not populated**. Production traffic still serves data from the **pre-cutover backend** (not this empty Supabase DB).

---

## 6. Payment Data Expectations

| Expectation | Status |
|-------------|--------|
| `payment_records` populated | ❌ **0 rows** |
| Webhook event audit trail | ❌ **Not verified** (empty DB) |
| Razorpay reconciliation possible post-cutover | ⚠️ **Blocked until import** |

---

## 7. Storage

| Check | Status |
|-------|--------|
| `uploaded_files` Prisma table | ✅ exists, **0 rows** |
| Supabase Storage buckets (`registrations`, `documents`, etc.) | **UNKNOWN** — not verified via Supabase API/console in this audit |
| RLS policies (`supabase/policies/*.sql`) | **UNKNOWN** — SQL files exist in repo; application to live project not verified |

Code references buckets in `src/server/services/storage.service.ts` (`registrations`, `documents`, `brochures`, `gallery`, `committee`).

---

## 8. G1 Summary

| Area | Status |
|------|--------|
| Prisma ↔ Supabase Postgres wiring | ✅ PASS |
| Migrations applied | ✅ PASS |
| Table schema | ✅ PASS |
| Registration records | ❌ FAIL (empty) |
| Payment records | ❌ FAIL (empty) |
| Storage buckets / RLS | ⚠️ UNKNOWN |

**G1 blocker:** Data migration to Supabase has **not** been executed or verified. Production cutover would lose all registration/payment history unless import completes first.

---

*Evidence collected directly. No schema changes. No deployment.*
