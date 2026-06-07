# P3b Production Sign-Off Report — Performance Optimization

**Status:** Significant improvements delivered — **staging deploy recommended**; production pending final staging Lighthouse  
**Date:** 7 June 2026  
**Prerequisite:** P3 quality review complete

---

## Executive Summary

P3b reduced homepage First Load JS by **46%** (391 kB → 213 kB), cut homepage Total Blocking Time by **68%** (2,360 ms → 760 ms), improved homepage Performance from **43 → 70**, and achieved **SEO 100** on all six audited pages. Accessibility meets target (96–97) on all pages. **Performance ≥ 90** is not yet met on local production build for homepage/contact — primarily due to NavBar client bundle (Framer Motion, search, i18n) shared across all routes.

**Recommendation:** Deploy to **staging with CDN** and re-run Lighthouse. Production cutover acceptable if staging confirms Performance ≥ 85 with CDN, or team accepts documented NavBar optimization backlog (P3c).

---

## 1. Bundle Size Reduction

| Route | Before (P3) | After (P3b) | Change |
|-------|-------------|-------------|--------|
| `/` (homepage) | **391 kB** First Load JS | **213 kB** | **−178 kB (−46%)** |
| `/` page component | 183 B | 164 B | Server-rendered shell |
| `/contact-us` | ~364 kB (component) | **325 kB** total / 2.9 kB page | Form split to async chunk |
| `/past-events` | 368 kB | **214 kB** | −154 kB |
| `/committees` | — | **212 kB** | Lean shared shell |
| `/media-center` | 365 kB | **214 kB** | −151 kB |
| `/departments/academic-council` | 232 kB | **232 kB** | Unchanged (heavy tab SPA) |

---

## 2. JavaScript Reduction — Changes Made

### Homepage architecture
| Change | Impact |
|--------|--------|
| Removed `"use client"` from `HomePage.tsx` | Server component boundary — below-fold sections no longer in initial client bundle |
| `next/dynamic` for 15+ below-fold sections | Code-split chunks load on demand |
| `LazySection` + `SectionSkeleton` | Defers hydration until 250px from viewport |
| `HomePageChrome` client island | Sticky bar + FAB isolated with `ssr: false` |

### Firebase modularization
| Change | Impact |
|--------|--------|
| `lib/firebase/client.ts` | Firestore-only init for contact/footer |
| `lib/firebase/lazy.ts` | Auth/Storage/Analytics lazy-loaded |
| `lib/firebase/registration-services.ts` | Auth+Storage isolated to registration routes |
| Contact + footer import `client.ts` directly | Avoids Auth/Storage in contact page critical path |

### Framer Motion removal
| Component | Change |
|-----------|--------|
| `Footer.tsx` | CSS transitions replace `motion.a` |
| `ContactUs.tsx` | Converted to server component — no motion |
| `NoticeBoard.tsx` | Static server component — motion removed |

### Third-party / deferred loading
| Change | Impact |
|--------|--------|
| `FooterContactForm` | `dynamic()` with `ssr: false` |
| `ContactUsForm` + `ContactMap` | Split async client chunks |
| `ContactMap` | Lazy iframe via `LazySection` |
| `ClientChrome` modal | Deferred via `requestIdleCallback` (3s timeout) |
| Font Awesome removed from Footer | ~30 kB+ saved from shared footer chunk |

---

## 3. Image Savings

| Item | Status |
|------|--------|
| Hero `next/image` with `priority` + `sizes` | Already optimized |
| Past editions lazy loading | `loading="lazy"` on edition cards |
| Oversized asset replacement | **Deferred** — SMK 5.0 placeholder image flagged in P3 |
| WebP/AVIF automatic conversion | Via Next.js image optimizer on deploy |

**Estimated image savings on deploy:** Next.js CDN will serve WebP/AVIF — not measurable on local `next start`.

---

## 4. Lighthouse Improvements (Before → After)

