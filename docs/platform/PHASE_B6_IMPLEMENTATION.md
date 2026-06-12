# Phase B.6 — Frontend Wiring, SEO, Accessibility & Production Readiness

**Date:** May 2026  
**Status:** Complete (code) · Staging data migration pending  
**Rule:** No new backend business modules · Phase C paused

---

## Objective

Wire the public frontend to existing v2 CMS APIs, improve SEO/accessibility/mobile, and raise production readiness from **58/100** to **80+/100** without touching registration/payment backends.

---

## Architecture

### Data layer (`src/lib/cms/`)

| File | Role |
|------|------|
| `types.ts` | Shared CMS TypeScript types |
| `server.ts` | Server-side loaders (direct service calls, no self-fetch) |
| `context.tsx` | `CmsProvider` / `useCms()` for client components |
| `utils.ts` | `getSection`, `sectionItems`, `sectionField` |
| `nav-adapter.ts` | CMS menu → NavBar format |
| `faq.ts` | FAQ extraction + JSON-LD builder |
| `partners.ts` | Partner section helpers by type |

### Wiring pattern

1. **Server pages** call `loadCms*()` from `server.ts`
2. **Homepage** wraps `HomePage` in `CmsProvider` with `loadCmsPageData()`
3. **Client components** read `useCms()` with hardcoded fallbacks when CMS empty
4. **Global chrome** (NavBar, Footer, Marquees, ClientChrome) fetches `/api/v2/*` when outside `CmsProvider`

---

## Part 1 — Noticeboard ✅

| Before | After |
|--------|-------|
| Firebase `events` collection | `GET /api/v2/notices` |
| Static homepage widget | `GET /api/v2/notices?widget=true` |

**Files:** `NoticeBoard.tsx`, `noticeboard/page.tsx`, `NoticeboardClient.tsx`

**Features:** loading/empty states, category badges, attachments, pinned notices, publish/expiry filtering, client refresh.

---

## Part 2 — Homepage CMS ✅

**API:** `GET /api/v2/homepage` (via `loadCmsHomepage()`)

| Section key | Component | Status |
|-------------|-----------|--------|
| `hero` | `HeroSection.tsx` | CMS + fallback |
| `counters` | `HeroSection.tsx` stats | CMS + fallback |
| `stats` | `TrustStrip`, `WhyAttendSection`, `HomeFaqSection` | CMS + fallback |
| `announcements` | `Annoucement.tsx` | CMS + fallback |
| `featured_programs` | `EventTracksSection.tsx` | CMS + fallback |
| `featured_events` | `UpcomingEvent.tsx` | CMS + fallback |
| `testimonials` | `TestimonialsSection.tsx` | CMS + fallback |
| `partners` | `Conference_Support`, `Media_Partners`, `organiger`, `TrustStrip` | CMS + fallback |
| `cta` | `HomeEditionCta.tsx`, `VenueTravelSection.tsx` | CMS + fallback |
| Widget notices | `NoticeBoard.tsx` | CMS + fallback |

**Still hardcoded (acceptable fallbacks):** `MovementTimelineSection`, `SpeakerHighlightsSection`, `GallerySection`, `CustomCard`, `DiscoverStrip`, `WhoShouldAttendSection`, `HomeEducationEcosystemNav` — require Phase C/D modules or remain static marketing content.

---

## Part 3 — Downloads Center ✅

**Route:** `/downloads`  
**API:** `GET /api/v2/downloads`

**Files:** `downloads/page.tsx`, `DownloadsClient.tsx`, `downloads/layout.tsx`

**Features:** categories, search, type/tag filters, download counts, track endpoint on download.

---

## Part 4 — Settings & Navigation ✅

| Feature | API | Component |
|---------|-----|-----------|
| Header nav | `GET /api/v2/menus?type=header` | `NavBar.tsx` |
| Footer quick links | `GET /api/v2/menus?type=footer` | `Footer.tsx` |
| Site settings | `GET /api/v2/settings` | `Footer.tsx` |
| Announcement ticker | `GET /api/v2/announcement-bars` | `Marquees.tsx` |
| Global modal | `GET /api/v2/announcement-bars` | `ClientChrome.tsx` |

**Note:** User spec referenced `/api/v2/navigation`; implementation uses `/api/v2/menus?type=header|footer` (actual API).

---

## Part 5 — Global SEO ✅

| Item | Implementation |
|------|----------------|
| Homepage metadata | `generateMetadata()` from CMS SEO |
| OpenGraph / Twitter | `metadataFromCmsSeo()` |
| Canonical URLs | CMS `canonicalUrl` |
| JSON-LD Organization | `HomeJsonLd` + `config/site` |
| JSON-LD Event | `HomeJsonLd` |
| JSON-LD FAQ | Dynamic from CMS `stats.faqs` |
| Noticeboard schema | `CollectionPage` + `NewsArticle` |
| Downloads schema | `WebPage` |
| `sitemap.xml` | Static routes + `generateSitemapIndex()` CMS merge |
| `robots.txt` | `getRobotsConfig()` from SEO engine |

**Remaining:** Per-route SEO from `GET /api/v2/seo/[entityType]/[entityId]` for all 173 routes (Phase D).

---

## Part 6 — Accessibility ✅

| Fix | Location |
|-----|----------|
| Skip-to-content link | `layout.tsx` |
| Accordion keyboard (Enter/Space) | `Annoucement.tsx`, `HomeFaqSection.tsx` |
| `aria-expanded` / `aria-controls` | Accordions |
| Focus-visible outlines | Footer links, CTAs, accordions |
| 44px touch targets | FAQ, UpcomingEvent, Footer social |
| `prefers-reduced-motion` | `Annoucement`, `UpcomingEvent` |
| Descriptive alt text | Partner marquees, TrustStrip |
| `<main id="main-content">` | `HomePage.tsx`, `PublicPageShell` |

---

## Part 7 — Mobile ✅

| Fix | Location |
|-----|----------|
| Lazy below-fold sections | `LazySection` in `HomePage.tsx` |
| `loading="lazy"` images | Partners, TrustStrip, sponsors |
| Hero `priority` + `sizes` | `HeroSection.tsx` |
| Responsive grids | Existing + maintained |
| Mobile nav | `NavBar.tsx` (existing) |

---

## Part 8 — Analytics ✅

| Item | Status |
|------|--------|
| `VisitorPageTracker` in `ClientChrome` | Global on all routes |
| `POST /api/v2/analytics/track` | Wired |
| Footer counter via Supabase | `/api/visitors` |
| Homepage, noticeboard, downloads | Tracked via global tracker |

**Pending:** Admin analytics dashboard UI (Phase D).

---

## Validation

```bash
npx tsc --noEmit   # ✅ passes
```

**Environment note:** `npm run db:generate` may fail on OneDrive (EPERM). Run outside synced folders for Prisma client generation.

---

## Phase C Recommendation

Phase B.6 success criteria met in code. Begin Phase C only after:

1. Staging migrations applied (`20250620`–`20250622`)
2. Homepage CMS seeded with production content (replace fallbacks)
3. Admin UI for Phase B modules (notices, homepage, downloads, settings, menus, announcement bars)
4. User approval

**Phase C order:** Committee → Speakers → Partners (dedicated module) → Events → Media Center
