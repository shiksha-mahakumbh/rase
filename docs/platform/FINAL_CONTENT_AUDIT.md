# Final Content Audit

**Date:** May 2026  
**Scope:** Homepage, committees, speakers, partners, events, media center, downloads, noticeboard, legal, departments

---

## Content health summary

| Area | CMS coverage | Content quality | SEO opportunity | Duplicate risk |
|------|-------------|-----------------|-----------------|----------------|
| Homepage | Partial (60%) | Strong | High | Low |
| Committees | Partial (legacy fallback) | Good | Medium | Medium (5 legacy editions) |
| Speakers | CMS + fallback | Good | High (Person schema) | **High** (`/keynotespeakers`) |
| Partners | CMS + fallback | Good | Medium | Low |
| Events | CMS + fallback | Good | High (Event schema) | Medium (past-events separate) |
| Media center | CMS + archive fallback | Good | Medium | **High** (glimpses duplicates archives) |
| Downloads | Fully CMS | Good | Medium | Low |
| Noticeboard | Fully CMS | Good | High (NewsArticle) | Low |
| Legal pages | CMS + JSX fallback | Adequate | Medium | Low |
| Departments | CMS + Vibhag fallback | Mixed | Low | Medium (VibhagRoute duplicates) |

---

## Homepage

| Section | Source | Quality | Recommendation |
|---------|--------|---------|----------------|
| Hero | CMS + fallback | Strong | Publish CMS hero |
| Stats/counters | CMS | Good | — |
| Featured speakers | CMS + `authority-speakers` | Good | Publish CMS; retire fallback |
| Partners strip | CMS + static logos | Good | Publish all partners |
| Featured events | CMS + hardcoded | Good | Publish upcoming event |
| FAQ | CMS | Good | — |
| Gallery | CMS | Good | — |
| Movement timeline | **Hardcoded** | Good content | Migrate to CMS section |
| Who Should Attend | **Hardcoded** | Good | Migrate to CMS |
| Discover strip | **Hardcoded** | Adequate | Migrate to CMS |
| Carousel slides | `slides-data.ts` | Good | Migrate to CMS |
| Notice board widget | CMS | Good | — |

**Duplicate content:** None significant on homepage.

**Outdated risk:** Hardcoded timeline may lag new editions — migrate to CMS.

---

## Committees

| Content | Source | Status |
|---------|--------|--------|
| 5 edition pages | Legacy TSX (`legacy-registry.ts`) | Hardcoded member arrays |
| New CMS committees | DB | Seed available, needs publish |
| `/committees` index | `committee-editions.ts` | Hardcoded tree |

**Duplicate:** Legacy editions overlap with CMS capability — same members may exist in both.

**SEO opportunity:** Person schema for each committee member in CMS view.

**Weak content:** `/committees` index not CMS-driven — shows static tree only.

---

## Speakers

| Content | Source | Issue |
|---------|--------|-------|
| `/speakers` hub | CMS + `authority-speakers` fallback | Dual source |
| `/speakers/[slug]` | CMS | Good when published |
| `/keynotespeakers` | `KeynoteSpeakers.tsx` | **Duplicate route** — same people, different page |

**Recommendation:** Consolidate to `/speakers`; 301 redirect legacy route.

---

## Partners

| Content | Source | Quality |
|---------|--------|---------|
| `/partners` page | CMS | Good when seeded |
| Homepage strip | CMS + `Media_Partners` fallback | Good |
| Conference support | **Hardcoded** logos | Migrate to Partners CMS |

**SEO opportunity:** Organization schema per partner when SEO metadata configured.

---

## Events

| Content | Source | Issue |
|---------|--------|-------|
| `/events` listing | CMS + `conference-catalog.ts` links | Mixed |
| `/events/[slug]` | CMS | Good |
| `/upcoming-events` | CMS + `UpcomingEvent` defaults | Fallback may show stale dates |
| `/past-events` | `past-editions.ts` | **Separate from Events CMS** |
| `/past_event/*` (8 routes) | Legacy TSX | Outdated risk |

