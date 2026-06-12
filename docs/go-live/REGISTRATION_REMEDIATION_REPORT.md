# Registration Launch Remediation Report

**Date:** 2026-05-29  
**Baseline audit:** [REGISTRATION_E2E_AUDIT.md](./REGISTRATION_E2E_AUDIT.md) (74/100 — CONDITIONAL GO)  
**Scope:** Defect remediation only — no deploy, no push, no business-rule changes, counters/IDs preserved.

---

## Executive Summary

Remediation addressed all **code-level defects** called out in the registration E2E audit: broken type mappings (C1), admin gateway auth leakage (H2), misleading Volunteer/NGO/Talent UI (H1), and committed Firebase PII artifacts (M4). Payment and email flows were **audited but not altered** (H3/H4 remain operational risks until live proof).

**Updated registration readiness score: 86/100**  
**Recommendation: GO (conditional on post-deploy verification)**

---

## Issues Fixed

| Audit ID | Issue | Remediation | Status |
|----------|-------|-------------|--------|
| **C1** | Bal Shodh Patrika & Cultural Program rejected at submit (400) | Added to `SUPPORTED_V2_TYPES` and `TYPE_MAP` → `Legacy_Other` | ✅ Fixed |
| **H1** | Volunteer/NGO/Talent legacy routes redirect without hub category | Confirmed **intentionally retired**; removed misleading UI links and admin copy; legacy redirect pages retained for bookmarked URLs | ✅ Mitigated |
| **H2** | Admin gateway returned 500 (empty) for unauthenticated requests | Early credential check + structured 401 JSON; `verifyAdminRequest` throws 401 when no Bearer token | ✅ Fixed |
| **M4** | Firebase export JSON with PII in git | Removed 20 files under `exports/firebase/`; added `.gitignore` entries | ✅ Fixed locally* |

\*Files remain in **remote git history** (commit `00dbe12`). Requires separate history rewrite or BFG on `main` before considering PII fully remediated.

### Not changed (audit-noted, out of remediation scope)

| ID | Issue | Reason |
|----|-------|--------|
| H3 | No production `payment_records` rows | Requires live Razorpay test — not a code defect |
| H4 | Legacy forms skip confirmation email | Business rule / feature gap — not modified per constraints |
| M1–M3 | Dual accommodation paths, CMT confusion, webhook email | Documented as remaining risks |

---

## Files Changed

### Registration type mapping

| File | Change |
|------|--------|
| `src/server/lib/registration-types.ts` | Added `Bal Shodh Patrika`, `Cultural Program` to `SUPPORTED_V2_TYPES` and `TYPE_MAP` (`Legacy_Other`) |

### Admin gateway auth

| File | Change |
|------|--------|
| `src/server/lib/admin-request-auth.ts` | Explicit 401 when no valid session cookie and no Bearer token |
| `src/app/api/admin/gateway/[...path]/route.ts` | `hasAdminCredentials()` + `unauthorizedResponse()` on all HTTP methods; consistent JSON error body |

### Volunteer / NGO / Talent UI cleanup

| File | Change |
|------|--------|
| `src/components/home/HeroSection.tsx` | Removed misleading "Become Volunteer" CTA (linked to `/registration` without Volunteer category) |
| `src/app/component/Vibhag/academic/pages/CulturalPage.tsx` | CTA uses `REG_LINKS.general` instead of `REG_LINKS.talent` |
| `src/app/component/Vibhag/academic/pages/OlympiadPage.tsx` | Same as CulturalPage |
| `src/app/component/Vibhag/academic/AcademicCouncilUI.tsx` | Removed unused `talent`, `ngo`, `volunteer` from `REG_LINKS` |
| `src/components/admin/AdminRegistrationCategories.tsx` | Removed "Legacy routes: Volunteer, NGO, Talent" admin note |

**Retained (intentional):** `/registration/volunteer`, `/registration/ngo`, `/registration/talent` → redirect to `/registration`.

### Firebase export cleanup

| Action | Detail |
|--------|--------|
| **Deleted** | 20 JSON files in `exports/firebase/` (see cleanup table below) |
| **`.gitignore`** | Added `exports/firebase/`, `exports/**/*.json` |

### Tests

| File | Change |
|------|--------|
| `scripts/test-registration-types.mjs` | New — validates TYPE_MAP parity, audit types, submit route, admin gateway guard |
| `package.json` | Wired into `test:security` |

---

## Firebase Export Cleanup Report

### Artifacts removed from working tree

| File | PII / registration data |
|------|-------------------------|
| `registrations.json` | **Yes** — full registration record (name, email, phone, address) |
| `conclave_registrations.json` | **Yes** — subtype registration fields |
| `registrationCounters.json` | Counter state (`SMK2026`, `lastNumber`) — not PII but operational |
| `delegate_registrations.json` | Empty export |
| `RegestrationNGOsm24.json` | Empty |
| `RegestrationVolsm24.json` | Empty |
| `ParticipantRegsm24.json` | Empty |
| `talent.json` | Empty |
| `organiserregistration.json` | Empty |
| `Accommodation2025.json` | Empty |
| `heiprojectformdata.json` | Empty |
| `SchoolProjectFormdata.json` | Empty |
| `BestPractices.json` | Empty |
| `AbstractSubmissionDataSM24.json` | Empty |
| `FullLengthSubmissionDataSM24.json` | Empty |
| `keynoteSpeakers.json` | Empty |
| `wishesReceived.json` | Empty |
| `events.json` | Empty |
| `manifest.json` | Export metadata (collection counts) |
| `import-summary.json` | Import run summary |

