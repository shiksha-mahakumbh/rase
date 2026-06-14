# Phase 5A — Brand Consolidation, Route Migration & Legacy Site Removal

**Audit date:** 2026-05-29  
**Status:** PRE-IMPLEMENTATION — awaiting approval before code changes  
**Target brand:** **शिक्षा महाकुंभ अभियान** (Shiksha Mahakumbh Abhiyan)  
**Scope:** Remove split SK/SM branding; unify edition naming to शिक्षा महाकuंभ 1.0–6.0

---

## Executive summary

The codebase already uses **Shiksha Mahakumbh Abhiyan** as the primary site name (`src/config/site.ts`) and **SMK 1.0–5.0** as canonical edition numbers in `src/data/past-editions.ts`. However, **legacy split branding persists** in:

- Two hub pages (`/shikshamahakumbh`, `/shikshakumbh`)
- **sm/sk slug prefixes** on past-event routes that do not match edition numbers
- Page heroes labeling sk routes as **"Shiksha Kumbh"**
- Committee slugs mixing `shikshakumbh*` and `shikshamahakumbh*`
- Media archive paths under `/media/shiksha-kumbh/` vs `/media/shiksha-mahakumbh/`
- External subdomain links (`sm23.rase.co.in`, `sk23.rase.co.in`, etc.)
- Introduction page content (partially updated but not the official DHE text)

**Estimated touch surface:** ~85 source files, ~12 routes to remove/redirect, ~25 SEO metadata keys, CMS DB rows (menus/homepage if seeded), 4 subdomain redirects (Vercel/DNS).

### ⚠️ Approval required — edition mapping conflict

| Legacy route | Current canonical (`past-editions.ts`) | User Phase 5A label mapping |
|--------------|----------------------------------------|----------------------------|
| `/past_event/sm23` | **शिक्षा महाकuंभ 1.0** (NIT Jalandhar) | **शिक्षा महाकuंभ 2.0** |
| `/past_event/sk23` | **शिक्षा महाकuंभ 2.0** (NIT Kurukshetra) | **शिक्षा महाकuंभ 2.0** |
| `/past_event/sk24` | **शिक्षा महाकuंभ 3.0** (NIT Srinagar) | **शिक्षा महाकuंभ 3.0** |
| `/past_event/sm24` | **शिक्षा महाकuंभ 4.0** (Kurukshetra University) | **शिक्षा महाकuंभ 4.0** |
| `/past_event/sm25` | **शिक्षा महाकuंभ 5.0** (NIPER Mohali) | **शिक्षा mahाकuंभ 5.0** |

**Recommendation:** Use **canonical edition numbers 1.0–5.0 from `past-editions.ts`** (aligned with DHE Major Editions in the introduction brief). Treat **SM23 → 2.0** in the user brief as a possible typo (SM23 historically hosted edition 1.0 content). Confirm with DHE before redirect implementation.

---

## 1. Full audit report

### 1.1 Brand violations by category

| Category | Count (approx.) | Severity |
|----------|-----------------|----------|
| Routes with `/shikshamahakumbh` or `/shikshakumbh` | 2 hub + 8 redirect stubs | **Remove + 301** |
| Past event pages with sm/sk slugs | 5 | **Rename labels + redirect** |
| "Shiksha Kumbh" string in UI | ~35 files | **Replace** |
| "Shiksha Mahakumbh" without Abhiyan/edition | ~120+ refs | **Normalize** |
| Committee legacy slugs | 5 | **Redirect or rename** |
| Media edition slug `shiksha-kumbh` | 4 archive paths | **Consolidate** |
| External subdomain links | 4 in tree components | **Remove from UI** |
| Sitemap legacy entries | 7 | **Remove after redirect** |
| SEO metadata keys | 12+ | **Update** |
| CMS/DB seed strings | 3 scripts + migrations | **Re-seed or SQL update** |

### 1.2 What is already correct

- `SITE_NAME` = "Shiksha Mahakumbh Abhiyan" (`src/config/site.ts`)
- `SITE_NAME_HINDI` = "शिक्षा महाकuंभ अभियान"
- `PAST_EDITIONS` uses unified **Shiksha Mahakumbh X.0** titles
- Root layout title includes "Shiksha Mahakumbh Abhiyan"
- Razorpay checkout uses "Shiksha Mahakumbh Abhiyan"
- Registration prefix `SMK2026` (acceptable — not SK/SM split brand)

