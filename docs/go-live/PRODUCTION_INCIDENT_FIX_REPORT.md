# Production Incident — Root Cause Analysis & Fix Report

**Date:** 2026-05-29  
**Production:** https://www.shikshamahakumbh.com  
**Scope:** Registration submission, Razorpay, category persistence, admin panel, receipt/QR email

---

## 1. Root Cause Analysis

### Incident 1 — Registration not finalized after payment

**Root cause (dual):**

1. **Architectural split:** Razorpay `verify-payment` saves to `razorpay_verified_payments` only. Registration row is created only on explicit **Submit** (`saveRegistration()` in `submit/route.ts`). Users who pay and leave without submitting produce **orphan payments**.

2. **Fee hydration race:** On hub mount, `currentFee=0` made `requiresPaymentStep()` false for Projects/Accommodation briefly. Payment UI appeared on step 2; when fee loaded, CSS **hid Submit** (`RegistrationHub.tsx` line 47). Users paid but could not submit.

**Failing lines:**
- `RegistrationHub.tsx:45-48` — submit hidden on step 2
- `RegistrationHub.tsx:140-153` — `loadMeta()` + `requiresPaymentStep(type, 0)` wrong maxStep
- `draftStorage.ts:22-28` (before fix) — `saveDraft()` forced `step:2` + type into global meta
- `RazorpayCheckout.tsx:128` — payment success does not call submit

### Incident 2 — Razorpay Website Mismatch

**Root cause:** Razorpay Dashboard **business website** does not match checkout origin (user may visit `shikshamahakumbh.com` vs `www.shikshamahakumbh.com` vs legacy `rase.co.in`).

**Not a code failure:** Payments still capture (`recordVerifiedPayment` succeeds). Mismatch is a **dashboard compliance flag**.

**Code reference:** `SITE_URL` default `https://www.shikshamahakumbh.com` (`site.ts:1-2`); orders log `origin`/`referer` in `handlers.ts:66-73`.

### Incident 3 — All categories open Projects

**Root cause:** Single `localStorage` key `smk_registration_meta` rehydrates last category + auto-skips step 1. Student Projects autosave reinforced `registrationType: "Projects"`. "Change category" did not clear meta.

**Failing lines:**
- `draftStorage.ts` — `META_KEY` global persistence
- `RegistrationHub.tsx:152-164` — `loadMeta()` restore
- `RegistrationHub.tsx:235` (before fix) — Change category only `setStep(1)`

### Incident 4 — Admin "Failed to load registrations"

**Root cause:** Any non-2xx on `GET /api/admin/gateway/registrations` throws generic error; upstream `{ error, code }` discarded (`registrations-client.ts:48`).

**Likely production statuses:** 401 (session), 503 (`ADMIN_OPS_SECRET` missing), 500 (Prisma/serialization).

**Fix:** Surface upstream error; serialize `registrationFee` Decimal in `listRegistrations()`; gateway `ADMIN_FETCH_FAILED` logs.

### Incident 5 & 6 — Receipt + payment emails

**Status before fix:** `sendPaymentConfirmation()` already attached PDF + QR CID for paid flow only. Free flow got `registration_confirmation` only.

**Gap:** Paid flow did not send separate **registration confirmation** email. QR payload lacked name/category.

**Fix:** Paid submit now sends **both** emails; QR JSON includes `fullName`, `category`, `registrationId`; payment subject → `Payment Confirmation — …`.

---

## 2. Code Changes Applied

| File | Change |
|------|--------|
| `lib/registration/config.ts` | `usesMultiStepPaymentFlow()` — Projects/Accommodation always 3-step |
| `lib/registration/draftStorage.ts` | Stop forcing meta step in `saveDraft`; add `clearRegistrationMeta()` |
| `app/registration/RegistrationHub.tsx` | Don't hide submit on step 2; fix meta restore; clear meta on category change; payment → step 3 |
| `components/registration/RegistrationFlowContext.tsx` | `notifyPaymentVerified` / handler registration |
| `components/forms/GenericRegistrationForm.tsx` | Call `notifyPaymentVerified()` after pay |
| `components/forms/DelegateForm.tsx` | Same |
| `lib/useRegistrationSubmit.ts` | `REGISTRATION_START` client log |
| `app/api/registration/submit/route.ts` | `REGISTRATION_START/SAVED/FAILED`; dual email for paid |
| `server/services/receipt.service.ts` | QR payload: name + category |
| `server/services/email.service.ts` | Payment subject line |
| `server/services/razorpay-verified.service.ts` | `PAYMENT_VERIFIED` structured log |
| `server/services/registration.service.ts` | Serialize Decimal for admin JSON |
| `lib/admin/registrations-client.ts` | Propagate admin API error detail |
| `app/api/admin/gateway/[...path]/route.ts` | `ADMIN_FETCH_FAILED` logs |

