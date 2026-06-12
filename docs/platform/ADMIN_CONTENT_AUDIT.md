# Admin Content Audit — Shiksha Mahakumbh 6.0

**Date:** June 2026  
**Status:** Audit complete — migration paused pending approval  
**Scope:** 173 `page.tsx` routes · Firebase + static data + inline TSX  
**Rule:** No production changes during this phase · `REGISTRATION_BACKEND=firebase`

---

## Executive summary

| Metric | Count |
|--------|------:|
| Total public routes | ~145 (excl. admin/datadekh/legacy redirects) |
| Fully admin-manageable today | ~8% (registrations, partial noticeboard, partial speakers) |
| Firebase-managed (fragmented) | ~12% |
| Hardcoded (TSX / data files) | ~80% |
| Prisma API exists, no public UI | Downloads (`/api/v2/downloads`) |

**Critical gaps:** Dual noticeboard (homepage static vs Firebase live), committee rosters in code, press articles per-file, no homepage CMS, no FAQ CMS, no partner/sponsor CMS, empty entity directories.

---

## Content source legend

| Source | Admin today? | Target |
|--------|--------------|--------|
| TSX inline | No | CMS tables |
| `src/data/*.ts` | No | CMS + import scripts |
| Firebase Firestore | Partial (manual console) | Supabase + Admin Portal |
| `/api/v2/*` Prisma | Admin API only | Full Admin UI |
| `/public/*` static assets | No (deploy required) | Supabase Storage |

---

## Section 1 — Homepage (`/`)

| Page | Route | Current source | Hardcoded content | Admin? | Table | API | SEO |
|------|-------|----------------|-------------------|--------|-------|-----|-----|
| Homepage | `/` | `HomePage.tsx` + 15 section components | Hero, stats, announcements, notices, tracks, events, testimonials, partners, sponsors, FAQ | **Yes** | `homepage_sections`, `homepage_stats`, `faqs`, `testimonials`, `partners`, `sponsors` | `/api/v2/cms/homepage` | Per-section `seo_metadata` |

**Per-section detail:**

| Section | File | Hardcoded examples | Admin priority |
|---------|------|-------------------|----------------|
| Hero | `HeroSection.tsx` | Hindi tagline, NEP 2020, dates, venue, CTAs | P0 |
| Trust strip | `TrustStrip.tsx` | `impactStats` from `design/tokens.ts` | P0 |
| Announcements | `Annoucement.tsx` | 2 programme lines | P1 |
| Notice widget | `NoticeBoard.tsx` | **5 static notices** (diverges from `/noticeboard`) | P0 |
| Why attend | `WhyAttendSection.tsx` | 6 feature cards | P1 |
| Timeline | `MovementTimelineSection.tsx` | `data/authority.ts` | P1 |
| Event tracks | `EventTracksSection.tsx` | `content/academic-council/tracks.ts` | P1 |
| Upcoming events | `UpcomingEvent.tsx` | SMK 2026 NIT Hamirpur, SMK 2027 IIT Jammu | P0 |
| Testimonials | `TestimonialsSection.tsx` | 3 anonymous quotes | P1 |
| Gallery | `GallerySection.tsx` | `slides-data.ts` | P1 |
| Partners | `Conference_Support.tsx` | 23 logo paths | P1 |
| Media partners | `Media_Partners.tsx` | 3 outlets + URLs | P1 |
| Sponsors | `organiger.tsx` | 10 images (mislabeled IIT Ropar) | P1 |
| FAQ | `HomeFaqSection.tsx` | 5 Q&As | P1 |
| Venue/travel | `VenueTravelSection.tsx` | NIT Hamirpur logistics | P2 |

---

## Section 2 — Notice Board

| Page | Route | Current source | Hardcoded | Admin? | Table | API | SEO |
|------|-------|----------------|-----------|--------|-------|-----|-----|
| Noticeboard | `/noticeboard` | Firestore `events` + `NoticeboardClient.tsx` | Hero copy | **Partial** | `notices` (new) | `/api/v2/notices` | Yes |
| Notice upload | `/noticeboarddata` | Firebase admin page | — | Replace with Admin Portal | `notices` | `/api/v2/admin/notices` | — |
| Homepage widget | `/` (section) | Static TSX | 5 notices | **Yes** | `notices` (pinned feed) | `GET /api/v2/notices?pinned=true` | — |

