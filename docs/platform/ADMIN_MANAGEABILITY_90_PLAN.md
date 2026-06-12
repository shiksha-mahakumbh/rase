# Admin Manageability 90% Plan — Phase S

**Date:** May 2026  
**Current:** 78/100 platform · 92/100 CMS modules  
**Target:** 90%+ content manageable without code deploy  
**Status:** Roadmap only — no implementation

---

## Target definition

**90% manageability** = operators can create, edit, publish, archive, and reorder ≥90% of public-facing content through `/admin/cms` without a developer PR.

**Measurement:** `(CMS-managed routes + CMS-global chrome) / total public content routes`

| Today | Target |
|-------|--------|
| 3 page routes + global chrome ≈ 22% route-level | 90% |
| Weighted by traffic: ~45% effective | ≥90% effective |

---

## Content manageability matrix

### Homepage — current vs target

| Content | Today | Target module | Priority |
|---------|-------|---------------|----------|
| Hero | ✅ CMS section | Enhanced visual editor | — |
| Statistics | ✅ CMS `stats` | Form-based fields | Low |
| Counters | ✅ CMS `counters` | — | — |
| Banners / sliders | ⚠️ hero only | Carousel section type | Medium |
| Testimonials | ✅ CMS section | Dedicated testimonials module | Medium |
| CTAs | ✅ CMS `cta` | — | — |
| Highlights | ⚠️ featured_programs JSON | Structured editor | Medium |
| Sponsors | ✅ CMS `partners` (type) | Tier labels | Low |
| Partners | ✅ CMS `partners` | Drag-reorder | Medium |
| FAQ | ⚠️ embedded in `stats.faqs` | **FAQ module** | High |
| Announcements accordion | ✅ CMS section | — | — |
| Gallery | ❌ HC `GallerySection` | **Media album picker** | Critical |
| Speaker highlights | ❌ HC | Speakers module (Phase C) | Critical |
| Timeline | ❌ `authority.ts` | Homepage section or page | High |
| Featured events | ⚠️ JSON only | **Events admin UI** | Critical |

### About pages

| Content | Today | Target | Priority |
|---------|-------|--------|----------|
| Vision / Mission | HC `/introduction` | CMS page `introduction` | High |
| Objectives | HC | CMS page sections | High |
| History / timeline | HC + `authority.ts` | CMS timeline section | High |
| DHE overview | HC | CMS page | Medium |

### Committees (Phase C — API exists)

| Capability | API | UI needed |
|------------|-----|-----------|
| Add member | ✅ | Committee editor |
| Edit member | ✅ | Member form |
| Delete member | ✅ | Confirm dialog |
| Reorder | ⚠️ sortOrder field | Drag UI |
| Publish / archive | ✅ status | Toggle |
| Per-edition committees | ✅ | Edition filter |

### Team members (generalized)

| Role | Model | Module |
|------|-------|--------|
| Committee | `CommitteeMember` | Committees admin |
| Speakers | `SpeakerProfile` | Speakers admin (new API) |
| Coordinators | `CommitteeMember` or new | Team module |
| Volunteers | Firebase | Keep Firebase admin |

### Events

| Capability | API | UI |
|------------|-----|-----|
| Add / Edit / Delete | ✅ | Events admin |
| Publish / Archive | ✅ | Status workflow |
| Schedule | ✅ `startAt`/`endAt` | Date pickers |
| Featured on homepage | ⚠️ JSON | Link to Event picker |
| Session mapping | ❌ | Future junction table |

### Downloads

| Capability | Today | Gap |
|------------|-------|-----|
| Upload | ✅ | — |
| Version / Replace | ✅ API (`replacedById`) | Version history UI |
| Expire | ✅ `expiresAt` | Expiry picker in UI |
| Track downloads | ✅ `downloadCount` | Analytics widget |
| Categories / tags | ✅ | Filter UI |

### Notice board

| Capability | Today | Gap |
|------------|-------|-----|
| Schedule publish | ✅ `publishAt` | UI date picker |
| Pin | ✅ | Toggle in list |
| Expire | ✅ `expiresAt` | UI |
| Priority | ✅ | Dropdown |
| Attachments | ✅ | Media picker UX |
| Categories | ⚠️ create only | Edit/delete API + UI |

### Media center

| Content type | Today | Target module |
|--------------|-------|---------------|
| Photos | Media library (no public wire) | Gallery albums admin |
| Videos | HC `/videos` | Video media type + embed |
| Press releases | HC press articles | Articles CMS |
| News coverage | HC media archives | Media mentions module |
| Articles | HC 9 press routes | Article editor |
| Interviews | — | Article type |
| Gallery albums | — | Album entity + public page |

### Testimonials

| Capability | Target |
|------------|--------|
| Add / Edit / Delete | Testimonials module |
| Feature on homepage | `isFeatured` flag → homepage section |

