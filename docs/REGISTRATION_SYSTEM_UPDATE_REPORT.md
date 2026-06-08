# Registration System Update Report

**Date:** 2026-06-08  
**Scope:** Category expansion, CMT redirects, payment flow split, admin status model

---

## 1. Files Changed

| File | Change |
|------|--------|
| `src/lib/registration/config.ts` | **NEW** — paid/free/CMT redirect rules, status resolver |
| `src/types/registration.ts` | New types, statuses, category options, collection map |
| `src/components/registration/CategoryStep.tsx` | CMT redirect on select; new category hints |
| `src/components/registration/RegistrationProgress.tsx` | 2-step (free) vs 3-step (paid) progress |
| `src/app/registration/RegistrationHub.tsx` | Dynamic flow; paid/free labels; Projects payment |
| `src/components/forms/DelegateForm.tsx` | Paid-only Razorpay; new status resolver |
| `src/components/forms/GenericRegistrationForm.tsx` | `requiresPayment` for Projects/Accommodation |
| `src/components/forms/ConclaveForm.tsx` | Payment removed; direct submit |
| `src/components/forms/BestPracticeForm.tsx` | Payment removed |
| `src/components/forms/AwardsForm.tsx` | Payment removed |
| `src/components/forms/OlympiadForm.tsx` | Payment removed (student programs free) |
| `src/lib/useRegistrationSubmit.ts` | Skip payment payload for free types |
| `src/lib/saveRegistration.ts` | Default statuses per category |
| `src/lib/schemas/registrationSchemas.ts` | Olympiad UTR refine removed |
| `src/lib/registration/draftStorage.ts` | Flexible step meta |
| `src/lib/firestore/payments.server.ts` | `Pending Payment` webhook mapping |
| `src/components/admin/AdminRegistrationCategories.tsx` | **NEW** — paid/free legend |
| `src/components/admin/AdminDashboardOverview.tsx` | Free Submitted stat |
| `src/components/admin/RegistrationTable.tsx` | Status badges for new statuses |
| `src/components/admin/AdminGrowthAnalytics.tsx` | Pending Payment filter |
| `src/app/admin/page.tsx` | Stats + category panel |
| `src/app/admin/registrations/[id]/page.tsx` | Dynamic payment status options |

---

## 2. Registration Types Updated

### Added (CMT redirect — no on-site form)
- **Multi Track Conference** → `https://cmt3.research.microsoft.com/SMK2026/`
- **Paper Submission** → same CMT URL
- **Abstract Submission** → same CMT URL

### Paid (3-step flow + Razorpay where fee applies)
- **Delegate Registration** — category-based fees; Razorpay on paid tiers
- **Accommodation** — payment step (manual UTR/receipt; no fixed fee constant)
- **Projects** — ₹200 fee; Razorpay + receipt

### Free (2-step flow — submit directly)
- Conclave, Awards, Olympiad, Exhibition, Best Practices, Bal Shodh Patrika, Cultural Program

### Legacy separate pages (unchanged)
- Volunteer (`/registration/volunteer`)
- NGO (`/registration/ngo`)
- Talent (`/registration/talent`)

---

## 3. Payment Logic Changes

| Before | After |
|--------|-------|
| All hub forms could show payment blocks | Razorpay **only** on Delegate (fee > 0), Projects (₹200) |
| 3-step flow for all categories | 3-step **only** paid categories; 2-step for free |
| `paymentStatus: Pending \| Paid` | `Pending Payment \| Paid \| Failed \| Submitted` |
| Payment payload always saved | Payment object saved **only** for paid categories |
| Paper/abstract via on-site forms | Immediate redirect to Microsoft CMT |

**Razorpay API routes** (`/api/payments/create-order`, `/api/payments/verify-payment`) remain available but are only invoked from paid checkout UI.

---

## 4. Admin Changes

### Category model
- **Paid:** Delegate, Accommodation, Projects → statuses **Pending Payment**, **Paid**, **Failed**
- **Free (hub):** Conclave, Olympiad, Awards, etc. → status **Submitted**
- **CMT:** External — no Firestore record from hub

### Dashboard
- New **AdminRegistrationCategories** panel (paid vs free legend)
- **Pending Payments** counts legacy `Pending` + `Pending Payment`
- New **Free Submitted** stat
- Registration detail page: payment dropdown options depend on category type

### Filters / search
- `RegistrationTable` type filter unchanged — works with new type names
- Status badges map legacy `Pending` → display **Pending Payment**

---

## 5. Verification Checklist

| Check | Status |
|-------|--------|
| TypeScript (`tsc --noEmit`) | **PASS** |
| CMT redirect on category click | Implemented |
| Free forms submit without payment step | Implemented |
| Paid forms retain payment step | Implemented |
| Firestore save + registration ID generation | Unchanged (`saveRegistration`) |
| Confirmation email API call | Unchanged (`useRegistrationSubmit`) |
| Admin table filters | Compatible |
| Live Firestore E2E | **Manual test required** |
| Live email delivery | **Manual test required** |
| Accommodation fee amount for Razorpay | **Not defined** — manual UTR path only |

---

## 6. Remaining Issues

1. **Accommodation fee** — paid category but no fixed ₹ amount; Razorpay button hidden until a fee constant is defined.
2. **Legacy `Pending` records** — displayed as “Pending Payment”; bulk migrate optional.
3. **CMT categories** — no analytics event when user redirects (could add `trackEvent` before redirect).
4. **Volunteer / NGO / Talent** — separate legacy routes not merged into hub; admin lists them if submitted via those pages.
5. **Razorpay test keys** — still return 401 until valid dashboard keys are set (environmental).
6. **Manual QA** — submit one registration per category type on staging and confirm admin + email.

---

## Quick Test Guide

```text
/registration
  → Multi Track Conference     → redirects to CMT
  → Paper / Abstract Submission → redirects to CMT
  → Conclave                   → 2 steps, submit, status Submitted
  → Delegate (Teacher)         → 3 steps, pay, status Pending Payment/Paid
  → Projects                   → 3 steps, ₹200 pay flow
  → Accommodation              → 3 steps, manual payment fields

/admin
  → Verify Paid vs Free legend
  → Filter by registration type
  → Confirm status badges
```
