# Storage & RLS Final Verification

**Date:** 2026-05-29  
**Auditor:** Principal Release Engineer  
**Connection:** DIRECT_URL (port 5432)  
**Method:** Live SQL queries via Prisma

---

## Summary

| Component | Target | Actual | Status |
|-----------|--------|--------|--------|
| Storage buckets | 8 | **8** | ✅ PASS |
| Public RLS policies | ≥ 55 | **55** | ✅ PASS |
| Storage (`storage.objects`) policies | 8 | **0** | ❌ FAIL |
| `storage.objects` RLS enabled | true | **true** | ⚠️ Enabled, no policies |

---

## Storage Buckets — ✅ 8/8

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

```sql
SELECT count(*) FROM storage.buckets;
-- Result: 8
```

---

## Public RLS — ✅ 55 policies

```sql
SELECT count(*) FROM pg_policies WHERE schemaname = 'public';
-- Result: 55
```

Sample policies verified in prior deploy: `registrations_deny_anon_all`, `registration_counters_deny_all`, CMS/analytics admin policies.

---

## Storage RLS — ❌ 0 policies (BLOCKER)

```sql
SELECT count(*) FROM pg_policies WHERE schemaname = 'storage';
-- Result: 0

SELECT relrowsecurity FROM pg_class c
JOIN pg_namespace n ON n.oid = c.relnamespace
WHERE n.nspname = 'storage' AND c.relname = 'objects';
-- Result: true
```

### Apply attempt (2026-05-29)

CLI apply via `prisma db execute` + DIRECT_URL was **not executed** in this audit (requires operator authorization for mutating SQL). Prior audits confirmed error when attempted:

```
ERROR: must be owner of table objects
```

**Required action:** Supabase Dashboard → SQL Editor → run `supabase/policies/storage-production.sql`

---

## Exact SQL for Supabase SQL Editor

```sql
-- supabase/policies/storage-production.sql
ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;

CREATE POLICY storage_deny_anon_insert ON storage.objects
  FOR INSERT TO anon WITH CHECK (false);

CREATE POLICY storage_deny_auth_insert ON storage.objects
  FOR INSERT TO authenticated WITH CHECK (false);

CREATE POLICY storage_deny_anon_update ON storage.objects
  FOR UPDATE TO anon USING (false);

CREATE POLICY storage_deny_auth_update ON storage.objects
  FOR UPDATE TO authenticated USING (false);

CREATE POLICY storage_deny_anon_delete ON storage.objects
  FOR DELETE TO anon USING (false);

CREATE POLICY storage_deny_auth_delete ON storage.objects
  FOR DELETE TO authenticated USING (false);

CREATE POLICY storage_media_public_read ON storage.objects
  FOR SELECT TO anon, authenticated
  USING (bucket_id IN ('media', 'downloads'));

CREATE POLICY storage_admin_read ON storage.objects
  FOR SELECT TO authenticated
  USING (public.is_admin_user());
```

---

## Validation Queries (post-execution)

```sql
-- Expected: public=55, storage=8
SELECT schemaname, count(*) AS policy_count
FROM pg_policies
WHERE schemaname IN ('public', 'storage')
GROUP BY schemaname
ORDER BY schemaname;

-- Expected: 8 policy names
SELECT policyname FROM pg_policies
WHERE schemaname = 'storage' ORDER BY policyname;
```

### Expected output after successful execution

| schemaname | policy_count |
|------------|--------------|
| public | 55 |
| storage | 8 |

Policy names:

```
storage_admin_read
storage_deny_anon_delete
storage_deny_anon_insert
storage_deny_anon_update
storage_deny_auth_delete
storage_deny_auth_insert
storage_deny_auth_update
storage_media_public_read
```

---

## Signoff

| Gate | Result |
|------|--------|
| Buckets | ✅ **PASS** |
| Public RLS | ✅ **PASS** |
| Storage object RLS | ❌ **FAIL** — manual SQL Editor step required |

**Storage/RLS verification: CONDITIONAL NO GO** until 8 storage policies applied.

---

*Live query evidence — 2026-05-29. See `STORAGE_SQL_EXECUTION_GUIDE.md` for full operator instructions.*
