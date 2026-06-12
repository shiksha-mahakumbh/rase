# Final SEO Master Audit

**Date:** May 2026  
**Auditor role:** SEO Architect  
**Target:** 97+  
**Current score:** **86 / 100**  
**Maximum achievable (pre-Phase D):** **96 / 100**

---

## Infrastructure assessment

| Component | Status | File(s) |
|-----------|--------|---------|
| Central metadata builder | ✅ Strong | `src/lib/seo/metadata.ts` |
| CMS metadata bridge | ✅ | `src/lib/seo/cms-metadata.ts` |
| SEO persistence | ✅ | `SeoMetadata` + `seo.service.ts` |
| Sitemap | ⚠️ Gaps | `src/app/sitemap.ts` + `generateSitemapIndex()` |
| Robots | ✅ | `src/app/robots.ts` |
| Canonical URLs | ✅ Most routes | `createPageMetadata()` |
| OpenGraph | ⚠️ Weak on some routes | Default `sLogo.png` as OG image |
| Twitter cards | ✅ Via metadata builder | `metadata.ts` |
| BreadcrumbList JSON-LD | ✅ Widespread | `BreadcrumbJsonLd.tsx` |
| hreflang | ⚠️ Only 4 pairs | `src/lib/seo/hreflang.ts` |
| WebSite + SearchAction | ✅ | Root `layout.tsx` `SiteJsonLd` |

---

## Route metadata coverage

| Category | Count | Metadata type |
|----------|------:|---------------|
| `generateMetadata()` (dynamic/CMS) | 13 patterns | Async, CMS-aware |
| Static `export const metadata` (page) | ~25 | `createPageMetadata` |
| Layout-level metadata | ~120 | `createPageMetadata`, `createPillarMetadata`, `PUBLIC_PAGE_META` |
| **No dedicated metadata** | **6 routes** | Inherit root layout only |
| Admin/data routes | 37 | `NO_INDEX_META` |

### Routes WITHOUT dedicated metadata (HIGH risk)

| Route | Issue |
|-------|-------|
| `/BatonCeremony` | Root default title/description |
| `/ResidentialCamp` | Root default |
| `/heiprojectdisplaysubmission` | Root default |
| `/schoolprojectdisplaysubmission` | Root default |
| `/registration/Accomodation` | Root default |
| `/addkeynotespeaker`, `/addvcdirector`, `/addwishesreceived` | Should be noindex |

---

## Per-route SEO scores (representative)

| Route | Meta | Canonical | OG | Schema | Sitemap | Score |
|-------|------|-----------|-----|--------|---------|------:|
| `/` | ✅ CMS | ✅ | ✅ | Org+Event+FAQ | ✅ | 95 |
| `/hi` | ✅ | ✅ | ⚠️ locale | Org+Event+FAQ | ❌ | 82 |
| `/speakers` | ✅ static | ✅ | ✅ | Breadcrumb only | ❌ | 78 |
| `/speakers/[slug]` | ✅ CMS | ✅ | ✅ | Person+Breadcrumb | CMS merge | 94 |
| `/keynotespeakers` | ✅ layout | ✅ | ✅ | **None** | ✅ duplicate | 65 |
| `/partners` | ✅ static | ✅ | ✅ | ItemList+Breadcrumb | ❌ | 80 |
| `/events` | ⚠️ bare meta | ✅ | ❌ | CollectionPage | ✅ | 72 |
| `/events/[slug]` | ✅ CMS | ✅ | ✅ | Event+Breadcrumb | CMS merge | 94 |
| `/committee/[slug]` | ✅ CMS/legacy | ✅ | ✅ | Breadcrumb | ✅ static | 88 |
| `/media-center` | ✅ layout | ✅ | ✅ | **None** | ✅ | 75 |
| `/press/[slug]` | ✅ CMS/legacy | ✅ | ✅ | NewsArticle | ✅ | 90 |
| `/noticeboard` | ✅ CMS | ✅ | ✅ | CollectionPage+NewsArticle | ✅ | 92 |
| `/downloads` | ✅ CMS | ✅ | ✅ | — | ✅ | 88 |
| `/education` (pillars) | ✅ | ✅ | ✅ | WebPage+ItemList | ✅ | 90 |
| `/past-events` | ✅ layout | ✅ | ✅ | EventSeries (wrong URL `/pastevent`) | ✅ | 80 |
| `/registration` | ✅ | ✅ | ✅ | Event+FAQ | ✅ | 92 |
| Legal pages | ✅ CMS/fallback | ✅ | ✅ | — | ✅ | 90 |

