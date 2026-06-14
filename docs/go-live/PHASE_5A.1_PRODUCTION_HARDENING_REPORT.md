# Phase 5A.1 — Final Cleanup & Production Hardening Report

**Date:** 2026-05-29  
**Scope:** Audit + safe dead-code removal only (no content rewrites)  
**Redirect validation:** `node scripts/test-redirects.mjs` → **PASS** (40 redirects, all permanent, 0 issues)

---

## Executive Summary

Phase 5A brand consolidation is **production-ready** for navigation, SEO registry, sitemap hub removal, and 301 redirect coverage. This audit removed **6 orphaned hub components** with zero inbound references. Remaining legacy strings fall into intentional categories (redirects, committee slugs, historical press, production domain) or are flagged **Replace** for a future content pass (not modified in 5A.1 per scope).

---

## Step 1 — Dead Code Analysis

### Removed (safe cleanup — zero references)

| File | Reason |
|------|--------|
| `src/app/component/Kumbh.tsx` | Orphaned legacy Shiksha Kumbh hub page |
| `src/app/component/MahaKumbh.tsx` | Orphaned legacy Shiksha Mahakumbh hub page |
| `src/app/component/ShikshaKumbhPage.tsx` | Only imported by deleted `Kumbh.tsx` |
| `src/app/component/ShikshaMahaKumbhPage.tsx` | Only imported by deleted `MahaKumbh.tsx` |
| `src/app/component/ShikshaKumbhTree.tsx` | Only imported by deleted `ShikshaKumbhPage.tsx` |
| `src/app/component/ShikshaMahaKumbhTree.tsx` | Only imported by deleted `ShikshaMahaKumbhPage.tsx` |

**Total removed:** 6 files (~14 KB)

### Retained redirect stubs (intentional — SEO 301 fallbacks)

| Route folder | Role |
|--------------|------|
| `src/app/shikshamahakumbh/` | Redirect stub → `/introduction` |
| `src/app/shikshakumbh/` | Redirect stub → `/introduction` |
| `src/app/shikshakumbh2023digitalmedia/` | Redirect stub (backup if next.config bypassed) |
| `src/app/shikshakumbh2024digitalmedia/` | Redirect stub |
| `src/app/shikshamahakumbh2023digitalmedia/` | Redirect stub |
| `src/app/shikshamahakumbh2024digitalmedia/` | Redirect stub |
| `src/app/printmediashikshakumbh2023/` | Redirect stub |
| `src/app/printmediashikshakumbh2024/` | Redirect stub |
| `src/app/printmediashikshamahakumbh2023/` | Redirect stub |
| `src/app/printmediashikshamahakumbh2024/` | Redirect stub |

### Additional dead code candidates (NOT removed — out of scope)

| File | Status | Notes |
|------|--------|-------|
| `src/app/component/Content.tsx` | **Unreferenced** | Contains legacy "Shiksha Kumbh" prose; no imports found |
| `src/app/component/AllData/page.tsx` | Admin/internal | References "Abstract Data SM24" button label |
| Legacy `layout.tsx` files on digital/print media routes | Orphaned metadata | Pages are redirect-only; layouts may still export old SEO keys |

---

## Step 2 — Brand Consistency Scan

Search terms: `Shiksha Kumbh`, `SK23`, `SK24`, `SM23`, `SM24`, `SM25`, `shikshakumbh`, `shikshamahakumbh`

### A. Must Keep

| Location | Term | Reason |
|----------|------|--------|
| `src/config/site.ts` | `shikshamahakumbh.com` | Production domain |
| `src/config/organization.ts`, email services | `@shikshamahakumbh.com` | Production email |
| `src/app/component/footer-content.ts` | Facebook/Instagram URLs | External social handles |
| `src/config/legacy-redirects.js` | `/shikshamahakumbh`, `/shikshakumbh`, media legacy paths | 301 redirect sources |
| `src/constants/canonical-routes.ts` | Legacy media archive keys | Redirect registry |
| `src/lib/seo/mediaArchives.ts` | `shikshakumbh2023digitalmedia` etc. | Internal lookup keys |
| `src/lib/committee/legacy-registry.ts` | Committee slugs | Stable deep-link URLs |
| `src/data/committee-editions.ts`, `content-map.ts`, `sitemap.ts` | `/committee/shikshakumbh2023` etc. | Active committee pages (labels show edition numbers) |
| `src/lib/security/recaptcha.ts` | Domain allowlist | reCAPTCHA verification |
| Component filenames | `SK23.tsx`, `SM24.tsx`, etc. | Internal code identifiers |

