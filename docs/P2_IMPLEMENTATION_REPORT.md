# P2 URL Modernization — Implementation Report

**Status:** Implementation complete — ready for staging validation before production deploy  
**Date:** 7 June 2026  
**Prerequisites:** P0 and P1 complete

---

## 1. Routes Renamed

| Legacy URL | Canonical URL | Mechanism |
|------------|---------------|-----------|
| `/pastevent` | `/past-events` | New page + 301/308 redirect |
| `/upcomingevent` | `/upcoming-events` | New page + redirect |
| `/ContactUs` | `/contact-us` | New page + redirect |
| `/Best_Wishes` | `/best-wishes` | New page + redirect |
| `/Wishes_Received` | `/wishes-received` | New page + redirect |
| `/committeepage` | `/committees` | New page + redirect |
| `/media` (hub) | `/media-center` | New page + redirect |
| `/Press_Release` | `/press` | New page + redirect |
| `/commingsoon` | `/coming-soon` | New page + redirect |
| `/Accomodation` | `/accommodation` | New page + redirect |
| `/academiccouncil` | `/departments/academic-council` | next.config redirect |
| `/VibhagRoute/AcademicCouncil24` | `/departments/academic-council` | New page + redirect |
| `/VibhagRoute/Prabandhan24` | `/departments/prabandhan` | New page + redirect |
| `/VibhagRoute/Prachar24` | `/departments/prachar` | New page + redirect |
| `/VibhagRoute/Sampark24` | `/departments/sampark` | New page + redirect |
| `/VibhagRoute/Vitt24` | `/departments/vitt` | New page + redirect |
| `/Press1` | `/press/baton-ceremony-smk-4` | New page + redirect |
| `/Press2` | `/press/shiksha-mahakumbh-4-0` | New page + redirect |
| `/Press3` | `/press/residential-camp-success` | New page + redirect |
| `/Press4` | `/press/residential-camp-hindi` | New page + redirect |
| `/Press5` | `/press/national-coverage` | New page + redirect |
| `/Press6` | `/press/education-summit-coverage` | New page + redirect |
| `/Press7` | `/press/mahakumbh-programme-update` | New page + redirect |
| `/Press8` | `/press/education-movement` | New page + redirect |
| `/Press9` | `/press/summit-highlights` | New page + redirect |
| `/shikshamahakumbh2024digitalmedia` | `/media/shiksha-mahakumbh/2024/digital` | Dynamic route + redirect |
| `/shikshamahakumbh2023digitalmedia` | `/media/shiksha-mahakumbh/2023/digital` | Dynamic route + redirect |
| `/shikshakumbh2024digitalmedia` | `/media/shiksha-kumbh/2024/digital` | Dynamic route + redirect |
| `/shikshakumbh2023digitalmedia` | `/media/shiksha-kumbh/2023/digital` | Dynamic route + redirect |
| `/printmediashikshamahakumbh2024` | `/media/shiksha-mahakumbh/2024/print` | Dynamic route + redirect |
| `/printmediashikshamahakumbh2023` | `/media/shiksha-mahakumbh/2023/print` | Dynamic route + redirect |
| `/printmediashikshakumbh2024` | `/media/shiksha-kumbh/2024/print` | Dynamic route + redirect |
| `/printmediashikshakumbh2023` | `/media/shiksha-kumbh/2023/print` | Dynamic route + redirect |

**Total public routes modernized:** 33 content routes (+ 4 admin/datadekh typo fixes)

---

## 2. Redirects Added

**Source:** `src/config/legacy-redirects.js` (37 entries) wired in `next.config.js`.

| Category | Count | Notes |
|----------|-------|-------|
| Event slugs | 2 | past/upcoming |
| Contact & community | 4 | contact, wishes, committees |
| Departments (Vibhag) | 6 | includes `/academiccouncil` |
| Press hub + articles | 10 | Press_Release + Press1–9 |
| Media archives | 8 | hierarchical `/media/{edition}/{year}/{type}` |
| Spelling fixes | 2 | commingsoon, Accomodation |
| Datadekh typo copies | 4 | `*datadekh copy` → canonical datadekh paths |

