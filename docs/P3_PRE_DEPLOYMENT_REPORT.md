# P3 Pre-Deployment Report — Website Quality, Design & Content

**Status:** Implementation complete — **staging validation recommended before production**  
**Date:** 7 June 2026  
**Prerequisite:** P2 URL modernization complete

---

## Executive Summary

P3 delivered a premium footer redesign, content accuracy fixes, page shell modernization, new Initiatives hub, SEO breadcrumb parity, and navigation canonical updates. **Accessibility and SEO scores meet or approach targets on tested pages. Performance scores on local production build remain below the 90+ target** due to large client-side JavaScript bundles (homepage ~391 kB First Load JS) and Firebase/third-party scripts.

**Deployment recommendation:** Proceed to **staging** for full responsive QA and production Lighthouse. **Do not recommend production cutover** until Performance ≥ 90 on homepage and contact page (or documented CDN/edge mitigation plan is approved).

---

## 1. Pages Redesigned

| Page | Changes |
|------|---------|
| **Homepage** | Hero stats aligned to authority data (500+ institutions); footer redesigned site-wide |
| **Past Events** (`/past-events`) | Removed legacy `CompanyInfo` shell; server component; `bg-brand-surface`; breadcrumb nav added |
| **Best Wishes** (`/best-wishes`) | Synced all 5 editions from `past-editions.ts`; theme labels; canonical breadcrumbs |
| **Footer** (global) | Premium 6-column layout, impact stats strip, department/education sections |
| **Initiatives** (`/initiatives`) | **New** — hub page linking 7 DHE programme pillars |
| **Research** (`/research`) | Added `layout.tsx` with `BreadcrumbJsonLd` |
| **Publications** (`/publications`) | Added `layout.tsx` with `BreadcrumbJsonLd` |
| **Navigation** | Media → `/media-center`; added Press, Research, Publications, Initiatives links |

**Already modern (verified, no structural change):** Committees, Media Center, Merchandise, Contact Us, Department shells.

**Deferred (large scope):** Academic Council inner tab SPA (`AcademicCouncil24.tsx` — 10 sub-pages, heavy client bundle).

---

## 2. Content Corrections Made

| Issue | Resolution | Source |
|-------|------------|--------|
| Homepage hero showed **100+ institutions** | Updated to **500+** matching `authority.ts` | `src/design/tokens.ts` |
| Best Wishes missing **SMK 5.0** | Now derives all editions from `PAST_EDITIONS` | `Best_Wishes.tsx` |
| Best Wishes breadcrumb used `/media` | Changed to `/media-center` | `Best_Wishes.tsx` |
| Footer quick link used `/media` | Changed to `/media-center` | `footer-content.ts` |
| Footer `tudu.co.in//` double slash | Fixed to `tudu.co.in/` | `footer-content.ts` |
| Footer logo path with space | URL-encoded `/logo%202.png` | `footer-content.ts` |
| Past Events used duplicate legacy hero | Removed `CompanyInfo` wrapper | `past-events/page.tsx` |

### Content flagged (not changed — requires DHE verification)

| Item | Location | Note |
|------|----------|------|
| SMK 5.0 hero image | `past-editions.ts` | Reuses `/2024M/press1.jpg` — needs dedicated SMK 5.0 asset |
| Per-edition wishes URLs | `Best_Wishes.tsx` | All editions link to single `/wishes-received` — no per-edition archive URLs exist in codebase |
| Merchandise product data | `Merchandise.tsx` | Hardcoded inline — not in shared data file; prices/availability unverified |
| Chief guest lists | Edition detail pages (`/past_event/*`) | Not cross-audited against latest DHE collateral |
| `authority.ts` vs `past-editions.ts` | Both | Edition facts consistent; `authority.ts` `pastEditions` summary is abbreviated (acceptable) |

**No information was invented.** All corrections used existing canonical data files.

---

## 3. Responsive Issues Fixed

| Fix | Detail |
|-----|--------|
| Past Events page shell | Removed `bg-white` + legacy `CompanyInfo` causing inconsistent mobile header spacing |
| Footer contact emails | Added `break-all` to prevent overflow at 320px |
| Footer grid | `sm:grid-cols-2` → `xl:grid-cols-6` progressive layout |
| Past Editions table | Existing `overflow-x-auto` + `min-w-[640px]` preserved for mobile scroll |
| Best Wishes timeline | Existing horizontal scroll with `min-w-[280px]` cards preserved |

### Responsive audit status

| Breakpoint | Method | Result |
|------------|--------|--------|
| 320px | Code review + Tailwind responsive classes | Pass with table horizontal scroll |
| 375px | Code review | Pass |
| 768px | Code review | Pass |
| 1024px | Code review | Pass |
| Desktop | Code review | Pass |
| Large screens | `max-w-7xl` containers | Pass |

