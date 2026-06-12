# Mobile 95+ Plan — Phase S

**Date:** May 2026  
**Current mobile score:** 91/100  
**Target:** 95+/100  
**Status:** Roadmap only — no implementation

---

## Current state

| Metric | Target | Current est. | Status |
|--------|--------|-------------|--------|
| LCP | < 2.5s | 1.8–2.4s | ✅ |
| CLS | < 0.1 | 0.05–0.08 | ✅ |
| INP | < 200ms | 150–250ms | ⚠️ |
| TTFB | < 800ms | 400–700ms | ✅ |
| Touch targets | ≥ 44px | ~85% routes | ⚠️ |
| Responsive layouts | 100% | ~95% | ⚠️ |

---

## Issues by category

### Touch targets (Priority: High)

| Issue | Location | Fix |
|-------|----------|-----|
| Nav CTA `text-[10px]` / `py-1.5` | `NavBar.tsx` | Min 44×44px padding |
| Marquee links small padding | Partner sections | `min-h-11 min-w-11` |
| Registration select dropdowns | Registration forms | Increase tap area |
| Footer social icons | Footer | Verify 44px (mostly OK post-B.6) |
| Admin table action buttons | CMS admin | Icon buttons 44px |

### Images (Priority: High)

| Issue | Count | Fix |
|-------|------:|-----|
| Legacy `<img>` tags | ~40 pages | Migrate to `next/image` |
| Missing `sizes` attribute | ~15 images | Add responsive sizes |
| Hero images not WebP | CMS uploads | Media library WebP conversion |
| proceeding2/3 large images | 2 routes | Lazy load + next/image |

**Priority pages for image migration:**
1. `/introduction`
2. `/contact-us`
3. `/committee/*` (5)
4. `/keynotespeakers`
5. `/gallery`

### Layouts (Priority: Medium)

| Issue | Location | Fix |
|-------|----------|-----|
| `PublicPageShell` client-hydrated | 49+ routes | Split server shell |
| Press articles no `max-w-prose` | 9 routes | Add prose container |
| Department grids tablet gap | 5 routes | `md:grid-cols-2` audit |
| Footer counter 3-column | Footer | Already stacks — verify |
| Admin tables on mobile | CMS admin | Card view at `<sm` |

### Tables (Priority: Medium)

| Page | Status | Fix |
|------|--------|-----|
| Noticeboard | ✅ Cards on mobile | — |
| Downloads | ✅ Grid responsive | — |
| Admin notices list | ⚠️ Horizontal scroll | Card view option |
| Datadekh tables | Legacy | Noindex — deprioritize |

### Forms (Priority: Medium)

| Form | Mobile score | Issues |
|------|-------------|--------|
| Registration (Firebase) | 78 | Long scroll, small selects |
| Contact | 85 | OK |
| Feedback | 82 | Error linking |
| Newsletter | 88 | OK |
| Admin CMS forms | 88 | JSON editor not mobile-friendly |

### Performance (Priority: High)

| Issue | Impact | Fix |
|-------|--------|-----|
| Press pages `"use client"` full bundle | INP | Convert to RSC + CMS |
| proceeding2 615-line client page | LCP/INP | CMS page migration |
| Double fetch noticeboard/downloads | Network | Client refresh only on stale |
| No `LazySection` on shell pages | LCP | Extend lazy pattern |
| `react-fast-marquee` on mobile | CPU | Pause when off-screen |

### Navigation (Priority: Low)

| Item | Status |
|------|--------|
| Mobile drawer | ✅ |
| Mega-menu `min(90vw,520px)` | ✅ |
| Safe area (iOS notch) | ⚠️ Verify modal |
| Bottom nav | ❌ Not needed |

---

## Phased plan

### S1 — Quick wins (week 1) → 93

| # | Task | Effort |
|---|------|--------|
| 1 | Nav CTA touch target fix | 0.5 day |
| 2 | `prefers-reduced-motion` on marquees | 0.5 day |
| 3 | Top 10 `<img>` → `next/image` | 2 days |
| 4 | Hero WebP via media library guidance | 0.5 day |
| 5 | Lighthouse mobile baseline on staging | 0.5 day |

### S2 — Layout & forms (weeks 2–3) → 94

| # | Task | Effort |
|---|------|--------|
| 1 | `max-w-prose` on press articles | 1 day |
| 2 | Registration form touch targets | 1 day (no flow change) |
| 3 | Admin table card view `<sm` | 2 days |
| 4 | Modal safe-area padding (iOS) | 0.5 day |
| 5 | LazySection on top 10 PublicPageShell routes | 2 days |

### S3 — Structural (weeks 4–6) → 95+

| # | Task | Effort |
|---|------|--------|
| 1 | Press articles → RSC/CMS (removes client bundle) | 5 days |
| 2 | proceeding2 → CMS page | 3 days |
| 3 | PublicPageShell server/client split | 3 days |
| 4 | Remaining `<img>` migration (30 pages) | 5 days |
| 5 | INP measurement + fix registration INP | 2 days |

---

## Tablet layout standards

| Breakpoint | Requirement |
|------------|-------------|
| `sm` (640px) | 2-column grids minimum |
| `md` (768px) | Nav transitions, sidebar layouts |
| `lg` (1024px) | Full desktop nav |
| `xl` (1280px) | `max-w-7xl` containers |

Audit all department and committee grids at 768–1024px.

---

## Mobile testing checklist

| Test | Tool | Target |
|------|------|--------|
| LCP | Lighthouse mobile | < 2.5s |
| CLS | Lighthouse | < 0.1 |
| INP | Web Vitals extension | < 200ms |
| Touch targets | Manual / axe | 44px minimum |
| Forms | iOS Safari + Android Chrome | Usable without zoom |
| Modals | iOS safe area | No clipped content |
| Hindi locale | Mobile drawer + locale switcher | Readable |

---

## Score projection

| Milestone | Mobile score |
|-----------|-------------:|
| Current | 91 |
| After S1 | 93 |
| After S2 | 94 |
| After S3 | 96 |
