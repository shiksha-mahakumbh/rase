# Build Runtime Audit

**Date:** 2026-06-10  
**Environment:** Windows, Node 20.17.0, Next.js 15.0.7  
**Database:** Supabase cloud connected during build

---

## Command results

| Command | Exit code | Result |
|---------|:---------:|--------|
| `npx prisma validate` | **0** | Schema valid |
| `npx prisma generate` | **0** | Client v6.19.3 |
| `npx tsc --noEmit` | **0** | No type errors |
| `npm run build` | **0** | **PASS** |

---

## Build metrics

| Metric | Value |
|--------|-------|
| Static pages generated | **300 / 300** |
| Compile | ✅ Success |
| TypeScript check | ✅ Passed |
| ESLint | ⚠️ Warnings only (0 errors) |
| Middleware | 46.7 kB |
| Route conflicts | ✅ None detected |

### Route types

| Symbol | Count | Notes |
|--------|-------|-------|
| ○ Static | Majority | Prerendered |
| ● SSG | Locale, press, media | `generateStaticParams` |
| ƒ Dynamic | API routes, `speakers/[slug]` | Server-rendered |

---

## Warnings (non-blocking)

### ESLint `react-hooks/exhaustive-deps` (6 files)

`admin/cms/menus/page.tsx`, `admin/page.tsx`, `admin/registrations/[id]/page.tsx`, `KeynoteSpeakers.tsx`, `SlideShow.tsx`, `TreeComponent.tsx`

### ESLint `@next/next/no-img-element` (12+ files)

Registration forms, abstract submission, noticeboard admin.

### Prisma errors during SSG (non-fatal)

```
prisma:error Invalid prisma.seoMetadata.findUnique() invocation:
Error creating UUID, invalid character: found `o` at 2 / `n` at 1
```

**Cause:** Route keys (`noticeboard`, `downloads`) passed to `entity_id` column typed as `@db.Uuid`. Caught by try/catch in `loadRouteSeo()` — build continues.

**Impact:** Route-level CMS SEO overrides silently skipped. Schema fix out of scope.

---

## Production deployment gap

| Artifact | Local build | Live production |
|----------|-------------|-----------------|
| Page count | 300 | Unknown (stale) |
| `/api/v2/health` | ✅ In repo | ❌ 404 |
| Registration lookup auth | ✅ 401 in code | ❌ 200 live |
| Sitemap domain (if rebuilt with local env) | Would be `.org` | `rase.co.in` |

---

## Verdict

| Category | Score |
|----------|------:|
| Compile / types | 100 |
| SSG completeness | 95 |
| ESLint | 70 |
| Deploy currency | 35 |
| **Overall build** | **88/100 — GO** |

**No build changes made.**