**Required notice fields:** title, slug, category, description, attachment, priority, publishDate, expiryDate, isPinned, status, PDF/circular/office-order types.

---

## Section 3 — Committees

| Page | Route | Current source | Hardcoded | Admin? | Table | API | SEO |
|------|-------|----------------|-----------|--------|-------|-----|-----|
| Committee hub | `/committees` | `committee-editions.ts` + `CommitteeTree.tsx` | Edition timeline | **Yes** | `committees`, `committee_editions` | `/api/v2/admin/committees` | Yes |
| SMK 2023–2025 | `/committee/shikshamahakumbh20*` | Inline `page.tsx` arrays | Full rosters (names, designations) | **Yes** | `committees`, `committee_members` | Exists (Phase 3) | Per-edition |
| SK 2023–2024 | `/committee/shikshakumbh20*` | Inline arrays | Full rosters | **Yes** | Same | Same | Same |

**Member fields needed:** photo, designation, bio, social links, display_order, is_active.  
**Categories:** Organizing, Advisory, Academic, Research, Media, International Advisory, Hospitality, Volunteer, Sponsorship, Exhibition.

---

## Section 4 — Events

| Page | Route | Current source | Hardcoded | Admin? | Table | API | SEO |
|------|-------|----------------|-----------|--------|-------|-----|-----|
| Events hub | `/events` | `conference-catalog.ts` | Event type cards | **Yes** | `events` | `/api/v2/admin/events` | Yes |
| Upcoming | `/upcoming-events` | `UpcomingEvent.tsx` | SMK 2026/2027 | **Yes** | `events` | Same | Event JSON-LD |
| Past events | `/past-events` | `past-editions.ts` | Edition cards | **Yes** | `events` (archived) | Same | Yes |
| Past detail | `/past_event/sm23` etc. | Edition components | Full edition narrative | **Yes** | `events` + `event_content_blocks` | Same | Yes |
| Workshops | `/workshops` | `WORKSHOP_ARCHIVE` | Workshop list | **Yes** | `events` (type=workshop) | Same | Yes |
| Conferences | `/conferences` | Knowledge-graph hub | Catalog metadata | **Yes** | `events` | Same | Yes |
| Summits | `/summits` | `SUMMITS_HUB` | Summit list | **Yes** | `events` | Same | Yes |
| SMK / SK pages | `/shikshamahakumbh`, `/shikshakumbh` | Inline slides | Edition promos | **Yes** | `events` | Same | Yes |

**Event types:** Mahakumbh, Conclave, Workshop, Webinar, Training, Competition, School Event, Cultural, Startup Showcase, Exhibition.

---

## Section 5 — Media Center

| Page | Route | Current source | Hardcoded | Admin? | Table | API | SEO |
|------|-------|----------------|-----------|--------|-------|-----|-----|
| Media center | `/media-center` | `media-archives.ts` | Edition navigation | **Yes** | `media_items`, `media_albums` | `/api/v2/admin/media` | Yes |
| Press hub | `/press` | `Press.tsx` `cardData` | 6 article cards | **Yes** | `press_articles` | `/api/v2/admin/press` | Article meta |
| Press articles | `/press/*` (9 pages) | Per-page inline `data` | Full article bodies | **Yes** | `press_articles` | Same | Article JSON-LD |
| Gallery | `/gallery` | `past-editions.ts` tree | Edition tree | **Yes** | `media_albums` | `/api/v2/media/gallery` | Yes |
| Videos | `/videos` | `VideoPage` | Video embeds | **Yes** | `media_items` (video) | Same | Yes |
| Glimpses | `/glimpses` | Archive showcase | Image sets | **Yes** | `media_albums` | Same | Yes |
| Media archives | `/media/[edition]/[year]/[type]` | `media-archive-components.tsx` | Per-edition clippings | **Yes** | `media_items` | Same | Yes |

**Media types:** News, Press Release, Coverage, Video, Interview, Podcast, Photo Gallery.

---

## Section 6 — Downloads