---

## Structured data inventory

| Schema | Routes with schema | Missing on |
|--------|-------------------|------------|
| BreadcrumbList | ~80% public routes | `/keynotespeakers`, some legacy |
| Person | `/speakers/[slug]` | `/speakers` hub, `/keynotespeakers`, committee members |
| Event | `/events/[slug]`, home, registration | `/events` hub items from CMS |
| Organization | Home, introduction, registration | Partners detail pages |
| Article/NewsArticle | Press articles, noticeboard | Media center articles |
| FAQPage | Home, registration | Department pages |
| ImageGallery | Gallery (partial) | Media center photo hub |
| VideoObject | — | Media center videos |
| CollectionPage | Events, knowledge, publications | `/speakers`, `/partners` |
| WebSite+SearchAction | Root | — |

---

## Critical SEO issues

### Duplicate / canonical conflicts

| Issue | Routes | Severity |
|-------|--------|----------|
| `/keynotespeakers` vs `/speakers` | Both indexable, similar content | **High** |
| Legacy `/Press1`–`/Press9` vs `/press/*` | Duplicate metadata pre-redirect | Medium |
| `/VibhagRoute/*` vs `/departments/*` | Duplicate until redirect | Medium |
| `/contact-us` vs `/hi/ContactUs` | Casing mismatch in hreflang | Medium |

### Sitemap gaps

Missing from `STATIC_PATHS` in `sitemap.ts`:
- `/speakers`, `/partners`
- All Hindi URLs (`/hi`, `/hi/introduction`, `/hi/registration`, `/hi/ContactUs`)
- Dynamic CMS slugs depend on `generateSitemapIndex()` merge only

### Meta quality gaps

- `/events` hub: no OG/Twitter/robots via `createPageMetadata`
- Default OG image `sLogo.png` claimed as 1200×630 — likely wrong dimensions
- `cms-metadata.ts` hardcodes `openGraph.locale: "en_IN"` for Hindi content
- Root `<html lang="en-IN">` fixed; Hindi only on inner `<div>`

### Schema gaps

- `/keynotespeakers` — no JSON-LD
- `/media-center` — no route-level JSON-LD
- `PastEditionsJsonLd` uses `/pastevent` instead of `/past-events`
- CMS entities without SEO seed get generic `WebPage` fallback

---

## Missing alt tags (content audit cross-ref)

| Area | Status |
|------|--------|
| CMS gallery/albums | ✅ `altText` field enforced in admin |
| Speaker photos | ✅ alt from `fullName` |
| Partner logos | ⚠️ Often `alt={name}` but decorative logos may need `alt=""` |
| Legacy press images | ⚠️ Inconsistent in legacy TSX |
| Homepage carousel | ✅ alt in slides-data |
| Media archive thumbnails | ⚠️ Some missing in `media-archives.ts` |

---

## Path to 97+

| Fix | Score impact | Effort |
|-----|-------------|--------|
| 301 `/keynotespeakers` → `/speakers` | +3 | 2h |
| Full `createPageMetadata` on `/events` hub | +2 | 1h |
| Add `/speakers`, `/partners`, `/hi/*` to sitemap | +2 | 2h |
| noindex orphan form routes | +1 | 1h |
| `ItemList`/`CollectionPage` on `/speakers` hub | +2 | 3h |
| VideoObject on media center videos | +1 | 4h |
| Fix `PastEditionsJsonLd` canonical URLs | +1 | 1h |
| Per-locale `html lang` + OG locale | +2 | 1 day |
| Seed SEO metadata for all CMS entities | +3 | 2 days |

**Estimated time to 97:** 4–5 days focused SEO sprint