### FAQ

| Capability | Target |
|------------|--------|
| Categories | `FaqCategory` model |
| Add / Edit / Delete | FAQ admin |
| Homepage sync | Auto-pull featured FAQs |

### Partners

| Capability | Target |
|------------|--------|
| Tier management | `Partner.tier` enum (Platinum/Gold/Silver) |
| Add / Edit / Delete | Partners admin (activate `Partner` model) |
| Homepage sync | Section reads from Partner API |

### Speakers

| Capability | Target |
|------------|--------|
| Bio, social, images | `SpeakerProfile` CRUD |
| Session mapping | `SpeakerSession` junction |
| Keynote page wire | `/keynotespeakers` from API |

### Contact & footer

| Content | Today | Target |
|---------|-------|--------|
| Office details | Settings JSON | Structured form |
| Emails / phones | ✅ settings | — |
| Locations / maps | HC contact page | Settings + embed |
| Social links | ✅ settings | — |
| Footer menus | ✅ menus | — |
| Quick links | ✅ menus | — |
| Policies | HC legal pages | CMS pages |
| Copyright | ✅ settings | — |

---

## Phased roadmap to 90%

### Phase S1 — Stabilization (weeks 1–2) → **82%**

No new entities. Wire existing CMS to more routes.

| # | Task | Routes unlocked | Admin % gain |
|---|------|-----------------|-------------:|
| 1 | `/[locale]` CmsProvider + Hindi seed | 1 | +1% |
| 2 | Legal pages → CMS pages (migrate 5) | 5 | +4% |
| 3 | Introduction → CMS page | 1 | +1% |
| 4 | Homepage gallery → media picker | 1 section | +1% |
| 5 | Notice/download CMS SEO metadata | 2 | SEO admin +0 |
| 6 | Pages create UI | — | Workflow |
| 7 | Contact/feedback inbox UI | — | Ops |
| 8 | Notice category edit/delete | — | Workflow |

**Effective manageability after S1: ~82%** (by traffic-weighted content)

### Phase S2 — Content modules (weeks 3–6) → **88%**

New admin UIs using existing or minimal new APIs.

| # | Module | API work | UI work |
|---|--------|----------|---------|
| 1 | Articles / Press (use Page type=article) | Minimal | Full editor |
| 2 | FAQ module | New model + API | Admin CRUD |
| 3 | Gallery albums | Extend MediaAsset | Album admin + public wire |
| 4 | Partners standalone | Activate Partner model | CRUD + tiers |
| 5 | Testimonials | Extract from JSON | CRUD module |
| 6 | SEO embed in entity editors | — | Panel component |
| 7 | Department pages (5) | Use Pages API | Migrate content |

**Effective manageability after S2: ~88%**

### Phase S3 — Phase C modules (weeks 7–12) → **93%**

| # | Module | Status |
|---|--------|--------|
| 1 | Committees admin | API exists |
| 2 | Events admin | API exists |
| 3 | Speakers admin | New API + UI |
| 4 | Media center hub | Wire gallery + video + press |
| 5 | Video library | MediaAsset type=video |

**Effective manageability after S3: ~93%**

### Phase S4 — Knowledge & proceedings (weeks 13–16) → **95%**

| # | Module | Routes |
|---|--------|--------|
| 1 | Publications/proceedings → downloads or pages | 4+ |
| 2 | Knowledge graph pillars → generic pages | 28 |
| 3 | Event catalog public wire | 3 hubs |

**Target: 95%+ — exceeds 90% goal**

---

## What stays developer-only (intentional)

| Area | Reason |
|------|--------|
| Firebase registration flow | User mandate — no migration |
| Payment / Razorpay | User mandate |
| Knowledge graph entity relationships | Phase D — complex graph |
| Datadekh internal tables | Deprecated, noindex |
| Custom program submission forms | Firebase + bespoke validation |

---

## Admin UX standards (for 90% goal)

| Standard | Requirement |
|----------|-------------|
| WYSIWYG or block editor | All long-form content |
| Media picker | All images/PDFs via library |
| SEO panel | Embedded in every entity editor |
| Preview | Before publish on all content types |
| Schedule | publishAt / expiresAt on all time-sensitive content |
| Drag-reorder | Lists: menus, partners, committees, FAQ |
| Locale tabs | en / hi on all CMS entities |
| Audit trail | Visible in admin UI |

---

## Score projection

| Milestone | Admin score | % manageable |
|-----------|------------:|-------------:|
| Today | 78 | ~45% effective |
| After S1 | 82 | ~55% |
| After S2 | 88 | ~75% |
| After S3 (Phase C) | 93 | ~90% |
| After S4 | 95 | ~93% |

**90% target achievable in Phase S3 (week 12) with Phase C module delivery.**
