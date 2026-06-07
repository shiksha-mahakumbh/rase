# Dependency Cleanup Plan (Phase 1 — Document Only)

**Date:** 2026-05-29  
**Scope:** Audit `package.json` dependencies. **No packages were removed in Phase 1.**

## Summary

| Category | Count (approx.) | Action |
|----------|-----------------|--------|
| USED | 28 | Keep |
| UNUSED / ORPHAN | 12 | Phase 2+ review before uninstall |
| LEGACY / DUPLICATE | 6 | Consolidate in Phase 2 |
| HIGH-RISK | 5 | Pin, audit, or replace in Phase 2 |

---

## USED (production-critical or actively imported)

| Package | Usage |
|---------|--------|
| `next`, `react`, `react-dom` | App framework |
| `firebase` | Registration, admin, noticeboard, Footer counter |
| `antd` | Admin tables, noticeboard, many legacy forms |
| `react-hook-form`, `@hookform/resolvers`, `zod` | Registration hub validation |
| `react-hot-toast` | Global toasts (`RootClientShell`, forms) |
| `next-intl` | i18n middleware + `[locale]` routes |
| `framer-motion` | Footer, UI motion |
| `@fortawesome/*`, `react-icons`, `@heroicons/react` | Icons |
| `react-slick`, `slick-carousel` | Workshop / media sliders |
| `@nextui-org/react` | Selected UI |
| `nodemailer` | `api/registration/send-email` |
| `axios` | Legacy datadekh pages (localhost API calls) |
| `recharts` | `AnalyticsCharts` (admin) |
| `jspdf`, `jspdf-autotable`, `xlsx`, `qrcode`, `next-qrcode` | Certificates / exports |
| `uuid` | Registration IDs |
| `formidable`, `multer` | Upload APIs (if enabled) |
| `dotenv` | Env loading |
| `tailwindcss`, `postcss`, `autoprefixer`, `typescript`, `eslint*` | Tooling |

---

## UNUSED / ORPHAN (no `src/` imports found — verify before removal)

| Package | Notes | Recommendation |
|---------|--------|----------------|
| `express` | Listed in deps; no Next.js route imports | Remove if no external `server.js` |
| `cors` | Paired with express | Remove with express |
| `next-connect` | Legacy API pattern | Audit `pages/api` remnants |
| `sequelize`, `mysql2` | ORM + driver; no active model imports in `src/` | **LEGACY** — confirm DB still used |
| `bcrypt`, `jsonwebtoken` | Auth may be unused if Firebase-only admin | Grep API routes before remove |
| `react-router-dom` | Next.js uses file routing | **Remove candidate** |
| `react-share-social` | One legacy import in `SM24.tsx` | Replace with `react-share` then remove |
| `latest` | Meta-package; no purpose in app | **Remove immediately in Phase 2** |
| `path` (npm) | Node built-in duplicated | **Remove** |
| `buffer` | Polyfill; verify webpack need | Test build without |
| `ts-node` | Scripts only? | Move to devDependencies |
| `@types/next` | Deprecated types package | Remove (Next ships types) |

---

## LEGACY / DUPLICATE UI stacks

| Stack | Risk | Recommendation |
|-------|------|----------------|
| `antd` + `@nextui-org/react` + Tailwind | Bundle size, style drift | Standardize on Tailwind + one component lib (Phase 3) |
| `react-slick` + `swiper` + `react-responsive-carousel` | Three carousel libs | Keep slick for workshops; remove others after grep |
| `@emotion/react` + `@emotion/styled` | Pulled by MUI/antd peers | Do not add more Emotion-based libs |

---

## HIGH-RISK

| Package | Risk | Mitigation |
|---------|------|------------|
| `firebase` (v10) | Large client bundle, SSR edge cases | Already `serverExternalPackages`; lazy admin imports |
| `antd` | ~500KB+ client | Dynamic import admin-only tables (started Phase 5) |
| `axios` + hardcoded `localhost:5000` | Broken in production if called | Migrate to Next API routes or remove dead forms |
| `jspdf` / `xlsx` | XSS if user content injected into PDF | Sanitize export inputs |
| `eslint-config-next@14` vs `next@15` | Lint rule mismatch | Align versions in Phase 2 |

---

## Phase 2 uninstall order (recommended)

1. `latest`, `path` (npm), `@types/next`
2. `react-router-dom`, `react-share-social` (after one-file migration)
3. `express`, `cors`, `next-connect` (after API audit)
4. `sequelize`, `mysql2`, `bcrypt`, `jsonwebtoken` (after confirming Firebase-only auth)
5. Carousel dedupe: `swiper` / `react-responsive-carousel` last

**Always run:** `npm run build` + registration smoke test after each batch.
