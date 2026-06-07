# Project Enterprise Audit — Shiksha Mahakumbh (rase.co.in)

**Role:** Pre-change audit (Phases 1–10)  
**Date:** June 2026  
**Stack:** Next.js 15.0.7 · React 18 · TypeScript · Tailwind · Firebase · next-intl  
**Scope:** ~457 TS/TSX files under `src/` · **117** `page.tsx` routes · **75** files in `src/components/`

**Constraint:** Do **not** blindly move files. Preserve registration (`/registration`, Firestore `SMK2026-*`), admin, analytics, and production URLs. Enterprise layout is a **phased target**, not a single PR.

---

# 1. Current architecture analysis

## 1.1 Actual structure (today)

```
rase/
├── src/
│   ├── app/                    # App Router (primary)
│   │   ├── page.tsx            # Home (canonical)
│   │   ├── [locale]/           # 4 localized routes only
│   │   ├── registration/       # SMK 6.0 wizard (production)
│   │   ├── admin/              # Auth + exports + health UI
│   │   ├── api/                # health, email, captcha, webhooks
│   │   ├── component/          # ~120 legacy components (NOT ideal location)
│   │   ├── knowledge/, introduction/, proceedings/, …
│   │   ├── Press1–9/, past_event/, *datadekh*/
│   │   ├── layout.tsx, RootClientShell.tsx, globals.css
│   │   ├── middleware.ts, sitemap.ts, robots.ts
│   │   └── error.tsx, not-found.tsx, global-error.tsx
│   ├── components/             # Modern layer (home, forms, admin, authority)
│   ├── lib/                    # SEO, analytics, registration, ecosystem
│   ├── data/                   # authority.ts, speakers
│   ├── design/tokens.ts        # Partial design system
│   ├── constants/, config/, i18n/, types/
│   └── middleware.ts
├── public/                     # Static assets (images; large tree on disk)
├── firebase/                   # firestore.rules, storage.rules
└── docs/                       # 25+ operational reports (Phases 1–8)
```

## 1.2 Dual-stack reality

| Layer | Era | Purpose |
|-------|-----|---------|
| **Modern** | Phases 1–8 | Home redesign, `RegistrationHub`, admin pagination, SEO helpers, knowledge hub, i18n (partial), monitoring |
| **Legacy** | Pre-2025 | `app/component/*`, `*datadekh*`, old registration forms, Press clones, `CompanyInfo` 3-column layout |

**Production-critical path:** `RegistrationHub` → `components/forms/*` → `lib/saveRegistration.ts` → Firestore `registrations`.

**Legacy still routable:** `/abstract`, `/DelegateForm`, `app/component/Registration/*`, duplicate datadekh copies.

## 1.3 Routing model (post Phase 8 fix)

| URL pattern | Resolver |
|-------------|----------|
| `/`, `/gallery`, `/knowledge`, … | Root `app/**/page.tsx` |
| `/hi/*`, `/fr/*`, … | `intlMiddleware` → `app/[locale]/**` (4 routes) |
| `/api/*`, `*.xml`, `*.txt` | Route handlers / metadata routes |

---

# 2. Problems found (Phase 1 checklist)

## 2.1 Duplicate files

| Duplicate | Location | Action |
|-----------|----------|--------|
| `participantregistrationdatadekh` | `page.tsx` + `participantregistrationdatadekh copy/` | Delete **copy** after redirect |
| `ngoregistrationdatadekh` | `page.tsx` + `ngoregistrationdatadekh copy/` | Delete **copy** |
| Home / intro / registration / Contact | Root + `[locale]/*` | Keep both until unified i18n; document canonical |
| Registration forms | `components/forms/*` vs `app/component/Registration/*` | Deprecate legacy; keep routes 301 → `/registration` |
| `academiccouncil/page.tsx` (863 lines) vs `VibhagRoute/AcademicCouncil24` | Split council | Redirect old → new |
| `proceeding1/2/3` vs `proceedings/` | Overlap | Consolidate content into `proceedings` |
| Press **1–9** | ~95% identical `page.tsx` | Merge to `[press]/[slug]` or shared `PressArticle` |

