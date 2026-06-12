# Accessibility Audit — Shiksha Mahakumbh 6.0

**Date:** June 2026  
**Target:** WCAG 2.1 Level AA  
**Lighthouse a11y (prior):** 96–97 on certified routes

---

## Executive summary

| Area | Score | Status |
|------|------:|--------|
| Forms & registration | 90/100 | Strong `FormField` pattern |
| Navigation | 70/100 | No global skip link |
| Media & images | 55/100 | Alt-text gaps on legacy pages |
| Color contrast | 85/100 | Brand tokens generally pass |
| Keyboard navigation | 75/100 | Modal focus risk; partial tab order |
| Screen reader | 70/100 | Landmarks good; live regions partial |
| Motion | 95/100 | `prefers-reduced-motion` implemented |

---

## WCAG 2.1 AA checklist

### Perceivable

| Criterion | Status | Evidence | Gap |
|-----------|--------|----------|-----|
| 1.1.1 Non-text content | ⚠️ Partial | `next/image` on modern pages | Legacy `<img>` without alt |
| 1.3.1 Info and relationships | ✅ Good | Semantic headings, `FormField` labels | Committee tables need `<th scope>` |
| 1.4.3 Contrast (minimum) | ✅ Good | Navy `#0B1F3B` on white | Saffron on white — verify 4.5:1 |
| 1.4.4 Resize text | ✅ Good | Rem-based Tailwind | — |
| 1.4.10 Reflow | ⚠️ Partial | `overflow-x-auto` on tables | Some fixed-width legacy layouts |
| 1.4.11 Non-text contrast | ⚠️ Partial | Focus rings visible | Icon-only buttons on legacy pages |

### Operable

| Criterion | Status | Evidence | Gap |
|-----------|--------|----------|-----|
| 2.1.1 Keyboard | ⚠️ Partial | Nav drawer, forms | Modal trap not verified |
| 2.4.1 Bypass blocks | ❌ Fail | Academic Council local skip only | **No global skip link** |
| 2.4.3 Focus order | ⚠️ Partial | Logical on registration | Legacy pages untested |
| 2.4.7 Focus visible | ✅ Good | `focus-visible:ring-2` in globals | — |
| 2.5.5 Target size | ⚠️ Partial | 44px on new components | Press share buttons, legacy CTAs |

### Understandable

| Criterion | Status | Evidence | Gap |
|-----------|--------|----------|-----|
| 3.1.1 Language of page | ✅ Good | `<html lang="en">` | Locale pages need `lang` attr |
| 3.2.1 On focus | ✅ Good | No unexpected context change | — |
| 3.3.1 Error identification | ✅ Good | `FormField` `aria-invalid` + `role="alert"` | — |
| 3.3.2 Labels/instructions | ✅ Good | All registration fields labeled | — |

### Robust

| Criterion | Status | Evidence | Gap |
|-----------|--------|----------|-----|
| 4.1.2 Name, role, value | ⚠️ Partial | Noticeboard tabs完整 | Custom dropdowns need audit |
| 4.1.3 Status messages | ⚠️ Partial | Toast notifications | `aria-live` on async updates |

---

## Strong patterns (preserve)

### FormField (`src/components/forms/FormField.tsx`)

- `<label htmlFor={name}>` association
- `aria-invalid` on validation failure
- `aria-describedby` linking to error message
- Error text with `role="alert"`
- Used across: Delegate, Olympiad, Awards, Conclave, Generic forms

### Noticeboard (`NoticeboardClient.tsx`)

- `role="tablist"`, `role="tab"`, `role="tabpanel"`
- `aria-selected`, `aria-controls`
- `aria-busy` during loading
- Refresh button with `aria-label`

### Registration stepper (`RegistrationProgress.tsx`)

- `aria-current="step"`
- Progress bar roles

### Layout landmarks

- `<main id="main-content">` in `PublicPageShell`
- `<header>`, `<footer>` in layout
- `ShowcaseHero` `aria-labelledby`

### Motion

```css
@media (prefers-reduced-motion: reduce) {
  * { animation-duration: 0.01ms !important; }
}
```

---

## Critical gaps

### 1. Global skip link (WCAG 2.4.1)

**Current:** Only `AcademicCouncil24.tsx` has local skip link.  
**Required:** Root layout skip link:

```html
<a href="#main-content" class="sr-only focus:not-sr-only">
  Skip to main content
</a>
```

**Priority:** P0 · Effort: S · No visual impact

### 2. Alt text on legacy images

| Location | Count | Priority |
|----------|------:|----------|
| Past event pages | 50+ images | P0 |
| Press archive components | 30+ clippings | P1 |
| Sponsor/partner logos | 33 logos | P1 |
| Committee member photos | Per-edition | P1 (CMS field) |

**CMS fix:** `alt_text` required on all `media_items` and `committee_members`.

### 3. Modal focus management

| Modal | Risk |
|-------|------|
| Edition announcement | Focus trap not verified |
| Image lightbox | Needs focus return on close |
| Mobile nav drawer | Escape key handler |

**Priority:** P1

### 4. Color contrast verification

| Pair | Colors | Action |
|------|--------|--------|
| Saffron CTA on white | `#FF9933` / white | Measure — may need `#E67E00` for text |
| Muted gray text | `text-gray-500` | Verify on `surface` backgrounds |
| Link underline | Tailwind defaults | Ensure 3:1 non-color cue |

### 5. Hindi / RTL readiness

| Item | Status |
|------|--------|
| `lang="hi"` on Hindi pages | ❌ Not set |
| `dir="rtl"` for Arabic (future) | ❌ Not prepared |
| Font support for Devanagari | ⚠️ Inter insufficient — need Noto Sans Devanagari |

---

## Admin portal accessibility (planned)

| Requirement | Implementation |
|-------------|----------------|
| Keyboard-navigable data tables | Arrow key row focus |
| Screen reader table headers | `<th scope="col">` |
| Form validation | Same `FormField` pattern |
| Status announcements | `aria-live="polite"` on save/delete |
| Color not sole indicator | Icons + text for status badges |

---

## Remediation roadmap

| Phase | Actions | Effort |
|-------|---------|--------|
| **Quick wins** | Global skip link, focus-visible audit, share button 44px | 1 sprint |
| **Content** | Alt-text on top 50 images, committee table headers | 1 sprint |
| **CMS-era** | Required alt on upload, contrast check on admin previews | Ongoing |
| **i18n a11y** | `lang` attr per locale, Devanagari font | Phase 2 i18n |

---

## Testing tools

| Tool | Use |
|------|-----|
| axe DevTools | Per-page scan |
| Lighthouse accessibility | CI gate (target ≥ 95) |
| NVDA / VoiceOver | Manual screen reader |
| Keyboard-only navigation | Tab through registration flow |
| WAVE | Color contrast check |

---

## Certification target

| Route | Current est. | Target |
|-------|-------------|--------|
| `/` | 96 | 98 |
| `/registration` | 95 | 98 |
| `/noticeboard` | 97 | 98 |
| `/past-events` | 82 | 95 |
| `/press/*` | 85 | 95 |
| Admin portal (new) | — | 95 |

**Reference:** `docs/FINAL_PRODUCTION_CERTIFICATION.md` §6, `docs/ENTERPRISE_TRANSFORMATION_REPORT.md` §7

**No code changes during this audit phase.**
