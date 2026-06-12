# Final Accessibility Audit

**Date:** May 2026  
**Standard:** WCAG 2.1 Level AA  
**Target:** 95+  
**Current score:** **82 / 100**  
**Maximum achievable:** **96 / 100**

---

## Executive summary

Modern public pages built on `PublicPageShell`, homepage sections, and admin CMS follow strong accessibility patterns (skip link, landmarks, modal dialogs, FAQ accordions). Legacy registration forms, partner marquees, and admin button sizing create the largest gaps.

---

## WCAG checklist

### Perceivable

| Criterion | Status | Evidence |
|-----------|--------|----------|
| 1.1.1 Non-text content (alt text) | ⚠️ Partial | CMS gallery/speakers ✅; legacy media archives ⚠️ |
| 1.3.1 Info and relationships | ✅ | Semantic headings in PublicPageShell |
| 1.4.3 Contrast (AA) | ✅ | Navy/gold palette on heroes and cards |
| 1.4.4 Resize text | ✅ | rem-based Tailwind |
| 1.4.10 Reflow | ⚠️ | Global `overflow-x: hidden` may clip content |
| 1.4.11 Non-text contrast | ✅ | Focus rings visible |

### Operable

| Criterion | Status | Evidence |
|-----------|--------|----------|
| 2.1.1 Keyboard | ⚠️ | NavBar ✅; admin tables ⚠️; marquees no pause |
| 2.1.2 No keyboard trap | ✅ | PremiumModal Escape close |
| 2.4.1 Bypass blocks | ✅ | Skip link in `layout.tsx` → `#main-content` |
| 2.4.3 Focus order | ✅ | Logical tab order on modern pages |
| 2.4.7 Focus visible | ⚠️ | Public ✅ `focus-visible:`; admin uses `focus:ring` only |
| 2.5.5 Target size (44px) | ⚠️ | NavBar ✅; AdminButton 36px ❌ |

### Understandable

| Criterion | Status | Evidence |
|-----------|--------|----------|
| 3.3.2 Labels | ✅ Admin CMS forms; ✅ Contact form |
| 3.3.1 Error identification | ⚠️ | Feedback form — toast only, no `aria-describedby` |
| 3.2.4 Consistent identification | ✅ | AdminUi components |

### Robust

| Criterion | Status | Evidence |
|-----------|--------|----------|
| 4.1.2 Name, role, value | ⚠️ | Modals ✅; mobile nav `<details>` partial |
| 4.1.3 Status messages | ✅ | `aria-live="polite"` on visitor counter |

---

## Keyboard navigation

| Area | Status | File |
|------|--------|------|
| Skip to main content | ✅ | `src/app/layout.tsx` |
| Main landmark | ✅ | `#main-content` on HomePage, PublicPageShell |
| NavBar desktop dropdowns | ✅ | `aria-expanded`, `aria-haspopup` |
| NavBar mobile drawer | ✅ | Focus trap via overlay |
| FAQ accordion | ✅ | `aria-expanded`, `aria-controls` |
| PremiumModal | ✅ | `role="dialog"`, `aria-modal`, Escape |
| Admin CMS list actions | ✅ | Keyboard accessible buttons |
| Committee member reorder | ❌ | Drag-only, no keyboard alternative |
| Partner marquee links | ⚠️ | Auto-scrolling, hard to reach |

---

## Focus traps & modals

| Component | Focus trap | Escape | aria-modal |
|-----------|------------|--------|------------|
| PremiumModal | ✅ body scroll lock | ✅ | ✅ |
| Admin media picker | ⚠️ Partial | ✅ | ⚠️ |
| Cookie consent | ✅ | ✅ | — |
| Mobile nav drawer | ✅ overlay click | ✅ | — |

---

## ARIA audit

| Component | ARIA | Gap |
|-----------|------|-----|
| NavBar hamburger | `aria-label`, `aria-expanded` | — |
| LanguageSwitcher | `aria-label` | — |
| Admin bulk checkboxes | `aria-label="Select all"` | — |
| MediaCenter play buttons | ❌ Missing | Add `aria-label="Play {title}"` |
| Partner marquee images | ⚠️ Decorative | Need `alt=""` or 44px hit area |
| Registration admin table | ⚠️ Header checkbox | Missing `aria-label` |
| Footer visitor counter | `aria-live="polite"` | — |

---

## Screen reader support

| Feature | Status |
|---------|--------|
| Page title per route | ✅ ~150 routes with metadata |
| Heading hierarchy | ✅ h1 in hero, h2 in sections |
| Landmark regions | ✅ main, nav (NavBar), footer |
| Breadcrumb (visual + JSON-LD) | ✅ |
| Form field announcements | ⚠️ Legacy registration inconsistent |
| Dynamic content updates | ✅ noticeboard, visitor counter |

---

## Contrast

| Element | Ratio | Pass |
|---------|-------|------|
| Hero white on navy | >7:1 | ✅ AAA |
| Body text on white | >4.5:1 | ✅ AA |
| Gold accent links | >4.5:1 | ✅ AA |
| Muted gray captions | ~4.5:1 | ✅ borderline |
| Admin status badges | ✅ | AA |

---

## Forms

| Form | Labels | Errors | Focus |
|------|--------|--------|-------|
| Admin CMS editors | ✅ `AdminInput` label prop | ✅ inline | ⚠️ `focus:` not `focus-visible:` |
| Contact (`ContactUsForm`) | ✅ `htmlFor` | ✅ | ⚠️ |
| Feedback (`Feedback.tsx`) | ✅ | ❌ toast only | ❌ no `focus-visible` |
| Registration (Firebase) | ⚠️ Mixed | ⚠️ Mixed | ⚠️ Legacy components |
| Newsletter | ✅ | — | ✅ |

---

## Dialogs & menus

| UI | WCAG | Notes |
|----|------|-------|
| PremiumModal | ✅ | Full dialog pattern |
| NavBar mega-menu | ✅ | Keyboard + aria |
| Admin dropdown menus | ✅ | |
| Mobile `<details>` submenus | ⚠️ | No explicit `aria-expanded` on summary |

---

## Reduced motion

| Component | Respects `prefers-reduced-motion` |
|-----------|----------------------------------|
| Global CSS | ✅ `globals.css` |
| Marquees.tsx | ✅ `play={!reducedMotion}` |
| Media_Partners.tsx | ❌ |
| Conference_Support.tsx | ❌ |
| organiger.tsx | ❌ |
| framer-motion (Feedback) | ❌ |

---

## Score by area

| Area | Score |
|------|------:|
| Modern public pages | 90 |
| Admin CMS | 85 |
| Legacy registration | 65 |
| Marquees/animations | 60 |
| Forms (public) | 80 |

**Weighted overall: 82 / 100**

---

## Path to 95+

| Fix | Impact | Effort |
|-----|--------|--------|
| `focus-visible` on AdminUi + Feedback | +3 | 4h |
| Reduced motion on all marquees | +3 | 2h |
| MediaCenter play `aria-label` | +2 | 1h |
| Feedback error `aria-describedby` | +2 | 2h |
| AdminButton `min-h-11` (44px) | +2 | 1h |
| Audit legacy registration forms | +3 | 3 days |
| Remove global `overflow-x: hidden` clipping | +2 | 1 day |
| Committee keyboard reorder | +1 | 1 day |

**Estimated time: 1–2 weeks**
