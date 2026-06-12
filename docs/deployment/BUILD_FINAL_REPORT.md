# Build Final Report

**Date:** 2026-06-10  
**Environment:** Windows, Node 20.17.0, `rase/` workspace  
**Database:** Supabase cloud connected during build

---

## Command results

| Command | Exit code | Result |
|---------|:---------:|--------|
| `npm install` | **0** | Success; 62 npm audit vulnerabilities reported |
| `npx prisma validate` | **0** | Schema valid |
| `npx prisma generate` | **0** | Client v6.19.3 generated |
| `npx tsc --noEmit` | **0** | No type errors |
| `npm run build` | **0** | **300 static pages** generated |

**Verdict: BUILD PASS**

---

## Build output summary

| Metric | Value |
|--------|-------|
| Next.js version | 15.0.7 |
| Compiled | ✅ Successfully |
| Type check | ✅ Passed |
| ESLint | ⚠️ Warnings only (no errors) |
| Static pages | 300/300 |
| Middleware size | 46.7 kB |
| Route types | ○ Static, ● SSG, ƒ Dynamic |

---

## Warnings (non-blocking)

### ESLint — `react-hooks/exhaustive-deps` (5 files)

- `src/app/admin/cms/menus/page.tsx`
- `src/app/admin/page.tsx`
- `src/app/admin/registrations/[id]/page.tsx`
- `src/app/component/KeynoteSpeakers.tsx`
- `src/app/component/SlideShow.tsx`
- `src/app/component/TreeComponent.tsx`

### ESLint — `@next/next/no-img-element` (12+ occurrences)

Registration forms, noticeboard admin, abstract submission — raw `<img>` instead of `next/image`.

### npm

- `npm warn Unknown env config "devdir"`
- Prisma `package.json#prisma` seed config deprecated (Prisma 7)
- **62 vulnerabilities** in dependency tree (2 critical in audit summary)

---

## Build-time runtime errors (non-fatal)

During SSG, Prisma logged errors for SEO metadata lookups:

```
Invalid prisma.seoMetadata.findUnique() invocation:
Inconsistent column data: Error creating UUID, invalid character: expected [0-9a-fA-F-], found `o` at 2
Inconsistent column data: Error creating UUID, invalid character: found `n` at 1
```

**Root cause:** `loadRouteSeo("noticeboard")` / `loadRouteSeo("downloads")` pass string route keys to `getSeoForEntity()`, but `seo_metadata.entity_id` is `@db.Uuid` in Prisma schema.

**Mitigation in code:** `loadRouteSeo` wraps in `try/catch` → returns `null` → build continues.

**Risk:** Route-level CMS SEO overrides silently fail at build and runtime for `noticeboard` / `downloads`.

**Fix scope:** Schema/type change required — **out of scope** for this audit (no schema changes permitted).

---

## Static generation

| Check | Status |
|-------|--------|
| Route conflict (`downloads/[id]` vs `[slug]`) | ✅ Resolved |
| SSG with cloud DB | ✅ 300 pages |
| CMS dynamic routes (press, speakers, media) | ✅ Generated |
| `postinstall: prisma generate` | ✅ In `package.json` |

---

## Production deployment gap

| Check | Local build | Live production |
|-------|-------------|-----------------|
| `/api/v2/health` | ✅ Exists in repo | ❌ 404 HTML (old deploy) |
| Registration lookup auth | ✅ 401 without token (code) | ❌ **200 with PII** (live probe) |
| Sitemap domain | `.org` if local env used | `rase.co.in` (empty Vercel env) |

**Conclusion:** Build passes locally but **production deployment is stale** (last sitemap `lastmod` 2026-06-09).

---

## Safe fix applied

| File | Change |
|------|--------|
| `src/app/noticeboard/page.tsx` | JSON-LD URL uses `SITE_URL` instead of hardcoded `rase.co.in` |

---

## Build readiness score

| Category | Score |
|----------|------:|
| Compile / types | 100 |
| SSG completeness | 95 |
| ESLint cleanliness | 70 |
| Dependency security | 60 |
| SEO metadata integrity | 75 |
| **Overall build** | **88/100** |
