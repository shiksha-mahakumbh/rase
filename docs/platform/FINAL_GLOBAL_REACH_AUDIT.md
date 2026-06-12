# Final Global Reach Audit

**Date:** May 2026  
**Auditor role:** Product Owner + Solution Architect  
**Locales:** English (primary), Hindi (secondary)  
**Target:** 95+  
**Current score:** **64 / 100**  
**Maximum achievable (pre-Phase D):** **93 / 100**

---

## i18n architecture

| Component | Implementation | File |
|-----------|----------------|------|
| Routing | `next-intl` with `localePrefix: "as-needed"` | `src/i18n/routing.ts` |
| Configured locales | `en`, `hi`, `fr`, `es`, `ar` | `src/i18n/routing.ts` |
| Active locales | **en + hi only** | `LanguageSwitcher.tsx` |
| CMS locale | `ContentLocale` enum (`en` \| `hi`) | `prisma/schema.prisma` |
| Message files | `messages/hi.json` (~30 strings) | `messages/` |
| hreflang pairs | 4 paths only | `src/lib/seo/hreflang.ts` |

---

## English coverage

~**95%** of public routes are English-primary at root paths (`/introduction`, `/registration`, `/contact-us`). CMS loaders default to `locale: "en"` in `src/lib/cms/server.ts` and `organizational.ts`.

---

## Hindi coverage

### Routes with Hindi URLs (4 pairs)

| English | Hindi | CMS body |
|---------|-------|----------|
| `/` | `/hi` | Homepage CMS (when hi records published) |
| `/introduction` | `/hi/introduction` | Partial — layout meta only |
| `/registration` | `/hi/registration` | Registration flow (Firebase, not CMS body) |
| `/contact-us` | `/hi/ContactUs` | ⚠️ Casing inconsistency |

### CMS entities with Hindi support (schema-ready)

| Entity | `locale` column | Seed content |
|--------|-----------------|--------------|
| Homepage sections | ✅ | Partial via S2 |
| Pages (legal, departments) | ✅ | S2 seed |
| Press articles | ✅ | 1+ hi articles in S2 seed |
| Notices | ✅ | Schema ready |
| Committees | ✅ | `seed-phase-c-content.mjs` |
| Speakers | ✅ | Seed script |
| Partners | ✅ | Seed script |
| Events | ✅ | Seed script |
| Media Center | ✅ | Seed script |

**Reality:** Most public pages call loaders with default `"en"`. Hindi CMS content exists only after seed publish; public pages do not pass locale from i18n context.

---

## hreflang audit

| Check | Status |
|-------|--------|
| `HREFLANG_PAIRS` defined | ✅ 4 pairs |
| `withHreflang()` on home | ✅ |
| Hindi alternate pages get hreflang | ❌ Intro/reg/contact pass `/hi/...` paths that don't match pair keys |
| Legal pages hreflang | ❌ English only |
| Organizational pages hreflang | ❌ No hi alternates |
| Sitemap hreflang | ❌ URL-only entries, no `xhtml:link` alternates |
| `x-default` strategy | ⚠️ Only on 4 pairs |

---

## Locale routing issues

| Issue | Detail | Severity |
|-------|--------|----------|
| Dormant locales | `fr`, `es`, `ar` in config but no pages — false global signal | Medium |
| URL inconsistency | `/hi/ContactUs` (PascalCase) vs `/contact-us` (kebab) | Medium |
| Root `html lang` | Always `en-IN` in `layout.tsx` | High for hi pages |
| OG locale | Hardcoded `en_IN` in `cms-metadata.ts` | Medium |
| `WebSite.inLanguage` | Declares `["en-IN","hi-IN"]` in JSON-LD | ✅ |
| Language switcher | Only en/hi exposed | ✅ Correct for current scope |

---

## Untranslated content (by area)

| Area | Hindi status |
|------|-------------|
| Knowledge graph (27 routes) | ❌ English only |
| Past editions (10 routes) | ❌ English only |
| Proceedings (6 routes) | ❌ English only |
| Departments (5 routes) | ⚠️ CMS-ready, mostly en fallback TSX |
| Committee legacy (5 editions) | ❌ English only TSX |
| Press legacy (9 articles) | ⚠️ Some hi-titled, body mostly en |
| Registration forms | ⚠️ hi route exists, form labels partial |
| Legal pages | ⚠️ CMS-ready, en fallback JSX |
| Homepage hardcoded sections | ❌ English only |
| Admin CMS UI | ❌ English only (acceptable) |

---

## Fallback issues

| Scenario | Behavior | Risk |
|----------|----------|------|
| User switches to Hindi on non-paired route | No `/hi` equivalent — stays English | High UX gap |
| CMS hi record missing | Falls back to English hardcoded content | Medium |
| `/hi` home with no hi CMS seed | English fallback sections render | Medium |
| hreflang points to `/hi/ContactUs` | Crawlers may 404 if route mismatch | Medium |

---

## Score breakdown

| Factor | Weight | Score | Notes |
|--------|-------:|------:|-------|
| Hindi route coverage | 25% | 15 | 4 of ~120 routes |
| CMS locale infrastructure | 20% | 85 | Schema + loaders ready |
| Hindi content published | 20% | 40 | Seed exists, not deployed |
| hreflang correctness | 15% | 35 | 4 pairs, broken alternates |
| UI translations | 10% | 30 | Nav/registration only |
| Document-level locale | 10% | 25 | `html lang` fixed en-IN |

**Weighted: 64 / 100**

---

## Path to 95+

| Action | Impact | Effort |
|--------|--------|--------|
| Pass locale from i18n into all CMS loaders | +15 | 3 days |
| Publish hi seed content (`--publish`) | +10 | 1 day |
| Extend hreflang to top 20 routes | +8 | 2 days |
| Fix `/hi/ContactUs` → `/hi/contact-us` | +2 | 2h |
| Set `html lang` per locale at document level | +5 | 1 day |
| Translate homepage hardcoded sections | +5 | 3 days |
| Remove dormant fr/es/ar from routing config | +2 | 1h |
| Hindi department + legal CMS publish | +8 | 1 week |
| Bulk hi committee/press migration | +5 | 1 week |

**Estimated time to 95:** 3–4 weeks (content + engineering)

**Maximum achievable without full knowledge-graph hi translation:** **93**
