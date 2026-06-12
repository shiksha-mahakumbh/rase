# SEO 95+ Plan — Phase S

**Date:** May 2026  
**Current SEO score:** 88/100  
**Target:** 95+/100  
**Status:** Roadmap only — no implementation

---

## Current state

| Capability | Score | Status |
|------------|------:|--------|
| Homepage CMS metadata | 95 | ✅ `generateMetadata` from CMS |
| Static metadata (90+ routes) | 85 | ✅ `PUBLIC_PAGE_META` |
| Sitemap | 90 | ✅ Static + CMS merge |
| Robots.txt | 95 | ✅ SEO engine |
| OpenGraph (homepage) | 90 | ✅ CMS `ogImageUrl` |
| Twitter cards (homepage) | 85 | ✅ CMS |
| Canonical (homepage) | 90 | ✅ CMS |
| hreflang | 30 | ❌ Partial |
| JSON-LD coverage | 70 | ⚠️ ~40% routes |
| Breadcrumbs (visual + schema) | 45 | ⚠️ Partial |
| Per-entity dynamic SEO | 40 | ❌ Only homepage |

---

## Schema implementation plan

### Tier 1 — Quick wins (S1, no new modules)

| Schema | Target routes | Implementation |
|--------|---------------|----------------|
| **WebSite** | Root layout | `url`, `name`, `publisher` |
| **SearchAction** | Root layout | `potentialAction` → `/downloads?search=` |
| **BreadcrumbList** | All `PublicPageShell` routes | Auto from `relatedPath` + slug |
| **Organization** | Root layout (enhance) | Logo, contact, sameAs socials from settings |
| **EducationalOrganization** | `/introduction` | Enhance existing JSON-LD |

**Score impact:** +3 points → 91

### Tier 2 — CMS metadata expansion (S1–S2)

| Task | Routes | Score impact |
|------|--------|-------------|
| `generateMetadata` from CMS SEO for noticeboard | 1 | +1 |
| `generateMetadata` from CMS SEO for downloads | 1 | +1 |
| Default OG image from site settings `logoUrl` | All CMS routes | +1 |
| hreflang `en` ↔ `hi` on homepage + introduction | 2 | +2 |
| Remove legacy stub page metadata (redirect-only) | 32 | +1 |

**Score impact:** +6 → 97 (theoretical max before content migration)

### Tier 3 — Content module schemas (S2–S3)

| Schema | Routes | Module |
|--------|--------|--------|
| **Article** / **NewsArticle** | 9 press + future articles | Articles CMS |
| **Person** | Committee + speakers | Phase C |
| **Event** | `/upcoming-events`, event detail | Events admin |
| **FAQPage** | Homepage + FAQ module | FAQ module |
| **VideoObject** | `/videos` | Media center |
| **ImageGallery** / **ImageObject** | `/gallery` | Gallery albums |
| **ItemList** | Events hubs, speakers list | Existing templates |

**Score impact:** sustains 95+ as content migrates

---

## Per-schema specification

### Organization (enhanced)

```json
{
  "@type": "Organization",
  "name": "Shiksha Mahakumbh",
  "url": "https://www.rase.co.in",
  "logo": "{from CMS settings}",
  "sameAs": ["{social links from settings}"],
  "contactPoint": {
    "@type": "ContactPoint",
    "telephone": "{from settings}",
    "contactType": "customer service",
    "areaServed": "IN",
    "availableLanguage": ["en", "hi"]
  }
}
```

**Source:** `SiteSetting` via CMS

### Event

- Homepage: existing `HomeJsonLd` — enhance with CMS event dates
- `/upcoming-events`: `Event` per item from events API
- Registration: `Event` with `offers` (registration URL, no price change)

### FAQ

- Homepage: dynamic from CMS `stats.faqs`
- Future FAQ page: `FAQPage` with `mainEntity` Question/Answer array

### Person

- Committee members: `name`, `jobTitle`, `image`, `worksFor`
- Speakers: `name`, `description`, `sameAs` (social), `image`

