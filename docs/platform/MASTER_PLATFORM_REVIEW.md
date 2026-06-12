# Master Platform Review — Shiksha Mahakumbh 6.0

**Date:** May 2026  
**Review type:** CTO · Enterprise Architect · PM · SEO · A11y · Performance · DB · Security · DevOps · UX  
**Status:** DOCUMENTATION ONLY — no code changes  
**Registration:** Firebase (untouched) · **Phase C/D:** PAUSED

---

## Executive verdict

Shiksha Mahakumbh 6.0 has a **production-grade CMS foundation** (B.7 + Phase S) suitable for a world-class education platform. The architecture can support SMK, Shiksha Kumbh, DHE, and future conferences **without schema redesign** — but **~54% of public routes** still require developer deploy for content changes.

| Lens | Score | Target | Gap |
|------|------:|-------:|----:|
| Production readiness | 90 | 95 | −5 |
| Admin manageability (effective) | 85 | 95 | −10 |
| SEO | 93 | 95 | −2 |
| Accessibility | 95 | 95 | ✅ |
| Mobile | 95 | 95 | ✅ |
| Global reach | 80 | 95 | −15 |
| Security | 88 | 95 | −7 |
| Performance | 90 | 95 | −5 |
| Analytics | 93 | 95 | −2 |

**Path to 95%+ admin-manageable:** 16–20 weeks of content migration + module UI (no architecture change).

---

## Platform inventory

| Asset | Count |
|-------|------:|
| Total `page.tsx` routes | 189 |
| Public content routes | 118 |
| CMS-wired page routes | 4 (`/`, `/hi`, `/noticeboard`, `/downloads`) |
| Legacy redirect stubs | 32 |
| Admin routes | 17 |
| Datadekh (noindex, deprecated) | 22 |
| Prisma models | 58 |
| Public v2 APIs | 22 |
| Admin v2 APIs | 42 |
| CMS admin modules (UI) | 10 |
| Admin APIs without UI | 11 |

---

## 1. CONTENT AUDIT

### Homepage sections

| Item | Status | CMS | Solution | Priority |
|------|--------|-----|----------|----------|
| Hero | CMS | ✅ 95% | Visual editor upgrade | Low |
| Statistics | CMS JSON | ✅ 90% | Form-based fields | Medium |
| Counters | CMS JSON | ✅ 95% | — | — |
| Testimonials | CMS JSON | ✅ 90% | Dedicated module | Medium |
| Partners/Sponsors | CMS JSON | ✅ 90% | Drag-reorder + tiers | Medium |
| FAQ | CMS embedded | ⚠️ 70% | FAQ module | High |
| CTA | CMS | ✅ 95% | — | — |
| Featured events | CMS JSON | ⚠️ 60% | Events admin picker | Critical |
| Featured programs | CMS JSON | ⚠️ 70% | Structured editor | Medium |
| Announcements accordion | CMS | ✅ 95% | — | — |
| Gallery strip | Hardcoded | ❌ 0% | Media album picker | Critical |
| Speaker highlights | Hardcoded | ❌ 0% | Speakers module | Critical |
| Timeline | `authority.ts` | ❌ 0% | CMS timeline section | High |
| Trust strip / marquees | CMS + fallback | ✅ 85% | — | — |

### Global chrome

| Item | Status | CMS | Solution | Priority |
|------|--------|-----|----------|----------|
| Header menus | CMS | ✅ 95% | Drag-reorder | Medium |
| Footer menus | CMS | ✅ 95% | — | — |
| Footer contact | CMS settings | ✅ 90% | Structured office form | Medium |
| Social links | CMS settings | ✅ 95% | — | — |
| Announcement bars | CMS | ✅ 95% | Live preview | Low |
| Marquees/ticker | CMS + fallback | ✅ 85% | — | — |
| Visitor counter | Supabase | ✅ 90% | Deploy verify | P0 |

### About / Introduction

| Item | Status | CMS | Solution | Priority |
|------|--------|-----|----------|----------|
| Vision/Mission | Hardcoded TSX | ❌ | CMS Page type=about | High |
| Objectives | Hardcoded | ❌ | Page sections | High |
| History/timeline | `authority.ts` | ❌ | Timeline section | High |
| DHE overview | Hardcoded | ❌ | CMS page | Medium |
| Venue (partial) | CMS CTA + HC | ⚠️ 40% | Venue module | High |
| Travel info | CMS CTA JSON | ⚠️ 50% | Structured travel module | Medium |

### Departments (5)

| Item | Status | CMS | Solution | Priority |
|------|--------|-----|----------|----------|
| Academic Council | Hardcoded | ❌ | CMS page | High |
| Prabandhan/Prachar/Sampark/Vitt | Hardcoded | ❌ | CMS pages | High |

### Committees (6 routes)

