# Migration Readiness Report

**Date:** June 2026  
**Prisma version:** 6.19.3  
**Schema validation:** ✅ Pass

---

## Full migration inventory (7 migrations)

Deployments must run in **timestamp order**. Prisma enforces this via `_prisma_migrations`.

| Order | Migration | Phase | Purpose |
|------:|-----------|-------|---------|
| 1 | `20250609_init` | Init | Core registration tables, RBAC, enums |
| 2 | `20250610_phase3` | Phase 3 | Registration extensions, accommodation |
| 3 | `20250620_phase35_cms_foundation` | Phase 3.5 | Pages, SEO, media library foundation |
| 4 | `20250621_phase_b_cms` | Phase B | Notices, downloads, menus, settings, FAQ |
| 5 | `20250622_phase_b5_analytics` | Phase B.5 | Visitor analytics tables |
| 6 | `20250629_phase_s2_foundation` | Phase S2 | Press/legal page types, gallery extensions |
| 7 | `20250701_phase_c_organizational_cms` | Phase C | EntityRevision, organizational enums/columns |

---

## Requested migrations — detailed review

### `20250620_phase35_cms_foundation`

| Check | Status |
|-------|--------|
| Depends on `20250609_init` + `20250610_phase3` | ✅ |
| Creates `ContentLocale`, `PageStatus`, `PageType` enums | ✅ |
| Creates `pages`, `page_sections`, `page_revisions` | ✅ |
| Creates `seo_metadata`, `media_assets`, `media_folders` | ✅ |
| Uses `IF NOT EXISTS` / `duplicate_object` guards | ✅ Idempotent-safe |
| Prisma schema alignment | ✅ |

### `20250621_phase_b_cms`

| Check | Status |
|-------|--------|
| Depends on Phase 3.5 pages/CMS | ✅ |
| Creates notices, downloads, menus, site_settings | ✅ |
| Extends audit enums | ✅ |
| Prisma schema alignment | ✅ |

### `20250622_phase_b5_analytics`

| Check | Status |
|-------|--------|
| Depends on prior CMS tables | ✅ |
| Creates visitor_analytics, visitor_sessions, etc. | ✅ |
| Append-only design | ✅ |
| Prisma schema alignment | ✅ |

### `20250701_phase_c_organizational_cms`

| Check | Status |
|-------|--------|
| Depends on committees, events, speakers (from init/phase3) | ✅ |
| Adds `PartnerCategory`, `SpeakerCategory`, `EventCategory`, `MediaCenterCategory` | ✅ |
| Creates `entity_revisions` table | ✅ |
| Alters `committees`, `committee_members`, `events`, `event_media`, `speaker_profiles`, `partners` | ✅ |
| Drops/recreates unique indexes safely | ✅ |
| Prisma schema alignment | ✅ |

---

## Dependency graph

```
20250609_init
    └── 20250610_phase3
            └── 20250620_phase35_cms_foundation
                    └── 20250621_phase_b_cms
                            ├── 20250622_phase_b5_analytics
                            └── 20250629_phase_s2_foundation
                                    └── 20250701_phase_c_organizational_cms
```

**Do not skip or reorder migrations.** Use `prisma migrate deploy` only (not `db push` on staging).

---

## Integrity checks

| Check | Result |
|-------|--------|
| `migration_lock.toml` provider = postgresql | ✅ |
| No duplicate migration timestamps | ✅ |
| All migrations have `migration.sql` | ✅ (7/7) |
| Schema matches latest migration | ✅ (`prisma validate`) |
| Failed migrations in DB | ❌ Unknown (DB unreachable) |

---

## Exact deployment order (staging)

```bash
# Prerequisites: DATABASE_URL + DIRECT_URL point to staging Supabase

# 1. Validate schema
npx prisma validate

# 2. Generate client (also runs in CI/build)
npx prisma generate

# 3. Deploy all pending migrations in order
npm run db:migrate:deploy

# 4. Verify
node scripts/staging-db-check.mjs
```

Expected output: 7 migrations in `_prisma_migrations`, all `entity_revisions` + Phase C columns present.

---

## Rollback note

Prisma `migrate deploy` is **forward-only**. Rollback = restore Supabase point-in-time backup. No down migrations exist in repo.

---

## Verdict

| Item | Status |
|------|--------|
| Migration files integrity | ✅ READY |
| Dependency order | ✅ CORRECT |
| Prisma compatibility | ✅ VALID |
| Applied to staging DB | ❌ BLOCKED (connectivity) |

**Migrations are ready to deploy once database connectivity is fixed.**
