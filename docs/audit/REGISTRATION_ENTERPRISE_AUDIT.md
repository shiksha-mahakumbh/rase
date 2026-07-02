# Registration System — Enterprise Audit Report

**Target:** https://www.rase.co.in/registration  
**Audit date:** 2 July 2026  
**Scope:** Real-user journey, payments, email, database, security, SEO, performance, accessibility, business rule changes (project pricing + accommodation closure)  
**Codebase:** `rase` (Next.js 15, Supabase/Prisma, Razorpay)

---

## Executive Summary

A full-stack audit of the SMK 6.0 registration system was performed across user journeys, backend logic, payments, email, database policies, security, SEO, and UX. **Two business changes were implemented in code:**

| Change | Before | After |
|--------|--------|-------|
| School Level Project | ₹200 | ₹200 (unchanged) |
| College Level Project | ₹400 | **₹500** |
| University Level Project | *(not offered)* | **₹500** (new tier) |
| Accommodation registration | Paid flow (₹3000/₹6000) | **Closed** — September notice only |

**Production status:** Live site at `rase.co.in/registration` still serves the **previous** build (Accommodation card, ₹200–₹400 badge, old FAQ). Local changes pass `typecheck`, **23/23 unit tests**, integration contract checks, and **production build**. **Deploy is required** before live user/payment/email re-verification.

**Production readiness score (pre-deploy):** **82/100** — code complete; blocked on deploy + live payment sign-off + post-deploy smoke.

---

## User Journey Audit

### Hub flow (`/registration`)

| Step | Finding | Status |
|------|---------|--------|
| Page load | HTTP 200, CSP/HSTS/nosniff headers present | ✅ |
| Category selection | 4 groups: Delegates, Programme tracks, Project displays, Research (CMT) | ✅ Fixed locally |
| Accommodation card | Removed from hub; notice on all forms | ✅ Fixed locally |
| Multi-step flow | Details → Payment (if paid) → Submit | ✅ |
| Draft persistence | `useRegistrationDraft` + localStorage | ✅ |
| Back button | Hub state in React context; category preserved in draft | ✅ |
| Success redirect | `/registration/success?id=SMK2026-…` + lookup token | ✅ |

### Persona coverage (code + static review)

| Persona | Path | Notes |
|---------|------|-------|
| Student (delegate) | Delegate → Student (Free) | No payment step; student ID fields validated |
| Teacher / faculty | Delegate paid tiers | Razorpay + PAN ≥ ₹2000 |
| School project | Projects → School Level ₹200 | 3-step paid flow |
| College project | Projects → College Level ₹500 | Updated |
| University project | Projects → University Level ₹500 | **New** |
| Mobile / slow network | Responsive grid, 44px touch targets, step indicator | ✅ |
| Returning visitor | Draft restore + dashboard lookup | ✅ |

### Live production gaps (pre-deploy)

- Accommodation category still visible on live hub
- Project fee badge shows `₹200–₹400` on live site
- SEO meta description still mentions “accommodation” as active category

---

## Registration Flow Audit

### Architecture

```
RegistrationHub → CategoryStep → Form router
  ├── DelegateForm (paid/free delegate)
  ├── ConclaveForm, AwardsForm, OlympiadForm, BestPracticeForm
  └── GenericRegistrationForm (Projects, Exhibition, etc.)
       └── submit → POST /api/v2/registration/submit
            └── guardRegistrationSubmit → saveRegistration → emails
```

### Validations (three layers)

| Layer | Coverage |
|-------|----------|
| **Frontend (Zod)** | Name, email, phone, PAN for fee ≥ ₹2000, payment proof, project level enum, accommodation Yes blocked |
| **API guard** | Fee mismatch, duplicate payment, Razorpay verify, Accommodation type rejected |
| **Database** | Prisma types, RLS (74 policies deployed per prior certify run) |

### Business rules applied

- `fees.ts`: `PROJECT_SCHOOL_STUDENT_FEE=200`, `PROJECT_COLLEGE_STUDENT_FEE=500`, `PROJECT_UNIVERSITY_STUDENT_FEE=500`
- `project-student-type.ts`: Zod enum + `parseProjectStudentType()` for Razorpay notes and submit guard
- `Accommodation` submissions return `ACCOMMODATION_CLOSED` (400) in guard + service
- `resolveRegistrationFee("Accommodation")` returns `0` (no Razorpay orders)

---

## Payment Audit

| Control | Implementation | Status |
|---------|----------------|--------|
| Amount from server notes | `expectedAmountPaiseFromOrderNotes()` uses `resolveRegistrationFee` | ✅ Updated for University |
| Signature verify | HMAC on webhook + client verify | ✅ |
| Duplicate payment | `assertVerifiedPaymentForSubmit` + duplicate redirect | ✅ |
| Fee mismatch reject | Create-order rejects wrong paise | ✅ |
| Webhook | `/api/payments/razorpay-webhook` | ✅ (code) |
| PAN ≥ ₹2000 | Frontend + guard | ✅ |

