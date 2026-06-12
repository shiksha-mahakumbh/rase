# Security Source Verification

**Date:** 2026-06-10  
**Method:** Source inspection + `node scripts/staging-security-check.mjs`  
**Scope:** Registration lookup, admin auth, middleware — read-only

---

## Summary

| Area | Verdict | Evidence |
|------|---------|----------|
| Registration lookup auth | **PASS** | Route + HMAC module |
| Summary-only response | **PASS** | `toPublicRegistrationSummary` |
| Rate limiting | **PASS** | 10/min/IP |
| Admin signed cookie | **PASS** | HMAC in `admin-session.ts` |
| Legacy cookie rejection | **PASS** | `middleware.ts:43` |
| Automated tests | **PASS** | 9/9 |

---

## Registration lookup — `src/app/api/registration/[registrationId]/route.ts`

| Control | Present? | Line(s) | Evidence |
|---------|:--------:|---------|----------|
| Token validation | ✅ | 20-23 | `verifyRegistrationLookupToken()` |
| Email query param | ✅ | 26-27 | `email` search param |
| No credential → 401 | ✅ | 51-56 | `"Email or confirmation token required"` |
| Rate limit 10/min/IP | ✅ | 34-44 | `rateLimit()` |
| ID format validation | ✅ | 47-48 | `REG_ID_RE` |
| Email mismatch → 404 | ✅ | 82-84 | `emailsMatch()` |
| Summary-only response | ✅ | 86-97 | `toPublicRegistrationSummary()` — no email/phone in type |

**`toPublicRegistrationSummary` fields (L78-87 in `registration-lookup.ts`):**
`registrationId`, `registrationType`, `fullName`, `institution`, `paymentStatus`, `accommodationRequired`, `accommodationStatus`, `createdAt` — **no `email`, no `contactNumber`**.

### POST lookup — `src/app/api/registration/lookup/route.ts`

| Control | Line(s) |
|---------|---------|
| Requires `registrationId` + `email` in body | 33-37 |
| Rate limit | 13-23 |
| Summary-only via `toPublicRegistrationSummary` | 50+ |

---

## Token validation — `src/lib/security/registration-lookup.ts`

| Control | Line(s) |
|---------|---------|
| HMAC-SHA256 signing | 23-24 |
| Timing-safe compare | 54 |
| Token expiry (7 days) | 32, 64 |
| Wrong ID rejected | 62 |
| Secret chain | 9-12: `REGISTRATION_LOOKUP_SECRET` → fallbacks |

---

## Admin authentication

### `src/app/api/admin/session/route.ts`

| Control | Line(s) |
|---------|---------|
| Firebase ID token verification | 13 |
| Signed HttpOnly cookie issued | 20-21 |
| `createAdminSessionToken()` | 14-18 |
| DELETE clears cookie | 30-36 |

### `src/lib/security/admin-session.ts`

| Control | Line(s) |
|---------|---------|
| `ADMIN_SESSION_SECRET` required | 15-20 |
| HMAC-SHA256 signing | 23-24 |
| Timing-safe verification | 40-43 |
| Expiry check | 47 |
| Cookie: HttpOnly, secure in prod | 55-59 |

### `src/middleware.ts`

| Control | Line(s) |
|---------|---------|
| Cookie name `smk_admin_session` | 42 via `ADMIN_SESSION_COOKIE` |
| Legacy `"1"` rejected | 43: `raw === "1" return false` |
| HMAC verify via edge helper | 48 |
| `ADMIN_SESSION_SECRET` used | 45 |
| Protected data paths gated | 55-74 |

**Cookie constant:** `src/constants/auth.ts:2` → `smk_admin_session`

### `src/app/api/admin/gateway/[...path]/route.ts`

Gateway uses `ADMIN_OPS_SECRET` (verified in grep — present in admin API layer).

---

## Automated test results

```
node scripts/staging-security-check.mjs → 9/9 PASS (2026-06-10)
```

| Test | Status |
|------|--------|
| `lookup_token_valid` | PASS |
| `lookup_token_wrong_id` | PASS |
| `lookup_token_tampered` | PASS |
| `admin_session_valid` | PASS |
| `admin_session_legacy_rejected` | PASS |
| `registration_get_requires_auth` | PASS |
| `middleware_rejects_legacy_cookie` | PASS |
| `firestore_rules_deny_create` | PASS |
| `backup_rules_documented_danger` | PASS |

---

## Verdict

**SECURITY SOURCE: PASS** — All P0 security controls exist in the current codebase.

**No source changes made.**
