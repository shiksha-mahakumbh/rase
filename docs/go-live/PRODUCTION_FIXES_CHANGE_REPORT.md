# Shiksha Mahakumbh 2025 — Production Registration & Payment Fixes

**Status:** Implemented locally · **NOT deployed · NOT pushed**  
**Date:** 29 May 2026  
**Scope:** 16-issue remediation for registration hub, payments, email, receipt, fees, validation, and Multi Track Conference consolidation.

---

## 1. Files Modified

### New files
| File | Purpose |
|------|---------|
| `src/lib/registration/validation.ts` | Phone (10 digits), PAN (`ABCDE1234F`), amount-based PAN rules |
| `src/lib/registration/fees.ts` | Project fees (₹200/₹400), accommodation (₹3000/₹6000), fee resolution |
| `src/lib/registration/categoryMeta.ts` | CMS-style instructions metadata per category |
| `src/components/registration/CategoryInstructionsPanel.tsx` | Right sidebar instructions panel |
| `src/components/registration/RegistrationReceipt.tsx` | DHE-format receipt, PDF download, print-only |
| `docs/go-live/PRODUCTION_FIXES_CHANGE_REPORT.md` | This report |

### Modified files
| File | Changes |
|------|---------|
| `src/app/registration/RegistrationHub.tsx` | Memoized forms, fee-aware payment step, instructions sidebar, instant scroll |
| `src/components/registration/RegistrationFlowContext.tsx` | `currentFee` / `setCurrentFee` for dynamic payment gating |
| `src/components/registration/SuccessExperience.tsx` | Removed calendar/share; receipt PDF + print-only |
| `src/components/registration/CategoryStep.tsx` | Multi Track only; removed paper/abstract hints |
| `src/lib/registration/config.ts` | Fee-aware `requiresPaymentStep`, `PAID_CAPABLE_TYPES`, CMT-only external redirect |
| `src/lib/schemas/registrationSchemas.ts` | Phone, PAN, payment proof, project/accommodation fields |
| `src/components/forms/DelegateForm.tsx` | Free student skips payment; PAN conditional; fee sync |
| `src/components/forms/GenericRegistrationForm.tsx` | Project/accommodation fees, PAN, payment proof |
| `src/components/forms/FormField.tsx` | Tel: numeric input, digits-only, max 10 |
| `src/lib/useRegistrationSubmit.ts` | Parallel uploads; fire-and-forget email; paid-capable logic |
| `src/app/api/registration/submit/route.ts` | Server validation, fee check, async email queue |
| `src/app/api/registration/send-email/route.ts` | Wired to `email.service.ts` + `email_logs` |
| `src/server/services/email.service.ts` | In-memory queue, retry (3×), Brevo provider label |
| `src/server/lib/registration-types.ts` | Removed Paper/Abstract from supported; added Multi Track |
| `src/types/registration.ts` | Removed Paper/Abstract from public types; college project fee constant |
| `src/constants/navigation.ts` | Research menu → Multi Track Conference (CMT) |
| `src/lib/knowledge-graph/content-map.ts` | Consolidated research submit links |
| `src/lib/content/registry.ts` | Multi Track Conference entry |
| `src/lib/seo/publicPages.ts` | Updated legacy route metadata |
| `src/lib/page-heroes.ts` | Multi Track Conference heroes |
| `src/components/home/DiscoverStrip.tsx` | CMT link instead of `/abstract` |
| `src/app/abstract/page.tsx` | Redirect → CMT |
| `src/app/paper/page.tsx` | Redirect → CMT |
| `src/app/fulllengthpaper/page.tsx` | Redirect → CMT |
| `src/app/component/Vibhag/academic/pages/ConferencePage.tsx` | Single Multi Track section |
| `src/app/component/ui/RegistrationShell.tsx` | Optional `sidebar` prop |
| `src/components/admin/AdminRegistrationCategories.tsx` | `PAID_CAPABLE_TYPES` |

---

## 2. Database Changes

