# Page Redesign Report — Committee, Media, Merchandise, Best Wishes

**Date:** 29 May 2026  
**Scope:** UI/UX modernization with 100% content and functionality preservation

---

## 1. Pages Redesigned

| Route | Component | Status |
|-------|-----------|--------|
| `/committeepage` | `CommitteeTree` + page shell | ✅ Complete |
| `/media` | `MediaCenter` (replaces generic pillar template) | ✅ Complete |
| `/merchandise` | `Merchandise` catalog | ✅ Complete |
| `/Best_Wishes` | `Best_Wishes` timeline hub | ✅ Complete |
| `/Wishes_Received` | `wishes_received` + `Guest` cards | ✅ Complete (related) |

### Related routes also modernized
- `/committee/shikshamahakumbh2023`
- `/committee/shikshamahakumbh2024`
- `/committee/shikshakumbh2023`
- `/committee/shikshakumbh2024`

---

## 2. Files Modified

### New files
| File | Purpose |
|------|---------|
| `src/components/showcase/ShowcaseHero.tsx` | Shared institutional hero |
| `src/components/showcase/AdSlotRegion.tsx` | CLS-safe AdSense-ready regions |
| `src/components/ui/BreadcrumbNav.tsx` | *(reused from prior work)* |
| `src/components/committee/CommitteeMemberSection.tsx` | Responsive member tables/cards |
| `src/components/committee/CommitteeDetailShell.tsx` | Committee edition page shell |
| `src/components/media/MediaCenter.tsx` | Full media centre UI |
| `src/data/media-archives.ts` | Media archive data (extracted) |
| `src/data/committee-editions.ts` | Committee timeline data |
| `src/app/Best_Wishes/layout.tsx` | SEO + breadcrumb JSON-LD |
| `src/app/Wishes_Received/layout.tsx` | SEO + breadcrumb JSON-LD |
| `docs/PAGE_REDESIGN_REPORT.md` | This report |

### Modified files
| File | Changes |
|------|---------|
| `src/app/committeepage/page.tsx` | Modern shell, hero, breadcrumbs |
| `src/app/committeepage/layout.tsx` | CollectionPage JSON-LD |
| `src/app/component/CommitteeTree.tsx` | Brand timeline, search, year filter |
| `src/app/media/page.tsx` | Uses `MediaCenter` instead of pillar template |
| `src/app/media/layout.tsx` | Breadcrumb + CollectionPage JSON-LD |
| `src/app/component/MediaPage.tsx` | Legacy wrapper → MediaCenter |
| `src/app/component/Merchandise.tsx` | Catalog grid, categories, hero |
| `src/app/merchandise/page.tsx` | Clean page shell |
| `src/app/merchandise/layout.tsx` | Store schema JSON-LD |
| `src/app/component/Best_Wishes.tsx` | Premium timeline carousel |
| `src/app/Best_Wishes/page.tsx` | NavBar + Footer shell |
| `src/app/component/Guest.tsx` | Premium dignitary cards |
| `src/app/component/wishes_received.tsx` | Masonry layout, search, featured |
| `src/app/Wishes_Received/page.tsx` | Modern shell |
| `src/app/component/CommitteePage.tsx` | Uses shared member section |
| `src/app/committee/*/page.tsx` (×4) | CommitteeDetailShell + sections |
| `src/lib/seo/publicPages.ts` | Enhanced media + merchandise metadata |
| `src/app/sitemap.ts` | Added Best_Wishes, Wishes_Received |

---

## 3. Committee Page (`/committeepage`)

### Before
- Legacy `bg-custom-bg` wrapper
- Broken `onSelect` handler throwing error
- Blue/purple gradient styling
- No search or filter

### After
- **ShowcaseHero** — governance & leadership positioning
- **Breadcrumb navigation**
- **Timeline visualization** with brand-navy/saffron markers
- **Search** by edition title/description
- **Year filter** buttons (2023, 2024, 2025, All)
- **Edition cards** with View Event + Committee Details links (all URLs preserved)
- **AdSlotRegion** for partner/ad placement
- **CollectionPage** structured data

### Committee detail pages (`/committee/*`)
- Shared `CommitteeDetailShell` with hero + breadcrumbs
- `CommitteeMemberSection` — desktop table + mobile cards
- Role badges (Advisory, Organising, Leadership)
- All member names and designations preserved verbatim

---

## 4. Media Page (`/media`)

### Before
- Generic `PillarPageTemplate` (text-only, no media archives)
- Rich `MediaTree` component unused on `/media` route

