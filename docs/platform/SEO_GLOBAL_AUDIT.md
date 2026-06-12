# SEO Global Audit — Shiksha Mahakumbh 6.0

**Date:** June 2026 (Phase B.5 refresh)  
**Production:** https://www.rase.co.in  
**Routes audited:** 173 `page.tsx` · 115 `layout.tsx` with metadata patterns

---

## Overall SEO score: **62/100**

| Dimension | Score | Grade |
|-----------|------:|-------|
| Title & description coverage | 78/100 | B |
| Canonical URLs | 72/100 | B- |
| Open Graph | 70/100 | B- |
| Twitter Cards | 68/100 | C+ |
| JSON-LD structured data | 42/100 | D+ |
| Sitemap completeness | 80/100 | B |
| hreflang / i18n SEO | 18/100 | F |
| CMS-driven SEO (Supabase) | 35/100 | D |
| Technical robots/noindex | 85/100 | A- |

---

## Scoring methodology

Each public route scored 0–10 on:

| Criterion | Weight |
|-----------|--------|
| Unique title + description | 2 |
| Canonical URL | 1 |
| Open Graph (title, desc, image) | 2 |
| Twitter card | 1 |
| JSON-LD appropriate to page type | 2 |
| Sitemap inclusion | 1 |
| hreflang (if locale route) | 1 |

---

## Route group scores

| Route group | Routes | Avg score | Missing items |
|-------------|-------:|----------:|---------------|
| Homepage & pillars | 12 | 8.2/10 | FAQ JSON-LD, CMS-driven meta |
| Registration | 12 | 5.5/10 | Sub-route unique meta, Event schema |
| Events & programs | 22 | 6.8/10 | Event JSON-LD on listings |
| Committees | 8 | 7.0/10 | Person schema for members |
| Press & media | 32 | 6.2/10 | NewsArticle JSON-LD (32 pages) |
| Publications | 10 | 7.5/10 | Publication schema partial |
| Departments | 10 | 7.8/10 | Duplicate canonical pairs |
| Legal & policies | 6 | 9.0/10 | — |
| Noticeboard | 1 | 6.0/10 | CMS SEO not wired to frontend |
| Downloads | 0 | 0/10 | **No public `/downloads` page** |
| Locale i18n (`/[locale]`) | 4 | 4.5/10 | No hreflang alternates |
| Admin / datadekh | 22 | N/A | Correctly noindex |
| Legacy duplicates | 18 | 4.0/10 | Canonical conflict risk |

---

## Critical gaps

### 1. Missing metadata (58 routes)

Routes without dedicated `layout.tsx` or `generateMetadata`:

- `/registration/participant`, `/ngo`, `/volunteer`, `/talent`, `/Accomodation`
- `/BatonCeremony`, `/ResidentialCamp`, `/commingsoon`, `/abhiyaninphotoframe`
- `/heiprojectdisplaysubmission`, `/schoolprojectdisplaysubmission`
- Most `/datadekh/*` routes (correctly noindex but missing descriptions)

### 2. Missing JSON-LD by content type

| Schema | Pages needing it | Status |
|--------|------------------|--------|
| `Event` | 22 event routes | ❌ Not implemented |
| `NewsArticle` | 32 press routes | ❌ Not implemented |
| `FAQPage` | Homepage FAQ | ❌ Not implemented |
| `Person` | Keynote speakers, committees | ❌ Not implemented |
| `Organization` | Site-wide | ⚠️ Partial (`src/config/site.ts`) |
| `BreadcrumbList` | Most content pages | ⚠️ Partial component |
| `WebPage` | CMS pages | ✅ Backend generator exists, not wired |

### 3. Duplicate URL canonical risk (18 pairs)

| Legacy | Canonical | Risk |
|--------|-----------|------|
| `/ContactUs` | `/contact-us` | Medium — 301 exists |
| `/Best_Wishes` | `/best-wishes` | Medium |
| `/Wishes_Received` | `/wishes-received` | Medium |
| `/VibhagRoute/*` | `/departments/*` | Medium |
| `/upcomingevent` | `/upcoming-events` | Medium |
| `/pastevent` | `/past-events` | Medium |
| `/Press1-9` | `/press/*` | High — 9 orphan URLs in sitemap |

### 4. Sitemap gaps

**Current:** `src/app/sitemap.ts` — 100+ static paths  
**Missing from sitemap:**

- `/noticeboard` (now in CMS sitemap API, not merged to `sitemap.ts`)
- `/downloads` (page does not exist)
- Locale alternates (`/hi/*`)
- Individual notice anchors (`/noticeboard#slug`)
- Press legacy `/Press1-9` should be excluded if canonicalized

### 5. hreflang

Only 4 locale routes exist. No `hreflang` link tags. `seo_metadata.hreflang_alternates` field ready in Supabase but unused on frontend.

---

## CMS SEO readiness (Supabase)

| Module | SEO API | Frontend wired | Score |
|--------|---------|----------------|------:|
| Pages CMS | ✅ | ❌ | 3/10 |
| Notices | ✅ NewsArticle auto | ❌ | 4/10 |
| Downloads | ✅ WebPage auto | ❌ | 2/10 |
| Homepage | ✅ on publish | ❌ | 3/10 |
| Events | ❌ Phase C | ❌ | 0/10 |
| Committees | ❌ Phase C | ❌ | 0/10 |
| Press | ❌ Phase D | ❌ | 0/10 |

---

## Top 10 priority fixes

| Priority | Action | Impact |
|----------|--------|--------|
| P0 | Wire `generateMetadata()` on homepage from `/api/v2/homepage` SEO | High |
| P0 | Create `/downloads` public page with CMS SEO | High |
| P0 | Merge `/api/v2/seo/sitemap` into `sitemap.ts` | High |
| P1 | Add Event JSON-LD to `/upcoming-events`, `/events` | High |
| P1 | Add NewsArticle JSON-LD to `/press/*` template | High |
| P1 | hreflang on `/[locale]/*` routes | Medium |
| P2 | FAQ JSON-LD on homepage | Medium |
| P2 | Remove `/Press1-9` from sitemap (canonical to `/press/*`) | Medium |
| P2 | Registration sub-route unique metadata | Medium |
| P3 | Person schema for keynote speakers | Low |

---

## Production readiness (SEO pillar): **62/100**

Backend SEO engine is production-ready. Frontend wiring and JSON-LD coverage are the primary blockers before Firebase cutover.