### Article / NewsArticle

- Press articles: `headline`, `datePublished`, `author`, `publisher`, `image`
- Notices: `NewsArticle` per notice (when standalone URLs added)

### VideoObject

- `/videos`: `name`, `description`, `thumbnailUrl`, `uploadDate`, `contentUrl`

### ImageObject / ImageGallery

- `/gallery`: `ImageGallery` with `associatedMedia` array from media albums

### BreadcrumbList

- Auto-generate from route segments + CMS page titles
- Inject in `PublicPageShell` when `breadcrumbs` prop provided

### EducationalOrganization

- `/introduction`: parent org DHE + SMK as subOrganization

---

## Metadata standardization

### Every public route must have

| Field | Source |
|-------|--------|
| `title` | CMS SEO or `PUBLIC_PAGE_META` |
| `description` | CMS SEO |
| `canonical` | CMS `canonicalUrl` or route default |
| `openGraph.title` | Same as title |
| `openGraph.description` | Same as description |
| `openGraph.image` | CMS `ogImageUrl` or site default |
| `openGraph.url` | Canonical |
| `openGraph.locale` | `en_IN` or `hi_IN` |
| `twitter.card` | `summary_large_image` |
| `twitter.title` | Same as title |
| `twitter.description` | Same as description |
| `twitter.image` | Same as OG image |
| `robots` | CMS `robotsMeta` or default index,follow |

### CMS SEO manager enhancements

1. Embed SEO panel in notice, download, page editors
2. Auto-suggest title from entity headline
3. OG/Twitter preview (already in SEO manager — extend to entity editors)
4. Sitemap inclusion toggle per entity (already in schema)
5. hreflang alternates editor per locale

---

## Sitemap & robots improvements

| Task | Priority |
|------|----------|
| Add notice standalone URLs (when detail pages built) | High |
| Remove legacy stub URLs from sitemap | High |
| Add `/hi` homepage to sitemap | High |
| Add CMS pages dynamically | Medium |
| Press articles from CMS (not static list) | Medium |
| `lastmod` from entity `updatedAt` | Medium |

---

## Pages missing schema (priority list)

### Critical (high traffic)

| Route | Missing schema |
|-------|----------------|
| `/registration` | Event + BreadcrumbList |
| `/press/*` (9) | BreadcrumbList (Article exists via static) |
| `/upcoming-events` | Event ItemList |
| `/keynotespeakers` | Person ItemList |
| `/committee/*` (5) | Person + BreadcrumbList |

### High

| Route | Missing |
|-------|---------|
| `/contact-us` | LocalBusiness/ContactPoint |
| `/gallery` | ImageGallery |
| `/videos` | VideoObject |
| `/introduction` | EducationalOrganization enhance |
| `/events`, `/workshops`, `/summits` | Event per item |

### Medium

All `PublicPageShell` routes without BreadcrumbList (~60 routes)

---

## Score projection

| Milestone | SEO score |
|-----------|----------:|
| Current | 88 |
| After S1 quick wins | 91 |
| After S2 CMS SEO embed | 93 |
| After S3 content schemas | 95 |
| After S4 full migration | 97 |

---

## Implementation priority

| # | Task | Effort | Impact |
|---|------|--------|--------|
| 1 | BreadcrumbList on PublicPageShell | 2 days | High |
| 2 | WebSite + SearchAction root JSON-LD | 1 day | Medium |
| 3 | CMS generateMetadata noticeboard/downloads | 1 day | High |
| 4 | Default OG image from settings | 0.5 day | Medium |
| 5 | hreflang en/hi homepage | 1 day | High |
| 6 | Remove stub page metadata | 1 day | Medium |
| 7 | Article schema template for press | 2 days | High |
| 8 | Event schema on upcoming-events | 2 days | High |
| 9 | SEO embed in entity editors | 3 days | High |
| 10 | Person schema (Phase C) | 5 days | High |

**Estimated S1+S2 duration:** 3–4 weeks to reach 93–95
