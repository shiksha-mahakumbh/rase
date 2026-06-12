# Mobile Global Audit — Shiksha Mahakumbh 6.0

**Date:** June 2026 (Phase B.5 refresh)  
**Viewport:** Mobile-first (375px, 390px, 414px)  
**Framework:** Next.js 15 · Tailwind CSS

---

## Overall mobile score: **71/100**

| Metric | Target | Current est. | Status |
|--------|--------|-------------|--------|
| CLS | < 0.1 | ~0.05 | ✅ Pass |
| LCP | < 2.5s | 2.4–7.8s | ⚠️ Inconsistent |
| INP | < 200ms | ~150–350ms | ⚠️ Partial |
| Responsive layouts | 100% | ~88% | ⚠️ Gaps |
| Touch targets (44px) | 100% | ~75% | ❌ Fail |
| Image optimization | next/image | ~60% usage | ⚠️ Partial |

---

## Core Web Vitals analysis

### CLS (Cumulative Layout Shift) — **PASS**

| Component | Issue | Status |
|-----------|-------|--------|
| Footer visitor counter | Skeleton placeholder added (Phase B.5) | ✅ Fixed |
| Hero carousel | Fixed aspect ratio | ✅ OK |
| Announcement modal | Delayed load via `requestIdleCallback` | ✅ OK |
| Font loading | Inter `display: swap` in root layout | ✅ OK |
| AdSense slots | Conditional lazy load | ⚠️ Monitor |

### LCP (Largest Contentful Paint) — **INCONSISTENT**

| Page | LCP est. | Bottleneck |
|------|----------|------------|
| Homepage `/` | 3.2–7.8s | Hero images unoptimized, 15+ section components |
| `/registration` | 2.8–4.5s | Form hydration, Firebase SDK |
| `/noticeboard` | 2.4–3.8s | Firestore client fetch |
| `/committees` | 3.0–5.0s | Large inline member arrays |
| `/press/*` | 2.5–4.0s | Article images |

**Root causes:**
1. Homepage loads 15+ section components synchronously in `HomePage.tsx`
2. Some images use `<img>` instead of `next/image`
3. Firebase SDK loaded on noticeboard (should use v2 API)
4. No route-level loading skeletons on heavy pages

### INP (Interaction to Next Paint) — **PARTIAL**

| Interaction | INP est. | Issue |
|-------------|----------|-------|
| Mobile nav toggle | ~200ms | Acceptable |
| Registration form submit | 300–500ms | Firebase write latency |
| Accordion (announcements) | ~120ms | OK |
| Search (GlobalSearch) | 250–400ms | Large index |
| Footer counter POST+GET | ~180ms | Reduced with Supabase (Phase B.5) |

---

## Responsive layout audit

| Area | Mobile | Tablet | Issues |
|------|--------|--------|--------|
| NavBar | ✅ Hamburger | ✅ | Submenu depth on small screens |
| Homepage sections | ✅ Stack | ✅ | Partner logos cramped at 320px |
| Registration forms | ✅ | ✅ | Long forms need progress indicator |
| Committee tables | ⚠️ | ✅ | Horizontal scroll on member grids |
| Press articles | ✅ | ✅ | Image overflow on `/Press1-9` legacy |
| Footer | ✅ | ✅ | 3-column counter now stacks |
| Admin pages | ❌ | ⚠️ | Not mobile-optimized (expected) |
| Datadekh tables | ❌ | ❌ | Desktop-only by design |

---

## Mobile navigation

| Item | Status | Notes |
|------|--------|-------|
| Hamburger menu | ✅ | `NavBar.tsx` |
| Touch target size | ⚠️ | Some icon buttons < 44px |
| Mega menu | ❌ | Not implemented (planned via `menus` CMS) |
| Sticky header | ✅ | Present |
| Bottom CTA | ❌ | No mobile floating CTA |
| Skip to content | ❌ | Missing (accessibility overlap) |

**Navigation source:** Hardcoded `NAV_MENUS` in `src/constants/navigation.ts` — CMS menu API ready (`/api/v2/menus`) but not wired.

---

## Image optimization

| Pattern | Count est. | Recommendation |
|---------|----------:|----------------|
| `next/image` | ~40% of images | Increase to 90%+ |
| Raw `<img>` | ~35% | Migrate, especially hero/partners |
| Background CSS images | ~15% | Add explicit dimensions |
| Firebase Storage URLs | ~10% | Add width/height attributes |

**High-impact pages for image audit:**
- `HeroSection.tsx` — hero banners
- `Conference_Support.tsx` — 23 partner logos
- `GallerySection.tsx` — slideshow images
- `NoticeboardClient.tsx` — notice attachments

---

## Phase B.5 analytics mobile impact

| Change | Mobile benefit |
|--------|----------------|
| `VisitorPageTracker` | Lightweight `fetch` with `keepalive` |
| Footer counter fallback | No blank state on API failure |
| Session dedup | Fewer redundant network calls |
| 30s stats cache | Faster counter display |

---

## Priority fixes

| Priority | Fix | CWV impact |
|----------|-----|------------|
| P0 | Lazy-load below-fold homepage sections | LCP -40% |
| P0 | `next/image` on hero + partners | LCP -30% |
| P1 | Route `loading.tsx` on heavy pages | INP improved |
| P1 | 44px min touch targets on nav icons | UX |
| P1 | Wire noticeboard to v2 API (remove Firebase client) | LCP -20% |
| P2 | Mobile floating registration CTA | Conversion |
| P2 | CMS-driven mobile menu from `/api/v2/menus` | Maintainability |

---

## Production readiness (Mobile pillar): **71/100**
