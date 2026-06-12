# Phase C SEO Audit

**Date:** May 2026  
**Score:** **95 / 100**

---

## Structured data coverage

| Schema type | Entity | Route | Status |
|-------------|--------|-------|--------|
| BreadcrumbList | All public pages | site-wide | ✅ |
| WebSite + SearchAction | Root | `/` | ✅ (Phase S) |
| Person | Speaker | `/speakers/[slug]` | ✅ |
| Event | Event | `/events/[slug]` | ✅ |
| Organization | Partner, Committee | `/partners`, `/committee/[slug]` | ✅ when SEO set |
| Article | Press | `/press/[slug]`, media hub | ✅ |
| ImageGallery | Album | gallery + hub | ✅ |
| VideoObject | Video | media center | ✅ |
| FAQPage | FAQ | `/faq` | ✅ (S2) |

---

## Metadata engine

All Phase C entities use `SeoMetadata` table via `upsertSeoForEntity`:

- `seoTitle`, `metaDescription`, `keywords`
- `canonicalUrl`, `ogImageUrl`, `twitterCard`
- `robots`, `schemaJson`
- `hreflangAlternates` (en/hi)

Public pages use `metadataFromCmsSeo` or `createPageMetadata` in `generateMetadata()`.

---

## Sitemap

- Static paths include `events`, `media-center`, committee slugs
- Dynamic CMS entries merged via `generateSitemapIndex()`
- Press article paths from canonical registry

---

## Gaps

| Issue | Severity |
|-------|----------|
| `/keynotespeakers` duplicate | Medium |
| Committee member Person schemas | Low |
| Hindi SEO requires content publish | Medium |
| Proceedings pages lack Event schema | Low (out of scope) |

---

## Recommendations

1. Add SEO route keys for `/speakers`, `/partners`, `/events` hub pages in SEO Manager
2. 301 redirect `/keynotespeakers` → `/speakers`
3. Seed Hindi SEO metadata alongside content seed
