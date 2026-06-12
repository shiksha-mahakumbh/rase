# Storage & RLS Verification

**Date:** 2026-05-29  
**Method:** `prisma db execute --url $DIRECT_URL` + post-apply audit queries

---

## Pre-Audit State

| Check | Before | Target |
|-------|--------|--------|
| `storage.buckets` count | 0 | 8 |
| `pg_policies` (public + storage) | 0 | > 30 |

---

## Actions Taken

Per runbook rule: buckets and RLS missing → apply deploy artifacts.

1. **Buckets:** `supabase/sql/001_storage_buckets.sql` via `prisma db execute` + **DIRECT_URL**  
   - Pooler (`DATABASE_URL` port 6543) did not persist bucket rows; direct connection required.

2. **RLS:** Applied policy files in `003_deploy_rls.sql` order (expanded manually; no `psql` on Windows):
   - `registrations.sql` — required fix: `awards_registrations` → **`award_registrations`** (matches Prisma `@@map`)
   - `production-hardening.sql`
   - `payments.sql` (partial overlap with registrations.sql — duplicates skipped)
   - `admin.sql`, `cms.sql`, `analytics.sql`, `phase_b.sql`
   - `storage-production.sql` — **FAILED**

---

## Post-Audit State

### Storage buckets — ✅ PASS (8/8)

| id | public |
|----|--------|
| brochures | false |
| committee | false |
| downloads | **true** |
| media | **true** |
| papers | false |
| receipts | false |
| registrations | false |
| resumes | false |

### RLS policies — ⚠️ PARTIAL PASS

| Schema | Policy count | Status |
|--------|-------------|--------|
| `public` | **55** | ✅ Exceeds >30 target |
| `storage` | **0** | ❌ Not applied |

**Sample policies verified:**

- `registrations_deny_anon_all`
- `registrations_admin_select` / `registrations_admin_update`
- `registration_counters_deny_all`
- `payment_records_admin_select`
- CMS/analytics/phase_b admin policies

### Storage RLS failure

```
ERROR: must be owner of table objects
```

`storage.objects` is owned by Supabase internal role. Apply `supabase/policies/storage-production.sql` via **Supabase Dashboard → SQL Editor** (service context) or Supabase CLI with elevated privileges.

**Mitigation until applied:** All uploads go through Next.js service role (bypasses RLS). Direct client storage writes should remain disabled in app code.

---

## Deploy Script Notes

| Script | Issue | Resolution |
|--------|-------|------------|
| `deploy-supabase-production.mjs` | Naive `;` split breaks `$$` functions | Use `prisma db execute` for full files |
| `002_rbac_seed.sql` | Contains `\ir` psql directive | RBAC already seeded via `npm run db:seed` |
| `apply-deploy-production.mjs` | New helper using DIRECT_URL + duplicate tolerance | Used for this audit |

---

## Verification Queries

```sql
SELECT id, name, public FROM storage.buckets ORDER BY name;
-- Expected: 8 rows

SELECT count(*) FROM pg_policies WHERE schemaname = 'public';
-- Actual: 55

SELECT count(*) FROM pg_policies WHERE schemaname = 'storage';
-- Actual: 0 (pending storage-production.sql)
```

---

## Verdict

| Gate | Result |
|------|--------|
| Storage buckets | ✅ **PASS** |
| Public RLS | ✅ **PASS** (55 policies) |
| Storage object RLS | ❌ **FAIL** — manual Supabase SQL Editor step required |

---

*Re-audit command: `node scripts/_cutover-audit-db.mjs` (uses DIRECT_URL).*