**Redirect properties:**
- All entries use `permanent: true` in Next.js config
- Runtime behavior: **308 Permanent Redirect** (Next.js standard for `permanent: true` on App Router)
- Query parameters: preserved automatically by Next.js
- URL hashes (`#section`): **not preserved** — hashes are client-only and never sent to the server; this is a platform limitation, not a regression

**Legacy page stubs:** Each legacy `page.tsx` also uses `legacy-redirect-page.tsx` server redirect as a belt-and-suspenders fallback if config redirects are bypassed.

**Config validation** (`node scripts/test-redirects.mjs`):

```json
{
  "totalRedirects": 37,
  "allPermanent": true,
  "issues": [],
  "pass": true
}
```

---

## 3. Internal Links Updated

**Bulk migration:** `scripts/migrate-to-canonical-urls.mjs`

| Metric | Value |
|--------|-------|
| Files scanned | 592 |
| Files changed | 62 |
| Total replacements | 193 |

**Areas updated:**
- Header / footer navigation (`src/constants/navigation.ts`, `footer-content.ts`)
- Mobile menu (via shared navigation constants)
- Homepage cards (`DiscoverStrip`, `MovementTimelineSection`)
- Committee trees and pages
- Media trees and `MediaCenter` component
- Vibhag/department shells
- Press listing and share URLs
- Knowledge graph and authority maps
- Registration form cross-links (non-registration paths only)
- Sitemap generator

**Link verification** (`node scripts/verify-internal-links.mjs`):

```json
{
  "totalLinks": 127,
  "brokenCount": 0,
  "broken": []
}
```

---

## 4. Metadata Updated

New canonical routes include full SEO metadata via dedicated `layout.tsx` files and shared builders:

| Route | Metadata source | Includes |
|-------|-----------------|----------|
| `/past-events` | `createEventMetadata` | title, description, OG, Twitter, canonical |
| `/upcoming-events` | `createEventMetadata` | same |
| `/contact-us` | `createPageMetadata` | same |
| `/best-wishes`, `/wishes-received` | dedicated layouts | same |
| `/committees` | `committees/layout.tsx` | same |
| `/media-center` | `media-center/layout.tsx` | same |
| `/departments/*` | department layouts + `VibhagJsonLd` | same + structured data |
| `/press` | press hub layout | same |
| `/press/{slug}` | per-article layouts | Article OG + canonical |
| `/media/{edition}/{year}/{type}` | `mediaArchives.ts` + dynamic layout | archive-specific meta |
| `/accommodation`, `/coming-soon` | dedicated layouts | same |

**Canonical URL pattern:** All new layouts use `CANONICAL_ROUTES` from `src/constants/canonical-routes.ts` for consistent `alternates.canonical`.

**Structured data:** `BreadcrumbJsonLd` added/updated on departments, events, media archives, committees, and wishes pages.

---

## 5. Sitemap Changes

**File:** `src/app/sitemap.ts`

| Check | Result |
|-------|--------|
| Total URLs | 103 |
| Legacy URLs present | **0** |
| Duplicate URLs | **0** (deduped via `Set`) |
| Redirected URLs in sitemap | **0** |

**Added to sitemap:**
- `past-events`, `upcoming-events`, `contact-us`, `best-wishes`, `wishes-received`
- `committees`, `media-center`
- `departments/academic-council`, `prabandhan`, `prachar`, `sampark`, `vitt`
- `press` + 9 `/press/{slug}` articles
- 8 `/media/{edition}/{year}/{type}` archive paths

**Removed from sitemap:**
- `pastevent`, `upcomingevent`, `ContactUs`, `Best_Wishes`, `Wishes_Received`
- `committeepage`, `Press_Release`, `Press1`–`Press9`
- `VibhagRoute/*`, flat media archive slugs
- `academiccouncil`

**Pillar override:** Knowledge-graph `media` slug maps to `media-center` in sitemap.

