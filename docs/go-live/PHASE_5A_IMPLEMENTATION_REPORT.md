# Phase 5A — Brand Consolidation Implementation Report

**Date:** 2026-05-29  
**Status:** Complete — production build verified (`npm run build` exit 0)

## Summary

Phase 5A consolidates split **Shiksha Kumbh / Shiksha Mahakumbh** branding into a single identity: **शिक्षा महाकुंभ अभियान** (Shiksha Mahakumbh Abhiyan). All public hub pages are removed or redirected; edition numbering is canonical across navigation, SEO, past events, committees, and media archives.

### Approved Edition Mapping (implemented)

| Legacy code | Canonical edition |
|-------------|-------------------|
| SM23 | शिक्षा महाकुंभ **1.0** |
| SK23 | शिक्षा महाकुंभ **2.0** |
| SK24 | शिक्षा महाकुंभ **3.0** |
| SM24 | शिक्षा महाकुंभ **4.0** |
| SM25 | शिक्षा महाकुंभ **5.0** |
| Upcoming | शिक्षा महाकुंभ **6.0** |

---

## Files Changed (Phase 5A scope)

### New

| File | Purpose |
|------|---------|
| `src/app/abhiyan/page.tsx` | Canonical Abhiyan edition timeline (1.0–6.0) |

### Introduction & identity

| File | Change |
|------|--------|
| `src/app/component/Introduction.tsx` | Official DHE Abhiyan content |
| `src/app/introduction/IntroductionContent.tsx` | Abhiyan eyebrow/branding |
| `src/app/introduction/page.tsx` | SEO metadata updated |
| `src/app/introduction/layout.tsx` | Simplified JsonLd layout |

### Hub removal & redirects

| File | Change |
|------|--------|
| `src/app/shikshamahakumbh/page.tsx` | Replaced with 301 redirect → `/introduction` |
| `src/app/shikshakumbh/page.tsx` | Replaced with 301 redirect → `/introduction` |
| `src/app/shikshamahakumbh/layout.tsx` | Removed orphaned SEO metadata |
| `src/app/shikshakumbh/layout.tsx` | Removed orphaned SEO metadata |
| `src/config/legacy-redirects.js` | Hub + media archive 301 rules |

### Navigation, footer, routes

| File | Change |
|------|--------|
| `src/constants/navigation.ts` | Abhiyan Timeline link; edition 6.0 label |
| `src/app/component/footer-content.ts` | Abhiyan + unified edition links |
| `src/constants/canonical-routes.ts` | Added `abhiyan`; unified media archive keys |

### Edition data & past events

| File | Change |
|------|--------|
| `src/data/past-editions.ts` | `editionTitle()` helper; canonical 1.0–5.0 records |
| `src/data/committee-editions.ts` | Edition titles via `editionTitle()` |
| `src/app/past_event/sm23/page.tsx` | Abhiyan hero + edition title |
| `src/app/past_event/sk23/page.tsx` | Abhiyan hero + edition title |
| `src/app/past_event/sk24/page.tsx` | Abhiyan hero + edition title |
| `src/app/past_event/sm24/page.tsx` | Abhiyan hero + edition title |
| `src/app/past_event/sm25/page.tsx` | Abhiyan hero + edition title |
| `src/app/past-events/page.tsx` | Breadcrumb → `/abhiyan`; unified subtitle |
| `src/app/past-events/layout.tsx` | Breadcrumb JSON-LD → `/abhiyan` |
| `src/app/committees/page.tsx` | Abhiyan breadcrumb + timeline title |

### Components

| File | Change |
|------|--------|
| `src/app/component/sk23/SK23.tsx` | Edition 2.0 title + Abhiyan intro |
| `src/app/component/sk24/SK24.tsx` | Edition 3.0 title |
| `src/app/component/ShikshaKumbhTree.tsx` | Links to `/abhiyan` + past_event pages |
| `src/app/component/ShikshaMahaKumbhTree.tsx` | Links to `/abhiyan` + past_event pages |
| `src/app/component/VideoTree.tsx` | Unified Abhiyan documentary labels |
| `src/app/component/PrintMediaShikshaKumbh2023.tsx` | Edition 2.0 print media title |
| `src/app/component/PrintMediaShikshaKumbh2024.tsx` | Edition 3.0 print media title |
| `src/app/component/MarqueeUpcomingEvent.tsx` | Abhiyan / 6.0 / past-events links |
| `src/app/component/Upevent.tsx` | Abhiyan messaging |
| `src/app/component/Lstnews.tsx` | Abhiyan messaging |
| `src/components/authority/PastEditionsSection.tsx` | Unified Abhiyan description |
| `src/app/media/[edition]/[year]/[type]/MediaArchiveView.tsx` | Single Abhiyan archive label |

### SEO & sitemap

| File | Change |
|------|--------|
| `src/app/sitemap.ts` | Added `/abhiyan`; removed hub paths |
| `src/lib/seo/publicPages.ts` | Added `abhiyan`; removed hub keys; edition SEO titles |
| `src/lib/seo/mediaArchives.ts` | Unified `/media/shiksha-mahakumbh/*` paths |
| `src/app/upcoming-events/layout.tsx` | Edition 6.0 metadata |
| `src/config/site.ts` | `EVENT_NAME` → Abhiyan 6.0 |

### Knowledge graph & internal catalog

