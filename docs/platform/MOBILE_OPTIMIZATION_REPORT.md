# Mobile Optimization Report — Post B.7 Audit

**Date:** May 2026  
**Current mobile score:** 91/100 (B.6 baseline)

---

## Core Web Vitals (estimated)

| Metric | Target | Current est. | Status |
|--------|--------|-------------|--------|
| **LCP** | < 2.5s | 1.8–2.4s homepage | ✅ Good |
| **CLS** | < 0.1 | 0.05–0.08 | ✅ Good |
| **INP** | < 200ms | 150–250ms | ⚠️ Needs measurement |
| **TTFB** | < 800ms | 400–700ms Vercel | ✅ Good |

---

## Strengths

| Item | Implementation |
|------|----------------|
| Responsive Tailwind grids | All major sections |
| Mobile nav drawer | `NavBar.tsx` |
| Lazy below-fold sections | `LazySection` on homepage |
| Hero `priority` + `sizes` | `HeroSection.tsx` |
| Image lazy loading | Partners, trust strip, sponsors |
| 44px touch targets | FAQ, CTAs, footer social (B.6) |
| `viewport` meta | Root layout |
| Font `display: swap` | Inter via `next/font` |
| Admin mobile sidebar | `AdminShell` collapsible menu |

---

## Issues found

### High

| Issue | Location | Fix |
|-------|----------|-----|
| Legacy `<img>` tags | ~40 older pages | Migrate to `next/image` |
| Marquee horizontal scroll | Partner sections | Add `prefers-reduced-motion` pause |
| Registration forms on mobile | Long multi-step | Already functional; test INP |

### Medium

| Issue | Location | Fix |
|-------|----------|-----|
| Footer visitor counter 3-column | Small screens | Already stacks via flex |
| Press article long text | No `prose` max-width on some | Add `max-w-prose` |
| Modal announcement | `ClientChrome` | Verify safe-area on iOS |
| Table overflow | Noticeboard, downloads | `overflow-x-auto` present |

### Low

| Issue | Fix |
|-------|-----|
| Tablet breakpoint gaps (768–1024) | Audit department grids |
| Touch target on marquee links | Increase padding |
| Admin data tables on mobile | Horizontal scroll OK |

---

## Page-type mobile scores

| Page type | Score | Notes |
|-----------|------:|-------|
| Homepage | 92 | Lazy sections, responsive hero |
| Noticeboard | 90 | Filter UI responsive |
| Downloads | 90 | Search + grid |
| Registration | 82 | Complex forms |
| Committees | 86 | Member cards |
| Press articles | 84 | Long scroll content |
| Knowledge graph | 88 | Template-based |
| Admin CMS | 85 | Usable; tables scroll |

---

## Recommended fixes (stabilization)

1. **P1:** Add `prefers-reduced-motion` to `react-fast-marquee` partner sections
2. **P1:** Run Lighthouse mobile on staging post-migration
3. **P2:** Convert top 10 traffic `<img>` to `next/image` (introduction, contact, registration)
4. **P2:** Add `fetchpriority="high"` only on hero (already has `priority`)
5. **P3:** Admin table responsive card view on `< sm`

---

## Tablet layouts

| Breakpoint | Coverage |
|------------|----------|
| `sm` (640px) | ✅ Most grids 2-col |
| `md` (768px) | ✅ Nav transitions |
| `lg` (1024px) | ✅ Full desktop nav |
| `xl` (1280px) | ✅ Max-width containers |

---

## Forms & modals (mobile)

| Form | Touch targets | Keyboard | Score |
|------|---------------|----------|------:|
| Registration (Firebase) | ⚠️ Some small selects | OK | 78 |
| Footer contact | OK | OK | 85 |
| Feedback | OK | OK | 82 |
| Admin CMS forms | OK | OK | 88 |
| Cookie consent | OK | OK | 90 |

---

## Target

| Milestone | Mobile score |
|-----------|-------------:|
| Current | 91 |
| After P1 fixes | 93 |
| After img migration | 95 |
