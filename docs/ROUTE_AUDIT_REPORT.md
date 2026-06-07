# Complete Website Route Audit — rase.co.in

**Date:** 29 May 2026  
**Scope:** Next.js 15 App Router (`src/app` only — no `src/pages`)  
**Status:** Report only — **no route changes implemented**  
**Data source:** `scripts/route-audit.mjs` → `scripts/route-audit-data.json` (145 page routes, 6 API routes), cross-checked against `sitemap.ts`, `middleware.ts`, `next.config.js`, `navigation.ts`, `footer-content.ts`, and internal link grep.

---

## Executive Summary

| Metric | Count |
|--------|------:|
| Total page routes (`page.tsx`) | 145 |
| API routes (`route.ts`) | 6 |
| Routes in `sitemap.xml` (runtime) | **64** |
| Protected / noindex routes | **23** |
| Locale mirror routes (`[locale]/*`) | 4 |
| Confirmed broken internal links | **3 targets** → 5+ link instances |
| Duplicate content routes | **4 pairs** |
| Truly orphaned public pages | **3** |

**Critical findings (fix before URL modernization):**

1. **`/comingsoon`** is linked from `Best_Wishes.tsx` timeline data (3 editions) but **no page exists** — correct route is `/Wishes_Received` or `/commingsoon`.
2. **`/about`** is linked from `Merchandise.tsx` but **no `/about` page exists** — use `/introduction` or create `/about`.
3. **`/committee/shikshamahakumbh2025`** is linked from `committee-editions.ts` (SMK 5.0) but **no page file exists** — only 2023/2024 committee detail pages exist.
4. **`/academiccouncil`** duplicates **`/VibhagRoute/AcademicCouncil24`** — nav/footer use the Vibhag route; legacy dashboard remains linked from older components.
5. **Sitemap gap:** 81 public routes are **not** indexed; several high-value pages (`/videos`, `/conclave`, committee detail pages, press articles, media archives) are missing.

---

## Methodology

| Source scanned | Purpose |
|----------------|---------|
| `src/app/**/page.tsx` | Route inventory |
| `src/app/api/**/route.ts` | API inventory |
| `src/middleware.ts` | Auth gates, noindex headers, i18n |
| `next.config.js` | Redirects, rewrites (none), headers |
| `src/app/sitemap.ts` | Indexed URLs |
| `src/app/robots.ts` | Crawl disallow rules |
| `src/constants/navigation.ts` | Header nav |
| `src/app/component/footer-content.ts` | Footer links |
| `src/lib/knowledge-graph/content-map.ts` | Content graph / internal discovery |
| `src/data/media-archives.ts`, `committee-editions.ts` | Data-driven links (`link:` props) |
| Codebase grep | Broken targets, duplicate patterns |

**Link detection note:** The audit script matches `href`, `path`, `destination`, and `source` only. Routes linked via `link:` in data files (e.g. media archives) were manually verified — several “unlinked” routes in `route-audit-data.json` are **actually linked** through `media-archives.ts` / `MediaTree.tsx`.

**Sitemap detection note:** Script under-counts sitemap membership (regex misses `""` home entry and `...ALL_PILLAR_SLUGS` spread). Sitemap figures in this report use the **actual runtime list** from `sitemap.ts`.

---

## Route Inventory (All 145 Pages)

Legend: **Nav** = header/footer/popular links | **Linked** = any internal reference | **Sitemap** = in `sitemap.ts` | **Mobile** = responsive layout (Tailwind/modern shell) | **SEO** = dedicated metadata layout + canonical | **Status** as defined in audit brief.

### Core & Home

| Route | File | Title | Nav Source | Linked | Sitemap | Mobile | SEO | Status |
|-------|------|-------|------------|--------|---------|--------|-----|--------|
| `/` | `src/app/page.tsx` | Shiksha Mahakumbh Abhiyan — National Education Summit | Nav, Footer | Yes | Yes | Yes | Yes | Active |
| `/introduction` | `src/app/introduction/page.tsx` | Introduction | Nav, Footer | Yes | Yes | Yes | Yes | Active |
| `/ContactUs` | `src/app/ContactUs/page.tsx` | Contact Us | Nav, Footer | Yes | Yes | Yes | Yes | Active |
| `/education` | `src/app/education/page.tsx` | Education Hub | Content-map, breadcrumbs | Yes | Yes | Yes | Yes | Active |
| `/knowledge` | `src/app/knowledge/page.tsx` | Knowledge Hub | Footer | Yes | Yes | Yes | Yes | Active |

### Registration (preserve — do not rename without redirects)