**Live payment test:** **Not completed** — requires deploy + manual Razorpay checkout (per audit protocol). After deploy: test School ₹200, College ₹500, University ₹500, and failure/retry paths.

---

## Email Audit

| Item | Detail |
|------|--------|
| User confirmation | `sendRegistrationCompleteEmail()` — HTML + receipt PDF + QR attachment |
| Admin alert | `admin_alert` template on new registrations |
| SMTP | Nodemailer via env (`SMTP_*`); logged in `email_logs` |
| Links | Portal, receipt URL use `SITE_URL` canonical |
| Spam / DNS | SPF/DKIM/DMARC are **domain/DNS ops** — not verifiable from code; recommend post-deploy mail-tester check |

**Live email test:** Requires successful registration on deployed environment with SMTP configured.

---

## Database Audit

| Area | Finding |
|------|---------|
| Tables | `registrations` master + type extensions (delegate, exhibition, accommodation_request, etc.) |
| Projects | Stored as Prisma type `Exhibition` with `projectStudentType` in JSON payload |
| Accommodation | Historical rows retained; **new** inserts blocked at API |
| RLS | 74 policies; anon deny verified in prior `certify:go-live` run |
| Indexes | Registration ID unique; payment ID tracking in `razorpay_verified_payments` |

---

## Security Audit

| Threat | Mitigation |
|--------|------------|
| XSS | React escaping; Zod string validation; no `dangerouslySetInnerHTML` on forms |
| SQL injection | Prisma parameterized queries |
| CSRF | Same-origin check on Razorpay create-order |
| IDOR | Registration lookup tokens (HMAC, email-bound, 7-day TTL) |
| Rate limiting | IP limits on submit, upload, Razorpay endpoints |
| Bot/spam | Honeypot on public forms |
| Secrets | Env-only; `audit:secrets` script in CI |
| Headers | CSP, HSTS, X-Frame-Options, nosniff on production |

**Residual:** CSP allows `unsafe-inline` / `unsafe-eval` for analytics — industry-common trade-off; tighten when possible.

---

## SEO Audit

| Item | Local code | Live production |
|------|------------|-----------------|
| Title | Register — SMK 6.0 | ✅ |
| Meta description | Updated (projects + Sep accommodation) | ❌ Old copy cached |
| Canonical | `https://www.rase.co.in/registration` | ✅ |
| hreflang | en-IN | ✅ |
| JSON-LD | `RegistrationJsonLd` | ✅ |
| FAQ content | Updated | ❌ Pre-deploy |

---

## Performance Audit

| Signal | Observation |
|--------|-------------|
| TTFB | Production page ~200 OK, Vercel edge cache (Age header) |
| Bundle | Registration code-split (`page-*.js` chunk) |
| Images | Hero preload, Next/Image |
| Lighthouse | PSI rate limits in CI; run `verify:lighthouse:prod` post-deploy |

---

## Accessibility Audit

| Item | Status |
|------|--------|
| Form labels | `FormField` associates label + `name` |
| Accommodation notice | `aria-labelledby` on notice section |
| Category cards | `aria-pressed` on selection buttons |
| Focus / touch | `min-h-[44px]` on primary actions |
| Step indicator | Visible step numbers |

---

## Mobile Audit

- Responsive grids (`sm:grid-cols-2`)
- Sticky register bar on scroll
- Payment block stacks vertically
- Accommodation notice readable on narrow viewports

---

## Accommodation Changes Applied

| Location | Change |
|----------|--------|
| `AccommodationNotice.tsx` | Static September message on all forms |
| `RegistrationHub.tsx` | Removed Accommodation form route |
| `registration-hub.ts` | Removed from category groups + FAQ |
| `config.ts` | Removed from `PAID_CAPABLE_TYPES` |
| `registration-submit-guard.ts` | `ACCOMMODATION_CLOSED` error |
| `registration.service.ts` | Blocks save for Accommodation type |
| `accommodationSchema` | Rejects `accommodationRequired: "Yes"` |
| `SuccessExperience.tsx` | September guidance on success page |
| `RegistrationIntroBanner.tsx` | September callout |
| Admin | Historical accommodation columns retained for legacy records |

---

## Project Pricing Changes Applied

| Location | Change |
|----------|--------|
| `fees.ts` | School ₹200, College ₹500, University ₹500 |
| `GenericRegistrationForm.tsx` | Project Level dropdown with new labels |
| `categoryMeta.ts` | Instructions, fees, eligibility updated |
| `CategoryStep.tsx` | Hint `₹200–₹500` |
| `razorpay/handlers.ts` | University in amount resolution |
| `registration-submit-guard.ts` | `parseProjectStudentType` |
| `types/registration.ts` | `PROJECT_COLLEGE_REGISTRATION_FEE = 500` |
| `tests/unit/project-fees.test.ts` | 6 assertions |
| `scripts/final-go-live-certification.mjs` | ₹500 probe patterns |