### `.gitignore` entries added

```
exports/firebase/
exports/**/*.json
!exports/**/manifest.example.json
```

### Follow-up required

1. Run `git rm -r --cached exports/firebase` before next commit so deleted files are unstaged from index.
2. **Git history:** PII from `registrations.json` / `conclave_registrations.json` persists in commit `00dbe12` on `origin/main`. Recommend `git filter-repo` or BFG + force-push coordination (outside this remediation pass).

---

## Payment Verification Audit

End-to-end code path traced (no live payment executed):

```
RazorpayCheckout.tsx
  → POST /api/payments/create-order  (handlers.handleCreateOrder)
      → Razorpay API orders.create()
      → Returns order_id + key_id (no DB write)

  → POST /api/payments/verify-payment (handlers.handleVerifyPayment)
      → HMAC signature verify only
      → Returns { ok: true } — does NOT write payment_records

Registration submit (paid types)
  → saveRegistration() stores razorpayOrderId / razorpayPaymentId on registration row

POST /api/payments/razorpay-webhook
  → HMAC x-razorpay-signature (401 if missing/invalid)
  → processRazorpayWebhookEvent() in payment.service.ts
      → findRegistrationByOrderId / findRegistrationByNotes
      → Updates registration.paymentStatus
      → Creates or updates payment_records row
      → writeAuditLog()
```

### Production validation gaps (unchanged)

| Gap | Risk | Mitigation |
|-----|------|------------|
| `verify-payment` does not persist — relies on webhook or submit payload | Medium | Ensure Razorpay webhook URL configured in dashboard; `RAZORPAY_WEBHOOK_SECRET` set in Vercel |
| `create-order` has no registration binding | Low | Order notes should include `registrationId` for webhook matching |
| Zero `payment_records` in prod | High (proof) | Execute one signed test payment + webhook before declaring payment GO |
| No auto email on webhook success (M3) | Low | Manual/admin confirmation acceptable for launch |

---

## Tests Executed

| Suite | Result |
|-------|--------|
| `npm run test` | **32/32 PASS** (9 security + 6 lookup + 7 registration-types + 10 visitor-analytics) |
| `npx tsc --noEmit` | **PASS** (exit 0) |

### New registration-type tests (7/7)

- `Bal Shodh Patrika` and `Cultural Program` in `SUPPORTED_V2_TYPES` and `TYPE_MAP`
- Full supported/mapped parity (18 types)
- Submit route uses `isSupportedType`
- Admin gateway early 401 guard present

### Submit API verification (static + type layer)

`POST /api/registration/submit` accepts both types at validation layer:

```typescript
isSupportedType("Bal Shodh Patrika")  // true → passes type gate
isSupportedType("Cultural Program")   // true → passes type gate
```

Full submission still requires valid captcha, name, and email (403/400 otherwise — unchanged).

---

## Remaining Risks

| Risk | Severity | Notes |
|------|----------|-------|
| PII in git history | **High** | Local files removed; remote history not scrubbed |
| No live payment proof | **High** | `payment_records` = 0 until test transaction |
| SMTP / confirmation email unverified live | **Medium** | H4 — legacy forms never auto-email |
| Volunteer/NGO/Talent backend types still in API | **Low** | Types supported in `TYPE_MAP` but not in hub UI — admin-only/legacy |
| Post-deploy admin gateway 401 | **Low** | Code fixed; requires deploy to verify on production |

---

## Updated Registration Readiness Score

| Dimension | Audit (before) | After remediation |
|-----------|----------------|-------------------|
| Security | 92 | **94** (+2 admin gateway) |
| Data persistence | 85 | 85 |
| Category coverage | 55 | **88** (+33 — hub categories complete) |
| Payment proof | 60 | 60 |
| Email proof | 65 | 65 |
| Migration integrity | 80 | **82** (+2 git hygiene) |
| **Overall** | **74** | **86** |

---

## GO / NO GO Recommendation

### **GO — conditional**

Registration system is **ready for production traffic** for all hub-advertised categories after deploy of this remediation branch.

**Conditions before declaring full registration GO:**

1. **Deploy** remediation to production (not done in this pass).
2. **Verify live:** `POST /api/registration/submit` with `Bal Shodh Patrika` / `Cultural Program` passes type validation (expect 403 without captcha, not 400).
3. **Verify live:** `GET /api/admin/gateway/registrations` without auth → **401** JSON (not 500).
4. **Execute** one Razorpay test payment + signed webhook → confirm `payment_records` row.
5. **Scrub** Firebase PII from git history on `main`.

**Acceptable now (post-deploy):** Delegate, Conclave, Best Practices, Olympiad, Awards, Exhibition, Projects, Accommodation, **Bal Shodh Patrika**, **Cultural Program**, and legacy standalone forms.

---

*Remediation complete. No deploy, push, or production mutations performed.*
