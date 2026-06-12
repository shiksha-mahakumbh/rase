# Database Validation — Staging

**Date:** June 2026  
**Commands attempted:** `npm run db:migrate:deploy`, `node scripts/staging-db-check.mjs`

---

## Migration deploy result

```
npm run db:migrate:deploy
→ Error P1001: Can't reach database server at 127.0.0.1:54322
```

**Status:** ❌ **NOT EXECUTED** — PostgreSQL/Supabase local instance not running.

---

## Migrations in repository (7)

| Migration | Phase | File |
|-----------|-------|------|
| `20250609_init` | Init | ✅ |
| `20250610_phase3` | Phase 3 | ✅ |
| `20250620_phase35_cms_foundation` | Phase 3.5 | ✅ |
| `20250621_phase_b_cms` | Phase B | ✅ |
| `20250622_phase_b5_analytics` | Phase B.5 | ✅ |
| `20250629_phase_s2_foundation` | Phase S2 | ✅ |
| `20250701_phase_c_organizational_cms` | Phase C | ✅ |

**Schema validation:** `npx prisma validate` → ✅ Pass

---

## Expected tables (Phase A–C)

| Table | Phase | Expected |
|-------|-------|----------|
| `pages`, `page_sections`, `page_revisions` | B | Required |
| `notices`, `notice_categories` | B | Required |
| `downloads` | B | Required |
| `media_assets`, `media_folders`, `media_albums` | B/S2 | Required |
| `seo_metadata` | B | Required |
| `menus`, `menu_items` | B | Required |
| `site_settings`, `announcement_bars` | B | Required |
| `faq_categories`, `faq_items` | S2 | Required |
| `visitor_analytics`, `visitor_sessions` | B.5 | Required |
| `committees`, `committee_members` | C | Required |
| `speaker_profiles` | C | Required |
| `partners` | C | Required |
| `events`, `event_media` | C | Required |
| `entity_revisions` | C | Required |

---

## Staging procedure (when DB available)

```bash
# 1. Start Supabase local OR point DATABASE_URL to staging Supabase
npx supabase start   # if using local

# 2. Deploy migrations
npm run db:migrate:deploy

# 3. Verify
node scripts/staging-db-check.mjs

# 4. Confirm no failed migrations
# SELECT migration_name, finished_at FROM _prisma_migrations;
```

---

## Verdict

| Check | Result |
|-------|--------|
| Migration files present | ✅ PASS |
| Schema valid | ✅ PASS |
| `migrate deploy` executed | ❌ FAIL (DB unreachable) |
| Tables verified | ❌ BLOCKED |
| Phase C tables confirmed | ❌ BLOCKED |

**Stage 2: FAIL** — start staging database and re-run `db:migrate:deploy`.
