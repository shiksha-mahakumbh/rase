# Shiksha Mahakumbh 2026 — Production Incidents Round 2

**URL:** https://www.shikshamahakumbh.com  
**Date:** 2026-05-29  
**Status:** Fixes implemented locally — deploy required  
**Checks:** `npm run lint` ✅ · `npx tsc --noEmit` ✅

---

## Incident 1 — Email Attachments Disappeared

### Root cause

**Primary:** Cross-template email dedupe in `email.service.ts:315–340` (pre-fix).

```ts
template: { in: ["registration_complete", "registration_confirmation", "payment_confirmation"] }
```

If any confirmation email was logged within 5 minutes, `sendRegistrationCompleteEmail()` was **skipped entirely** via `EMAIL_DEDUPED` — returning an old log row without sending PDF/QR attachments.

**Secondary:** Attachments were omitted when buffers were empty, with no `EMAIL_ATTACHMENT_MISSING` log. Nodemailer did not set explicit `contentDisposition: "attachment"` for PDFs.

### Files

| File | Role |
|------|------|
| `src/server/services/email.service.ts` | Dedupe, attachment build, SMTP send |
| `src/app/api/registration/submit/route.ts` | Generates `receiptPdf` + `qrPng`, calls `sendRegistrationCompleteEmail` |

### Fix

1. Dedupe only `registration_complete` → same template (not cross-template).
2. `buildEmailAttachments()` validates buffer size; logs `EMAIL_ATTACHMENT_CREATED` / `EMAIL_ATTACHMENT_MISSING`.
3. `deliverEmailLog()` logs `EMAIL_ATTACHMENT_SENT` with byte counts.
4. PDF uses `contentDisposition: "attachment"`; QR uses `inline` + CID.

---

## Incident 2 — Print Receipt Page Blank

### Root cause

**File:** `SuccessExperience.tsx:134` (pre-fix)

Receipt was wrapped in Tailwind `sr-only`, which applies:

```css
clip: rect(0, 0, 0, 0);
overflow: hidden;
width: 1px; height: 1px;
```

Print CSS using `visibility: hidden` on `body *` could not recover clipped content — print preview showed blank or tiny header only.

### Fix

1. **`src/lib/receipt/print-receipt.ts`** — opens dedicated print window with full inline HTML (same fields as template) + QR.
2. **`SuccessExperience.tsx`** — on-screen receipt visible via `RegistrationReceipt visible`.
3. Print button calls `printRegistrationReceipt(data, qrDataUrl)` → popup print (one page, no site chrome).

---

## Incident 3 — Download Receipt Format Mismatch

### Root cause

Three implementations: HTML (`RegistrationReceipt.tsx`), jsPDF download (`generate-receipt-pdf.ts`), jsPDF email (`receipt.service.ts`). Fields aligned in Round 1 but no shared React component.

### Fix — Single Source of Truth

| Component | Purpose |
|-----------|---------|
| **`src/components/receipt/ReceiptTemplate.tsx`** | SSOT HTML layout (screen) |
| **`src/lib/receipt/receipt-data.ts`** | SSOT data shape + `buildReceiptData()` |
| **`src/lib/receipt/generate-receipt-pdf.ts`** | SSOT PDF (download + email) |
| **`src/lib/receipt/print-receipt.ts`** | SSOT print HTML |
| **`RegistrationReceipt.tsx`** | Thin wrapper around `ReceiptTemplate` |

All surfaces share the same field set: Regd No, PAN, DHE header, registrant, payment, optional QR.

---

## Incident 4 — Admin View Registration Fails

### Root cause (two bugs)

**Bug A — Wrong ID in link**

`RegistrationTable.tsx:151,241` linked to `/admin/registrations/${row.id}` (UUID).

API `v2/admin/registrations/[registrationId]/route.ts:20` only accepted public IDs matching `REG_ID_RE` → **400 Invalid registration ID**.

**Bug B — Decimal JSON serialization**

Detail endpoint returned raw Prisma row including `Decimal` fields. `NextResponse.json()` fails on Decimal → **500** → client shows "Failed to load registration".

List endpoint worked because `listRegistrations()` converts `registrationFee` to `Number`.

### Fix

1. `RegistrationTable` View links use `row.registrationId` (public ID).
2. `getRegistrationForAdminView()` accepts UUID **or** public ID.
3. `serializeRegistrationForAdmin()` JSON-serializes Dates and Decimals.
4. Includes `emailLogs` in admin detail response.
5. Logs: `ADMIN_VIEW_REQUEST`, `ADMIN_VIEW_SUCCESS`, `ADMIN_VIEW_FAILED`.

---

## Incident 5 — File Upload Failed

### Root cause

**File:** `storage.service.ts:9–18, 55–61` (pre-fix)