**Grep sweep:** No `₹400` in `src/` application code (only deprecated docs/scripts outside `src`).

---

## Issues Found

| # | Severity | Issue | Root cause |
|---|----------|-------|------------|
| 1 | **High** | Live site shows old fees & Accommodation | Changes not deployed |
| 2 | **High** | No University project tier on production | Same |
| 3 | **Medium** | College fee was ₹400 in prod bundles | Stale `fees.ts` on prod |
| 4 | **Medium** | Accommodation paid flow still on prod | Hub not updated on prod |
| 5 | **Low** | Zod `.default("No")` broke RHF types | Input/output type mismatch |
| 6 | **Low** | `status/page.tsx` used `<a>` for internal route | ESLint build failure |
| 7 | **Info** | Live payment/email not re-tested this session | Requires deploy + manual Razorpay |

---

## Fixes Implemented

1. Project pricing: School ₹200, College/University ₹500 across frontend, API, Razorpay, meta, tests  
2. Accommodation: replaced with September notice; blocked API submissions  
3. `AccommodationNotice` component on all registration forms  
4. `project-student-type.ts` helper + schema  
5. FAQ, intro banner, success page, SEO description updated  
6. Fixed accommodation Zod schema for TypeScript compatibility  
7. Fixed `status/page.tsx` Link lint for clean build  
8. Unit tests: `tests/unit/project-fees.test.ts`  

**Verification:** `npm run typecheck` ✅ · `npm run test:unit` 23/23 ✅ · `npm run build:next-only` ✅

---

## Instructions Added

- Project level selection guidance (fee differs by level; Razorpay on next step)
- Accommodation September notice on every form + intro banner + success page
- FAQ answers for categories and payment (explicit project fee tiers)
- Category meta instructions for Projects (documents, PAN, payment proof)

---

## Validations Added

- `projectStudentTypeSchema` includes University Student
- Accommodation `Yes` rejected with actionable message (frontend Zod)
- `ACCOMMODATION_CLOSED` on backend guard + service
- Razorpay amount validation uses `parseProjectStudentType`

---

## UX Improvements

- Removed Accommodation as selectable paid category (reduces confusion)
- Project displays grouped separately with clear fee range badge
- Success page always mentions September accommodation timeline
- Intro banner links: refund policy, portal, brochures

---

## Accessibility Improvements

- Accommodation notice uses semantic heading + `aria-labelledby`
- Category step hints include fee information in plain language

---

## User Guidance Improvements

- `RegistrationIntroBanner`: project fee summary + accommodation timeline
- `GenericRegistrationForm`: project title/description placeholders
- Payment step: fee callout box with amount in INR locale format

---

## Remaining Risks

| Risk | Mitigation |
|------|------------|
| Production not yet updated | Deploy + `certify:go-live:live` |
| Live Razorpay untested for ₹500 | Manual payment after deploy |
| Email deliverability | DNS SPF/DKIM/DMARC review |
| Stale go-live docs mention ₹400 | Update doc archive when convenient |
| Historical Accommodation API type still in `TYPE_MAP` | Guard blocks new submissions; admin can view old rows |

---

## Smoke Test Results

| Test | Result |
|------|--------|
| `npm run typecheck` | PASS |
| `npm run test:unit` | PASS (23 tests) |
| `npm run test:integration` | PASS (scripts present; live skipped without `RUN_INTEGRATION_TESTS`) |
| `npm run build:next-only` | PASS |
| Production `/registration` HTTP | 200 OK |
| Production content (fees/accommodation) | **FAIL** — stale deployment |
| Live Razorpay E2E | **PENDING** — manual step after deploy |

---

## Final Production Readiness Score

| Criterion | Weight | Score |
|-----------|--------|-------|
| Code & tests | 25% | 24/25 |
| Security controls | 20% | 18/20 |
| UX / accessibility | 15% | 14/15 |
| SEO (post-deploy) | 10% | 7/10 |
| Live user flow | 15% | 8/15 |
| Payment + email live | 15% | 5/15 |

**Total: 82/100 — NOT COMPLETE until deployed and live payment/email verified.**

### Completion checklist

- [x] Business pricing changes in code  
- [x] Accommodation replaced with September notice  
- [x] Backend blocks new accommodation registrations  
- [x] Unit tests + build green  
- [ ] **Deploy to production**  
- [ ] Live user flow on `rase.co.in`  
- [ ] Manual Razorpay payment (School/College/University)  
- [ ] Confirmation + admin emails received  
- [ ] Post-deploy `certify:go-live:live`  

---

## Next Steps (Operator)

1. **Deploy** current branch to Vercel production.  
2. Purge/wait for CDN cache on `/registration`.  
3. Manual test: Projects → each level → Razorpay → submit → success + email.  
4. Run `npm run certify:go-live:live`.  
5. Optional: `node scripts/final-go-live-certification.mjs https://www.rase.co.in`

---

*Report generated as part of enterprise registration audit. Code changes are local/uncommitted pending operator deploy approval.*
