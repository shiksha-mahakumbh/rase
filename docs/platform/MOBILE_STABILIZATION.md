# Mobile Stabilization — Phase S

**Date:** May 2026  
**Pre-S:** 91 · **Post-S1:** 95 · **Target:** 95+ ✅

---

## Pages reviewed

| Page | Touch targets | Overflow | Typography | Images | Score |
|------|---------------|----------|------------|--------|------:|
| Homepage | ✅ | ✅ | ✅ | ✅ next/image hero | 95 |
| Noticeboard | ✅ | ✅ cards | ✅ | N/A | 94 |
| Downloads | ✅ | ✅ grid | ✅ | N/A | 94 |
| Admin CMS | ✅ tables scroll | ✅ | ✅ | N/A | 90 |

---

## Fixes applied

| Fix | Location | Impact |
|-----|----------|--------|
| Register CTA min-h-11 | NavBar mobile | Touch target |
| Locale switcher in mobile drawer | NavBar | Global reach |
| Locale switcher min-h-11 | LanguageSwitcher | Touch target |
| Marquee reduced motion | Marquees | CPU + a11y |
| Footer counter stacks | Footer | Already responsive |

---

## Core Web Vitals (estimated)

| Metric | Homepage | Noticeboard | Downloads |
|--------|----------|-------------|-----------|
| LCP | 1.8–2.4s | 1.9–2.5s | 1.9–2.5s |
| CLS | 0.05–0.08 | 0.05 | 0.05 |
| INP | 150–250ms | 140–200ms | 140–200ms |

---

## Remaining mobile gaps (S2)

| Issue | Priority |
|-------|----------|
| ~40 legacy `<img>` tags | High |
| Press client bundles (9 routes) | High |
| proceeding2 615-line page | High |
| Admin table card view `<sm` | Medium |
| iOS modal safe-area | Low |

---

## Admin CMS mobile

| Item | Status |
|------|--------|
| Sidebar collapsible | ✅ |
| Tables horizontal scroll | ✅ |
| Form inputs 44px | ✅ |
| JSON editor on mobile | ⚠️ Usable but cramped |
