# Knowledge Graph Architecture (Foundation)

**Site:** [rase.co.in](https://www.rase.co.in) — Shiksha Mahakumbh Abhiyan  
**Phase 1:** Entity map + taxonomy only. **No route or URL changes.**

## Core entity

| Entity | Schema.org type | Canonical URL | Notes |
|--------|-----------------|---------------|-------|
| Shiksha Mahakumbh Abhiyan | `Organization`, `EducationalOrganization` | `/` | `HomeJsonLd`, `IntroductionJsonLd` |
| SMK 6.0 (2026) | `EducationEvent` | `/registration` | `RegistrationJsonLd` |
| Department of Holistic Education | `EducationalOrganization` | dhe.org.in (sameAs) | Publisher for articles |
| Knowledge Hub | `CollectionPage` | `/knowledge` | Breadcrumb + collection (existing) |

---

## Content pillars → routes (cluster map)

| Pillar | Primary routes | Schema (current / planned) |
|--------|----------------|----------------------------|
| School Education | `/VibhagRoute/*`, school registration tracks | `Event`, `Course` (future) |
| Higher Education | `/conclave`, `/academiccouncil`, HEI forms | `Event`, `Person` (VCs) |
| Vocational Education | Workshop archives under `/past_event/*` | `Event` |
| Skill Development | Olympiad / talent registration (hub) | `Event` subEvent |
| Research | `/abstract`, `/fulllengthpaper`, `/proceedings`, `/paper` | `ScholarlyArticle` (Phase 2) |
| Innovation | Innovation workshop, exhibition tracks | `Event` |
| Leadership | `/keynotespeakers`, `/introduction` | `Person` |
| Policy | `/conclave`, policy topics `/Topics` | `Article` |
| Teacher Development | `/past_event/Teacher_Development_Program` | `Event` |
| Student Development | Olympiad, Bal Shodh, cultural tracks | `Event` |
| Educational Technology | Digital media routes, `/videos` | `VideoObject` (Phase 3) |
| Olympiads | Registration hub category | `SportsEvent` / `EducationEvent` |
| Awards | Registration hub category | `Event` |
| Conferences | `/shikshamahakumbh`, `/shikshakumbh`, `/registration` | `EducationEvent` |
| Media | `/media`, `/Press_Release`, `/Press1`–`9` | `NewsArticle` (Phase 1 on Press) |
| Publications | `/journals`, `/books`, `/proceeding*` | `PublicationVolume` |
| Knowledge Hub | `/knowledge` | `CollectionPage`, `ItemList` |

---

## Taxonomy (controlled vocabulary)

```
smk:edition → smk4 | smk5 | smk6
smk:type → mahakumbh | kumbh | workshop | conclave | press
smk:audience → school | hei | ngo | volunteer | delegate
smk:track → research | olympiad | awards | exhibition | policy
smk:language → en | hi (locale routes: /hi, /fr, /es, /ar)
```

Use in Phase 2 for:
- Internal linking blocks on pillar hub pages (no URL change — anchor sections first)
- `BreadcrumbList` consistency via `buildBreadcrumbJsonLd(pathSegments)`

---

## Entity relationship diagram (logical)

```mermaid
flowchart TB
  org[EducationalOrganization SMK Abhiyan]
  evt[EducationEvent SMK 6.0]
  reg[/registration]
  know[/knowledge]
  press[NewsArticle Press1-9]
  proc[Publication Proceedings]

  org --> evt
  evt --> reg
  org --> know
  org --> press
  org --> proc
  evt --> press
```

---

## Future schema strategy (Phase 2+)

1. **Person** — Keynote speakers page: one `ItemList` + nested `Person` (max 20 per page).
2. **FAQ** — Expand hub-specific FAQs on `/introduction`, `/paper` (avoid duplicate with home FAQ).
3. **Breadcrumb** — Add to all layouts via `createPageMetadata` helper wrapper.
4. **Article / ScholarlyArticle** — Proceedings volumes when content moves to MDX.
5. **sameAs** — Maintain in `src/config/site.ts` only (single source).
6. **Avoid** — Duplicate `Organization` on every page; prefer page-specific + `@id` references.

---

## JSON-LD inventory (Phase 1)

| Location | Schemas |
|----------|---------|
| Home | Organization, Event, FAQ |
| `/registration` | EducationalOrganization, EducationEvent, FAQ |
| `/introduction` | Organization, EducationalOrganization, Breadcrumb |
| `/knowledge` | CollectionPage, Breadcrumb |
| `/Press1`–`9` | NewsArticle |

No duplicate Organization on registration (uses educational + event types only).