### 1.3 Introduction page — current vs required

| Item | Current | Required (Phase 5A) |
|------|---------|---------------------|
| Hero title | "Introduction to Shiksha Mahakumbh Abhiyan" | Keep Abhiyan framing |
| Body | `src/app/component/Introduction.tsx` — long mixed EN/Hindi, old edition impact bullets, references "Shiksha Mahakumbh Abhiyan" without official DHE copy | **Replace entirely** with DHE-provided text |
| Objectives graphic | Not present | Optional: include **हमारे उद्देश्य** asset (8 objectives) — asset available in workspace |
| Major Editions | Inline in Introduction.tsx | Structured section matching DHE list (5 editions + themes/core focus) |
| Locale `/hi/introduction` | Separate page | Update hi strings + sync content |

**Primary files to change:**
- `src/app/component/Introduction.tsx`
- `src/app/introduction/IntroductionContent.tsx` (hero subtitle)
- `src/app/introduction/layout.tsx` (metadata)
- `src/lib/seo/publicPages.ts` → introduction entry
- `src/i18n/messages/hi.json` (if hi intro strings exist)

---

## 2. Route inventory

### 2.1 Routes to REMOVE (301 redirect, then delete pages)

| Legacy URL | Action | Redirect target (proposed) |
|------------|--------|----------------------------|
| `/shikshamahakumbh` | Remove from nav/sitemap; 301 | `/introduction` |
| `/shikshakumbh` | Remove from nav/sitemap; 301 | `/introduction` |

### 2.2 Past event routes — label migration (keep URL temporarily with 301 to new canonical)

| Current URL | Current page title | New display name | Canonical edition | Proposed new URL |
|-------------|-------------------|------------------|-------------------|------------------|
| `/past_event/sm23` | Shiksha Mahakumbh 2023 | शिक्षा महाकuंभ **1.0** | 1.0 | `/editions/1.0` or `/past-events/shiksha-mahakumbh-1-0` |
| `/past_event/sk23` | **Shiksha Kumbh 2023** | शिक्षा महाकuंभ **2.0** | 2.0 | `/editions/2.0` |
| `/past_event/sk24` | **Shiksha Kumbh 2024** | शिक्षा महाकuंभ **3.0** | 3.0 | `/editions/3.0` |
| `/past_event/sm24` | Shiksha Mahakumbh 2024 | शिक्षा महाकuंभ **4.0** | 4.0 | `/editions/4.0` |
| `/past_event/sm25` | Shiksha Mahakumbh 2025 | शिक्षा महाकuंभ **5.0** | 5.0 | `/editions/5.0` |

**Interim strategy (minimal breakage):** Keep `/past_event/*` URLs with 301 only if new edition URLs are created; otherwise update in-place labels and add 301 from old sm/sk paths to same content under new slug.

### 2.3 Hub & archive routes (keep, rebrand)

| URL | Current branding | New label |
|-----|------------------|-----------|
| `/introduction` | Partial Abhiyan | Official DHE content |
| `/past-events` | "Shiksha Mahakumbh & Shiksha Kumbh" subtitle | **शिक्षा महाकuंभ अभियान** timeline |
| `/upcoming-events` | "Upcoming Shiksha Mahakumbh events" | **शिक्षा महाकuंभ 6.0** |
| `/upcomingevent` | Legacy alias | Already 301 → `/upcoming-events` ✓ |

### 2.4 NEW route (Phase 5A deliverable)

| URL | Purpose |
|-----|---------|
| `/abhiyan` or `/timeline` | Unified **शिक्षा महाकuंभ अभियान** timeline (1.0–6.0) |

**Recommendation:** `/abhiyan` (matches brand) with anchor links; `/past-events` becomes alias or merges into this page.

### 2.5 Committee legacy routes

| URL | Edition | Proposed redirect |
|-----|---------|-------------------|
| `/committee/shikshamahakumbh2023` | 1.0 | `/committee/shiksha-mahakumbh-1-0` (new slug) |
| `/committee/shikshakumbh2023` | 2.0 | `/committee/shiksha-mahakumbh-2-0` |
| `/committee/shikshakumbh2024` | 3.0 | `/committee/shiksha-mahakumbh-3-0` |
| `/committee/shikshamahakumbh2024` | 4.0 | `/committee/shiksha-mahakumbh-4-0` |
| `/committee/shikshamahakumbh2025` | 5.0 | `/committee/shiksha-mahakumbh-5-0` |