| Route | File | Title | Nav Source | Linked | Sitemap | Mobile | SEO | Status |
|-------|------|-------|------------|--------|---------|--------|-----|--------|
| `/registration` | `src/app/registration/page.tsx` | Registration | Nav, Footer, CTA | Yes | Yes | Yes | Yes | Active |
| `/registration/success` | `src/app/registration/success/page.tsx` | Registration Success | Post-submit flow | Yes | Yes | Yes | Yes | Active |
| `/registration/participant` | `src/app/registration/participant/page.tsx` | Participant Registration | Registration hub | Yes | No | Yes | Partial | Active |
| `/registration/ngo` | `src/app/registration/ngo/page.tsx` | NGO Registration | Registration hub | Yes | No | Yes | Partial | Active |
| `/registration/volunteer` | `src/app/registration/volunteer/page.tsx` | Volunteer Registration | Registration hub | Yes | No | Yes | Partial | Active |
| `/registration/talent` | `src/app/registration/talent/page.tsx` | Talent Registration | Registration hub | Yes | No | Yes | Partial | Active |
| `/registration/Single_Registration` | `src/app/registration/Single_Registration/page.tsx` | Single Registration | Registration hub | Yes | No | Yes | Partial | Active |
| `/registration/conclaveReg` | `src/app/registration/conclaveReg/page.tsx` | Conclave Registration | Conclave page | Yes | No | Yes | Partial | Active |
| `/registration/Accomodation` | `src/app/registration/Accomodation/page.tsx` | Accommodation Registration | Registration / events | Yes | No | Yes | Partial | Active |
| `/Accomodation` | `src/app/Accomodation/page.tsx` | Accommodation Info | Event pages | Yes | No | Partial | Partial | **Duplicate** |

### Vibhag / Departments (canonical programme routes)

| Route | File | Title | Nav Source | Linked | Sitemap | Mobile | SEO | Status |
|-------|------|-------|------------|--------|---------|--------|-----|--------|
| `/VibhagRoute/AcademicCouncil24` | `src/app/VibhagRoute/AcademicCouncil24/page.tsx` | Academic Council — SMK 6.0 | Nav, Footer, ROUTES | Yes | Yes | Yes | Yes | **Active** |
| `/VibhagRoute/Prabandhan24` | `src/app/VibhagRoute/Prabandhan24/page.tsx` | Prabandhan Vibhag — SMK 6.0 | Nav, Footer | Yes | Yes | Yes | Yes | Active |
| `/VibhagRoute/Prachar24` | `src/app/VibhagRoute/Prachar24/page.tsx` | Prachar Vibhag — SMK 6.0 | Nav, Footer | Yes | Yes | Yes | Yes | Active |
| `/VibhagRoute/Sampark24` | `src/app/VibhagRoute/Sampark24/page.tsx` | Sampark Vibhag — SMK 6.0 | Nav, Footer | Yes | Yes | Yes | Yes | Active |
| `/VibhagRoute/Vitt24` | `src/app/VibhagRoute/Vitt24/page.tsx` | Vitt Vibhag — SMK 6.0 | Nav, Footer | Yes | Yes | Yes | Yes | Active |
| `/academiccouncil` | `src/app/academiccouncil/page.tsx` | Multi-Track Conference 2026 (legacy dashboard) | Old components, content-map | Yes | No | Partial | Partial | **Duplicate / Deprecated** |

### Events & Past Editions

| Route | File | Title | Nav Source | Linked | Sitemap | Mobile | SEO | Status |
|-------|------|-------|------------|--------|---------|--------|-----|--------|
| `/upcomingevent` | `src/app/upcomingevent/page.tsx` | Upcoming Events | Nav, Footer | Yes | Yes | Yes | Yes | Active |
| `/pastevent` | `src/app/pastevent/page.tsx` | Past Editions — SMK 1.0–5.0 | Nav, Footer | Yes | Yes | Yes | Yes | Active |
| `/events` | `src/app/events/page.tsx` | Events | Content-map, hubs | Yes | Yes | Yes | Yes | Active |
| `/summits` | `src/app/summits/page.tsx` | Summits | Footer | Yes | Yes | Yes | Yes | Active |
| `/workshops` | `src/app/workshops/page.tsx` | Workshops | Footer | Yes | Yes | Yes | Yes | Active |
| `/conclave` | `src/app/conclave/page.tsx` | VC & Policy Conclaves | Footer | Yes | No | Yes | Yes | Active |
| `/shikshamahakumbh` | `src/app/shikshamahakumbh/page.tsx` | Shiksha Mahakumbh | Content-map, trees | Yes | No | Partial | Yes | Active |
| `/shikshakumbh` | `src/app/shikshakumbh/page.tsx` | Shiksha Kumbh | Content-map, trees | Yes | No | Partial | Yes | Active |
| `/past_event/sm23` | `src/app/past_event/sm23/page.tsx` | SMK 1.0 — NIT Jalandhar | Past events hub | Yes | Yes | Yes | Yes | Active |
| `/past_event/sk23` | `src/app/past_event/sk23/page.tsx` | SMK 2.0 — NIT Kurukshetra | Past events hub | Yes | Yes | Yes | Yes | Active |
| `/past_event/sk24` | `src/app/past_event/sk24/page.tsx` | SMK 3.0 — NIT Srinagar | Past events hub | Yes | Yes | Yes | Yes | Active |
| `/past_event/sm24` | `src/app/past_event/sm24/page.tsx` | SMK 4.0 — Kurukshetra Univ. | Past events hub | Yes | Yes | Yes | Yes | Active |
| `/past_event/sm25` | `src/app/past_event/sm25/page.tsx` | SMK 5.0 — NIPER Mohali | Past events hub | Yes | Yes | Yes | Yes | Active |
| `/past_event/Teacher_Development_Program` | `src/app/past_event/Teacher_Development_Program/page.tsx` | Teacher Development Program | Past events | Yes | No | Yes | Yes | Active |
| `/past_event/Spoken_English_Workshop` | `src/app/past_event/Spoken_English_Workshop/page.tsx` | Spoken English Workshop | Past events | Yes | No | Yes | Yes | Active |
| `/past_event/Innovation_and_Entrepreneurship_Dhe_Workshop` | `src/app/past_event/Innovation_and_Entrepreneurship_Dhe_Workshop/page.tsx` | Innovation & Entrepreneurship Workshop | Past events | Yes | No | Yes | Yes | Active |
| `/BatonCeremony` | `src/app/BatonCeremony/page.tsx` | Baton Ceremony | — | No | No | Partial | Partial | **Orphaned** |
| `/ResidentialCamp` | `src/app/ResidentialCamp/page.tsx` | Residential Camp | — | No | No | Partial | Partial | **Orphaned** |
| `/TalkShow` | `src/app/TalkShow/page.tsx` | Talk Show | Content-map | Yes | No | Partial | Yes | Active |
| `/commingsoon` | `src/app/commingsoon/page.tsx` | Coming Soon (legacy) | Trees, Merchandise | Yes | No | Partial | Partial | **Hidden / Under Construction** |