### B. Replace (future content pass — NOT modified in 5A.1)

| Location | Issue |
|----------|-------|
| `src/app/component/sm23/SM23.tsx` | Title: `"Shiksha MahaKumbh 2023"` → should be edition **1.0** |
| `src/app/component/sm24/SM24.tsx` | Title: `"Shiksha Mahakumbh 2024"` → should be edition **4.0** |
| `src/app/component/PrintMediaShikshaMahaKumbh2023.tsx` | Heading `"Shiksha Mahakumbh 2024"` |
| `src/app/component/PrintMediaShikshaMahaKumbh2024.tsx` | Heading `"Shiksha Mahakumbh 2024"` |
| `src/app/component/ShikshaMahaKumbh2024DigitalMedia.tsx` | `"Shiksha MahaKumbh 2024"` heading |
| `src/app/component/Feedback.tsx` | Options `shiksha-kumbh-2023/2024`, Hindi `"शिक्षा कुंभ"` |
| `src/app/component/MediaTree.tsx` | Links to `/media/shiksha-kumbh/*` |
| `src/components/media/GlimpsesContent.tsx` | Links to `/media/shiksha-kumbh/*` |
| `src/data/media-archives.ts` | Links to `/media/shiksha-kumbh/*` |
| `src/data/media-archive-keys.ts` | Keys `shiksha-kumbh/2023/*`, `shiksha-kumbh/2024/*` |
| Redirect stub pages (`printmedia*`, `*digitalmedia*`) | Destination still `/media/shiksha-kumbh/*` (next.config overrides to `shiksha-mahakumbh`) |
| `src/app/component/Content.tsx` | Legacy dual-brand prose (file unused) |
| Various registration/press pages | Year-based titles (`Shiksha Mahakumbh 2024`) vs edition numbers |

### C. Historical Archive (preserve verbatim)

| Location | Content |
|----------|---------|
| `src/app/component/ShikshaKumbh2023DigitalMedia.tsx` | Third-party press headlines citing "Shiksha Kumbh" (2023 news URLs) |
| `src/app/press/*/LegacyArticle.tsx` | Historical press article titles |
| `src/app/component/Press*.tsx`, `Baton.tsx`, etc. | Event-specific 2024 coverage copy |

### D. Redirect Only

| Source | Destination | Layer |
|--------|-------------|-------|
| `/shikshamahakumbh` | `/introduction` | `next.config.js` + page stub |
| `/shikshakumbh` | `/introduction` | `next.config.js` + page stub |
| `/shikshakumbh2023digitalmedia` | `/media/shiksha-mahakumbh/2023/digital` | `next.config.js` |
| `/shikshakumbh2024digitalmedia` | `/media/shiksha-mahakumbh/2024/digital` | `next.config.js` |
| `/printmediashikshakumbh2023` | `/media/shiksha-mahakumbh/2023/print` | `next.config.js` |
| `/media/shiksha-kumbh/:year/:type` | `/media/shiksha-mahakumbh/:year/:type` | `next.config.js` |
| All legacy Press1–9, `/pastevent`, `/upcomingevent` | Canonical paths | `next.config.js` |

### Internal code identifiers (not user-facing brand)

| Pattern | Files |
|---------|-------|
| `SK23`, `SK24`, `SM23`, `SM24`, `SM25` | `past_event/*/page.tsx` imports only |
| `SM23` in AllData | Internal admin button label |

---

## Step 3 — URL Audit

### Sitemap (`src/app/sitemap.ts`)

| Check | Result |
|-------|--------|
| `/abhiyan` included | ✅ Yes |
| `/shikshamahakumbh` excluded | ✅ Yes |
| `/shikshakumbh` excluded | ✅ Yes |
| Legacy digital/print media URLs excluded | ✅ Yes (canonical `/media/shiksha-mahakumbh/*` only) |
| Committee legacy slugs included | ⚠️ Yes — intentional for stable committee deep links |

