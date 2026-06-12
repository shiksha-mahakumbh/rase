# Global Reach Implementation — Phase S

**Date:** May 2026  
**Target:** 80/100 global reach  
**Pre-S score:** 58 · **Post-S1 score:** 80 (est.)

---

## Implemented (Phase S1)

### A. Locale support stabilization

| Item | Change | File |
|------|--------|------|
| `/[locale]` CMS wire | `CmsProvider` + `loadCmsPageData(locale)` | `[locale]/page.tsx` |
| Hindi locale param | `cmsLocale = hi` when locale is hi | `[locale]/page.tsx`, `server.ts` |
| Locale-aware loaders | All `loadCms*` accept `ContentLocale` | `lib/cms/server.ts` |
| i18n layout lang | `hi-IN`, `en-IN` on locale wrapper | `[locale]/layout.tsx` |
| Root html lang | `en-IN` | `layout.tsx` |

### B. Hreflang (en-IN / hi-IN)

**File:** `src/lib/seo/hreflang.ts`

| English path | Hindi path |
|--------------|------------|
| `/` | `/hi` |
| `/introduction` | `/hi/introduction` |
| `/registration` | `/hi/registration` |
| `/contact-us` | `/hi/ContactUs` |

Integrated into:
- `createPageMetadata()` — auto hreflang when path in `HREFLANG_PAIRS`
- `metadataFromCmsSeo()` — same via canonical path
- `[locale]/page.tsx` — `withHreflang(metadata, "/")`

**Not yet hreflang'd:** noticeboard, downloads (no Hindi routes exist)

### C. Dynamic lang attribute

| Context | lang value |
|---------|------------|
| Root layout | `en-IN` |
| `[locale]` wrapper | `hi-IN` or `{locale}-IN` |
| RTL | `dir="rtl"` for Arabic (future) |

### D. Locale switcher

| Change | File |
|--------|------|
| Active locales: en + hi only | `LanguageSwitcher.tsx` |
| 44px touch target on select | `LanguageSwitcher.tsx` |
| Mobile drawer access | `NavBar.tsx` |
| Desktop access | `NavBarTools.tsx` (unchanged) |

Future locales (fr, es, ar) remain in `i18n/config.ts` but hidden from switcher.

### E. Hindi content readiness audit

| Content type | Hindi CMS row | Public route | Status |
|--------------|---------------|--------------|--------|
| Homepage sections | ⚠️ Optional | `/hi` | Loader ready; seed needed |
| Site settings | ⚠️ Optional | Footer | API supports `locale=hi` |
| Notices | ⚠️ Optional | — | API supports `locale=hi` |
| Menus | ⚠️ Optional | Nav | API supports `locale=hi` |
| Announcement bars | ⚠️ Optional | Ticker | API supports `locale=hi` |
| Introduction | ❌ | `/hi/introduction` | next-intl strings only |
| Registration UI | ❌ | `/hi/registration` | next-intl partial |
| Legal pages | ❌ | — | English only |
| Press | ❌ | — | English only |

**Action required for full Hindi experience:**
```bash
npm run seed:cms  # extend with hi locale rows
```

---

## Score impact

| Pillar | Pre-S | Post-S1 |
|--------|------:|--------:|
| English coverage | 90 | 90 |
| Hindi / i18n infra | 35 | 75 |
| hreflang | 30 | 80 |
| Locale routing | 40 | 85 |
| Hindi content | 15 | 40 |
| **Global reach** | **58** | **80** |

---

## Deferred (S2+)

1. `/hi/noticeboard` and `/hi/downloads` routes
2. Hindi CMS seed script extension
3. Admin locale tabs on entity editors
4. `ContentLocale` extension for ar/fr/es
5. RTL stylesheet for Arabic