### 2.6 Media archive routes

| Current | Proposed |
|---------|----------|
| `/media/shiksha-kumbh/{year}/{type}` | 301 → `/media/shiksha-mahakumbh/{year}/{type}` |
| `/media/shiksha-mahakumbh/{year}/{type}` | Keep (rename edition label in UI only) |

### 2.7 Already redirected (no change)

Digital/print media stubs, `/pastevent`, `/upcomingevent`, Press1–9 — see `src/config/legacy-redirects.js`.

---

## 3. Menu inventory

### 3.1 Static header (`src/constants/navigation.ts`)

| Item | Path | Legacy brand? | Action |
|------|------|---------------|--------|
| About → Introduction | `/introduction` | No | Update label optional |
| Events → Past Events | `/past-events` | No | Update subtitle in page |
| Events → Upcoming Events | `/upcoming-events` | No | Rename to **6.0** |
| Popular: Upcoming | `/upcoming-events` | No | Same |

**No direct links** to `/shikshamahakumbh` or `/shikshakumbh` in static header ✓

### 3.2 Static footer (`src/app/component/footer-content.ts`)

| Item | Label | Action |
|------|-------|--------|
| programLinks | "Shiksha Mahakumbh 6.0" | → **शिक्षा महाकuंभ 6.0** or bilingual |
| socialLinks | `@ShikshaMahakumbh` | Keep handles (domain/social — separate from route brand) |

### 3.3 Internal knowledge-graph / catalog links

| File | Legacy links | Action |
|------|--------------|--------|
| `src/lib/knowledge-graph/conference-catalog.ts` | `/shikshamahakumbh`, `/shikshakumbh`, sk past events | Remove SK hub; point to `/past-events` or `/abhiyan` |
| `src/lib/knowledge-graph/content-map.ts` | Dual SM/SK titles | Unify |
| `src/data/authority.ts` | Edition cards → sm/sk hrefs | Update hrefs to edition URLs |

### 3.4 Component trees (remove external subdomains)

| File | Legacy content | Action |
|------|----------------|--------|
| `src/app/component/ShikshaMahaKumbhTree.tsx` | Links to `/shikshamahakumbh`, `sm23.rase.co.in`, `sm24.rase.co.in` | Remove or replace with in-app edition links |
| `src/app/component/ShikshaKumbhTree.tsx` | Links to `/shikshakumbh`, `sk23.rase.co.in`, `sk24.rase.co.in` | **Delete component usage** |

### 3.5 CMS menus (database)

Menus seeded empty in `menu.service.ts`; items may exist in production DB from admin. **Post-deploy:** audit CMS → Menus in admin for any SK/SM labels.

---

## 4. SEO inventory

### 4.1 Global config

| File | Key | Current | Target |
|------|-----|---------|--------|
| `src/config/site.ts` | `SITE_NAME` | Shiksha Mahakumbh Abhiyan | ✓ Keep |
| `src/config/site.ts` | `EVENT_NAME` | Shiksha Mahakumbh 6.0 | शिक्षा महाकuंभ 6.0 (display) |
| `src/app/layout.tsx` | default title | "Shiksha Mahakumbh Abhiyan — National Education Summit" | Add Hindi brand in OG |
| `src/types/registration.ts` | `EVENT_NAME` | Shiksha Mahakumbh 6.0 | Align with site.ts |

### 4.2 `publicPages.ts` — keys requiring update

| Metadata key | Current title issue | Target |
|--------------|---------------------|--------|
| `shikshamahakumbh` | "Shiksha Mahakumbh" | **Remove key** (page deleted) |
| `shikshakumbh` | "Shiksha Kumbh" | **Remove key** |
| `pastEventSm23` | Uses SMK 1.0 in SEO | Edition 1.0 Hindi title |
| `pastEventSk23` | SMK 2.0 SEO but page says "Shiksha Kumbh" | **शिक्षा महाकuंभ 2.0** |
| `pastEventSk24` | SMK 3.0 | **शिक्षा महाकuंभ 3.0** |
| `pastEventSm24` | SMK 4.0 | **शिक्षा महाकuंभ 4.0** |
| `pastEventSm25` | SMK 5.0 | **शिक्षा महाकuंभ 5.0** |
| `upcomingEvents` | "Upcoming Shiksha Mahakumbh events" | **शिक्षा महाकuंभ 6.0** |
| `pastEvents` | Mixed archive copy | Abhiyan unified timeline |
| `introduction` | Generic | DHE-aligned description |

