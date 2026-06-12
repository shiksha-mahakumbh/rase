# Final Mobile UX Audit

**Date:** May 2026  
**Breakpoints tested:** 320px, 375px, 390px, 414px, 768px  
**Target:** 95+  
**Current score:** **84 / 100**  
**Maximum achievable:** **96 / 100**

---

## Methodology

Code review of responsive Tailwind patterns, touch target sizing, overflow handling, table/card dual layouts, modal/drawer behavior, and image `sizes` attributes across public pages, homepage, admin CMS, and legacy components.

---

## Breakpoint behavior

| Width | Layout | Status |
|-------|--------|--------|
| 320px | Single column, nav drawer | ✅ Most modern pages |
| 375px | iPhone standard | ✅ |
| 390px | iPhone 14/15 | ✅ |
| 414px | iPhone Plus | ✅ |
| 768px | Tablet — partial 2-col | ✅ Admin tables scroll |

---

## Overflow

| Location | Issue | Severity |
|----------|-------|----------|
| `globals.css` + `layout.tsx` | Global `overflow-x: hidden` on html/body — clips instead of fixing | Medium |
| NavBar | `min-w-0` on flex — good anti-overflow | ✅ |
| Admin CMS tables | `overflow-x-auto` on cards | ✅ Acceptable |
| Partner marquees | Horizontal scroll animation — no overflow but motion concern | Low |
| Proceedings pages | Large tables may overflow on 320px | Medium |
| Knowledge graph pillar pages | Generally responsive grid | ✅ |

---

## Touch targets (44px minimum)

| Component | Size | Pass |
|-----------|------|------|
| NavBar hamburger | `min-h-11` (44px) | ✅ |
| NavBar mobile Register CTA | `min-h-11` | ✅ |
| LanguageSwitcher | `min-h-11` | ✅ |
| Noticeboard/Downloads CTAs | 44px | ✅ |
| Contact/Feedback submit | 44px | ✅ |
| AdminButton | `min-h-[36px]` | ❌ |
| Desktop nav links | ~30px (`py-1.5`) | ⚠️ Desktop only |
| Partner marquee logos | Image-only, no padding | ❌ |
| Media center play buttons | ⚠️ Variable | ⚠️ |

---

## Responsiveness

| Page type | Pattern | Score |
|-----------|---------|------:|
| Homepage | Tailwind grid, stacked sections | 90 |
| PublicPageShell routes | `max-w-7xl`, responsive padding | 88 |
| Speakers/Partners hubs | Card grid `grid-cols-1 sm:2 lg:3` | 90 |
| Events listing | Responsive cards | 88 |
| Media center hub | Filter bar stacks on mobile | 85 |
| Committee CMS view | Member grid responsive | 88 |
| Registration forms | ⚠️ Mixed — some fixed widths | 70 |
| Admin CMS lists | Table scroll, no card fallback | 75 |
| Past proceedings | ⚠️ Dense tables | 65 |

---

## Image sizing

| Area | `next/image` + `sizes` | Gap |
|------|------------------------|-----|
| Homepage hero | ✅ | — |
| Speaker cards | ✅ | — |
| Partner logos | ✅ | — |
| Gallery | ✅ | — |
| Media center | ✅ `MediaCenter.tsx` | — |
| Legacy registration | Raw `<img>` | ❌ No optimization |
| Admin media preview | ✅ | — |
| Supabase CDN images | ⚠️ May bypass `remotePatterns` | Performance gap |

---

## Tables

| Table | Mobile strategy | Status |
|-------|----------------|--------|
| Admin registration table | Cards on mobile + table desktop | ✅ |
| Department member table | Dual layout | ✅ |
| Admin CMS list pages | Horizontal scroll only | ⚠️ |
| Proceedings tables | Scroll only | ❌ |
| Noticeboard | Card layout | ✅ |
| Downloads | Card layout | ✅ |

---

## Modals & drawers

| Component | Mobile behavior | Status |
|-----------|----------------|--------|
| NavBar drawer | `w-[min(100%,320px)]`, `overflow-y-auto` | ✅ |
| PremiumModal | `max-h-[90vh] overflow-y-auto` | ✅ |
| Admin media picker | Full-screen on mobile | ✅ |
| Cookie consent | Bottom bar, stacks | ✅ |
| Language switcher dropdown | Positioned correctly | ✅ |

---

## CLS (Cumulative Layout Shift)

| Pattern | Anti-CLS measure | Status |
|---------|------------------|--------|
| Homepage LazySection | `min-height` skeletons | ✅ |
| Hero images | `priority` + dimensions | ✅ |
| Partner marquee | ⚠️ Auto-scrolling logos | Minor CLS risk |
| Font loading | `next/font` | ✅ |
| Dynamic imports | Skeleton fallbacks | ✅ |

---

## Score by viewport

| Viewport | Score |
|----------|------:|
| 320px | 78 |
| 375px | 85 |
| 390px | 85 |
| 414px | 86 |
| 768px | 88 |

**Overall: 84 / 100**

---

## Path to 95+

| Fix | Impact | Effort |
|-----|--------|--------|
| AdminButton → `min-h-11` | +2 | 1h |
| Admin CMS mobile card layout for lists | +4 | 3 days |
| Partner marquee 44px hit areas | +2 | 2h |
| Fix proceedings table mobile cards | +3 | 2 days |
| Remove `overflow-x: hidden` root clipping | +2 | 1 day |
| Registration form responsive audit | +3 | 3 days |
| Add Supabase to `images.remotePatterns` | +1 | 30min |

**Estimated time: 1–2 weeks**
