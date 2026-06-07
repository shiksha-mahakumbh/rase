# Phase 3 — Experience, Security & Authority Findings

**Prerequisite:** Phase 1–2 complete · 118+ routes  
**Priority order:** Security → UX → SEO → Admin → Performance → i18n prep  
**Build:** Passing after Phase 3 incremental work (May 2026)

---

## Priority 1 — Academic Council & Vibhag

| Item | Before | After |
|------|--------|-------|
| `AcademicCouncil24.tsx` | 2,321 lines | ~120 lines shell + sidebar |
| Page content | Inline | `academic/pages/*.tsx` (each &lt;500 lines) |
| Shared data | Scattered after split | `academic-content-data.ts`, `tracks-data.ts` |
| Route SEO | None | `VibhagRoute/AcademicCouncil24/layout.tsx` + breadcrumb JSON-LD |

**Remaining:** Brand refresh in `AcademicCouncilUI.tsx`; other Vibhag routes (`Prabandhan24`, etc.) still legacy layout; `committeepage` still table-heavy.

---

## Priority 2 — Security

| Control | Status |
|---------|--------|
| reCAPTCHA v3 | Client verify via `/api/registration/verify-captcha` before submit |
| Rate limiting | `rateLimit.ts` on public API routes |
| Firestore rules | `validRegistrationCreate()` on `registrations`; `audit_logs` create |
| Storage rules | Size/type validation under `registrations/` |
| Email API | Secret optional + validation + rate limit |
| Razorpay webhook | `/api/payments/razorpay-webhook` HMAC verify (no Firestore sync yet) |

**Deploy required:** Push `firebase/firestore.rules` and `storage.rules` in Firebase Console.

**Env:** `NEXT_PUBLIC_RECAPTCHA_SITE_KEY`, `RECAPTCHA_SECRET_KEY`, `REGISTRATION_EMAIL_SECRET`, `RAZORPAY_WEBHOOK_SECRET`.

**Phase 4:** Server-side registration API for true write protection (client Firestore `create` still possible if rules allow).

---

## Priority 3 — Metadata

**Now with layouts/metadata:** home, registration, success, legal, intro, contact, abstract, proceedings, upcomingevent, Academic Council, gallery, media, journals, pastevent, committeepage.

**Remaining:** Press routes, committee year pages, datadekh (should be `noIndex`), bulk of legacy static pages.

**Utilities:** `createPageMetadata()`, `jsonLd.ts`, `publicPages.ts`.

---

## Priority 4 — Admin

| Feature | Status |
|---------|--------|
| Pagination | ✓ |
| Email logs filter | ✓ dropdown on registration table |
| Reports panel | ✓ payment, accommodation, email, volunteer counts |
| Mobile tables | ✓ card layout on `md` breakpoint |
| Audit log UI | Not built (writes on registration create only) |

---

## Priority 5 — Performance

- Academic Council bundle split: route ~17 kB page JS (was monolithic 2.3k-line component)
- Homepage: no `next/dynamic` on critical path (ChunkLoadError fix retained)
- Legacy `<img>` and large admin chart bundle remain

---

## Priority 6 — Global readiness

- `src/i18n/config.ts`, `messages/en.json` skeleton
- `routing.ts` stub **without** `next-intl` import (package not installed)
- No translations; no middleware locale switch yet

---

## Files added/changed (reference)

- `src/app/component/Vibhag/academic/pages/*.tsx`
- `src/app/component/Vibhag/academic/academic-content-data.ts`
- `src/lib/security/rateLimit.ts`, `recaptcha.ts`
- `src/components/admin/AdminReportsPanel.tsx`
- `scripts/fix-academic-imports.mjs`, `scripts/split-academic-council.mjs`

---

*Next recommended: deploy Firebase rules, wire Razorpay webhook → Firestore, metadata for press/committee groups, Vibhag shell for remaining routes, server registration API.*