## 2.2 Unused / low-value files

| Item | Evidence |
|------|----------|
| `react-router-dom` | Used in **1** file (`sm24/SM24.tsx`) only |
| `express`, `sequelize`, `mysql2`, `bcrypt`, `jwt` | No App Router server usage found |
| `path` npm package | Redundant with Node built-in |
| `latest` package | Non-standard dependency |
| `LanguageSwitcherPlaceholder.tsx` | Superseded by `LanguageSwitcher` |
| `firebase1.ts` (if present) | Second Firebase app — verify dead |
| `components/common/AdSlotPlaceholder.tsx` | Superseded by `ReservedAdSlot` |

## 2.3 Unused components (candidates)

Legacy under `app/component/` not imported by modern home/registration:

- `RegistrationForm.tsx`, legacy `DelegateForm.tsx` (under `component/Registration/`)
- Duplicate workshop copies under `component/` vs `past_event/` routes (workshops routed via `past_event`)

**Rule:** Before delete, run import graph (`grep -r "from '@/app/component"`).

## 2.4 Unused images

- `public/` not fully enumerated in CI; **manual pass** required (thousands of assets referenced by path string).
- Orphan risk: `/2024K/`, `/english_event/` referenced only from legacy workshops.
- **Action:** Asset audit script (Phase 2) — do not delete without reference scan.

## 2.5 Unused stylesheets

| File | Notes |
|------|-------|
| `globals.css` | Active (Tailwind + custom) |
| `slick-carousel/slick/*.css` | Imported per workshop slider page |
| No separate CSS modules mass | Tailwind-first ✓ |

## 2.6 Repeated code

| Pattern | Occurrences |
|---------|-------------|
| Press pages 1–9 | Same layout + WhatsApp share blocks |
| `*datadekh*` pages | Firestore table + export patterns |
| `addkeynotespeaker`, `addvcdirector`, `addwishesreceived` | ~292 lines each, near-identical |
| `CompanyInfo` + Nav + Footer | 50+ pages |
| Metadata | `createPageMetadata` vs inline vs missing |

## 2.7 Poor folder organization

| Issue | Impact |
|-------|--------|
| `app/component/` (120 files) | Breaks Next.js convention; hard to discover |
| Mixed casing (`ContactUs`, `VibhagRoute`, `Accomodation`) | URL + import inconsistency |
| Business logic in pages | `admin/page.tsx` ~410 lines, `noticeboarddata` ~400 |
| No `services/` layer | Firebase calls scattered |

## 2.8 Naming inconsistencies

| Area | Examples |
|------|----------|
| Routes | `pastevent` vs `past_event`, `Accomodation` vs `Accommodation` |
| Collections | Historical `Regestration*` typos in legacy |
| Folders | `component` vs `components` |

## 2.9 Large files — should split

| File | ~Lines | Split strategy |
|------|-------:|----------------|
| `app/academiccouncil/page.tsx` | 863 | Redirect to Academic Council24; archive |
| `app/proceeding1/page.tsx` | 683 | Extract volume data + shared shell |
| `app/proceeding2/page.tsx` | 626 | Same |
| `app/admin/page.tsx` | 410 | Extract panels (already partial components) |
| `app/noticeboarddata/page.tsx` | 400 | Admin CRUD → `components/admin/` |
| `app/Press1/page.tsx` | 209 | Shared `PressArticleLayout` |

Academic Council **already split** into `app/component/Vibhag/academic/pages/*` (Phase 3) ✓

## 2.10 Components to merge

| Merge into | From |
|------------|------|
| `PressArticlePage` + dynamic `[id]` | Press1–9 |
| `DatadekhTable` | *datadekh* variants |
| `ProceedingsVolume` | proceeding1/2/3 |
| `RegistrationFormWrapper` (exists) | Legacy registration UIs |