| Page | Route | Current source | Hardcoded | Admin? | Table | API | SEO |
|------|-------|----------------|-----------|--------|-------|-----|-----|
| Proceedings | `/proceedings` | `Proceedings.tsx` | 3 PDF paths | **Yes** | `downloads` | `/api/v2/downloads` | Yes |
| Proceeding readers | `/proceeding1-3` | `proceeding1-data.ts` | Reader content | **Optional** | `downloads` + `content_blocks` | Same | Yes |
| Books | `/books` | `Books.tsx` | Long book description | **Yes** | `downloads` | Same | Yes |
| Reports | `/reports` | `publication-catalog.ts` | Catalog metadata | **Yes** | `downloads` | Same | Yes |
| Public downloads hub | — | **Missing page** | — | **Yes** | `downloads` | `GET /api/v2/downloads` (exists) | Yes |

**Download types:** Brochures, Reports, Guidelines, Circulars, Posters, Presentations, Proceedings, Event documents. Features: versioning, counter, expiry.

---

## Section 7 — Testimonials & Wishes

| Page | Route | Current source | Hardcoded | Admin? | Table | API | SEO |
|------|-------|----------------|-----------|--------|-------|-----|-----|
| Homepage testimonials | `/` section | `TestimonialsSection.tsx` | 3 quotes | **Yes** | `testimonials` | `/api/v2/admin/testimonials` | — |
| Best wishes | `/best-wishes` | `PAST_EDITIONS` timeline | Edition timeline | **Yes** | `testimonials` or `wishes` | Same | Yes |
| Wishes received | `/wishes-received` | Hardcoded dignitaries + Firebase `wishesReceived` | 10+ VIP entries | **Yes** | `testimonials` | `/api/v2/admin/wishes` | Yes |

---

## Section 8 — Partners & Sponsors

| Page | Route | Current source | Hardcoded | Admin? | Table | API | SEO |
|------|-------|----------------|-----------|--------|-------|-----|-----|
| Academic partners | `/` `Conference_Support.tsx` | 23 logo paths | **Yes** | `partners` | `/api/v2/admin/partners` | — |
| Media partners | `/` `Media_Partners.tsx` | 3 outlets | **Yes** | `partners` (category=media) | Same | — |
| Sponsors | `/` `organiger.tsx` | 10 sponsor images | **Yes** | `sponsors` | `/api/v2/admin/sponsors` | — |
| Institutions | `/institutions` | Empty knowledge-graph | Placeholder | **Yes** | `partners` | Same | Yes |

**Partner categories:** University, School, NGO, Government, Industry, International.

---

## Section 9 — Speakers

| Page | Route | Current source | Hardcoded | Admin? | Table | API | SEO |
|------|-------|----------------|-----------|--------|-------|-----|-----|
| Keynote speakers | `/keynotespeakers` | 4 hardcoded + Firebase `keynotespeakers1` | Names, bios, photos | **Partial** | `speaker_profiles` | `/api/v2/admin/speakers` | Person JSON-LD |
| Homepage highlights | `/` section | Category cards only | 4 categories | **Yes** | `speaker_profiles` (featured) | Same | — |
| Add speaker (legacy) | `/addkeynotespeaker` | Firebase form | Replace with Admin | `speaker_profiles` | Same | — |

**Speaker types:** Keynote, Session, Guest, International delegate. Fields: photo, bio, designation, social links, session assignment.

---

## Section 10 — Team

| Page | Route | Current source | Hardcoded | Admin? | Table | API | SEO |
|------|-------|----------------|-----------|--------|-------|-----|-----|
| Team (no route) | — | Committee + Vibhag pages | Member rosters with phone numbers | **Yes** | `team_members` | `/api/v2/admin/team` | — |
| Vibhag departments | `/departments/*` (5) | Inline member arrays | Names, positions, phones (PII) | **Yes** | `team_members` (by department) | Same | — |

**Team groups:** Core, Office, Technical, Volunteer Leads.

---

## Section 11 — FAQ

| Page | Route | Current source | Hardcoded | Admin? | Table | API | SEO |
|------|-------|----------------|-----------|--------|-------|-----|-----|
| FAQ (homepage only) | `/` `HomeFaqSection.tsx` | 5 Q&As | **Yes** | `faqs` | `/api/v2/admin/faqs` | FAQ JSON-LD |
| Standalone FAQ page | — | **Missing** | — | **Yes** | `faqs` | `GET /api/v2/faqs` | Yes |

---

## Section 12 — Contact

