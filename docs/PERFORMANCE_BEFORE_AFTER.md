# Performance Before / After (Phase 2)

**Date:** 2026-06-04  
**Environment:** Local `npm run build` (Windows, Node 8GB heap)

> Production Lighthouse should be re-run post-deploy for authoritative LCP/CLS/INP. Baseline mobile Performance was ~32–38 (`docs/FINAL_LIGHTHOUSE_REPORT.md`).

## Architecture changes (expected impact)

| Area | Before | After | Expected effect |
|------|--------|-------|-----------------|
| Root layout | `RootClientShell` wrapped **all** `children` | `{children}` + sibling `ClientChrome` | Smaller client tree; more RSC-eligible pages |
| Footer Firebase | `onSnapshot` ×2 on every Footer mount + antd `Spin` | `/api/visitors` POST+GET; dynamic `FooterVisitorCounter` | Fewer realtime listeners; no antd on Footer |
| Noticeboard | Client-only `getDocs` on mount | Server fetch + `revalidate: 300` + client refresh | Faster TTFB; cached ISR |
| Analytics UTM | Always on mount | Consent-gated (`smk-cookie-accepted`) | Less main-thread on reject |
| Carousels | Static `react-slick` import | `LazySlickSlider` / `LazyEventImageSlider` | Smaller initial JS on non-slider routes |
| Dependencies | 782 extra packages | Removed unused server/ORM/router deps | Faster install; smaller lockfile |

## Build output comparison (First Load JS)

| Route | Phase 1 (approx.) | Phase 2 build |
|-------|-------------------|---------------|
| `/` | 417 kB | ~417 kB (unchanged — home still client-heavy) |
| `/registration` | 571 kB (page 243 B + shared) | **540 kB** shared route total |
| `/noticeboard` | 516 kB (page 24.6 kB) | **514 kB** (page **20.6 kB**) |
| Shared chunks | 101 kB | **102 kB** |

## Bundle / install metrics

| Metric | After Phase 2 |
|--------|----------------|
| `npm install` packages removed | **782** |
| Footer antd import | **Removed** |
| Global `NextIntlClientProvider` on all pages | **Removed** (scoped to `NavIntlProvider` in NavBar) |

## Metrics to validate in production

Run Lighthouse mobile (3 medians) on:

1. `/`
2. `/registration`
3. `/introduction`
4. `/noticeboard`

Record: **LCP**, **CLS**, **INP**, **TBT**, **JS bytes**.

### Hypothesis

- **LCP:** Improved on `/noticeboard` (ISR + no client Firestore on first paint).
- **INP/TBT:** Improved site-wide from Footer listener removal and shell split.
- **CLS:** Neutral (no layout changes).

## Hydration

- Registration page remains a client page (`RegistrationHub`); **no new** client boundary on `/registration` page file.
- Visitor counter hydrates only after Footer paints (`ssr: false` dynamic).

## Build time

Observed full build ~200s (similar to Phase 1; Firestore warning during SSG when offline).

## Commands

```bash
npm run lint
npm run build
# Post-deploy:
npm run smoke:prod
```