---

## 6. Breadcrumb Changes

| Page | Breadcrumb trail |
|------|------------------|
| Past events | Home → Shiksha Mahakumbh → Past Events |
| Upcoming events | Home → Shiksha Mahakumbh → Upcoming Events |
| Media center | Home → Media Centre |
| Media archives | Home → Media Centre → {edition year type} |
| Departments | Home → Departments → {department name} |
| Committees hub | Home → Committees |
| Committee detail | Home → Committees → {edition} |
| Best wishes / Wishes received | Home → {page title} |
| Contact us | Home → Contact Us |
| Press articles | Home → Press → {article title} |

Implemented via `BreadcrumbJsonLd` in layout files and `VibhagPageShell` for department pages.

---

## 7. Files Modified

### Infrastructure (new)
- `src/constants/canonical-routes.ts`
- `src/config/legacy-redirects.js`
- `src/lib/routing/legacy-redirect-page.tsx`
- `src/data/media-archive-keys.ts`
- `src/data/media-archives.ts`
- `src/lib/seo/mediaArchives.ts`

### Canonical route pages (new)
- `src/app/past-events/`, `upcoming-events/`, `contact-us/`
- `src/app/best-wishes/`, `wishes-received/`, `committees/`
- `src/app/media-center/`, `coming-soon/`, `accommodation/`
- `src/app/departments/{academic-council,prabandhan,prachar,sampark,vitt}/`
- `src/app/press/` (hub + 9 article slugs)
- `src/app/media/[edition]/[year]/[type]/`

### Legacy routes converted to redirects
- All rows in Section 1 legacy column (`page.tsx` stubs)
- `next.config.js` — imports `LEGACY_REDIRECTS`

### Scripts (new)
- `scripts/migrate-to-canonical-urls.mjs`
- `scripts/setup-p2-canonical-pages.mjs`
- `scripts/test-redirects.mjs`
- `scripts/verify-internal-links.mjs`
- `scripts/fix-press-imports.mjs`

### Bulk-updated (62 files via migration script)
- Navigation, components, committee pages, knowledge graph, SEO helpers, sitemap

**Git summary:** ~93 tracked files changed; ~40 new directories/files untracked.

---

## 8. SEO Impact Assessment

| Factor | Assessment |
|--------|------------|
| **Link equity** | Preserved — single-hop 308 redirects from all legacy URLs |
| **Indexation risk** | Low — canonical tags on all new pages; sitemap lists only canonical URLs |
| **Duplicate content** | Mitigated — legacy pages are redirect stubs, not duplicate HTML |
| **URL readability** | Improved — lowercase, hyphen-separated, descriptive press slugs |
| **Topic clustering** | Improved — `/departments/*`, `/press/*`, `/media/{edition}/{year}/{type}` |
| **Backlink compatibility** | Full — every documented legacy URL redirects |
| **Search Console action** | Submit updated sitemap after deploy; monitor Coverage for 3–4 weeks |

**Expected short-term effect:** Temporary redirect recognition period (Google treats 301/308 equivalently for GET). No ranking loss expected if redirects remain stable.

**Medium-term benefit:** Cleaner URL structure supports SMK 6.0 department silos, press article long-tail search, and hierarchical media archives.

---

## 9. Redirect Testing Results

### A. Config-level tests
`node scripts/test-redirects.mjs` — **PASS** (37 redirects, 0 chains, 0 issues)

### B. HTTP-level tests (production build on localhost:3000)

| Source | Expected destination | Status | Result |
|--------|---------------------|--------|--------|
| `/pastevent` | `/past-events` | 308 | PASS |
| `/upcomingevent` | `/upcoming-events` | 308 | PASS |
| `/ContactUs` | `/contact-us` | 308 | PASS |
| `/Best_Wishes` | `/best-wishes` | 308 | PASS |
| `/Wishes_Received` | `/wishes-received` | 308 | PASS |
| `/committeepage` | `/committees` | 308 | PASS |
| `/media` | `/media-center` | 308 | PASS |
| `/Press_Release` | `/press` | 308 | PASS |
| `/VibhagRoute/AcademicCouncil24` | `/departments/academic-council` | 308 | PASS |
| `/Press1` | `/press/baton-ceremony-smk-4` | 308 | PASS |
| `/academiccouncil` | `/departments/academic-council` | 308 | PASS |
| `/shikshamahakumbh2024digitalmedia` | `/media/shiksha-mahakumbh/2024/digital` | 308 | PASS |

