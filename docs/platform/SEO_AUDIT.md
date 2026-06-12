# SEO Audit — Shiksha Mahakumbh 6.0

**Date:** June 2026  
**Production:** https://www.rase.co.in  
**Routes audited:** 173 pages · ~115 with layout metadata

---

## Executive summary

| Dimension | Score | Status |
|-----------|------:|--------|
| Metadata coverage | 78/100 | Good — most routes have `createPageMetadata` |
| Structured data | 45/100 | Partial — home + pillars only |
| International SEO | 20/100 | Poor — 4 locale routes, no hreflang |
| CMS-driven SEO | 15/100 | Poor — hardcoded titles/descriptions |
| Sitemap | 85/100 | Good — 100+ URLs, missing locales |
| Technical SEO | 80/100 | Good — robots, canonicals, noindex guards |

**Target:** Every CMS entity carries `seo_metadata` — title, description, keywords, canonical, OG, Twitter, JSON-LD, robots, sitemap flag.

---

## Current implementation

### Infrastructure (strong)

| Component | Path | Status |
|-----------|------|--------|
| Metadata factory | `src/lib/seo/metadata.ts` | ✅ `createPageMetadata()` |
| Specialized builders | `src/lib/seo/metadataBuilders.ts` | ✅ Event, Article, Committee, Publication |
| Public page registry | `src/lib/seo/publicPages.ts` | ✅ Central meta map |
| Sitemap | `src/app/sitemap.ts` | ✅ 100+ paths, priority logic |
| Robots | `src/app/robots.ts` | ✅ Admin/datadekh disallowed |
| JSON-LD components | `src/components/seo/` | ✅ Breadcrumb, Organization |
| Middleware noindex | `src/middleware.ts` | ✅ Admin routes blocked |

### Root layout

- `metadataBase`: `NEXT_PUBLIC_SITE_URL`
- Default title: "Shiksha Mahakumbh Abhiyan — National Education Summit"
- Keywords: NEP 2020, education conference India
- Viewport + Inter `display: swap`

---

## Gaps by category

### 1. Routes lacking unique metadata

| Route group | Routes | Issue |
|-------------|--------|-------|
| Registration sub-routes | `/registration/participant`, `/ngo`, `/volunteer`, `/talent`, `/Accomodation` | Inherit homepage meta |
| Legacy orphans | `/BatonCeremony`, `/ResidentialCamp`, `/commingsoon`, `/abhiyaninphotoframe` | No dedicated meta |
| Submission forms | `/heiprojectdisplaysubmission`, `/schoolprojectdisplaysubmission` | Partial/inherited |

### 2. Duplicate URL pairs (canonical risk)

| Legacy | Canonical | Action |
|--------|-----------|--------|
| `/ContactUs` | `/contact-us` | 301 only (exists) — verify single canonical |
| `/Best_Wishes` | `/best-wishes` | Same |
| `/Wishes_Received` | `/wishes-received` | Same |
| `/VibhagRoute/*` | `/departments/*` | Same |
| `/upcomingevent` | `/upcoming-events` | Same |
| `/pastevent` | `/past-events` | Same |
| `/Press1-9` | `/press/*` | Same |

### 3. Missing structured data (JSON-LD)

| Content type | Pages | Schema needed | Status |
|--------------|-------|---------------|--------|
| Event | `/upcoming-events`, `/events` | `Event` | ❌ Missing |
| Press article | `/press/*` (9) | `NewsArticle` / `Article` | ❌ Missing |
| FAQ | Homepage FAQ | `FAQPage` | ❌ Missing |
| Speaker | `/keynotespeakers` | `Person` | ❌ Missing |
| Organization | Site-wide | `Organization` | ✅ Partial |
| Breadcrumb | Most pages | `BreadcrumbList` | ✅ Partial |

### 4. International SEO

| Item | Status |
|------|--------|
| Locales configured | `en`, `hi`, `fr`, `es`, `ar` in `src/i18n/config.ts` |
| Routes with i18n | **4 only** (`/`, `/registration`, `/introduction`, `/ContactUs`) |
| `alternates.languages` in metadata | ❌ Not implemented |
| hreflang tags | ❌ Missing |
| Localized sitemap entries | ❌ Missing |
| Hindi content in DB | ❌ Hardcoded in components only |

