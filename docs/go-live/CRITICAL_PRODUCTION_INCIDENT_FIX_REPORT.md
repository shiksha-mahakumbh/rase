# Shiksha Mahakumbh 2026 — Critical Production Incident Fix Report

**Production URL:** https://www.shikshamahakumbh.com  
**Date:** 2026-05-29  
**Status:** Fixes implemented locally — **NOT YET DEPLOYED**  
**Build:** `npm run lint` ✅ · `npx tsc --noEmit` ✅ · `npm run build` ✅

---

## Executive Summary

Nine production incidents were traced through actual code paths. Root causes were confirmed in source (not assumed). Fixes are implemented in the working tree below. Deploy to Vercel production to activate.

| Issue | Root cause (confirmed) | Fix status |
|-------|------------------------|------------|
| 1 — Olympiad submit fails | Client sent `registrationFee > 0`; server required payment proof | ✅ Fixed (fee forced to 0) |
| 2 — Dual primary buttons | Submit button not hidden on payment step 2 | ✅ Fixed |
| 3 — Razorpay stuck loading | Script inside hidden DOM; `scriptReady` never true | ✅ Fixed |
| 4 — Duplicate emails | Dual server sends + workflow automation trigger | ✅ Fixed |
| 5 — Receipt format inconsistent | Three separate jsPDF implementations | ✅ Fixed (SSOT) |
| 6 — Print receipt 3 pages | Off-screen fixed div + weak print CSS | ✅ Fixed |
| 7 — QR payload limited | Only registrationId in some paths | ✅ Fixed |
| 8 — Category persistence | Global meta not cleared on switch | ✅ Fixed (prior + verified) |
| 9 — Production verification | Matrices below | ✅ Documented |

---

## Issue 1 — Olympiad Registration Does Not Submit

### Root cause

**File:** `src/app/api/registration/submit/route.ts`  
**Lines:** 106–110, 143–156, 129–134

Olympiad was treated as a paid registration when the client sent a non-zero fee:

1. Client (`OlympiadForm.tsx:89–96`) previously set `registrationFee = studentCount × 200`.
2. Server computed `fee` from payload; when `fee > 0`, line 143–156 required payment proof (`razorpayPaymentId`, `utrNumber`, or `paymentReceipt`).
3. Olympiad UI has no payment step → submit always failed with **400: "Payment proof is required for paid registration"**.

Additionally, `olympiadSchema` (`registrationSchemas.ts:213`) requires `studentCount.min(1)` — if draft restored `studentCount: 0` without re-uploading the student file, client-side Zod validation blocks submit before the API is called.

### Fix

| File | Change |
|------|--------|
| `src/components/forms/OlympiadForm.tsx:95–96` | Submit with `registrationFee: 0`, `studentCount: parsedStudents.length` |
| `src/app/api/registration/submit/route.ts:106–110` | Force `fee = 0` when `type === "Olympiad"` |
| `src/app/api/registration/submit/route.ts:129` | Skip fee mismatch check for Olympiad |

### Exact failure condition (pre-fix)

```ts
if (fee > 0) {
  const hasProof = Boolean(data.razorpayPaymentId || ...);
  if (!hasProof) {
    return NextResponse.json({ error: "Payment proof is required for paid registration" }, { status: 400 });
  }
}
```

---

## Issue 2 — Paid Registrations Show Two Primary Buttons

### Root cause

**File:** `src/app/registration/RegistrationHub.tsx`  
**Lines:** 45–48 (pre-fix)

`RegistrationFormRouter` visibility class hid `.registration-payment` on step 2 but **did not hide the submit button**:

```ts
// PRE-FIX — step 2
"[&_.registration-payment]:hidden"
```

Meanwhile:
- `GenericRegistrationForm.tsx:320` — submit always rendered
- `DelegateForm.tsx:222` — submit always rendered
- `RegistrationHub.tsx:108–115` — "Continue to payment" shown on step 2

