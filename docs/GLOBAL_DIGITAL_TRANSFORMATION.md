# Shiksha Mahakumbh 2026 — Global Digital Transformation

**Status:** Roadmap approved · Phase 1 implementation in progress  
**Benchmarks:** WEF · UNESCO · TED · IIT/Harvard conferences · Google Events  
**Constraint:** Preserve all routes, registration IDs, Firestore writes, admin roles

---

## Executive Summary — 5-Second Test

| Question | Target answer on first screen |
|----------|-------------------------------|
| What is it? | National–international education summit (6th edition) |
| Why it matters? | NEP 2020, Bharat@2047, research + policy + innovation |
| Who should join? | Educators, researchers, students, institutions, NGOs |
| How to register? | Primary CTA → `/registration` |
| Why credible? | DHE, INIs, Vidya Bharati, past editions, dignitary participation |
| What impact? | Measurable stats, editions timeline, testimonials |

---

## 1. Complete UX Audit

### Current state

| Area | Finding | Severity |
|------|---------|----------|
| First screen | Bento grid (announcement + slideshow + notices) — no single headline | High |
| Visual hierarchy | Brown (`#502a2a`) + scattered hex; no global tokens | High |
| Content | `Info.tsx` — 7 long paragraphs; duplicate welcome (`CompanyInfo`) | High |
| Motion | `triggerOnce: false` — sections re-animate on scroll | Medium |
| Navigation | 483-line NavBar — functional but dense on mobile | Medium |
| Registration | Strong hub; no stepper UI; volunteer/NGO not in hub | Medium |
| Trust | Partners exist but below fold; no testimonials block | Medium |
| Conversion | No sticky CTA, no countdown, modal blocks first visit | High |
| Accessibility | Partial ARIA; contrast on glass cards borderline | Medium |
| i18n | English + inline Hindi only | High (global goal) |

### User journeys

1. **Visitor → Register:** Home → (many scrolls) → NavBar → `/registration` — **friction: 3+**
2. **Researcher → Paper:** Hidden in Academic Council / `/abstract` — **needs hero CTA**
3. **Admin:** Google login works; stats on loaded page only
4. **Mobile:** Hero stacks; tables on legacy datadekh — cards needed Phase 3

### UX principles for redesign

- One hero message, three CTAs, four stats
- Max 2 sentences per card; expand via “Learn more”
- Mobile-first breakpoints: 320 → 375 → 425 → 768 → 1024 → 1440
- Touch targets ≥ 44px; sticky register always visible

---

## 2. Design System

### Layout grid

- Container: `max-w-7xl mx-auto px-4 sm:px-6 lg:px-8`
- Section rhythm: `py-12 md:py-16 lg:py-20`
- Card gap: `gap-4 md:gap-6`
- Bento: 12-column on `lg+`, single column mobile

### Elevation

- `shadow-sm` cards · `shadow-lg` hover · `shadow-2xl` hero overlay

### Motion

- Entrance: 400ms ease-out, `triggerOnce: true`
- Counters: 1.2s on view
- Reduce motion: `prefers-reduced-motion` → disable counters/parallax

### Components (library)

See `src/components/ui/` — HeroCard, StatCard, FeatureCard, TimelineCard, EventCard, SpeakerCard, PartnerCard, SectionHeader, CtaButton.

---

## 3. Color System

| Token | Hex | Usage |
|-------|-----|--------|
| `brand-navy` | `#0B1F3B` | Primary brand, headers, nav accent |
| `brand-navy-light` | `#1E3A5F` | Gradients, hover |
| `brand-saffron` | `#FF9933` | CTAs, badges, India accent |
| `brand-emerald` | `#059669` | Success, verified, growth |
| `brand-surface` | `#F8FAFC` | Page background |
| `brand-surface-warm` | `#FFFBF5` | Alternate sections |
| `primary` (Tailwind) | → navy | Backward-compatible alias |

**Gradients:** `from-brand-navy to-brand-navy-light` (hero only); avoid rainbow clutter.

**Accessibility:** Navy on white ≥ 12:1; saffron buttons use navy text or white text on saffron-dark `#E67E00`.

---

## 4. Typography System