| Item | Status | CMS | Solution | Priority |
|------|--------|-----|----------|----------|
| 5 edition pages | Inline arrays | ❌ | Committees admin (API exists) | Critical |
| Committees hub | Hardcoded | ❌ | CMS listing page | High |

### Events (14+ routes)

| Item | Status | CMS | Solution | Priority |
|------|--------|-----|----------|----------|
| Events/workshops/summits hubs | `conference-catalog.ts` | ❌ | Events admin | Critical |
| Upcoming/past events | Hardcoded | ❌ | Events API wire | Critical |
| Past event detail (8) | Hardcoded | ❌ | Event detail pages | High |

### Speakers

| Item | Status | CMS | Solution | Priority |
|------|--------|-----|----------|----------|
| `/keynotespeakers` | HC + Firestore | ❌ | SpeakerProfile API + admin | Critical |

### Partners

| Item | Status | CMS | Solution | Priority |
|------|--------|-----|----------|----------|
| Homepage partners | CMS JSON | ✅ 90% | — | — |
| Standalone Partner model | Unused schema | ❌ | Partners admin module | High |

### Press (10 routes)

| Item | Status | CMS | Solution | Priority |
|------|--------|-----|----------|----------|
| 9 articles | Inline client TSX | ❌ | Articles CMS (Page type) | Critical |
| Press hub | Hardcoded | ❌ | CMS listing | High |

### Gallery / Media

| Item | Status | CMS | Solution | Priority |
|------|--------|-----|----------|----------|
| `/gallery` | Hardcoded | ❌ | Gallery albums + media | Critical |
| `/videos` | Hardcoded | ❌ | Video media type | Critical |
| Media archives (12) | Hardcoded/redirect | ❌ | Media center module | High |

### Downloads & Noticeboard

| Item | Status | CMS | Solution | Priority |
|------|--------|-----|----------|----------|
| Noticeboard | CMS | ✅ 95% | Category edit/delete, SEO embed | Medium |
| Downloads | CMS | ✅ 90% | Version history UI | Medium |

### Knowledge graph (28 routes)

| Item | Status | CMS | Solution | Priority |
|------|--------|-----|----------|----------|
| Pillars + entities | Static registries | ❌ | Generic pages CMS | Phase D |

### Legal (5 routes)

| Item | Status | CMS | Solution | Priority |
|------|--------|-----|----------|----------|
| Privacy, terms, etc. | Hardcoded | ❌ | CMS pages (API exists) | High |

### Registration (Firebase — excluded from migration)

| Item | Status | Admin | Notes |
|------|--------|-------|-------|
| All registration flows | Firebase | ✅ `/admin` | Intentionally unchanged |

---

## 2. ADMIN PANEL AUDIT

### Existing (operational)

| Module | UI | API | Score |
|--------|----|-----|------:|
| Homepage sections | ✅ | ✅ | 95 |
| Pages | ⚠️ no create | ✅ | 85 |
| Notices | ✅ | ✅ | 95 |
| Notice categories | ⚠️ no edit/delete | ✅ partial | 80 |
| Downloads | ✅ | ✅ | 90 |
| Media library | ✅ | ✅ | 88 |
| Menus | ✅ | ✅ | 85 |
| Settings | ✅ | ✅ | 95 |
| Announcement bars | ✅ | ✅ | 95 |
| SEO manager | ✅ | ✅ | 92 |
| Analytics dashboard | ✅ | ✅ | 90 |
| Firebase registrations | ✅ | Firestore | 85 |

### Recommended new modules

| Module | Schema | API | UI | Priority |
|--------|--------|-----|-----|----------|
| Articles/Press | Page | ✅ partial | ❌ | P1 |
| FAQ | New or PageSection | ❌ | ❌ | P1 |
| Gallery albums | MediaAsset | partial | ❌ | P1 |
| Contact inbox | ContactMessage | GET | ❌ | P1 |
| Feedback inbox | Feedback | GET | ❌ | P1 |
| Committees | Committee/Member | ✅ | ❌ | P2 |
| Events | Event | ✅ | ❌ | P2 |
| Speakers | SpeakerProfile | ❌ | ❌ | P2 |
| Partners | Partner | ❌ | ❌ | P2 |
| Venue/Travel | SiteSetting/Page | partial | ❌ | P2 |
| Publications/Proceedings | Download/Page | partial | ❌ | P3 |
| Media center hub | Composite | partial | ❌ | P2 |
| Audit log viewer | AuditLog | GET | ❌ | P2 |
| Newsletter admin | NewsletterSubscription | GET | ❌ | P3 |

---

## 3. SHIKSHA MAHAKUMBH ECOSYSTEM

