# Phase C — Committees Module

**Wave:** C.1  
**Service:** `src/server/services/committee.service.ts`

---

## Capabilities

- Create, update, delete committees
- Member CRUD with reorder, photos, designation, social links
- Active/inactive members
- Publish / archive workflow
- Locale support (`en`, `hi`)
- SEO metadata via `upsertSeoForEntity("committee", id, locale)`
- Audit logging + `EntityRevision` snapshots on update

---

## Admin

| Route | Features |
|-------|----------|
| `/admin/cms/committees` | List, search, status/locale filters |
| `/admin/cms/committees/new` | Create committee |
| `/admin/cms/committees/[id]` | Edit, member management, publish/archive, SEO panel |

**APIs:** `/api/v2/admin/committees/*`, `/api/v2/admin/committees/[id]/members`, `/api/v2/admin/committees/members/[memberId]`

---

## Public

| Route | Behavior |
|-------|----------|
| `/committee/[slug]` | CMS-first via `loadCmsCommitteeBySlug`; falls back to 5 legacy edition components |
| `/committees` | Committee index (existing) |

**Legacy registry:** `src/lib/committee/legacy-registry.ts` — preserves hardcoded editions until CMS content published.

**Component:** `src/components/committee/CmsCommitteeView.tsx`

---

## SEO

- `generateMetadata()` on `/committee/[slug]`
- BreadcrumbList JSON-LD
- Organization schema via committee SEO fields

---

## Seed

Committee `organizing-committee-2024` in `en` and `hi` via `scripts/seed-phase-c-content.mjs`.
