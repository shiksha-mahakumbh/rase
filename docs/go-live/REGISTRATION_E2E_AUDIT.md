# Registration End-to-End Audit

**Date:** 2026-06-12  
**Role:** Senior QA Engineer  
**Environment:** Production — https://www.shikshamahakumbh.com  
**Backend:** Supabase + Prisma (post Firebase cutover)  
**Method:** Source-code trace + safe live HTTP probes (no real submissions, no payments)  
**Probe script:** `scripts/_registration-e2e-audit.mjs` (2026-06-12T18:17:48Z)

---

## Executive Summary

| Area | Result |
|------|--------|
| Primary hub (`/registration`) | ✅ Live (200); modern Supabase submit path |
| Legacy standalone forms | ✅ Pages live (200) |
| Registration lookup security | ✅ **401** without token/email; no PII leak |
| Admin APIs (unauthenticated) | ✅ v2 admin **401**; gateway proxy returns **500** (see High) |
| Razorpay endpoints | ✅ Validation active; webhook HMAC enforced |
| Supabase health | ✅ `/api/v2/health` → `backend: supabase`, DB connected |
| Storage RLS | ✅ **8/8** policies on `storage.objects` |
| Firebase runtime | ✅ No Firebase in registration API routes |
| **Broken hub categories** | ❌ **Bal Shodh Patrika**, **Cultural Program** → API 400 |
| **Payment E2E (live)** | ⚠️ Not tested (constraint); 0 rows in `payment_records` |
| **Email E2E (live)** | ⚠️ Not tested; SMTP-dependent |

### Registration Readiness Score: **74 / 100**

### Recommendation: **CONDITIONAL GO**

Core registration infrastructure (Supabase write path, ID generation, captcha gate, lookup security, Razorpay validation) is **production-ready**. Two hub categories are **advertised in UI but fail at API**. Treat as **release blocker for those categories only**; Delegate, Conclave, Accommodation, Projects, Best Practices, Olympiad, Awards, Exhibition, and legacy forms remain viable.

---

## 1. Registration Flows Discovered

### A. Primary hub — `/registration` (RegistrationHub)

| Category | UI | API type | Prisma type | Paid | Upload | Status |
|----------|----|----------|-------------|------|--------|--------|
| Delegate Registration | ✅ | `Delegate Registration` | `Delegate` | Conditional (₹0–₹8000) | Receipt | ✅ Supported |
| Conclave | ✅ | `Conclave` | `Conclave` | Free | No | ✅ Supported |
| Best Practices | ✅ | `Best Practices` | `Best_Practices` | Free | PDF/photos | ✅ Supported |
| Olympiad | ✅ | `Olympiad` | `Olympiad` | Free* | Student list | ✅ Supported |
| Awards | ✅ | `Awards` | `Awards` | Free | PDF/photos/letter | ✅ Supported |
| Exhibition | ✅ | `Exhibition` | `Exhibition` | Free | No | ✅ Supported |
| Projects | ✅ | `Projects` | `Exhibition` | Paid (₹200) | Receipt | ✅ Supported |
| Accommodation | ✅ | `Accommodation` | `Accommodation` | Paid | Receipt | ✅ Supported |
| **Bal Shodh Patrika** | ✅ | `Bal Shodh Patrika` | — | Free | No | ❌ **Not in TYPE_MAP** |
| **Cultural Program** | ✅ | `Cultural Program` | — | Free | No | ❌ **Not in TYPE_MAP** |
| Multi Track Conference | ✅ | External CMT | — | External | External | ↗ CMT redirect |
| Paper Submission | ✅ | External CMT | — | External | External | ↗ CMT redirect |
| Abstract Submission | ✅ | External CMT | — | External | External | ↗ CMT redirect |

\*Olympiad fee stored in metadata; payment status resolves to `Submitted`.

### B. Legacy standalone pages

| URL | Type | API | Paid | Upload | Status |
|-----|------|-----|------|--------|--------|
| `/accommodation` | Accommodation | `/api/registration/submit` | Receipt | Yes | ✅ Live 200 |
| `/schoolprojectdisplaysubmission` | School Program | same | Receipt | Yes | ✅ Live 200 |
| `/heiprojectdisplaysubmission` | Projects | same | Receipt | Yes | ✅ Live 200 |
| `/abstract` | Abstract Submission | same | Receipt | Yes | ✅ Live 200 |
| `/fulllengthpaper` | Paper Submission | same | Receipt | Yes | ✅ Live 200 |

