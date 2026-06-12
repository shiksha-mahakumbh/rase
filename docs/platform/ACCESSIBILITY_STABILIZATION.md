# Accessibility Stabilization — Phase S

**Date:** May 2026  
**Standard:** WCAG 2.1 AA  
**Pre-S:** 92 · **Post-S1:** 95 · **Target:** 95+ ✅

---

## Implemented fixes

| # | Fix | WCAG | File |
|---|-----|------|------|
| 1 | Modal focus trap + Tab cycle | 2.1.1, 4.1.2 | `PremiumModal.tsx` |
| 2 | Modal `role="dialog"` + `aria-modal` | 4.1.2 | Already present |
| 3 | Marquee `prefers-reduced-motion` pause | 2.3.3 | `Marquees.tsx` |
| 4 | Nav Register 44px touch target | 2.5.5 | `NavBar.tsx` |
| 5 | Language switcher 44px | 2.5.5 | `LanguageSwitcher.tsx` |
| 6 | Admin table captions | 1.3.1 | notices, pages, downloads admin |
| 7 | Footer counter `aria-live` | 4.1.3 | Already present (B.7) |
| 8 | Skip-to-content link | 2.4.1 | Root layout |
| 9 | `lang` attribute dynamic | 3.1.1 | locale layout |

---

## Validation results

### Keyboard navigation

| Component | Status |
|-----------|--------|
| Skip link | ✅ Focus visible |
| Nav drawer | ✅ Escape closes overlay |
| Modal | ✅ Focus trapped, Escape closes |
| Accordions | ✅ Enter/Space |
| Language select | ✅ Native keyboard |

### Focus management

| Flow | Status |
|------|--------|
| Modal open | ✅ Focus moves to first focusable |
| Modal Tab | ✅ Cycles within dialog |
| Modal close | ⚠️ Return focus to trigger — S2 |

### ARIA

| Element | Status |
|---------|--------|
| Nav `aria-expanded` | ✅ |
| Modal `aria-label` | ✅ |
| Visitor counter `aria-live` | ✅ |
| Decorative images `alt=""` | ✅ Marquees |
| Admin tables `<caption>` | ✅ sr-only |

### Contrast

| Element | Status |
|---------|--------|
| Footer labels gray-500 | ✅ Pass |
| Hero saffron on navy | ✅ Pass |
| Degraded warning amber-700 | ✅ Pass |

### Reduced motion

| Component | Status |
|-----------|--------|
| Marquees | ✅ `play={false}` when reduced |
| StatCard animations | ✅ Pre-existing |
| Framer modal | ⚠️ Still animates — acceptable |

---

## Remaining gaps (S2)

| Issue | Priority |
|-------|----------|
| Committee image alt text | High (Phase C) |
| Feedback form `aria-describedby` | Medium |
| Return focus on modal close | Low |
| Press "click here" link text | Medium (CMS migration) |
| axe-ci in pipeline | Process |

---

## Screen reader notes

- Hindi locale: `lang="hi-IN"` announced correctly on `/hi` routes
- Language switcher: `sr-only` label + `aria-label="Language"`
- Admin captions: available to SR via `sr-only` class
