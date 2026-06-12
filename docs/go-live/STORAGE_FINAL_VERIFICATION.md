# Storage Final Verification

**Date:** 2026-05-29  
**Auditor:** Production Cutover Engineer  
**Method:** DIRECT_URL queries + `storage-production.sql` apply attempt

---

## Summary

| Check | Target | Actual | Status |
|-------|--------|--------|--------|
| Storage buckets | 8 | **8** | ✅ PASS |
| Bucket config (size limits) | Set | All configured | ✅ PASS |
| Public buckets | media, downloads | Both public=true | ✅ PASS |
| `storage.objects` RLS enabled | Yes | **relrowsecurity=true** | ⚠️ Enabled, no policies |
| Storage schema policies | ≥ 8 | **0** | ❌ FAIL |
| Public schema policies | ≥ 55 | **55** | ✅ PASS |

---

## Storage Buckets — ✅ VERIFIED (8/8)

| id | public | file_size_limit |
|----|--------|-----------------|
| brochures | false | 10,485,760 |
| committee | false | 10,485,760 |
| downloads | **true** | 10,485,760 |
| media | **true** | 10,485,760 |
| papers | false | 10,485,760 |
| receipts | false | 5,242,880 |
| registrations | false | 10,485,760 |
| resumes | false | 10,485,760 |

Applied via `supabase/sql/001_storage_buckets.sql` (prior cutover audit).

---

## Storage RLS — ❌ NOT APPLIED

### Apply attempt (2026-05-29)

```bash
node scripts/apply-deploy-production.mjs --rls-only
# → storage-production.sql
```

**Error:**

```
ERROR: must be owner of table objects
```

The `postgres` role via DIRECT_URL cannot ALTER or create policies on `storage.objects` (owned by Supabase internal role).

### Current state

```json
{
  "storagePolicies": [],
  "storageCount": 0,
  "rlsEnabled": [{ "relname": "objects", "relrowsecurity": true }]
}
```

**Note:** RLS is enabled on `storage.objects` with **zero policies**. Service role (Next.js API) bypasses RLS. Direct client storage access remains blocked by default deny semantics until explicit policies are added.

---

## Required Operator Action

Run in **Supabase Dashboard → SQL Editor** (not Prisma CLI):

```sql
-- Paste full contents of:
-- supabase/policies/storage-production.sql
```

### Expected policies after apply (8)

| policyname | Purpose |
|------------|---------|
| `storage_deny_anon_insert` | Block anon uploads |
| `storage_deny_auth_insert` | Block auth uploads |
| `storage_deny_anon_update` | Block anon updates |
| `storage_deny_auth_update` | Block auth updates |
| `storage_deny_anon_delete` | Block anon deletes |
| `storage_deny_auth_delete` | Block auth deletes |
| `storage_media_public_read` | Public read media/downloads |
| `storage_admin_read` | Admin read all buckets |

### Verification query

```sql
SELECT policyname, cmd FROM pg_policies
WHERE schemaname = 'storage' ORDER BY policyname;
-- Expected: 8 rows
```

---

## Verification Commands (local)

```bash
# Buckets via deploy helper verify block
node scripts/apply-deploy-production.mjs --buckets-only

# Or SQL
SELECT count(*) FROM storage.buckets;  -- 8
SELECT count(*) FROM pg_policies WHERE schemaname = 'storage';  -- 0 until SQL Editor
```

---

## Signoff

| Gate | Result |
|------|--------|
| Buckets | ✅ **VERIFIED** |
| Storage RLS policies | ❌ **BLOCKED** — Supabase SQL Editor required |
| Public RLS (55+) | ✅ **VERIFIED** |

**Storage final signoff: CONDITIONAL PASS** — buckets ready; storage policies are the sole remaining Supabase infra step.

---

*Evidence: `node scripts/apply-deploy-production.mjs`, DIRECT_URL queries — 2026-05-29.*