## 2.11 SEO issues

| Issue | Severity |
|-------|----------|
| **~100/117 pages** without `generateMetadata` / layout metadata | High |
| Press pages wrong `shareUrl` (point to other Press URLs) | Medium |
| Locale URLs not in `sitemap.ts` | Medium |
| `hreflang` not in metadata | Medium |
| Thin duplicate URLs (`commingsoon`, legacy registration) | Medium |
| **Fixed:** robots/sitemap/health (vercel + middleware) | Deploy-dependent |

## 2.12 Performance issues

| Issue | Impact |
|-------|--------|
| Production LCP **9–12s** (lab) | Critical |
| Global client shell (`RootClientShell`) | All pages hydrate |
| `Footer` + Firebase visitor counter on every page | Extra client JS |
| antd + NextUI + Tailwind | Duplicate UI systems |
| Admin `recharts` | Mitigated via dynamic import |
| **~15** remaining raw `<img>` | Low–medium |
| OneDrive + `.next` corruption | Dev stability |

## 2.13 Accessibility issues

| Issue | Notes |
|-------|-------|
| Announcement modal | Session-gated; focus trap review |
| Emoji in headings (legacy / academic) | Screen reader noise |
| Datadekh tables | Horizontal scroll on mobile |
| Registration wizard | Stronger (95 Lighthouse a11y) |
| Missing skip links on legacy `CompanyInfo` pages | Medium |

## 2.14 Mobile responsiveness

| Area | Status |
|------|--------|
| Home (Phase 1–2) | Good — sticky CTA, responsive grid |
| Registration hub | Good |
| Legacy 3-column `CompanyInfo` | Poor on small screens |
| Admin tables | Cards added in Phase 4; still dense |
| Press / proceedings | Fixed widths in places |

---

# 3. Target enterprise structure (Phase 2 — phased, not big-bang)

Proposed **eventual** layout (map 1:1 from current URLs via rewrites first):

```
src/
├── app/
│   ├── (public)/              # Route group — no URL change
│   │   ├── page.tsx           # /
│   │   ├── gallery/
│   │   ├── knowledge/
│   │   ├── introduction/
│   │   ├── registration/      # UNCHANGED URL
│   │   └── …
│   ├── (legal)/               # privacy, terms, cookie, refund
│   ├── (admin)/               # admin/* + datadekh (protected)
│   ├── (locale)/[locale]/     # hi, fr, es, ar only
│   ├── api/
│   ├── layout.tsx
│   └── …
├── components/
│   ├── ui/          # exists — extend
│   ├── layout/      # NavBar, Footer, CompanyInfo → migrate from app/component
│   ├── home/        # exists
│   ├── sections/    # authority strips
│   ├── forms/       # exists
│   ├── navigation/  # from navbar/
│   └── shared/
├── lib/             # exists
├── services/        # NEW — firestore, email, payments facades
├── hooks/           # NEW — extract from pages
├── constants/       # exists
├── types/           # exists
├── data/            # exists (static content)
├── styles/          # globals + tokens
└── i18n/            # exists
```

**Do not** rename public URLs (`/ContactUs`, `/VibhagRoute/AcademicCouncil24`) without `next.config.js` redirects.

---

# 4. Files to move (incremental plan)

| From | To | Phase |
|------|-----|-------|
| `app/component/NavBar.tsx` | `components/navigation/NavBar.tsx` | Q2 |
| `app/component/Footer.tsx` | `components/layout/Footer.tsx` | Q2 |
| `app/component/CompanyInfo.tsx` | `components/layout/LegacyPageShell.tsx` | Q2 |
| `app/component/home/*` | Already mirrored in `components/home/` | Done |
| `lib/saveRegistration.ts` | `services/registration/save.ts` | Q3 |
| Static content registries | `data/` (already partial) | Q1 |

---

# 5. Files to merge

