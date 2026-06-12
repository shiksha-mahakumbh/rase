# Admin Manageability Gap Report — Full Ecosystem Audit

**Date:** May 2026  
**Current admin score:** 72/100 (platform-wide) · 92/100 (CMS modules with UI)

---

## Executive summary

Phase B.7 delivered admin UI for 10 CMS modules. **~55% of public routes** still require code deploy. The table below maps every content type the user listed to its admin status and priority.

---

## Priority legend

| Priority | Meaning |
|----------|---------|
| **Critical** | High-traffic or brand-critical; no admin path |
| **High** | Frequently updated; API exists or partial CMS |
| **Medium** | Important but lower change frequency |
| **Low** | Rarely changes or Phase C/D scope |

---

## Content manageability matrix

| Content area | Current source | Admin UI | API | Priority | Gap |
|--------------|----------------|----------|-----|----------|-----|
| **Homepage hero** | CMS section `hero` | ✅ `/admin/cms/homepage` | ✅ | — | None |
| **Homepage statistics** | CMS `stats` | ✅ | ✅ | — | JSON editor UX |
| **Homepage counters** | CMS `counters` | ✅ | ✅ | — | None |
| **Homepage testimonials** | CMS `testimonials` | ✅ | ✅ | — | None |
| **Homepage partners** | CMS `partners` | ✅ | ✅ | — | No drag-reorder |
| **Homepage FAQ** | CMS `stats.faqs` | ✅ | ✅ | High | Dedicated FAQ module missing |
| **Homepage CTA** | CMS `cta` | ✅ | ✅ | — | None |
| **Homepage announcements accordion** | CMS `announcements` | ✅ | ✅ | — | None |
| **Homepage featured programs** | CMS `featured_programs` | ✅ | ✅ | — | None |
| **Homepage featured events** | CMS `featured_events` | ✅ | ✅ | High | Events module for full CRUD |
| **Homepage gallery** | HC `GallerySection` | ❌ | Media API only | **Critical** | Wire gallery to media library |
| **Homepage speaker highlights** | HC | ❌ | — | **Critical** | Phase C speakers |
| **Homepage timeline** | HC `authority.ts` | ❌ | — | High | Homepage section or CMS page |
| **Noticeboard** | CMS | ✅ `/admin/cms/notices` | ✅ | — | Attachments picker UX |
| **Notice categories** | CMS | ✅ partial | ✅ | Medium | No edit/delete API |
| **Downloads / brochures** | CMS | ✅ `/admin/cms/downloads` | ✅ | — | Metadata edit UI |
| **Announcement bars / popup** | CMS | ✅ | ✅ | — | Preview modal |
| **Menus (header)** | CMS | ✅ `/admin/cms/menus` | ✅ | Medium | No drag-reorder |
| **Menus (footer)** | CMS | ✅ | ✅ | — | None |
| **Site settings** | CMS | ✅ `/admin/cms/settings` | ✅ | — | None |
| **Footer contact** | CMS settings | ✅ | ✅ | — | Office addresses JSON |
| **Social links** | CMS settings | ✅ | ✅ | — | None |
| **Phone / emails** | CMS settings | ✅ | ✅ | — | None |
| **Copyright text** | CMS settings | ✅ | ✅ | — | None |
| **Venue details** | CMS `cta` + HC fallback | ✅ partial | ✅ | High | Dedicated venue module |
| **Travel information** | CMS `cta.travel` | ✅ partial | ✅ | Medium | Structured form vs JSON |
| **Sponsors** | CMS `partners` (sponsor type) | ✅ | ✅ | — | None |
| **Partners (academic/media)** | CMS `partners` | ✅ | ✅ | — | None |
| **Visitor counter** | Supabase analytics | ✅ dashboard | ✅ | — | Fixed RC-1/RC-2 |
| **SEO per page** | CMS SEO engine | ✅ `/admin/cms/seo` | ✅ | High | Not embedded in entity editors |
| **Media library** | CMS | ✅ `/admin/cms/media` | ✅ | — | Usage tracking missing |
| **Photo galleries** | HC `/gallery` | ❌ | Media API | **Critical** | Gallery CMS module |
| **Video links** | HC `/videos` | ❌ | — | **Critical** | Media center Phase C |
| **PDF brochures** | CMS downloads | ✅ | ✅ | — | None |
| **Press articles** | HC per-file TSX | ❌ | — | **Critical** | 10 articles × code deploy |
| **Media mentions** | HC press hub | ❌ | — | **Critical** | Media center |
| **Committee members** | HC inline arrays | ❌ | API exists (paused) | **Critical** | Phase C — PAUSED |
| **Organizing teams** | HC | ❌ | — | **Critical** | Phase C |
| **Event coordinators** | HC | ❌ | — | High | Phase C |
| **Volunteers** | Firebase | ✅ Firebase admin | FB | — | Intentional |
| **Conclave coordinators** | HC departments | ❌ | — | High | Department CMS |
| **School program coordinators** | HC | ❌ | — | Medium | Phase C |
| **Keynote speakers** | FB + HC | ❌ | API exists (paused) | **Critical** | Phase C — PAUSED |
| **Departments (5 vibhag)** | HC components | ❌ | — | **High** | Generic pages CMS |
| **Events catalog** | HC `conference-catalog.ts` | ❌ | API exists (paused) | **Critical** | Phase C — PAUSED |
| **Publications / proceedings** | HC (600+ lines) | ❌ | — | High | Downloads or pages CMS |
| **Knowledge graph (28 routes)** | Static registries | ❌ | — | Medium | Phase D |
| **Legal pages (5)** | HC | ❌ | Pages API | Medium | Migrate to `/admin/cms/pages` |
| **Registration flow** | Firebase | ✅ `/admin` | FB | — | Do not modify |
| **Feedback submissions** | Firebase/API | Partial | ✅ | Medium | Admin inbox UI |
| **Contact messages** | API | Partial | ✅ | Medium | Admin inbox UI |