| File | Change |
|------|--------|
| `src/lib/knowledge-graph/conference-catalog.ts` | Abhiyan routes; edition labels |
| `src/lib/knowledge-graph/content-map.ts` | `/abhiyan` replaces hub paths |
| `src/lib/knowledge-graph/entities/education-pillars.ts` | Unified Abhiyan description |
| `src/lib/knowledge-graph/pillar-registry.ts` | Unified conferences tagline |
| `src/lib/knowledge-graph/topic-clusters.ts` | Abhiyan cluster labels |
| `src/lib/page-heroes.ts` | Abhiyan hero; removed dual-brand heroes |
| `src/lib/committee/legacy-registry.ts` | Edition 1.0–5.0 breadcrumb labels |

---

## Routes Removed from Public Visibility

| Route | Treatment |
|-------|-----------|
| `/shikshamahakumbh` | 301 → `/introduction` (page is redirect stub) |
| `/shikshakumbh` | 301 → `/introduction` (page is redirect stub) |

These routes are **excluded from sitemap** and **removed from navigation, footer, breadcrumbs, and SEO metadata**.

---

## Redirects Added / Updated

Configured in `src/config/legacy-redirects.js` (all `permanent: true`):

| Source | Destination |
|--------|-------------|
| `/shikshamahakumbh` | `/introduction` |
| `/shikshakumbh` | `/introduction` |
| `/shikshamahakumbh2024digitalmedia` | `/media/shiksha-mahakumbh/2024/digital` |
| `/shikshamahakumbh2023digitalmedia` | `/media/shiksha-mahakumbh/2023/digital` |
| `/shikshakumbh2024digitalmedia` | `/media/shiksha-mahakumbh/2024/digital` |
| `/shikshakumbh2023digitalmedia` | `/media/shiksha-mahakumbh/2023/digital` |
| `/printmediashikshamahakumbh2024` | `/media/shiksha-mahakumbh/2024/print` |
| `/printmediashikshamahakumbh2023` | `/media/shiksha-mahakumbh/2023/print` |
| `/printmediashikshakumbh2024` | `/media/shiksha-mahakumbh/2024/print` |
| `/printmediashikshakumbh2023` | `/media/shiksha-mahakumbh/2023/print` |
| `/media/shiksha-kumbh/:year/:type` | `/media/shiksha-mahakumbh/:year/:type` |

---

## SEO Updates

| Area | Change |
|------|--------|
| **New canonical page** | `/abhiyan` — Edition Timeline metadata in `publicPages.ts` + inline page metadata |
| **Removed from SEO registry** | `shikshamahakumbh`, `shikshakumbh` keys in `publicPages.ts` |
| **Upcoming events** | Title → `शिक्षा महाकुंभ 6.0 — Upcoming Programmes` |
| **Past editions** | Titles use edition numbers 1.0–5.0 |
| **Videos** | Description no longer mentions "Shiksha Kumbh" |
| **Sitemap** | `/abhiyan` included; hub paths excluded |
| **Site schema** | `EVENT_NAME` / Event schema → Abhiyan 6.0 |
| **Media archives** | All SK-era paths canonicalized to `/media/shiksha-mahakumbh/*` |

---

## Verification Search Results

Searched `src/` for: `Shiksha Kumbh`, `SK23`, `SK24`, `SM23`, `SM24`, `SM25`, `shikshakumbh`, `shikshamahakumbh`.

### Clean (no user-facing legacy branding)

- Navigation, footer, breadcrumbs, sitemap (hub paths)
- Past event page heroes
- Committee page titles and breadcrumbs
- Conference catalog, content map, pillar registry
- Marquee, news widgets, video tree headings
- Print media archive page titles (editions 2.0 / 3.0)

### Remaining references — intentional / non-public

| Category | Examples | Reason kept |
|----------|----------|-------------|
| **Production domain & email** | `shikshamahakumbh.com`, `academics@shikshamahakumbh.com` | Live production identity |
| **Social handles** | Facebook/Instagram `@shikshamahakumbh` | External platform URLs |
| **301 redirect sources** | `legacy-redirects.js` | Required for SEO migration |
| **Committee URL slugs** | `/committee/shikshakumbh2023` etc. | Stable deep links; labels show edition numbers |
| **Component/file names** | `SK23.tsx`, `SM24.tsx`, `PrintMediaShikshaKumbh2023.tsx` | Internal code identifiers (not rendered as brand) |
| **Media archive registry keys** | `shikshakumbh2023digitalmedia` in `mediaArchives.ts` | Internal lookup keys for legacy redirect mapping |
| **Historical press citations** | `ShikshaKumbh2023DigitalMedia.tsx` article descriptions | Verbatim third-party news headlines from 2023 |
| **Dead hub components** | `Kumbh.tsx`, `MahaKumbh.tsx` | Orphaned — hub pages now redirect; not linked from nav |
| **reCAPTCHA allowlist** | `shikshamahakumbh.com` | Domain verification |

### Not in repo (manual / infra)

- Subdomain redirects: `sm23.rase.co.in`, `sk23.rase.co.in`, etc. → configure at DNS/Vercel

---

## Build Verification

```
npm run build
✓ Compiled successfully
✓ Generating static pages (353/353)
Exit code: 0
```

---

## Post-deploy Checklist

- [ ] Verify `/shikshamahakumbh` and `/shikshakumbh` return 301 to `/introduction`
- [ ] Verify `/abhiyan` loads edition timeline with correct 1.0–6.0 mapping
- [ ] Submit updated sitemap to Search Console
- [ ] Configure subdomain redirects (if not already done)
- [ ] Optional: remove or refactor orphaned `Kumbh.tsx` / `MahaKumbh.tsx` in a future cleanup pass
