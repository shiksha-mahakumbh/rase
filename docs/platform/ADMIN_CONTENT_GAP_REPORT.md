# Admin Content Gap Report — Shiksha Mahakumbh 6.0

**Date:** June 2026 (Phase B.5 refresh)  
**Routes:** 173 pages · 52 Prisma models · 80+ v2 API routes  
**Rule:** `REGISTRATION_BACKEND=firebase` unchanged

---

## Summary

| Source | Routes est. | Admin editable today | Backend API ready |
|--------|------------:|---------------------:|------------------:|
| Hardcoded TSX/data files | ~120 (69%) | 0% | Partial |
| Firebase Firestore | ~15 (9%) | ~5% | N/A (legacy) |
| Supabase v2 API (no UI) | ~10 (6%) | API only | ✅ |
| Fully admin-managed | ~8 (5%) | ✅ | ✅ |
| Registration (Firebase) | ~12 (7%) | ✅ Admin portal | Firebase |

**Admin manageability score: 22/100** (up from 18/100 after Phase B backend)

---

## Legend

| Admin Edit? | Meaning |
|-------------|---------|
| **Yes** | Admin can manage via portal/API today |
| **Partial** | Some fields manageable; frontend still hardcoded |
| **API only** | v2 admin API exists; no admin UI |
| **No** | Requires code deploy to change |

---

## Phase B modules (backend ready, frontend not wired)

| Page / Feature | Route | Current source | Admin edit? | Supabase module | API |
|----------------|-------|----------------|-------------|-----------------|-----|
| Noticeboard | `/noticeboard` | Firebase `events` | Partial | `notices` | `/api/v2/notices` |
| Homepage widget | `/` section | Hardcoded `NoticeBoard.tsx` | No | `notices` | `?widget=true` |
| Homepage CMS | `/` | 15 hardcoded sections | API only | `pages` + sections | `/api/v2/homepage` |
| Downloads | — (no page) | None | API only | `downloads` | `/api/v2/downloads` |
| Site settings | Footer/header | Hardcoded | API only | `site_settings` | `/api/v2/settings` |
| Navigation | NavBar | `NAV_MENUS` constant | API only | `menus` | `/api/v2/menus` |
| Announcement bar | Modal + ticker | Hardcoded | API only | `announcement_bars` | `/api/v2/announcement-bars` |
| Visitor counter | Footer | Was Firebase (broken) | API only | `visitor_sessions` | `/api/visitors` |
| SEO metadata | All pages | Static `layout.tsx` | API only | `seo_metadata` | `/api/v2/seo/*` |
| Media library | Various | `/public` + Firebase | API only | `media_assets` | `/api/v2/admin/media-library` |

---

## Homepage sections gap matrix

| Section | File | Source | Admin? | Required module |
|---------|------|--------|--------|-----------------|
| Hero | `HeroSection.tsx` | Hardcoded | API only | Homepage CMS `hero` |
| Trust strip | `TrustStrip.tsx` | `tokens.ts` | No | Homepage CMS `stats` |
| Announcements | `Annoucement.tsx` | Hardcoded accordion | No | `announcement_bars` or homepage |
| Notice widget | `NoticeBoard.tsx` | 5 static items | No | `notices` |
| Why attend | `WhyAttendSection.tsx` | Hardcoded cards | No | Homepage CMS `content` |
| Timeline | `MovementTimelineSection.tsx` | `authority.ts` | No | Homepage CMS |
| Event tracks | `EventTracksSection.tsx` | `tracks.ts` | No | Homepage CMS `featured_programs` |
| Upcoming events | `UpcomingEvent.tsx` | Hardcoded 2026/2027 | No | `events` (Phase C) |
| Testimonials | `TestimonialsSection.tsx` | 3 static quotes | No | Homepage CMS `testimonials` |
| Gallery | `GallerySection.tsx` | `slides-data.ts` | No | `media_assets` + CMS |
| Partners | `Conference_Support.tsx` | 23 logo paths | No | Homepage CMS `partners` |
| Media partners | `Media_Partners.tsx` | Hardcoded | No | `partners` (Phase C) |
| Sponsors | `organiger.tsx` | Hardcoded images | No | `sponsors` (Phase C) |
| FAQ | `HomeFaqSection.tsx` | 5 Q&As | No | `faqs` (Phase D) |
| Venue/travel | `VenueTravelSection.tsx` | Hardcoded | No | Homepage CMS `cta` |
| Marquee ticker | `Marquees.tsx` | Hardcoded | No | `announcement_bars` |

