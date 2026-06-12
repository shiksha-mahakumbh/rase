# Phase C — Media Center Module

**Wave:** C.5  
**Service:** `src/server/services/media-center.service.ts`

---

## Design principle

Media Center is a **unified hub** — no duplicate storage tables. It aggregates:

| Source | Category |
|--------|----------|
| `Page` (type `article`) | Press releases, articles |
| `MediaAlbum` | Photo galleries |
| `EventMedia` | Videos, news, media mentions, interviews, publications |

---

## Capabilities

- Admin CRUD for `EventMedia` hub entries with `mediaCenterCategory`
- Search, filters (category, locale, featured, status)
- Tags, edition, featured flag
- Publish / archive
- Locale (`en`, `hi`)
- Article, ImageGallery, VideoObject schema via SEO layer
- Audit + revisions

---

## Admin

| Route | Features |
|-------|----------|
| `/admin/cms/media-center` | Unified list across hub item types |
| `/admin/cms/media-center/[id]` | Edit media entry |

**APIs:** `/api/v2/admin/media-center`, `/api/v2/admin/media-center/[id]`

Press articles and photo galleries remain managed in **Articles** and **Gallery** admin modules; Media Center reads them at query time.

---

## Public

| Route | Behavior |
|-------|----------|
| `/media-center` | CMS hub with search/filters; fallback to `MediaCenter` client archive |
| `/media/[edition]/[year]/[type]` | Legacy archive routes (unchanged) |

**Component:** `CmsMediaCenterHub.tsx`  
**Loader:** `loadCmsMediaCenter` in `src/lib/cms/organizational.ts`

---

## SEO

- `generateMetadata()` on hub
- VideoObject for video entries
- Article schema for press items
- ImageGallery for photo album aggregations
- BreadcrumbList: Home → Media Center