**Note:** Full visual QA on physical devices recommended on staging.

---

## 4. SEO Improvements

| Improvement | Pages |
|-------------|-------|
| `BreadcrumbJsonLd` layouts added | `/research`, `/publications`, `/initiatives` |
| Canonical footer/nav links | `/media-center`, `/press`, `/past-events`, `/contact-us` |
| Sitemap entry added | `/initiatives` (104 URLs total) |
| Initiatives metadata | title, description, keywords, canonical `/initiatives` |

### SEO audit — high-priority pages

| Page | Title | Canonical | OG/Twitter | Breadcrumb schema | Event schema |
|------|-------|-----------|------------|-------------------|--------------|
| Homepage | ✅ | ✅ | ✅ | ✅ (HomeJsonLd) | Partial |
| Past Events | ✅ | ✅ | ✅ | ✅ | Via PastEditionsJsonLd |
| Academic Council | ✅ | ✅ | ✅ | ✅ | ✅ EducationEvent |
| Committees | ✅ | ✅ | ✅ | ✅ | ✅ CollectionPage |
| Media Center | ✅ | ✅ | ✅ | ✅ | ✅ CollectionPage |
| Contact Us | ✅ | ✅ | ✅ | ✅ | ✅ LocalBusiness |
| Research | ✅ | ✅ | ✅ | ✅ (new) | PillarJsonLd |
| Publications | ✅ | ✅ | ✅ | ✅ (new) | Authority hub schema |
| Initiatives | ✅ | ✅ | ✅ | ✅ (new) | — |

**Missing metadata (low priority):** Individual `/past_event/*` slugs use mixed-case paths; metadata exists but titles could be standardized in a future pass.

---

## 5. Accessibility Improvements

| Change | Impact |
|--------|--------|
| Footer link focus rings | `focus-visible:outline` on all footer links |
| Social icons | `aria-label` preserved |
| Best Wishes timeline | `role="list"` / `role="listitem"` preserved |
| Past Events | Semantic `<main id="main-content">` |
| Footer legal nav | `aria-label="Legal and policy links"` |

### Lighthouse accessibility scores (local)

| Page | Score | Target |
|------|-------|--------|
| Academic Council | **96** | 95+ ✅ |
| Media Center | **97** | 95+ ✅ |
| Contact Us | **96** | 95+ ✅ |
| Homepage | **93** | 95+ ⚠️ |

**Homepage a11y gap:** Likely color contrast on saffron/white badges and carousel controls — verify on staging.

---

## 6. Lighthouse Results

**Environment:** Local `next start` on Windows, Lighthouse 12.8.2, headless Chrome.

| Page | Performance | Accessibility | Best Practices | SEO |
|------|-------------|---------------|----------------|-----|
| Homepage | **43** ⚠️ | **93** ⚠️ | **89** ⚠️ | **92** ⚠️ |
| Contact Us | **44** ⚠️ | **96** ✅ | **93** ⚠️ | **92** ⚠️ |
| Academic Council | **72** ⚠️ | **96** ✅ | **96** ✅ | **100** ✅ |
| Media Center | **61** ⚠️ | **97** ✅ | **93** ⚠️ | **100** ✅ |
| Past Events | — | — | — | — |

*Past Events initial run failed (NO_FCP); retry blocked by Chrome temp lock.*

### Core Web Vitals (local)

| Page | LCP | FCP | CLS | TBT |
|------|-----|-----|-----|-----|
| Homepage | 4.7 s | 2.0 s | **0** ✅ | 2,360 ms |
| Contact Us | 4.3 s | 2.4 s | **0** ✅ | 2,240 ms |
| Academic Council | 2.0 s | 1.5 s | **0** ✅ | 1,010 ms |
| Media Center | 4.5 s | 1.8 s | **0** ✅ | 870 ms |

**CLS = 0 on all tested pages** — excellent for Google AdSense readiness.

### Performance root causes

1. Large client bundles: homepage First Load JS ~391 kB
2. Framer Motion across homepage sections
3. Firebase SDK on contact/footer forms
4. Font Awesome brand icons in footer (client bundle)
5. Local dev environment (no CDN edge caching)

**Targets not met:** Performance 90+, Homepage SEO 100, Best Practices 95+ on all pages.

---

## 7. Address Updates

**No address changes made.** Verified against `src/config/organization.ts`:

```
Department of Holistic Education
E7, Orchid Towers, Sector-125, SAS Nagar
Punjab 140301, India

Emails: info@shikshamahakumbh.com, shikshamahakumbh23@gmail.com, academics@shikshamahakumbh.com
Phones: +91 79034 31900, +91 94632 31250
```

Contact page map embed uses matching `mapsQuery`. **Flag for DHE:** confirm Sector-125 address is current official correspondence address for SMK 6.0 collateral.

