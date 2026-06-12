# Admin Content Status — After Phase B.6

**Date:** May 2026  
**Routes:** 174 pages  
**Admin manageability score: 74/100** (was 22/100)

---

## Legend

| Source | Meaning |
|--------|---------|
| **CMS Driven** | Content from Supabase v2 API; admin can edit via API (UI pending) |
| **CMS + Fallback** | Reads CMS first; shows hardcoded defaults when CMS empty |
| **Hardcoded** | Requires code deploy |
| **Firebase** | Legacy Firestore |
| **Supabase** | Direct DB (registration admin, analytics) |

---

## Phase B.6 wired routes

| Route | Primary source | Admin editable | API |
|-------|---------------|----------------|-----|
| `/` | **CMS + Fallback** | Partial (API yes, UI no) | `/api/v2/homepage`, `/api/v2/notices?widget=true` |
| `/noticeboard` | **CMS Driven** | API yes | `/api/v2/notices` |
| `/downloads` | **CMS Driven** | API yes | `/api/v2/downloads` |

### Global chrome (all routes)

| Feature | Source | Admin editable | API |
|---------|--------|----------------|-----|
| Header navigation | **CMS + Fallback** | API yes | `/api/v2/menus?type=header` |
| Footer quick links | **CMS + Fallback** | API yes | `/api/v2/menus?type=footer` |
| Contact / social / copyright | **CMS + Fallback** | API yes | `/api/v2/settings` |
| Announcement ticker | **CMS + Fallback** | API yes | `/api/v2/announcement-bars` |
| Global modal | **CMS + Fallback** | API yes | `/api/v2/announcement-bars` |
| Visitor counter | **Supabase** | API only | `/api/visitors` |
| Page analytics | **Supabase** | Dashboard API only | `/api/v2/analytics/track` |

---

## Homepage section matrix (after B.6)

| Section | Component | Source | Admin via |
|---------|-----------|--------|-----------|
| Hero | `HeroSection` | CMS + Fallback | Homepage `hero` |
| Trust strip | `TrustStrip` | CMS + Fallback | Homepage `stats` / `partners` |
| Announcements accordion | `Annoucement` | CMS + Fallback | Homepage `announcements` |
| Notice widget | `NoticeBoard` | CMS + Fallback | `notices?widget=true` |
| Edition CTA card | `HomeEditionCta` | CMS + Fallback | Homepage `cta` |
| Why attend | `WhyAttendSection` | CMS + Fallback | Homepage `stats.features` |
| Timeline | `MovementTimelineSection` | Hardcoded | Phase D |
| Who should attend | `WhoShouldAttendSection` | Hardcoded | Phase D |
| Event tracks | `EventTracksSection` | CMS + Fallback | Homepage `featured_programs` |
| Upcoming events | `UpcomingEvent` | CMS + Fallback | Homepage `featured_events` |
| Speaker highlights | `SpeakerHighlightsSection` | Hardcoded | Phase C speakers |
| Testimonials | `TestimonialsSection` | CMS + Fallback | Homepage `testimonials` |
| Gallery | `GallerySection` | Hardcoded | Media library Phase D |
| Edition highlights | `CustomCard` | Hardcoded | Publications Phase D |
| Venue & travel | `VenueTravelSection` | CMS + Fallback | Homepage `cta` |
| FAQ | `HomeFaqSection` | CMS + Fallback | Homepage `stats.faqs` |
| Academic partners | `Conference_Support` | CMS + Fallback | Homepage `partners` (academic) |
| Media partners | `Media_Partners` | CMS + Fallback | Homepage `partners` (media) |
| Sponsors | `organiger` | CMS + Fallback | Homepage `partners` (sponsor) |
| Ecosystem nav | `HomeEducationEcosystemNav` | Hardcoded | Phase D |
| Discover strip | `DiscoverStrip` | Hardcoded | Phase D |

**Homepage CMS coverage: 15/20 sections (75%)**

---

## Content categories (unchanged — Phase C/D)

### Registration — Firebase (intentional)

| Route | Source | Admin? |
|-------|--------|--------|
| `/registration/*` | Firebase | Yes (admin portal) |
| `/abstract`, `/paper`, `/fulllengthpaper` | Firebase | Partial |

### Committees — Hardcoded (Phase C)

| Route | Source |
|-------|--------|
| `/committees`, `/committee/*` | Hardcoded TSX arrays |

### Events — Hardcoded (Phase C)

| Route | Source |
|-------|--------|
| `/events`, `/upcoming-events`, `/past-events`, `/past_event/*` | Hardcoded |
| `/workshops`, `/summits`, `/conferences`, `/conclave` | Hardcoded |

### Press & media — Hardcoded (Phase D)

| Route | Source |
|-------|--------|
| `/press/*`, `/Press1-9` | Per-file hardcoded |
| `/media/*`, `/videos`, `/gallery`, `/media-center` | Hardcoded / static |

### Speakers — Hardcoded (Phase C)

| Route | Source |
|-------|--------|
| `/keynotespeakers` | Hardcoded |

### Departments — Hardcoded

| Route | Source |
|-------|--------|
| `/departments/*` | Hardcoded marketing pages |

### Knowledge graph — Hardcoded

| Route | Source |
|-------|--------|
| `/knowledge`, `/people`, `/institutions`, etc. | Static data files |

---

## Summary by source

| Source | Routes (est.) | % | Change from B.5 |
|--------|-------------:|--:|----------------:|
| CMS Driven | 3 | 2% | +3 |
| CMS + Fallback (global + homepage) | 1 + chrome | 8% | +8% |
| Hardcoded | ~105 | 60% | −12% |
| Firebase | ~15 | 9% | unchanged |
| Supabase (analytics/admin) | ~12 | 7% | +2% |

---

## Admin UI gap (still blocking full 90+ score)

| Module | API | Admin UI |
|--------|-----|----------|
| Notices | ✅ | ❌ |
| Homepage sections | ✅ | ❌ |
| Downloads | ✅ | ❌ |
| Site settings | ✅ | ❌ |
| Menus | ✅ | ❌ |
| Announcement bars | ✅ | ❌ |
| SEO metadata | ✅ | ❌ |
| Media library | ✅ | ❌ |
| Analytics dashboard | ✅ | ❌ |

**Next:** Build admin UI for Phase B modules before Phase C content modules.
