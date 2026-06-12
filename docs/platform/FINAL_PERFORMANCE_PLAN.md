# Final Performance Plan — 95+ Lighthouse Target

**Date:** May 2026  
**Current:** 90 · **Target:** 95 · **Stack:** Next.js 15 · Vercel · RSC

---

## Current performance profile

| Metric | Homepage | Noticeboard | Downloads | Target |
|--------|----------|-------------|-----------|--------|
| LCP (est.) | 1.8–2.4s | 1.9–2.5s | 1.9–2.5s | <2.5s |
| CLS (est.) | 0.05–0.08 | 0.05 | 0.05 | <0.1 |
| INP (est.) | 150–250ms | 140–200ms | 140–200ms | <200ms |
| TTFB (est.) | 400–700ms | 400–600ms | 400–600ms | <800ms |

---

## Strengths (keep)

| Pattern | Location |
|---------|----------|
| Server-side CMS load | `loadCmsPageData()` |
| ISR 300s | noticeboard, downloads |
| Lazy below-fold | Homepage `LazySection` |
| Hero priority image | `next/image` |
| Font display swap | Inter via `next/font` |
| Dynamic imports | NavBar, Footer, Marquees |
| No HTTP self-fetch | B.6 optimization |
| Analytics exclusion | Reduced admin noise |

---

## Performance debt

| Issue | Impact | Routes | Priority |
|-------|--------|--------|----------|
| Legacy `<img>` tags | LCP −200ms | ~40 | P1 |
| Press client bundles | INP, bundle | 9 | P1 |
| proceeding2 615-line client | LCP, INP | 1 | P1 |
| PublicPageShell client-hydrated | TTFB overhead | 49+ | P2 |
| Double fetch noticeboard/downloads | Network | 2 | P2 |
| No homepage revalidate | TTFB | 1 | P2 |
| Admin CMS bundle size | Admin FCP | 15 | P3 |
| Firebase client on speakers | JS weight | 1 | P3 |

---

## Optimization roadmap

### PERF-1 (weeks 1–4) → Score 93

| Task | Expected gain |
|------|---------------|
| Migrate top 10 `<img>` to `next/image` | LCP −200ms |
| Hero WebP via media library | LCP −300ms |
| Press → RSC/CMS migration | Bundle −40% press routes |
| `revalidate = 60` on homepage | TTFB −100ms |

### PERF-2 (weeks 5–8) → Score 95

| Task | Expected gain |
|------|---------------|
| proceeding2 → CMS page | Remove 615-line bundle |
| PublicPageShell server split | Hydration −30% shell pages |
| LazySection on top 10 shell routes | LCP on content pages |
| Client refresh only when stale (notices/downloads) | −1 API call |

### PERF-3 (weeks 9–12) → Score 97

| Task | Expected gain |
|------|---------------|
| Remaining `<img>` migration | Full image optimization |
| Prisma connection pooling (PgBouncer) | Cold start TTFB |
| Admin chart lazy imports | Admin FCP |
| Knowledge graph → static/ISR pages | 28 routes |

---

## Static generation opportunities

| Route | Strategy |
|-------|----------|
| Legal pages (post-CMS) | ISR 3600s |
| Press articles (post-CMS) | ISR 300s |
| Knowledge pillars | ISR 3600s |
| Homepage | ISR 60s (after stable CMS) |
| Noticeboard/downloads | ISR 300s (existing) |

---

## API performance

| Endpoint | Target | Current est. |
|----------|--------|-------------|
| GET /api/v2/homepage | <150ms | 80–150ms |
| GET /api/v2/notices | <120ms | 60–120ms |
| POST /api/v2/analytics/track | <100ms | 40–100ms |
| Admin dashboard | <500ms | 200–400ms |

---

## Bundle targets

| Chunk | Current est. | Target |
|-------|-------------|--------|
| Homepage first load JS | ~180KB | <150KB |
| PublicPageShell pages | ~120KB | <100KB |
| Admin CMS | ~250KB | <200KB |
| Registration (Firebase) | ~200KB | Acceptable |

---

## Monitoring

| Tool | Action |
|------|--------|
| Vercel Analytics | Enable Web Vitals |
| Lighthouse CI | Key routes on PR |
| Bundle analyzer | Monthly admin CMS check |

**Status: PLAN ONLY**
