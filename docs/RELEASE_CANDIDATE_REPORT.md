# Production Release Candidate Report

**Base commit:** `3380ce9`  
**Release candidate date:** 2026-06-08  
**Pre-commit build:** PASS — **210** static pages (was 206; +4 API/new routes)

---

## Phase 1 — Git Release Audit

### Classification summary

| Class | Count | Action |
|-------|-------|--------|
| **1. Required for release** | ~145 | **COMMIT** |
| **2. Optional improvement** | 8 docs + 4 migrate scripts | Exclude audit JSON; optional docs |
| **3. Experimental** | 0 | — |
| **4. Generated artifact** | 5 | **DO NOT COMMIT** |
| **5. Secret/environment** | 1 (`.env`) | **DO NOT COMMIT** |

### 1. Required for release (COMMIT)

**New routes & SEO**
- `src/app/glimpses/` — `/glimpses` page
- `src/app/coming-soon/layout.tsx` — metadata
- `src/app/sitemap.ts` — +3 URLs (107 total)

**Shell & layout**
- `src/components/layouts/PublicPageShell.tsx`
- `src/components/layouts/PageCtaSection.tsx`
- `src/components/committee/CommitteeEditionPage.tsx`
- `src/components/conferences/`
- `src/components/press/`
- `src/lib/page-heroes.ts`
- All migrated `src/app/**/page.tsx` (PublicPageShell adoption)

**Registration & payments**
- `src/lib/registration/config.ts`
- `src/app/registration/RegistrationHub.tsx`
- `src/components/registration/*`
- `src/components/forms/*`
- `src/lib/razorpay/`, `src/components/payments/`
- `src/app/api/payments/create-order/`, `verify-payment/`, `create-order/`, `verify-payment/`
- `src/lib/firestore/payments.server.ts`
- `src/app/api/payments/razorpay-webhook/route.ts`

**Performance & a11y**
- `src/app/component/ui/RegistrationShell.tsx` (Framer removed)
- `src/components/home/HomePage.tsx` (dynamic NavBar)
- `src/app/ClientChrome.tsx` (dynamic Modal)
- `src/components/media/MediaCenter.tsx`, `CommitteeMemberSection.tsx`, etc.

**Dependencies**
- `package.json`, `package-lock.json` (`razorpay`, dev tooling)

**Ops (safe)**
- `.env.example`, `scripts/verify-env.mjs`, `scripts/production-go-live.mjs`
- `scripts/count-sitemap.mjs`, `scripts/launch-canonical-check.mjs`
- `docs/DEPLOYMENT_CHECKLIST.md`, `docs/VERCEL_PRODUCTION_RELEASE_RUNBOOK.md`
- `.gitignore` (exclude generated artifacts)

### 2. Optional improvement (EXCLUDE from release commit)

- `docs/ENTERPRISE_TRANSFORMATION_REPORT.md`
- `docs/FINAL_LAUNCH_CERTIFICATION.md`
- `docs/FINAL_PRODUCTION_CERTIFICATION.md`
- `docs/FULL_GO_LAUNCH_CERTIFICATION.md`
- `docs/REGISTRATION_SYSTEM_UPDATE_REPORT.md`
- `scripts/migrate-legacy-shell.mjs`
- `scripts/migrate-press-pages.mjs`
- `scripts/migrate-remaining-public-pages.mjs`
- `scripts/launch-certification-audit.mjs`
- `scripts/launch-lighthouse.mjs`
- `scripts/razorpay-e2e-test.mjs`

### 4. Generated artifacts (DO NOT COMMIT)

- `tsconfig.tsbuildinfo`
- `docs/lighthouse/launch/*`
- `docs/launch-audit-results.json`
- `docs/production-go-live-results.json`
- `scripts/link-verify-result.json`
- `.next/`, `node_modules/` (already ignored)

### 5. Secrets (DO NOT COMMIT)

- `.env` — **tracked in repo (legacy)**; contains SMTP/Razorpay keys → **unstage + remove from index**

---

## Phase 2 — Safe Commit Checklist

- [x] `.env` excluded from staging
- [x] `git rm --cached .env` to stop tracking secrets
- [x] `.env.example` committed (no secrets)
- [x] No `serviceAccount*.json` in changes
- [x] Generated artifacts in `.gitignore`
- [x] `npm run build` PASS before commit

---

## Phase 4 — Pre-Release Validation

| Check | Result |
|-------|--------|
| `npm run build` | **PASS** |
| Static pages | **210** (includes new API routes) |
| `/glimpses` route built | **YES** (`.next/server/app/glimpses`) |
| Sitemap source paths | **107** (`glimpses` included) |
| `tsc` | PASS (via build) |

---

## Phase 5 — Recommended commit message

```
Production certification release: glimpses, sitemap, shell migrations,
API hardening, registration, Razorpay checkout, accessibility, SEO,
and performance optimizations.
```

---

## Phase 7 — Vercel deployment (after push)

1. `git push origin main`
2. Verify GitHub shows new commit
3. Vercel → Redeploy → **disable build cache**
4. Build log → **210** pages
5. `node scripts/production-go-live.mjs https://www.rase.co.in` → 9/9
6. Set env vars if not done → redeploy again