### robots.txt (`src/app/robots.ts`)

| Check | Result |
|-------|--------|
| Sitemap reference | ✅ `${SITE_URL}/sitemap.xml` |
| Hub routes disallowed | N/A — not listed (redirect-only) |
| Admin/API disallowed | ✅ `/admin/`, `/api/`, internal data routes |
| Hub routes in allow | ✅ Public crawl allowed; hubs 301 before index |

### Canonical URLs & metadata

| Check | Result |
|-------|--------|
| `publicPages.ts` hub keys removed | ✅ No `shikshamahakumbh` / `shikshakumbh` |
| `/abhiyan` metadata registered | ✅ |
| Root layout OG | ✅ "Shiksha Mahakumbh Abhiyan" |
| Hub layout metadata | ✅ Removed (pass-through only) |
| Open Graph default | ✅ `/og-default.jpg` via `resolveOpenGraphImage` |

### Discoverability of removed routes

| Route | In sitemap | In nav | In SEO registry | Indexed risk |
|-------|------------|--------|-----------------|--------------|
| `/shikshamahakumbh` | No | No | No | Low — 301 to `/introduction` |
| `/shikshakumbh` | No | No | No | Low — 301 to `/introduction` |
| Legacy media URLs | No | No | Redirect only | Low — 301 chain |

---

## Step 4 — Search Console Readiness

### URL removal recommendations (Google Search Console)

Submit temporary removal requests only if old URLs still appear in search results after deploy + recrawl:

| URL pattern | Action |
|-------------|--------|
| `https://www.shikshamahakumbh.com/shikshamahakumbh` | Allow 301; request removal if cached snippet persists >30 days |
| `https://www.shikshamahakumbh.com/shikshakumbh` | Same |
| `https://www.shikshamahakumbh.com/shikshakumbh2023digitalmedia` | 301 handles; no removal needed if redirect verified |
| `https://www.shikshamahakumbh.com/media/shiksha-kumbh/*` | 301 to `shiksha-mahakumbh`; monitor Coverage report |

**Do not** remove `/introduction`, `/abhiyan`, or `/past-events` — these are canonical replacements.

### Redirect validation checklist

- [x] `node scripts/test-redirects.mjs` passes (40 redirects, all permanent)
- [ ] Post-deploy: `curl -I https://www.shikshamahakumbh.com/shikshamahakumbh` → `301` → `/introduction`
- [ ] Post-deploy: `curl -I https://www.shikshamahakumbh.com/shikshakumbh` → `301` → `/introduction`
- [ ] Post-deploy: `curl -I https://www.shikshamahakumbh.com/shikshakumbh2023digitalmedia` → `301` → `/media/shiksha-mahakumbh/2023/digital`
- [ ] Post-deploy: `curl -I https://www.shikshamahakumbh.com/media/shiksha-kumbh/2023/digital` → `301` → `/media/shiksha-mahakumbh/2023/digital`
- [ ] Verify no redirect chains (script confirms 0 chains)
- [ ] Configure subdomain redirects (infra): `sm23.rase.co.in`, `sk23.rase.co.in`, etc.

### Sitemap submission checklist

- [ ] Deploy Phase 5A + 5A.1 to production
- [ ] Fetch `https://www.shikshamahakumbh.com/sitemap.xml` — confirm `/abhiyan` present, hubs absent
- [ ] Google Search Console → Sitemaps → Submit `sitemap.xml`
- [ ] Request indexing for `/abhiyan` and `/introduction`
- [ ] Monitor Coverage → "Page with redirect" for legacy URLs (expected, not errors)
- [ ] Monitor "Not found (404)" for removed pages (should trend to zero)

---

## Step 5 — Performance Audit

### Duplicate edition datasets (consolidation recommended)

| Source | Used by | Overlap |
|--------|---------|---------|
| `src/data/past-editions.ts` | Abhiyan, past-events, showcase, Info, TreeComponent, JSON-LD | **Canonical** — single source of truth |
| `src/data/authority.ts` → `pastEditions` | `PastEditionsSection` (homepage authority strip) | **Duplicate** — same 6 editions, manually maintained |
| `src/data/committee-editions.ts` | `CommitteeTree` | Edition metadata + committee links (partial overlap) |
| `src/app/abhiyan/page.tsx` | Inline `UPCOMING` constant | Edition 6.0 hardcoded separately |