### 5. Image SEO

| Issue | Location | Fix |
|-------|----------|-----|
| Missing `alt` on legacy `<img>` | Past event pages, press archives | Admin alt field + audit |
| No dimensions (CLS) | Legacy media components | Width/height from CMS |
| Sponsor logos unlabeled | `organiger.tsx`, `Conference_Support.tsx` | Partner name as alt |

### 6. CMS content SEO (post-migration)

Every admin-managed entity must support:

| Field | Required | Table |
|-------|----------|-------|
| `seo_title` | Yes | `seo_metadata` |
| `meta_description` | Yes | `seo_metadata` |
| `meta_keywords` | Optional | `seo_metadata` |
| `canonical_url` | Yes | `seo_metadata` |
| `og_title`, `og_description`, `og_image` | Yes | `seo_metadata` |
| `twitter_card`, `twitter_title`, `twitter_image` | Yes | `seo_metadata` |
| `schema_json_ld` | Yes (generated + override) | `seo_metadata` |
| `robots` | Yes (`index,follow` default) | `seo_metadata` |
| `sitemap_include` | Yes (boolean) | `seo_metadata` |
| `sitemap_priority` | Optional (0.0–1.0) | `seo_metadata` |
| `sitemap_changefreq` | Optional | `seo_metadata` |

---

## Proposed `seo_metadata` table

```sql
seo_metadata (
  id UUID PK,
  entity_type VARCHAR,  -- notice, event, press_article, committee, speaker, page, ...
  entity_id UUID,
  locale VARCHAR DEFAULT 'en',  -- en, hi, (+ future)
  seo_title VARCHAR,
  meta_description TEXT,
  meta_keywords TEXT[],
  canonical_url VARCHAR,
  og_title, og_description, og_image_url,
  twitter_card, twitter_title, twitter_image_url,
  schema_json_ld JSONB,
  robots VARCHAR DEFAULT 'index,follow',
  sitemap_include BOOLEAN DEFAULT true,
  sitemap_priority DECIMAL,
  sitemap_changefreq VARCHAR,
  created_at, updated_at
)
UNIQUE(entity_type, entity_id, locale)
```

---

## Sitemap expansion plan

| Section | Current | After CMS |
|---------|---------|-----------|
| Static paths | ~100 | Auto-generated from published entities |
| Press articles | Manual in sitemap | Dynamic from `press_articles` |
| Events | Partial | Dynamic from `events` (published) |
| Notices | Missing | Dynamic from `notices` (non-expired) |
| Downloads | Missing | Dynamic from `downloads` |
| Locale URLs | Missing | `/hi/*`, `/en/*` per entity |

---

## Priority remediation (pre-migration)

| # | Action | Effort | Impact |
|---|--------|--------|--------|
| 1 | Add metadata layouts for registration sub-routes | S | High |
| 2 | Add `Event` JSON-LD on upcoming-events | S | High |
| 3 | Add `FAQPage` JSON-LD on homepage | S | Medium |
| 4 | Add `NewsArticle` JSON-LD on press pages | M | High |
| 5 | Implement `seo_metadata` table (Schema V2) | L | Critical for CMS |
| 6 | hreflang for en/hi on core pages | M | High for India reach |
| 7 | Dynamic sitemap from CMS | M | High |
| 8 | Alt-text audit on top 20 pages | M | Medium |

---

## Global reach SEO architecture

```
Content (any table)
  └── content_translations (locale, title, body, slug)
        └── seo_metadata (per locale)
              └── sitemap entry (per locale)
              └── hreflang alternates
```

**Phase 1 locales:** English + Hindi  
**Architecture-ready:** Spanish, French, Arabic, Russian (schema only, no UI yet)

---

## Monitoring

| Tool | Status |
|------|--------|
| Google Search Console | Operator-managed |
| GA4 (consent-gated) | `NEXT_PUBLIC_GA_ID` |
| Sitemap ping | Post-deploy automation |
| Core Web Vitals | See `MOBILE_AUDIT.md` |

**Reference docs:** `docs/PHASE_5_SEO_REPORT.md`, `docs/SEO_AUTHORITY_ARCHITECTURE.md`, `docs/SEO_MONITORING_PLAYBOOK.md`
