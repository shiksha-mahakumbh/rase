# Supabase Runtime Audit

**Date:** 2026-06-10  
**Project:** `rcpbfrauyyyorptckrlp` (ap-southeast-1)  
**Method:** `staging-db-url-audit.mjs`, `staging-db-check.mjs`, `npx prisma validate`

---

## Summary

| Check | Result |
|-------|--------|
| `DATABASE_URL` no localhost | ✅ PASS |
| `DATABASE_URL` no 127.0.0.1 | ✅ PASS |
| Pooler port `:6543` | ✅ PASS |
| Direct port `:5432` | ✅ PASS |
| Cloud connectivity | ✅ PASS |
| Migrations 7/7 | ✅ PASS |
| Phase A/B/C tables | ✅ PASS |
| Vercel `DATABASE_URL` explicit | ❌ FAIL |

**Verdict: CONDITIONAL GO** (local/cloud OK; Vercel naming gap)

---

## DATABASE_URL / DIRECT_URL (local `.env`)

**Script:** `node scripts/staging-db-url-audit.mjs` (2026-06-10)

```json
{
  "DATABASE_URL": {
    "host": "aws-1-ap-southeast-1.pooler.supabase.com",
    "port": "6543",
    "pgbouncer": true,
    "isLocal": false,
    "isSupabaseCloud": true
  },
  "DIRECT_URL": {
    "host": "db.rcpbfrauyyyorptckrlp.supabase.co",
    "port": "5432",
    "pgbouncer": false,
    "isLocal": false,
    "isSupabaseCloud": true
  },
  "diagnosis": "REMOTE_SUPABASE_CONFIGURED"
}
```

| Forbidden | Found? |
|-----------|:------:|
| `127.0.0.1` | ❌ No |
| `localhost` | ❌ No |
| Port `54322` (local CLI) | ❌ No |

---

## Migrations applied

**Script:** `node scripts/staging-db-check.mjs` → `connected: true`

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

## Public schema tables

| Table | Exists | Phase |
|-------|:------:|-------|
| `pages` | ✅ | B |
| `page_sections` | ✅ | B |
| `notices` | ✅ | B |
| `downloads` | ✅ | B |
| `media_assets` | ✅ | B |
| `media_albums` | ✅ | B |
| `seo_metadata` | ✅ | B |
| `visitor_analytics` | ✅ | B5 |
| `entity_revisions` | ✅ | C |
| `committees` | ✅ | C |
| `committee_members` | ✅ | C |
| `speaker_profiles` | ✅ | C |
| `partners` | ✅ | C |
| `events` | ✅ | C |
| `event_media` | ✅ | C |

**All expected Phase A/B/C tables: PASS**

---

## Seed counts

| Entity | Count | Status |
|--------|------:|--------|
| Homepage | 2 | ⚠️ Duplicate |
| Notices | 0 | ❌ Re-seed |
| Downloads | 0 | ❌ Re-seed |
| Committees | 2 | ✅ |
| Speakers | 2 | ✅ |
| Partners | 3 | ✅ |
| Events | 2 | ✅ |
| Event media | 3 | ✅ |

---

## Prisma compatibility

| Command | Result |
|---------|--------|
| `npx prisma validate` | ✅ Pass |
| `npx prisma generate` | ✅ Client v6.19.3 |
| `npm run build` with cloud DB | ✅ 300 pages |

---

## Service role usage

| Component | Key | Scope |
|-----------|-----|-------|
| Server APIs | Prisma + `DATABASE_URL` | Server-only |
| Supabase storage | `SUPABASE_SERVICE_ROLE_KEY` | Vercel Production only |
| Client | `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Public |

---

## Vercel Supabase gap

`DATABASE_URL` and `DIRECT_URL` not listed in `vercel env ls`. Only `POSTGRES_PRISMA_URL` / `POSTGRES_URL_NON_POOLING` aliases present.

**No configuration changes made.**