**No schema migrations required.** Existing Prisma models support all changes:

| Table | Usage |
|-------|--------|
| `registrations` | `registration_fee`, `razorpay_*`, `email_delivery_status`, `metadata` (PAN, bed type, student type) |
| `payment_records` | Razorpay order/payment IDs, amount, status |
| `email_logs` | `status`: queued → sending → sent / failed; `retry_count`, `provider`, `error_message` |
| `uploaded_files` | Manual payment receipt uploads (`field_name: receipt`) |
| `accommodation_requests` | Linked accommodation portal registrations |
| `delegate_registrations` | `pan_number` for paid delegates ≥ ₹2000 |
| `system_settings` | Unchanged — SMTP/Brevo via env vars |

**Recommended post-deploy verification queries:**
```sql
SELECT status, COUNT(*) FROM email_logs GROUP BY status;
SELECT registration_type, registration_fee FROM registrations WHERE registration_type IN ('Exhibition','Accommodation') ORDER BY created_at DESC LIMIT 20;
```

---

## 3. APIs Modified

| Endpoint | Change |
|----------|--------|
| `POST /api/registration/submit` | Phone/PAN/fee/payment-proof validation; server-side fee match; async `sendRegistrationConfirmation` |
| `POST /api/registration/send-email` | Uses `email.service.ts` queue; updates `email_delivery_status` |
| `POST /api/payments/verify-payment` | Unchanged — signature verify only (no blocking email) |
| `POST /api/payments/create-order` | Unchanged — amount from client fee (validated on submit) |
| `GET /api/registration/[id]` | Unchanged — success page lookup |

---

## 4. Receipt Component Implementation

**File:** `src/components/registration/RegistrationReceipt.tsx`

- DHE-style header (Regd. No., PAN, org address)
- Sections: Receipt No., Registration ID, Date, Registrant, Payment
- Footer: amount box + authorized signature
- `printRegistrationReceipt()` — CSS print isolation (receipt only)
- `downloadRegistrationReceiptPdf()` — jsPDF A4 export
- Wired on success page via hidden off-screen render + print CSS

---

## 5. Payment Flow Changes

### Before
1. Form validate → blocking calls → payment step delay  
2. Razorpay success → verify → submit → **await email** → success

### After
1. Form validate → `requestPaymentStep()` → instant scroll to payment (no blocking API before step 3)
2. `requiresPaymentStep(type, fee)` — **fee = 0 skips payment entirely** (free student delegate)
3. Razorpay verify (signature only) → submit registration → **return success immediately**
4. Email queued fire-and-forget (server + client fallback)

### Fee validation (server)
- Projects: School ₹200, College ₹400
- Accommodation: Single ₹3000, Double ₹6000
- Delegate: category-based (Student = ₹0)
- Paid registration requires Razorpay ID **or** manual receipt upload

---

## 6. Email Flow Changes

```
submit route → sendRegistrationConfirmation()
            → queueEmail() → email_logs (status: queued)
            → processQueue() (async)
                 → SMTP/Brevo transporter
                 → success: status sent
                 → failure: retry up to 3×, then failed
```

**Env required for production email:**
- `SMTP_HOST` (e.g. `smtp-relay.brevo.com`)
- `SMTP_USER`, `SMTP_PASS`, `SMTP_FROM`
- Provider logged as `brevo` when host contains `brevo`/`sendinblue`

User does **not** wait for email completion before success screen.

---

## 7. Validation Changes

| Rule | Frontend | Backend |
|------|----------|---------|
| Phone: 10 digits only | `FormField` tel + Zod | `submit/route.ts` |
| PAN: `ABCDE1234F` | Zod refine | `validatePanForAmount` |
| PAN optional if fee < ₹2000 | Forms + schema | submit route |
| PAN mandatory if fee ≥ ₹2000 | Forms + schema | submit route |
| Payment proof for fee > 0 | Forms + Razorpay/receipt | submit route |
| Project fees 200/400 | GenericRegistrationForm | submit fee match |
| Accommodation 3000/6000 | GenericRegistrationForm | submit fee match |

