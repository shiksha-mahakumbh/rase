# Security Release Gate

**Date:** 2026-05-29

---

## Automated Test Suite — ✅ 15/15 PASS

```bash
npm run test:security
```

| Suite | Pass | Fail |
|-------|------|------|
| `staging-security-check.mjs` | 9 | 0 |
| `test-registration-lookup-security.mjs` | 6 | 0 |

---

## Gate Requirements

### 1. Registration lookup requires token OR email — ✅ SOURCE

```48:54:src/app/api/registration/[registrationId]/route.ts
  const email = await resolveVerifiedEmail(registrationId, request);
  if (!email) {
    return NextResponse.json(
      { error: "Email or confirmation token required" },
      { status: 401 }
    );
  }
```

Token path: HMAC via `verifyRegistrationLookupToken()`.  
Email path: query param, matched against stored registration email.

### 2. Unauthorized lookup returns 401 — ⚠️ SOURCE ✅ / LIVE ❌

| Environment | `GET /api/registration/SMK2026-000001` |
|-------------|----------------------------------------|
| Source (remediated) | **401** |
| Live production | **200** + PII |

### 3. PII stripped from public responses — ✅ SOURCE

Public summary keys (test-verified):  
`registrationId`, `registrationType`, `fullName`, `institution`, `paymentStatus`, `accommodationRequired`, `accommodationStatus`, `createdAt`

No `email`, `contactNumber`, or `phone` in `toPublicRegistrationSummary()`.

Live production still returns email + contactNumber (stale deploy).

### 4. HMAC admin sessions — ✅ SOURCE

| Component | Status |
|-----------|--------|
| `admin-session.ts` | HMAC-SHA256 signed cookies |
| `admin-session-edge.ts` | Edge middleware verification |
| Legacy `=1` cookie | Rejected (test PASS) |

### 5. Rate limits — ✅ SOURCE

Registration lookup: **10 requests/min/IP** via `rateLimit()` in route handler.

---

## Defense in Depth

| Layer | Status |
|-------|--------|
| Application auth (401 gate) | ✅ Source |
| RLS (55 public policies) | ✅ Supabase |
| Service role bypass | By design (Next.js API) |

---

## Signoff

| Gate | Source | Live |
|------|--------|------|
| Token/email required | ✅ | ❌ |
| 401 without credentials | ✅ | ❌ |
| PII stripped | ✅ | ❌ |
| HMAC admin sessions | ✅ | Unverified |
| Rate limits | ✅ | Unverified |
| Automated tests | ✅ 15/15 | N/A |

**Security release gate: APPROVED IN SOURCE — NOT APPROVED ON LIVE**

Live signoff requires post-deploy probe confirming **401** without token/email.

---

*Evidence: `npm run test:security`, source review, live probe — 2026-05-29.*