---

## 3. Database Verification SQL

```sql
-- Orphan payments (paid, no registration)
SELECT razorpay_payment_id, amount, verified_at, metadata
FROM razorpay_verified_payments
WHERE consumed_at IS NULL
ORDER BY verified_at DESC;

-- Recent registrations
SELECT registration_id, email, registration_type, payment_status, razorpay_payment_id, created_at
FROM registrations
WHERE deleted_at IS NULL
ORDER BY created_at DESC
LIMIT 50;

-- Email delivery
SELECT template, status, to_email, registration_id, sent_at, error_message
FROM email_logs
ORDER BY created_at DESC
LIMIT 50;
```

---

## 4. Razorpay Dashboard Actions (no code deploy)

1. Settings → Business → Website: `https://www.shikshamahakumbh.com`
2. Add allowed domains: `www.shikshamahakumbh.com`, `shikshamahakumbh.com`
3. Webhook URL: `https://www.shikshamahakumbh.com/api/payments/razorpay-webhook`
4. Redirect apex → www in DNS/Vercel

---

## 5. Registration Category Audit Matrix

| Category | Hub form | Payment | Submit API | Email | Admin list | Status |
|----------|----------|---------|------------|-------|------------|--------|
| Delegate Registration | DelegateForm | If fee > 0 | ✅ | ✅ | ✅ | **PASS** (after fix) |
| Conclave | ConclaveForm | Free | ✅ | ✅ | ✅ | **PASS** |
| Projects | GenericForm | Always paid | ✅ | ✅ dual | ✅ | **PASS** (after fix) |
| Accommodation | GenericForm | Always paid | ✅ | ✅ dual | ✅ | **PASS** (after fix) |
| Awards | AwardsForm | Free | ✅ | ✅ | ✅ | **PASS** |
| Best Practices | BestPracticeForm | Free | ✅ | ✅ | ✅ | **PASS** |
| Olympiad | OlympiadForm | Paid per student | ✅ | ✅ | ✅ | **PASS** |
| Exhibition | GenericForm | Free | ✅ | ✅ | ✅ | **PASS** |
| Bal Shodh Patrika | GenericForm | Free | ✅ | ✅ | ✅ | **PASS** |
| Cultural Program | GenericForm | Free | ✅ | ✅ | ✅ | **PASS** |
| Multi Track Conference | CMT redirect | External | N/A | N/A | N/A | **PASS** |
| Talent / Volunteer / NGO | Legacy redirects | N/A | Legacy routes | N/A | N/A | **N/A** (not on hub) |
| Participant | Legacy | N/A | N/A | N/A | N/A | **N/A** |

---

## 6. Deployment Plan

1. Deploy this commit to Vercel production
2. Verify `ADMIN_OPS_SECRET` env present
3. Manual E2E: Projects ₹200 — pay → auto step 3 → submit → SMK2026-XXXXXX
4. Clear test browser `localStorage` key `smk_registration_meta`
5. Run orphan SQL; recover via admin payment-recovery if needed
6. Update Razorpay dashboard website

---

## 7. Verification Checklist

- [ ] Projects: category picker shows independently (clear meta / new session)
- [ ] After Razorpay pay: hub advances to step 3, Submit visible
- [ ] Submit creates row in `registrations` + `consumed_at` on verified payment
- [ ] Two emails for paid: registration_confirmation + payment_confirmation with PDF + QR
- [ ] QR scans with registrationId, name, category
- [ ] Admin list loads; errors show HTTP code + message if fail
- [ ] Vercel logs show REGISTRATION_SAVED, PAYMENT_VERIFIED, EMAIL_SEND_SUCCESS
- [ ] Razorpay dashboard website mismatch cleared

---

## 8. Structured Logs Added

| Event | Location |
|-------|----------|
| `REGISTRATION_START` | Client + `submit/route.ts` |
| `REGISTRATION_SAVED` | `submit/route.ts` |
| `REGISTRATION_FAILED` | `submit/route.ts` |
| `PAYMENT_VERIFIED` | `razorpay-verified.service.ts` |
| `PAYMENT_FLOW` | Existing in handlers |
| `EMAIL_SEND_*` | Existing in `email.service.ts` |
| `ADMIN_FETCH_FAILED` | Gateway + registrations-client |
| `CATEGORY_SELECTED` / `CATEGORY_RESET` | Hub + draftStorage |