### C. Redirected legacy routes (no dedicated form)

| URL | Redirect | Notes |
|-----|----------|-------|
| `/registration/volunteer` | → `/registration` | Volunteer **not** in hub category list |
| `/registration/ngo` | → `/registration` | NGO **not** in hub |
| `/registration/talent` | → `/registration` | Talent **not** in hub |
| `/registration/conclaveReg` | → `/registration` | Conclave available in hub |

### D. Orphaned components (code only, no public page)

VolunteerForm, NGOForm, TalentForm, OrganizerReg, legacy DelegateForm/ConclaveForm — API-supported but **not reachable** from current navigation.

---

## 2. Validation Findings (per flow class)

### Server-side (`POST /api/registration/submit`)

| Check | Live result | Source |
|-------|-------------|--------|
| Empty body | **400** `Invalid registration type` | ✅ |
| Unmapped type (`Bal Shodh Patrika`) | **400** `Invalid registration type` | ✅ Confirmed |
| Valid type, no captcha | **403** `Security verification failed` | ✅ |
| Rate limit | **429** at 15/min/IP | Code: `rateLimit` |
| Email format | **400** `Valid email is required` | Code |
| Name min length | **400** `Full name is required` | Code |
| reCAPTCHA | `verifyRecaptchaToken(captchaToken, "registration")` | Env: `RECAPTCHA_SECRET_KEY` |

### Client-side

- Modern hub forms use `useRegistrationSubmit` + field components with HTML5 `required` and step validation.
- Legacy forms use local validation + `submitLegacyForm` → same submit API.
- **Not browser-tested** in this audit (no Playwright); server gates verified live.

### File upload (`POST /api/registration/upload`)

| Check | Expected | Source |
|-------|----------|--------|
| GET | **405** | ✅ Live |
| Missing file | **400** | Code |
| Invalid type | **400** | Code |
| Max size | 10 MB | `storage.service.ts` |
| Buckets | Type → `registrations` / `papers` / `resumes` | `TYPE_BUCKET_MAP` |

Upload uses **service role** (bypasses storage RLS); anon direct upload denied by **8 storage policies**.

### Registration ID format

- Pattern: `SMK2026-{6-digit}` (`REG_ID_RE`)
- Generator: transactional `registration_counters` upsert + increment (`registration.service.ts`)
- Live DB: prefix `SMK2026`, `lastNumber=1`, **1 registration** (`SMK2026-000001` migrated)

---

## 3. Database Persistence

### Write path

```
Form → POST /api/registration/submit
     → saveRegistration()
     → generateRegistrationId()  [registration_counters]
     → prisma.registration.create
     → createTypeExtension()     [subtype table by Prisma enum]
     → writeAuditLog()
```

### Tables involved

| Table | Role |
|-------|------|
| `registrations` | Master record |
| `registration_counters` | SMK2026 sequence |
| `conclave_registrations`, `delegate_registrations`, … | Type extensions |
| `uploaded_files` | File metadata + storage path |
| `payment_records` | Razorpay payment rows |
| `webhook_events` | Razorpay webhook audit |
| `email_logs` | Queued email (v2 path) |
| `audit_logs` | Admin/registration audit |

### Live Supabase counts (2026-06-12)

| Table | Count |
|-------|-------|
| `registrations` | **1** |
| `payment_records` | **0** |
| `uploaded_files` | **0** |
| `registration_counters.lastNumber` | **1** |

Migration imported Firebase master row; conclave duplicate skipped (same `registrationId`).

---

## 4. Security Findings

| Test | Result | Severity |
|------|--------|----------|
| `GET /api/registration/SMK2026-000001` (no auth) | **401** | ✅ Pass |
| `GET /api/registration/SMK2026-999999` (no auth) | **401** (auth before DB lookup) | ✅ Pass |
| PII in 401 response | None | ✅ Pass |
| `GET /api/v2/admin/registrations` | **401 Unauthorized** | ✅ Pass |
| `GET /api/admin/gateway/registrations` | **500** empty body | ⚠️ High (see below) |
| `POST /api/payments/razorpay-webhook` `{}` | **401 Invalid signature** | ✅ Pass |
| Public summary fields | No email/phone in `toPublicRegistrationSummary` | ✅ Code review |
| Firebase in registration APIs | **0 matches** | ✅ Pass |
| Storage RLS | **8/8** policies | ✅ Pass |

---

## 5. Email Findings