| Role | Font | Size (mobile → desktop) |
|------|------|-------------------------|
| Display | Inter (existing) | 2rem → 3.5rem extrabold |
| H2 section | Inter | 1.5rem → 2.25rem bold |
| H3 card | Inter | 1.125rem → 1.25rem semibold |
| Body | Inter | 0.9375rem → 1rem leading-relaxed |
| Label | Inter | 0.75rem uppercase tracking-widest |
| Hindi accent | System UI / Noto fallback | Inline in hero subtitle |

Load via `next/font` in layout (Phase 2 — split client layout).

---

## 5. Mobile Strategy

### Priority order

1. Hero: single column, CTAs full-width stack
2. Stats: 2×2 grid
3. Cards: 1 column; 2 columns at `sm`
4. Tables (admin/legacy): card layout `< md` (Phase 3)
5. Nav: drawer (existing); reduce mega-menu depth Phase 2

### Testing matrix

| Width | Checks |
|-------|--------|
| 320px | No horizontal scroll; CTA visible |
| 375px | iPhone SE typography |
| 425px | Large phones |
| 768px | Tablet 2-col grids |

---

## 6. SEO Strategy

### Per-page metadata

- Use `createPageMetadata()` on **server** pages
- Home: Organization + Event + FAQ JSON-LD (Phase 1)
- Registration: Event + FAQ
- Academic Council: Article + Event

### Technical

- `sitemap.ts` — expand routes incrementally
- `robots.ts` — keep PII blocks
- Canonical on all public pages
- hreflang when `next-intl` lands (Phase 4)

### Content SEO

- Unique H1 per page
- FAQ blocks for rich results
- Alt text on all hero/gallery images (fix “Image 1” alts)

---

## 7. AdSense Strategy

### Compliance (done / planned)

| Item | Status |
|------|--------|
| Privacy, Terms, Disclaimer, Refund | Done |
| Cookie Policy page | Phase 2 |
| Cookie consent | Done (gate analytics Phase 2) |
| Contact | `/ContactUs` |
| About | `/introduction` |

### Placement rules

- **No ads** in: registration forms, admin, hero first viewport
- **Allowed:** between content sections on long articles, sidebar on proceedings (desktop)
- Max 3 ad units per long page; lazy-load ads after consent

### Analytics (Phase 2)

- GTM container → GA4, Clarity, optional Meta Pixel
- Load only after `smk-cookie-accepted`

---

## 8. Internationalization Plan

### Stack

- `next-intl` with App Router `[locale]` segment
- Locales: `en`, `hi`, `fr`, `es`, `ar` (RTL for `ar`)

### Phased rollout

| Phase | Scope |
|-------|--------|
| 4a | Middleware locale detection + switcher |
| 4b | Home + registration + legal |
| 4c | Nav labels + metadata per locale |
| 4d | Academic Council (large) — split files |

### SEO per locale

- `alternates.languages` in metadata
- Translated titles/descriptions in `messages/{locale}.json`

---

## 9. Component Architecture

```
src/
├── design/tokens.ts          # Single source of truth
├── components/
│   ├── ui/                   # Design system primitives
│   ├── home/                 # Homepage sections
│   ├── forms/                # Registration (existing)
│   └── admin/                # Dashboard (existing)
├── config/site.ts            # Event + schema
└── lib/seo/metadata.ts
```

**Rules:** Pages compose sections; sections compose `ui/*`; no business logic in `ui/*`.

---

## 10. Homepage Redesign (Phase 1)

### New information architecture

1. NavBar + compact Marquee
2. **Hero** — headline, impact, CTAs, dates, venue, inline stats
3. **Trust strip** — DHE / INI / Vidya Bharati logos
4. **Why Attend** — 6 feature cards
5. **Timeline** — 5 editions (visual)
6. **Who Should Attend** — audience cards
7. **Tracks & Experience** — conclaves, research, workshops grid
8. **Upcoming Events** — existing component, new shell
9. **Speakers** — highlight cards (from past editions)
10. **Testimonials** — quotes
11. **Gallery strip** — slideshow (refined)
12. **Venue & Travel** — map, airports, hotels
13. **FAQ** — accordion + schema
14. **Partners** — Conference + Media + Sponsors
15. Footer
16. **Sticky Register** + **FAB**

