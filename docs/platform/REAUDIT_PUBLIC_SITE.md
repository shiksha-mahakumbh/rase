# Re-Audit — Public Website (Phase S)

**Date:** May 2026  
**Scope:** All public-facing routes after Phase B.7 + stabilization audit  
**Production:** https://www.rase.co.in  
**Status:** Documentation only — no implementation

---

## Executive summary

| Metric | Value |
|--------|------:|
| Total `page.tsx` routes | 189 |
| Public content routes | 118 |
| Legacy redirect stubs | 32 |
| Admin routes | 17 |
| Datadekh (noindex) | 22 |
| **CMS-wired page routes** | **3** (`/`, `/noticeboard`, `/downloads`) |
| **Hardcoded content estimate** | **~55%** of public routes |
| Platform content score | **72/100** |

The public site is production-viable for homepage, noticeboard, and downloads. Global chrome (nav, footer, ticker, modal) is CMS-backed via `/api/v2`. The remaining ~115 content routes require code deploy for any content change.

---

## Route inventory by category

| Category | Count | CMS % | Primary data source |
|----------|------:|------:|---------------------|
| Homepage & i18n | 5 | 40 | CMS (`/`) + next-intl (`/[locale]`) |
| CMS-backed public | 2 | 100 | Supabase v2 |
| Legal / policies | 5 | 0 | Hardcoded TSX |
| Registration | 9 | 0 | Firebase (unchanged) |
| Knowledge pillars | 15 | 0 | `pillar-registry.ts` |
| Entity directories | 7 | 0 | `entity-directories.ts` |
| Publication subtypes | 4 | 0 | `PublicationTypePage` template |
| Events & conferences | 14 | 0 | `conference-catalog.ts` |
| Committees | 6 | 0 | Inline member arrays |
| Departments | 5 | 0 | `DepartmentPage` + HC data |
| Press & media | 12 | 0 | Inline TSX + static registry |
| Programs & submissions | 13 | 0 | Mixed HC + Firebase |
| General content | 20 | 5 | HC + partial CMS chrome |
| Legacy redirect stubs | 32 | — | 301 redirects |

---

## Hardcoded content map

### Central registries (single source, code-deploy only)

| File | Consumed by | Content |
|------|-------------|---------|
| `src/data/authority.ts` | Footer, trust strip, stats fallbacks | Partners, editions, success stories |
| `src/lib/knowledge-graph/conference-catalog.ts` | `/events`, `/workshops`, `/summits` | Event catalog |
| `src/lib/content/registry.ts` | `/knowledge` | Hub cards |
| `src/lib/knowledge-graph/pillar-registry.ts` | 15 pillar routes | Pillar copy + links |
| `src/lib/knowledge-graph/entity-directories.ts` | 7 entity routes | Directory listings |
| `src/lib/page-heroes.ts` | 49+ `PublicPageShell` routes | Hero titles/images |
| `src/lib/seo/publicPages.ts` | 90+ layouts | Static metadata |

### Large inline page data

| Route group | Pattern | Deploy risk |
|-------------|---------|-------------|
| `/press/*` (9 articles) | `"use client"` + inline `sections[]` | High — every edit = PR |
| `proceeding2/page.tsx` | ~615 lines inline data | Critical bundle size |
| `proceeding3/page.tsx` | Similar inline proceedings | Critical |
| `/committee/*` (5 editions) | Inline member arrays | High |
| `/keynotespeakers` | HC array + Firestore fetch | Dual source |

### CMS with hardcoded fallbacks

| Component | Fallback |
|-----------|----------|
| `NoticeBoard.tsx` | `FALLBACK_NOTICES` inline array |
| `Marquees.tsx` | `FALLBACK_TICKER` inline array |
| Homepage sections | `authority.ts` when CMS section empty |

---

## Duplicated & outdated content

### Legacy redirect stubs (32 routes)

Still have `layout.tsx` + metadata alongside canonical routes — duplicate SEO surface.

| Legacy | Canonical |
|--------|-----------|
| `/Press1`–`/Press9` | `/press/*` (9 articles) |
| `/Press_Release` | `/press` |
| `/ContactUs`, `/Best_Wishes` | `/contact-us`, `/best-wishes` |
| `/pastevent`, `/upcomingevent` | `/past-events`, `/upcoming-events` |
| `/committeepage` | `/committees` |
| `/media` | `/media-center` |
| `/VibhagRoute/*24` (5) | `/departments/*` |
| 8 print/digital media slugs | `/media/{edition}/{year}/{type}` |

### Path duplicates

- `/Topics`, `/TalkShow`, `/BatonCeremony` — legacy casing
- `/registration/Accomodation` vs `/accommodation`
- Root layout metadata duplicates homepage fallback

### Outdated patterns

- 22 datadekh pages — Firestore admin tables (noindex, legacy)
- `KeynoteSpeakers.tsx` — Firestore + hardcoded fallback
- Press articles use legacy `Press1`–`Press9` component imports internally

---

## SEO gaps

### Metadata coverage

| Type | Routes | Count |
|------|--------|------:|
| CMS `generateMetadata` | `/` only | 1 |
| Static `generateMetadata` (i18n) | `/[locale]/*` | 4 |
| Static `export const metadata` | Majority | 90+ |
| CMS content + static SEO | noticeboard, downloads | 2 |

