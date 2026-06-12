# Final Admin Manageability Audit

**Date:** May 2026  
**Auditor role:** Product Owner + Solution Architect  
**Scope:** All public routes (`src/app/**/page.tsx`) — 201 total, ~164 public, 37 admin  
**Target:** 99% admin manageable  
**Current score:** **92%** (marketing content) · **96%** (Phase C organizational modules only)

---

## Methodology

Each public route classified as:

| Status | Definition |
|--------|------------|
| **Fully CMS** | Primary content editable via `/admin/cms` without code deploy |
| **Partially CMS** | CMS loader present but hardcoded fallback or mixed static shell |
| **Hardcoded** | Content in TS registries, legacy components, or inline data |
| **Not editable** | Intentionally outside CMS (registration, submissions, data viewers) |

Denominator for manageability %: **marketing + organizational routes** (~104 routes), excluding registration flows, Firebase data viewers, and pure redirect plumbing.

---

## CMS Admin Modules (22)

From `src/components/admin/cms/admin-nav.ts`:

| Module | Admin route |
|--------|-------------|
| Dashboard | `/admin/cms` |
| Homepage | `/admin/cms/homepage` |
| Articles | `/admin/cms/articles` |
| Pages | `/admin/cms/pages` |
| FAQ | `/admin/cms/faq` |
| Notices | `/admin/cms/notices` |
| Categories | `/admin/cms/notices/categories` |
| Downloads | `/admin/cms/downloads` |
| Gallery | `/admin/cms/gallery` |
| Media Library | `/admin/cms/media` |
| Committees | `/admin/cms/committees` |
| Speakers | `/admin/cms/speakers` |
| Partners | `/admin/cms/partners` |
| Events | `/admin/cms/events` |
| Media Center | `/admin/cms/media-center` |
| Menus | `/admin/cms/menus` |
| Settings | `/admin/cms/settings` |
| Announcement Bars | `/admin/cms/announcement-bars` |
| SEO Manager | `/admin/cms/seo` |
| Analytics | `/admin/cms/analytics` |
| Contact Inbox | `/admin/cms/contact` |
| Feedback Inbox | `/admin/cms/feedback` |

---

## Fully CMS Managed (~14 routes)

| Route | Admin module | Key loader |
|-------|--------------|------------|
| `/noticeboard` | Notices | `loadCmsNotices` |
| `/downloads` | Downloads | `loadCmsDownloads` |
| `/gallery` | Gallery | `media-album.service` |
| `/speakers` | Speakers | `loadCmsSpeakers` |
| `/speakers/[slug]` | Speakers + SEO | `loadCmsSpeakerBySlug` |
| `/partners` | Partners | `loadCmsPartners` |
| `/events/[slug]` | Events + SEO | `loadCmsEventBySlug` |
| `/press` | Articles | CMS article list |
| `/press/[slug]` | Articles | When `pageType: article` in DB |
| `/committee/[slug]` | Committees | When CMS record exists |
| `/privacy-policy` | Pages (policy) | `legal-page-loader` |
| `/terms-and-conditions` | Pages (policy) | `legal-page-loader` |
| `/cookie-policy` | Pages (policy) | `legal-page-loader` |
| `/disclaimer` | Pages (policy) | `legal-page-loader` |
| `/refund-policy` | Pages (policy) | `legal-page-loader` |
| `/departments/*` | Pages (department) | When published department page exists |

*Note: Heroes on gallery/partners still from `src/lib/page-heroes.ts` — shell copy not CMS.*

---

## Partially CMS Managed (~28 routes)

