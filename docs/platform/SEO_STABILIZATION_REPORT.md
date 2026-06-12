# SEO Stabilization Report — Phase S

**Date:** May 2026  
**Pre-S SEO:** 88 · **Post-S1 SEO:** 93 (est.) · **Target:** 92+ ✅

---

## Implemented

| # | Item | Status | File |
|---|------|--------|------|
| 1 | WebSite JSON-LD | ✅ | `components/seo/SiteJsonLd.tsx` |
| 2 | SearchAction JSON-LD | ✅ | Embedded in WebSite schema |
| 3 | BreadcrumbList JSON-LD | ✅ | `PublicPageShell` breadcrumbs prop |
| 4 | Organization JSON-LD | ✅ Verified | `config/site.ts`, `HomeJsonLd` |
| 5 | Noticeboard metadata | ✅ | `generateMetadata` + CMS route SEO |
| 6 | Downloads metadata | ✅ | `generateMetadata` + CMS route SEO |
| 7 | Dynamic OG image fallback | ✅ | `loadDefaultOgImage()` from settings |
| 8 | Canonical validation | ✅ | `metadataFromCmsSeo` + `createPageMetadata` |
| 9 | Robots validation | ✅ | `getRobotsConfig()` — unchanged, verified |
| 10 | Sitemap validation | ✅ | `generateSitemapIndex()` — unchanged, verified |

---

## Schema inventory post-S1

| Schema | Routes |
|--------|--------|
| WebSite + SearchAction | All pages (root layout) |
| Organization | Homepage + global |
| Event | Homepage |
| FAQPage | Homepage (CMS FAQs) |
| BreadcrumbList | noticeboard, downloads + existing routes |
| CollectionPage + NewsArticle | noticeboard |
| WebPage | downloads |
| NewsArticle | Press (static, 9 routes) |

---

## Metadata enhancements

### `createPageMetadata()` updates

- hreflang `en-IN` / `hi-IN` for paired routes
- `ogImageUrl` override parameter
- `locale: en_IN` on OpenGraph
- OG image dimensions 1200×630

### `metadataFromCmsSeo()` updates

- hreflang from canonical path
- robots from CMS `robots` field
- OG locale `en_IN`
- Settings logo as OG fallback

### Route SEO loader

```typescript
loadRouteSeo("noticeboard" | "downloads")  // entityType: route
```

CMS admins can add SEO via `/admin/cms/seo` with entityType `route`.

---

## hreflang coverage

| Route | en-IN | hi-IN |
|-------|-------|-------|
| `/` | ✅ | ✅ `/hi` |
| `/introduction` | ✅ | ✅ |
| `/registration` | ✅ | ✅ |
| `/contact-us` | ✅ | ✅ |
| `/noticeboard` | ✅ canonical only | — (no hi route) |
| `/downloads` | ✅ canonical only | — |

---

## Remaining SEO gaps (S2+)

| Gap | Priority |
|-----|----------|
| Press BreadcrumbList | High |
| Person schema (committee/speakers) | Phase C |
| Event schema on `/upcoming-events` | High |
| Article schema auto from CMS | S2 |
| 32 legacy stub metadata removal | Medium |
| Per-notice standalone URLs in sitemap | Medium |

---

## Validation checklist

- [x] Homepage CMS metadata preserved
- [x] WebSite schema validates (schema.org validator)
- [x] SearchAction target URL `/downloads?search={search_term_string}`
- [x] Canonical URLs absolute via `SITE_URL`
- [x] robots.txt disallows `/admin`, `/api/`, datadekh
- [x] sitemap includes noticeboard, downloads
- [ ] Live GSC submission (deploy task)
