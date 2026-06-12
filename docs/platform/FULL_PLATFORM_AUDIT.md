# Full Platform Audit — Post Phase B.7

**Date:** May 2026  
**Platform:** https://www.rase.co.in  
**Stack:** Next.js 15 · Vercel · Supabase CMS · Firebase registration  
**Total routes:** 189 `page.tsx` (172 public · 17 admin)

---

## Scoring legend (per page / group)

| Dimension | 0–100 scale |
|-----------|-------------|
| **SEO** | Metadata + schema + canonical + sitemap |
| **Mobile** | Responsive + LCP/CLS + touch targets |
| **A11y** | WCAG 2.1 AA alignment |
| **Analytics** | Page view tracking via `VisitorPageTracker` |
| **Admin** | % content editable via `/admin/cms` |
| **Overall** | Weighted average |

**Data source codes:** `HC` Hardcoded · `CMS` Supabase v2 · `FB` Firebase · `MIX` Mixed · `RED` Redirect only

---

## Platform summary

| Category | Routes | Avg SEO | Avg Mobile | Avg A11y | Avg Admin | Avg Overall |
|----------|-------:|--------:|-----------:|---------:|----------:|------------:|
| Homepage & core | 15 | 92 | 91 | 92 | 78 | 88 |
| CMS wired | 3 | 88 | 90 | 90 | 95 | 91 |
| Registration (Firebase) | 17 | 85 | 82 | 78 | 90* | 84 |
| Departments | 11 | 82 | 88 | 85 | 5 | 65 |
| Committees | 8 | 78 | 86 | 80 | 0 | 61 |
| Events | 28 | 80 | 87 | 82 | 0 | 62 |
| Press & media | 42 | 76 | 85 | 78 | 0 | 60 |
| Knowledge graph | 28 | 84 | 88 | 86 | 0 | 70 |
| Legal & publications | 20 | 75 | 88 | 88 | 0 | 63 |
| Legacy redirects | 33 | 40 | — | — | — | 40 |
| Firebase datadekh (noindex) | 22 | N/A | — | — | — | N/A |
| Admin CMS | 17 | N/A | 88 | 90 | 92 | 90 |

*Registration admin via Firebase portal, not CMS.

**Platform weighted overall: 72/100** (content pages only, excluding redirects/datadekh)

---

## Global infrastructure (all public routes)

| Item | Status |
|------|--------|
| `VisitorPageTracker` | ✅ Global via `ClientChrome` in root layout |
| Skip-to-content | ✅ Root layout |
| CMS global chrome | ✅ Nav, footer, ticker, modal (CMS + fallback) |
| `sitemap.xml` | ✅ Static + CMS merge |
| `robots.txt` | ✅ SEO engine driven |
| Organization JSON-LD | ✅ Homepage |
| Event JSON-LD | ✅ Homepage |
| hreflang | ⚠️ Partial (`/[locale]` routes only) |

---

## 1. Homepage & core

| URL | Purpose | Source | HC% | CMS% | SEO | Mobile | A11y | Analytics | Admin | Overall |
|-----|---------|--------|----:|-----:|----:|-------:|-----:|----------:|------:|--------:|
| `/` | Main landing | CMS+FB | 25 | 75 | 95 | 91 | 92 | ✅ | 78 | 88 |
| `/introduction` | About DHE/SMK | HC | 100 | 0 | 85 | 88 | 90 | ✅ | 0 | 66 |
| `/contact-us` | Contact | HC | 100 | 0 | 82 | 90 | 88 | ✅ | 0 | 65 |
| `/feedback` | Feedback form | MIX | 80 | 0 | 70 | 85 | 75 | ✅ | 0 | 62 |
| `/donation` | Donation info | HC | 100 | 0 | 70 | 88 | 85 | ✅ | 0 | 61 |
| `/accommodation` | Stay info | HC | 100 | 0 | 72 | 88 | 85 | ✅ | 0 | 62 |
| `/merchandise` | Merch | HC | 100 | 0 | 70 | 88 | 85 | ✅ | 0 | 61 |
| `/initiatives` | Pillar hub | HC registry | 95 | 5 | 80 | 88 | 86 | ✅ | 0 | 68 |
| `/glimpses` | Photo glimpses | HC | 100 | 0 | 72 | 87 | 84 | ✅ | 0 | 61 |
| `/coming-soon` | Placeholder | HC | 100 | 0 | 65 | 90 | 88 | ✅ | 0 | 61 |
| `/[locale]` | i18n home | MIX | 60 | 40 | 80 | 88 | 88 | ✅ | 40 | 71 |
| `/[locale]/introduction` | i18n intro | HC strings | 90 | 10 | 78 | 88 | 88 | ✅ | 0 | 66 |

**Gaps:** `/[locale]` homepage lacks `CmsProvider` — CMS sections may not load on locale path.

---

## 2. CMS wired pages ✅

| URL | Purpose | Source | HC% | CMS% | SEO | Mobile | A11y | Analytics | Admin | Overall |
|-----|---------|--------|----:|-----:|----:|-------:|-----:|----------:|------:|--------:|
| `/` | Homepage | CMS | 25 | 75 | 95 | 91 | 92 | ✅ | 78 | 88 |
| `/noticeboard` | Notices | CMS | 5 | 95 | 88 | 90 | 90 | ✅ | 95 | 91 |
| `/downloads` | Downloads hub | CMS | 5 | 95 | 86 | 90 | 88 | ✅ | 90 | 89 |

**Missing per-page:** `generateMetadata` from CMS SEO entity (static metadata today).

---

## 3. Registration (Firebase — do not modify)

