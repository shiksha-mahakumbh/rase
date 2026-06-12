# Phase C SEO Plan

**Date:** May 2026  
**Engine:** Existing `SeoMetadata` + `seo.service.ts` + `metadataFromCmsSeo`  
**Target:** SEO score ≥ 95 post-Phase C

---

## Current SEO baseline (post-S2)

| Capability | Status |
|------------|--------|
| `SeoMetadata` per entity | ✅ Pages, notices, homepage, routes |
| `metadataFromCmsSeo` | ✅ Press, legal, locale home |
| `buildBreadcrumbSchema` | ✅ `PublicPageShell`, noticeboard |
| `buildNewsArticleSchema` | ✅ Notices, press (partial) |
| `buildEventSchema` | ✅ Exists in seo.service — not wired to Event model |
| `buildPersonSchema` | ✅ `lib/seo/schema/builders.ts` — not wired to speakers/committee |
| `buildOrganizationSchema` | ✅ Site-wide — not wired per partner |
| `hreflang` | ✅ en/hi on locale routes |
| Sitemap | ✅ Static + CMS pages — missing organizational entities |

---

## SEO requirements per module

### Module 1 — Committees

| Page | Metadata source | JSON-LD |
|------|-----------------|---------|
| `/committees` | Route SEO key `committees` | BreadcrumbList |
| `/committee/[slug]` | `SeoMetadata` entity `committee` | BreadcrumbList + WebPage |
| Member sections | — | Person (per visible member, optional ItemList) |

**`generateMetadata` pattern:**
```typescript
const cms = await loadCommitteeBySlug(slug, locale);
return metadataFromCmsSeo(cms.seo, {
  title: cms.committee.name,
  description: cms.committee.description ?? fallback,
  path: `/committee/${slug}`,
});
```

**Person schema (members):**
- Use `buildPersonSchema` from `lib/seo/schema/builders.ts`
- Emit `ItemList` of Person objects on edition pages (cap at 20 for payload size; rest in page content only)
- Fields: `name`, `jobTitle` (designation), `worksFor` (organization), `image`, `url` (social)

**Breadcrumbs:**
```
Home → Committees → [Edition name] → [Committee name]
```

---

### Module 2 — Speakers

| Page | Metadata source | JSON-LD |
|------|-----------------|---------|
| `/speakers` | Route SEO `speakers` | ItemList of Person |
| `/speakers/[slug]` | `SeoMetadata` entity `speaker` | Person + BreadcrumbList |

**Person JSON-LD fields:**
```json
{
  "@type": "Person",
  "name": "...",
  "jobTitle": "...",
  "worksFor": { "@type": "Organization", "name": "..." },
  "image": "...",
  "sameAs": ["linkedin", "twitter"],
  "description": "bio excerpt"
}
```

**Canonical:** `/speakers/[slug]` (en), `/hi/speakers/[slug]` when Hindi row exists.

---

### Module 3 — Partners

| Page | Metadata source | JSON-LD |
|------|-----------------|---------|
| `/partners` | Route SEO `partners` | ItemList of Organization |
| Partner cards (homepage) | — | Organization per featured partner |

**Organization schema per partner:**
```json
{
  "@type": "Organization",
  "name": "...",
  "url": "website",
  "logo": "logoUrl",
  "description": "..."
}
```

**Homepage:** When CMS partners loaded, inject `Organization` array into existing `SiteJsonLd` or section-level JSON-LD (max 10 featured).

---

### Module 4 — Events

| Page | Metadata source | JSON-LD |
|------|-----------------|---------|
| `/events` | Route SEO `events` | ItemList of Event |
| `/events/[slug]` | `SeoMetadata` entity `event` | Event + BreadcrumbList |

**Event schema (use existing `buildEventSchema`):**
```json
{
  "@type": "Event",
  "name": "title",
  "startDate": "ISO8601",
  "endDate": "ISO8601",
  "location": { "@type": "Place", "name": "venue" },
  "description": "...",
  "image": "bannerUrl",
  "organizer": { "@type": "Organization", "name": "DHE" },
  "url": "canonical"
}
```

**Brochure:** `subjectOf` or `DownloadAction` link to brochure URL (optional enhancement).

---

### Module 5 — Media Center

