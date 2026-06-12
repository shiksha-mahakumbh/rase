# Registration Lookup Hardening

**Date:** May 2026  
**Status:** IMPLEMENTED  
**Blocker:** P0 — Registration data exposure

---

## Audit findings (pre-remediation)

| Route | Method | Auth | Exposure |
|-------|--------|------|----------|
| `/api/registration/[registrationId]` | GET | None | Email, phone, institution, payment status |
| `/api/v2/registration/[id]` | GET | None | Full Prisma row + uploads + payments |

**ID pattern:** `SMK2026-\d{6}` (~1M enumerable space)  
**Rate limit:** 60/min per IP (insufficient against enumeration)

**Consumer:** `SuccessExperience.tsx` fetched confirmation after registration.

---

## Remediation implemented

### Strategy: Registration ID + verified identity

Two authorized lookup paths:

| Path | Use case |
|------|----------|
| **Confirmation token** | Post-registration success page (issued at submit) |
| **Registration ID + Email** | Manual lookup via POST |

Anonymous GET by ID alone is **blocked**.

### New modules

| File | Purpose |
|------|---------|
| `src/lib/security/registration-lookup.ts` | HMAC tokens, email match, public summary sanitizer |
| `src/app/api/registration/lookup/route.ts` | POST `{ registrationId, email }` |
| `src/server/services/registration.service.ts` | `getPublicRegistrationSummary()` |

### API changes

| Route | Before | After |
|-------|--------|-------|
| `GET /api/registration/[id]` | Open PII | Requires `?token=` or `?email=`; returns summary only |
| `POST /api/registration/lookup` | — | `{ registrationId, email }` → summary |
| `GET /api/v2/registration/[id]` | Full row | Requires `?token=` or `?email=`; summary only |
| `POST /api/registration/submit` | — | Returns `lookupToken` |
| `POST /api/v2/registration/submit` | — | Returns `lookupToken` |

### Public summary fields (allowed)

- `registrationId`, `registrationType`, `fullName`, `institution`
- `paymentStatus`, `accommodationRequired`, `accommodationStatus`, `createdAt`

### Removed from public response

- `email`, `contactNumber`, `phone`
- Uploaded files, payment records, type extensions, metadata

### Rate limiting

Reduced to **10 requests/minute** per IP on all lookup routes.

### Enumeration protection

- Same `404 Registration not found` for wrong ID, wrong email, or wrong token
- Email comparison uses normalized lowercase + `timingSafeEqual` on tokens

### Environment

| Variable | Purpose |
|----------|---------|
| `REGISTRATION_LOOKUP_SECRET` | HMAC signing (preferred) |
| Fallback | `REGISTRATION_EMAIL_SECRET` → `ADMIN_OPS_SECRET` |

### Client changes

- `useRegistrationSubmit.ts` — passes `lookupToken` on success redirect
- `SuccessExperience.tsx` — fetches with `?token=` only (no bare ID lookup)

---

## Verification checklist

- [ ] `GET /api/registration/SMK2026-000001` without token/email → **401**
- [ ] `GET` with wrong email → **404**
- [ ] `GET` with valid token from submit → **200** (summary only, no email in body)
- [ ] `POST /api/registration/lookup` with ID + email → **200** or **404**
- [ ] Rapid enumeration → **429** after 10/min

---

## Remaining recommendations (P1, not P0)

- Add CAPTCHA to POST lookup for manual email verification
- Log failed lookup attempts for abuse monitoring
- Shorten token TTL if shorter confirmation window desired
