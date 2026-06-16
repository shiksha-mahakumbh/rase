# Production Fix Verification — Shiksha Mahakumbh 2025

**Date:** 2026-05-29  
**Production URL:** https://www.shikshamahakumbh.com  
**Build target:** `npm run lint` + `npm run build` (local verified)

---

## 1. Root Cause Summary

| # | Issue | Root Cause |
|---|-------|------------|
| 1 | Payment succeeds, no registration | Two-step flow (verify → submit); submit hidden after fee hydration race on step 2 |
| 2 | Projects category sticks | Global `smk_registration_meta` in localStorage restored wrong category/step |
| 3 | Admin list fails | Generic error masked upstream 401/503/500; Prisma Decimal not JSON-serializable |
| 4 | No PDF/QR on confirmation email | `sendRegistrationConfirmation()` sent HTML only; attachments only on payment email |
| 5 | Payment email only (no dual send) | Paid flow omitted registration confirmation with artifacts |
| 6 | Orphan payments | Verified payments not consumed when user never clicked Submit |
| 7 | create-order fee trust | Client-supplied amount accepted without server fee validation |

---

## 2. Files Changed

| File | Change |
|------|--------|
| `src/app/registration/RegistrationHub.tsx` | 3-step payment flow; no submit hide; category reset; clear draft on switch |
| `src/lib/registration/draftStorage.ts` | Stop forcing meta step; `clearRegistrationMeta`, `switchRegistrationCategory` |
| `src/lib/registration/config.ts` | `usesMultiStepPaymentFlow()` |
| `src/components/registration/RegistrationFlowContext.tsx` | Payment verified handler |
| `src/components/forms/GenericRegistrationForm.tsx` | `notifyPaymentVerified()` after pay |
| `src/components/forms/DelegateForm.tsx` | Same |
| `src/lib/useRegistrationSubmit.ts` | `REGISTRATION_START` log |
| `src/app/api/registration/submit/route.ts` | Dual emails; PDF+QR on all confirmations; structured logs |
| `src/server/services/email.service.ts` | Attachments on `sendRegistrationConfirmation`; `EMAIL_*_ATTACHED` logs |
| `src/server/services/receipt.service.ts` | QR payload: registrationId + name + category |
| `src/server/services/razorpay-verified.service.ts` | `PAYMENT_VERIFIED` log |
| `src/lib/razorpay/handlers.ts` | Server-side fee validation on create-order |
| `src/server/services/registration.service.ts` | Decimal → number for admin list |
| `src/lib/admin/registrations-client.ts` | Upstream error detail; `ADMIN_FETCH_SUCCESS/FAILED` |
| `src/lib/admin/legacy-registration-fetch.ts` | Upstream error detail |
| `src/app/api/admin/gateway/[...path]/route.ts` | Admin fetch logs |
| `src/app/api/admin/payment-recovery/route.ts` | **New** — alias to v2 payment recovery |
| `src/server/services/admin/reconciliation.service.ts` | `ORPHAN_PAYMENT_RECOVERED` log |

---

## 3. Diff Summary

- **Registration flow:** Payment verification advances hub to step 3; submit always visible on final step.
- **Category isolation:** Meta cleared on "Change category"; prior draft cleared when selecting new category.
- **Email:** Every successful registration sends confirmation with `receipt.pdf` + `qr.png`; paid flows also send payment confirmation.
- **Admin:** Errors show HTTP status + message; list serialization fixed.
- **Security:** `create-order` rejects amount mismatch vs server-resolved fee from order notes.
- **Recovery:** `POST /api/admin/payment-recovery` with action `manual-link` links orphan payment → registration.

---

## 4. Deployment Steps

1. Ensure Vercel env vars:
   - `ADMIN_OPS_SECRET`
   - `NEXT_PUBLIC_SITE_URL=https://www.shikshamahakumbh.com`
   - `NEXT_PUBLIC_RAZORPAY_KEY_ID`, `RAZORPAY_KEY_SECRET`
   - Brevo SMTP vars
2. Run locally before deploy:
   ```bash
   npm run lint
   npx tsc --noEmit
   npm run build
   ```
