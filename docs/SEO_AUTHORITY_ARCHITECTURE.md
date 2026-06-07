# SEO Authority Architecture — Shiksha Mahakumbh

**Date:** 2026-06-04  
**Positioning:** Multi-dimensional national education ecosystem (not event-only).

---

## Pillar structure

| Pillar URL | Pillar ID | Authority role |
|------------|-----------|----------------|
| `/education` | hub | Collection hub — ItemList of all pillars |
| `/school-education` | school-education | K–12, academic council, registration |
| `/higher-education` | higher-education | HEI, conclave, academic council |
| `/vocational-education` | vocational-education | Workshops, skills |
| `/skill-development` | skill-development | Talent, employability |
| `/research` | research | Abstracts, proceedings |
| `/innovation` | innovation | Exhibitions, entrepreneurship |
| `/policy` | policy | Conclaves, topics |
| `/leadership` | leadership | Introduction, keynotes |
| `/teacher-development` | teacher-development | TDP archives |
| `/student-development` | student-development | Cultural, talent |
| `/educational-technology` | educational-technology | Videos, digital media |
| `/olympiad` | olympiads | DHE Olympiad |
| `/awards` | awards | Excellence awards |
| `/conferences` | conferences | Mahakumbh / Kumbh |
| `/publications` | publications | Journals, proceedings |
| `/media` | media | Press centre |

Legacy URLs (e.g. `/registration`, `/knowledge`, `/Press1`) remain canonical; pillars add **additive** landing layers.

---

## Topic clusters (hierarchy)

```
Pillar (landing)
  └── Cluster (topic-clusters.ts)
        └── Content (content-map.ts → existing route)
```

Example — **Research**:

- Cluster `research-submit` → `/abstract`, `/fulllengthpaper`, `/paper`
- Cluster `research-proceedings` → `/proceedings`, `/proceeding1`–`3`

Implementation: `src/lib/knowledge-graph/topic-clusters.ts`, `content-map.ts`.

---

## Entity relationships

| Entity ID | Type | Connects to |
|-----------|------|-------------|
| `org:smk-abhiyan` | EducationalOrganization | All pillars |
| `event:smk-6` | EducationEvent | Registration, conferences |
| `collection:knowledge-hub` | CollectionPage | Knowledge, publications |
| `vibhag:academic-council` | EducationalOrganization | Higher + school programmes |
| `press:hub` | NewsArticle | Media pillar |
| `pub:proceedings` | PublicationVolume | Publications + research |

Logical edges: `src/lib/knowledge-graph/relationships.ts`  
Cross-pillar links: `getRelatedPillars()`, `getRelatedLinksForPillar()`.

---

## Internal linking engine

| API | Purpose |
|-----|---------|
| `getInternalLinksForPath(path)` | Auto links for any mapped route |
| `getRelatedLinksForPillar(id)` | Pillar landing related programmes |
| `getEducationHubLinks()` | Hub grid + homepage ItemList |
| `getPillarItemListItems()` | JSON-LD ItemList URLs |

Components: `InternalLinksBlock`, `HomeEducationEcosystemNav` (sr-only crawl nav).

---

## Schema strategy (no duplicates)

| Page type | Primary schema | Avoid |
|-----------|----------------|-------|
| Home | Organization, Event, FAQ (existing) + **ItemList** (pillars only) | Second Organization |
| Pillar | WebPage, Breadcrumb, ItemList (related) | Full Organization body |
| Education hub | CollectionPage, ItemList, Breadcrumb | Event |
| Registration | Unchanged Phase 1 schemas | — |
| Press | Unchanged NewsArticle | — |

Builders: `src/lib/seo/schema/builders.ts` — use `@id` org reference (`/#organization`).

---

## Future growth model

### Phase 4 — Entity landings

Framework: `src/lib/knowledge-graph/entities/landing-framework.ts`  
Paths planned under `/entity/{type}/{slug}` (not live).

### Phase 5 — Content migration

- Keynote → Person entities
- Proceedings → ScholarlyArticle batches
- Vibhag pages → pillar-enriched hubs

### Phase 6 — Knowledge Graph API

- Export `CONTENT_MAP` + `ENTITY_MAP` for external BI / GSC entity reports
- Optional `sameAs` enrichment from DHE + institutional partners

---

## Authority crawl paths

1. `/` → sr-only pillar nav + ItemList JSON-LD  
2. `/education` → all pillar cards  
3. Each `/[pillar]` → clusters + mapped legacy URLs  
4. Legacy pages → inherit links via `getInternalLinksForPath` (ready for component injection)  
5. `sitemap.xml` — includes `education` + all pillar slugs  

---

## Taxonomy layers

| Layer | Module |
|-------|--------|
| Education domain | `taxonomy/education-taxonomy.ts` |
| Entity types | `taxonomy/entity-taxonomy.ts` |
| Topic / edition / audience | `taxonomy/topic-taxonomy-constants.ts` |
| Pillar slugs | `taxonomy/pillar-taxonomy.ts` |

---

## KPIs to monitor

- GSC impressions on `/education` and pillar URLs
- Internal link click-through (when visible blocks added)
- Rich results: Breadcrumb, ItemList validation
- Cannibalization check: pillar vs legacy titles (should complement)
