# Accessibility Global Audit — Shiksha Mahakumbh 6.0

**Date:** June 2026 (Phase B.5 refresh)  
**Target:** WCAG 2.1 Level AA  
**Method:** Code review + component pattern analysis

---

## Overall accessibility score: **68/100**

| Criterion | Score | Status |
|-----------|------:|--------|
| Perceivable (alt text, contrast) | 62/100 | ⚠️ |
| Operable (keyboard, focus) | 65/100 | ⚠️ |
| Understandable (labels, errors) | 78/100 | ✅ |
| Robust (ARIA, semantics) | 70/100 | ⚠️ |

---

## 1. Alt tags

| Area | Coverage | Issues |
|------|----------|--------|
| Partner/sponsor logos | ~30% | Most `<img>` lack meaningful alt |
| Hero banners | ~50% | Decorative vs informative unclear |
| Committee photos | ~10% | Inline arrays without alt |
| Gallery slideshow | ~60% | `slides-data.ts` has partial alt |
| Press article images | ~40% | Generic or missing alt |
| Icons (nav, social) | ~20% | Missing `aria-label` |

**Count estimate:** ~200+ images site-wide, ~70 lack adequate alt text.

---

## 2. Form labels

| Form | Labels | Status |
|------|--------|--------|
| Registration (Delegate) | `FormField` wrapper | ✅ Strong |
| Registration (other types) | Mixed | ⚠️ Some placeholder-only |
| Feedback | Labeled inputs | ✅ |
| Contact | Labeled inputs | ✅ |
| Newsletter | Email label | ✅ |
| Donation | Partial | ⚠️ |
| Search (GlobalSearch) | `aria-label` on input | ✅ |
| Admin datadekh filters | Missing labels | ❌ |

**Pattern to replicate:** `FormField` component used in delegate registration — extend to all forms.

---

## 3. Keyboard navigation

| Feature | Keyboard accessible | Issues |
|---------|--------------------| -------|
| Main navigation | ⚠️ | Mobile menu trap not tested |
| Modal (announcement) | ✅ | Focus returns on close |
| Accordion (announcements) | ⚠️ | Click-only, no arrow keys |
| Registration multi-step | ⚠️ | Tab order on conditional fields |
| Cookie consent | ✅ | Accept/decline buttons |
| Footer links | ✅ | Standard anchors |
| Image carousels | ❌ | No keyboard prev/next |
| Skip to main content | ❌ | **Not implemented** |

---

## 4. Color contrast

| Element | Ratio est. | WCAG AA |
|---------|------------|---------|
| Primary text on white | 12:1 | ✅ |
| Gray-500 labels | 4.6:1 | ✅ |
| Yellow-300 on primary bg (modal) | 3.2:1 | ❌ Fail |
| Cyan-300 links on primary bg | 3.8:1 | ❌ Fail |
| Primary button text | 4.8:1 | ✅ |
| Disabled form fields | 3.0:1 | ❌ Fail |

**Critical:** Modal announcement (`ClientChrome.tsx`) has contrast failures on yellow/cyan text over primary blue background.

---

## 5. Skip links

| Page | Skip link | Status |
|------|-----------|--------|
| All pages | — | ❌ Missing |

**Recommendation:** Add to root `layout.tsx`:
```html
<a href="#main-content" class="sr-only focus:not-sr-only">Skip to main content</a>
```

---

## 6. Screen reader support

| Feature | ARIA | Status |
|---------|------|--------|
| Visitor counter | Skeleton `aria-hidden` | ✅ |
| Loading states | Partial | ⚠️ |
| Live regions (toast) | `react-hot-toast` | ✅ |
| Navigation landmarks | `<nav>` present | ✅ |
| Main content landmark | `<main>` inconsistent | ⚠️ |
| Announcement bar (future) | Not wired | — |
| Charts (admin analytics) | N/A public | — |

---

## 7. Motion & animation

| Component | Reduced motion | Status |
|-----------|----------------|--------|
| Hero carousel | No `prefers-reduced-motion` | ❌ |
| Marquee ticker | Continuous scroll | ❌ |
| Modal entrance | CSS animation | ⚠️ |
| Counter skeleton | Pulse animation | ⚠️ |

---

## Route-level accessibility scores (sample)

| Route | Score /10 | Top issue |
|-------|----------:|-----------|
| `/` | 6.5 | Missing skip link, carousel keyboard |
| `/registration` | 8.0 | Strong FormField pattern |
| `/noticeboard` | 6.0 | Image alt on attachments |
| `/committees` | 5.5 | Member photos without alt |
| `/feedback` | 8.5 | Well-labeled form |
| `/contact-us` | 8.0 | Good form structure |
| `/press/*` | 6.0 | Article image alt |
| Admin routes | 4.0 | Tables not screen-reader optimized |

---

## Priority fixes

| Priority | Fix | WCAG criterion |
|----------|-----|----------------|
| P0 | Global skip-to-content link | 2.4.1 Bypass Blocks |
| P0 | Fix modal contrast (yellow/cyan on blue) | 1.4.3 Contrast |
| P1 | Alt text on partner logos + hero images | 1.1.1 Non-text Content |
| P1 | `prefers-reduced-motion` on carousel/marquee | 2.3.3 Animation |
| P1 | Keyboard support on accordions | 2.1.1 Keyboard |
| P2 | `<main id="main-content">` on all page templates | 1.3.1 Info and Relationships |
| P2 | Committee member photo alt from CMS | 1.1.1 |
| P3 | Admin table ARIA labels | 4.1.2 Name, Role, Value |

---

## Production readiness (Accessibility pillar): **68/100**