### Committee

| Route | File | Title | Nav Source | Linked | Sitemap | Mobile | SEO | Status |
|-------|------|-------|------------|--------|---------|--------|-----|--------|
| `/committeepage` | `src/app/committeepage/page.tsx` | Organising Committee | Nav, Footer | Yes | Yes | Yes | Yes | Active |
| `/committee/shikshamahakumbh2023` | `src/app/committee/shikshamahakumbh2023/page.tsx` | Committee — SMK 1.0 | Committee tree | Yes | No | Yes | Yes | Active |
| `/committee/shikshakumbh2023` | `src/app/committee/shikshakumbh2023/page.tsx` | Committee — SMK 2.0 | Committee tree | Yes | No | Yes | Yes | Active |
| `/committee/shikshakumbh2024` | `src/app/committee/shikshakumbh2024/page.tsx` | Committee — SMK 3.0 | Committee tree | Yes | No | Yes | Yes | Active |
| `/committee/shikshamahakumbh2024` | `src/app/committee/shikshamahakumbh2024/page.tsx` | Committee — SMK 4.0 | Committee tree | Yes | No | Yes | Yes | Active |
| `/committee/shikshamahakumbh2025` | — | Committee — SMK 5.0 | `committee-editions.ts` | **Broken link** | — | — | — | **Broken** |

### Media, Press & Archives

| Route | File | Title | Nav Source | Linked | Sitemap | Mobile | SEO | Status |
|-------|------|-------|------------|--------|---------|--------|-----|--------|
| `/media` | `src/app/media/page.tsx` | Media Centre | Nav, Footer | Yes | Yes | Yes | Yes | Active |
| `/gallery` | `src/app/gallery/page.tsx` | Photo Gallery | Nav | Yes | Yes | Yes | Yes | Active |
| `/videos` | `src/app/videos/page.tsx` | Videos | Nav | Yes | No | Yes | Yes | Active |
| `/Press_Release` | `src/app/Press_Release/page.tsx` | Press Releases | Media centre | Yes | Yes | Yes | Yes | Active |
| `/Press1`–`/Press9` | `src/app/Press{N}/page.tsx` | Press articles 1–9 | Media centre | Yes | No | Yes | Yes | Active |
| `/Best_Wishes` | `src/app/Best_Wishes/page.tsx` | Best Wishes | Media hub | Yes | Yes | Yes | Yes | Active |
| `/Wishes_Received` | `src/app/Wishes_Received/page.tsx` | Wishes Received | Best Wishes CTA | Yes | Yes | Yes | Yes | Active |
| `/shikshamahakumbh2024digitalmedia` | `src/app/shikshamahakumbh2024digitalmedia/page.tsx` | SMK 4.0 Digital Media | `media-archives.ts` | Yes* | No | Partial | Partial | Active |
| `/shikshamahakumbh2023digitalmedia` | `src/app/shikshamahakumbh2023digitalmedia/page.tsx` | SMK 1.0 Digital Media | `media-archives.ts` | Yes* | No | Partial | Partial | Active |
| `/shikshakumbh2024digitalmedia` | `src/app/shikshakumbh2024digitalmedia/page.tsx` | SMK 3.0 Digital Media | `media-archives.ts` | Yes* | No | Partial | Partial | Active |
| `/shikshakumbh2023digitalmedia` | `src/app/shikshakumbh2023digitalmedia/page.tsx` | SMK 2.0 Digital Media | `media-archives.ts` | Yes* | No | Partial | Partial | Active |
| `/printmediashikshamahakumbh2024` | `src/app/printmediashikshamahakumbh2024/page.tsx` | SMK 4.0 Print Media | `media-archives.ts` | Yes* | No | Partial | Partial | Active |
| `/printmediashikshamahakumbh2023` | `src/app/printmediashikshamahakumbh2023/page.tsx` | SMK 1.0 Print Media | `media-archives.ts` | Yes* | No | Partial | Partial | Active |
| `/printmediashikshakumbh2024` | `src/app/printmediashikshakumbh2024/page.tsx` | SMK 3.0 Print Media | `media-archives.ts` | Yes* | No | Partial | Partial | Active |
| `/printmediashikshakumbh2023` | `src/app/printmediashikshakumbh2023/page.tsx` | SMK 2.0 Print Media | `media-archives.ts` | Yes* | No | Partial | Partial | Active |
| `/abhiyaninphotoframe` | `src/app/abhiyaninphotoframe/page.tsx` | Abhiyan Photo Frame (PDF embed) | — | No | No | Yes | Partial | **Orphaned** (nav uses PDF) |