### After
- **Full Media Centre** with all original archive links restored
- **Category filters:** All, Editions, Digital, Print, Press, Gallery
- **Featured coverage** section (SMK 4.0)
- **Edition archive cards** with expandable archived media (preserved links)
- **Press coverage grid** (Press_Release + Press1–9)
- **Photo/Video/Publications hub** (gallery, videos, journals, proceedings, Best Wishes)
- **Social media integration** (footer social links)
- Lazy-loaded images with `next/image` + `sizes`
- Removed deprecated `next/head` (metadata via layout)
- **CollectionPage** + breadcrumb JSON-LD

---

## 5. Merchandise Page (`/merchandise`)

### Before
- Stacked single-column product blocks
- Basic white header
- `next/head` for SEO (App Router anti-pattern)

### After
- **Saffron-accent hero**
- **2-column responsive catalog grid**
- **Category filters:** All, Apparel, Drinkware, Accessories
- **Product cards** with SlideShow galleries (unchanged images/prices)
- **Buy Now** → `/commingsoon` (preserved)
- **CTA section** — Learn More → `/about` (preserved)
- All 4 products, prices, and image paths unchanged
- **Store** schema JSON-LD

---

## 6. Best Wishes (`/Best_Wishes` + `/Wishes_Received`)

### Best Wishes hub
- **Emerald hero** with Hindi + English title preserved
- **Horizontal timeline carousel** with scroll buttons + progress line
- All 4 editions, years, and links preserved (`/comingsoon`, `/Wishes_Received`)
- Archive toggle functionality preserved
- **Featured Greetings** CTA → `/Wishes_Received`
- Breadcrumb: Home → Media → Best Wishes

### Wishes Received
- **Featured dignitaries** section (first 2 cards enlarged)
- **Masonry column layout** for remaining messages
- **Search** by name, designation, or message text
- All 13 hardcoded dignitaries preserved verbatim
- **Firebase `wishesReceived` collection** fetch preserved
- `Guest` cards: portrait framing, designation badge, blockquote messages
- Shared `db` from `@/app/firebase` (no duplicate init)

---

## 7. SEO Improvements

| Page | Metadata | Structured Data |
|------|----------|-----------------|
| `/committeepage` | `createCommitteeMetadata` | BreadcrumbList, CollectionPage |
| `/media` | Enhanced title, description, keywords | BreadcrumbList, CollectionPage |
| `/merchandise` | Enhanced description, keywords | BreadcrumbList, Store |
| `/Best_Wishes` | New layout metadata | BreadcrumbList |
| `/Wishes_Received` | New layout metadata | BreadcrumbList |
| Sitemap | Added Best_Wishes, Wishes_Received | — |

Open Graph and Twitter cards inherited from `createPageMetadata` utility.

---

## 8. Mobile & Responsive Improvements

- Mobile-first grids (1 → 2 → 3 columns)
- 44px minimum touch targets on all interactive elements
- Horizontal scroll timeline with snap on mobile
- Committee tables → card fallback on `< md`
- Masonry wishes layout with `break-inside-avoid`
- Responsive image `sizes` attributes

---

## 9. Accessibility Improvements

- Semantic `<main>`, `<section>`, `<article>`, `<blockquote>`
- `aria-label` on scroll buttons, search inputs, filter groups
- `aria-expanded` on archive toggles
- `aria-selected` on category tabs
- `scope="col"` on table headers
- Screen-reader labels (`sr-only`) on search fields
- Keyboard-focus rings on all buttons/links

---

## 10. Performance Improvements

- `next/image` with `loading="lazy"` on non-priority images
- Removed duplicate Firebase initialization in wishes page
- Removed `next/head` client-side metadata (server layout metadata)
- AdSlotRegion min-height prevents CLS
- Dynamic import removed where unnecessary; MediaCenter statically imported

---

## 11. AdSense-Ready Structure

- `AdSlotRegion` components on committee and media pages
- Logical section breaks between content blocks
- No intrusive overlays; reserved dashed-border regions
- CLS-safe min-heights (90px)

---

## 12. Route Improvements Recommended

| Item | Recommendation |
|------|----------------|
| `/committee/shikshamahakumbh2025` | Linked from timeline but page may not exist — create when SMK 5.0 committee data is available |
| `/comingsoon` vs `/commingsoon` | Best Wishes uses `/comingsoon`; merchandise uses `/commingsoon` — both preserved as-is (legacy URLs) |
| `MediaTree.tsx` | Retained for reference; `/media` now uses `MediaCenter` |
| Pillar `/media` education hub | Media centre replaces pillar template on this route; `/education` pillar grid still links to `/media` |

---

## 13. Content Integrity Confirmation

✅ All committee member names and designations preserved  
✅ All media archive links preserved (digital + print paths)  
✅ All merchandise products, prices, images, and CTAs preserved  
✅ All best wishes edition data and links preserved  
✅ All dignitary messages, names, designations, and images preserved  
✅ Firebase wishes fetch logic preserved  

---

## Verification

```bash
cd rase
npm run lint
npm run build
```
