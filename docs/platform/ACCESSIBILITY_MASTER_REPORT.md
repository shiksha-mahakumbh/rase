# Accessibility Master Report — WCAG 2.1 AA

**Date:** May 2026  
**Current accessibility score:** 92/100 (B.6 baseline)

---

## WCAG 2.1 AA checklist summary

| Principle | Pass | Partial | Fail |
|-----------|-----:|--------:|-----:|
| Perceivable | 18 | 4 | 2 |
| Operable | 16 | 3 | 1 |
| Understandable | 14 | 2 | 0 |
| Robust | 12 | 2 | 1 |

**Overall AA alignment: ~88%** (score 92/100 with weighting)

---

## Implemented (Phase B.6 + B.7)

| Feature | Location |
|---------|----------|
| Skip-to-content link | `layout.tsx` |
| `<main id="main-content">` | Homepage, `PublicPageShell` |
| Accordion keyboard (Enter/Space) | `Annoucement`, `HomeFaqSection` |
| `aria-expanded` / `aria-controls` | Accordions |
| Focus-visible outlines | Footer, CTAs, accordions, admin UI |
| 44px min touch targets | FAQ, UpcomingEvent, footer social |
| `prefers-reduced-motion` | Announcement, UpcomingEvent animations |
| Descriptive alt text | CMS-wired images, trust strip |
| `aria-label` on sections | Hero, venue, FAQ |
| Admin form labels | `AdminUi.tsx` components |
| `aria-live` on visitor counter | `FooterVisitorCounter` (B.7 fix) |
| Admin nav `aria-expanded` | `AdminShell` mobile menu |

---

## Gaps by category

### Images (1.1.1)

| Issue | Severity | Routes |
|-------|----------|--------|
| Generic alt text ("Partner 1") | Medium | Some legacy partner pages |
| Decorative images without `alt=""` | Low | Marquees |
| Committee member photos missing alt | High | `/committee/*` |

### Keyboard (2.1.1)

| Issue | Severity | Location |
|-------|----------|----------|
| Marquee not keyboard accessible | Medium | Partner carousels |
| Mobile nav focus trap incomplete | Low | NavBar drawer |
| Modal focus trap | Medium | `ClientChrome` announcement modal |

### Forms (3.3.x)

| Issue | Severity | Location |
|-------|----------|----------|
| Some registration fields lack `aria-describedby` | Medium | Firebase forms (do not modify) |
| Error messages not always linked | Medium | Feedback form |
| Admin CMS JSON editor no syntax help | Low | Homepage admin |

### Tables (1.3.1)

| Issue | Location |
|-------|----------|
| Admin tables lack `<caption>` | CMS admin lists |
| Noticeboard table semantics | OK on mobile cards |

### Navigation (2.4.x)

| Item | Status |
|------|--------|
| Skip link | ✅ |
| Page titles unique | ✅ Most routes |
| Focus order logical | ✅ |
| Multiple ways to find content | ✅ Nav + search on downloads |
| Link purpose clear | ⚠️ Some "click here" in legacy content |

### Color contrast (1.4.3)

| Issue | Location |
|-------|----------|
| Gray-400 on gray-100 footer counter labels | ⚠️ Borderline |
| Saffron on navy hero | ✅ Pass |
| Admin amber warning text | ✅ Pass |

---

## Screen reader testing notes

| Component | SR experience |
|-----------|---------------|
| Visitor counter | ✅ `aria-live="polite"` after B.7 |
| Announcement ticker | ⚠️ Marquee may announce repeatedly |
| Hero stats animation | ✅ Respects reduced motion |
| Admin sidebar | ✅ Landmark navigation |

---

## Recommended fixes (stabilization)

### P1

1. Add `role="dialog"` + focus trap to announcement modal
2. Committee member images: require `alt={name}` when Phase C starts (paused)
3. Add `<caption>` to admin notice/download tables

### P2

1. Pause marquees when `prefers-reduced-motion: reduce`
2. Link form errors with `aria-describedby` on feedback page
3. NavBar mobile menu focus trap

### P3

1. Audit gray-400 text contrast → gray-600
2. Replace "click here" CTAs in legacy press content

---

## Score projection

| Milestone | A11y score |
|-----------|------------:|
| Current | 92 |
| After P1 | 94 |
| After full legacy sweep | 96 |