---

## 8. Footer Updates

### New structure

1. **Impact statistics strip** — 4 metrics from `impactStatistics`
2. **Institutional ecosystem logos** — 13 partner logos
3. **6-column grid (xl):**
   - About + social icons
   - Quick Links (canonical URLs)
   - Departments (5 vibhag routes)
   - Education & Research (hub, research, publications, initiatives)
   - Programs (SMK 6.0, conclave, workshops, olympiad, etc.)
   - Contact (address, email, phone, websites)
4. **Contact form + newsletter** — side-by-side on lg+
5. **Legal bar** — privacy, terms, disclaimer, refund, cookie, sitemap, contact

### Files modified

- `src/app/component/Footer.tsx`
- `src/app/component/footer-content.ts`

---

## 9. Metadata Updates

| Route | File | Change |
|-------|------|--------|
| `/initiatives` | `initiatives/layout.tsx` | New full metadata + breadcrumb JSON-LD |
| `/research` | `research/layout.tsx` | Breadcrumb JSON-LD (metadata in page.tsx) |
| `/publications` | `publications/layout.tsx` | Breadcrumb JSON-LD (metadata in page.tsx) |
| `/past-events` | existing `layout.tsx` | Unchanged — already complete from P2 |
| Sitemap | `sitemap.ts` | Added `initiatives` |

---

## 10. Remaining Recommendations

### Critical (before production)

| # | Item | Priority |
|---|------|----------|
| 1 | **Performance optimization** — code-split homepage sections, lazy-load Framer Motion below fold | Critical |
| 2 | **Re-run Lighthouse on staging** with CDN and production domain | Critical |
| 3 | **Replace SMK 5.0 placeholder image** in `past-editions.ts` | High |
| 4 | **Academic Council bundle** — consider route-based subpages to reduce TBT | High |

### High (post-staging)

| # | Item |
|---|------|
| 5 | Migrate `Merchandise.tsx` product data to `src/data/merchandise.ts` |
| 6 | Per-edition wishes archive URLs (if DHE provides source data) |
| 7 | Standardize `/past_event/*` slug casing (P4 URL pass) |
| 8 | Replace registration form `<img>` captcha with `next/image` (lint warnings) |
| 9 | Homepage a11y contrast audit (target 95+) |
| 10 | Locale routes: migrate `/[locale]/ContactUs` → `/[locale]/contact-us` |

### AdSense readiness

| Check | Status |
|-------|--------|
| CLS-safe layouts | ✅ CLS 0 on tested pages |
| Reserved ad slot regions | ✅ `ReservedAdSlot`, `AdSlotRegion` present |
| Logical content blocks | ✅ Section-based layout |
| `google-adsense-account` meta | ✅ In root layout |
| Performance threshold | ⚠️ Local scores below 90 |

### Visual design (future P3b)

- Migrate legacy maroon `#502a2a` in `CompanyInfo` / `CustomCard` to brand tokens
- Unify `ShowcaseHero` on Contact Us (currently custom hero)
- Academic Council dashboard visual refresh

---

## Validation Summary

| Gate | Status |
|------|--------|
| `npm run build` | ✅ Pass (205 pages) |
| Internal link scan | ✅ 0 broken (128 links) |
| Content accuracy (verified fields) | ✅ Corrected where data existed |
| Footer redesign | ✅ Complete |
| SEO breadcrumbs (priority pages) | ✅ Complete |
| Lighthouse Performance 90+ | ❌ Not met (local) |
| Lighthouse Accessibility 95+ | ⚠️ Partial (3/4 pages) |
| Lighthouse SEO 100 | ⚠️ Partial (2/4 pages at 100) |
| Responsive code audit | ✅ Pass |
| Production deploy | ⏳ **Not recommended yet** |

---

## Files Modified (P3)

```
src/app/component/Footer.tsx
src/app/component/footer-content.ts
src/app/component/Best_Wishes.tsx
src/app/past-events/page.tsx
src/app/initiatives/page.tsx          (new)
src/app/initiatives/layout.tsx        (new)
src/app/research/layout.tsx           (new)
src/app/publications/layout.tsx       (new)
src/design/tokens.ts
src/constants/navigation.ts
src/app/sitemap.ts
docs/P3_PRE_DEPLOYMENT_REPORT.md      (new)
docs/lighthouse/*.json                (audit artifacts)
```

---

## Re-Validation Commands

```bash
cd rase
npm run build
npm run start
node scripts/verify-internal-links.mjs
npx lighthouse https://staging.rase.co.in/ --only-categories=performance,accessibility,best-practices,seo
```

---

*Report generated after P3 implementation. See also `docs/P2_IMPLEMENTATION_REPORT.md` for URL migration status.*
