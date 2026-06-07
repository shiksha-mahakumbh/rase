# Phase 4 — Authority, Content & Global Expansion Findings

**Prerequisite:** Phases 1–3 complete · build passing  
**Constraint:** Do not rework homepage, registration flow, security, or admin core unless required.

---

## Priority 1 — Authority Layer

| Gap | Finding |
|-----|---------|
| Reusable authority blocks | Home has `TrustStrip`, timeline, testimonials — no shared **impact / institutions / government / research** module |
| About (`/introduction`) | Legacy 3-column shell + `CompanyInfo`; no authority narrative |
| Vibhag | Academic Council has local copy only; no cross-page authority strip |
| Data | Stats scattered in marketing copy; not data-driven |

**Plan:** `src/data/authority.ts` + `src/components/authority/*` composed via `AuthoritySections`; mount on introduction + Academic Council overview (compact).

---

## Priority 2 — SEO Rollout

| Area | With metadata | Without |
|------|---------------|---------|
| Core | `/`, registration, legal, intro, contact, abstract, proceedings, gallery, media, journals, pastevent, committeepage, Academic Council | — |
| Press | — | Press1–9, Press_Release |
| Committee years | — | `/committee/*` (4 routes) |
| Publications | partial proceedings | proceeding1–3, books, paper, fulllengthpaper |
| Events | upcoming/pastevent | past_event/*, many one-offs |
| Internal | — | All `*datadekh*`, `/admin`, `/AllData`, noticeboarddata |

**Plan:** Specialized builders (`createEventMetadata`, etc.), expand `publicPages.ts`, route-group layouts, `X-Robots-Tag: noindex` in middleware for internal paths.

---

## Priority 3 — Media Optimization

| Metric | Count / note |
|--------|----------------|
| Legacy `<img>` in `src/` | ~55 instances across 35 files |
| `next/image` on home | TrustStrip, hero (partial) |
| SlideShow / Press / forms | Largest LCP risk |
| Firebase images | `remotePatterns` configured |

**Plan:** `OptimizedImage` wrapper (sizes, lazy, blur, alt); migrate high-traffic components first; forms keep upload previews as-is where dynamic blob URLs apply.

---

## Priority 4 — Global Reach

| Item | Status pre–Phase 4 |
|------|-------------------|
| `next-intl` | Not installed |
| Locales defined | en, hi, fr, es, ar in `config.ts` |
| Messages | `en.json` skeleton only |
| Routes | All at root; no `[locale]` segment |

**Plan:** Install `next-intl`, plugin, middleware chain, `[locale]` for core pages only (home, registration, introduction, contact); `as-needed` prefix; Hindi messages for core keys; real language switcher.

**Note:** Full migration of 118 routes under `[locale]` deferred — avoids breaking existing URLs.

---

## Priority 5 — Analytics & Growth

| Item | Status |
|------|--------|
| GTM/GA4/Clarity/Meta | Consent-gated loader |
| Custom events | None |
| Admin funnel | Registration charts only; no conversion funnel |

**Plan:** `trackEvent()` → `dataLayer` + optional local funnel tallies; hooks on registration/abstract/volunteer/accommodation/brochure; `AdminGrowthAnalytics` from Firestore + funnel storage.

---

## Priority 6 — Performance

| Bundle / area | Risk |
|---------------|------|
| Admin + recharts | ~117 kB admin route |
| Registration hub | ~41 kB |
| Academic Council | ~17 kB (post-split) |
| Root layout | Client + Botpress + duplicate `<title>` in layout vs page metadata |
| Firestore | Client reads; export loads all docs |

**Targets (Lighthouse):** Performance & Accessibility > 95, SEO > 100 — requires image pass, reduce layout head duplication, and production measurement (not automated in CI yet).

---

## Implementation order (this pass)

1. Findings (this doc) — **done**  
2. Authority layer + introduction / Vibhag wiring — **done**  
3. SEO builders + layouts + noindex middleware — **done** (40+ layouts generated)  
4. OptimizedImage + priority migrations — **partial** (Committee, Contact; ~50 `<img>` remain)  
5. next-intl + `[locale]` core routes — **done** (home, registration, introduction, ContactUs)  
6. Analytics + admin growth module — **done**  
7. Build verify — **passing**  

---

## Phase 4 deliverables (reference)

| Area | Key paths |
|------|-----------|
| Authority | `src/data/authority.ts`, `src/components/authority/*` |
| SEO | `src/lib/seo/metadataBuilders.ts`, `scripts/generate-phase4-layouts.mjs` |
| Media | `src/components/media/OptimizedImage.tsx` |
| i18n | `next-intl`, `src/app/[locale]/*`, `src/i18n/messages/*.json` |
| Analytics | `src/lib/analytics/events.ts`, `AdminGrowthAnalytics.tsx` |

---

*Next: migrate remaining `<img>` tags, extend `[locale]` to more routes, Lighthouse audit in production.*
