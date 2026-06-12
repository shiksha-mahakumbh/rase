# Supabase Deployment Status

**Date:** 2026-05-29  
**Project:** Supabase Postgres (via Prisma datasource)

---

## Schema & Migrations

| Check | Result |
|-------|--------|
| `npx prisma validate` | ✅ Valid |
| Migrations in repo | **7** |
| `npx prisma migrate status` | ✅ All applied, up to date |
| Connection (direct) | ✅ `db.*.supabase.co:5432` |

### Migration history

| Migration | Purpose |
|-----------|---------|
| `20250609_init` | Core registration + RBAC tables |
| `20250610_phase3` | Phase 3 extensions |
| `20250621_phase_b_cms` | CMS foundation |
| `20250622_phase_b5_analytics` | Analytics |
| `20250620_phase35_cms_foundation` | CMS v3.5 |
| `20250629_phase_s2_foundation` | Phase S2 |
| `20250701_phase_c_organizational_cms` | Organizational CMS |

---

## RBAC Tables

| Table | Count | Expected |
|-------|-------|----------|
| `roles` | 4 | 4 |
| `permissions` | 18 | 18 |
| `role_permissions` | Seeded | — |
| `users` | 0 | Admin users post-cutover |

**Roles:** `super-admin`, `admin`, `data-entry`, `coordinator`

---

## Registration Counters

| prefix | lastNumber | year |
|--------|------------|------|
| SMK2026 | 1 | 2026 |

Seeded via `npm run db:seed` (2026-06-12). Counter ready for post-migration ID continuity.

---

## Data Plane

| Table | Rows | Notes |
|-------|------|-------|
| `registrations` | **0** | Firebase import not executed |
| `users` | 0 | — |
| All registration subtypes | 0 | — |

Live production serves `SMK2026-000001` from **Firebase**, not Supabase.

---

## Storage

| Check | Result |
|-------|--------|
| Buckets | ✅ **8** (see `STORAGE_RLS_VERIFICATION.md`) |
| Public buckets | `media`, `downloads` |
| Private buckets | `registrations`, `resumes`, `papers`, `brochures`, `committee`, `receipts` |

Applied: `supabase/sql/001_storage_buckets.sql` via DIRECT_URL.

---

## RLS

| Schema | Policies | Status |
|--------|----------|--------|
| `public` | **55** | ✅ Applied |
| `storage` | **0** | ❌ `storage-production.sql` blocked (table ownership) |

Helper function `public.is_admin_user()` created successfully.

---

## SQL Artifacts

| File | Purpose | Applied |
|------|---------|---------|
| `supabase/sql/deploy-production.sql` | Master (psql `\ir`) | Partial — buckets + RLS files |
| `supabase/sql/001_storage_buckets.sql` | Buckets | ✅ |
| `supabase/sql/002_rbac_seed.sql` | Seed delegate | Skipped (`\ir`; Prisma seed used) |
| `supabase/sql/003_deploy_rls.sql` | RLS index | ✅ (expanded manually) |

---

## Verdict

| Component | Status |
|-----------|--------|
| Schema / migrations | ✅ Ready |
| RBAC seed | ✅ Ready |
| Registration counter | ✅ Ready |
| Storage buckets | ✅ Ready |
| Public RLS | ✅ Ready |
| Storage RLS | ⚠️ Manual step |
| Production data | ❌ Empty — import blocked |

---

*Queries via DIRECT_URL — 2026-05-29.*