| Path | Service | Trigger | Status |
|------|---------|---------|--------|
| Modern hub | Nodemailer (`/api/registration/send-email`) | Post-submit from `useRegistrationSubmit` | ⚠️ Requires `SMTP_*` env |
| V2 | `email.service.ts` (`/api/v2/registration/send-email`) | Queued + `email_logs` | ⚠️ Not default hub path |
| Payment confirm | `sendPaymentConfirmation()` | Available in service | ⚠️ Not auto-wired from webhook |
| Legacy forms | — | **No email sent** | ⚠️ Gap |
| Live send test | **Not performed** | Constraint | — |

Email route validates `REG_ID_RE`, rate limits 10/min, optional `REGISTRATION_EMAIL_SECRET`.

---

## 6. Payment Findings

| Endpoint | Live probe | Behavior |
|----------|------------|----------|
| `POST /api/payments/create-order` `{}` | **400** Amount ≥ 100 paise | Validation OK |
| `POST /api/payments/verify-payment` `{}` | **400** Missing fields | Validation OK |
| `POST /api/payments/razorpay-webhook` | **401** unsigned | HMAC OK |

### Flow (code trace)

```
Paid hub forms → RazorpayCheckout
  → POST /api/payments/create-order
  → Client checkout modal
  → POST /api/payments/verify-payment (HMAC)
  → submit with payment metadata
  → payment_records + registrations.paymentStatus

Async: webhook → processRazorpayWebhookEvent()
  → webhook_events + payment_records + registration update
```

### Gaps

| Item | Severity |
|------|----------|
| No live Razorpay test payment | Medium (audit constraint) |
| `payment_records` count = 0 | Medium (no production payment proof) |
| Legacy paid forms use **manual receipt upload** only | Low (by design) |
| Webhook URL must be `https://www.shikshamahakumbh.com/api/payments/razorpay-webhook` | Info |

---

## 7. Production Readiness

| Check | Result |
|-------|--------|
| Registration pages HTTP 200 | ✅ All probed paths |
| `/api/v2/health` | ✅ Supabase connected |
| Broken forms | ❌ Bal Shodh Patrika, Cultural Program |
| Missing env (runtime) | ⚠️ SMTP not verified live |
| Firebase leftovers in registration stack | ✅ None in API layer |
| PII in git (`exports/firebase/`) | ⚠️ Committed in `00dbe12` — hygiene issue |

---

## Issue Register

### Critical

| ID | Issue | Evidence |
|----|-------|----------|
| C1 | **Bal Shodh Patrika** and **Cultural Program** shown in hub but **reject submit** | Live POST → 400; missing from `TYPE_MAP` in `registration-types.ts` |

### High

| ID | Issue | Evidence |
|----|-------|----------|
| H1 | Volunteer, NGO, Talent legacy routes redirect to hub **without equivalent category** | Redirect live; not in `REGISTRATION_TYPE_OPTIONS` |
| H2 | Admin gateway returns **500** (not 401) for unauthenticated GET | Live probe vs v2 admin 401 |
| H3 | No production payment or webhook success recorded | `payment_records` = 0 |
| H4 | Legacy registration forms do **not** send confirmation email | Code: no `send-email` call in `submitLegacyForm` |

### Medium

| ID | Issue | Evidence |
|----|-------|----------|
| M1 | Dual accommodation entry (hub + `/accommodation` legacy) | Two UX paths, same API |
| M2 | On-site `/abstract` and `/fulllengthpaper` coexist with CMT external flow | Potential user confusion |
| M3 | Payment confirmation email not auto-triggered from webhook | `payment.service.ts` / email service |
| M4 | Firebase export JSON with PII committed to git | `exports/firebase/registrations.json` in repo |

### Low

| ID | Issue | Evidence |
|----|-------|----------|
| L1 | Orphan legacy form components in codebase | No mounted pages |
| L2 | `TYPE_COLLECTION_MAP` still references Firebase collection names | Documentation drift only |
| L3 | Live page probe cannot detect client-rendered forms in SSR HTML | Probe limitation |

---

## Live Probe Evidence Summary

**Timestamp:** 2026-06-12T18:17:48Z

| Probe | Status | Notes |
|-------|--------|-------|
| All registration pages | 200 | Client forms not visible in raw HTML |
| Lookup no auth | 401 | |
| Submit empty | 400 | |
| Submit Bal Shodh Patrika | 400 | **C1** |
| Submit Conclave no captcha | 403 | Captcha gate works |
| Webhook unsigned | 401 | |
| Create order empty | 400 | |
| v2 admin | 401 | |
| Admin gateway | 500 | **H2** |
| v2 health | 200 supabase | |

