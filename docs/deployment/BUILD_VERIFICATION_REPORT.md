# Build Verification Report

**Date:** June 2026  
**Scope:** Route conflict resolution + build verification  
**Commands executed:** `npx tsc --noEmit`, `npm run build`

---

## Summary

| Check | Status |
|-------|--------|
| Route conflict resolved | **PASS** |
| TypeScript (`tsc --noEmit`) | **PASS** |
| Webpack compile | **PASS** |
| ESLint (errors) | **PASS** |
| Next.js type validation | **PASS** |
| Static page generation (SSG) | **FAIL** |
| Full `npm run build` exit 0 | **FAIL** |

**Route conflict objective: COMPLETE.**  
**Full production build: blocked by database connectivity at prerender (environment).**

---

## Route conflict resolution

### Before

```
Error: You cannot use different slug names for the same dynamic path ('id' !== 'slug')
```

Conflicting siblings under `/api/v2/downloads/`:
- `[slug]/route.ts` (GET)
- `[id]/track/route.ts` (POST)

### After

Single convention `[id]` under `/api/v2/downloads/`:

| Method | Path | File |
|--------|------|------|
| `GET` | `/api/v2/downloads/[id]` | `src/app/api/v2/downloads/[id]/route.ts` |
| `POST` | `/api/v2/downloads/[id]/track` | `src/app/api/v2/downloads/[id]/track/route.ts` |

**Removed:** `src/app/api/v2/downloads/[slug]/route.ts`  
**Added:** `getDownloadById()` in `download.service.ts`  
**Unchanged:** `DownloadsClient.tsx` (already uses `${id}/track`)

Full audit: `docs/deployment/ROUTE_CONFLICT_AUDIT.md`

---

## Verification results

### 1. `npx tsc --noEmit`

**PASS** — exit code 0

### 2. `npm run build` — stage breakdown

| Stage | Result | Notes |
|-------|--------|-------|
| Route sorting | **PASS** | No slug/id conflict |
| Webpack compile | **PASS** | `✓ Compiled successfully` |
| ESLint | **PASS** | Warnings only (pre-existing) |
| Type checking | **PASS** | No type errors |
| Collecting page data | **PASS** | |
| Generating static pages | **FAIL** | `/gallery` prerender error |
| Build exit code | **FAIL** | exit 1 |

### 3. Static generation failure (remaining blocker)

```
Error occurred prerendering page "/gallery"
PrismaClientInitializationError: Can't reach database server at `127.0.0.1:54322`
```

**Cause:** `DATABASE_URL` points to local Supabase CLI port; database not running.  
**Type:** Environment / infrastructure — **not** a route or compile defect.  
**Fix:** Point `DATABASE_URL` to Supabase cloud staging, run migrations + seeds, then rebuild.

---

## Ancillary fixes applied during build verification

These were **not** route conflicts but blocked the build pipeline after the route fix was applied:

| File | Change | Reason |
|------|--------|--------|
| `src/middleware.ts` | Import `ADMIN_SESSION_COOKIE` from `@/constants/auth` | Prevented `node:crypto` in edge bundle |
| `src/lib/security/admin-session.ts` | Re-export cookie from constants | Consistency |
| `src/components/home/GallerySection.tsx` | Move `useCms()` into component body | ESLint `rules-of-hooks` error |
| `src/server/lib/api-handler.ts` | Default `AppRouteContext` for Next.js 15 | Route handler type validation |

No changes to schema, Firebase, registrations, or Razorpay.

---

## ESLint warnings (non-blocking)

Pre-existing warnings remain (27 total):
- `react-hooks/exhaustive-deps` in admin/registration pages
- `@next/next/no-img-element` in registration forms

These do **not** fail the build.

---

## Remaining blockers

| # | Blocker | Category | Blocks |
|---|---------|----------|--------|
| 1 | `DATABASE_URL` → `127.0.0.1:54322` (local, not running) | Environment | SSG prerender, migrate, seeds |
| 2 | 8 missing env vars (see staging audit) | Environment | Runtime features |
| 3 | `postinstall: prisma generate` not in `package.json` | Vercel config | Clean CI/Vercel install |

**Route conflict:** ✅ Resolved — no longer a blocker.

---

## API path changes (breaking note)

| Old path | New path | Status |
|----------|----------|--------|
| `GET /api/v2/downloads/[slug]` | `GET /api/v2/downloads/[id]` | Changed — no in-repo consumers found |
| `POST /api/v2/downloads/[id]/track` | unchanged | Same |

Slug-based download lookup remains available via `getDownloadBySlug()` in service layer for future use; public API now uses primary key `[id]` per convention.

---

## Verdict

| Objective | Result |
|-----------|--------|
| Fix Next.js route conflict | **PASS** |
| Restore compile + type-check | **PASS** |
| Full `npm run build` exit 0 | **FAIL** — DB required for `/gallery` SSG |

**Next step for full build PASS:** Configure cloud `DATABASE_URL`, apply migrations, seed data, re-run `npm run build`.

**STOP — Route work complete.**