**Environment:** Local `next start`, Lighthouse 12.8.2, headless Chrome

### Homepage (`/`)

| Metric | P3 Before | P3b After | Target |
|--------|-----------|-----------|--------|
| Performance | 43 | **70** | ≥ 90 |
| Accessibility | 93 | **96** | ≥ 95 ✅ |
| Best Practices | 89 | **89** | ≥ 95 |
| SEO | 92 | **100** | 100 ✅ |
| LCP | 4.7 s | **2.4 s** | < 2.5 s ✅ |
| FCP | 2.0 s | ~2.2 s | < 1.8 s |
| CLS | 0 | **0** | < 0.1 ✅ |
| TBT | 2,360 ms | **760 ms** | — |

### Contact (`/contact-us`)

| Metric | P3 Before | P3b After | Target |
|--------|-----------|-----------|--------|
| Performance | 44 | **60** | ≥ 90 |
| Accessibility | 96 | **96** | ≥ 95 ✅ |
| Best Practices | 93 | **93** | ≥ 95 |
| SEO | 92 | **100** | 100 ✅ |
| TBT | 2,240 ms | **740 ms** | — |

### All six required pages (P3b audit)

| Page | Perf | A11y | BP | SEO | CLS |
|------|------|------|-----|-----|-----|
| `/` | 70 | 96 | 89 | **100** | 0 |
| `/past-events` | **72** | 96 | 93 | **100** | 0 |
| `/media-center` | **70** | 97 | 93 | **100** | 0 |
| `/contact-us` | 60 | 96 | 93 | **100** | 0 |
| `/departments/academic-council` | 45 | 96 | **96** | **100** | 0 |
| `/committees` | 48 | 96 | 93 | **100** | 0 |

**Reports:** `docs/lighthouse/p3b/*.json` + `*.html` + `summary.json`

---

## 5. Core Web Vitals

| Page | LCP | FCP | CLS | TBT |
|------|-----|-----|-----|-----|
| Homepage | **2.4 s** ✅ | ~2.2 s | **0** ✅ | 760 ms |
| Contact | 4.4 s | 1.8 s | **0** ✅ | 740 ms |
| Past Events | **2.3 s** ✅ | 1.8 s | **0** ✅ | 880 ms |
| Media Center | **1.7 s** ✅ | 1.0 s | **0** ✅ | 1,810 ms |

**CLS remains 0 across all pages** — AdSense-safe.

---

## 6. Pages Tested

1. `/` (homepage)
2. `/past-events`
3. `/media-center`
4. `/contact-us`
5. `/departments/academic-council`
6. `/committees`

**Staging validation:** Not run — requires deployed staging domain with CDN. Use:

```bash
LH_BASE_URL=https://staging.rase.co.in npm run lighthouse:local
```

---

## 7. Ranked Optimization Opportunities (Audit)

| Rank | Opportunity | Est. Impact | Status |
|------|-------------|-------------|--------|
| 1 | Homepage client boundary (`HomePage.tsx` → server) | **High** — −178 kB | ✅ Done |
| 2 | Below-fold lazy loading + dynamic imports | **High** — TBT −68% | ✅ Done |
| 3 | Firebase modular split (contact/footer) | **Medium** — contact TBT −67% | ✅ Done |
| 4 | Remove Framer Motion from Footer/Contact/NoticeBoard | **Medium** | ✅ Done |
| 5 | Remove Font Awesome from Footer | **Medium** — −19 kB shared | ✅ Done |
| 6 | Defer announcement modal (`requestIdleCallback`) | **Low-Medium** | ✅ Done |
| 7 | **NavBar Framer Motion** (17 usages) | **High** — blocks all pages | ⏳ P3c |
| 8 | **Academic Council tab SPA** (18.4 kB page + heavy client) | **High** — academic-council perf 45 | ⏳ P3c |
| 9 | Dynamic `GlobalSearch` + `LanguageSwitcher` in NavBar | **Medium** | ⏳ P3c |
| 10 | Replace registration `<img>` captchas with `next/image` | **Low** | ⏳ Backlog |
| 11 | `antd` / `@nextui-org` duplicate UI libraries | **Medium** — tree-shake audit | ⏳ Backlog |

