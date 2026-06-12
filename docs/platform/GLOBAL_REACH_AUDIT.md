# Global Reach Audit — International Readiness

**Date:** May 2026  
**Current global reach score:** 58/100

---

## Language support

| Language | Code | Routes | CMS locale | UI coverage | Score |
|----------|------|--------|------------|-------------|------:|
| English | `en` | Default (172 routes) | ✅ `ContentLocale.en` | ~95% | 90 |
| Hindi | `hi` | `/[locale]` (4 routes) | ⚠️ Schema supports `hi` | ~15% via next-intl | 35 |
| Other | — | — | Schema ready | 0% | 0 |

### Hindi gaps

- Homepage at `/[locale]` renders without `CmsProvider` — Hindi visitors miss CMS content
- Admin CMS is English-only UI
- No Hindi homepage sections seeded
- Legal pages English only
- Registration forms primarily English

### Recommendations (stabilization)

1. Add `CmsProvider` + `loadCmsPageData('hi')` to locale homepage
2. Seed Hindi homepage sections via admin or `seed:cms` extension
3. Add `hreflang` link tags between `/` and `/hi`
4. **Do not** expand to more locales until Hindi path is complete

---

## Timezones & dates

| Item | Status |
|------|--------|
| Event dates | Hardcoded IST strings ("9–11 October 2026") |
| Notice scheduling | UTC in DB, local display in browser |
| Analytics rollup | Server UTC (`startOfDay()`) |
| ICS/calendar export | ❌ Not implemented |

**Recommendation:** Add `timezone` field to site settings (default `Asia/Kolkata`).

---

## Currencies

| Item | Status |
|------|--------|
| Registration fees | INR via Razorpay (Firebase flow — unchanged) |
| Multi-currency display | ❌ |
| Currency in schema | ❌ |

**No action** until payment flow explicitly requested.

---

## International visitors

| Capability | Status |
|------------|--------|
| Geo tracking (Vercel headers) | ✅ `visitor_locations` table |
| Country in analytics dashboard | ⚠️ Device breakdown only; country widget partial |
| CDN (Vercel) | ✅ Global edge |
| `lang` attribute on `<html>` | ✅ `lang="en"` fixed |

---

## Google indexing readiness

| Factor | Status | Score |
|--------|--------|------:|
| sitemap.xml | ✅ 100+ URLs | 95 |
| robots.txt | ✅ | 95 |
| Mobile-friendly | ✅ | 90 |
| Core Web Vitals | ⚠️ LCP variable | 80 |
| Structured data | ⚠️ Partial | 75 |
| hreflang | ❌ | 30 |
| Canonical URLs | ⚠️ Homepage only dynamic | 60 |
| HTTPS | ✅ | 100 |

**Estimated Google indexing readiness: 78/100**

---

## International SEO

| Item | Status |
|------|--------|
| `meta keywords` | CMS SEO manager |
| Local business schema | Partial (contact JSON-LD) |
| `.in` domain authority | ✅ rase.co.in |
| International backlinks | External (not audited) |
| UTM campaign tracking | ✅ analytics engine |

---

## Country targeting recommendations

1. Default targeting: India (`IN`) — aligns with NEP 2020 / SMK mission
2. Add `geo.region` meta for Himachal Pradesh venue
3. Hindi content for press releases and notices (high impact)
4. Consider `en-IN` and `hi-IN` hreflang codes

---

## Global reach score breakdown

| Pillar | Weight | Score |
|--------|-------:|------:|
| English coverage | 30% | 90 |
| Hindi / i18n | 25% | 35 |
| Technical SEO (indexing) | 25% | 78 |
| Geo / analytics | 10% | 70 |
| Currency / timezone | 10% | 40 |
| **Total** | 100% | **58** |

**Target after stabilization:** 72/100 (Hindi homepage + hreflang + locale CMS)