---

## Files Inspected

### Pages & components

- `src/app/registration/RegistrationHub.tsx`
- `src/app/registration/page.tsx`, `success/page.tsx`
- `src/app/[locale]/registration/page.tsx`
- `src/app/accommodation/page.tsx` (via route map)
- `src/app/component/Registration/*.tsx` (legacy forms)
- `src/components/forms/*.tsx`, `CategoryStep.tsx`
- `src/lib/useRegistrationSubmit.ts`

### API routes

- `src/app/api/registration/submit/route.ts`
- `src/app/api/registration/upload/route.ts`
- `src/app/api/registration/[registrationId]/route.ts`
- `src/app/api/registration/send-email/route.ts`
- `src/app/api/registration/lookup/route.ts`
- `src/app/api/v2/registration/*`
- `src/app/api/payments/create-order/route.ts`
- `src/app/api/payments/verify-payment/route.ts`
- `src/app/api/payments/razorpay-webhook/route.ts`
- `src/app/api/v2/admin/registrations/route.ts`
- `src/app/api/admin/gateway/[...path]/route.ts`
- `src/app/api/v2/health/route.ts`

### Services & config

- `src/server/services/registration.service.ts`
- `src/server/services/payment.service.ts`
- `src/server/services/storage.service.ts`
- `src/server/services/email.service.ts`
- `src/server/lib/registration-types.ts`
- `src/lib/security/registration-lookup.ts`
- `src/lib/registration/config.ts`
- `src/types/registration.ts`
- `prisma/schema.prisma` (registrations, counters, payments)

### Scripts & DB

- `scripts/_registration-e2e-audit.mjs`
- `scripts/_cutover-exec.mjs`

---

## Routes Inspected (live)

| Route | Method | Status |
|-------|--------|--------|
| `/registration` | GET | 200 |
| `/en/registration` | GET | 200 |
| `/registration/success` | GET | 200 |
| `/accommodation` | GET | 200 |
| `/schoolprojectdisplaysubmission` | GET | 200 |
| `/heiprojectdisplaysubmission` | GET | 200 |
| `/abstract` | GET | 200 |
| `/fulllengthpaper` | GET | 200 |
| `/registration/volunteer` | GET | 200 → redirect |
| `/api/registration/SMK2026-000001` | GET | 401 |
| `/api/registration/submit` | POST | 400/403 |
| `/api/payments/razorpay-webhook` | POST | 401 |
| `/api/v2/health` | GET | 200 |

---

## APIs Inspected

See §Files Inspected — all registration, payment, admin proxy, upload, email, and health endpoints traced.

---

## GO / NO GO — Registration System

### **CONDITIONAL GO**

| Criterion | Met? |
|-----------|------|
| Supabase write path operational | ✅ |
| ID counter / format correct | ✅ |
| Lookup security (401, no PII) | ✅ |
| Captcha + rate limits on submit | ✅ |
| Razorpay validation + webhook HMAC | ✅ |
| Storage policies applied | ✅ |
| All advertised categories work | ❌ (2 broken) |
| Payment E2E proven in production | ❌ (not tested) |
| Email E2E proven | ❌ (not tested) |

### Required before full GO

1. Add `Bal Shodh Patrika` and `Cultural Program` to `TYPE_MAP` / `SUPPORTED_V2_TYPES` with correct Prisma enum mapping.
2. Either restore Volunteer/NGO/Talent in hub or remove legacy redirects.
3. Execute one signed Razorpay test webhook + verify `payment_records` row (staging or controlled prod test).
4. Remove `exports/firebase/` from git (PII).

### Acceptable for current production traffic

Delegate, Conclave, Best Practices, Olympiad, Awards, Exhibition, Projects, Accommodation (hub), and legacy standalone forms **can accept registrations** subject to reCAPTCHA and SMTP availability for confirmation emails.

---

## Risk Score

| Dimension | Score (0=risk, 100=ready) |
|-----------|-------------------------|
| Security | 92 |
| Data persistence | 85 |
| Category coverage | 55 |
| Payment proof | 60 |
| Email proof | 65 |
| Migration integrity | 80 |
| **Overall registration readiness** | **74** |

---

*Audit-only. No production submissions, payments, code changes, deploys, or pushes performed.*