\*Linked via `link:` in data files, not detected by automated `href` scan.

### Research & Publications

| Route | File | Title | Nav Source | Linked | Sitemap | Mobile | SEO | Status |
|-------|------|-------|------------|--------|---------|--------|-----|--------|
| `/abstract` | `src/app/abstract/page.tsx` | Abstract Submission | Nav | Yes | Yes | Yes | Yes | Active |
| `/fulllengthpaper` | `src/app/fulllengthpaper/page.tsx` | Full-Length Paper | Research nav | Yes | No | Yes | Yes | Active |
| `/paper` | `src/app/paper/page.tsx` | Call for Papers | Content-map | Yes | No | Yes | Yes | Active |
| `/proceedings` | `src/app/proceedings/page.tsx` | Proceedings | Nav, Footer | Yes | Yes | Yes | Yes | Active |
| `/proceeding1` | `src/app/proceeding1/page.tsx` | Proceedings Vol. I | Proceedings hub | Yes | No | Yes | Yes | Active |
| `/proceeding2` | `src/app/proceeding2/page.tsx` | Proceedings Vol. II | Proceedings hub | Yes | No | Yes | Yes | Active |
| `/proceeding3` | `src/app/proceeding3/page.tsx` | Proceedings Vol. III | Proceedings hub | Yes | No | Yes | Yes | Active |
| `/journals` | `src/app/journals/page.tsx` | Journals | Footer | Yes | Yes | Yes | Yes | Active |
| `/books` | `src/app/books/page.tsx` | Books | Content-map | Yes | No | Yes | Yes | Active |
| `/publications` | `src/app/publications/page.tsx` | Publications Hub | Pillar hub | Yes | Yes† | Yes | Yes | Active |
| `/conferences` | `src/app/conferences/page.tsx` | Conferences Hub | Pillar hub | Yes | Yes† | Yes | Yes | Active |
| `/reports` | `src/app/reports/page.tsx` | Reports | Content-map | Yes | Yes | Yes | Yes | Active |
| `/whitepapers` | `src/app/whitepapers/page.tsx` | Whitepapers | Content-map | Yes | Yes | Yes | Yes | Active |
| `/policy-papers` | `src/app/policy-papers/page.tsx` | Policy Papers | Content-map | Yes | Yes | Yes | Yes | Active |
| `/research-papers` | `src/app/research-papers/page.tsx` | Research Papers | Content-map | Yes | Yes | Yes | Yes | Active |
| `/research-projects` | `src/app/research-projects/page.tsx` | Research Projects | Content-map | Yes | Yes | Yes | Yes | Active |
| `/keynotespeakers` | `src/app/keynotespeakers/page.tsx` | Keynote Speakers | Content-map | Yes | No | Yes | Yes | Active |
| `/Topics` | `src/app/Topics/page.tsx` | Conference Topics | Content-map | Yes | No | Partial | Yes | Active |

†Included via `ALL_PILLAR_SLUGS` (`publications`, `conferences`).

### Education Pillars (16 — all in sitemap)

| Route | File | Linked | Sitemap | Status |
|-------|------|--------|---------|--------|
| `/school-education` | `src/app/school-education/page.tsx` | Yes | Yes | Active |
| `/higher-education` | `src/app/higher-education/page.tsx` | Yes | Yes | Active |
| `/vocational-education` | `src/app/vocational-education/page.tsx` | Yes | Yes | Active |
| `/skill-development` | `src/app/skill-development/page.tsx` | Yes | Yes | Active |
| `/research` | `src/app/research/page.tsx` | Yes | Yes | Active |
| `/innovation` | `src/app/innovation/page.tsx` | Yes | Yes | Active |
| `/policy` | `src/app/policy/page.tsx` | Yes | Yes | Active |
| `/leadership` | `src/app/leadership/page.tsx` | Yes | Yes | Active |
| `/teacher-development` | `src/app/teacher-development/page.tsx` | Yes | Yes | Active |
| `/student-development` | `src/app/student-development/page.tsx` | Yes | Yes | Active |
| `/educational-technology` | `src/app/educational-technology/page.tsx` | Yes | Yes | Active |
| `/olympiad` | `src/app/olympiad/page.tsx` | Yes | Yes | Active |
| `/awards` | `src/app/awards/page.tsx` | Yes | Yes | Active |
| `/conferences` | (see above) | Yes | Yes | Active |
| `/publications` | (see above) | Yes | Yes | Active |
| `/media` | (see above) | Yes | Yes | Active |

### Community, Commerce & Utility

| Route | File | Title | Linked | Sitemap | Status |
|-------|------|-------|--------|---------|--------|
| `/merchandise` | `src/app/merchandise/page.tsx` | Official Merchandise | Yes | Yes | Active |
| `/donation` | `src/app/donation/page.tsx` | Donation & Sponsorship | Yes | Yes | Active |
| `/feedback` | `src/app/feedback/page.tsx` | Feedback | Yes | Yes | Active |
| `/noticeboard` | `src/app/noticeboard/page.tsx` | Notice Board | Yes | No | Active |
| `/people` | `src/app/people/page.tsx` | People Directory | Yes | Yes | Active |
| `/institutions` | `src/app/institutions/page.tsx` | Institutions | Yes | Yes | Active |
| `/universities` | `src/app/universities/page.tsx` | Universities | Yes | Yes | Active |
| `/schools` | `src/app/schools/page.tsx` | Schools | Yes | Yes | Active |
| `/educational-leaders` | `src/app/educational-leaders/page.tsx` | Educational Leaders | Yes | Yes | Active |