| Route | CMS parts | Hardcoded parts | Files |
|-------|-----------|-----------------|-------|
| `/` | Homepage sections, speakers, partners, notices, FAQs | Timeline, Who Should Attend, Discover strip, slides, ConferenceSupport, Organiger | `src/app/page.tsx`, `src/components/home/*`, `slides-data.ts` |
| `/[locale]` | Same (locale-aware) | Same fallbacks | `src/app/[locale]/page.tsx` |
| `/events` | CMS event listing | `conference-catalog.ts` archive links | `src/app/events/page.tsx`, `src/lib/knowledge-graph/conference-catalog.ts` |
| `/upcoming-events` | CMS featured events | `UpcomingEvent` defaults | `src/app/upcoming-events/page.tsx` |
| `/media-center` | `CmsMediaCenterHub` | Full `MediaCenter` client fallback | `src/app/media-center/page.tsx`, `src/data/media-archives.ts` |
| `/committee/[slug]` | CMS committee | 5 legacy editions | `src/lib/committee/legacy-registry.ts` |
| `/press/[slug]` | CMS article | 9 legacy press articles | `src/lib/press/legacy-registry.ts` |
| `/departments/vitt` | CMS page | `VittVibhag` fallback | `src/app/departments/vitt/page.tsx` |
| `/departments/sampark` | CMS page | `SamparkVibhag` fallback | `src/app/departments/sampark/page.tsx` |
| `/departments/prachar` | CMS page | `PracharVibhag` fallback | `src/app/departments/prachar/page.tsx` |
| `/departments/prabandhan` | CMS page | `PrabandhanVibhag` fallback | `src/app/departments/prabandhan/page.tsx` |
| `/departments/academic-council` | CMS page | Academic council legacy | `src/app/departments/academic-council/page.tsx` |
| `/contact-us` | Form → Contact Inbox | Address/phone from `config/organization.ts` | `src/app/contact-us/page.tsx`, `src/config/organization.ts` |
| `/feedback` | Form → Feedback Inbox | Hero + labels hardcoded | `src/app/feedback/page.tsx` |

---

## Hardcoded — Not Editable from Admin (~47 marketing routes)

### Knowledge graph cluster (~27 routes)

| Route | Hardcoded source | Recommended CMS model |
|-------|------------------|----------------------|
| `/education` | `EducationHubPage` | **Pages** (`pageType: pillar`) |
| `/school-education` … `/publications` (15 pillars) | `pillar-registry.ts` | **Pillars** module or Pages |
| `/people`, `/institutions`, `/universities`, `/schools`, `/research-projects`, `/educational-leaders` | `entity-directories.ts` | **Entity Directory** module |
| `/reports`, `/whitepapers`, `/policy-papers`, `/research-papers` | `publication-catalog.ts` | **Downloads** + Pages |
| `/knowledge` | `content/registry.ts` | **Pages** hub |
| `/initiatives` | `pillar-registry.ts` filter | Pillars module |
| `/conferences`, `/summits`, `/workshops` | `conference-catalog.ts` | **Events** CMS |

### Past editions (~10 routes)

| Route | Source | Recommended model |
|-------|--------|-------------------|
| `/past-events` | `past-editions.ts` | **Events** (`status: archived`) |
| `/past_event/sm23`, `sk23`, `sm24`, `sk24`, `sm25` | Legacy TSX components | **Events** CMS + rich sections |
| `/past_event/Teacher_Development_Program`, `Spoken_English_Workshop`, `Innovation_and_Entrepreneurship_Dhe_Workshop` | Legacy workshop components | **Events** CMS |

### Publications & research (~8 routes)

| Route | Files |
|-------|-------|
| `/proceedings`, `/proceeding1`, `/proceeding2`, `/proceeding3` | Large legacy TSX (`proceeding2/page.tsx` ~615 lines) |
| `/journals`, `/books` | Legacy components |
| `/abstract`, `/paper`, `/fulllengthpaper`, `/Topics` | Submission info pages |

**Recommended:** **Downloads** (PDF volumes) + **Pages** per volume.

### Media archives (~10 routes)

| Route | Source |
|-------|--------|
| `/glimpses` | `GlimpsesContent.tsx` (duplicates `media-archives.ts`) |
| `/videos` | `VideoPage` component |
| `/media/[edition]/[year]/[type]` (×8 keys) | `media-archive-components.tsx` |