---

## 8. Remaining Risks

| Risk | Severity | Mitigation |
|------|----------|------------|
| Performance < 90 on local for home/contact | Medium | Staging CDN test; NavBar P3c pass |
| Academic Council heavy client bundle | Medium | Route-based subpages under `/departments/academic-council/[track]` |
| Lighthouse variance on Windows local | Low | Use staging/production for sign-off |
| Firebase Firestore offline warnings at build | Low | Expected without network; no user impact |
| Best Practices 89 on homepage | Low | Third-party scripts (AdSense meta, analytics) — verify on staging |

---

## 9. AdSense Readiness

| Check | Status |
|-------|--------|
| CLS = 0 on all tested pages | ✅ |
| Reserved ad slots (`ReservedAdSlot`, `AdSlotRegion`) | ✅ |
| AdSense script `strategy="lazyOnload"` | ✅ |
| Responsive ad containers | ✅ |
| Stable layout (no shift on lazy sections) | ✅ — `minHeight` placeholders |

---

## 10. Production Deployment Recommendation

### Staging — **RECOMMENDED NOW**

Deploy P3b to staging and run:

```bash
LH_BASE_URL=https://<staging-domain> npm run lighthouse:local
node scripts/verify-internal-links.mjs
```

**Expected staging uplift:** CDN edge caching, HTTP/2, Brotli compression typically add +10–20 Performance points.

### Production — **CONDITIONAL**

| Condition | Action |
|-----------|--------|
| Staging homepage Performance ≥ 85 | ✅ Approve production |
| Staging homepage Performance 70–84 | Deploy with P3c NavBar sprint scheduled within 2 weeks |
| Staging homepage Performance < 70 | Block — complete NavBar Framer Motion removal first |

**Current local evidence:** Homepage Performance **70** (+27 pts), SEO **100** on all pages, Accessibility **96+**, CLS **0**. Substantial progress; not yet at 90 local threshold.

---

## Files Modified (P3b)

```
src/components/home/HomePage.tsx          (server component + dynamic imports)
src/components/home/HomePageChrome.tsx  (new)
src/components/performance/LazySection.tsx (new)
src/components/performance/SectionSkeleton.tsx (new)
src/lib/firebase/client.ts              (new)
src/lib/firebase/lazy.ts                (new)
src/lib/firebase/registration-services.ts (new)
src/lib/firebase.ts                     (updated)
src/app/firebase.ts                       (updated)
src/app/component/ContactUs.tsx         (server + split)
src/components/contact/ContactUsForm.tsx  (new)
src/components/contact/ContactMap.tsx     (new)
src/app/contact-us/page.tsx             (dynamic footer)
src/app/component/Footer.tsx              (no framer-motion, no FA, lazy form)
src/app/component/NoticeBoard.tsx       (server, no motion)
src/components/footer/FooterContactForm.tsx (firebase client import)
src/components/home/CountdownBanner.tsx (useMemo fix)
src/app/ClientChrome.tsx                (deferred modal)
scripts/analyze-bundle.mjs              (new)
scripts/run-lighthouse.mjs              (new)
package.json                            (analyze + lighthouse scripts)
docs/lighthouse/p3b/                    (audit artifacts)
```

---

## Re-Validation Commands

```bash
cd rase
npm run build
npm run start
npm run analyze:bundle
npm run lighthouse:local
node scripts/verify-internal-links.mjs
```

---

*See `docs/P3_PRE_DEPLOYMENT_REPORT.md` for P3 quality baseline and `docs/P2_IMPLEMENTATION_REPORT.md` for URL migration status.*
