# Supabase Configuration Audit

**Date:** 2026-06-10  
**Project:** `rcpbfrauyyyorptckrlp` (ap-southeast-1)  
**Method:** `scripts/staging-db-url-audit.mjs`, `scripts/staging-db-check.mjs`, `npx prisma validate`

---

## Summary

| Check | Result |
|-------|--------|
| `DATABASE_URL` has no localhost | ✅ **PASS** |
| `DATABASE_URL` has no `127.0.0.1` | ✅ **PASS** |
| Pooler uses port `:6543` | ✅ **PASS** |
| Direct URL uses port `:5432` | ✅ **PASS** |
| Cloud Supabase connected | ✅ **PASS** |
| Migrations applied (7/7) | ✅ **PASS** |
| Vercel `DATABASE_URL` explicit | ❌ **FAIL** (uses `POSTGRES_*` only) |

**Local verdict: PASS**  
**Vercel verdict: CONDITIONAL** (naming alias gap)

---

## DATABASE_URL audit

**Script:** `node scripts/staging-db-url-audit.mjs` (2026-06-10)

```json
{
  "DATABASE_URL": {
    "present": true,
    "host": "aws-1-ap-southeast-1.pooler.supabase.com",
    "port": "6543",
    "user": "pooler-user",
    "pgbouncer": true,
    "isLocal": false,
    "isSupabaseCloud": true
  },
  "diagnosis": "REMOTE_SUPABASE_CONFIGURED"
}
```

| Forbidden pattern | Found? |
|-------------------|:------:|
| `127.0.0.1` | ❌ No |
| `localhost` | ❌ No |
| Port `54322` (local Supabase CLI) | ❌ No |

---

## DIRECT_URL audit

```json
{
  "DIRECT_URL": {
    "present": true,
    "host": "db.rcpbfrauyyyorptckrlp.supabase.co",
    "port": "5432",
    "user": "postgres",
    "pgbouncer": false,
    "isLocal": false,
    "isSupabaseCloud": true
  }
}
```

| Requirement | Actual | Pass? |
|-------------|--------|:-----:|
| Direct connection port `:5432` | `5432` | ✅ |
| No pooler on direct URL | `pgbouncer: false` | ✅ |
| Supabase cloud host | `*.supabase.co` | ✅ |

---

## Connectivity and migrations

**Script:** `node scripts/staging-db-check.mjs` (2026-06-10)

| Check | Result |
|-------|--------|
| `connected` | `true` |
| Migrations applied | 7/7 |
| Tables exist | 15/15 |
| Exit code | 0 |

| Migration | Applied |
|-----------|:-------:|
| `20250609_init` | ✅ |
| `20250610_phase3` | ✅ |
| `20250620_phase35_cms_foundation` | ✅ |
| `20250621_phase_b_cms` | ✅ |
| `20250622_phase_b5_analytics` | ✅ |
| `20250629_phase_s2_foundation` | ✅ |
| `20250701_phase_c_organizational_cms` | ✅ |

---

## Seed status

| Entity | Count | Status |
|--------|------:|--------|
| Homepage pages | 2 | ⚠️ Duplicate |
| Notices | 0 | ❌ Re-seed needed |
| Downloads | 0 | ❌ Re-seed needed |
| Committees | 2 | ✅ |
| Speakers | 2 | ✅ |
| Partners | 3 | ✅ |
| Events | 2 | ✅ |

---

## Prisma compatibility

| Check | Result |
|-------|--------|
| `npx prisma validate` | ✅ Pass |
| `npx prisma generate` | ✅ Client v6.19.3 |
| `npm run build` with cloud DB | ✅ 300 pages SSG |
| Schema `url = env("DATABASE_URL")` | Requires explicit var on Vercel |

---

## Vercel Supabase configuration

| Variable | Production | Preview | Development |
|----------|:----------:|:-------:|:-----------:|
| `POSTGRES_PRISMA_URL` | ✅ | ✅ | ✅ |
| `POSTGRES_URL_NON_POOLING` | ✅ | ✅ | ✅ |
| `DATABASE_URL` (explicit) | ❌ | ❌ | ❌ |
| `DIRECT_URL` (explicit) | ❌ | ❌ | ❌ |
| `NEXT_PUBLIC_SUPABASE_URL` | ✅ | ❌ | ❌ |
| `SUPABASE_SERVICE_ROLE_KEY` | ✅ | ❌ | ❌ |

**Risk:** Build/runtime on Vercel may depend on Supabase integration auto-mapping. Not explicitly verified in Vercel build logs this audit.

---

## RLS policies

Policy SQL files exist in `supabase/policies/` (cms, phase_b, analytics, admin, registrations, storage).

**Live RLS application:** Not verified in this audit.

---

## Remediation (manual)

```bash
# Vercel Dashboard
DATABASE_URL = <POSTGRES_PRISMA_URL value>
DIRECT_URL = <POSTGRES_URL_NON_POOLING value>

# Seeds
npm run seed:cms
node scripts/staging-db-check.mjs

# RLS verification (Supabase SQL editor)
SELECT tablename, rowsecurity FROM pg_tables WHERE schemaname = 'public';
```

**No configuration changes applied.**