1. **MIME allowlist** missing `xlsx`, `xls`, `csv` — Olympiad student lists rejected with `MIME_DENIED`.
2. Browsers often send `application/octet-stream` or empty `file.type` for Excel — strict MIME check failed even when extension was valid.
3. Upload route swallowed `ServiceError` detail — generic "File upload failed" only.
4. Missing registration types in `TYPE_BUCKET_MAP` (Olympiad, Awards, Accommodation, Delegate).

### Fix

1. Extended allowlist + extensions for PDF, DOCX, JPEG, PNG, XLS, XLSX, CSV.
2. `inferMimeType()` resolves MIME from extension when browser type is missing/octet-stream.
3. Upload route logs `FILE_UPLOAD_START` / `SUCCESS` / `FAILED` with `code` + `detail`.
4. Expanded `TYPE_BUCKET_MAP` for all registration categories.

### Security note

Allowlist unchanged in principle — only added documented types. Still 10 MB max. Service role upload only (no public write).

---

## Incident 6 — Razorpay Dashboard Details Incomplete

### Root cause

**Files:** `GenericRegistrationForm.tsx:132`, `DelegateForm.tsx:165` (pre-fix)

Order notes only included `registrationType`, `email`, `category`, `amount` — missing `fullName`, `phone`, `institution`, `paymentPurpose`.

### Fix

**`src/lib/razorpay/order-notes.ts`** — `buildRazorpayOrderNotes()` passes:

```json
{
  "registrationType": "",
  "paymentPurpose": "",
  "fullName": "",
  "email": "",
  "phone": "",
  "institution": "",
  "category": "",
  "amount": ""
}
```

Used by `GenericRegistrationForm` and `DelegateForm` → `RazorpayCheckout` → `create-order` → Razorpay Dashboard notes.

---

## Security Impact

| Area | Impact |
|------|--------|
| Email dedupe | Reduced false dedupe; no new exposure |
| Admin view | UUID lookup admin-auth gated only |
| File upload | Stricter extension + MIME inference; no public bucket write |
| Print popup | Client-only; no server data leak |
| Razorpay notes | PII in Razorpay dashboard (expected for ops) |

---

## Database Impact

None. No migrations required.

---

## Production Fix Plan

1. Commit and push all Round 2 changes to `main`
2. `npx vercel --prod`
3. Verify env: `BREVO_SMTP_*`, Supabase keys, Razorpay keys
4. Run verification checklist below

---

## Verification Checklist

### Email attachments
- [ ] Complete free registration (Conclave)
- [ ] Inbox: 1 email with `receipt-*.pdf` + `qr-*.png` attachments
- [ ] Vercel logs: `EMAIL_ATTACHMENT_CREATED` (×2), `EMAIL_ATTACHMENT_SENT`
- [ ] No `EMAIL_DEDUPED` blocking `registration_complete`

### Print receipt
- [ ] Success page shows full receipt + QR on screen
- [ ] Print opens popup with full receipt (1 page, all sections)

### Download PDF
- [ ] Download matches on-screen receipt fields

### Admin view
- [ ] Admin → Registrations → View on any row
- [ ] Detail loads: personal info, payment, files, email logs
- [ ] Logs: `ADMIN_VIEW_SUCCESS`

### File upload
- [ ] Olympiad: upload `.xlsx` student list
- [ ] Projects: upload PDF
- [ ] Awards: upload JPEG/PNG
- [ ] Logs: `FILE_UPLOAD_SUCCESS`

### Razorpay notes
- [ ] Pay on Projects/Delegate/Accommodation
- [ ] Razorpay Dashboard → Payment → Notes shows fullName, email, phone, institution, category

---

## Regression Checklist

- [ ] Registration submit still works (free + paid)
- [ ] Single email per registration (no duplicates)
- [ ] Razorpay checkout still opens
- [ ] Admin list pagination unchanged
- [ ] Category switching still independent
- [ ] Olympiad submit with fee=0

---

## Files Changed (Round 2)

**Added**
- `src/components/receipt/ReceiptTemplate.tsx`
- `src/lib/receipt/print-receipt.ts`
- `src/lib/razorpay/order-notes.ts`

**Modified**
- `src/server/services/email.service.ts`
- `src/server/services/storage.service.ts`
- `src/server/services/registration.service.ts`
- `src/app/api/registration/upload/route.ts`
- `src/app/api/v2/admin/registrations/[registrationId]/route.ts`
- `src/components/registration/RegistrationReceipt.tsx`
- `src/components/registration/SuccessExperience.tsx`
- `src/components/admin/RegistrationTable.tsx`
- `src/lib/admin/registrations-client.ts`
- `src/components/forms/GenericRegistrationForm.tsx`
- `src/components/forms/DelegateForm.tsx`