| Content type | Schema | Source |
|--------------|--------|--------|
| News | NewsArticle | EventMedia + `buildNewsArticleSchema` |
| Press releases | NewsArticle / Article | Page article (existing press SEO) |
| Media mentions | NewsArticle | EventMedia |
| Photo galleries | ImageGallery / CollectionPage | MediaAlbum WebPage |
| Videos | VideoObject | EventMedia |
| Interviews | Article or NewsArticle | EventMedia |
| Publications | CreativeWork / Article | Download metadata |

**VideoObject template (add to `seo.service.ts`):**
```typescript
export function buildVideoObjectSchema(input: {
  name: string;
  description?: string;
  thumbnailUrl?: string;
  uploadDate: string;
  contentUrl: string;
}) { ... }
```

**Hub page `/media-center`:**
- Route SEO key `media-center`
- BreadcrumbList: Home → Media Center
- `CollectionPage` schema listing featured items

**Detail pages:** `/media-center/[slug]` for EventMedia-backed entries.

---

## SeoMetadata wiring

### New entity types

| entityType | When upserted |
|------------|---------------|
| `committee` | Committee create/update/publish |
| `speaker` | Speaker create/update/publish |
| `partner` | Partner create/update/publish |
| `event` | Event create/update/publish |
| `media_entry` | EventMedia create/update/publish |

### Auto-schema on publish

| Entity | Default `schemaJsonLd` |
|--------|------------------------|
| committee | `buildWebPageSchema` |
| speaker | `buildPersonSchema` |
| partner | `buildOrganizationSchema` (per-partner variant) |
| event | `buildEventSchema` |
| media_entry | `buildNewsArticleSchema` or `buildVideoObjectSchema` by category |

Admin can override via SEO panel (same as notices).

---

## Route SEO keys (add to seed / SEO admin)

| routeKey | Path |
|----------|------|
| `committees` | `/committees` |
| `speakers` | `/speakers` |
| `partners` | `/partners` |
| `events` | `/events` |
| `media-center` | `/media-center` |

---

## hreflang plan

| Route | en | hi |
|-------|----|----|
| `/speakers/[slug]` | ✅ | ✅ if `locale=hi` row |
| `/events/[slug]` | ✅ | ✅ |
| `/committee/[slug]` | ✅ | ✅ |
| `/partners` | ✅ | `/hi/partners` when Hindi partners exist |
| `/media-center` | ✅ | `/hi/media-center` |

Use existing `hreflangForPath` + `withHreflang` wrappers from S1.

---

## Sitemap updates (`sitemap.ts`)

Add dynamic entries for published:
- Committees (edition pages)
- Speakers (profiles)
- Events (catalog items)
- Media center entries (slugged)
- Partners page (single + optional partner anchors — listing page only v1)

**Priority hints:**
- Events (upcoming): 0.8
- Speakers featured: 0.7
- Committees current edition: 0.7
- Media center: 0.6

---

## OpenGraph defaults

| Entity | og:image source |
|--------|-----------------|
| Committee | First member photo or site default |
| Speaker | photoUrl |
| Partner | logoUrl |
| Event | bannerUrl |
| Media entry | thumbnail / asset publicUrl |

Fallback: `loadDefaultOgImage(locale)` from site settings.

---

## Breadcrumb implementation

Reuse `BreadcrumbJsonLd` + `BreadcrumbNav` in:
- `CommitteeEditionPage` (CMS-driven titles)
- New `SpeakerProfilePage`
- New `EventDetailPage`
- `MediaCenter` hub (already has BreadcrumbNav — wire JSON-LD)

---

## SEO score projection

| Area | Pre-C | Post-C | Delta |
|------|------:|-------:|------:|
| Structured data coverage | 70% | 95% | +25 |
| CMS-managed metadata | 75% | 95% | +20 |
| Canonical/hreflang | 90% | 95% | +5 |
| Sitemap completeness | 80% | 92% | +12 |
| **Overall SEO** | **94** | **96** | ✅ target ≥95 |

---

## Implementation checklist (SEO)

- [ ] Add `buildVideoObjectSchema`, `buildPersonSchema` export usage in seo.service
- [ ] Wire `upsertSeoForEntity` in each Phase C service on publish
- [ ] `generateMetadata` on all new public routes
- [ ] `BreadcrumbJsonLd` on detail pages
- [ ] Extend `sitemap.ts` with organizational entities
- [ ] Seed route SEO keys in `seed-phase-c-content.mjs`
- [ ] Document in `PHASE_C_SEO_REPORT.md` (post-implementation deliverable)

---

## Non-goals

- AMP pages
- Separate Hindi sitemap domain
- AI-generated meta descriptions
- Schema for registration/payment flows