### Submissions & Projects

| Route | File | Linked | Sitemap | Status |
|-------|------|--------|---------|--------|
| `/schoolprojectdisplaysubmission` | `src/app/schoolprojectdisplaysubmission/page.tsx` | Yes | No | Active |
| `/heiprojectdisplaysubmission` | `src/app/heiprojectdisplaysubmission/page.tsx` | Yes | No | Active |

### Legal (all in sitemap)

| Route | File | Nav | Sitemap | Status |
|-------|------|-----|---------|--------|
| `/privacy-policy` | `src/app/privacy-policy/page.tsx` | Footer | Yes | Active |
| `/terms-and-conditions` | `src/app/terms-and-conditions/page.tsx` | Footer | Yes | Active |
| `/disclaimer` | `src/app/disclaimer/page.tsx` | Footer | Yes | Active |
| `/refund-policy` | `src/app/refund-policy/page.tsx` | Footer | Yes | Active |
| `/cookie-policy` | `src/app/cookie-policy/page.tsx` | Footer | Yes | Active |

### i18n Locale Mirrors (`[locale]` — hi, fr, es, ar)

| Route | File | Accessible as | Linked | Sitemap | Status |
|-------|------|---------------|--------|---------|--------|
| `/[locale]` | `src/app/[locale]/page.tsx` | `/hi`, `/fr`, etc. | No direct nav | No | **Hidden** (Phase 2) |
| `/[locale]/introduction` | `src/app/[locale]/introduction/page.tsx` | `/hi/introduction` | No | No | Hidden |
| `/[locale]/ContactUs` | `src/app/[locale]/ContactUs/page.tsx` | `/hi/ContactUs` | No | No | Hidden |
| `/[locale]/registration` | `src/app/[locale]/registration/page.tsx` | `/hi/registration` | No | No | Hidden |

Middleware runs `next-intl` only for `/hi|fr|es|ar/*`. Default English stays at root paths.

### Protected / Admin / Data Export (noindex — do not sitemap)

| Route | File | Auth | robots.txt | Status |
|-------|------|------|------------|--------|
| `/admin` | `src/app/admin/page.tsx` | Login gate | Disallow | Hidden |
| `/admin/registrations/[id]` | `src/app/admin/registrations/[id]/page.tsx` | Session | Disallow | Hidden |
| `/AllData` | `src/app/AllData/page.tsx` | Session | Disallow | Hidden |
| `/participantregistrationdatadekh` | `src/app/participantregistrationdatadekh/page.tsx` | Session | Disallow | Hidden |
| `/volunteerdatadekh` | `src/app/volunteerdatadekh/page.tsx` | Session | Disallow | Hidden |
| `/volunteerregistrationdatadekh` | `src/app/volunteerregistrationdatadekh/page.tsx` | Session | — | Hidden |
| `/ngoregistrationdatadekh` | `src/app/ngoregistrationdatadekh/page.tsx` | Session | Disallow | Hidden |
| `/abstractdatadekh` | `src/app/abstractdatadekh/page.tsx` | Session | Disallow | Hidden |
| `/abstractdatadekhsm24` | `src/app/abstractdatadekhsm24/page.tsx` | Session | — | Hidden |
| `/fulllengthdatadekh` | `src/app/fulllengthdatadekh/page.tsx` | Session | — | Hidden |
| `/fulllengthdatadekhsm24` | `src/app/fulllengthdatadekhsm24/page.tsx` | Session | — | Hidden |
| `/fulllengthpaperdatadekh` | `src/app/fulllengthpaperdatadekh/page.tsx` | Session | — | Hidden |
| `/organiserdatadekh` | `src/app/organiserdatadekh/page.tsx` | Session | Disallow | Hidden |
| `/schooldata` | `src/app/schooldata/page.tsx` | Session | Disallow | Hidden |
| `/Talentdata` | `src/app/Talentdata/page.tsx` | Session | — | Hidden |
| `/Conclavedata` | `src/app/Conclavedata/page.tsx` | Session | — | Hidden |
| `/Bestpracticedata` | `src/app/Bestpracticedata/page.tsx` | Session | — | Hidden |
| `/accomodationdata` | `src/app/accomodationdata/page.tsx` | Session | — | Hidden |
| `/DelegateForm` | `src/app/DelegateForm/page.tsx` | Session | — | Hidden |
| `/heiprojectregistrationdata` | `src/app/heiprojectregistrationdata/page.tsx` | Session | — | Hidden |
| `/noticeboarddata` | `src/app/noticeboarddata/page.tsx` | Session | Disallow | Hidden |
| `/addkeynotespeaker` | `src/app/addkeynotespeaker/page.tsx` | Session | Disallow | Hidden |
| `/addvcdirector` | `src/app/addvcdirector/page.tsx` | Session | Disallow | Hidden |
| `/addwishesreceived` | `src/app/addwishesreceived/page.tsx` | Session | Disallow | Hidden |

