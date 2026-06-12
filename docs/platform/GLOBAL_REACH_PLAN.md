# Global Reach Plan — Phase S

**Date:** May 2026  
**Current global reach score:** 58/100  
**Target:** 80/100 (S-phase) · 90/100 (full i18n)  
**Status:** Roadmap only — no implementation

---

## Vision

Support Shiksha Mahakumbh, Shiksha Kumbh, DHE, and future conferences for:

- International delegates
- Hindi-speaking domestic audience
- Future Arabic, French, Spanish expansion

**Without architecture changes** — `ContentLocale` enum and per-entity locale fields already exist in Prisma.

---

## Current i18n architecture

| Layer | English | Hindi | Future |
|-------|---------|-------|--------|
| **Routes** | Default (150 public) | `/[locale]` (4 routes) | Schema ready |
| **CMS entities** | `ContentLocale.en` | `ContentLocale.hi` supported | Add enum values |
| **Admin UI** | English only | — | — |
| **next-intl** | Partial | 4 locale pages | Config exists |
| **hreflang** | — | Partial | — |
| **CMS content seed** | ✅ `seed:cms` | ❌ No Hindi seed | — |
| **Registration forms** | Primary | Minimal | — |
| **Legal pages** | English only | — | — |

### Critical gap

`/[locale]/page.tsx` — no `CmsProvider`, no `loadCmsPageData('hi')`. Hindi homepage shows static/i18n strings only, not CMS-managed sections.

---

## Language support plan

### Phase S1 — English + Hindi foundation (weeks 1–4)

| # | Task | Impact |
|---|------|--------|
| 1 | Wire `/[locale]` homepage to CMS with `locale=hi` | Hindi CMS content live |
| 2 | Seed Hindi homepage sections (`npm run seed:cms` extension) | Content available |
| 3 | Hindi site settings row (`SiteSetting` locale=hi) | Footer/contact in Hindi |
| 4 | hreflang tags: `/` ↔ `/hi` | Google indexing |
| 5 | Locale switcher in NavBar | User discovery |
| 6 | CMS admin locale tabs (en/hi) on homepage, notices, settings | Editor workflow |
| 7 | Hindi noticeboard content (5–10 seed notices) | High-traffic page |
| 8 | `lang` attribute dynamic per route | Screen readers |

**Target after S1: 72/100**

### Phase S2 — Hindi content expansion (weeks 5–8)

| # | Task |
|---|------|
| 1 | Migrate introduction to CMS page (en + hi) |
| 2 | Legal pages CMS with Hindi versions |
| 3 | Press articles — priority 3 articles in Hindi |
| 4 | Registration UI strings via next-intl (no flow change) |
| 5 | FAQ module with locale |
| 6 | SEO hreflang on all CMS-managed pages |

**Target after S2: 80/100**

### Phase S3 — Future multilingual readiness (weeks 9–16)

| # | Task |
|---|------|
| 1 | Extend `ContentLocale` enum: `ar`, `fr`, `es` |
| 2 | Locale routing pattern `/[locale]/*` for all CMS pages |
| 3 | Fallback chain: requested locale → en → first available |
| 4 | Admin UI locale selector on all entity editors |
| 5 | Translation workflow (draft per locale, publish independently) |
| 6 | RTL support for Arabic (CSS `dir="rtl"`) |

**Target after S3: 90/100**

---

## hreflang & locale SEO

### Required hreflang pairs (S1)

| English URL | Hindi URL | hreflang codes |
|-------------|-----------|----------------|
| `/` | `/hi` | `en-IN`, `hi-IN` |
| `/introduction` | `/hi/introduction` | `en-IN`, `hi-IN` |
| `/noticeboard` | `/hi/noticeboard` (new route) | `en-IN`, `hi-IN` |
| `/contact-us` | `/hi/ContactUs` | `en-IN`, `hi-IN` |

### CMS SEO integration

Populate `SeoMetadata.hreflangAlternates` JSON:

```json
{
  "en-IN": "https://www.rase.co.in/noticeboard",
  "hi-IN": "https://www.rase.co.in/hi/noticeboard",
  "x-default": "https://www.rase.co.in/noticeboard"
}
```

### Google Search Console

- Submit both `/` and `/hi` sitemap entries
- Set geographic target: India (primary), International (secondary)
- Monitor hreflang errors after S1 deploy

---

## Timezone & regional settings

| Setting | Current | Target |
|---------|---------|--------|
| Event dates | Hardcoded IST strings | `timezone` in SiteSetting (`Asia/Kolkata`) |
| Notice scheduling | UTC in DB | Display in IST with locale format |
| Analytics rollup | Server UTC | Dashboard toggle IST/UTC |
| Date formatting | Browser locale | `next-intl` date formatter per locale |

---

## Currency (no change in S-phase)

- Registration fees remain INR via Razorpay
- Display-only multi-currency (USD/EUR estimate) — Phase D optional
- **Do not modify payment flow** per mandate

---

## International visitor support

| Capability | Today | S-phase target |
|------------|-------|----------------|
| Geo tracking | ✅ `visitor_locations` | Country widget in analytics |
| CDN | ✅ Vercel global edge | — |
| `lang` on `<html>` | Fixed `en` | Dynamic per route |
| International SEO | Weak | hreflang + en-IN/hi-IN |
| Delegate-facing content | English only | Hindi + English |
| Accommodation/travel info | CMS partial | Structured locale fields |

---

## ContentLocale schema (already exists)

```prisma
enum ContentLocale {
  en
  hi
}
```

**Extension for future (no migration risk if planned):**

```prisma
enum ContentLocale {
  en
  hi
  ar
  fr
  es
}
```

All CMS entities (`Page`, `Notice`, `Download`, `SiteSetting`, `SeoMetadata`, `AnnouncementBar`, `Menu`) already have `locale` field.

---

## Admin workflow for multilingual content

| Step | Workflow |
|------|----------|
| 1 | Editor selects locale tab (en / hi) in entity editor |
| 2 | Content saved to same entity ID with locale discriminator |
| 3 | SEO panel shows locale-specific metadata |
| 4 | Publish per locale independently |
| 5 | Preview URL includes locale prefix |
| 6 | Fallback: if hi missing, show en with banner |

---

## Score projection

| Milestone | Global reach |
|-----------|-------------:|
| Current | 58 |
| After S1 (Hindi homepage + hreflang) | 72 |
| After S2 (Hindi content expansion) | 80 |
| After S3 (ar/fr/es ready) | 90 |

---

## Implementation priority

| # | Task | Effort | Score gain |
|---|------|--------|----------|
| 1 | CmsProvider on `/[locale]` | 1 day | +8 |
| 2 | Hindi CMS seed | 1 day | +5 |
| 3 | hreflang homepage | 0.5 day | +4 |
| 4 | Locale switcher NavBar | 1 day | +3 |
| 5 | Admin locale tabs | 2 days | +2 |
| 6 | Hindi noticeboard route | 2 days | +4 |
| 7 | Dynamic `lang` attribute | 0.5 day | +2 |
| 8 | Site settings hi row | 1 day | +3 |

**S1 total: ~2 weeks → score 72**