| Targets | Sources |
|---------|---------|
| `components/press/PressArticle.tsx` | Press1–9 pages |
| `components/admin/DatadekhShell.tsx` | 12+ datadekh pages |
| `app/proceedings/` shell | proceeding1, 2, 3 |

---

# 6. Files to delete (after redirects + 30-day analytics)

| Path | Prerequisite |
|------|----------------|
| `participantregistrationdatadekh copy/` | 301 to canonical |
| `ngoregistrationdatadekh copy/` | 301 |
| Legacy `app/component/Registration/*` | All traffic to `/registration` |
| `academiccouncil/page.tsx` | 301 → `/VibhagRoute/AcademicCouncil24` |
| Unused npm deps | `npm ls` + bundle verify |

---

# 7. Refactoring plan (quarters)

## Q1 — Stabilize (no URL moves)

- [x] Middleware intl scope (Phase 8)
- [x] Error boundaries (`error.tsx`, `not-found.tsx`)
- [ ] Metadata on top 30 public URLs
- [ ] Press `shareUrl` fix
- [ ] Remove duplicate datadekh folders
- [ ] Deprecate legacy registration with banners + 301

## Q2 — Structure

- Route groups `(public)`, `(admin)` without changing paths
- Move layout components out of `app/component/`
- Press dynamic route `[pressSlug]`
- Asset reference audit

## Q3 — Services & performance

- `services/` for Firebase
- Footer visitor counter → API route or static
- Dynamic import antd on legacy pages only
- Complete `OptimizedImage` pass

## Q4 — Enterprise polish

- Expand `[locale]` or pathnames map
- Design system doc + Storybook (optional)
- CMS evaluation for `data/` registries

---

# 8. SEO improvements

| Priority | Action |
|----------|--------|
| P0 | `generateMetadata` on: home, registration, introduction, knowledge, pastevent, proceedings, academic council, gallery, media, contact |
| P1 | Add `/hi/*` to sitemap when stable |
| P1 | `hreflang` in `createPageMetadata` for locale alternates |
| P2 | Single H1 per page on legacy shells |
| P2 | Fix Press canonical + OG URLs |
| P3 | Consolidate thin/duplicate routes |

**Existing assets:** `lib/seo/metadata.ts`, `metadataBuilders.ts`, `sitemap.ts`, `robots.ts`, `BreadcrumbJsonLd`, `HomeJsonLd`.

---

# 9. Accessibility improvements

| Action |
|--------|
| Skip link in root `layout.tsx` |
| Modal: `aria-modal`, focus return on close |
| Legacy pages: migrate to `LegalPageShell` / remove emoji-only H1 |
| Form errors: `aria-describedby` in `components/forms/FormField` |
| Datadekh: responsive table → card pattern (admin already started) |

---

# 10. Performance improvements

| Action | Est. impact |
|--------|-------------|
| Deploy middleware + vercel fixes | SEO + routing |
| `lazyOnload` analytics (done) | 400–700ms TBT |
| Botpress env-gate (done) | 300–600ms |
| Footer Firestore `onSnapshot` → edge API or remove | High JS |
| `next/dynamic` for Marquee, slick, antd pages | LCP |
| `serverExternalPackages` firebase (done) | Build stability |
| Exclude `.next` from OneDrive | Dev reliability |

---

# 11. Design system (Phase 7)

**Exists:** `src/design/tokens.ts`, `components/ui/*` (CtaButton, SectionHeader, StatCard, Glass patterns on home).

**Gaps:**

| Token | Status |
|-------|--------|
| Colors | `brand-navy`, `brand-saffron` in Tailwind — document in `styles/tokens.css` or extend `tokens.ts` |
| Typography | `next/font` Inter — legacy pages use ad-hoc sizes |
| Buttons | `CtaButton` vs antd `Button` vs raw classes |
| Spacing | Mixed `p-4` / `p-8` on legacy |

**Action:** Publish `docs/DESIGN_SYSTEM.md` mapping Tailwind classes → tokens; **do not** restyle home (user constraint).

---

# 12. AdSense readiness (Phase 9)

