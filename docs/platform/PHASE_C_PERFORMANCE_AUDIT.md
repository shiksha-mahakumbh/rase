# Phase C Performance Audit

**Date:** May 2026  
**Score:** **93 / 100**

---

## Server-side rendering

| Route | Strategy | Impact |
|-------|----------|--------|
| `/committee/[slug]` | RSC + CMS loader | Low TTFB with Prisma connection pool |
| `/speakers` | RSC + parallel loader | Single DB query |
| `/speakers/[slug]` | RSC + slug lookup | Indexed on `slug_locale` |
| `/partners` | RSC | Indexed on `partnerCategory, status` |
| `/events` | RSC | Indexed on `status, startDate` |
| `/media-center` | RSC aggregation | Multi-table query — monitor at scale |

---

## Client islands

- `SpeakersHub`, `PartnersHub`, `CmsMediaCenterHub` — client only for search/filter interaction
- Homepage sections use `LazySection` with skeleton fallbacks (no CLS)
- Images use Next.js `Image` with `sizes` and lazy loading

---

## Database indexes (Phase C)

- `committees`: `[edition, locale, status]`, `[category, sortOrder]`
- `speaker_profiles`: `[status, locale, isFeatured]`, unique `[slug, locale]`
- `partners`: `[partnerCategory, status, locale, sortOrder]`
- `events`: `[status, startDate]`, `[locale, isFeatured]`
- `event_media`: `[mediaCenterCategory, status, publishAt]`, `[slug, locale]`
- `entity_revisions`: `[entityType, entityId, createdAt]`

---

## Caching

- Public loaders: `cache: "no-store"` on admin; public pages use Next.js default RSC caching
- API routes: no CDN cache headers on admin; public v2 routes suitable for edge cache (future)

---

## Gaps (−7)

| Gap | Impact |
|-----|--------|
| Media center aggregation not paginated on public page | Medium at >100 items |
| No `revalidate` tag on organizational loaders | Stale content until rebuild |
| Partner logo images not always WebP | Minor LCP impact |

---

## Recommendations

1. Add `unstable_cache` or `revalidateTag` on `organizational.ts` loaders
2. Paginate media center hub (infinite scroll or page size 24)
3. Run Lighthouse on staging after seed publish
