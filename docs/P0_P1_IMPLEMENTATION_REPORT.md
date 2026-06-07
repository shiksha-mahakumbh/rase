# P0 & P1 Route Audit Implementation Report

**Date:** 29 May 2026  
**Status:** Complete — P2 prepared only (not implemented)  
**Verification:** `npm run lint` ✓ · `npm run build` ✓ · `node scripts/verify-internal-links.mjs` ✓ (0 broken)

---

## 1. P0 Fixes Completed

### Broken link repairs

| Issue | Fix | File |
|-------|-----|------|
| `/comingsoon` → 404 (3 instances) | Changed to `/Wishes_Received` | `src/app/component/Best_Wishes.tsx` |
| `/about` → 404 | Changed to `/introduction` | `src/app/component/Merchandise.tsx` |
| `/academicconclave` → 404 (discovered in regression) | Changed to `/conclave` | `src/app/summits/page.tsx` |

### Shiksha Mahakumbh 5.0 Committee Page

**Root cause:** Committee content existed as a **misplaced file** (`src/app/committee/shikshamahakumbh2025` without `page.tsx` directory structure) — Next.js could not route it.

**Resolution:**

- Removed misplaced file
- Created `src/app/committee/shikshamahakumbh2025/page.tsx` using `CommitteeDetailShell` + `CommitteeMemberSection` (consistent with SMK 2023/2024 pages)
- Created `src/app/committee/shikshamahakumbh2025/layout.tsx` with `committeeYearMeta`, `BreadcrumbJsonLd`, canonical `/committee/shikshamahakumbh2025`
- Preserved all committee member data from the legacy file
- Mobile-responsive shared committee components
- Accessible section headings and table/card layouts from `CommitteeMemberSection`

---

## 2. P1 Fixes Completed

### Academic Council Consolidation

| Action | Detail |
|--------|--------|
| **Canonical route** | `/VibhagRoute/AcademicCouncil24` (unchanged) |
| **301 redirect** | `/academiccouncil` → `/VibhagRoute/AcademicCouncil24` in `next.config.js` |
| **Server redirect** | `src/app/academiccouncil/page.tsx` now calls `redirect()` as belt-and-suspenders |
| **Internal links** | `src/app/summits/page.tsx` — Academic Council link updated to canonical |
| **Knowledge graph** | Removed `/academiccouncil` from `content-map.ts`, `authority-map.ts`, `education-pillars.ts` |
| **Nav / footer** | Already pointed to canonical (no change required) |
| **Sitemap** | Already listed canonical Vibhag route (no duplicate) |

### Sitemap Expansion

**Before:** 64 URLs  
**After:** **103 URLs** (+39)

#### Newly indexed routes

| Category | Routes added |
|----------|--------------|
| Committee detail | 5 pages (`committee/shikshamahakumbh2023` … `shikshamahakumbh2025`) |
| Press articles | `Press1`–`Press9` |
| Media archives | 8 digital/print archive pages |
| Workshops | 3 `past_event/*` workshop pages |
| Public info | `videos`, `conclave`, `books`, `noticeboard`, `paper`, `fulllengthpaper`, `keynotespeakers`, `shikshamahakumbh`, `shikshakumbh`, `TalkShow`, `Topics`, `proceeding1/2/3` |

Priority tiers added in `sitemap.ts`: committee `0.5`, press/archives `0.4`, noticeboard `weekly` frequency.

### Metadata Updates

| Area | Change |
|------|--------|
| Media archives (8 routes) | New `src/lib/seo/mediaArchives.ts` + `layout.tsx` per archive with title, description, OG, Twitter, canonical via `createPageMetadata` |
| Committee SMK 5.0 | `committeeYearMeta` + breadcrumb JSON-LD in layout |
| Existing routes newly sitemap-listed | Already had layouts/metadata (`videos`, `conclave`, `Press1-9`, `proceeding1-3`, committee 2023/2024, workshops) |

---

## 3. Redirects Added

```js
// next.config.js
{ source: "/academiccouncil", destination: "/VibhagRoute/AcademicCouncil24", permanent: true }
```

