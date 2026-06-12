# Performance Audit — Full Platform Review (Post B.7)

**Date:** May 2026  
**Current performance score:** 89/100

---

## Summary

| Area | Score | Status |
|------|------:|--------|
| Bundle sizes | 82 | ⚠️ Admin CMS client-heavy |
| Server components | 92 | ✅ Most pages RSC |
| Image loading | 88 | ⚠️ ~40 legacy `<img>` |
| Fonts | 95 | ✅ `next/font` Inter |
| Caching / ISR | 85 | ✅ Noticeboard/downloads 300s |
| API response times | 90 | ✅ Direct Prisma, no self-fetch |
| Database queries | 87 | ✅ Parallel dashboard queries |

---

## 1. Bundle sizes

| Chunk | Concern |
|-------|---------|
| Homepage client islands | Moderate — dynamic imports mitigate |
| Admin CMS (`/admin/cms/*`) | Higher — forms, charts, JSON editors |
| Firebase SDK (registration) | Expected — isolated to registration routes |
| `react-fast-marquee` | Small — multiple instances |

**Recommendations:**
- Lazy-load admin analytics charts
- Audit `@uiw/react-json-editor` bundle in homepage admin

---

## 2. Server components

| Pattern | Usage |
|---------|-------|
| `page.tsx` as RSC | ✅ 170+ routes |
| `loadCmsPageData()` direct Prisma | ✅ Homepage, noticeboard, downloads |
| Client islands | NavBar, Footer, trackers, forms |
| No HTTP self-fetch on SSR | ✅ B.6 optimization |

---

## 3. Image loading

| Page type | `next/image` | Legacy `<img>` |
|-----------|-------------|----------------|
| Homepage CMS sections | ✅ | — |
| Hero | ✅ priority + sizes | — |
| Partners marquee | ✅ lazy | — |
| Introduction, contact, committees | — | ⚠️ Many |
| Press articles | Mixed | ⚠️ |

**Impact:** Legacy images miss automatic WebP/AVIF and responsive `srcset`.

---

## 4. Fonts

```typescript
// Root layout — Inter via next/font/google
display: "swap"
```

No render-blocking external font CSS. **Score: 95/100**

---

## 5. Caching strategy

| Resource | Cache-Control |
|----------|---------------|
| `/api/visitors` GET | `private, no-store` (fixed B.7) |
| `/api/v2/homepage` | Short TTL via handler |
| Noticeboard page | `revalidate = 300` |
| Downloads page | `revalidate = 300` |
| Sitemap | Generated on demand |
| Static assets | Vercel CDN immutable |

**Gap:** Homepage has no `revalidate` — full dynamic render each request (acceptable for fresh CMS).

---

## 6. API response times (estimated)

| Endpoint | Typical | Notes |
|----------|---------|-------|
| `GET /api/v2/homepage` | 80–150ms | Page + sections join |
| `GET /api/v2/notices` | 60–120ms | Paginated |
| `POST /api/v2/analytics/track` | 40–100ms | Insert + rollup |
| Admin gateway proxy | +15–30ms | Internal fetch |
| Analytics dashboard | 200–400ms | 10+ parallel queries |

---

## 7. Database queries

| Service | Pattern | Risk |
|---------|---------|------|
| `trackVisit` | 3–5 queries per hit | Low at current scale |
| `getAnalyticsDashboard` | `Promise.all` | ✅ |
| `getPublicVisitorStats` | 30s in-memory cache | ✅ |
| Notice list | Single query + includes | ✅ |

**Recommendation:** Add index on `visitor_page_views.path` if top-pages query slows (likely exists in migration).

---

## 8. Core Web Vitals (estimated)

| Metric | Homepage | Registration |
|--------|----------|--------------|
| LCP | 1.4–2.4s | 2.0–3.0s |
| CLS | 0.05–0.08 | 0.06–0.10 |
| INP | 150–250ms | 200–350ms |
| TTFB | 400–700ms | 500–800ms |

Run Lighthouse on staging post-migration for measured values.

---

## 9. Recommended fixes (stabilization)

| Priority | Fix | Impact |
|----------|-----|--------|
| P1 | Convert top-traffic `<img>` to `next/image` | LCP −200ms |
| P1 | Hero image WebP via media library | LCP −300ms |
| P2 | `revalidate = 60` on homepage | TTFB −100ms |
| P2 | Lazy admin chart imports | Admin FCP |
| P3 | Connection pool tuning for Prisma on Vercel | Cold start TTFB |

---

## Performance score

| Pillar | Score |
|--------|------:|
| SSR / RSC architecture | 92 |
| Caching | 85 |
| Images | 88 |
| Bundles | 82 |
| Database | 87 |
| **Overall** | **89** |