| Page | Route | Current source | Hardcoded | Admin? | Table | API | SEO |
|------|-------|----------------|-----------|--------|-------|-----|-----|
| Contact us | `/contact-us` | `DHE_ORGANIZATION` + Firebase form | Address, phones, emails | **Partial** | `contact_offices`, `contact_messages` | `/api/v2/contact` | Yes |
| Footer contact | Footer | `organization.ts` | Same org data | **Yes** | `contact_offices` | Admin CRUD | — |

---

## Section 13 — Registration (unchanged backend)

| Page | Route | Current source | Admin? | Notes |
|------|-------|----------------|--------|-------|
| Registration hub | `/registration` | `RegistrationHub.tsx` + Firebase | **Yes** (exists) | Do not change `REGISTRATION_BACKEND` |
| Success | `/registration/success` | API lookup | Read-only admin | — |
| Sub-routes | `/registration/*` | Redirects to hub | — | — |

**Excluded from CMS:** MultiTrack Conference, Abstract, Paper Submission (external CMT + existing flows untouched).

---

## Section 14 — Academic Council & Vibhag

| Page | Route | Current source | Hardcoded | Admin? | Table | API |
|------|-------|----------------|-----------|--------|-------|-----|
| Academic Council | `/departments/academic-council` | `AcademicCouncil24.tsx` + tabs | Programme descriptions, tracks | **Yes** | `programme_pages`, `content_blocks` | `/api/v2/admin/programmes` |
| Vitt/Prabandhan/Prachar/Sampark | `/departments/*` | Vibhag components | Member rosters, dept copy | **Yes** | `team_members`, `department_pages` | Same |

---

## Section 15 — Knowledge graph / SEO directories

| Page | Route | Current source | Admin? |
|------|-------|----------------|--------|
| People, educational-leaders | `/people`, `/educational-leaders` | Empty registry | **Yes** — populate from speakers/team |
| Universities, schools, research | Pillar pages | Knowledge-graph metadata | **Yes** — `entity_directory` |
| Introduction, knowledge hub | `/introduction`, `/knowledge` | Mixed static | **Yes** |

---

## Section 16 — Legal & policy

| Page | Route | Admin? | Table |
|------|-------|--------|-------|
| Privacy, terms, disclaimer, refund, cookies | `/privacy-policy` etc. | **Yes** (P2) | `legal_pages` |

---

## Priority matrix

| Priority | Modules | Rationale |
|----------|---------|-----------|
| **P0** | Notices, Homepage CMS, Events (upcoming), Contact offices, SEO metadata | Highest traffic + stale content risk |
| **P1** | Committees, Media/Press, Downloads hub, Speakers, Partners, FAQ, Testimonials | High maintenance burden |
| **P2** | Team/Vibhag, Past editions detail, Legal pages, Knowledge directories | Large content, lower change frequency |
| **P3** | Legacy redirect cleanup, i18n content | Post-CMS migration |

---

## Static data files to migrate

| File | Records | Target table |
|------|---------|--------------|
| `data/committee-editions.ts` | 5 editions | `committee_editions` |
| `data/past-editions.ts` | 10+ editions | `events` |
| `data/media-archives.ts` | Archive tree | `media_albums` |
| `data/authority.ts` | Stats + narrative | `homepage_stats`, `events` |
| `content/academic-council/tracks.ts` | Tracks | `programme_pages` |
| `design/tokens.ts` | Event facts | `system_settings` |
| `config/organization.ts` | Contact | `contact_offices` |
| `lib/knowledge-graph/conference-catalog.ts` | Event hubs | `events` |
| Press `page.tsx` files (9) | Full articles | `press_articles` |

---

## Firebase collections to consolidate

| Collection | Target Supabase table | Admin module |
|------------|----------------------|--------------|
| `events` (noticeboard) | `notices` | Notice Board |
| `keynotespeakers1` | `speaker_profiles` | Speakers |
| `wishesReceived` | `testimonials` | Wishes |
| `contactMessages` | `contact_messages` | Contact (exists) |
| Registration collections | `registrations` | Registrations (exists) |

---

## Approval gate

This audit must be approved before:
- Schema V2 migration
- Admin Portal UI expansion
- Phase 4 Firebase → Supabase data migration
- Production cutover

**Next documents:** `DATABASE_EXPANSION_PLAN.md`, `ADMIN_PANEL_EXPANSION_PLAN.md`, `SUPABASE_SCHEMA_V2.md`, `API_V2_EXPANSION.md`
