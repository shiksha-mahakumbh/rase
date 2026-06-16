# Final Production Stabilization — Certification Report

**Project:** Shiksha Mahakumbh 2026  
**URL:** https://www.shikshamahakumbh.com  
**Audit date:** 2026-05-29  
**Method:** Fresh code-path trace (UI → API → DB → Email → Admin)  
**Build:** `npm run lint` ✅ · `npx tsc --noEmit` ✅

---

## Executive Summary

Ten incidents were re-investigated from source. Root causes were confirmed in code (not assumed). Additional hardening was applied in this audit where prior fixes were incomplete for production (notably **fire-and-forget email on Vercel** and **send-email route without attachments**).

**Deployment required** before production GO.

---

## Incident 1 — Email Attachments Missing

### Trace

```
POST /api/registration/submit
  → generateReceiptPdfBuffer()     [submit/route.ts:258]
  → generateRegistrationQrBuffer() [submit/route.ts:270]
  → sendRegistrationCompleteEmail() [submit/route.ts:289+]
    → buildEmailAttachments()      [email.service.ts:36]
    → queueEmail()                 [email.service.ts:369]
      → deliverEmailLog()          [email.service.ts:147]
        → transporter.sendMail({ attachments })
```

### Root causes (verified)

| # | Cause | Location | Effect |
|---|--------|----------|--------|
| A | **`void sendRegistrationCompleteEmail`** — response returned before SMTP finished | `submit/route.ts` (pre-fix) | Vercel serverless could terminate; email body sent without attachments or send skipped |
| B | **`/api/registration/send-email`** called `sendRegistrationConfirmation` **without** PDF/QR | `send-email/route.ts:63` (pre-fix) | Email arrived with HTML only |
| C | Cross-template dedupe (fixed Round 2) blocked `registration_complete` | `email.service.ts` (pre-fix) | Attachment email never sent |
| D | Dedupe on `queued`/`sending` status blocked retry after failed send | `email.service.ts` (pre-fix) | Retry skipped |

### Fixes applied (this audit)

1. **`await sendRegistrationCompleteEmail`** before HTTP response (serverless-safe).
2. **`send-email/route.ts`** regenerates PDF + QR and calls `sendRegistrationCompleteEmail`.
3. Dedupe only when prior `registration_complete` status is **`sent`** (not queued).
4. **Throws** if both attachments not present before queue (`EMAIL_ATTACHMENT_MISSING`).
5. Logs: `EMAIL_ATTACHMENT_CREATED`, `EMAIL_ATTACHMENT_MISSING`, `EMAIL_ATTACHMENT_SENT`, artifact byte counts in submit log.

---

## Incident 2 — Receipt System Inconsistent

### Root cause

Three render paths with duplicated field strings: React component, jsPDF, print HTML.

### SSOT architecture (implemented)

| Layer | File | Used by |
|-------|------|---------|
| Data | `lib/receipt/receipt-data.ts` | All |
| HTML (print) | `lib/receipt/receipt-html.ts` → `buildReceiptHtmlDocument()` | Print popup |
| PDF sections | `lib/receipt/receipt-html.ts` → `getReceiptPdfSections()` | Email + download PDF |
| PDF render | `lib/receipt/generate-receipt-pdf.ts` | Email attachment, download |
| Screen | `components/receipt/ReceiptTemplate.tsx` | Success page |
| Wrapper | `components/registration/RegistrationReceipt.tsx` | Client export/print |

Logo: `RECEIPT_LOGO_PATH = /images/dhe-logo.png` (optional; hides on error if missing).

---

## Incident 3 — Print Receipt Blank

### Root cause

`sr-only` Tailwind (`clip: rect(0,0,0,0)`) on receipt wrapper prevented print layout recovery.

### Fix

- Print uses **`printReceiptDocument()`** → dedicated popup with `buildReceiptHtmlDocument()` (no sr-only, no site chrome).
- On-screen receipt visible via `RegistrationReceipt visible`.
- One A4 page, `@page` + `page-break-inside: avoid`.

---

## Incident 4 — Admin View Fails

### Root cause

