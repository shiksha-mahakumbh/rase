# Priority Production Fixes Report

**Date:** 2026-06-16  
**Scope:** Olympiad, duplicate email, admin errors, category persistence

---

## 1. Root Cause Summary

| Issue | Root Cause |
|-------|------------|
| Olympiad blocked | Form set `registrationFee = studentCount × 200` but UI says no payment; submit API requires proof when `fee > 0` |
| Duplicate emails | Client `queueConfirmationEmail()` called `/api/registration/send-email` after submit route already sent emails with attachments |
| Admin generic error | `admin/page.tsx` catch block ignored `error.message` from `fetchRegistrationsPage` |
| Category persistence | "Change category" cleared meta but not draft; `registrationType` state stayed on previous category |

---

## 2. Recommendation — Olympiad (Option A)

**Decision: Olympiad is FREE** (Option A)

**Evidence:** UI text at `OlympiadForm.tsx:191-192` — *"Students registered: {n} (no payment required)"*

No Razorpay UI exists. Adding paid flow (Option B) would require hub 3-step integration and is out of scope for this hotfix.

**Implementation:**
- Client submits `registrationFee: 0` with `studentCount` preserved
- Server forces `fee = 0` for `type === "Olympiad"` (defense in depth)

---

## 3. Files Changed

| File | Change |
|------|--------|
| `src/components/forms/OlympiadForm.tsx` | Stop setting fee from student count; submit with `registrationFee: 0` |
| `src/app/api/registration/submit/route.ts` | Force Olympiad fee to 0 before payment validation |
| `src/lib/useRegistrationSubmit.ts` | Remove `queueConfirmationEmail()` and client fallback call |
| `src/app/admin/page.tsx` | Surface upstream error in toast + console |
| `src/app/registration/RegistrationHub.tsx` | Change category: clear draft, reset to Delegate, clear meta |

---

## 4. Code Diff Summary

- **Olympiad:** ~15 lines — fee no longer blocks submit
- **Email:** ~20 lines removed — single email path via submit route only
- **Admin:** ~6 lines — error message propagation
- **Category:** ~3 lines — `clearDraft()` + reset type on change category

**Email attachment flow (unchanged, verified):**
- Free: `sendRegistrationConfirmation` with PDF + QR — `submit/route.ts:335-365`
- Paid: both templates with PDF + QR — `submit/route.ts:282-333`

---

## 5. Risks

| Risk | Mitigation |
|------|------------|
| Olympiad later needs payment | Requires Option B feature work; constant `OLYMPIAD_FEE_PER_STUDENT` retained in types for future |
| Admin error too verbose | Only shows message from API; no secrets in gateway responses |
| Change category resets to Delegate | User must re-select category; prevents accidental Projects continue |

---

## 6. SQL Verification

```sql
-- After test registrations, no duplicate emails per registration+template
SELECT registration_id, template, COUNT(*) AS cnt
FROM email_logs
WHERE created_at > NOW() - INTERVAL '1 day'
GROUP BY registration_id, template
HAVING COUNT(*) > 1;

-- Olympiad registrations should have fee 0 or null
SELECT registration_id, registration_type, registration_fee, metadata
FROM registrations
WHERE registration_type = 'Olympiad' AND deleted_at IS NULL
ORDER BY created_at DESC
LIMIT 10;

-- Template counts
SELECT template, status, COUNT(*)
FROM email_logs
WHERE created_at > NOW() - INTERVAL '7 days'
GROUP BY template, status;
```

---

## 7. Manual Test Plan

| # | Test | Expected |
|---|------|----------|
| 1 | Olympiad: upload student list → submit | Success; SMK ID; no payment error |
| 2 | Projects ₹200: pay → submit | 1× registration_confirmation + 1× payment_confirmation (both with PDF+QR) |
| 3 | Conclave free submit | 1× registration_confirmation with PDF+QR |
| 4 | Admin list with bad session | Toast shows `Failed to load registrations: Unauthorized (UNAUTHORIZED)` |
| 5 | Projects → Change category → pick Delegate | Delegate form; refresh does not restore Projects step 3 |
| 6 | Delegate / Accommodation / Awards / Exhibition | Submit succeeds per category matrix |

---

## 8. Regression Matrix (Code Audit)

| Category | Submit | Payment | Email | Admin |
|----------|--------|---------|-------|-------|
| Delegate | PASS | If fee > 0 | PASS | PASS |
| Conclave | PASS | Free | PASS | PASS |
| Projects | PASS | Razorpay | PASS dual | PASS |
| Accommodation | PASS | Razorpay | PASS dual | PASS |
| Awards | PASS | Free | PASS | PASS |
| Best Practices | PASS | Free | PASS | PASS |
| Exhibition | PASS | Free | PASS | PASS |
| Olympiad | **FIXED** | Free | PASS | PASS |
| Bal Shodh Patrika | PASS | Free | PASS | PASS |

---

## 9. GO / NO GO

| Gate | Verdict |
|------|---------|
| Olympiad unblocked | **GO** |
| Duplicate email removed | **GO** |
| Admin error visibility | **GO** |
| Category change hardened | **GO** |
| Email attachments on submit path | **GO** (unchanged) |
| Deploy + live E2E | **PENDING** operator |

### Overall: **GO** — deploy these 5 files to production and run manual test plan.
