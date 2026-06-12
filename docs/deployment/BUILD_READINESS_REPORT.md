# Build Readiness Report

**Date:** June 2026  
**Commands executed:** `npx tsc --noEmit`, `npx prisma validate`, `npm run build`

---

## Summary

| Check | Result |
|-------|--------|
| TypeScript (`tsc --noEmit`) | **PASS** |
| Prisma validate | **PASS** |
| Webpack compile | **PASS** |
| ESLint errors | **PASS** (warnings only) |
| Static generation (300 pages) | **PASS** |
| Full `npm run build` exit code | **PASS** (0) |

**Build is production-compilable.**

---

## Route audit

| Check | Status |
|-------|--------|
| `api/v2/downloads/[id]` vs `[slug]` conflict | **RESOLVED** (standardized on `[id]`) |
| Dynamic route count | 44 directories — no new conflicts |
| Middleware edge bundle | **FIXED** (`ADMIN_SESSION_COOKIE` from constants) |

---

## SSG / ISR / DB at build time

### Pages querying Prisma during build

| Page | Query | Build behavior |
|------|-------|----------------|
| `/` | `loadCmsHomepage()` | SSG — succeeds with cloud DB |
| `/gallery` | `listPublicMediaAlbums()` | SSG — succeeds |
| `/noticeboard`, `/downloads` | CMS loaders | SSG |
| `/events`, `/speakers`, `/partners` | CMS loaders | SSG |
| `/committee/[slug]` | `generateStaticParams` + CMS | SSG |
| `/sitemap.xml` | `generateSitemapIndex()` | Dynamic — fallback on error |
| `/robots.txt` | `getRobotsConfig()` | Dynamic — fallback on error |

### Build-time warnings observed

```
prisma:error Inconsistent column data: Error creating UUID, invalid character
```

Occurs during SEO metadata lookup for some entity IDs (non-UUID strings in `entity_id` column). **Non-blocking** — build completed; runtime may log errors for affected SEO records.

---

## ESLint warnings (non-blocking)

| Category | Count | Examples |
|----------|------:|---------|
| `react-hooks/exhaustive-deps` | 6 | admin pages, SlideShow |
| `@next/next/no-img-element` | 21 | registration forms, noticeboard |

---

## Blockers

| # | Blocker | Severity | Status |
|---|---------|----------|--------|
| — | None for compile | — | Build passes |

---

## Warnings

| # | Warning | Recommendation |
|---|---------|----------------|
| 1 | Build requires live DB for SSG | Ensure `DATABASE_URL` on Vercel at build time |
| 2 | SEO UUID data inconsistency | Audit `seo_metadata.entity_id` values |
| 3 | No `engines` field in `package.json` | Pin Node 20.x on Vercel |
| 4 | 27 ESLint warnings | Address post-launch |

---

## Safe fixes applied (Phase 8)

| File | Change |
|------|--------|
| `package.json` | Added `"postinstall": "prisma generate"` |
| `scripts/seed-cms-content.mjs` | Map `counters` → `counter` PageSectionType |
| `scripts/seed-s2-hi.mjs` | Remove invalid `locale` on `NoticeCategory` |

---

## Recommended pre-deploy build command

```bash
# Local / CI
npm ci
npx prisma generate
npm run build

# Vercel (automatic after postinstall)
# Ensure DATABASE_URL set for build-time SSG
```

---

## Verdict

| Item | Ready? |
|------|--------|
| Compile + type-check | ✅ YES |
| Production build artifact | ✅ YES |
| Build without DB (offline) | ❌ NO — CMS pages need Prisma at build |
