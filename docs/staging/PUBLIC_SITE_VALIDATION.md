# Public Site Validation — Staging

**Date:** June 2026  
**Method:** Route + loader inventory (runtime not executed — no staging server)

---

## Public routes — Phase A–C

| Route | CMS loader | Fallback | `generateMetadata` | JSON-LD |
|-------|------------|----------|-------------------|---------|
| `/` | ✅ Homepage sections | Hardcoded sections | ✅ CMS | Org, Event, FAQ |
| `/hi` | ✅ Locale homepage | Same | ✅ | Same |
| `/noticeboard` | ✅ | — | ✅ | CollectionPage, NewsArticle |
| `/downloads` | ✅ | — | ✅ | — |
| `/gallery` | ✅ | — | layout meta | — |
| `/press` | ✅ Articles | Legacy list | layout meta | — |
| `/press/[slug]` | ✅ | Legacy registry | ✅ | NewsArticle |
| `/committee/[slug]` | ✅ | 5 legacy editions | ✅ | BreadcrumbList |
| `/speakers` | ✅ | authority-speakers | static meta | BreadcrumbList |
| `/speakers/[slug]` | ✅ | — | ✅ CMS | Person, Breadcrumb |
| `/partners` | ✅ | Static logos | static meta | Breadcrumb, ItemList |
| `/events` | ✅ | conference-catalog | partial meta | CollectionPage |
| `/events/[slug]` | ✅ | — | ✅ CMS | Event, Breadcrumb |
| `/media-center` | ✅ | MediaCenter client | layout meta | — |

---

## SEO checks (code verified)

| Requirement | Status | Notes |
|-------------|--------|-------|
| `generateMetadata()` on CMS routes | ✅ | speakers, events, committee, press |
| Canonical URLs | ✅ | `createPageMetadata()` |
| OpenGraph / Twitter | ✅ | Via metadata builder |
| BreadcrumbList JSON-LD | ✅ | Major public pages |
| hreflang (en/hi) | ⚠️ Partial | 4 pairs only (`/`, intro, registration, contact) |
| Sitemap | ✅ | `sitemap.ts` + CMS merge |
| `/speakers` in sitemap | ⚠️ | Missing from static list |

---

## Hindi homepage

| Check | Status |
|-------|--------|
| Route `/hi` exists | ✅ `src/app/[locale]/page.tsx` |
| CMS locale support | ✅ `ContentLocale` |
| Hindi seed script | ✅ `seed-s2-hi.mjs` (not run) |
| hreflang on `/hi` | ✅ Home pair configured |

---

## Runtime test status

| Page | CMS content visible | Tested |
|------|---------------------|--------|
| Homepage | ❌ Seeds not run | ❌ |
| Hindi homepage | ❌ | ❌ |
| Noticeboard | ❌ | ❌ |
| Downloads | ❌ | ❌ |
| Gallery | ❌ | ❌ |
| Press | ❌ | ❌ |
| Committees | ❌ | ❌ |
| Speakers | ❌ | ❌ |
| Partners | ❌ | ❌ |
| Events | ❌ | ❌ |
| Media Center | ❌ | ❌ |

**Fallback verified in code:** All CMS routes have hardcoded fallback — site will not 500 when CMS empty.

---

## Staging smoke test (manual)

```bash
# After seeds published:
curl -s https://<staging>/speakers | grep -i "Speakers"
curl -s https://<staging>/api/v2/speakers | jq '.speakers | length'
curl -s https://<staging>/sitemap.xml | grep speakers
# Lighthouse on top 5 routes
```

---

## Verdict

| Check | Result |
|-------|--------|
| Public routes implemented | ✅ PASS |
| CMS loaders + fallbacks | ✅ PASS |
| SEO/JSON-LD wired | ✅ PASS (gaps documented) |
| Runtime content verified | ❌ FAIL (seeds not run) |

**Stage 6: PARTIAL PASS** — architecture ready; content verification blocked.