Plus existing datadekh copy-URL redirects (unchanged).

---

## 4. Sitemap Additions

See Section 2. File: `src/app/sitemap.ts` — restructured with `COMMITTEE_PATHS`, `PRESS_ARTICLE_PATHS`, `MEDIA_ARCHIVE_PATHS`, `WORKSHOP_PATHS` constants.

---

## 5. Metadata Updates

- **8 new** media archive layouts with full SEO metadata
- **1 new** committee layout (SMK 5.0)
- All use existing `createPageMetadata` / `committeeYearMeta` pipeline (canonical URLs, Open Graph, Twitter cards)

---

## 6. Internal Links Corrected

| Link | Correction |
|------|------------|
| `/comingsoon` ×3 | → `/Wishes_Received` |
| `/about` | → `/introduction` |
| `/academiccouncil` | → `/VibhagRoute/AcademicCouncil24` |
| `/academicconclave` | → `/conclave` |

**Regression scan:** `scripts/verify-internal-links.mjs` — **126 internal links, 0 broken**

---

## 7. Remaining P2 Recommendations

Full plan: [`docs/P2_URL_MIGRATION_PLAN.md`](./P2_URL_MIGRATION_PLAN.md)

Summary (not implemented):

- `/pastevent` → `/past-events`
- `/upcomingevent` → `/upcoming-events`
- `/VibhagRoute/*` → `/departments/*`
- `/ContactUs` → `/contact`
- Press slug modernization
- Media archive hierarchy under `/media/...`

---

## 8. Files Modified

| File | Change |
|------|--------|
| `src/app/component/Best_Wishes.tsx` | Fix wishes links |
| `src/app/component/Merchandise.tsx` | Fix about link |
| `src/app/summits/page.tsx` | Fix academic council + conclave links |
| `src/app/academiccouncil/page.tsx` | Server-side redirect |
| `next.config.js` | 301 academic council redirect |
| `src/app/sitemap.ts` | +39 URLs (64→103), priority tiers |
| `src/lib/knowledge-graph/content-map.ts` | Remove legacy academic council; add committee routes |
| `src/lib/knowledge-graph/authority-map.ts` | Remove legacy academic council |
| `src/lib/knowledge-graph/entities/education-pillars.ts` | Canonical academic council routes |
| `src/app/committee/shikshamahakumbh2025/page.tsx` | **Created** |
| `src/app/committee/shikshamahakumbh2025/layout.tsx` | **Created** |
| `src/lib/seo/mediaArchives.ts` | **Created** |
| `src/app/*/layout.tsx` (8 media archives) | **Created** |
| `scripts/verify-internal-links.mjs` | **Created** |
| `docs/P2_URL_MIGRATION_PLAN.md` | **Created** |

**Deleted:** `src/app/committee/shikshamahakumbh2025` (misplaced single file)

---

## 9. Routes Affected

| Route | Status after P0/P1 |
|-------|-------------------|
| `/comingsoon` | No longer linked (was 404) |
| `/about` | No longer linked (was 404) |
| `/committee/shikshamahakumbh2025` | **Active** — new proper page |
| `/academiccouncil` | **Redirected** → canonical |
| `/academicconclave` | No longer linked (was 404) |
| 39 routes | **New sitemap entries** |

---

## 10. SEO Improvements Achieved

1. **Zero broken internal links** across scanned navigation (header, footer, data-driven `link:` fields, CTAs)
2. **+39 indexable URLs** in `sitemap.xml` for crawlers (64 → 103)
3. **Duplicate academic council content** consolidated to single canonical with 301
4. **SMK 5.0 committee** discoverable with metadata, breadcrumbs, and sitemap entry
5. **Media archive pages** now have dedicated titles, descriptions, and canonical tags
6. **Tiered sitemap priorities** — registration/home highest; archives/press at appropriate lower tiers

---

## Verification Commands

```bash
cd rase
node scripts/verify-internal-links.mjs   # expect brokenCount: 0
npm run lint
npm run build
```

---

*P2 URL renames deferred per approval. See `P2_URL_MIGRATION_PLAN.md` when ready to proceed.*
