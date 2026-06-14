# Legacy Content Inventory — Phase 5B

**Date:** 2026-05-29  
**Scope:** Post–Phase 5A brand consolidation; edition-based media normalization

## Edition Mapping (Canonical)

| Legacy code | Edition | Year | Media path prefix |
|-------------|---------|------|-------------------|
| SM23 | 1.0 | 2023 | `/media/shiksha-mahakumbh/1.0/` |
| SK23 | 2.0 | 2023 | `/media/shiksha-mahakumbh/2.0/` |
| SK24 | 3.0 | 2024 | `/media/shiksha-mahakumbh/3.0/` |
| SM24 | 4.0 | 2024 | `/media/shiksha-mahakumbh/4.0/` |
| SM25 | 5.0 | 2025 | (past event page only) |
| Upcoming | 6.0 | 2026 | `/upcoming-events` |

Single source of truth: `src/data/past-editions.ts`

---

## Removed in Phase 5B

| File | Reason |
|------|--------|
| `src/app/component/Content.tsx` | Unreferenced; dual-brand legacy prose |
| `src/app/component/MediaTree.tsx` | Unreferenced duplicate of Glimpses data; year-based `/media/shiksha-kumbh/*` links |

---

## Redirect Stubs Updated

Legacy flat routes now 301 to edition-based media URLs:

| Stub route | Destination |
|------------|-------------|
| `/printmediashikshamahakumbh2023` | `/media/shiksha-mahakumbh/1.0/print` |
| `/printmediashikshamahakumbh2024` | `/media/shiksha-mahakumbh/4.0/print` |
| `/printmediashikshakumbh2023` | `/media/shiksha-mahakumbh/2.0/print` |
| `/printmediashikshakumbh2024` | `/media/shiksha-mahakumbh/3.0/print` |
| `/shikshamahakumbh2023digitalmedia` | `/media/shiksha-mahakumbh/1.0/digital` |
| `/shikshamahakumbh2024digitalmedia` | `/media/shiksha-mahakumbh/4.0/digital` |
| `/shikshakumbh2023digitalmedia` | `/media/shiksha-mahakumbh/2.0/digital` |
| `/shikshakumbh2024digitalmedia` | `/media/shiksha-mahakumbh/3.0/digital` |

Year-based paths (`/media/shiksha-mahakumbh/2023/*`, `/media/shiksha-kumbh/2024/*`, etc.) redirect via `legacy-redirects.js`.

---

## Intentionally Retained Legacy References

### Press citation archives (Edition 2.0 digital)

`ShikshaKumbh2023DigitalMedia.tsx` — historical press headlines and URLs from 2023 news coverage. Per policy: **"Shiksha Kumbh" only in archived press citations**, not in nav/cards/SEO headings.

### Committee legacy slugs

Committee pages retain year-based URL slugs (`/committee/shikshakumbh2023`, etc.) for bookmark compatibility. Titles in `committee-editions.ts` and content-map use edition numbers (SMK 1.0–5.0).

### Social / external URLs

Facebook/Instagram handles (`shikshamahakumbh`) — external platform identifiers, not site routes.

### Past event route folders

`/past_event/sm23`, `/sk23`, `/sk24`, `/sm24`, `/sm25` — stable deep links; page components derive titles from `PAST_EDITIONS`.

---

## Normalized in Phase 5B

| Area | Change |
|------|--------|
| Media archive keys | Edition segments (`1.0`–`4.0`) in `media-archive-keys.ts` |
| `MEDIA_ARCHIVE_ITEMS` | Derived from `PAST_EDITIONS` via `editionMediaItem()` |
| `authority.ts` | `pastEditions` from `buildAuthorityPastEditions()` |
| Feedback form | Event options `smk-1.0` … `smk-6.0` from `PAST_EDITIONS` |
| Print/digital archive headings | Edition numbers (1.0, 4.0) not calendar years |
| `/abhiyan` timeline | `UPCOMING_EDITION` from SSOT |
| Knowledge graph links | Edition-based media paths |
| SEO media metadata | `lib/seo/mediaArchives.ts` edition paths |

---

## Deferred / Out of Scope (Phase 5B)

| Item | Notes |
|------|-------|
| Registration forms (`OrganizerReg`, `AccomodationReg`, `Single_Registration`) | Still reference calendar years in some dropdowns; functional, not user-facing nav |
| Committee slug renames | Would break external links; edition labels already in UI |
| `ShikshaKumbh2023DigitalMedia` press text | Historical citations — do not rewrite |
