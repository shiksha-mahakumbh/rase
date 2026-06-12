# Phase 3.5 — Core CMS Foundation

**Status:** Phase A implemented (backend only)  
**Date:** June 2026  
**Rule:** No Firebase changes · No frontend wiring · `REGISTRATION_BACKEND=firebase`

---

## Phase A deliverables

### 1. Dynamic Pages CMS

| Table | Purpose |
|-------|---------|
| `pages` | title, slug, page_type, locale, content, status, publish_at |
| `page_sections` | Modular sections (hero, cta, stats, etc.) |
| `page_revisions` | Version history on every update |

**Service:** `src/server/services/page.service.ts`

| Method | Path | Auth |
|--------|------|------|
| GET | `/api/v2/pages` | Public |
| GET | `/api/v2/pages/[slug]` | Public |
| GET/POST | `/api/v2/admin/pages` | Admin |
| GET/PATCH/DELETE | `/api/v2/admin/pages/[id]` | Admin |
| PUT | `/api/v2/admin/pages/[id]/sections` | Admin |
| GET | `/api/v2/admin/pages/[id]/revisions` | Admin |

**Admin actions:** create, edit, delete, publish (`action: publish`), archive (`action: archive`), schedule via `publishAt`.

---

### 2. Global SEO Engine

| Table | Purpose |
|-------|---------|
| `seo_metadata` | Polymorphic SEO for any entity + locale |

**Service:** `src/server/services/seo.service.ts`

**JSON-LD generators:**
- Organization
- Event
- FAQPage
- BreadcrumbList
- NewsArticle
- WebPage

| Method | Path | Auth |
|--------|------|------|
| GET | `/api/v2/seo/[entityType]/[entityId]` | Public |
| GET | `/api/v2/seo/sitemap` | Public (CMS sitemap entries) |
| GET | `/api/v2/seo/robots` | Public (robots config) |
| GET/PUT/DELETE | `/api/v2/admin/seo/[entityType]/[entityId]` | Admin |

**Fields:** title, description, keywords, canonical, robots, OG, Twitter, schema JSON-LD, hreflang, sitemap flags.

---

### 3. Media Library

| Table | Purpose |
|-------|---------|
| `media_folders` | Hierarchical folders |
| `media_assets` | Files with tags, versioning, usage tracking |

**Service:** `src/server/services/media-library.service.ts`  
**Storage bucket:** Supabase `media`

| Method | Path | Auth |
|--------|------|------|
| POST | `/api/v2/media/[id]/usage` | Public (track usage) |
| GET/POST | `/api/v2/admin/media-library` | Admin |
| GET/PATCH/DELETE | `/api/v2/admin/media-library/[id]` | Admin |
| GET/POST | `/api/v2/admin/media-library/folders` | Admin |

**Features:** upload, replace (versioning), delete, search, tags, folders, signed URLs, usage count.

---

## Migration

```
prisma/migrations/20250620_phase35_cms_foundation/migration.sql
```

Apply:
```bash
npm run db:migrate:deploy
npm run db:generate
```

---

## Translation-ready

All new tables include `locale` (`ContentLocale`: en, hi, es, fr, ar, ru).  
Phase B+ modules will reuse `seo_metadata` and `content_translations` pattern.

---

## What is NOT changed

- Firebase registration (`REGISTRATION_BACKEND=firebase`)
- Frontend pages (homepage, noticeboard still hardcoded/Firebase)
- Existing `/api/registration/*` routes
- `src/app/sitemap.ts` (CMS sitemap via `/api/v2/seo/sitemap` for future merge)

---

## Next: Phase B (after staging verification)

1. Notice Board → uses `media_assets` for attachments
2. Homepage CMS → `pages` with `page_type=homepage` + sections
3. Downloads Center → `/downloads` public page + admin

---

## Apply to staging checklist

- [ ] Run migration `20250620_phase35_cms_foundation`
- [ ] Create Supabase Storage bucket `media`
- [ ] Test `POST /api/v2/admin/pages` with `x-ops-secret`
- [ ] Test `PUT /api/v2/admin/seo/page/{id}`
- [ ] Test media upload to library
- [ ] Approve Phase B start
