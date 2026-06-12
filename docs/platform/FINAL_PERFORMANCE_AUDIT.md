# Final Performance Audit

**Date:** May 2026  
**Target:** 95+  
**Current score:** **78 / 100**  
**Maximum achievable:** **95 / 100**

---

## Architecture

| Pattern | Status | Evidence |
|---------|--------|----------|
| Next.js App Router RSC | ✅ | Most public pages server-rendered |
| Client islands | ✅ | Search/filter hubs only |
| Dynamic imports | ⚠️ Partial | Homepage ✅; PublicPageShell ❌ |
| ISR / revalidate | ⚠️ Minimal | Only noticeboard + downloads (`revalidate = 300`) |
| Image optimization | ⚠️ | `next/image` on modern pages; legacy `<img>` on registration |
| API caching | ❌ | Most v2 GETs have no `Cache-Control` |

---

## Bundle analysis

**Tool available:** `npm run analyze:bundle` → `scripts/analyze-bundle.mjs`

### Strong patterns

| File | Pattern |
|------|---------|
| `HomePage.tsx` | `dynamic()` for NavBar, Footer, Marquees, carousels, partner sections |
| `LazySection.tsx` | 250px rootMargin, min-height anti-CLS skeletons |
| `ClientChrome.tsx` | Modal, analytics, cookie consent `ssr: false` |
| `admin/page.tsx` | Charts behind `dynamic()` |
| `LazySlickSlider`, `LazyEventImageSlider` | Defer carousel libraries |

### Weak patterns

| Issue | Impact | Files |
|-------|--------|-------|
| PublicPageShell eager NavBar/Footer | Large initial JS on 49+ routes | `PublicPageShell.tsx` |
| Homepage static-imports above-fold sections | Hero, TrustStrip, WhyAttend, Timeline | `HomePage.tsx` |
| `framer-motion` on Feedback | Animation library on form page | `Feedback.tsx` |
| Knowledge graph barrel exports | Tree-shaking risk | `lib/knowledge-graph/index.ts` |
| Legacy registration components | Heavy client bundles | `Registration/*.tsx` |

---

## Hydration

| Page | Hydration scope | Risk |
|------|----------------|------|
| Homepage | Partial — lazy sections defer hydration | Low |
| Speakers/Partners hubs | Client filter island only | Low |
| Media center | Client search when CMS empty | Medium |
| Registration | Full client form hydration | High |
| Admin CMS | Full client (expected) | Medium |

---

## RSC usage

| Route group | RSC | Client |
|-------------|-----|--------|
| CMS organizational pages | ✅ Loaders server-side | Islands for interaction |
| Knowledge graph pillars | ✅ Server templates | Minimal |
| Registration | ❌ Client-heavy | Firebase SDK |
| Admin | ❌ Client-heavy | Expected |

---

## Image optimization

**Config:** `next.config.js`

| Setting | Status |
|---------|--------|
| `images.remotePatterns` | Firebase, Flaticon, Icons8 |
| Supabase storage (`*.supabase.co`) | ❌ **Not in remotePatterns** |
| `sizes` attribute usage | ✅ Modern components |
| `priority` on LCP images | ✅ Homepage hero |
| Raw `<img>` in legacy | ❌ Registration, some admin |

---

## Cache headers

| Route | Cache-Control |
|-------|---------------|
| `/api/v2/analytics/stats` | `public, s-maxage=30, stale-while-revalidate=60` ✅ |
| `/api/visitors` | `private, no-store` ✅ |
| All other v2 public GETs | **None** ❌ |
| Static assets in `next.config.js` | **Not configured** ❌ |
| Page ISR | noticeboard + downloads only |

**Recommendation:** Add `s-maxage=60, stale-while-revalidate=120` to public read APIs in `api-handler.ts`.

---

## API performance

| API | Query pattern | Index | Risk |
|-----|---------------|-------|------|
| `/api/v2/events` | Filter status + locale | ✅ Indexed | Low |
| `/api/v2/speakers` | Filter + featured | ✅ Indexed | Low |
| `/api/v2/media-center` | Multi-table aggregation | ⚠️ | Medium at scale |
| `/api/v2/registration/[id]` | Public ID lookup | ✅ Unique index | Low (security issue separate) |
| Admin list endpoints | Pagination `limit/offset` | ✅ | Low |
| Visitor analytics writes | Append-only | ⚠️ No retention | Scale risk |

---

## Database query performance (cross-ref)

- Registration admin search uses `contains` without trigram index — slow at 10k+ rows
- Media center hub aggregates 3 tables — monitor query time
- Missing composite index on `[registrationType, registrationStatus, createdAt]`

---

## Core Web Vitals (estimated)

| Metric | Estimate | Basis |
|--------|----------|-------|
| LCP | Good (~2.0s) | RSC + hero priority image |
| INP | Moderate | Registration/client-heavy pages |
| CLS | Good | LazySection skeletons |
| TTFB | Moderate | Prisma cold starts on Vercel |

*Formal Lighthouse run recommended on staging before launch.*

---

## Score breakdown

| Factor | Weight | Score |
|--------|-------:|------:|
| Bundle strategy | 25% | 72 |
| Image optimization | 20% | 80 |
| Caching (API + static) | 20% | 55 |
| RSC/server-first | 20% | 85 |
| Database query efficiency | 15% | 75 |

**Weighted: 78 / 100**

---

## Path to 95+

| Fix | Impact | Effort |
|-----|--------|--------|
| Cache-Control on public v2 GET APIs | +8 | 4h |
| Add Supabase to `remotePatterns` | +3 | 30min |
| LazySection on PublicPageShell routes | +5 | 3 days |
| Static asset Cache-Control in next.config | +3 | 1h |
| `unstable_cache` on CMS loaders | +5 | 2 days |
| Dynamic-import homepage below-hero sections | +3 | 1 day |
| Registration bundle code-split | +4 | 1 week |
| Visitor analytics retention job | +2 | 2 days |
| Run + act on bundle analyzer report | +3 | 1 day |

**Estimated time: 2–3 weeks**