### Removed from above-fold

- Standalone `CompanyInfo` welcome block (merged into hero)
- Text-heavy `Info` paragraphs (replaced by cards + timeline)

---

## 11. Registration Redesign (Phase 2)

| Feature | Plan |
|---------|------|
| Stepper UI | 3 steps: Personal → Program → Payment/Submit |
| Progress bar | Top of `RegistrationShell` |
| Autosave | `localStorage` draft per type |
| Success | QR code (registration ID), PDF, share |
| Volunteer/NGO | Add to hub or dedicated sub-routes |
| reCAPTCHA | v3 before submit |

---

## 12. Admin Dashboard Redesign (Phase 3)

| Module | Plan |
|--------|------|
| Overview | KPI cards + trend charts (server aggregates later) |
| Registrations | Existing table + server pagination |
| Revenue | Razorpay webhook + `payments` collection |
| Accommodation | Occupancy chart + allocation UI |
| Papers | Link abstract collection |
| Email logs | `emailDeliveryStatus` filter |
| Audit logs | New `audit_logs` collection |
| Certificates | Issue + verify portal |

---

## 13. Accessibility Report

| WCAG AA item | Current | Target |
|--------------|---------|--------|
| Contrast | Partial | Navy/saffron palette verified |
| Keyboard | Nav/menus need audit | Full tab order Phase 2 |
| Screen readers | Missing landmarks | `main`, `nav`, `aria-label` on sections |
| Forms | Labels exist | `aria-invalid`, error announcements |
| Motion | Heavy framer | `prefers-reduced-motion` Phase 1 |

---

## 14. Performance Report

| Metric | Estimate now | Target | Actions |
|--------|--------------|--------|---------|
| Performance | 55–65 | 95 | RSC home metadata, lazy gallery, remove duplicate libs |
| SEO | 70 | 100 | Metadata + schema all pages |
| Accessibility | 75 | 100 | ARIA pass |
| Best Practices | 80 | 100 | HTTPS, headers (done), no console errors |

### Bundle

- Remove: `react-router-dom`, unused express/sequelize (Phase 3)
- Dynamic import: Recharts (admin only), antd Spin → CSS loader

---

## 15. Implementation Roadmap

### Phase 1 — Foundation + Homepage (Week 1–2) **✓ COMPLETE**

- [x] Transformation master doc
- [x] Design tokens + Tailwind (`src/design/tokens.ts`, `brand-*` colors)
- [x] UI component library (`src/components/ui/`)
- [x] Homepage redesign (`src/components/home/HomePage.tsx`)
- [x] Server metadata + JSON-LD on home (`page.tsx`, `HomeJsonLd.tsx`)
- [x] Sticky CTA + FAB + countdown
- [x] `prefers-reduced-motion` in `globals.css`

### Phase 2 — Conversion + SEO + Analytics (Week 3–4)

- Cookie-gated GTM/GA4
- Cookie Policy page
- Registration stepper + autosave
- Success QR + receipt
- Expand sitemap
- Split client layout / server metadata root

### Phase 3 — Admin + Security + Legacy (Week 5–8)

- Admin modules (accommodation, email logs)
- Legacy table → mobile cards
- `/api/sendMail` fix or proxy
- reCAPTCHA
- Firestore rules production deploy

### Phase 4 — International (Week 9–12)

- next-intl setup
- Language switcher in NavBar
- Localized home + registration

### Phase 5 — Polish (Month 4+)

- Full Academic Council visual refactor
- AdSense slots
- Lighthouse 95+ pass
- Certificate system

---

## Risk Register

| Risk | Mitigation |
|------|------------|
| Breaking 107 routes | No route deletes; new components only |
| Primary color change | `primary` maps to navy; test contrast on forms |
| Client layout SEO | Server `page.tsx` wrapper exports metadata |
| i18n URL change | Optional `localePrefix: 'as-needed'` |

---

*Document owner: Digital Transformation initiative · Sync with `AUDIT_REPORT.md` and `TRANSFORMATION_REPORT.md`*
