# Content Population Workflow — SMK 6.0 & Authority Building

Use this workflow to add **real** content without restructuring routes or registration. All ecosystem and authority data is **static TypeScript** until a CMS is introduced.

---

## Content types → source files

| Content type | Primary data file | Surfaces |
|--------------|-------------------|----------|
| Speakers | `src/data/authority-speakers.ts` | Introduction, Knowledge Hub, Global Search |
| Publications | `src/lib/ecosystem/registries.ts` + `/proceedings`, `/books`, `/journals` pages | Knowledge Hub |
| Success stories | `src/data/authority.ts` → `successStories` | Introduction authority strip |
| Research outputs | `src/data/authority.ts` → `researchOutput` | Introduction |
| Partner institutions | `src/data/authority.ts` → `participatingInstitutions`, `partnerOrganizations` | Introduction |
| Past editions | `src/data/authority.ts` → `pastEditions` | Introduction, `/pastevent` |
| Knowledge articles | `src/lib/content/registry.ts` | `/knowledge` hub |
| Case studies | `src/lib/ecosystem/registries.ts` | Knowledge Hub, search |

After edits: `npm run build` → deploy. No Firestore writes required for editorial content.

---

## Standard workflow (all types)

1. **Draft** using the template in `docs/content-templates/` (copy → fill).
2. **Review** with DHE/RASE content owner (accuracy, permissions, photos).
3. **Add** to the correct TypeScript array (see templates for field names).
4. **Wire search** — speakers/stories auto-sync via `registries.ts`; publications/experts may need a new `EcosystemItem` entry.
5. **SEO** — if the item has its own URL, ensure that route has `layout.tsx` metadata or uses `metadataBuilders`.
6. **Verify** — `/knowledge?q=…`, Global Search (navbar), Introduction section anchors (`#speakers`, `#stories`).
7. **Announce** — press page or homepage marquee only after URL is live.

---

## Speakers

1. Open `docs/content-templates/SPEAKER_TEMPLATE.md`.
2. Append to `featuredSpeakers` in `authority-speakers.ts`.
3. Optional: add `imageSrc: "/speakers/name.webp"` under `public/` (WebP, ≤ 200 KB).
4. Registry rebuilds automatically in `registries.ts` (`speakers` array).

**Quality bar:** Real name, verified title, organization, SMK edition, optional topic (one line).

---

## Publications

1. Use `PUBLICATION_TEMPLATE.md`.
2. Add long-form content on existing routes (`/proceedings`, `/books`, `/journals`) — avoid thin listing-only pages.
3. Add a summary row in `registries.ts` → `publications` array for Knowledge Hub discovery.

---

## Success stories

1. Use `SUCCESS_STORY_TEMPLATE.md`.
2. Append to `successStories` in `authority.ts` (quote ≤ 280 chars for cards).
3. Prefer attributed roles (“Principal, …”) until written consent for full names.

---

## Research outputs

1. Use `RESEARCH_OUTPUT_TEMPLATE.md`.
2. Append to `researchOutput` in `authority.ts` with working `href`.

---

## Partner institutions

1. Use `PARTNER_INSTITUTION_TEMPLATE.md`.
2. Update `participatingInstitutions` and/or `partnerOrganizations` in `authority.ts`.
3. Add logos to `public/partners/` when available (`logoSrc` on `InstitutionLogo`).

---

## Past edition highlights

1. Use `PAST_EDITION_TEMPLATE.md`.
2. Append to `pastEditions` (newest first).
3. Link `href` to `/pastevent`, `/shikshakumbh`, or edition microsite.

---

## Editorial calendar (suggested)

| Week | Focus |
|------|--------|
| Pre-launch | SMK 6.0 speakers (track chairs), registration CTA copy |
| Launch +2w | 5 success stories, 3 case studies |
| Launch +1m | Proceedings volume links, press cross-links |
| Quarterly | Past edition row, impact stats review |

---

## Templates

- `docs/content-templates/SPEAKER_TEMPLATE.md`
- `docs/content-templates/PUBLICATION_TEMPLATE.md`
- `docs/content-templates/SUCCESS_STORY_TEMPLATE.md`
- `docs/content-templates/RESEARCH_OUTPUT_TEMPLATE.md`
- `docs/content-templates/PARTNER_INSTITUTION_TEMPLATE.md`
- `docs/content-templates/PAST_EDITION_TEMPLATE.md`

---

## Do not change without approval

- Registration form fields and Firestore schema
- `saveRegistration.ts` ID format `SMK2026-XXXXXX`
- Admin auth and export paths
- Analytics consent gate and event names
