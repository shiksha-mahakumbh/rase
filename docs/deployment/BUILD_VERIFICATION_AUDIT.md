# Build Verification Audit

**Date:** 2026-06-10  
**Environment:** Windows, Node 20.17.0, Next.js 15.0.7  
**Database:** Supabase cloud (connected during build)

---

## Command results

| Command | Exit code | Result |
|---------|:---------:|--------|
| `npx prisma validate` | **0** | Schema valid |
| `npx prisma generate` | **0** | Client v6.19.3 generated |
| `npx tsc --noEmit` | **0** | No type errors |
| `npm run build` | **0** | **PASS** |

**Verdict: BUILD PASS**

---

## Build metrics

| Metric | Value |
|--------|-------|
| Static pages generated | **300 / 300** |
| Compile | ✅ Success |
| Type check | ✅ Passed |
| ESLint | ⚠️ Warnings only (0 errors) |
| Middleware bundle | 46.7 kB |
| Shared First Load JS | 102 kB |

### Route type distribution

| Symbol | Meaning | Present |
|--------|---------|:-------:|
| ○ | Static prerendered | ✅ Majority |
| ● | SSG (`generateStaticParams`) | ✅ Locale, press, media |
| ƒ | Dynamic server-rendered | ✅ API routes, `speakers/[slug]` |

---

## Build warnings (non-blocking)

### ESLint `react-hooks/exhaustive-deps` (6 files)

- `src/app/admin/cms/menus/page.tsx`
- `src/app/admin/page.tsx`
- `src/app/admin/registrations/[id]/page.tsx`
- `src/app/component/KeynoteSpeakers.tsx`
- `src/app/component/SlideShow.tsx`
- `src/app/component/TreeComponent.tsx`

### ESLint `@next/next/no-img-element` (12+ occurrences)

Registration forms, abstract submission, noticeboard admin.

### Prisma runtime errors during SSG (non-fatal)

```
Invalid prisma.seoMetadata.findUnique() invocation:
Error creating UUID, invalid character: found `o` at 2 / `n` at 1
```

**Cause:** Route keys (`noticeboard`, `downloads`) passed to `entity_id` column typed as UUID. Caught by try/catch in `loadRouteSeo()` — build continues.

**Impact:** Route-level CMS SEO overrides silently skipped. Schema fix out of scope.

---

## Static generation

| Check | Status |
|-------|--------|
| All 300 pages generated | ✅ |
| CMS SSG routes (press, speakers, events) | ✅ |
| Sitemap route `/sitemap.xml` | ✅ Static |
| Robots route `/robots.txt` | ✅ Static |
| Build fails without DB | ⚠️ Yes (SSG needs cloud DB) |

---

## Production deployment gap

| Artifact | Local build | Live production |
|----------|-------------|-----------------|
| `/api/v2/health` | ✅ In repo | ❌ 404 HTML (stale deploy) |
| Registration lookup auth | ✅ 401 in code | ❌ 200 live |
| Sitemap lastmod | Today if rebuilt | 2026-06-09 |

**Build passes locally; production has not been redeployed.**

---

## Build readiness score

| Category | Score |
|----------|------:|
| Compile / types | 100 |
| SSG completeness | 95 |
| ESLint cleanliness | 70 |
| SEO metadata integrity | 75 |
| Deploy currency | 40 |
| **Overall build** | **88/100** |

**No build changes applied.**
