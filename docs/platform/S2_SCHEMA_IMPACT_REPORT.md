# S2 Schema Impact Report

**Date:** May 2026  
**Impact level:** LOW–MEDIUM · **Breaking changes:** None (additive only)

---

## Prisma changes

### Enum extensions

| Enum | Addition | Risk |
|------|----------|------|
| `PageType` | `article`, `department` | None — additive |
| NEW `AlbumType` | `gallery`, `homepage`, `edition`, `press` | New enum |
| NEW `FaqStatus` | `draft`, `published`, `archived` | New enum |

### New models (4)

| Model | Purpose | Est. rows at seed |
|-------|---------|------------------|
| `FaqCategory` | FAQ taxonomy | 3 |
| `Faq` | FAQ items | 15 |
| `MediaAlbum` | Photo galleries | 5 |
| `MediaAlbumItem` | Album images | 40 |

### Unchanged models (use existing)

| Model | S2 usage |
|-------|----------|
| `Page` | Press, legal, departments |
| `PageSection` | Article sections, department blocks |
| `SeoMetadata` | Per-article SEO |
| `MediaAsset` | Album item references |
| `ContactMessage` | Inbox (no schema change) |
| `Feedback` | Inbox (no schema change) |
| `SiteSetting` | Hindi row |

---

## Migration SQL summary

```sql
-- AlterEnum PageType: add article, department
-- CreateEnum AlbumType, FaqStatus
-- CreateTable faq_categories, faqs, media_albums, media_album_items
-- CreateIndex on faqs(is_featured, locale), media_albums(slug, locale)
```

**No drops. No column renames. No FK changes to registration tables.**

---

## API surface additions

| Endpoint | Method | Auth |
|----------|--------|------|
| `/api/v2/admin/faq/categories` | GET, POST | Admin |
| `/api/v2/admin/faq/categories/[id]` | PATCH, DELETE | Admin |
| `/api/v2/admin/faq` | GET, POST | Admin |
| `/api/v2/admin/faq/[id]` | PATCH, DELETE | Admin |
| `/api/v2/admin/media-albums` | GET, POST | Admin |
| `/api/v2/admin/media-albums/[id]` | PATCH, DELETE | Admin |
| `/api/v2/admin/media-albums/[id]/items` | POST, PUT | Admin |
| `/api/v2/admin/contact/[id]` | PATCH | Admin |
| `/api/v2/admin/feedback/[id]` | PATCH | Admin |
| `/api/v2/faq` | GET | Public |
| `/api/v2/media-albums` | GET | Public |
| `/api/v2/media-albums/[slug]` | GET | Public |

---

## RLS policy additions needed (deploy time)

| Table | Policy |
|-------|--------|
| `faq_categories` | Public read active; admin ALL |
| `faqs` | Public read published; admin ALL |
| `media_albums` | Public read published; admin ALL |
| `media_album_items` | Public read via album; admin ALL |

File: `supabase/policies/s2_content.sql` (to create at deploy)

---

## Data volume estimates

| Table | Year 1 est. |
|-------|------------|
| faqs | 50 |
| media_albums | 20 |
| media_album_items | 500 |
| pages (new) | 19 (9 press + 5 legal + 5 dept) |

**No impact on visitor_* or registration tables.**

---

## Deprecation plan (no S2 action)

| Model | Action |
|-------|--------|
| `Announcement` (legacy) | Deprecate post-S2 |
| `EventMedia` | Merge in Phase C |
| `Sponsor`/`Partner` unused | Activate Phase C |

---

## Rollback

```bash
# Reverse migration removes new tables only
# Existing Page, Notice, Download data unaffected
npx prisma migrate resolve --rolled-back <migration_name>
```

**Schema impact: APPROVED for S2 implementation**