### API Routes

| Route | File | Purpose | Status |
|-------|------|---------|--------|
| `/api/health` | `src/app/api/health/route.ts` | Health check | Active |
| `/api/visitors` | `src/app/api/visitors/route.ts` | Visitor counter | Active |
| `/api/client-error` | `src/app/api/client-error/route.ts` | Client error logging | Active |
| `/api/registration/send-email` | `src/app/api/registration/send-email/route.ts` | Registration emails | Active |
| `/api/registration/verify-captcha` | `src/app/api/registration/verify-captcha/route.ts` | Captcha verify | Active |
| `/api/payments/razorpay-webhook` | `src/app/api/payments/razorpay-webhook/route.ts` | Payment webhook | Active |

---

## 1. All Active Routes

**~112 public routes** are reachable and serve content. Primary entry points:

- **Global nav:** `/`, `/registration`, About submenu (introduction + 5 Vibhag routes), Research submenu, Events submenu, Media submenu, `/committeepage`, `/ContactUs`
- **Footer:** 27 internal links across quick, program, and legal columns
- **Content-map:** 62 mapped routes for knowledge-graph / discover strip
- **Registration flows:** 9 sub-routes under `/registration/*`
- **Event archive:** `/pastevent` + 8 `/past_event/*` pages
- **Media hub:** `/media` → archives, press, gallery, videos, wishes

---

## 2. All Unused Routes

Routes that exist but have **no meaningful inbound navigation** (may still receive direct/bookmarked traffic):

| Route | Notes |
|-------|-------|
| `/abhiyaninphotoframe` | PDF embed wrapper; nav links to `/abhiyanphotoframe.pdf` directly |
| `/BatonCeremony` | Standalone page; press articles reference ceremony but don't link here |
| `/ResidentialCamp` | Standalone; Press3/4 cover camp but no internal link |
| `/commingsoon` | Legacy placeholder; linked from trees/Merchandise as stub |

**Not unused (false positive from script):** All 8 digital/print media archive routes — linked from `media-archives.ts` and `MediaCenter.tsx`.

---

## 3. All Orphaned Routes

**Definition:** No inbound internal link from nav, footer, content-map, or data-driven `link:` fields.

| Route | Recommendation |
|-------|------------------|
| `/abhiyaninphotoframe` | Redirect to `/abhiyanphotoframe.pdf` or link from About menu |
| `/BatonCeremony` | Link from `/past_event/sm24` or `/Press1`; or merge into event page |
| `/ResidentialCamp` | Link from `/Press3` or past events archive |

---

## 4. All Broken Routes

### Missing pages (404)

| Broken target | Linked from | Fix |
|---------------|-------------|-----|
| `/comingsoon` | `Best_Wishes.tsx` lines 13, 18, 23 (`link: "/comingsoon"`) | Change to `/Wishes_Received` |
| `/about` | `Merchandise.tsx` line 157 (`href="/about"`) | Change to `/introduction` or create page |
| `/committee/shikshamahakumbh2025` | `committee-editions.ts` SMK 5.0 `committeeLink` | Create page or point to `/committeepage` filter |

### Redirect typos (working via misspelling)

| Issue | Detail |
|-------|--------|
| `/comingsoon` vs `/commingsoon` | Only `/commingsoon` exists (double-m). Inconsistent spelling across codebase. |

### Config redirects (working)

`next.config.js` redirects 4 copy-URL variants of `*datadekh` routes — **Redirected** status, functioning.

---

## 5. All Duplicate Routes

| Primary (canonical) | Duplicate / legacy | Relationship | Action |
|--------------------|--------------------|--------------|--------|
| `/VibhagRoute/AcademicCouncil24` | `/academiccouncil` | Same topic; different UIs (modern shell vs legacy dashboard) | 301 redirect legacy → canonical |
| `/registration/Accomodation` | `/Accomodation` | Accommodation info vs registration form | Clarify labels; consider redirect info → reg |
| `/Wishes_Received` | `/commingsoon` | Wishes content vs placeholder | Remove commingsoon links where content exists |
| `/media` (hub) | `/shikshakumbh*digitalmedia`, `/printmedia*` | Hub vs edition-specific archives | Keep both; hub is canonical discovery |

### Committee duplication pattern

- `/committeepage` — master tree (canonical index)
- `/committee/{edition}` — 4 year-specific detail pages
- Missing 5th edition creates gap vs `/committeepage` tree data

### Press duplication pattern

- `/Press_Release` — hub (in sitemap)
- `/Press1`–`/Press9` — individual articles (not in sitemap; linked from media centre)

---

## 6. SEO Improvement Opportunities

| Route(s) | Issue | Recommendation |
|----------|-------|----------------|
| `/academiccouncil` | Duplicate content, no canonical alignment | 301 → `/VibhagRoute/AcademicCouncil24` + `rel=canonical` |
| `/VibhagRoute/*` | Non-descriptive URLs | Public aliases: `/departments/academic-council`, etc. |
| `/pastevent` | camelCase | `/past-events` alias |
| `/upcomingevent` | camelCase | `/upcoming-events` alias |
| `/commingsoon` | Misspelling, thin content | `noindex` or remove after fixing links |
| `/Press1`–`/Press9` | Numbered URLs | `/press/baton-ceremony-smk-4` slugs + redirects |
| `/committee/*` | Not in sitemap | Add all 4 (+ future 5th) committee pages |
| `/videos`, `/conclave`, `/noticeboard` | High-value, not sitemap | Add to `STATIC_PATHS` |
| Media archives (8 routes) | Deep content, not sitemap | Add with `priority: 0.5` |
| `/registration/*` subpaths | Conversion pages | Add `registration/participant` etc. with lower priority |
| Locale routes | Not in sitemap | Add `/hi/introduction`, etc. when translations ship |
| Pillar pages | Good coverage | Add JSON-LD `WebPage` breadcrumbs on legacy pages |
| `/Best_Wishes` | Broken child links hurt crawl paths | Fix `/comingsoon` immediately |