---

## Priority backlog

### Critical (12 items) — stabilize before Phase C

1. Gallery section → media library picker on homepage
2. Press articles (10) → CMS pages or media center
3. Committee members → **PAUSED** (Phase C)
4. Keynote speakers → **PAUSED** (Phase C)
5. Events catalog → **PAUSED** (Phase C)
6. Photo galleries public page
7. Video links / media center
8. Speaker highlights homepage section
9. Media mentions
10. `[locale]` homepage CMS provider gap
11. Noticeboard/downloads dynamic SEO metadata
12. Visitor counter deploy verification (migrations)

### High (10 items)

1. Homepage timeline / movement section
2. Department pages (5) → generic CMS pages
3. Venue module (structured, not JSON)
4. FAQ dedicated module (vs `stats.faqs`)
5. SEO embedded in notice/download editors
6. Menu drag-reorder UI
7. Publications/proceedings → downloads CMS
8. Conclave coordinators content
9. Analytics admin path exclusion
10. Contact/feedback admin inbox

### Medium (8 items)

1. Legal pages → CMS pages
2. Notice category edit/delete
3. Travel info structured form
4. Knowledge graph content admin
5. Accommodation page CMS
6. Merchandise page CMS
7. Introduction page CMS
8. hreflang content management

### Low (5 items)

1. Legacy redirect deprecation
2. Datadekh route cleanup
3. `VISITOR_COUNTER_USE_FIRESTORE` env removal
4. Press1-9 redirect monitoring
5. Workshop page templates

---

## Admin score projection

| Phase | Admin score |
|-------|------------:|
| Current (B.7) | 72 |
| After stabilization (legal, locale, SEO embed, gallery wire) | 78 |
| After Phase C (events, committees, speakers) | 88 |
| After Phase D (press, media center, knowledge graph) | 95 |

---

## Do NOT build yet (user directive)

Committee · Speakers · Partners standalone · Events · Media Center · Press Center · Gallery module