| Bug | Evidence |
|-----|----------|
| View link used UUID | `RegistrationTable.tsx` → `/admin/registrations/${row.id}` |
| API required public ID | `v2/.../route.ts` → `REG_ID_RE.test(registrationId)` → 400 |
| Decimal serialization | Raw Prisma row → JSON.stringify fails on Decimal → 500 |

### Fix

- View links use `row.registrationId`.
- `getRegistrationForAdminView()` accepts UUID or public ID.
- `serializeRegistrationForAdmin()` converts Decimal/Date.
- Logs: `ADMIN_VIEW_REQUEST`, `ADMIN_VIEW_SUCCESS`, `ADMIN_VIEW_FAILED`.
- Client shows upstream error message.

---

## Incident 5 — File Upload Failures

### Root cause

`storage.service.ts` rejected xlsx/xls/csv MIME types; browser often sends empty/octet-stream type.

### Fix

- Extended allowlist (PDF, DOC, DOCX, XLS, XLSX, CSV, JPG, JPEG, PNG, etc.).
- `inferMimeType()` from extension.
- Upload route logs `FILE_UPLOAD_START` / `SUCCESS` / `FAILED` with `code` + `detail`.
- Bucket map includes Olympiad, Awards, Accommodation, Delegate.

---

## Incident 6 — Razorpay Details Incomplete

### Fix

`lib/razorpay/order-notes.ts` → `buildRazorpayOrderNotes()` includes:

`registrationType`, `paymentPurpose`, `fullName`, `email`, `phone`, `institution`, `category`, `amount`, `registrationId`

Used in `GenericRegistrationForm.tsx`, `DelegateForm.tsx` → `create-order` → Razorpay notes.

---

## Incident 7 — Payment Flow

### Trace

| Step | Component | Condition |
|------|-----------|-----------|
| 1 Fill form | Forms step 2 | `.registration-details` visible |
| 2 Continue | `RegistrationHub.tsx:111` | Only when `step === 2`; submit hidden via `[&_button[type=submit]]:hidden` |
| 3 Pay | `RazorpayCheckout.tsx` | `loadRazorpayCheckoutScript()` on mount + click |
| 4 Verify | `/api/payments/verify-payment` | handler in RazorpayCheckout |
| 5 Submit | Step 3 | `.registration-details` hidden; submit visible |
| 6 Save | `/api/registration/submit` | |
| 7 Email | `await sendRegistrationCompleteEmail` | |
| 8 Admin | `listRegistrations` / `getRegistrationForAdminView` | |

Script preload: `RegistrationHub.tsx` when `showPaymentStep`.

---

## Incident 8 — Olympiad Registration

### Root cause

1. Zod `studentCount.min(1)` failed before `onSubmit` when count not synced from upload.
2. Server previously required payment when fee > 0 (fixed: `fee = 0` for Olympiad).

### Fix

- Schema: `studentCount.min(0)`.
- Form: set `studentCount` from `parsedStudents.length` before validation.
- Client sends `registrationFee: 0`.
- Server forces Olympiad fee to 0.

---

## Incident 9 — Email Workflow Simplification

### Single email path

| Trigger | Function | Attachments |
|---------|----------|-------------|
| Submit | `sendRegistrationCompleteEmail` | PDF + QR |
| Resend API | `send-email` → same function | PDF + QR regenerated |

Removed from submit path:
- Dual `sendRegistrationConfirmation` + `sendPaymentConfirmation` (prior sessions)
- `fireWorkflowForRegistration("registration_complete")` from `saveRegistration` (prior session)
- Client `queueConfirmationEmail` (prior session)

Dedupe: one `registration_complete` per UUID per 5 min **only if already sent**.

---

## Incident 10 — Certification

### 1. Root Cause Report

See incidents 1–9 above. All traced to specific files and conditions.

### 2. Files Changed (this stabilization audit)

**Added**
- `src/lib/receipt/receipt-html.ts`