Result: **"Continue to Payment"** and **"Submit Registration"** visible simultaneously.

### Fix

**File:** `src/app/registration/RegistrationHub.tsx:47–50`

```ts
step === 2
  ? "[&_.registration-payment]:hidden [&_button[type=submit]]:hidden"
  : step === 3
    ? "[&_.registration-details]:hidden"
    : ...
```

### Expected flow (post-fix)

| Step | Visible primary action |
|------|------------------------|
| 2 (details) | Continue to payment & confirmation → |
| 3 (payment) | Pay ₹{fee} (RazorpayCheckout) + Submit Registration |

Only one primary CTA per step.

---

## Issue 3 — Payment Gateway Stuck ("Payment gateway is still loading")

### Root cause

**File:** `src/components/payments/RazorpayCheckout.tsx` (pre-fix)  
**Lines:** 74–76, 189–194

```ts
if (!scriptReady || !window.Razorpay) {
  toast.error("Payment gateway is still loading. Please try again.");
  return;
}
```

The Razorpay `<Script>` component lived inside `.registration-payment`, which was **hidden on step 2** via `[&_.registration-payment]:hidden` in `RegistrationHub.tsx`. Users clicked "Continue to payment" (step 2 → 3), but:

1. Script was loaded inside a hidden section during step 2, or not yet loaded when step 3 opened.
2. `scriptReady` state remained `false`.
3. Every Pay click hit the guard above — Razorpay never opened.

No `useRazorpay.ts` exists in this codebase; loading was entirely component-scoped.

### Fix

| File | Change |
|------|--------|
| `src/lib/razorpay/load-checkout-script.ts` | **NEW** — global singleton script loader with structured logs |
| `src/components/payments/RazorpayCheckout.tsx` | Remove Next `<Script>`; load on mount + retry on click; add `RAZORPAY_*` logs |
| `src/app/registration/RegistrationHub.tsx:186–195` | Preload script when `showPaymentStep === true` |

### Structured logs added

```
RAZORPAY_SCRIPT_LOAD_START
RAZORPAY_SCRIPT_LOAD_SUCCESS
RAZORPAY_SCRIPT_LOAD_FAILED
RAZORPAY_CREATE_ORDER_START
RAZORPAY_CREATE_ORDER_SUCCESS
RAZORPAY_CREATE_ORDER_FAILED
RAZORPAY_OPEN
RAZORPAY_OPEN_FAILED
PAYMENT_VERIFIED
PAYMENT_VERIFY_FAILED
```

### Production env requirement

`NEXT_PUBLIC_RAZORPAY_KEY_ID` must be set in Vercel. If missing, `RazorpayCheckout.tsx:178–184` shows fallback message (not the loading toast).

---

## Issue 4 — Duplicate Emails

### Root cause (three paths)

| Path | File | Trigger |
|------|------|---------|
| **A — Dual server sends (paid)** | `submit/route.ts:286–337` (pre-fix) | `sendRegistrationConfirmation` + `sendPaymentConfirmation` |
| **B — Client fallback** | `useRegistrationSubmit.ts` (pre-fix) | `queueConfirmationEmail()` → `/api/registration/send-email` |
| **C — Workflow automation** | `registration.service.ts:257–261` (pre-fix) | `fireWorkflowForRegistration("registration_complete")` |

Path B was removed in a prior session. Paths A and C were fixed in this session.

### Fix

| File | Change |
|------|--------|
| `src/server/services/email.service.ts` | **NEW** `sendRegistrationCompleteEmail()` — single email with registration + payment + PDF + QR |
| `src/app/api/registration/submit/route.ts:289–320` | One `sendRegistrationCompleteEmail()` call for all categories |
| `src/server/services/email.service.ts:296–320` | Dedupe guard in `queueEmail()` — skip if same registration sent within 5 min |
| `src/server/services/registration.service.ts` | Removed `fireWorkflowForRegistration("registration_complete")` from `saveRegistration()` |

