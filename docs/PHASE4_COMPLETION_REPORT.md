# Phase 4 Completion Report — Authority Distribution, Entity Expansion & Content Network

**Date:** 2026-05-29  
**Project:** `rase/` (rase.co.in)

---

## Executive summary

Phase 4 distributes SEO authority through **visible internal link blocks** on high-traffic routes, expands the **entity directory** and **publication / conference** hub architectures, and strengthens JSON-LD coverage (CollectionPage, ItemList, ProfilePage, Dataset, ResearchProject, ScholarlyArticle) — without changing registration, Firestore, admin, legacy URLs, or existing page-level metadata on protected routes.

---

## Task 1 — Related content blocks

| Component | Role |
|-----------|------|
| `RelatedContentSection.tsx` | Server — `getInternalLinksForPath()` |
| `RelatedContentSectionClient.tsx` | Client — same engine for Press / workshops |

**Wired on:**

- Press: `/Press1`–`/Press9`, `/Press_Release`
- Publications: `/proceedings`, `/publications` hub
- Knowledge: `/knowledge`
- Vibhag: `/VibhagRoute/AcademicCouncil24`
- Workshops: `/workshops` hub + three `past_event/*` workshop pages
- Conference hubs: `/conferences`, `/events`, `/summits`
- Entity & publication type pages (via templates)

Pillar pages continue to use `InternalLinksBlock` via `PillarPageTemplate` + `getRelatedLinksForPillar()`.

---

## Task 2 — Entity directories (additive)

| Route | Template |
|-------|----------|
| `/people` | `EntityDirectoryTemplate` |
| `/institutions` | `EntityDirectoryTemplate` |
| `/universities` | `EntityDirectoryTemplate` |
| `/schools` | `EntityDirectoryTemplate` |
| `/research-projects` | `EntityDirectoryTemplate` + `ResearchProject` JSON-LD |
| `/educational-leaders` | `EntityDirectoryTemplate` |

Config: `src/lib/knowledge-graph/entity-directories.ts`  
No mass profile migration; directories link to peer routes and `ENTITY_LANDING_REGISTRY` when entries exist.

---

## Task 3 — Publications architecture

| Route | Role |
|-------|------|
| `/publications` | `PublicationAuthorityHub` (replaces pillar-only shell; **same URL & metadata factory**) |
| `/reports` | `PublicationTypePage` |
| `/whitepapers` | `PublicationTypePage` |
| `/policy-papers` | `PublicationTypePage` |
| `/research-papers` | `PublicationTypePage` |

Legacy unchanged: `/proceedings`, `/proceeding1`–`3`, `/journals`, `/books`.

Catalog: `publication-catalog.ts`

---

## Task 4 — Conference authority architecture

| Route | Role |
|-------|------|
| `/conferences` | `ConferenceAuthorityHub` — year archive, summits, workshops, proceedings |
| `/events` | Event calendar + `CONFERENCE_YEAR_ARCHIVE` |
| `/summits` | Summit programme index |
| `/workshops` | Workshop archive index |

Year structure: `CONFERENCE_YEAR_ARCHIVE` in `conference-catalog.ts` (2026, 2024, 2023 editions).

---

## Task 5 — Schema expansion

New builders in `src/lib/seo/schema/builders.ts`:

- `buildProfilePageSchema` — entity directories
- `buildDatasetSchema` — publication type catalogues (placeholder)
- `buildScholarlyArticleSchema` — ready for indexed papers

Existing Phase 3 builders retained: CollectionPage, ItemList, ResearchProject, etc.

---

## Knowledge graph updates

- `content-map.ts` — 16 new route mappings
- `authority-map.ts` — hub and directory weights
- `sitemap.ts` — entity, publication, and conference hub paths

---

## Protected (unchanged)

- `/registration`, forms, `saveRegistration.ts`, Firestore
- Admin routes
- Press layout metadata / `PressArticleJsonLd`
- Home `HomeJsonLd` (Org / Event / FAQ)
- All legacy URLs and redirects

---

## Verification (confirmed)

| Check | Result |
|-------|--------|
| `npm run lint` | Pass (pre-existing warnings only) |
| `npm run build` | Pass — 170 static pages, all Phase 4 routes present |
| Registration / Firestore / admin | Untouched |
| Legacy URLs | Unchanged |

Verified: 2026-06-04

```bash
npm run lint
npm run build
```

---

## Related docs

- `docs/ENTITY_ARCHITECTURE.md`
- `docs/PUBLICATION_STRATEGY.md`
- `docs/EDUCATION_DIRECTORY_ROADMAP.md`
- `docs/SEO_AUTHORITY_ARCHITECTURE.md` (Phase 3)