| Requirement | Status |
|-------------|--------|
| Legal pages | ✓ |
| Reserved slots | ✓ `ReservedAdSlot` |
| No ads on registration/admin | ✓ |
| Content depth | Proceeding/press pages need 300+ words |
| Fast LCP | **Below target** — see performance |
| Policy hierarchy | Home + knowledge OK; legacy thin pages risk |

See `docs/ADSENSE_APPROVAL_CHECKLIST.md`.

---

# 13. Component refactoring principles (Phase 3)

1. **One responsibility** — page = compose only; data in `data/` or `lib/content/registry.ts`.
2. **Server default** — new sections as RSC; client only for forms, analytics, modals.
3. **Props** — extend `FormField`, `SectionHeader` patterns; Zod types in `lib/schemas/`.
4. **No duplicate forms** — single registration pipeline.
5. **TypeScript strict** — replace `any` in datadekh/admin exports.

---

# 14. Page organization (Phase 4)

| Group | Routes |
|-------|--------|
| **Marketing** | `/`, `/introduction`, `/knowledge`, `/pastevent`, `/gallery`, `/media` |
| **Programme** | `/VibhagRoute/AcademicCouncil24`, `/conclave`, `/abstract` |
| **Registration** | `/registration`, `/registration/success` |
| **Publications** | `/proceedings`, `/journals`, `/books` |
| **Press** | `/Press1`…`/Press9`, `/Press_Release` |
| **Legal** | `/privacy-policy`, `/terms-and-conditions`, … |
| **Admin** | `/admin`, `*datadekh*` |
| **Legacy** | Redirect bucket |

**Layout consistency:**

- Modern: `HomePage`, `IntroductionContent`, `LegalPageShell`, `RegistrationShell`
- Legacy: `CompanyInfo` + Nav + Footer — migrate last

---

# 15. Updated code implementation — scope for this audit

**Delivered in repo (audit only, no mass moves):**

| Deliverable | Location |
|-------------|----------|
| This master audit | `docs/PROJECT_ENTERPRISE_AUDIT.md` |
| Route / i18n / middleware / vercel | `docs/ROUTE_*`, `docs/I18N_*`, `docs/MIDDLEWARE_*`, `docs/VERCEL_*` |
| Platform scorecard | `docs/FINAL_PLATFORM_SCORECARD.md` |
| Lighthouse / third-party / images | Phase 8 docs |

**Not executed (requires approved phases):**

- Moving 120 files from `app/component/`
- Enterprise `(public)/` route groups
- Press merge / proceeding consolidation

---

# 16. Executive scores (current vs enterprise target)

| Dimension | Current | Target | Blocker |
|-----------|--------:|-------:|---------|
| Architecture | 72 | 90 | Dual stack + `app/component/` |
| Maintainability | 58 | 85 | Duplication |
| SEO | 70 | 95 | Metadata coverage |
| Performance | 45 | 90 | LCP / client shell |
| Accessibility | 88 | 95 | Legacy pages |
| Security | 82 | 92 | Rules deploy + legacy forms |
| i18n | 76 | 88 | Hybrid locale model |
| Design system | 65 | 85 | antd + Tailwind mix |
| **Enterprise readiness** | **68** | **90** | Phased migration |

---

# 17. Recommended next approved task

**Smallest high-value slice (1 PR):**

1. Delete `* copy/` datadekh folders + add redirects in `next.config.js`
2. Add `generateMetadata` to top 10 traffic routes
3. Fix Press `shareUrl` constants
4. Add `docs/DESIGN_SYSTEM.md` from `design/tokens.ts`

**Explicitly defer:** Full `src/app/(public)/` migration until redirect map is written.

---

## Related documents

- `docs/AUDIT_REPORT.md` (earlier security-focused audit)
- `docs/ROUTING_RECOVERY_REPORT.md`
- `docs/CONTENT_OPERATIONS_SYSTEM.md`
- `docs/LIGHTHOUSE_RECOVERY_PLAN.md`