### Single email content

**Free:** Registration confirmation + Registration ID + QR + Receipt PDF  
**Paid:** Registration confirmation + Payment confirmation + Registration ID + Payment ID + Amount + QR + Receipt PDF — all in **one** email.

---

## Issue 5 — Receipt Format Inconsistent

### Root cause

Three separate implementations:

| Surface | File | Template |
|---------|------|----------|
| Print / HTML | `RegistrationReceipt.tsx` | Full letterhead (Regd No, PAN, address) |
| Download PDF | `RegistrationReceipt.tsx:114–149` (pre-fix) | Simplified jsPDF |
| Email PDF | `receipt.service.ts:60–97` (pre-fix) | Different simplified jsPDF |

### Fix — Single Source of Truth

| File | Role |
|------|------|
| `src/lib/receipt/receipt-data.ts` | **SSOT** — `ReceiptData`, `buildReceiptData()`, org constants |
| `src/lib/receipt/generate-receipt-pdf.ts` | **SSOT** — PDF generation used by download + email |
| `src/components/registration/RegistrationReceipt.tsx` | HTML print view (matches PDF fields) |
| `src/server/services/receipt.service.ts` | Delegates to shared PDF module |

Print, download, and email now share the same field set and org header content.

---

## Issue 6 — Print Receipt Prints 3 Pages

### Root cause

**File:** `src/components/registration/SuccessExperience.tsx:127–130` (pre-fix)

```tsx
<div className="fixed -left-[9999px] top-0 print:static print:left-auto">
  <RegistrationReceipt data={receiptData} />
</div>
```

Problems:
1. Off-screen `fixed` positioning caused layout overflow in some browsers during print.
2. `print:static print:left-auto` on wrapper made receipt + success card both participate in print layout.
3. Weak `@media print` rules did not suppress site chrome (nav, footer, success card sections).

### Fix

| File | Change |
|------|--------|
| `SuccessExperience.tsx` | Receipt wrapper: `sr-only print:not-sr-only print:fixed print:inset-0` |
| `RegistrationReceipt.tsx:printRegistrationReceipt()` | Stronger `@media print` — hide all body content except `#registration-receipt`, `@page A4`, `page-break-inside: avoid` |
| `RegistrationReceipt.tsx` root | `print:max-h-[277mm] print:[break-inside:avoid]` |

Expected: **1 registration = 1 page**.

---

## Issue 7 — QR Code Payload Upgrade

### Root cause

**File:** `src/server/services/receipt.service.ts:37–42` (pre-fix)

```json
{ "registrationId", "fullName", "category", "event", "verifyUrl" }
```

**File:** `SuccessExperience.tsx:94` (pre-fix) — QR contained **registrationId string only**.

### Fix

**File:** `src/lib/receipt/qr-payload.ts` — canonical payload builder

```json
{
  "registrationId": "",
  "fullName": "",
  "registrationType": "",
  "category": "",
  "institution": "",
  "email": ""
}
```

Updated in:
- `src/server/services/receipt.service.ts` — email QR attachment
- `src/app/api/registration/submit/route.ts:270–277` — submit path
- `src/components/registration/SuccessExperience.tsx` — success page display QR

Error correction level `M` retained for scan reliability with larger JSON payload.

---

## Issue 8 — Category Persistence Audit

### Root cause (historical)

Global `smk_registration_meta` in localStorage stored `registrationType` without clearing per-category drafts on switch. Selecting Projects caused other forms to reopen as Projects.

### Fixes (verified in code)

| File | Mechanism |
|------|-----------|
| `draftStorage.ts:62–70` | `switchRegistrationCategory()` resets meta to step 1 for new type |
| `draftStorage.ts:16–31` | `saveDraft()` no longer forces step 2 globally |
| `RegistrationHub.tsx:217–224` | On category change: `clearDraft(oldType)` + `switchRegistrationCategory(t)` |
| `RegistrationHub.tsx:252–258` | "Change category": `clearDraft()`, `clearRegistrationMeta()`, reset to Delegate |