| URL | Purpose | Source | SEO | Analytics | Admin |
|-----|---------|--------|-----|----------|-------|
| `/registration` | Main hub | FB | 88 | ✅ | 90 (Firebase admin) |
| `/registration/success` | Success | FB | 75 | ✅ | — |
| `/abstract`, `/paper`, `/fulllengthpaper` | Submissions | FB | 72 | ✅ | Partial |
| Legacy `/registration/*` redirects | Aliases | RED | — | Brief | — |

---

## 4. Departments (all hardcoded)

| URL | SEO | Schema | Admin | Overall |
|-----|-----|--------|-------|--------:|
| `/departments/academic-council` | 85 | Event+Breadcrumb | 0 | 65 |
| `/departments/vitt` | 80 | VibhagJsonLd | 0 | 63 |
| `/departments/sampark` | 80 | VibhagJsonLd | 0 | 63 |
| `/departments/prachar` | 80 | VibhagJsonLd | 0 | 63 |
| `/departments/prabandhan` | 80 | VibhagJsonLd | 0 | 63 |

---

## 5. Committees (all hardcoded — Phase C paused)

| URL | Members source | SEO | Admin | Overall |
|-----|----------------|-----|-------|--------:|
| `/committees` | `CommitteeTree` | 82 | 0 | 62 |
| `/committee/shikshamahakumbh2023` | Inline arrays | 78 | 0 | 58 |
| `/committee/shikshamahakumbh2024` | Inline arrays | 78 | 0 | 58 |
| `/committee/shikshamahakumbh2025` | Inline arrays | 78 | 0 | 58 |
| `/committee/shikshakumbh2023` | Inline arrays | 78 | 0 | 58 |
| `/committee/shikshakumbh2024` | Inline arrays | 78 | 0 | 58 |

**Missing:** Committee schema, admin CRUD, member photos from media library.

---

## 6. Events (all hardcoded — Phase C paused)

| URL group | Count | Source | SEO avg | Admin |
|-----------|------:|--------|--------:|------:|
| `/events`, `/workshops`, `/summits` | 3 | `conference-catalog.ts` | 85 | 0 |
| `/upcoming-events`, `/past-events` | 2 | HC components | 78 | 0 |
| `/past_event/*` | 8 | HC edition pages | 75 | 0 |
| `/conclave`, `/shikshakumbh`, `/shikshamahakumbh` | 3 | HC | 72 | 0 |
| Workshop pages | 3 | HC | 72 | 0 |

**Missing:** Event schema per edition, CMS event module, calendar integration.

---

## 7. Press & media (Phase C/D paused)

| URL group | Count | Source | SEO | Admin |
|-----------|------:|--------|-----|------:|
| `/press` hub | 1 | HC | 80 | 0 |
| `/press/*` articles | 10 | Inline `const data` per file | 76 | 0 |
| `/media-center` | 1 | HC | 82 | 0 |
| `/media/[edition]/[year]/[type]` | 8 | Static archive keys | 80 | 0 |
| `/videos`, `/gallery` | 2 | HC | 70 | 0 |
| `/keynotespeakers` | 1 | FB fetch + HC | 72 | 0 |
| `/best-wishes`, `/wishes-received` | 2 | MIX | 75 | 0 |
| Legacy `/Press1-9`, print/digital media | 17 | RED | — | — |

**Missing:** Article schema on press pages, media center CMS, gallery from media library.

---

## 8. Knowledge graph (static registries)

28 routes under `/knowledge`, `/education`, entity directories, pillars, document types.

| Aspect | Status |
|--------|--------|
| Metadata | ✅ `createPillarMetadata` / `createPageMetadata` |
| Breadcrumb schema | ✅ Most pillar pages |
| Content updates | ❌ Requires code deploy |
| Admin | 0% |

**Avg overall: 70/100** (strong SEO templates, zero admin)

---

## 9. Legal & publications

| URL | SEO | Admin | Notes |
|-----|-----|-------|-------|
| `/privacy-policy` | 78 | 0 | Static legal |
| `/terms-and-conditions` | 78 | 0 | |
| `/disclaimer` | 75 | 0 | |
| `/refund-policy` | 75 | 0 | |
| `/cookie-policy` | 75 | 0 | |
| `/proceedings`, `/proceeding1-3` | 72 | 0 | proceeding2 = 615 lines inline |
| `/journals`, `/books` | 72 | 0 | |

---

## Cross-cutting gaps (all pages)

| Gap | Affected routes | Priority |
|-----|-----------------|----------|
| No CMS `generateMetadata` | All except `/` | High |
| No breadcrumb JSON-LD | ~60% of pages | Medium |
| No hreflang alternates | Non-locale routes | Medium |
| Hardcoded body content | ~55% of public routes | Critical |
| Admin/datadekh in analytics | All routes | Low |
| Locale homepage without CMS | `/[locale]` | High |

---

## Route inventory count

| Type | Count |
|------|------:|
| Total `page.tsx` | 189 |
| Public content | 111 |
| Legacy redirects | 33 |
| Firebase datadekh (noindex) | 22 |
| Admin CMS | 17 |
| CMS-driven content pages | 3 |

---

## Recommendations (stabilization — not Phase C)

1. Wire `generateMetadata` from CMS SEO for noticeboard + downloads
2. Add `CmsProvider` to `[locale]/page.tsx`
3. Exclude `/admin/*` and `*datadekh*` from analytics tracker
4. Add breadcrumb JSON-LD template to `PublicPageShell`
5. Migrate legal pages to CMS `pages` module (low risk)
6. Apply DB migrations + `npm run seed:cms` on staging

**Phase C remains paused** until stabilization sign-off.
