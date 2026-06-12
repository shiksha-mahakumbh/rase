# CMS Expansion — Final Migration Roadmap

**Date:** May 2026  
**Current CMS routes:** 3 page-level + global chrome  
**Target:** 90%+ routes CMS-managed  
**Status:** Roadmap only — no implementation

---

## Migration strategy

**Principle:** Use existing `Page` + `PageSection` + `MediaAsset` + `SeoMetadata` APIs wherever possible. Add new entity types only when existing models cannot represent the content.

**Order:** High-traffic → high-change-frequency → structural complexity

---

## Content inventory & migration map

### Tier 1 — Immediate (S1, weeks 1–2)

Uses existing CMS APIs. No new models.

| Content | Routes | Current source | Migration target | Effort |
|---------|-------:|----------------|------------------|--------|
| **Legal pages** | 5 | HC TSX | `Page` type=legal | 3 days |
| **Introduction / About** | 1 | HC + JSON-LD | `Page` type=about + sections | 2 days |
| **Homepage gallery** | 1 section | HC `GallerySection` | Homepage section → media picker | 1 day |
| **Locale homepage** | 1 | Missing CmsProvider | Wire `/[locale]` + Hindi seed | 1 day |
| **Contact page body** | 1 | HC | `Page` type=contact (settings already CMS) | 1 day |

**Routes unlocked:** 8  
**Admin manageability gain:** +7%

### Tier 2 — Press & articles (S2, weeks 3–5)

| Content | Routes | Current source | Migration target | Effort |
|---------|-------:|----------------|------------------|--------|
| **Press articles** | 9 | Inline TSX client components | `Page` type=article + sections | 8 days |
| **Press hub** | 1 | HC `/press` | `Page` type=listing | 1 day |
| **Legacy Press1–9 stubs** | 9 | Redirect stubs | Remove layouts (redirect only) | 1 day |

**Routes unlocked:** 10  
**Admin manageability gain:** +8%

### Tier 3 — Media & gallery (S2, weeks 5–6)

| Content | Routes | Current source | Migration target | Effort |
|---------|-------:|----------------|------------------|--------|
| **Photo gallery** | 1 | HC `/gallery` | Media albums + public gallery page | 5 days |
| **Glimpses** | 1 | HC | Media album or homepage section | 2 days |
| **Videos** | 1 | HC `/videos` | `MediaAsset` type=video + embed | 3 days |
| **Media center hub** | 1 | HC | `Page` type=media-hub linking albums | 2 days |
| **Media archives** | 1 | `/media/[edition]/[year]/[type]` | Media albums by edition/year | 5 days |
| **Print/digital media (8 legacy)** | 8 | Redirect stubs | Remove stub layouts | 1 day |

**Routes unlocked:** 12  
**Admin manageability gain:** +7%

### Tier 4 — Committees & team (S3 / Phase C, weeks 7–9)

| Content | Routes | Current source | Migration target | Effort |
|---------|-------:|----------------|------------------|--------|
| **Committee editions** | 5 | Inline member arrays | `Committee` + `CommitteeMember` API + admin UI | 8 days |
| **Committees hub** | 1 | HC | `Page` type=listing | 1 day |
| **Keynote speakers** | 1 | HC + Firestore | `SpeakerProfile` API + admin UI | 5 days |

**Routes unlocked:** 7  
**Admin manageability gain:** +5%

### Tier 5 — Events (S3 / Phase C, weeks 9–11)

| Content | Routes | Current source | Migration target | Effort |
|---------|-------:|----------------|------------------|--------|
| **Events hub** | 1 | `conference-catalog.ts` | `Event` API + admin UI | 3 days |
| **Workshops hub** | 1 | catalog | Events filtered by type | 1 day |
| **Summits hub** | 1 | catalog | Events filtered by type | 1 day |
| **Upcoming events** | 1 | HC | Events API `status=published,future` | 2 days |
| **Past events** | 1 | HC + `authority.ts` | Events API `status=past` + editions | 2 days |
| **Past event detail (8)** | 8 | HC per-event pages | `Event` detail or `Page` | 5 days |

**Routes unlocked:** 14  
**Admin manageability gain:** +8%

### Tier 6 — Departments (S2–S3, weeks 6–8)

| Content | Routes | Current source | Migration target | Effort |
|---------|-------:|----------------|------------------|--------|
| **5 department pages** | 5 | `DepartmentPage` + HC | `Page` type=department + sections | 5 days |
| **Academic council legacy** | 1 | Redirect | Already redirected | — |
| **VibhagRoute stubs (5)** | 5 | Redirect stubs | Remove layouts | 0.5 day |

