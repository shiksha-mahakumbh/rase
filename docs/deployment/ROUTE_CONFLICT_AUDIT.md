# Route Conflict Audit

**Date:** June 2026  
**Build error:** `You cannot use different slug names for the same dynamic path ('id' !== 'slug')`  
**Scope:** Full `src/app` dynamic route tree

---

## Methodology

Enumerated every directory under `src/app` whose name matches `[param]`. Grouped routes by parent path; flagged any parent with **two or more different** dynamic segment names at the same depth.

---

## Conflicts found

### Conflict 1 — `/api/v2/downloads/` (BLOCKER)

| Segment | Path | File | Handler |
|---------|------|------|---------|
| `[slug]` | `/api/v2/downloads/[slug]` | `src/app/api/v2/downloads/[slug]/route.ts` | `GET` — `getDownloadBySlug` |
| `[id]` | `/api/v2/downloads/[id]/track` | `src/app/api/v2/downloads/[id]/track/route.ts` | `POST` — `trackDownload` |

Next.js App Router requires **one** dynamic segment name per path level. Having both `[id]` and `[slug]` as siblings under `/api/v2/downloads/` prevents `next build`.

**Recommended canonical parameter:** `[id]`

**Rationale:**
- User rule: *Primary keys → `[id]`*
- User rule: *Downloads API must use a single convention everywhere*
- Active client code (`DownloadsClient.tsx`) already calls `POST /api/v2/downloads/${id}/track` with UUID primary keys
- Admin CMS uses `downloads/${id}` for mutations (primary key)
- The `[slug]` GET route has **no in-repo consumers**; slug-based public pages use `/downloads` list UI, not per-slug API fetch

**Resolution:**
1. Add `GET /api/v2/downloads/[id]` using `getDownloadById`
2. Keep `POST /api/v2/downloads/[id]/track`
3. Remove `src/app/api/v2/downloads/[slug]/` entirely

---

## Non-conflicting routes (verified)

These share a parent path but use **consistent** segment names or **different depths** — valid:

| Parent path | Segments | Status |
|-------------|----------|--------|
| `/api/v2/admin/seo/[entityType]/[entityId]` | `entityType` + `entityId` | OK — different names, different depths |
| `/api/v2/seo/[entityType]/[entityId]` | same | OK |
| `/api/v2/pages/[slug]` | `[slug]` only | OK — public SEO |
| `/api/v2/notices/[slug]` | `[slug]` only | OK — public SEO |
| `/api/v2/media/[id]` | `[id]` only | OK — primary key |
| `/api/v2/registration/[id]` | `[id]` only | OK — untouched per scope |
| `/committee/[slug]`, `/events/[slug]`, `/speakers/[slug]`, `/press/[slug]` | `[slug]` only | OK — public SEO pages |
| `/admin/cms/*/[id]` | `[id]` only per module | OK — admin primary keys |
| `/api/v2/admin/*/[id]` | `[id]` only per module | OK |
| `/media/[edition]/[year]/[type]` | distinct names per level | OK |

**Total dynamic route directories scanned:** 44  
**Conflicts:** 1  
**Other build-blocking route issues:** 0

---

## Naming convention applied

| Context | Parameter | Example |
|---------|-----------|---------|
| Admin CMS pages & APIs | `[id]` | `/admin/cms/pages/[id]` |
| Public SEO pages | `[slug]` | `/events/[slug]` |
| Public read APIs (pages, notices) | `[slug]` | `/api/v2/pages/[slug]` |
| Primary-key APIs (media, downloads) | `[id]` | `/api/v2/downloads/[id]` |
| Registration (out of scope) | `[registrationId]` / `[id]` | unchanged |

---

## Files changed (resolution)

| Action | File |
|--------|------|
| **Add** | `src/app/api/v2/downloads/[id]/route.ts` |
| **Keep** | `src/app/api/v2/downloads/[id]/track/route.ts` |
| **Remove** | `src/app/api/v2/downloads/[slug]/route.ts` |
| **Add** | `getDownloadById()` in `src/server/services/download.service.ts` |

No changes to registration, Firebase, Razorpay, or Prisma schema.