**Outdated content risk:** Hardcoded upcoming event dates if CMS not published.

**SEO opportunity:** Unify past + upcoming under Events CMS with `status` filter.

---

## Media center

| Content | Source | Duplicate |
|---------|--------|-----------|
| CMS hub | `media-center.service` aggregation | — |
| Legacy fallback | `media-archives.ts` + `MediaCenter` client | Same content as CMS target |
| `/glimpses` | `GlimpsesContent.tsx` | **Duplicates `media-archives.ts`** |
| `/videos` | `VideoPage` | Separate from hub |
| `/media/[edition]/[year]/[type]` | 8 archive routes | Legacy structure |

**Recommendation:** Single media center source; deprecate glimpses duplicate.

---

## Downloads

| Content | Source | Quality |
|---------|--------|---------|
| `/downloads` | Fully CMS | Good |
| Event brochures | Events CMS `brochureDownloadId` | Good linkage |
| Proceedings PDFs | **Not in CMS** | Large gap — hardcoded proceedings pages |

---

## Noticeboard

| Content | Source | Quality |
|---------|--------|---------|
| `/noticeboard` | Fully CMS | Good |
| Homepage widget | CMS via CmsProvider | Good |

**SEO:** NewsArticle schema per notice — strong.

---

## Legal pages

| Page | CMS slug | Fallback |
|------|----------|----------|
| Privacy policy | `privacy-policy` | Inline JSX |
| Terms | `terms-and-conditions` | Inline JSX |
| Cookie policy | `cookie-policy` | Inline JSX |
| Disclaimer | `disclaimer` | Inline JSX |
| Refund policy | `refund-policy` | Inline JSX |

**Quality:** Adequate legal copy in fallbacks. CMS versions should be reviewed by legal counsel before publish.

**Hindi:** CMS-ready but en fallback active until hi pages published.

---

## Departments

| Department | CMS slug | Legacy fallback |
|------------|------------|-----------------|
| Vitt | `vitt` | `VittVibhag` |
| Sampark | `sampark` | `SamparkVibhag` |
| Prachar | `prachar` | `PracharVibhag` |
| Prabandhan | `prabandhan` | `PrabandhanVibhag` |
| Academic Council | `academic-council` | Legacy component |

**Duplicate:** `/VibhagRoute/*24` mirrors `/departments/*` — redirect exists but duplicate content pre-redirect.

**Weak content:** Fallback Vibhag components may be more complete than CMS pages — publish CMS before removing fallback.

---

## Cross-cutting content issues

| Issue | Routes affected | Priority |
|-------|----------------|----------|
| Duplicate speaker pages | `/keynotespeakers`, `/speakers` | P0 |
| Duplicate media archives | `/glimpses`, `/media-center` | P1 |
| Past events separate from Events CMS | `/past-events`, `/past_event/*` | P1 |
| Proceedings not in Downloads CMS | `/proceeding1-3` | P2 |
| Contact info not from Settings CMS | `/contact-us` | P1 |
| Knowledge graph static copy | 27 routes | P3 (Phase D) |

---

## SEO content opportunities

1. Publish CMS speakers with full bio + Person schema
2. Seed event pages with Event schema + registration links
3. Migrate press legacy articles to CMS Articles (hi + en)
4. Add FAQ schema to department pages
5. Media center VideoObject for all video entries
6. Hindi content publish for top 10 routes

---

## Content publish checklist (pre-launch)

- [ ] Run `node scripts/seed-phase-c-content.mjs --publish`
- [ ] Run `node scripts/seed-s2-content.mjs --publish`
- [ ] Publish homepage CMS sections (replace fallbacks)
- [ ] Bulk-import 5 committee legacy editions
- [ ] Migrate 9 press legacy articles
- [ ] Publish legal pages from CMS (legal review)
- [ ] Publish department CMS pages
- [ ] Wire contact page to Settings CMS
- [ ] Remove or redirect `/keynotespeakers`