### 4.3 Structured data

| Component | File | Action |
|-----------|------|--------|
| Introduction JSON-LD | `src/components/seo/IntroductionJsonLd.tsx` | Update description |
| Organization schema | `src/config/site.ts` | ✓ Already Abhiyan |
| Event schema | `src/config/site.ts` | Rename to **6.0** consistently |
| Breadcrumb JSON-LD | Multiple pages pointing to `/shikshamahakumbh` | Point to `/introduction` or `/abhiyan` |

### 4.4 Sitemap (`src/app/sitemap.ts`)

**Remove after 301:**
- `shikshamahakumbh`, `shikshakumbh` (L81–82)
- Optionally replace `past_event/sm23|sk23|sk24|sm24|sm25` with `/editions/*` or keep with updated lastmod

**Add:**
- `/abhiyan` (unified timeline)
- Updated `/introduction`

### 4.5 hreflang

- `src/lib/seo/hreflang.ts` — introduction pair only; update titles in locale messages

---

## 5. Redirect mapping table

### 5.1 Application routes (add to `legacy-redirects.js`)

| Source | Destination | Type | Priority |
|--------|-------------|------|----------|
| `/shikshamahakumbh` | `/introduction` | 301 | **P0** |
| `/shikshakumbh` | `/introduction` | 301 | **P0** |
| `/past_event/sm23` | `/past-events#edition-1-0` or `/editions/1.0` | 301 | P1 |
| `/past_event/sk23` | `/past-events#edition-2-0` or `/editions/2.0` | 301 | P1 |
| `/past_event/sk24` | `/past-events#edition-3-0` or `/editions/3.0` | 301 | P1 |
| `/past_event/sm24` | `/past-events#edition-4-0` or `/editions/4.0` | 301 | P1 |
| `/past_event/sm25` | `/past-events#edition-5-0` or `/editions/5.0` | 301 | P1 |
| `/committee/shikshakumbh2023` | `/committee/shikshamahakumbh2023` (interim) or new slug | 301 | P2 |
| `/committee/shikshakumbh2024` | `/committee/shikshamahakumbh2024` (interim) or new slug | 301 | P2 |
| `/media/shiksha-kumbh/:year/:type` | `/media/shiksha-mahakumbh/:year/:type` | 301 | P2 |

### 5.2 Subdomain redirects (Vercel/DNS — not in Next.js)

Configure at hosting layer:

| Subdomain | Destination |
|-----------|-------------|
| `sm23.rase.co.in` | `https://www.shikshamahakumbh.com/past-events#edition-1-0` (or 2.0 per DHE confirmation) |
| `sm24.rase.co.in` | `https://www.shikshamahakumbh.com/past-events#edition-4-0` |
| `sk23.rase.co.in` | `https://www.shikshamahakumbh.com/past-events#edition-2-0` |
| `sk24.rase.co.in` | `https://www.shikshamahakumbh.com/past-events#edition-3-0` |

### 5.3 Existing redirects to UPDATE (SK media → unified)

| Current source | Current dest | New dest |
|----------------|--------------|----------|
| `/shikshakumbh2023digitalmedia` | `/media/shiksha-kumbh/2023/digital` | `/media/shiksha-mahakumbh/2023/digital` |
| `/shikshakumbh2024digitalmedia` | `/media/shiksha-kumbh/2024/digital` | `/media/shiksha-mahakumbh/2024/digital` |
| `/printmediashikshakumbh2023` | `/media/shiksha-kumbh/2023/print` | `/media/shiksha-mahakumbh/2023/print` |
| `/printmediashikshakumbh2024` | `/media/shiksha-kumbh/2024/print` | `/media/shiksha-mahakumbh/2024/print` |

---

## 6. File update list

### 6.1 P0 — Introduction & brand hubs