### Expected behaviour (post-fix)

| Transition | Result |
|------------|--------|
| Projects → Delegate | Delegate form, empty draft |
| Projects → Accommodation | Accommodation form, empty draft |
| Accommodation → Conclave | Conclave form, no payment step |
| Refresh after switch | Meta restores correct type only |

Forms are keyed by `registrationType` in `RegistrationHub.tsx:278` (`key={registrationType}`) forcing remount on switch.

---

## Issue 9 — Production Verification Matrices

Use after deploy to certify production.

### Registration Matrix

| Category | Open | Submit | Email | Payment | Admin |
|----------|------|--------|-------|---------|-------|
| Delegate Registration | ☐ | ☐ | ☐ | ☐ (if fee > 0) | ☐ |
| Conclave | ☐ | ☐ | ☐ | N/A | ☐ |
| Best Practices | ☐ | ☐ | ☐ | N/A | ☐ |
| Olympiad | ☐ | ☐ | ☐ | N/A (free) | ☐ |
| Awards | ☐ | ☐ | ☐ | N/A | ☐ |
| Exhibition | ☐ | ☐ | ☐ | N/A | ☐ |
| Projects | ☐ | ☐ | ☐ | ☐ | ☐ |
| Bal Shodh Patrika | ☐ | ☐ | ☐ | N/A | ☐ |
| Cultural Program | ☐ | ☐ | ☐ | N/A | ☐ |
| Accommodation | ☐ | ☐ | ☐ | ☐ | ☐ |
| Multi Track Conference | ☐ redirect | N/A | N/A | N/A | N/A |

### Payment Matrix

| Category | Fee | Razorpay Opens | Payment Verifies | Registration Saves |
|----------|-----|----------------|------------------|-------------------|
| Delegate (paid tier) | ₹200 / ₹400 | ☐ | ☐ | ☐ |
| Projects (School) | ₹200 | ☐ | ☐ | ☐ |
| Projects (College) | ₹400 | ☐ | ☐ | ☐ |
| Accommodation (Single) | ₹3000 | ☐ | ☐ | ☐ |
| Accommodation (Double) | ₹6000 | ☐ | ☐ | ☐ |
| Olympiad | ₹0 | N/A | N/A | ☐ |
| All free categories | ₹0 | N/A | N/A | ☐ |

### Email Matrix

| Category | Emails Sent (expect 1) | PDF Attached | QR Attached |
|----------|------------------------|--------------|-------------|
| Free (e.g. Conclave) | ☐ 1 | ☐ | ☐ |
| Paid (e.g. Projects) | ☐ 1 | ☐ | ☐ |
| Olympiad | ☐ 1 | ☐ | ☐ |

Verify `email_logs` table: one row with `template = registration_complete` per registration.

### Receipt Matrix

| Surface | Matches SSOT | Single Page |
|---------|----------------|-------------|
| Print | ☐ | ☐ |
| Download PDF | ☐ | N/A |
| Email attachment | ☐ | N/A |

Compare: Receipt No., Regd No., PAN, registrant fields, payment fields — must match across all three.

---

## Files Changed

### Modified

- `src/app/api/registration/submit/route.ts`
- `src/app/registration/RegistrationHub.tsx`
- `src/components/payments/RazorpayCheckout.tsx`
- `src/components/registration/RegistrationReceipt.tsx`
- `src/components/registration/SuccessExperience.tsx`
- `src/server/services/email.service.ts`
- `src/server/services/receipt.service.ts`
- `src/server/services/registration.service.ts`

### Added

- `src/lib/razorpay/load-checkout-script.ts`
- `src/lib/receipt/receipt-data.ts`
- `src/lib/receipt/generate-receipt-pdf.ts`
- `src/lib/receipt/qr-payload.ts`