**Gap:** Noticeboard and downloads have CMS content but static SEO metadata.

### JSON-LD coverage

| Schema | Present | Missing |
|--------|---------|---------|
| Organization | Homepage | — |
| Event | Homepage | `/upcoming-events`, individual events |
| FAQ | Homepage (CMS) | Standalone FAQ |
| NewsArticle | Noticeboard top 10, press (static) | Per-notice detail URLs |
| BreadcrumbList | ~40% routes | PublicPageShell routes, press |
| Article | — | All press articles |
| Person | — | Committee, speakers |
| VideoObject | — | `/videos` |
| ImageGallery | — | `/gallery` |
| EducationalOrganization | Introduction partial | Entity pages |
| WebSite + SearchAction | — | Sitewide |

### Canonical & sitemap

- Strong on routes using `createPageMetadata()` / `PUBLIC_PAGE_META`
- Weak on legacy stubs (still indexable until removed)
- Notice URLs are hash-only (`#slug`) — not in sitemap as standalone pages
- hreflang: partial on `/[locale]` only

---

## Accessibility gaps

| Issue | Severity | Routes affected |
|-------|----------|-----------------|
| Nav CTA `text-[10px]` — below 44px touch target | High | Global |
| Marquee no pause control | Medium | Homepage, partners |
| `prefers-reduced-motion` not on marquees | Medium | Global |
| Committee images missing descriptive alt | High | `/committee/*` |
| Modal focus trap incomplete | Medium | `ClientChrome` announcement |
| Empty `alt=""` on decorative images | Low | Marquees, event cards |

**Strengths:** Skip link, `#main-content`, accordion keyboard, focus-visible on CTAs.

---

## Mobile gaps

| Issue | Severity | Location |
|-------|----------|----------|
| Legacy `<img>` (~40 pages) | High | Introduction, contact, committees |
| `PublicPageShell` client-hydrated globally | Medium | 49+ routes |
| Registration multi-step forms INP | Medium | `/registration/*` |
| Press articles full client bundle | Medium | 9 routes |
| proceeding2 615-line client page | High | `/proceeding2` |
| Double fetch noticeboard/downloads | Low | SSR + client refresh |

**Strengths:** Responsive Tailwind, mobile nav drawer, lazy homepage sections, hero priority image.

---

## Performance gaps

| Issue | Impact | Routes |
|-------|--------|--------|
| Client `"use client"` press pages | Bundle bloat | 9 press |
| proceeding2/3 inline data | LCP/INP | Proceedings |
| Firebase client on datadekh + speakers | Extra JS | 23 routes |
| No `LazySection` on PublicPageShell pages | LCP | 49+ routes |
| Global ClientChrome + analytics | TTFB overhead | All pages |

**Strengths:** Homepage RSC + `loadCmsPageData`, ISR on noticeboard/downloads (300s), `next/font` Inter.

---

## CMS wiring detail

### Server-side CMS (Prisma)

| Route | Loader | ISR |
|-------|--------|-----|
| `/` | `loadCmsPageData()` + `loadCmsHomepage()` | No |
| `/noticeboard` | `loadCmsNotices(50)` | 300s |
| `/downloads` | `loadCmsDownloads()` | 300s |

### Client `/api/v2` (global chrome)

- `NavBar` → menus
- `Footer` → settings + menus
- `ClientChrome` → announcement bars
- `VisitorPageTracker` → analytics track
- Noticeboard/Downloads clients → refresh from API

### Critical gap

`/[locale]` homepage has **no `CmsProvider`** and **no `loadCmsPageData`** — Hindi visitors miss CMS sections.

---

## Per-route scoring (category averages)

| Category | SEO | Mobile | A11y | Admin | Overall |
|----------|----:|-------:|-----:|------:|--------:|
| Homepage & core | 90 | 91 | 92 | 78 | 88 |
| CMS wired (3) | 88 | 90 | 90 | 95 | 91 |
| Registration | 85 | 82 | 78 | 90* | 84 |
| Knowledge graph (28) | 84 | 88 | 86 | 0 | 70 |
| Events (28) | 80 | 87 | 82 | 0 | 62 |
| Press & media (42) | 76 | 85 | 78 | 0 | 60 |
| Committees (8) | 78 | 86 | 80 | 0 | 61 |
| Legal (5) | 75 | 88 | 88 | 0 | 63 |
| Legacy redirects (32) | 40 | — | — | — | 40 |

*Registration admin via Firebase, not CMS.

---

## Stabilization priorities (public site)

### P0 — No new features

1. Wire `/[locale]` to `CmsProvider` + `loadCmsPageData('hi')`
2. CMS SEO metadata for noticeboard + downloads
3. Remove legacy stub layouts (redirect-only pages)
4. Breadcrumb JSON-LD on `PublicPageShell`

### P1 — Content migration targets

1. Legal pages → CMS pages (5 routes)
2. Press articles → CMS pages or articles module (9 routes)
3. Introduction/about → CMS page (1 route)
4. Gallery → media library wire (1 route)

### P2 — Deferred (Phase C+)

Committees, speakers, events, departments, knowledge graph, proceedings

---

## Conclusion

The public website has a **strong CMS foundation** on 3 high-traffic routes plus global chrome. **~92% of content routes** still require developer deploy. Stabilization must focus on migrating high-traffic hardcoded pages to existing CMS APIs before building new modules.
