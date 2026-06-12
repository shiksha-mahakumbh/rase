# CMS Expansion Master Plan — Shiksha Mahakumbh

**Date:** June 2026 (Phase B.5)  
**Current models:** 58 (incl. 6 analytics tables)  
**Target:** 90%+ admin-manageable content

---

## Module status matrix

| Entity | DB model | Service | Public API | Admin API | Admin UI | Frontend wired |
|--------|----------|---------|------------|-----------|----------|----------------|
| **Pages CMS** | ✅ `pages` | ✅ | ✅ | ✅ | ❌ | ❌ |
| **SEO metadata** | ✅ | ✅ | ✅ | ✅ | ❌ | ❌ |
| **Media library** | ✅ | ✅ | partial | ✅ | ❌ | ❌ |
| **Notices** | ✅ | ✅ | ✅ | ✅ | ❌ | ❌ |
| **Notice categories** | ✅ | ✅ | ✅ | ✅ | ❌ | ❌ |
| **Homepage CMS** | ✅ (pages) | ✅ | ✅ | ✅ | ❌ | ❌ |
| **Downloads** | ✅ | ✅ | ✅ | ✅ | ❌ | ❌ |
| **Site settings** | ✅ | ✅ | ✅ | ✅ | ❌ | ❌ |
| **Navigation menus** | ✅ | ✅ | ✅ | ✅ | ❌ | ❌ |
| **Announcement bars** | ✅ | ✅ | ✅ | ✅ | ❌ | ❌ |
| **Visitor analytics** | ✅ | ✅ | ✅ | ✅ | ❌ | partial |
| Committees | ✅ Phase 3 | ✅ | ❌ | ✅ | ❌ | ❌ |
| Committee members | ✅ | ✅ | ❌ | ✅ | ❌ | ❌ |
| Events | ✅ | ✅ | partial | ✅ | ❌ | ❌ |
| Event media | ✅ | ✅ | ❌ | ✅ | ❌ | ❌ |
| Speakers | ✅ `speaker_profiles` | ❌ | ❌ | ❌ | ❌ | ❌ |
| Partners | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ |
| Sponsors | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ |
| Testimonials | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| FAQs | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| Press/News | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| Gallery albums | partial (`event_media`) | partial | ❌ | partial | ❌ | ❌ |
| Videos | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| Contact offices | partial (`site_settings`) | ✅ | ✅ | ✅ | ❌ | ❌ |
| State coordinators | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| Organizing team | partial (committees) | partial | ❌ | partial | ❌ | ❌ |
| Event schedule | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| Venue info | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| Accommodation info | partial | partial | ❌ | partial | ❌ | ❌ |
| Popups | partial (`announcement_bars`) | ✅ | ✅ | ✅ | ❌ | ❌ |
| Footer links | partial (`menus`) | ✅ | ✅ | ✅ | ❌ | ❌ |
| Social links | partial (`site_settings`) | ✅ | ✅ | ✅ | ❌ | ❌ |
| Hero banners | partial (homepage sections) | ✅ | ✅ | ✅ | ❌ | ❌ |
| Brochures | partial (`downloads`) | ✅ | ✅ | ✅ | ❌ | ❌ |
| Exhibitors | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| Keynote speakers | partial (`speaker_profiles`) | ❌ | ❌ | ❌ | ❌ | ❌ |
| Research board | partial (committees) | partial | ❌ | partial | ❌ | ❌ |
| Advisory board | partial (committees) | partial | ❌ | partial | ❌ | ❌ |

---

## Remaining entities to build

### Phase C — Organization (paused pending approval)

| Entity | New tables | Priority |
|--------|------------|----------|
| Committee editions | `committee_editions` | P0 |
| Committee enhancements | extend `committee_members` | P0 |
| Speaker management | service + APIs on `speaker_profiles` | P1 |
| Partner management | service + APIs on `partners` | P1 |
| Sponsor management | service + APIs on `sponsors` | P1 |
| Exhibitor registry | `exhibitors` (new) | P2 |
| State coordinators | `state_coordinators` (new) | P2 |

### Phase D — Content & media

| Entity | New tables | Priority |
|--------|------------|----------|
| Testimonials | `testimonials` | P1 |
| FAQ system | `faqs`, `faq_categories` | P1 |
| Press releases | `press_articles` | P0 |
| News | `news_items` | P1 |
| Gallery albums | `gallery_albums`, `gallery_items` | P1 |
| Videos | `video_items` | P2 |
| Media center hub | aggregate APIs | P1 |

### Phase E — Events & logistics

| Entity | New tables | Priority |
|--------|------------|----------|
| Event schedule | `event_sessions`, `event_schedule` | P1 |
| Venue information | `venues` | P2 |
| Accommodation CMS | extend `accommodation` content | P2 |
| Featured programs | homepage section or `programs` table | P1 |

### Phase F — Admin portal UI

| Module | Depends on | Priority |
|--------|------------|----------|
| Content editor (WYSIWYG) | Pages CMS | P0 |
| Notice manager UI | Phase B API | P0 |
| Homepage section editor | Phase B API | P0 |
| Media library UI | Phase A API | P0 |
| Analytics dashboard UI | Phase B.5 API | P0 |
| Menu builder UI | Phase B API | P1 |
| SEO manager UI | Phase A API | P1 |
| Download manager UI | Phase B API | P1 |
| Committee manager UI | Phase C API | P1 |

---

## Schema growth projection

| Phase | Models | Cumulative |
|-------|-------:|----------:|
| Current (B.5) | 58 | 58 |
| Phase C | +4 | 62 |
| Phase D | +8 | 70 |
| Phase E | +5 | 75 |
| Phase F (analytics events) | +2 | 77 |

---

## Frontend wiring roadmap

```
Phase B.5 ✅ Analytics counter + page tracker
    ↓
Wire batch 1 (P0):
  - /noticeboard → /api/v2/notices
  - Homepage → /api/v2/homepage
  - Footer counter → /api/visitors (Supabase) ✅
  - Announcement modal → /api/v2/announcement-bars
    ↓
Wire batch 2 (P1):
  - NavBar → /api/v2/menus?type=header
  - Footer → /api/v2/settings + menus
  - /downloads page → /api/v2/downloads
  - generateMetadata from /api/v2/seo
    ↓
Phase C backend + UI:
  - Committees, speakers, partners
    ↓
Phase D:
  - Press, testimonials, FAQ, gallery
    ↓
Firebase cutover (only after dual-write verification)
```

---

## Success criteria

| Metric | Current | Target |
|--------|--------:|-------:|
| Admin-manageable content | 22% | 90%+ |
| Hardcoded homepage sections | 15/15 | 0/15 |
| Dual content sources | 4 conflicts | 0 |
| Pages with CMS SEO | 0 | 145+ |
| Analytics coverage | Phase B.5 | Full funnel |

---

## Next phase recommendation

**Do NOT start Phase C yet.**

**Recommended: Phase B.6 — Frontend Wiring Sprint**

Wire existing Supabase APIs to public pages (notices, homepage, settings, menus, downloads, SEO) before building more backend modules. This delivers visible admin value and resolves dual-source conflicts with minimal risk to registration.

After B.6 stabilizes on staging → approve Phase C (Committee, Events, Speakers).