---

## 8. Multi Track Conference Cleanup Report

### Removed from public registration UX
- Paper Submission, Abstract Submission, Full Length Paper, Call for Papers as separate categories

### Consolidated to
- **Multi Track Conference** → `https://cmt3.research.microsoft.com/SMK2026/`

### Routes redirected to CMT
- `/abstract`, `/paper`, `/fulllengthpaper`

### Navigation / SEO / content
- Research submenu: Multi Track Conference (CMT URL)
- Popular links: Multi Track Conference
- Discover strip, content-map, registry, publicPages metadata updated
- Academic Conference page: single Multi Track section

### Retained (legacy admin data views — not in public nav)
- `/abstractdatadekh`, `/fulllengthdatadekh*`, etc. (historical Firebase data)

---

## 9. Deployment Checklist

- [ ] Review all env vars: `SMTP_*`, `RAZORPAY_*`, `RECAPTCHA_*`, `DATABASE_URL`
- [ ] Confirm Brevo SMTP credentials in Vercel Production
- [ ] Run `npx prisma migrate deploy` (if pending migrations exist)
- [ ] Build: `npm run build`
- [ ] Deploy to staging first
- [ ] Verify CMT redirects: `/abstract`, `/paper`, `/fulllengthpaper`
- [ ] Test free student delegate (no payment step)
- [ ] Test paid delegate ₹2000+ (PAN required)
- [ ] Test Projects ₹200 / ₹400
- [ ] Test Accommodation ₹3000 / ₹6000
- [ ] Test Razorpay live mode with ₹1 test category if available
- [ ] Confirm `email_logs` rows after test registration
- [ ] Receipt PDF + print on success page

---

## 10. Production Verification Checklist

### Performance
- [ ] Payment step opens within **1 second** after Continue
- [ ] Success screen within **2–3 seconds** after Razorpay success

### Registration categories
- [ ] Instructions panel visible for all hub categories
- [ ] Free student delegate: Form → Submit → Success (no Razorpay)

### Payments & receipt
- [ ] Amount on Razorpay order matches category fee
- [ ] Receipt shows correct amount, Payment ID, Order ID
- [ ] Print outputs receipt only (not full page)
- [ ] Manual receipt upload accepted when Razorpay not used

### Email
- [ ] Confirmation email received within 5 minutes
- [ ] `email_logs.status = sent` for successful delivery
- [ ] Failed sends show `failed` with `error_message`

### Validation
- [ ] Phone rejects letters/special chars
- [ ] PAN enforced at ₹2000+

### Navigation
- [ ] No Paper/Abstract/CFP in Research nav or About-adjacent links
- [ ] Multi Track Conference opens CMT

---

## Issue Resolution Summary

| # | Issue | Status |
|---|-------|--------|
| 1 | Payment step slow | ✅ Optimized hub + removed blocking pre-payment calls |
| 2 | Payment success slow | ✅ Async email; immediate success response |
| 3 | Confirmation email | ✅ Queue + retry + email_logs |
| 4 | Success screen buttons | ✅ Download + Print receipt only |
| 5 | Professional receipt | ✅ RegistrationReceipt component |
| 6 | Project fees 200/400 | ✅ Frontend + backend validation |
| 7 | Instructions panel | ✅ CategoryInstructionsPanel + categoryMeta |
| 8 | Free delegate skip payment | ✅ Fee-aware payment step |
| 9 | Phone validation | ✅ 10 digits, numeric input |
| 10 | PAN rules | ✅ Frontend + backend |
| 11 | Accommodation pricing | ✅ ₹3000 / ₹6000 |
| 12 | Payment receipt mandatory | ✅ Razorpay OR upload required |
| 13–15 | Multi Track cleanup | ✅ Nav, routes, SEO, conference page |
| 16 | Database review | ✅ Schema consistent; no migration needed |

---

*Generated locally — do not deploy until checklist is complete.*