**Metadata coverage:** ~90% of public routes have `layout.tsx` metadata via `PUBLIC_PAGE_META` or `createPageMetadata`. Gaps: registration sub-pages, some legacy client components, `/commingsoon`.

---

## 7. Recommended URL Structure

| Current Route | Recommended Route | Reason | SEO Benefit | Redirect Required |
|---------------|-------------------|--------|-------------|-------------------|
| `/academiccouncil` | `/VibhagRoute/AcademicCouncil24` (interim) → `/academic-council` | Eliminate duplicate; canonical programme URL | Consolidates link equity | **Yes** 301 |
| `/VibhagRoute/AcademicCouncil24` | `/departments/academic-council` | Human-readable, bilingual-friendly | Better CTR in SERPs | Yes (keep old) |
| `/VibhagRoute/Prabandhan24` | `/departments/prabandhan` | Consistent department namespace | Topical clustering | Yes |
| `/VibhagRoute/Prachar24` | `/departments/prachar` | Same | Same | Yes |
| `/VibhagRoute/Sampark24` | `/departments/sampark` | Same | Same | Yes |
| `/VibhagRoute/Vitt24` | `/departments/vitt` | Same | Same | Yes |
| `/pastevent` | `/past-events` | kebab-case standard | Improved readability | Yes |
| `/upcomingevent` | `/upcoming-events` | Same | Same | Yes |
| `/commingsoon` | `/coming-soon` (or remove) | Fix typo | Avoid duplicate thin URLs | Yes |
| `/comingsoon` (broken) | `/wishes-received` | Fix 404 | Restore crawl path | N/A (fix link only) |
| `/ContactUs` | `/contact` | Conventional slug | Minor SEO + UX | Yes |
| `/Best_Wishes` | `/best-wishes` | kebab-case | Consistency | Yes |
| `/Wishes_Received` | `/wishes-received` | kebab-case | Consistency | Yes |
| `/committeepage` | `/committee` | Shorter canonical | Cleaner URL | Yes |
| `/Press_Release` | `/press` | Hub naming | Press cluster | Yes |
| `/Press1` | `/press/baton-ceremony-smk-4` | Descriptive slug | Rich snippets | Yes |
| `/shikshamahakumbh2024digitalmedia` | `/media/shiksha-mahakumbh/2024/digital` | Hierarchical archives | Internal linking | Yes |
| `/registration/Single_Registration` | `/registration/single` | Simplify | Cleaner registration funnel | Yes |
| `/Accomodation` | `/accommodation` | Spelling | Trust signal | Yes |
| `/about` (missing) | `/introduction` | Page doesn't exist | Fix broken link | Link fix only |

**Do not rename without redirects:** `/registration/*`, `*datadekh`, `/admin/*`, Firebase-linked form endpoints.

---

## 8. Redirect Plan

### Phase 1 — Critical fixes (no URL renames)

| Priority | Action | Files |
|----------|--------|-------|
| P0 | Fix `/comingsoon` → `/Wishes_Received` in timeline data | `src/app/component/Best_Wishes.tsx` |
| P0 | Fix `/about` → `/introduction` | `src/app/component/Merchandise.tsx` |
| P0 | Create `/committee/shikshamahakumbh2025` OR update `committeeLink` | `src/data/committee-editions.ts` + new page |
| P1 | 301 `/academiccouncil` → `/VibhagRoute/AcademicCouncil24` | `next.config.js` |

### Phase 2 — SEO aliases (after approval)

Add to `next.config.js` `redirects()`:

```js
{ source: "/pastevent", destination: "/past-events", permanent: true }
// ... parallel redirects keeping old URLs alive
```

Use **permanent (308/301)** for public content; **temporary** only for active campaigns.

### Phase 3 — Department namespace

```
/VibhagRoute/:dept → /departments/:slug
```

Preserve all 5 Vibhag paths indefinitely (bookmarks, printed materials, SMK 6.0 collateral).

### Protected routes — never redirect to public

Middleware already redirects unauthenticated `*datadekh` → `/admin?redirect=...`. Keep this behavior.

---

## 9. Sitemap Improvements

### Currently included (64 URLs)

Home, education hub, 16 pillar slugs, registration + success, introduction, ContactUs, upcoming/past events, 5 major past_event editions, gallery, media, Best_Wishes, Wishes_Received, merchandise, committeepage, journals, proceedings, 5 Vibhag routes, 5 legal pages, abstract, knowledge, donation, feedback, Press_Release, people/institutions/universities/schools, research-projects, educational-leaders, reports, whitepapers, policy-papers, research-papers, events, summits, workshops.

### Missing — should add