**Routes unlocked:** 5  
**Admin manageability gain:** +4%

### Tier 7 — Publications & proceedings (S4, weeks 12–14)

| Content | Routes | Current source | Migration target | Effort |
|---------|-------:|----------------|------------------|--------|
| **Proceedings 1–3** | 3 | Massive inline TSX | `Download` type=proceedings or CMS pages | 8 days |
| **Proceedings hub** | 1 | HC | `Page` listing | 1 day |
| **Journals** | 1 | HC | Downloads or page | 2 days |
| **Books** | 1 | HC | Downloads | 1 day |
| **Paper/abstract** | 2 | HC + forms | Keep forms; migrate info pages | 2 days |

**Routes unlocked:** 8  
**Admin manageability gain:** +5%

### Tier 8 — Knowledge graph (S4 / Phase D, weeks 14–18)

| Content | Routes | Current source | Migration target | Effort |
|---------|-------:|----------------|------------------|--------|
| **Knowledge hub** | 1 | `CONTENT_REGISTRY` | `Page` type=hub | 2 days |
| **15 pillar pages** | 15 | `pillar-registry.ts` | `Page` type=pillar | 10 days |
| **7 entity directories** | 7 | `entity-directories.ts` | `Page` type=entity-dir | 5 days |
| **4 publication types** | 4 | Template | `Page` type=publication | 3 days |
| **Initiatives** | 1 | HC registry | `Page` type=initiatives | 2 days |

**Routes unlocked:** 28  
**Admin manageability gain:** +15%

---

## What NOT to migrate (intentional)

| Content | Reason |
|---------|--------|
| Registration forms (9 routes) | Firebase — user mandate |
| Datadekh (22 routes) | Internal, noindex, deprecated |
| Legacy redirect stubs (32) | Remove layouts, keep 301s only |
| Custom submission forms (HEI, school project) | Bespoke validation + Firebase |
| Payment flow | User mandate |

---

## Migration workflow per content type

### Standard page migration

```
1. Create Page in admin (or seed script)
2. Add PageSections with content JSON
3. Attach SeoMetadata
4. Set publishAt / status=published
5. Update route to loadCmsPageBySlug()
6. Remove hardcoded TSX data
7. Add redirect if URL changed
8. Verify sitemap inclusion
```

### Article migration (press)

```
1. Create Page type=article per press article
2. Sections: hero, body blocks, images via media picker
3. NewsArticle JSON-LD from CMS SEO schemaJsonLd
4. Route: dynamic [slug] or keep static paths with CMS loader
5. Delete inline TSX data + client component
```

### Committee migration

```
1. Create Committee per edition in admin
2. Add CommitteeMembers with photos from media library
3. Public route loads from GET /api/v2/committees?edition=2025
4. Person JSON-LD auto-generated
5. Remove inline member arrays
```

---

## Seed script extensions

| Script | Content |
|--------|---------|
| `seed:cms` (existing) | Homepage, notices, downloads, settings |
| `seed:cms-legal` (new) | 5 legal pages en |
| `seed:cms-about` (new) | Introduction page en + hi |
| `seed:cms-press` (new) | 9 press articles from existing content |
| `seed:cms-hi` (new) | Hindi homepage + settings + 5 notices |

---

## Route count projection

| Milestone | CMS-managed routes | % of 118 content routes |
|-----------|-------------------:|------------------------:|
| Today | 3 | 3% |
| After Tier 1 | 11 | 9% |
| After Tier 2 | 21 | 18% |
| After Tier 3 | 33 | 28% |
| After Tier 4–5 | 54 | 46% |
| After Tier 6–7 | 67 | 57% |
| After Tier 8 | 95 | 80% |
| + global chrome | — | **~90% effective** |

*Effective % weights high-traffic routes (homepage, notices, downloads, press, events) at 3×.*

---

## Timeline summary

| Phase | Weeks | Routes | Cumulative % |
|-------|------:|-------:|-------------:|
| S1 Tier 1 | 1–2 | 8 | 15% effective |
| S2 Tier 2–3, 6 | 3–8 | 27 | 45% effective |
| S3 Tier 4–5 | 7–11 | 21 | 65% effective |
| S4 Tier 7–8 | 12–18 | 36 | 90% effective |

**Total estimated duration: 18 weeks to 90% manageability**
