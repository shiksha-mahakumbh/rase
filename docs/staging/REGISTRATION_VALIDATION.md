# Registration Validation — Staging

**Date:** June 2026  
**Backend:** `REGISTRATION_BACKEND=firebase` (unchanged — no Supabase cutover)

---

## Configuration verified

| Setting | Status |
|---------|--------|
| `REGISTRATION_BACKEND` | ✅ `firebase` |
| Firebase service account | ✅ Present in env |
| reCAPTCHA keys | ✅ Present |
| Razorpay keys | ✅ Present (webhook secret missing) |
| SMTP | ✅ Present |

---

## Registration flow (code path)

```
User form → reCAPTCHA verify → POST /api/registration/submit
  → Firebase Firestore (server-side saveRegistration)
  → Returns { registrationId, lookupToken }
  → Redirect /registration/success?id=...&token=...
  → GET /api/registration/[id]?token=... (summary only)
  → Optional: send-email, Razorpay payment
```

**Supabase registration:** ❌ NOT active (by design).

---

## P0 security — registration lookup

| Test | Code | Runtime |
|------|------|---------|
| GET without token/email → 401 | ✅ | ❌ Not tested |
| GET with valid lookupToken → 200 summary | ✅ | ❌ Not tested |
| GET with wrong email → 404 | ✅ | ❌ Not tested |
| Enumeration blocked | ✅ | ❌ Not tested |
| `lookupToken` in submit response | ✅ | ❌ Not tested |

---

## Components verified (code)

| Component | Path | Status |
|-----------|------|--------|
| Submit hook | `useRegistrationSubmit.ts` | ✅ Passes token to success URL |
| Success page | `SuccessExperience.tsx` | ✅ Uses `?token=` lookup |
| Firebase submit API | `/api/registration/submit` | ✅ Issues lookupToken |
| v2 submit API | `/api/v2/registration/submit` | ✅ Issues lookupToken (dormant while firebase) |
| Admin registrations | `/admin` | ✅ Firebase AdminProvider |
| Razorpay webhook | `/api/payments/razorpay-webhook` | ✅ HMAC when secret set |

---

## Runtime test status

| Test | Status | Blocker |
|------|--------|---------|
| Full registration submit | ❌ | Needs running app + reCAPTCHA + Firebase |
| Email confirmation sent | ❌ | Needs SMTP test |
| Success page PDF download | ❌ | Needs successful lookup |
| Admin sees new registration | ❌ | Needs Firebase + admin login |
| Razorpay payment flow | ❌ | Needs staging keys + webhook secret |
| Razorpay webhook delivery | ❌ | `RAZORPAY_WEBHOOK_SECRET` missing locally |

---

## Firebase rules (registration collections)

| Collection | Anonymous create | Anonymous read | Verdict |
|------------|------------------|----------------|---------|
| `registrations` | ❌ Denied (strict rules) | ❌ Denied | ✅ REPO PASS |
| `registrationCounters` | ❌ Denied | ❌ Denied | ✅ REPO PASS |
| `paymentRecords` | ❌ Denied | Admin only | ✅ REPO PASS |

---

## Staging E2E checklist

- [ ] Submit participant registration with test email
- [ ] Verify `SMK2026-XXXXXX` ID returned
- [ ] Success page loads with token — shows name, no email in API response body
- [ ] `GET /api/registration/SMK2026-000001` without auth → 401
- [ ] Admin `/admin` shows new registration
- [ ] Razorpay test payment completes
- [ ] Webhook updates payment status
- [ ] Confirm `REGISTRATION_BACKEND` still `firebase` (no Supabase writes)

---

## Verdict

| Check | Result |
|-------|--------|
| Firebase path intact | ✅ PASS |
| No Supabase cutover | ✅ PASS |
| P0 lookup hardening in code | ✅ PASS |
| End-to-end registration tested | ❌ FAIL (blocked) |
| Razorpay webhook configured | ❌ FAIL (secret missing) |

**Stage 7: PARTIAL PASS** — code ready; E2E blocked by staging environment.
