# Entity Architecture — National Education Directory

**Phase:** 4  
**Status:** Framework live; profiles added incrementally

---

## Purpose

Expose a **canonical entity layer** for people, institutions, and programmes so search engines and users can traverse the Shiksha Mahakumbh ecosystem beyond event-only pages.

---

## Directory routes

| Path | Schema emphasis | Pillar alignment |
|------|-----------------|------------------|
| `/people` | ProfilePage + CollectionPage | Leadership |
| `/educational-leaders` | ProfilePage + Person | Leadership |
| `/institutions` | CollectionPage + EducationalOrganization | School education |
| `/universities` | CollectionPage + CollegeOrUniversity | Higher education |
| `/schools` | CollectionPage + School | School education |
| `/research-projects` | CollectionPage + ResearchProject | Research |

Implementation: `EntityDirectoryTemplate.tsx`, `entity-directories.ts`.

---

## Relationship to Phase 3 entity landings

Phase 3 introduced `ENTITY_LANDING_REGISTRY` under `src/lib/knowledge-graph/entities/landing-framework.ts` for **future** profile URLs (e.g. `/entity/...`).

Phase 4 adds **top-level directory hubs** at flat paths (`/people`, etc.) for:

1. Crawl-friendly hub URLs in sitemap
2. Visible cross-links from publications and conferences
3. ProfilePage / ItemList JSON-LD at directory level

When a profile is published, list it in `ENTITY_LANDING_REGISTRY`; the directory template auto-surfaces matching entries.

---

## Internal linking

Each directory page:

1. Lists registry entries (if any)
2. Otherwise links peer directories
3. Renders `RelatedContentSection` + pillar-weighted `InternalLinksBlock`

Resolver: `getInternalLinksForPath(directory.path)` via `content-map` + `authority-map`.

---

## Migration policy

- **No bulk import** in Phase 4
- Add one entity at a time to `landing-framework.ts`
- Optional detail route under `/entity/[slug]` in a later phase
- Do not duplicate press or registration personas without editorial review

---

## JSON-LD stack (per directory)

1. `CollectionPage` — hub
2. `ProfilePage` — directory index
3. `ItemList` — entries or peer directories
4. `BreadcrumbList` — Home → Education → Directory
5. `ResearchProject` (research-projects only) — programme catalogue signal

---

## Next steps (Phase 5+)

- Filter by state / institution type
- `Person` + `ProfilePage` per leader with `sameAs` (LinkedIn, university)
- Institution detail pages with `EducationalOrganization` @id
- Admin CRUD for entity records (Firestore collection TBD)
