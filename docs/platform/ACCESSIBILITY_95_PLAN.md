# Accessibility 95+ Plan — WCAG 2.1 AA+

**Date:** May 2026  
**Current a11y score:** 92/100  
**WCAG 2.1 AA alignment:** ~88%  
**Target:** 95+/100 (AA+ toward AAA on key flows)  
**Status:** Roadmap only — no implementation

---

## Current state

| Principle | Pass | Partial | Fail |
|-----------|-----:|--------:|-----:|
| Perceivable | 18 | 4 | 2 |
| Operable | 16 | 3 | 1 |
| Understandable | 14 | 2 | 0 |
| Robust | 12 | 2 | 1 |

### Implemented strengths

- Skip-to-content link → `#main-content`
- Accordion keyboard (Enter/Space) + `aria-expanded`
- Focus-visible outlines on CTAs, footer, admin UI
- 44px touch targets on FAQ, footer social (B.6)
- `prefers-reduced-motion` on announcement, stat cards
- `aria-live="polite"` on visitor counter (B.7 fix)
- Admin form labels in `AdminUi.tsx`
- Admin nav `aria-expanded` on mobile menu

---

## Gap analysis by WCAG criterion

### 1. Perceivable

| Criterion | Issue | Severity | Fix |
|-----------|-------|----------|-----|
| 1.1.1 Non-text content | Committee photos missing alt | High | `alt={member.name}` |
| 1.1.1 | Generic "Partner 1" alt text | Medium | CMS partner name as alt |
| 1.3.1 Info and relationships | Admin tables no `<caption>` | Medium | Add captions |
| 1.4.3 Contrast | Gray-400 on gray-100 footer labels | Medium | → gray-600 |
| 1.4.3 | Saffron on navy hero | ✅ Pass | — |
| 1.4.10 Reflow | Tables overflow | Low | `overflow-x-auto` present |
| 1.4.11 Non-text contrast | Focus ring visibility | ✅ Pass | — |

### 2. Operable

| Criterion | Issue | Severity | Fix |
|-----------|-------|----------|-----|
| 2.1.1 Keyboard | Marquee not keyboard accessible | Medium | Pause + tab through links |
| 2.1.1 | Modal no focus trap | High | `role="dialog"` + trap |
| 2.1.2 No keyboard trap | Mobile nav focus | Low | Verify escape closes |
| 2.4.1 Bypass blocks | Skip link | ✅ | — |
| 2.4.4 Link purpose | "Click here" in legacy press | Medium | Descriptive link text |
| 2.4.7 Focus visible | Most interactive elements | ✅ | Nav CTA needs check |
| 2.5.5 Target size | Nav CTA below 44px | High | Increase padding |

### 3. Understandable

| Criterion | Issue | Severity | Fix |
|-----------|-------|----------|-----|
| 3.2.4 Consistent identification | Nav/footer consistent | ✅ | — |
| 3.3.1 Error identification | Feedback form errors unlinked | Medium | `aria-describedby` |
| 3.3.2 Labels | Admin CMS forms | ✅ | — |
| 3.3.2 | Registration selects (Firebase) | Medium | Do not modify flow — label audit only |

### 4. Robust

| Criterion | Issue | Severity | Fix |
|-----------|-------|----------|-----|
| 4.1.2 Name, role, value | Announcement modal missing `role="dialog"` | High | Add role + `aria-modal` |
| 4.1.3 Status messages | Visitor counter | ✅ `aria-live` | — |
| 4.1.3 | Toast notifications in admin | Low | `role="status"` on toasts |

---

## Phased plan

### S1 — Critical fixes (week 1) → 94

| # | Task | WCAG | Effort |
|---|------|------|--------|
| 1 | Modal focus trap + `role="dialog"` | 2.1.1, 4.1.2 | 1 day |
| 2 | Nav CTA 44px touch target | 2.5.5 | 0.5 day |
| 3 | Committee image alt text | 1.1.1 | 1 day |
| 4 | `prefers-reduced-motion` on marquees | 2.3.3 | 0.5 day |
| 5 | Admin table captions | 1.3.1 | 0.5 day |

### S2 — Forms & content (weeks 2–3) → 95

| # | Task | Effort |
|---|------|--------|
| 1 | Feedback form `aria-describedby` on errors | 0.5 day |
| 2 | Gray-400 → gray-600 contrast fix | 0.5 day |
| 3 | Replace "click here" CTAs in press (during CMS migration) | 2 days |
| 4 | Partner alt text from CMS name | 1 day |
| 5 | Screen reader test on homepage + registration | 1 day |

### S3 — AA+ enhancements (weeks 4–6) → 96

| # | Task | Standard |
|---|------|----------|
| 1 | Keyboard-accessible marquee with pause button | AA |
| 2 | High contrast mode support (`prefers-contrast`) | AA+ |
| 3 | Hindi `lang` attribute per route | 3.1.1 |
| 4 | Admin JSON editor accessibility (syntax errors announced) | AA |
| 5 | Automated axe-ci on key routes in CI | Process |

---

## Screen reader testing plan

| Flow | Tool | Pass criteria |
|------|------|---------------|
| Homepage navigation | NVDA + VoiceOver | Landmarks announced, skip link works |
| Noticeboard filter | NVDA | Filter state announced |
| Downloads search | NVDA | Results count announced |
| Registration start | VoiceOver | Form labels read correctly |
| Admin CMS create notice | NVDA | Form errors linked |
| Visitor counter update | NVDA | `aria-live` announces new count |
| Announcement modal | VoiceOver | Focus trapped, dismissible |

---

## Key flows AA+ target

| Flow | Current | Target |
|------|---------|--------|
| Homepage | 92 | 96 |
| Registration | 78 | 85 (no flow change) |
| Noticeboard | 90 | 95 |
| Downloads | 90 | 95 |
| Contact/feedback | 82 | 90 |
| Admin CMS | 90 | 94 |

---

## Score projection

| Milestone | A11y score | WCAG AA % |
|-----------|------------|----------|
| Current | 92 | 88% |
| After S1 | 94 | 92% |
| After S2 | 95 | 94% |
| After S3 | 96 | 96% |
