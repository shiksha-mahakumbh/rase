# SEO UUID Validation Verification

**Date:** 2026-06-12  
**Scope:** Build-time `prisma:error` from route slugs queried against `seo_metadata.entity_id` (UUID)  
**Production status:** GO (85/100) — this issue is build hygiene only

---

## Root Cause Summary

During Next.js SSG, `/noticeboard` and `/downloads` call `loadRouteSeo()` with string route keys (`"noticeboard"`, `"downloads"`). That flows into `getSeoForEntity("route", routeKey)`, which previously invoked:

```ts
prisma.seoMetadata.findUnique({
  where: { entityType_entityId_locale: { entityType, entityId, locale } },
});
```

Prisma validates `entityId` against the Postgres `@db.Uuid` column **before** sending the query. Slugs like `"noticeboard"` fail client-side with:

```
Inconsistent column data: Error creating UUID, invalid character: found `n` at 1
```

The schema defines `entity_id` as UUID; route slugs were never valid lookup keys without a mapping layer.

**Fix:** Early return in `getSeoForEntity()` when `entityId` fails UUID format check — no Prisma call.

---

## Files Inspected

| File | Role |
|------|------|
| `src/server/services/seo.service.ts` | `UUID_RE` guard + `getSeoForEntity()`, `upsertSeoForEntity()`, `deleteSeoForEntity()` |
| `src/lib/cms/server.ts` | `loadRouteSeo()` → delegates to `getSeoForEntity("route", routeKey)` |
| `src/app/noticeboard/page.tsx` | `loadRouteSeo("noticeboard")` at build time |
| `src/app/downloads/page.tsx` | `loadRouteSeo("downloads")` at build time |
| `src/app/api/v2/seo/[entityType]/[entityId]/route.ts` | Public SEO API → `getSeoForEntity()` |
| `src/app/api/v2/admin/seo/[entityType]/[entityId]/route.ts` | Admin SEO API → `getSeoForEntity()` / `deleteSeoForEntity()` |
| `src/server/services/page.service.ts` | Direct `findUnique` with `page.id` (UUID from DB) ✅ |
| `src/server/services/speaker.service.ts` | Direct `findUnique` with `row.id` (UUID) ✅ |
| `src/server/services/notice.service.ts` | Direct `findUnique` with `notice.id` (UUID) ✅ |
| `src/server/services/event-cms.service.ts` | Direct `findUnique` with `row.id` (UUID) ✅ |
| `src/server/services/committee.service.ts` | Direct `findUnique` with `row.id` (UUID) ✅ |
| `src/server/services/media-center.service.ts` | Direct `findUnique` with `row.id` (UUID) ✅ |
| `prisma/schema.prisma` | `SeoMetadata.entityId` → `@db.Uuid` |
| `scripts/test-seo-uuid-guard.mjs` | Guard verification (no DB) |

---

## Fix Verification

### Guard implementation (`seo.service.ts`)

```ts
const UUID_RE =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

export async function getSeoForEntity(entityType, entityId, locale = "en") {
  if (!UUID_RE.test(entityId)) {
    return null; // no Prisma invocation
  }
  return prisma.seoMetadata.findUnique({ ... });
}
```

### Slug safety matrix

| Route key | UUID_RE match | DB query | Result |
|-----------|---------------|----------|--------|
| `noticeboard` | ❌ | **None** | `null` |
| `downloads` | ❌ | **None** | `null` |
| `contact` | ❌ | **None** | `null` |
| `about` | ❌ | **None** | `null` |
| `home` | ❌ | **None** | `null` |
| `40000000-0000-4000-8000-000000000006` | ✅ | Yes | Normal lookup |

Verified via `node scripts/test-seo-uuid-guard.mjs` — all slugs blocked; valid UUID accepted.

### `loadRouteSeo()` call sites (build-time)

Only two pages invoke `loadRouteSeo()`:

- `src/app/noticeboard/page.tsx` → `"noticeboard"`
- `src/app/downloads/page.tsx` → `"downloads"`

Both are now short-circuited by the guard. Pages use fallback metadata from `publicPages.ts` / defaults when `null` is returned.

---

## Remaining Direct `seoMetadata.findUnique` Paths

These bypass `getSeoForEntity()` but pass **database UUIDs** (`row.id`, `page.id`, `notice.id`) — safe at SSG:

| Service | entityType | entityId source |
|---------|------------|-----------------|
| `page.service.ts` | `page` | `page.id` |
| `speaker.service.ts` | `speaker` | `row.id` |
| `notice.service.ts` | `notice` | `notice.id` |
| `event-cms.service.ts` | `event` | `row.id` |
| `committee.service.ts` | `committee` | `row.id` |
| `media-center.service.ts` | `media_entry` | `row.id` |

**No code path** was found that passes route slugs directly to `prisma.seoMetadata.findUnique()` outside `getSeoForEntity()`.

---

## Commands Executed

```bash
node scripts/test-seo-uuid-guard.mjs
npx tsc --noEmit
npm run build
```

Build log scanned: `Select-String build-seo-verify.log -Pattern "prisma:error|Error creating UUID"` → **0 matches**

---

## Build Results

| Check | Result |
|-------|--------|
| `npx tsc --noEmit` | ✅ Exit 0 |
| `npm run build` | ✅ Exit 0 |
| Static pages generated | **303/303** (unchanged) |
| `prisma:error` (UUID syntax) | **None** |
| ESLint warnings | Present (pre-existing, non-blocking) |

---

## Remaining Risks

| Risk | Severity | Notes |
|------|----------|-------|
| `deleteSeoForEntity()` has no UUID guard | Low | Admin DELETE API only; not invoked at build |
| Route-level CMS SEO overrides for `/noticeboard`, `/downloads` | Low | Guard returns `null`; pages use static fallback metadata |
| Admin SEO UI accepts free-text entity ID | Low | GET returns `null` for slugs; upsert would still fail at Prisma if non-UUID |

---

## Recommendation

**No action required** for production or build stability.

Optional future enhancement: add `route_key TEXT` (or store deterministic UUID v5 per route in seed data) if CMS-managed SEO overrides for named routes are desired.

---

## Issue Signoff

| Item | Status |
|------|--------|
| UUID guard present and complete for read path | ✅ |
| Build clean of UUID prisma errors | ✅ |
| Page count unchanged | ✅ (303) |
| Schema / migration changes | None |
| Deploy / push | None (per constraints) |

### **GO** for this specific issue

---

*Verification performed 2026-06-12. Guard pre-existed from prior cutover session; this audit confirms effectiveness via build replay.*
