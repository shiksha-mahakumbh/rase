# SEO Global Optimization Plan — Post B.7 Audit

**Date:** May 2026  
**Current SEO score:** 86/100 (B.6) → **88/100** (estimated post-audit)

---

## Current state

| Capability | Status |
|------------|--------|
| Homepage `generateMetadata` from CMS | ✅ |
| Static metadata (40+ routes) | ✅ |
| Layout-level metadata (60+ routes) | ✅ |
| `sitemap.xml` static + CMS merge | ✅ |
| `robots.txt` from SEO engine | ✅ |
| SEO admin manager | ✅ `/admin/cms/seo` |
| OpenGraph / Twitter (homepage) | ✅ via `metadataFromCmsSeo` |
| Canonical URLs (homepage) | ✅ CMS |

---

## Schema inventory

| Schema type | Implemented | Location | Missing on |
|-------------|-------------|----------|------------|
| **Organization** | ✅ | `config/site`, `HomeJsonLd` | — |
| **Event** | ✅ | `HomeJsonLd`, dept academic-council | Individual event pages |
| **FAQ** | ✅ | `HomeJsonLd` (dynamic from CMS) | Standalone FAQ page |
| **WebPage** | ✅ | Downloads | Most content pages |
| **CollectionPage** | ✅ | Noticeboard, events, media-center | — |
| **NewsArticle** | ✅ | Noticeboard (top 10) | Individual notices |
| **BreadcrumbList** | ⚠️ Partial | Committees, departments, knowledge, media archives | Press, events, registration |
| **Article** | ❌ | — | All 10 `/press/*` articles |
| **WebSite** | ❌ | — | Sitewide search action |
| **SearchAction** | ❌ | — | Homepage |
| **VideoObject** | ❌ | — | `/videos` |
| **ImageGallery** | ❌ | — | `/gallery` |
| **Person** | ❌ | — | Keynote speakers, committee |
| **EducationalOrganization** | ⚠️ Partial | Introduction JSON-LD | Entity pages |

---

## Pages missing schema (priority)

### Critical

| Route | Recommended schema |
|-------|-------------------|
| `/press/*` (10 articles) | `Article` + `BreadcrumbList` |
| `/registration` | `Event` (registration) + `BreadcrumbList` |
| `/keynotespeakers` | `Person` × N + `ItemList` |
| `/committee/*` (5) | `Person` + `Organization` + `BreadcrumbList` |

### High

| Route | Recommended schema |
|-------|-------------------|
| `/events`, `/workshops`, `/summits` | `Event` per item in `ItemList` |
| `/upcoming-events` | `Event` |
| `/gallery` | `ImageGallery` |
| `/videos` | `VideoObject` per video |
| `/noticeboard` | Per-notice `NewsArticle` on detail (future) |

### Medium

| Route | All knowledge graph pillars | `BreadcrumbList` + `WebPage` |
| Route | Legal pages | `WebPage` only |
| Route | Publications | `ScholarlyArticle` or `Book` |

---

## Metadata gaps

| Gap | Routes affected | Fix |
|-----|-----------------|-----|
| Static metadata only | noticeboard, downloads | `generateMetadata` from CMS SEO entity |
| No OpenGraph image per page | ~90% routes | CMS `ogImageUrl` or default OG |
| No Twitter card override | ~90% routes | CMS SEO manager |
| No canonical per page | ~85% routes | CMS `canonicalUrl` |
| No hreflang | Non-locale routes | `hreflangAlternates` in SEO table |
| Root layout duplicates homepage | All pages inherit | Acceptable; pages override |

---

## Implementation plan (stabilization only)

### Phase S1 — Quick wins (no new modules)

1. Add `WebSite` + `SearchAction` to root layout JSON-LD
2. Add `BreadcrumbList` to `PublicPageShell` when `relatedPath` set
3. Wire `generateMetadata` for `/noticeboard` and `/downloads` from CMS SEO
4. Add `Article` JSON-LD template for press layout (static until CMS)

### Phase S2 — CMS SEO expansion

1. Embed SEO panel in notice editor + download editor
2. Auto-generate sitemap entries on publish (already in SEO service)
3. Default OG image from site settings `logoUrl`

### Phase S3 — Deferred to Phase C/D

- Event schema per edition
- Person schema for speakers/committee
- Video/Image gallery schema
- Press CMS with Article schema auto-generation

---

## hreflang plan

| Locale | Route | Status |
|--------|-------|--------|
| `en` | Default | ✅ |
| `hi` | `/[locale]/*` | ⚠️ Partial next-intl |
| Future | `ta`, `te`, etc. | ❌ Not planned |

**Action:** Populate `hreflangAlternates` in `seo_metadata` for homepage + introduction.

---

## robots & sitemap

| Item | Status |
|------|--------|
| Admin routes blocked | ✅ `noindex` |
| Datadekh blocked | ✅ `noindex` |
| API routes disallowed | ✅ robots.txt |
| CMS pages in sitemap | ✅ `generateSitemapIndex()` |
| Downloads in sitemap | ✅ Added B.6 |
| Press articles in sitemap | ✅ Static paths |
| Dynamic notice URLs | ⚠️ Hash-only (`#slug`), not standalone URLs |

---

## Target scores

| Milestone | SEO score |
|-----------|----------:|
| Current | 88 |
| After S1 quick wins | 91 |
| After S2 CMS SEO embed | 93 |
| After Phase C/D | 97 |