| File | Change |
|------|--------|
| `src/app/component/Introduction.tsx` | Replace with official DHE content |
| `src/app/introduction/IntroductionContent.tsx` | Update hero title/subtitle |
| `src/app/introduction/layout.tsx` | SEO title/description |
| `src/app/[locale]/introduction/page.tsx` | Sync locale metadata |
| `src/app/shikshamahakumbh/page.tsx` | Delete → redirect only |
| `src/app/shikshakumbh/page.tsx` | Delete → redirect only |
| `src/app/shikshamahakumbh/layout.tsx` | Delete |
| `src/app/shikshakumbh/layout.tsx` | Delete |
| `src/config/legacy-redirects.js` | Add hub redirects |

### 6.2 P1 — Past events & timeline

| File | Change |
|------|--------|
| `src/data/past-editions.ts` | Update `href` to new edition URLs; Hindi titles |
| `src/app/past_event/sm23/page.tsx` | Rename hero; or replace with redirect |
| `src/app/past_event/sk23/page.tsx` | Remove "Shiksha Kumbh" branding |
| `src/app/past_event/sk24/page.tsx` | Remove "Shiksha Kumbh" branding |
| `src/app/past_event/sm24/page.tsx` | Edition 4.0 labels |
| `src/app/past_event/sm25/page.tsx` | Edition 5.0 labels |
| `src/app/past-events/page.tsx` | Unified Abhiyan timeline; remove dual subtitle |
| `src/app/upcoming-events/page.tsx` | Label as **6.0** |
| `src/app/upcoming-events/layout.tsx` | Metadata |
| **NEW** `src/app/abhiyan/page.tsx` | Unified timeline page |
| `src/components/authority/PastEditionsSection.tsx` | Edition labels |
| `src/lib/page-heroes.ts` | Remove shikshaKumbh/shikshaMahakumbh heroes |

### 6.3 P1 — Components & internal links

| File | Change |
|------|--------|
| `src/app/component/ShikshaKumbhTree.tsx` | Remove or deprecate |
| `src/app/component/ShikshaMahaKumbhTree.tsx` | Remove subdomain links |
| `src/app/component/Kumbh.tsx`, `MahaKumbh.tsx` | Rebrand or remove |
| `src/app/component/sk23/SK23.tsx`, `sk24/SK24.tsx` | Rename labels |
| `src/app/component/sm23/SM23.tsx`, etc. | Rename labels |
| `src/app/committees/page.tsx` | Breadcrumb → `/introduction` |
| `src/lib/knowledge-graph/conference-catalog.ts` | Remove SK entries |
| `src/lib/knowledge-graph/content-map.ts` | Unify |
| `src/data/authority.ts` | Edition hrefs |
| `src/data/committee-editions.ts` | Slug normalization |
| `src/lib/committee/legacy-registry.ts` | Slug normalization |

### 6.4 P2 — SEO & sitemap

| File | Change |
|------|--------|
| `src/lib/seo/publicPages.ts` | Remove shikshaKumbh keys; update all edition metadata |
| `src/app/sitemap.ts` | Remove legacy paths; add `/abhiyan` |
| `src/config/site.ts` | EVENT_NAME display string |
| `src/app/layout.tsx` | Root metadata |
| `src/lib/seo/mediaArchives.ts` | Unify edition slug |
| `src/data/media-archive-keys.ts` | Remove shiksha-kumbh keys if consolidating |

### 6.5 P2 — Ops/admin (display strings only)

| File | Change |
|------|--------|
| `src/types/registration.ts` | EVENT_NAME |
| `src/app/dashboard/page.tsx` | Portal subtitle |
| `src/app/certificate/verify/[code]/page.tsx` | Verify page brand |
| `src/server/services/email.service.ts` | Template copy (optional) |
| Admin lifecycle docs | Low priority |

### 6.6 P3 — i18n

| File | Change |
|------|--------|
| `src/i18n/messages/hi.json` | Introduction + event strings |
| `src/i18n/messages/fr.json`, `es.json`, `ar.json` | siteName references |

---

## 7. Database content update list

### 7.1 CMS tables (production — verify after deploy)