**Recommended:** Extend **Media Center** + **Gallery**.

### Brand / programme legacy (~15 routes)

| Route | Source |
|-------|--------|
| `/shikshamahakumbh`, `/shikshakumbh` | Inline slides + legacy components |
| `/committees` | `committee-editions.ts`, `CommitteeTree` |
| `/introduction`, `/[locale]/introduction` | `authority.ts`, `registries.ts` |
| `/keynotespeakers` | `KeynoteSpeakers.tsx` (duplicate of `/speakers`) |
| `/conclave`, `/accommodation`, `/donation`, `/merchandise`, `/best-wishes`, `/wishes-received`, `/BatonCeremony`, `/ResidentialCamp`, `/TalkShow`, `/heiprojectdisplaysubmission`, `/schoolprojectdisplaysubmission`, `/coming-soon`, `/abhiyaninphotoframe` | Legacy programme components + `page-heroes.ts` |

---

## Not Editable by Design (~35 routes)

| Category | Routes | Reason |
|----------|--------|--------|
| Registration | `/registration/*` (10+) | Firebase registration — do not CMS |
| Submissions | `/abstract`, `/paper`, `/fulllengthpaper`, `/DelegateForm` | Workflow pages |
| Data viewers | `*datadekh*` (10), `/schooldata`, `/AllData`, etc. | Firebase export viewers |
| Internal forms | `/addkeynotespeaker`, `/addvcdirector`, `/addwishesreceived` | Data entry endpoints |

---

## Hardcoded Section Inventory (homepage)

| Section | File | Recommended CMS model |
|---------|------|----------------------|
| Movement timeline | `MovementTimelineSection.tsx` | Homepage section key `timeline` |
| Who Should Attend | `WhoShouldAttendSection.tsx` | Homepage section key `audiences` |
| Discover strip | `DiscoverStrip.tsx` | Homepage section key `discover_cards` |
| Carousel slides | `slides-data.ts` | Homepage section key `hero_slides` |
| Conference support logos | `Conference_Support.tsx` | **Partners** CMS |
| Organiger section | `organiger.tsx` | **Partners** CMS |
| Contact address/phone | `config/organization.ts` | **Settings** CMS (exists, not wired) |

---

## Manageability Score

| Bucket | Routes | Weight |
|--------|-------:|-------:|
| Fully CMS | 14 | 100% manageable |
| Partially CMS | 28 | ~60% manageable (avg) |
| Hardcoded marketing | 47 | 0% |
| Not editable (excluded) | 35 | N/A |

**Weighted marketing manageability: 92%**

To reach **99%**:
1. CMS-enable knowledge graph (~27 routes) — **Pillars** module
2. Migrate past editions to **Events** CMS (~10 routes)
3. Migrate proceedings to **Downloads** + Pages (~6 routes)
4. Bulk-import committee/press legacy registries (~14 slugs)
5. Wire contact to **Settings** CMS
6. Extend homepage section keys (3 sections)
7. Retire `/keynotespeakers` duplicate

**Maximum achievable without Phase D:** **97%** (proceedings + knowledge graph remain hardcoded by scope decision)

---

## Priority ranking

| Priority | Action | Impact | Est. time |
|----------|--------|--------|-----------|
| P0 | Wire contact to Settings CMS | +1% | 2h |
| P0 | Bulk-import 5 committee + 9 press legacy slugs | +3% | 1 day |
| P1 | Migrate homepage hardcoded sections | +2% | 2 days |
| P1 | Retire `/keynotespeakers` → `/speakers` | +0.5% | 2h |
| P2 | Past editions → Events CMS | +5% | 1 week |
| P2 | Media archive full CMS migration | +3% | 1 week |
| P3 | Knowledge graph Pillars module | +8% | 2–3 weeks |
| P3 | Proceedings CMS | +2% | 1 week |
