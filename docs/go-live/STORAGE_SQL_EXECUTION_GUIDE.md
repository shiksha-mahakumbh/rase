# Storage SQL Execution Guide

**Date:** 2026-05-29  
**Role:** Production Release Commander  
**Source file:** `supabase/policies/storage-production.sql`  
**Execution venue:** Supabase Dashboard → SQL Editor (required — CLI fails with `must be owner of table objects`)

---

## Prerequisites

- [ ] Public RLS already applied (`public.is_admin_user()` function exists)
- [ ] Storage buckets created (8/8 verified)
- [ ] Supabase project: `db.rcpbfrauyyyorptckrlp.supabase.co`
- [ ] Operator has Supabase Dashboard admin access

**Do NOT run via `prisma db execute` or pooler connection** — ownership error confirmed on 2026-05-29.

---

## Current State (pre-execution)

| Check | Expected now |
|-------|--------------|
| `storage.buckets` count | 8 |
| `pg_policies` where `schemaname = 'storage'` | **0** |
| `storage.objects` RLS enabled | `relrowsecurity = true` |

---

## Exact SQL to Execute

Copy the entire block below into Supabase SQL Editor and run as a single script.

```sql
-- Supabase Storage object policies — production
-- All uploads go through Next.js service role; deny direct client writes.

ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;

-- Deny anonymous and authenticated direct uploads (service role bypasses RLS)
CREATE POLICY storage_deny_anon_insert ON storage.objects
  FOR INSERT TO anon
  WITH CHECK (false);

CREATE POLICY storage_deny_auth_insert ON storage.objects
  FOR INSERT TO authenticated
  WITH CHECK (false);

CREATE POLICY storage_deny_anon_update ON storage.objects
  FOR UPDATE TO anon
  USING (false);

CREATE POLICY storage_deny_auth_update ON storage.objects
  FOR UPDATE TO authenticated
  USING (false);

CREATE POLICY storage_deny_anon_delete ON storage.objects
  FOR DELETE TO anon
  USING (false);

CREATE POLICY storage_deny_auth_delete ON storage.objects
  FOR DELETE TO authenticated
  USING (false);

-- Public read for published media and downloads buckets only
CREATE POLICY storage_media_public_read ON storage.objects
  FOR SELECT TO anon, authenticated
  USING (bucket_id IN ('media', 'downloads'));

-- Admin read all buckets via RBAC
CREATE POLICY storage_admin_read ON storage.objects
  FOR SELECT TO authenticated
  USING (public.is_admin_user());
```

---

## SQL Block Reference

| Block | Lines | Purpose |
|-------|-------|---------|
| `ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY` | 1 | Ensures RLS active on objects table |
| Deny INSERT (anon + authenticated) | 2 | Blocks direct client uploads |
| Deny UPDATE (anon + authenticated) | 2 | Blocks direct client modifications |
| Deny DELETE (anon + authenticated) | 2 | Blocks direct client deletions |
| `storage_media_public_read` | 1 | Public SELECT on `media`, `downloads` buckets |
| `storage_admin_read` | 1 | Admin SELECT on all buckets via RBAC |

---

## Expected Policy Count

| Schema | Policies | Policy names |
|--------|----------|--------------|
| `storage` | **8** | See table below |

| # | policyname | cmd | roles |
|---|------------|-----|-------|
| 1 | `storage_deny_anon_insert` | INSERT | anon |
| 2 | `storage_deny_auth_insert` | INSERT | authenticated |
| 3 | `storage_deny_anon_update` | UPDATE | anon |
| 4 | `storage_deny_auth_update` | UPDATE | authenticated |
| 5 | `storage_deny_anon_delete` | DELETE | anon |
| 6 | `storage_deny_auth_delete` | DELETE | authenticated |
| 7 | `storage_media_public_read` | SELECT | anon, authenticated |
| 8 | `storage_admin_read` | SELECT | authenticated |

Combined with existing public schema policies: **55 + 8 = 63 total**.

---

## Verification Queries

Run in SQL Editor immediately after execution.

### Query 1 — Policy count

```sql
SELECT schemaname, count(*) AS policy_count
FROM pg_policies
WHERE schemaname IN ('public', 'storage')
GROUP BY schemaname
ORDER BY schemaname;
```

**Expected output:**

| schemaname | policy_count |
|------------|--------------|
| public | 55 |
| storage | 8 |

### Query 2 — Policy names

```sql
SELECT policyname, cmd, roles
FROM pg_policies
WHERE schemaname = 'storage'
ORDER BY policyname;
```

**Expected output (8 rows):**

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

### Query 3 — RLS enabled on objects

```sql
SELECT c.relname, c.relrowsecurity
FROM pg_class c
JOIN pg_namespace n ON n.oid = c.relnamespace
WHERE n.nspname = 'storage' AND c.relname = 'objects';
```

**Expected output:**

| relname | relrowsecurity |
|---------|----------------|
| objects | true |

### Query 4 — Buckets unchanged

```sql
SELECT id, name, public FROM storage.buckets ORDER BY name;
```

**Expected output (8 rows):** brochures, committee, downloads (public), media (public), papers, receipts, registrations, resumes

---

## Expected Dashboard Response

On successful execution, Supabase SQL Editor shows:

```
Success. No rows returned.
```

If policies already exist (re-run):

```
ERROR: policy "storage_deny_anon_insert" for table "objects" already exists
```

This is acceptable — verify count is still 8.

---

## Failure Modes

| Error | Cause | Resolution |
|-------|-------|------------|
| `must be owner of table objects` | Running via postgres DIRECT_URL / Prisma | Use Supabase SQL Editor only |
| `function public.is_admin_user() does not exist` | Public RLS not applied first | Run `supabase/policies/registrations.sql` first |
| `policy ... already exists` | Idempotent re-run | Verify count = 8, proceed |

---

## Post-Execution Signoff

- [ ] Storage policy count = **8**
- [ ] Public policy count = **55** (unchanged)
- [ ] Buckets = **8** (unchanged)
- [ ] Record execution timestamp and operator name

---

*Documentation only — SQL not executed during this audit.*