| Table | Field | Example legacy value | Target |
|-------|-------|---------------------|--------|
| `system_settings` | tagline JSON | "Shiksha Mahakumbh Abhiyan" | ✓ likely OK |
| `homepage_sections` | hero badge/title | "SMK 6.0" / mixed | **शिक्षा महाकuंभ 6.0** |
| `homepage_sections` | FAQ answers | "SMK 6.0" references | Abhiyan / 6.0 |
| `featured_events` | title | "Shiksha Mahakumbh 2026" | **शिक्षा महाकuंभ 6.0** |
| `menu_items` | label/href | Any `/shikshakumbh` links | Remove/update |
| `notices` | title/body | SK/SM split references | Audit via admin |
| `pages` | CMS HTML content | Legacy branding | Manual CMS pass |
| `speaker_profiles` | edition field | "SM24", "SK23" | **2.0**, **3.0**, etc. |
| `events` | title | Mixed | Normalize |

### 7.2 Seed scripts (re-run on staging)

| Script | Action |
|--------|--------|
| `scripts/seed-cms-content.mjs` | Update all SM/SK strings before re-seed |
| `scripts/seed-phase-c-content.mjs` | Committee/event copy |
| `scripts/seed-s2-content.mjs` | Press, FAQ, policies |
| `scripts/seed-s2-hi.mjs` | Hindi copy |

### 7.3 SQL migrations (optional content patch)

| Migration | Content |
|-----------|---------|
| `prisma/migrations/20250621_phase_b_cms/migration.sql` | Site tagline seed — verify |
| `prisma/migrations/20250617_ai_operations/migration.sql` | Email template names — update "Shiksha Mahakumbh" → "शिक्षा महाकuंभ अभियान" |
| `supabase/seed.sql` | Registration counter event name |

### 7.4 Registration engine (keep)

| Item | Notes |
|------|-------|
| `SMK2026-*` registration IDs | **Do not change** — internal ID prefix, not public split brand |
| `registration_counters.prefix` | SMK2026 — OK |

---

## 8. Implementation sequence (post-approval)

1. **Confirm edition mapping** with DHE (SM23 = 1.0 vs 2.0)
2. Add 301 redirects in `legacy-redirects.js`
3. Replace Introduction content + create `/abhiyan` timeline
4. Update `past-editions.ts` hrefs and all past-event page heroes
5. Remove hub pages from sitemap and navigation catalogs
6. Update SEO metadata + regenerate sitemap
7. Configure subdomain redirects in Vercel
8. CMS DB audit + seed script updates
9. Grep verification: `Shiksha Kumbh`, `shikshakumbh`, `/sk23`, `/sm23` → zero UI hits
10. Production smoke test all legacy URLs return 301

---

## 9. Verification checklist (post-implementation)

- [ ] `/shikshamahakumbh` → 301 → `/introduction`
- [ ] `/shikshakumbh` → 301 → `/introduction`
- [ ] No nav/footer/card links to removed hubs
- [ ] No `sk23.rase.co.in` / `sm23.rase.co.in` in rendered HTML
- [ ] Introduction matches DHE official copy
- [ ] Unified timeline shows 1.0–6.0 with year, venue, theme, core focus
- [ ] Past event pages show **शिक्षा महाकuंभ X.0** (not Shiksha Kumbh)
- [ ] Sitemap excludes legacy hub URLs
- [ ] OG/Twitter cards use Abhiyan branding
- [ ] `grep -r "Shiksha Kumbh" src/` returns zero (except redirect comments)
- [ ] Subdomain redirects tested

---

## 10. Approval gate

| Decision | Options | Status |
|----------|---------|--------|
| SM23 edition number | 1.0 (data) vs 2.0 (user brief) | **Pending DHE** |
| New edition URL pattern | `/editions/2.0` vs keep `/past_event/*` with label-only change | **Pending** |
| Timeline page path | `/abhiyan` vs enhance `/past-events` | **Pending** |
| Objectives graphic on Introduction | Include हमारे उद्देश्य image | **Pending** |
| Social handles | Keep @ShikshaMahakumbh vs rename | **Pending** (out of scope?) |
| Domain | Keep shikshamahakumbh.com | **No change recommended** |

**Once approved, reply with:** `Approved — proceed with Phase 5A implementation` (and any decisions from the table above).

---

*Generated for Phase 5A pre-implementation review. No code changes applied in this audit.*