**Modified**
- `src/app/api/registration/submit/route.ts` — await email, artifact logging
- `src/app/api/registration/send-email/route.ts` — full attachments
- `src/server/services/email.service.ts` — dedupe, attachment enforcement
- `src/lib/receipt/generate-receipt-pdf.ts` — shared PDF sections
- `src/lib/receipt/print-receipt.ts` — shared HTML
- `src/components/receipt/ReceiptTemplate.tsx` — logo slot
- `src/lib/schemas/registrationSchemas.ts` — Olympiad studentCount
- `src/components/forms/OlympiadForm.tsx` — pre-validation sync

**Prior sessions (still required in deploy bundle)**
- RegistrationHub, RazorpayCheckout, load-checkout-script
- registration.service admin view, RegistrationTable
- storage.service upload, order-notes, SuccessExperience

### 3. Database Impact

**None.** No migrations.

### 4. Security Impact

| Change | Risk |
|--------|------|
| Await email in submit | Slightly longer response (~1–3s); registration still returns success if email throws |
| send-email with artifacts | Same auth/rate limits; now requires DB row |
| Attachment throw | Email fails loudly; registration still saved |
| Admin UUID lookup | Admin-auth only |

### 5. Deployment Plan

1. Commit all stabilization changes
2. `git push origin main`
3. `npx vercel --prod`
4. Confirm env: `BREVO_SMTP_*`, `SUPABASE_*`, `NEXT_PUBLIC_RAZORPAY_KEY_ID`, `RAZORPAY_KEY_SECRET`
5. Optional: add `public/images/dhe-logo.png` for receipt logo

### 6. Production Verification Checklist

**Email**
- [ ] Register Conclave (free) → 1 email with PDF + PNG attachments
- [ ] Vercel logs: `EMAIL_ATTACHMENT_CREATED` ×2, `EMAIL_ATTACHMENT_SENT`
- [ ] `email_logs`: one `registration_complete`, status `sent`

**Receipt**
- [ ] Success page receipt matches download PDF fields
- [ ] Print popup: full receipt + QR, 1 page

**Admin**
- [ ] List loads → View opens detail with email logs
- [ ] Log: `ADMIN_VIEW_SUCCESS`

**Upload**
- [ ] Olympiad xlsx upload → `FILE_UPLOAD_SUCCESS`
- [ ] Projects PDF → success

**Payment (Projects ₹200)**
- [ ] Step 2: only "Continue to payment"
- [ ] Step 3: Pay opens Razorpay; then Submit only
- [ ] Razorpay notes show fullName, email, phone, institution

**Olympiad**
- [ ] Submit without payment → success + email with attachments

### 7. Regression Checklist

- [ ] All free categories submit
- [ ] Paid categories: payment + submit + email
- [ ] No duplicate emails in `email_logs`
- [ ] Category switch independent
- [ ] Admin export unchanged

### 8. GO / NO GO Decision

| Gate | Status |
|------|--------|
| Code audit complete | ✅ PASS |
| Lint / TypeScript | ✅ PASS |
| Root causes documented | ✅ PASS |
| Fixes in working tree | ✅ PASS |
| Deployed to production | ⏳ **PENDING** |
| Manual E2E on production | ⏳ **PENDING** |

## **DECISION: CONDITIONAL NO-GO**

**Do not certify production until:**
1. Changes are deployed to https://www.shikshamahakumbh.com
2. Production verification checklist is executed with evidence (email attachments, admin view, Olympiad submit, paid flow)

After successful production E2E → **GO**.

---

## Evidence-Based Conclusions

| Incident | Verified root cause | Fix in tree | Production verified |
|----------|---------------------|-------------|---------------------|
| 1 Email attachments | void email + send-email without PDF | ✅ | ⏳ |
| 2 Receipt SSOT | 3 implementations | ✅ | ⏳ |
| 3 Print blank | sr-only clipping | ✅ | ⏳ |
| 4 Admin view | UUID link + Decimal JSON | ✅ | ⏳ |
| 5 Upload | MIME allowlist | ✅ | ⏳ |
| 6 Razorpay notes | Minimal orderNotes | ✅ | ⏳ |
| 7 Payment flow | Hidden submit + script loader | ✅ | ⏳ |
| 8 Olympiad | Zod studentCount + fee | ✅ | ⏳ |
| 9 Single email | Multiple paths | ✅ | ⏳ |
| 10 Certification | This document | ✅ | ⏳ |