| Domain | Current | Recommended admin module |
|--------|---------|-------------------------|
| Editions (SMK 4.0–6.0, SK) | `authority.ts` | Edition entity + timeline |
| Themes | Hardcoded | Edition metadata |
| Events/Tracks | `conference-catalog.ts` | Events admin with track filter |
| Conclaves | Registration + HC page | Event type=conclave |
| School programs | HC pages | Program CMS pages |
| Olympiads | Pillar page + registration | Event + registration link |
| Awards | Registration + HC | Event type=awards |
| Best practices | Registration | Event type=best_practices |
| Exhibitions | Registration | Event type=exhibition |
| Accommodation | Firebase + HC | Accommodation inbox (API exists) |
| Volunteers | Firebase admin | Keep Firebase |
| Talent/NGO | Firebase registration | Keep Firebase |
| **Abstract/Paper** | **EXCLUDED** | **No backend — management only via notices/downloads** |

---

## 4. NOTICE BOARD — FINAL ARCHITECTURE

### Current (implemented)

| Feature | Schema | Admin UI | Public |
|---------|--------|----------|--------|
| Categories | ✅ | ⚠️ create only | ✅ |
| Priority | ✅ | ✅ | ✅ |
| Pin | ✅ | ✅ | ✅ |
| Schedule publish | ✅ `publishAt` | ✅ | ✅ |
| Expiry | ✅ `expireAt` | ✅ | ✅ |
| PDF attachment | ✅ | ✅ | ✅ |
| Image attachment | ✅ via mediaAssetId | ⚠️ picker UX | ✅ |
| External links | ⚠️ in description | — | — |
| Multi-language | ✅ `locale` | ⚠️ en only in UI | ✅ API |
| SEO | ✅ polymorphic | ⚠️ separate manager | ✅ Phase S metadata |
| Download tracking | ❌ | — | — |
| Read tracking | ❌ | — | — |

### Recommended additions

```
NoticeRead (noticeId, sessionId, readAt)     — read analytics
Notice.externalUrl field                     — dedicated link
Category edit/delete API + UI                — P1
SEO embed in notice editor                   — P1
Standalone notice URL /notices/[slug]        — P2 (SEO)
Hindi notice seed + admin locale tabs        — P1
```

---

## 5. MEDIA CENTER — FINAL ARCHITECTURE

### Recommended unified model

```
MediaAlbum (id, title, slug, albumType, edition, year, locale, coverAssetId)
MediaAlbumItem (albumId, mediaAssetId, sortOrder, caption)
Article (extends Page pageType=article | press_release | interview)
MediaMention (id, outlet, title, url, date, logoAssetId, edition)
```

### Public routes (target)

| Type | Route pattern | Admin |
|------|---------------|-------|
| Photos | `/gallery`, `/media/photos/[album]` | Gallery admin |
| Videos | `/videos` | Video media type |
| Press | `/press/[slug]` | Articles admin |
| Coverage | `/media-center` | Media mentions |
| Archives | `/media/[edition]/[year]/[type]` | Album by edition |

**Reuse:** `MediaAsset`, `MediaFolder`, `Page`, `SeoMetadata` — minimal new tables.

---

## 6–14. CROSS-CUTTING REVIEWS

See dedicated documents:
- SEO → [FINAL_SEO_ROADMAP.md](./FINAL_SEO_ROADMAP.md)
- Global → [FINAL_GLOBAL_REACH_PLAN.md](./FINAL_GLOBAL_REACH_PLAN.md)
- Security → [FINAL_SECURITY_REVIEW.md](./FINAL_SECURITY_REVIEW.md)
- Performance → [FINAL_PERFORMANCE_PLAN.md](./FINAL_PERFORMANCE_PLAN.md)
- Deploy → [FINAL_DEPLOYMENT_PLAYBOOK.md](./FINAL_DEPLOYMENT_PLAYBOOK.md)
- Admin → [FINAL_ADMIN_MANAGEABILITY_PLAN.md](./FINAL_ADMIN_MANAGEABILITY_PLAN.md)
- Database → [FINAL_DATABASE_ARCHITECTURE.md](./FINAL_DATABASE_ARCHITECTURE.md)

---

## 15. PRIORITY SUMMARY

### Priority 1 — Critical
Deploy verification, press CMS migration, gallery wire, legal pages CMS, contact/feedback inbox, Hindi seed

### Priority 2 — High
Committees/Events/Speakers admin UI, FAQ module, venue/travel structured CMS, analytics event bridge

### Priority 3 — Future
Knowledge graph migration, publications/proceedings, newsletter admin, full i18n (ar/fr/es)

### Priority 4 — Nice-to-have
Drag-reorder everywhere, WYSIWYG editors, content workflow, real-time collaboration

---

## Conclusion

The platform is **architecturally ready** for 95%+ admin manageability. The gap is **content migration and admin UI completion**, not backend redesign. Firebase registration remains correctly isolated until an approved cutover.

**NO CODE CHANGES MADE IN THIS REVIEW.**