3. Deploy to Vercel production.
4. Razorpay Dashboard:
   - Business website: `https://www.shikshamahakumbh.com`
   - Allowed domains: `www.shikshamahakumbh.com`, `shikshamahakumbh.com`
5. Post-deploy: clear browser `localStorage.smk_registration_meta` for affected users.

---

## 5. SQL Verification

```sql
-- Orphan payments (need recovery)
SELECT razorpay_payment_id, amount, verified_at, metadata
FROM razorpay_verified_payments
WHERE consumed_at IS NULL
ORDER BY verified_at DESC;

-- Recent registrations
SELECT registration_id, email, registration_type, payment_status, razorpay_payment_id, created_at
FROM registrations
WHERE deleted_at IS NULL
ORDER BY created_at DESC
LIMIT 25;

-- Email delivery (both templates for paid)
SELECT template, status, to_email, registration_id, sent_at, error_message
FROM email_logs
WHERE created_at > NOW() - INTERVAL '7 days'
ORDER BY created_at DESC
LIMIT 50;

-- Duplicate payment linkage
SELECT razorpay_payment_id, COUNT(*) AS cnt
FROM registrations
WHERE razorpay_payment_id IS NOT NULL AND deleted_at IS NULL
GROUP BY razorpay_payment_id
HAVING COUNT(*) > 1;
```

---

## 6. Manual Test Checklist

| Test | Steps | Expected |
|------|-------|----------|
| Delegate free | Complete Conclave/Delegate free form → Submit | SMK ID; email with PDF + QR |
| Projects ₹200 | School Student → pay → step 3 → Submit | Registration row; 2 emails; attachments |
| Accommodation | Single Bed ₹3000 → pay → submit | Same as Projects |
| Category switch | Projects → Change category → Delegate | Delegate form, not Projects |
| Payment verify | Check Vercel logs after Razorpay pay | `PAYMENT_VERIFIED` |
| Registration save | After submit | `REGISTRATION_SAVED`; `consumed_at` set |
| Admin list | `/admin` registrations tab | List loads or shows specific error |
| Orphan recovery | Admin → Payment Recovery → manual-link | `ORPHAN_PAYMENT_RECOVERED` |
| Fee tamper | POST create-order with wrong amount | 400 rejected |

---

## 7. Structured Logs to Monitor

| Event | When |
|-------|------|
| `PAYMENT_VERIFIED` | Razorpay signature verified |
| `REGISTRATION_START` | Submit API called |
| `REGISTRATION_SAVED` | Row persisted |
| `REGISTRATION_FAILED` | Submit error |
| `EMAIL_RECEIPT_ATTACHED` | PDF added to email |
| `EMAIL_QR_ATTACHED` | QR PNG added to email |
| `EMAIL_SEND_SUCCESS` | SMTP delivered |
| `CATEGORY_SELECTED` / `CATEGORY_RESET` | Hub navigation |
| `ADMIN_FETCH_SUCCESS` / `ADMIN_FETCH_FAILED` | Admin API |
| `ORPHAN_PAYMENT_RECOVERED` | Manual payment link |

---

## 8. GO / NO GO Verdict

| Gate | Status |
|------|--------|
| TypeScript / build | **GO** — local `npm run build:clean` passed |
| Code fixes applied | **GO** — all 8 tasks addressed in codebase |
| Production deploy | **PENDING** — requires Vercel deploy by operator |
| Live E2E (paid Projects) | **PENDING** — run post-deploy |
| Razorpay dashboard website | **PENDING** — operator action |
| Orphan SQL audit | **PENDING** — run on production DB |

### Overall: **CONDITIONAL GO**

Deploy is recommended. Full production sign-off requires post-deploy manual E2E + SQL orphan check + Razorpay dashboard website alignment.

---

## 9. Security Review — create-order

**Finding:** Public (unauthenticated) order creation is **intentional** — users pay before registration submit.

**Mitigations applied:**
- Rate limit: 30 req/min/IP
- Minimum amount 100 paise
- INR only
- When `notes.registrationType` present: amount validated against `resolveRegistrationFee()` server-side
- Submit route independently validates fee + verified payment amount

**Residual risk:** Orders without `registrationType` in notes still rely on min-amount only. All checkout components pass notes with type/category/amount.
