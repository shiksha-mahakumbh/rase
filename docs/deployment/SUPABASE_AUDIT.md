# Supabase Audit

**Date:** June 2026  
**Project:** `rcpbfrauyyyorptckrlp` (ap-southeast-1)

---

## Connection configuration

| Check | Result |
|-------|--------|
| `DATABASE_URL` host | `aws-1-ap-southeast-1.pooler.supabase.com:6543` |
| `DIRECT_URL` host | `db.rcpbfrauyyyorptckrlp.supabase.co:5432` |
| Diagnosis | `REMOTE_SUPABASE_CONFIGURED` ✅ |
| Prisma datasource | `url = env("DATABASE_URL")`, `directUrl = env("DIRECT_URL")` ✅ |

---

## Migration status

| Migration | Applied |
|-----------|---------|
| `20250609_init` | ✅ |
| `20250610_phase3` | ✅ |
| `20250621_phase_b_cms` | ✅ |
| `20250620_phase35_cms_foundation` | ✅ |
| `20250622_phase_b5_analytics` | ✅ |
| `20250629_phase_s2_foundation` | ✅ |
| `20250701_phase_c_organizational_cms` | ✅ |

**7/7 migrations applied** — `staging-db-check.mjs` confirmed.

---

## Table inventory

All 15 audited tables present: `pages`, `page_sections`, `notices`, `downloads`, `media_assets`, `media_albums`, `seo_metadata`, `visitor_analytics`, `entity_revisions`, `committees`, `committee_members`, `speaker_profiles`, `partners`, `events`, `event_media`.

---

## Seed status

| Script | Status | Notes |
|--------|--------|-------|
| `seed:cms` | ❌ Failed (fixed in Phase 8) | `counters` → `counter` enum mapping |
| `seed-s2-content` | ✅ | Press, legal, FAQ, departments, gallery |
| `seed-s2-hi` | ❌ Partial (fixed in Phase 8) | NoticeCategory locale removed |
| `seed-phase-c-content` | ✅ | 2 committees, 2 speakers, 3 partners, 2 events, 3 media |

### Seed counts (at audit time)

| Entity | Count |
|--------|------:|
| Homepage pages | 2 |
| Notices | 0 |
| Downloads | 0 |
| Committees | 2 |
| Speakers | 2 |
| Partners | 3 |
| Events | 2 |
| Media center | 3 |

**Action:** Re-run `npm run seed:cms` and `seed-s2-hi.mjs --publish` after fixes.

---

## API keys

| Variable | Local | Vercel Production |
|----------|-------|-------------------|
| `NEXT_PUBLIC_SUPABASE_URL` | ✅ | ✅ |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | ✅ (JWT) | ✅ |
| `SUPABASE_SERVICE_ROLE_KEY` | ✅ (JWT) | ✅ |

---

## RLS documentation

Policy files exist in `supabase/policies/`:
- `admin.sql`, `cms.sql`, `analytics.sql`, `registrations.sql`, `storage.sql`, `phase_b.sql`

| Check | Status |
|-------|--------|
| RLS SQL files in repo | ✅ |
| RLS applied to cloud DB | **NOT VERIFIED** — manual apply required |
| Service role bypasses RLS | Expected for server-side Prisma |

---

## Production readiness

| Criterion | Status |
|-----------|--------|
| Cloud DB connected | ✅ |
| Migrations complete | ✅ |
| Core seed data | ⚠️ Partial |
| Connection pooling | ✅ (6543 + pgbouncer) |
| Direct URL for migrations | ✅ |
| RLS deployed | ❌ Pending |
| Backups enabled | ⚠️ Verify in Supabase dashboard |

---

## Commands to complete seeding

```bash
npm run seed:cms
node scripts/seed-s2-hi.mjs --publish
node scripts/staging-db-check.mjs
```