---

## Content pages by category

### Committees (8 routes) — **No admin UI**

| Route | Source | Admin? | Module needed |
|-------|--------|--------|---------------|
| `/committees` | `committee-editions.ts` | No | `committees` Phase C |
| `/committee/shikshamahakumbh202*` | Inline page arrays | No | `committee_members` Phase C |
| `/committee/shikshakumbh202*` | Inline page arrays | No | Same |

### Events (22 routes) — **No admin UI**

| Route | Source | Admin? | Module needed |
|-------|--------|--------|---------------|
| `/events`, `/upcoming-events` | TSX + data files | No | `events` Phase C |
| `/past-events`, `/past_event/*` | Edition components | No | `events` archived |
| `/workshops`, `/summits`, `/conferences` | Catalog constants | No | `events` |
| `/conclave` | Hardcoded | No | `events` |

### Press & media (32 routes) — **No admin UI**

| Route | Source | Admin? | Module needed |
|-------|--------|--------|---------------|
| `/press/*` (9 articles) | Per-file `page.tsx` | No | `media_center` Phase D |
| `/Press1-9` | Legacy duplicates | No | Deprecate → CMS |
| `/media/*` archives | Static data | No | `event_media` Phase D |
| `/videos`, `/gallery` | Hardcoded | No | `media_assets` |

### Registration (12 routes) — **Yes (Firebase)**

| Route | Source | Admin? | Notes |
|-------|--------|--------|-------|
| `/registration/*` | Firebase + forms | **Yes** | Do not migrate yet |
| `/admin/registrations` | Admin portal | **Yes** | Active |

### Speakers & partners — **No admin UI**

| Route | Source | Admin? | Module |
|-------|--------|--------|--------|
| `/keynotespeakers` | Hardcoded | No | `speaker_profiles` Phase C |
| Partner sections | Homepage TSX | No | `partners` Phase C |

---

## Analytics & settings (Phase B.5)

| Feature | Source | Admin? | API |
|---------|--------|--------|-----|
| Visitor counter | Supabase (Phase B.5) | API only | `/api/v2/admin/analytics/*` |
| Traffic sources | Supabase sessions | API only | Dashboard widgets |
| Download tracking | Supabase | API only | `download_count` field |
| Site settings | Default seed | API only | `/api/v2/admin/settings` |

---

## Dual-source conflicts (must resolve before cutover)

| Content | Source A | Source B | Resolution |
|---------|----------|----------|------------|
| Notices | Homepage static (5) | Firebase `/noticeboard` | Wire both to `/api/v2/notices` |
| Visitor count | Firebase (broken) | Supabase (Phase B.5) | ✅ Migrated to Supabase |
| Announcements | Modal hardcoded | `announcement_bars` table | Wire `ClientChrome` modal |
| Navigation | `NAV_MENUS` | `menus` table | Wire `NavBar.tsx` |

---

## Recommended wiring order (post-audit)

1. **Visitor counter** — ✅ Done (Phase B.5)
2. **Noticeboard + homepage widget** — wire to `/api/v2/notices`
3. **Homepage CMS** — wire `HomePage.tsx` to `/api/v2/homepage`
4. **Announcement bar** — replace modal/ticker
5. **Site settings + navigation** — wire header/footer
6. **Downloads page** — create `/downloads` + admin UI
7. **Phase C** — committees, events, speakers (after approval)

---

## Admin manageability score by section

| Section | Score /100 |
|---------|----------:|
| Registration | 85 |
| Analytics (B.5) | 70 (API only) |
| CMS foundation (A+B) | 45 (API only) |
| Homepage | 5 |
| Notices | 15 |
| Events | 0 |
| Committees | 5 (API exists, no UI) |
| Press/Media | 0 |
| Settings/Nav | 30 (API only) |

**Weighted overall: 22/100**
