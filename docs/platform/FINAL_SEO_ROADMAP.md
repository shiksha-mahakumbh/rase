# Final SEO Roadmap — 95+ Target

**Date:** May 2026  
**Current:** 93 · **Target:** 95+ · **Post-full-migration:** 97

---

## Current state (post Phase S)

| Capability | Score | Status |
|------------|------:|--------|
| Homepage CMS metadata | 95 | ✅ |
| Noticeboard/downloads metadata | 90 | ✅ Phase S |
| WebSite + SearchAction JSON-LD | 95 | ✅ |
| Organization + Event + FAQ | 90 | ✅ Homepage |
| BreadcrumbList | 70 | ⚠️ Partial |
| hreflang en-IN/hi-IN | 75 | ⚠️ 4 route pairs |
| Sitemap | 90 | ✅ |
| Robots.txt | 95 | ✅ |
| OG/Twitter | 85 | ✅ Dynamic fallback |
| Press Article schema | 70 | Static only |
| Person/Event per-page | 40 | Missing |

---

## Technical SEO roadmap

### Phase SEO-1 (complete — Phase S)
- [x] WebSite JSON-LD
- [x] SearchAction JSON-LD
- [x] BreadcrumbList on noticeboard/downloads
- [x] CMS generateMetadata for CMS routes
- [x] OG image from settings
- [x] hreflang on homepage, intro, registration, contact

### Phase SEO-2 (S2 — weeks 1–6)

| Task | Impact | Effort |
|------|--------|--------|
| BreadcrumbList on all PublicPageShell routes | +3 | 3d |
| Press articles → CMS with Article schema | +4 | 8d |
| Standalone notice URLs `/notices/[slug]` | +2 | 5d |
| Event schema on upcoming-events | +2 | 3d |
| Remove 32 legacy stub metadata | +1 | 2d |
| SEO embed in all entity editors | +2 | 3d |
| `/hi/noticeboard`, `/hi/downloads` + hreflang | +2 | 4d |

**Target after SEO-2: 96**

### Phase SEO-3 (Phase C — weeks 7–12)

| Task | Impact |
|------|--------|
| Person schema (committee, speakers) | +2 |
| Event schema per catalog item | +2 |
| ImageGallery schema (gallery) | +1 |
| VideoObject schema (videos) | +1 |
| EducationalOrganization on about | +1 |

**Target after SEO-3: 97**

---

## Schema coverage target

| Schema | Routes (target) |
|--------|----------------|
| WebSite | All (global) |
| Organization | Root + about |
| Event | Homepage + events + registration |
| FAQPage | Homepage + FAQ page |
| Article/NewsArticle | Press + notices |
| Person | Committee + speakers |
| BreadcrumbList | All content pages |
| ImageGallery | Gallery |
| VideoObject | Videos |
| CollectionPage | Hubs (events, knowledge) |

---

## International SEO

| Item | Current | Target |
|------|---------|--------|
| hreflang en-IN | 4 routes | All CMS routes |
| hreflang hi-IN | 4 routes | All hi routes |
| Hindi metadata | Partial | Full CMS SEO per locale |
| `lang` attribute | ✅ | — |
| x-default | ✅ | — |
| Google Search Console | Manual | Automated submit on deploy |

---

## Content SEO priorities

| Content | Keyword strategy | Admin control |
|---------|------------------|---------------|
| Homepage | SMK 6.0, NEP 2020, NIT Hamirpur | CMS SEO |
| Notices | Programme updates, deadlines | Per-notice SEO |
| Press | Education summit coverage | Article SEO |
| Events | Conference, workshop, summit | Event SEO |
| Downloads | Brochure, guidelines, reports | Download SEO |

---

## Monitoring

| Tool | Setup |
|------|-------|
| Google Search Console | Domain verify on deploy |
| GA4 | Consent-gated (existing) |
| Sitemap auto-refresh | On CMS publish (existing) |
| Schema validator | CI check on key routes |

---

## Success criteria

- [ ] Lighthouse SEO score ≥ 95 on homepage, noticeboard, downloads
- [ ] Zero hreflang errors in GSC
- [ ] 100% indexable routes have canonical
- [ ] Rich results eligible on homepage, press, events
- [ ] No duplicate metadata on legacy stubs

**Status: ROADMAP ONLY**