### Prior session (already in tree)

- `src/components/forms/OlympiadForm.tsx`
- `src/lib/useRegistrationSubmit.ts` (client email fallback removed)
- `src/lib/registration/draftStorage.ts`

---

## Regression Risks

| Risk | Mitigation |
|------|------------|
| Workflow emails for `registration_complete` no longer auto-fire | Admin can still trigger via workflow rules on other triggers; dedupe prevents double-send if re-enabled |
| Razorpay script loaded globally | Singleton loader prevents duplicate script tags; idempotent |
| `registration_complete` template new in email_logs | Column is `String?` — no migration needed |
| QR payload larger | Error correction `M` — test scan at venue distance |
| Submit hidden on step 2 via CSS | If form adds non-`type=submit` buttons, they would still show — current forms use standard submit |
| Admin resend still uses `sendPaymentConfirmation` | Separate admin path; not affected by submit dedupe window |

---

## Deployment Checklist (Vercel)

1. **Commit and push** all changed files to `main`
2. **Verify env vars** on Vercel production:
   - `NEXT_PUBLIC_RAZORPAY_KEY_ID`
   - `RAZORPAY_KEY_SECRET`
   - `BREVO_SMTP_*` (or `SMTP_*`)
   - `DATABASE_URL`
   - `RECAPTCHA_*`
3. **Deploy:** `npx vercel --prod` (or auto-deploy from main)
4. **Confirm deployment** aliases: `www.shikshamahakumbh.com`
5. **Check Vercel function logs** for `RAZORPAY_SCRIPT_LOAD_SUCCESS` on first paid registration test

---

## Post-Deploy Verification (Step-by-Step)

### 1. Olympiad (Issue 1)

1. Open https://www.shikshamahakumbh.com/registration
2. Select **Olympiad** → fill participant details
3. Upload valid student list Excel
4. Submit — expect success redirect with `SMK2026-XXXXXX`
5. Check inbox: **one** email with PDF + QR
6. Admin panel: registration visible

### 2. Dual buttons (Issue 2)

1. Select **Projects** → fill details (step 2)
2. Confirm: only **"Continue to payment"** visible (no Submit)
3. Click continue → step 3
4. Confirm: **Pay ₹200/400** + **Submit Registration** (no Continue button)

### 3. Razorpay (Issue 3)

1. On step 3, click **Pay ₹{amount}**
2. DevTools console: `RAZORPAY_CREATE_ORDER_SUCCESS` → `RAZORPAY_OPEN`
3. Razorpay modal opens (test mode or live)
4. Complete test payment → `PAYMENT_VERIFIED` in console
5. Submit registration → success page

### 4. Email dedupe (Issue 4)

1. Complete any registration
2. Query DB: `SELECT template, status, created_at FROM email_logs WHERE registration_id = '{uuid}' ORDER BY created_at`
3. Expect **one** `registration_complete` row with `status = sent`

### 5. Receipt consistency (Issues 5 & 6)

1. On success page: Download PDF, Print, compare to email attachment
2. All three must show same Receipt No., amounts, registrant details
3. Print preview: **1 page only**

### 6. QR payload (Issue 7)

1. Scan QR from email or success page
2. Decode JSON — must include `registrationId`, `fullName`, `registrationType`, `category`, `institution`, `email`

### 7. Category switch (Issue 8)

1. Select Projects → enter partial data
2. Change category to Delegate
3. Confirm Delegate form (not Projects)
4. Refresh page — still Delegate, not Projects

---

## GO / NO-GO

| Gate | Status |
|------|--------|
| Lint | ✅ PASS |
| TypeScript | ✅ PASS |
| Build | ✅ PASS |
| Deployed to production | ⏳ PENDING |
| Manual E2E (matrices above) | ⏳ PENDING post-deploy |

**Recommendation:** Deploy to production, then complete Issue 9 matrices manually. **NO-GO for public paid registrations until Razorpay E2E passes on production.**