**Canonical route 200 checks:** `/past-events`, `/contact-us`, `/media-center`, `/departments/academic-council`, `/press/baton-ceremony-smk-4` — all **200 OK**

### C. Build validation
`npm run build` — **PASS** (204 static pages generated)

### D. Internal link scan
`node scripts/verify-internal-links.mjs` — **PASS** (0 broken links)

### E. Sitemap validation
`GET /sitemap.xml` — 103 URLs, **0 legacy paths**

### F. Lighthouse validation
**Pending** — requires staging deploy or local Lighthouse CLI against production build. Recommend running on: `/`, `/past-events`, `/departments/academic-council`, `/media-center`, `/press` before production cutover.

---

## 10. Routes Intentionally Left Unchanged

| Route pattern | Reason |
|---------------|--------|
| `/registration/*` | External email links, payment callbacks, form bookmarks |
| `*datadekh` (admin data views) | Internal tooling; not public SEO |
| `/admin/*` | Admin panel |
| `/committee/*` (detail pages) | Existing indexed URLs; hub moved to `/committees` only |
| `/past_event/*` (edition slugs) | Long-standing event permalinks with external backlinks |
| `/merchandise` | Already canonical lowercase slug |
| Pillar content slugs (`/research`, `/publications`, etc.) | Already follow conventions |
| `/conclave`, `/shikshamahakumbh`, `/shikshakumbh` | Brand/event identity URLs |
| `/[locale]/ContactUs` | Locale routing preserved; English locale metadata points canonical to `/contact-us` |
| `/TalkShow`, `/Topics`, `/ResidentialCamp` | Mixed-case legacy; low SEO priority; no external migration requested |
| `/proceeding1`, `/proceeding2`, `/proceeding3` | Numbered proceedings; deferred to future P3 |

### Committee route review (recommendation deferred)
- **Current:** `/committee/shikshamahakumbh2025` etc.
- **Possible future:** `/committees/shiksha-mahakumbh/2025`
- **Decision:** Keep `/committee/*` for P2 to avoid breaking indexed committee URLs. Hub modernized to `/committees`.

### Press / media / event / conclave / initiative / publication review
- **Press:** Migrated (hub + articles) ✅
- **Media archives:** Migrated to hierarchical paths ✅
- **Events:** Hub slugs migrated; individual `/past_event/*` pages unchanged
- **Conclave:** `/conclave` unchanged (already clean)
- **Initiatives:** Pillar slugs unchanged
- **Publications:** `/publications`, `/proceedings`, `/journals` unchanged (already lowercase)

---

## Pre-Deploy Checklist

| Gate | Status |
|------|--------|
| Redirect config validation | ✅ Pass |
| HTTP redirect sampling | ✅ Pass (12/12) |
| Production build | ✅ Pass |
| Internal link scan | ✅ Pass (0 broken) |
| Sitemap — no legacy URLs | ✅ Pass |
| Lighthouse | ⏳ Pending staging run |
| Post-deploy Search Console sitemap submit | ⏳ After deploy |

---

## How to Re-Validate

```bash
cd rase
npm run build
npm run start
node scripts/test-redirects.mjs
node scripts/verify-internal-links.mjs
```

Then spot-check redirects:

```bash
curl -sI http://localhost:3000/pastevent
curl -sI http://localhost:3000/VibhagRoute/AcademicCouncil24
```

---

*Report generated after P2 implementation. See also `docs/P2_URL_MIGRATION_PLAN.md` for pre-implementation recommendations.*
