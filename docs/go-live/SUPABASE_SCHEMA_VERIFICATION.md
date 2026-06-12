# Supabase Schema Verification

**Date:** 2026-06-12  
**Command:** `npx prisma validate`, `npx prisma migrate status`, `npm run db:seed`

---

## Prisma Configuration

| Setting | Value | Status |
|---------|-------|--------|
| Provider | `postgresql` | ✅ PASS |
| `url` | `env("DATABASE_URL")` | ✅ PASS |
| `directUrl` | `env("DIRECT_URL")` | ✅ PASS |
| Migrations | 7/7 applied | ✅ PASS |

---

## Core Models

### Registration (`registrations`)

| Check | Status |
|-------|--------|
| Primary key UUID | ✅ |
| Unique `registration_id` (SMK2026-*) | ✅ |
| FK to type extension tables | ✅ Cascade |
| Indexes on email, status, type | ✅ |
| Relations: payments, files, history | ✅ |

### PaymentRecord (`payment_records`)

| Check | Status |
|-------|--------|
| FK → `registrations.id` ON DELETE CASCADE | ✅ |
| Unique `razorpay_payment_id` | ✅ |
| Index on `registration_id`, `razorpay_order_id` | ✅ |
| `WebhookEvent` relation | ✅ |

### UploadedFile (`uploaded_files`)

| Check | Status |
|-------|--------|
| `StorageBucket` enum | ✅ |
| FK → registration (SetNull) | ✅ |
| Index `[registrationId]`, `[bucket, storagePath]` | ✅ |
| Versioning (`isCurrent`, `version`) | ✅ |

### User / RBAC

| Model | Status |
|-------|--------|
| `users` | ✅ `auth_user_id` unique |
| `roles` | ✅ 4 seeded |
| `permissions` | ✅ 18 seeded |
| `user_roles`, `role_permissions` | ✅ |

---

## Migration Integrity

```
Database schema is up to date!
7 migrations found in prisma/migrations
```

No drift detected between repo and connected Supabase instance.

---

## Seed Integrity (Post `npm run db:seed`)

```json
{ "ok": true, "roles": 4, "permissions": 18 }
```

| Item | Verified |
|------|----------|
| Roles seeded | ✅ 4 rows |
| Registration counter | ✅ SMK2026 lastNumber=1 |
| `registration.backend` setting | ✅ `supabase` (seed.sql updated) |

**Evidence:** `node scripts/_verify-db.mjs` equivalent — roles=4, counters=[SMK2026/1]

---

## SQL Artifacts Created

| File | Purpose |
|------|---------|
| `supabase/sql/001_storage_buckets.sql` | 8 buckets |
| `supabase/sql/002_rbac_seed.sql` | Delegates to seed.sql |
| `supabase/sql/003_deploy_rls.sql` | Policy apply order |
| `supabase/sql/deploy-production.sql` | Full deploy |
| `scripts/deploy-supabase-production.mjs` | Node deploy helper |

---

## Remaining Gaps

| Gap | Status |
|-----|--------|
| Storage buckets in DB | ❌ 0 (SQL not yet applied) |
| RLS policies in DB | ❌ 0 (SQL not yet applied) |
| Registration data migrated | ❌ 0 rows |
| Payment data migrated | ❌ 0 rows |

---

*Evidence: Prisma CLI, db:seed output, DB verify query 2026-06-12.*