**Recommendation:** Derive `authority.pastEditions` from `PAST_EDITIONS` + upcoming constant in a future refactor (not done in 5A.1).

### Duplicate page payloads

| Issue | Impact |
|-------|--------|
| `/abhiyan` + `/past-events` + homepage timeline sections | All render edition lists from overlapping sources |
| Media archive keys split `shiksha-mahakumbh` + `shiksha-kumbh` | 8 archive routes where 4 canonical would suffice after key consolidation |

### Unnecessary imports / tracking (addressed in prior session)

| Issue | Status |
|-------|--------|
| Footer POST + analytics POST duplicate DB writes | ✅ Fixed — footer GET-only |
| Full-table count on every visitor rollup | ✅ Fixed |
| Double-encoded logo URL | ✅ Fixed |

### Build / bundle

- Dead hub components removed → smaller bundle, no runtime impact (were unreachable)
- Legacy media components still dynamically imported via `media-archive-components.tsx`

---

## Step 6 — Final Report

### 1. Remaining references (summary)

| Category | Count (approx.) | Action |
|----------|-----------------|--------|
| A — Must keep | ~25 files | None |
| B — Replace | ~15 files | Future content pass |
| C — Historical archive | ~5 files | Preserve |
| D — Redirect only | 40 redirect rules + 10 stub pages | Monitor post-deploy |

### 2. Removed files (this phase)

```
src/app/component/Kumbh.tsx
src/app/component/MahaKumbh.tsx
src/app/component/ShikshaKumbhPage.tsx
src/app/component/ShikshaMahaKumbhPage.tsx
src/app/component/ShikshaKumbhTree.tsx
src/app/component/ShikshaMahaKumbhTree.tsx
```

### 3. Dead routes removed

No new routes removed in 5A.1. Hub routes remain as **301 redirect stubs** (required for SEO). Orphaned **UI components** for hub pages removed.

### 4. SEO validation results

| Item | Status |
|------|--------|
| Sitemap excludes hub paths | ✅ Pass |
| Sitemap includes `/abhiyan` | ✅ Pass |
| `publicPages.ts` hub keys removed | ✅ Pass |
| Nav/footer breadcrumbs unified | ✅ Pass |
| Internal links to hub paths | ✅ None in nav |
| Media links still use `shiksha-kumbh` slug in some UI | ⚠️ Redirected at edge; consolidate in future pass |
| robots.txt | ✅ Pass |

### 5. Redirect validation results

```
node scripts/test-redirects.mjs
→ totalRedirects: 40
→ allPermanent: true
→ issues: []
→ pass: true
```

### 6. Production deployment checklist

**Pre-deploy**
- [x] Phase 5A brand consolidation complete
- [x] Dead hub components removed
- [x] Redirect config validated locally
- [ ] Run `npm run build` after dead-code removal
- [ ] Verify `NEXT_PUBLIC_SITE_URL=https://www.shikshamahakumbh.com` in Vercel production

**Deploy**
- [ ] Deploy to production
- [ ] Smoke-test `/abhiyan`, `/introduction`, `/past-events`
- [ ] Verify 301s for `/shikshamahakumbh`, `/shikshakumbh`

**Post-deploy SEO**
- [ ] Submit sitemap in Search Console
- [ ] Request indexing for `/abhiyan`
- [ ] Monitor redirect coverage (2 weeks)
- [ ] Optional: URL removal for stubborn cached hub URLs

**Post-deploy infra**
- [ ] Subdomain redirects (`sm23/sk23/sm24/sk24.rase.co.in`)
- [ ] Supabase connection pooler if Prisma connection resets persist

**Future Phase 5B (recommended, not in scope)**
- Consolidate `authority.pastEditions` → `PAST_EDITIONS`
- Unify media archive keys (`shiksha-kumbh` → `shiksha-mahakumbh`)
- Update SM23/SM24 component titles to edition numbers
- Remove or refactor orphaned `Content.tsx`
- Align redirect stub page destinations with `legacy-redirects.js`

---

*Report generated as part of Phase 5A.1 — audit and safe cleanup only. No user-facing content was modified.*
