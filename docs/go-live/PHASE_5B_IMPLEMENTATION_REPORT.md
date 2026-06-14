# Phase 5B — Content, Media & Archive Normalization

**Date:** 2026-05-29  
**Status:** Complete  
**Depends on:** Phase 5A (brand consolidation), Phase 5A.1 (hardening audit)

## Summary

Phase 5B normalizes media URLs to edition-based paths, consolidates edition data into `past-editions.ts`, removes dead legacy components, and aligns UI headings with the unified **शिक्षा महाकुंभ** brand (editions 1.0–6.0).

## Deliverables

| # | Deliverable | Status |
|---|-------------|--------|
| 1 | Resolve Category B items from 5A.1 | Done |
| 2 | Edition-based media URLs `/media/shiksha-mahakumbh/{edition}/{type}` | Done |
| 3 | Consolidate `authority.ts` → `PAST_EDITIONS` | Done |
| 4 | Timeline consistency (`/abhiyan`, widgets) | Done |
| 5 | SEO normalization | Done |
| 6 | `docs/audit/legacy-content-inventory.md` | Done |
| 7 | Redirect validation + grep report | Done |

## Key File Changes

- **`src/data/past-editions.ts`** — `mediaArchivePath()`, `UPCOMING_EDITION`, `buildAuthorityPastEditions()`
- **`src/data/media-archive-keys.ts`** — edition keys `shiksha-mahakumbh/{1.0–4.0}/{digital|print}`
- **`src/data/media-archives.ts`** — `MEDIA_ARCHIVE_ITEMS` from SSOT
- **`src/constants/canonical-routes-media.ts`** — edition canonical map
- **`src/config/legacy-redirects.js`** — year-based → edition redirects (+47 total)
- **`src/app/component/Feedback.tsx`** — dynamic edition event options
- **8 legacy stub pages** — redirect targets updated to edition paths
- **Deleted:** `Content.tsx`, `MediaTree.tsx`

## Redirect Validation

```
node scripts/test-redirects.mjs
→ PASS (47 redirects, 0 issues)
```

## Grep Report — Legacy Brand Strings

| Pattern | Active UI/nav hits | Notes |
|---------|-------------------|-------|
| `Shiksha Kumbh` | 0 in nav/cards/SEO | Only in `ShikshaKumbh2023DigitalMedia.tsx` press citations (intentional) |
| `shiksha-kumbh` paths | 0 in components | Only in `legacy-redirects.js` as redirect sources |
| `shikshakumbh` / `shikshamahakumbh` routes | Redirect sources only | Hub pages → `/introduction` |
| `SM23`/`SK23`/etc. | Past event folders only | Component titles use edition numbers |

## Build

Run locally: `npm run build`  
(OneDrive `.next` EPERM may occur if dev server holds locks — stop dev server and retry.)

## Historical Content Policy

**"Shiksha Kumbh"** appears only in archived press citation data (Edition 2.0 digital media gallery). All current navigation, cards, headings, and SEO use **Shiksha Mahakumbh** / edition numbers.
