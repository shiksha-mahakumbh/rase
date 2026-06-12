# Phase B — Content Management Platform

**Status:** Implemented (backend APIs)  
**Date:** June 2026  
**Rule:** `REGISTRATION_BACKEND=firebase` · No Firebase cutover · No registration flow changes

---

## Modules delivered

| # | Module | Tables | Public API | Admin API |
|---|--------|--------|------------|-----------|
| 1 | Notice Board | `notices`, `notice_categories`, `notice_attachments` | `/api/v2/notices` | `/api/v2/admin/notices` |
| 2 | Homepage CMS | `pages`, `page_sections` (Phase A) | `/api/v2/homepage` | `/api/v2/admin/homepage` |
| 3 | Downloads Center | `downloads` (extended) | `/api/v2/downloads` | `/api/v2/admin/downloads` |
| 4 | Global Settings | `site_settings` | `/api/v2/settings` | `/api/v2/admin/settings` |
| 5 | Navigation | `menus`, `menu_items` | `/api/v2/menus` | `/api/v2/admin/menus` |
| 6 | Announcement Bar | `announcement_bars` | `/api/v2/announcement-bars` | `/api/v2/admin/announcement-bars` |

---

## Module 1 — Notice Board

**Service:** `src/server/services/notice.service.ts`

### Features
- CRUD, publish, archive, schedule, expire, pin
- Categories with slug filtering
- PDF/document attachments via `notice_attachments` + `media_assets`
- SEO via `seo_metadata` (NewsArticle JSON-LD)
- Homepage widget: `GET /api/v2/notices?widget=true&limit=5`

### Public routes
| Method | Path | Description |
|--------|------|-------------|
| GET | `/api/v2/notices` | List published notices |
| GET | `/api/v2/notices/[slug]` | Single notice + SEO |
| GET | `/api/v2/notices/categories` | Active categories |

### Admin routes
| Method | Path | Description |
|--------|------|-------------|
| GET/POST | `/api/v2/admin/notices` | List / create |
| GET/PATCH/DELETE | `/api/v2/admin/notices/[id]` | Manage (`action: publish` / `archive`) |
| GET/POST | `/api/v2/admin/notices/categories` | Category management |

**Dual-notice elimination:** Firebase `events` and hardcoded `NoticeBoard.tsx` remain until frontend wiring phase. Both should consume `/api/v2/notices` when connected.

---

## Module 2 — Homepage CMS

**Service:** `src/server/services/homepage.service.ts`

Uses `pages` with `page_type=homepage`, `slug=home`.

### Section keys
`hero`, `stats`, `counters`, `featured_events`, `featured_programs`, `testimonials`, `partners`, `announcements`, `cta`

### Routes
| Method | Path | Auth |
|--------|------|------|
| GET | `/api/v2/homepage` | Public |
| GET/PUT/PATCH | `/api/v2/admin/homepage` | Admin |
| PUT | `/api/v2/admin/homepage/sections` | Admin (single section) |

`PATCH { "action": "publish" }` publishes homepage and updates sitemap SEO.

---

## Module 3 — Downloads Center

**Service:** `src/server/services/download.service.ts` (extended)

### New fields
`slug`, `download_type`, `tags`, `version`, `is_current`, `status`, `expires_at`, `media_asset_id`

### Types
`brochure`, `report`, `guidelines`, `circular`, `poster`, `presentation`, `other`

### Routes
| Method | Path | Auth |
|--------|------|------|
| GET | `/api/v2/downloads` | Public (filter by type, category, tag) |
| GET | `/api/v2/downloads/[slug]` | Public |
| POST | `/api/v2/downloads/[id]/track` | Public (existing) |
| GET/POST | `/api/v2/admin/downloads` | Admin |
| GET/PATCH/DELETE | `/api/v2/admin/downloads/[id]` | Admin (replace via multipart PATCH) |

**Storage:** Supabase bucket `downloads`

---

## Module 4 — Global Settings

**Service:** `src/server/services/site-settings.service.ts`

### Managed fields
Organization name, tagline, logo, favicon, emails, phones, addresses, social links, copyright, footer, registration status, maintenance mode

### Cache
In-memory TTL cache (60s). Invalidated on `PUT /api/v2/admin/settings`.

| Method | Path | Auth |
|--------|------|------|
| GET | `/api/v2/settings` | Public (safe fields only) |
| GET/PUT | `/api/v2/admin/settings` | Admin |

---

## Module 5 — Navigation

**Service:** `src/server/services/menu.service.ts`

### Menu types
`header`, `footer`, `quick_links`, `mobile`

Parent-child hierarchy on `menu_items`. Seed defaults via `POST /api/v2/admin/menus { "action": "seed" }`.

| Method | Path | Auth |
|--------|------|------|
| GET | `/api/v2/menus?slug=header` or `?type=header` | Public |
| GET/POST | `/api/v2/admin/menus` | Admin |
| GET/PATCH | `/api/v2/admin/menus/[id]` | Admin |
| POST/PUT/DELETE | `/api/v2/admin/menus/[id]/items` | Admin |

---

## Module 6 — Announcement Bar

**Service:** `src/server/services/announcement-bar.service.ts`

### Bar types
`global`, `registration_alert`, `deadline_reminder`, `emergency`

| Method | Path | Auth |
|--------|------|------|
| GET | `/api/v2/announcement-bars` | Public (active only) |
| GET/POST | `/api/v2/admin/announcement-bars` | Admin |
| GET/PATCH/DELETE | `/api/v2/admin/announcement-bars/[id]` | Admin |

---

## Migration

```
prisma/migrations/20250621_phase_b_cms/migration.sql
```

Apply:
```bash
npm run db:migrate:deploy
npm run db:generate
```

RLS: `supabase/policies/phase_b.sql`

---

## What is NOT changed

- `REGISTRATION_BACKEND=firebase`
- Firebase registration routes
- Frontend pages (noticeboard, homepage, downloads UI still legacy)
- Phase C modules (Committee, Speaker, Partner, Event, Media Center)

---

## Staging checklist

- [ ] Apply migration `20250621_phase_b_cms`
- [ ] Apply RLS `phase_b.sql`
- [ ] Verify Supabase buckets: `downloads`, `media`
- [ ] Test notice CRUD + widget endpoint
- [ ] Test homepage section PUT + publish
- [ ] Test download upload + versioning
- [ ] Test settings cache invalidation
- [ ] Test menu seed + reorder
- [ ] Test announcement bar date windows
- [ ] Approve Phase C start