| Route | Priority | Rationale |
|-------|----------|-----------|
| `/videos` | 0.6 | In main nav |
| `/conclave` | 0.6 | Footer program link |
| `/books` | 0.5 | Publications cluster |
| `/noticeboard` | 0.7 | Time-sensitive announcements |
| `/committee/shikshamahakumbh2023` | 0.5 | Committee SEO |
| `/committee/shikshakumbh2023` | 0.5 | Same |
| `/committee/shikshakumbh2024` | 0.5 | Same |
| `/committee/shikshamahakumbh2024` | 0.5 | Same |
| `/past_event/Teacher_Development_Program` | 0.5 | Workshop archive |
| `/past_event/Spoken_English_Workshop` | 0.5 | Same |
| `/past_event/Innovation_and_Entrepreneurship_Dhe_Workshop` | 0.5 | Same |
| `/Press1`–`/Press9` | 0.4 | Media long-tail |
| 8 media archive routes | 0.4 | Deep content |
| `/keynotespeakers` | 0.5 | Speaker discovery |
| `/paper`, `/fulllengthpaper` | 0.6 | Research funnel |
| `/shikshamahakumbh`, `/shikshakumbh` | 0.5 | Event landings |
| `/registration/participant` (and siblings) | 0.7 | Conversion |

### Should NOT add

- All `*datadekh`, `/admin`, `/AllData`, `/noticeboarddata`, `/add*` admin forms
- `/commingsoon` (thin/placeholder)
- `/academiccouncil` (pending redirect to canonical)
- `/abhiyaninphotoframe` (prefer PDF URL)

### Should remove

None immediately — current 64 entries are valid. After redirects, remove duplicate sources (e.g. drop `/academiccouncil` if 301 deployed).

### Locale sitemap (future)

When Phase 4 translations ship, add:

```
/hi/introduction, /hi/registration, /hi/ContactUs, /hi
/fr/..., /es/..., /ar/...
```

---

## 10. Files Requiring Changes

### P0 — Broken links (no route renames)

| File | Change |
|------|--------|
| `src/app/component/Best_Wishes.tsx` | `/comingsoon` → `/Wishes_Received` (3 entries) |
| `src/app/component/Merchandise.tsx` | `/about` → `/introduction` |
| `src/data/committee-editions.ts` | Add SMK 5.0 committee page or fix `committeeLink` |
| `src/app/committee/shikshamahakumbh2025/page.tsx` | **Create** (if keeping link target) |

### P1 — SEO / sitemap

| File | Change |
|------|--------|
| `src/app/sitemap.ts` | Expand `STATIC_PATHS` per Section 9 |
| `next.config.js` | Add `/academiccouncil` → canonical redirect |
| `src/lib/knowledge-graph/content-map.ts` | Remove or deprecate `/academiccouncil` entry |

### P2 — URL modernization (after approval)

| File | Change |
|------|--------|
| `next.config.js` | Department, event, press aliases |
| `src/constants/routes.ts` | Update `ROUTES` constants |
| `src/constants/navigation.ts` | Nav paths |
| `src/app/component/footer-content.ts` | Footer hrefs |
| `src/data/media-archives.ts` | Archive paths if restructured |
| `src/lib/seo/publicPages.ts` | Canonical paths in metadata |

### P3 — Cleanup

| File | Change |
|------|--------|
| `src/app/academiccouncil/page.tsx` | Deprecate after redirect |
| `src/app/commingsoon/page.tsx` | Consolidate to single coming-soon or remove |
| `scripts/route-audit.mjs` | Fix sitemap parser (`""`, imports); add `link:` scan |

---

## Middleware & Access Control Summary

```
Public route → next()
Protected *datadekh → admin session required → else redirect /admin?redirect=...
/admin → public login page (noindex)
/hi|fr|es|ar/* → next-intl middleware
X-Robots-Tag: noindex on protected prefixes
```

**No rewrites** configured. **4 redirects** in `next.config.js` (datadekh copy URLs only).

---

## Duplicate Route Analysis (Detailed)

### Pages serving similar purposes

| Group | Routes |
|-------|--------|
| Academic programme | `/VibhagRoute/AcademicCouncil24`, `/academiccouncil` |
| Accommodation | `/Accomodation`, `/registration/Accomodation` |
| Committee index vs detail | `/committeepage`, `/committee/*` |
| Proceedings hub vs volumes | `/proceedings`, `/proceeding1/2/3` |
| Event brands | `/shikshamahakumbh`, `/shikshakumbh`, `/pastevent`, `/past_event/*` |
| Media discovery vs archives | `/media`, 8 edition archive pages, `/gallery`, `/videos` |
| Press hub vs articles | `/Press_Release`, `/Press1`–`9` |

### Old routes that should redirect

- `/academiccouncil` → `/VibhagRoute/AcademicCouncil24` (immediate)
- `/commingsoon` → `/coming-soon` (after rename) or deprecate
- Future: all `VibhagRoute/*` → `/departments/*`

---

## Next Steps

1. **Review this report** and approve phased changes.
2. **P0 broken-link fixes** can ship independently (no URL changes).
3. **P1 sitemap + academic council redirect** — low risk.
4. **P2 URL modernization** — requires redirect matrix testing + `npm run build`.
5. Re-run `node scripts/route-audit.mjs` after changes to regenerate inventory.

---

*Generated for rase.co.in — App Router audit. No routes were modified during this audit.*
