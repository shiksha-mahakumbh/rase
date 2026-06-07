# Past Editions Update Report

**Date:** 2026-06-05  
**Scope:** Shiksha Mahakumbh Abhiyan editions 1.0–5.0

---

## Canonical edition model

| Edition | Venue | Dates | Theme | Route |
|---------|-------|-------|-------|-------|
| 1.0 | NIT Jalandhar | 9–11 Jun 2023 | Recent Advances in School Education | `/past_event/sm23` |
| 2.0 | NIT Kurukshetra | 20 Dec 2023 | Role of Academic-driven Startups in Economy | `/past_event/sk23` |
| 3.0 | NIT Srinagar | 29–30 Jun 2024 | Role of Academic-driven Startups in Developing Economy of J & K | `/past_event/sk24` |
| 4.0 | Kurukshetra University | 16–17 Dec 2024 | Indian Education System for Global Development | `/past_event/sm24` |
| 5.0 | NIPER Mohali | 31 Oct – 2 Nov 2025 | Classroom to Society: Building a Healthier World through Education | `/past_event/sm25` (new) |

Single source of truth: `src/data/past-editions.ts`

---

## Files created

| File | Purpose |
|------|---------|
| `src/data/past-editions.ts` | Canonical edition data |
| `src/components/past-editions/PastEditionsShowcase.tsx` | Modern `/pastevent` UI |
| `src/components/past-editions/PastEditionsJsonLd.tsx` | EventSeries + Breadcrumb JSON-LD |
| `src/components/past-editions/EditionDetailTemplate.tsx` | Reusable edition detail layout |
| `src/app/past_event/sm25/page.tsx` | SMK 5.0 detail route |
| `src/app/past_event/sm25/layout.tsx` | SMK 5.0 metadata |
| `src/app/component/sm25/SM25.tsx` | SMK 5.0 content |

---

## Files modified

| File | Change |
|------|--------|
| `src/app/component/PastEvent.tsx` | Replaced table with `PastEditionsShowcase` |
| `src/components/home/MovementTimelineSection.tsx` | Fixed IIT Ropar → verified venues; links to editions |
| `src/app/component/card.tsx` | Homepage cards use SMK 1.0–3.0 from canonical data |
| `src/app/component/Info.tsx` | Timeline + JSON-LD from `past-editions.ts` |
| `src/app/component/Introduction.tsx` | Themes 3.0 & 5.0 aligned to verified copy |
| `src/app/component/TreeComponent.tsx` | Gallery timeline uses canonical data + internal links |
| `src/data/authority.ts` | `pastEditions` lists all 5 SMK editions; stat → 5 completed |
| `src/lib/seo/publicPages.ts` | SEO titles/descriptions/keywords per edition |
| `src/lib/knowledge-graph/conference-catalog.ts` | Year archive 2023–2026 corrected |
| `src/lib/knowledge-graph/content-map.ts` | SMK 1.0–5.0 path mappings |
| `src/app/sitemap.ts` | Added `past_event/*` routes |

---

## Old content removed

- `/pastevent` legacy HTML table-only layout
- Homepage timeline **IIT Ropar** placeholders for editions 1.0–5.0
- Incorrect SEO labels: `sm23` as “4.0”, `sm24` as “5.0”
- `authority.ts` vague “National multi-city” / “Pan-India” edition rows
- Homepage `card.tsx` misordered RASE 1st/2nd edition labels (Kumbh/Mahakumbh swap)

---

## New content added

- Hero + alternating timeline on `/pastevent`
- Per-edition sections: theme, core essence (Mool Tatva), impact, gallery placeholder
- Accessible “Editions at a Glance” table
- SMK 5.0 microsite at `/past_event/sm25`
- Structured data: `EventSeries`, `EducationEvent`, `BreadcrumbList`

---

## SEO updates

- `/pastevent` title: “Past Editions — Shiksha Mahakumbh 1.0 to 5.0”
- Per-route metadata for `sm23`, `sk23`, `sk24`, `sm24`, `sm25`
- Keywords: Shiksha Mahakumbh, DHE, Indian Education Conference, etc.
- Sitemap includes all past_event edition URLs

---

## Sections intentionally omitted (no verified data provided)

- Per-edition participant/research/exhibition **statistics counters**
- **Chief guest** profile cards (names not in source brief)
- Invented Mool Tatva beyond existing `coreEssence` / focus fields

When official statistics and guest lists are supplied, extend `past-editions.ts` and render in `PastEditionsShowcase`.

---

## Verification

```bash
npm run lint
npm run build
```

Manual checks: `/pastevent`, `/past_event/sm25`, homepage timeline, `/introduction` past editions section.
