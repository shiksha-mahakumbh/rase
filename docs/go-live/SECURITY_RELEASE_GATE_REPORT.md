# Security Release Gate Report

**Date:** 2026-06-12  
**Decision:** **NO GO (live)** | **GO (source)**

---

## Automated Test Results

### `npm run test:security`

**staging-security-check.mjs:** 9/9 PASS  
**test-registration-lookup-security.mjs:** 6/6 PASS

| Test | Result |
|------|--------|
| Lookup token valid/tampered/wrong ID | ✅ PASS |
| Admin HMAC session | ✅ PASS |
| Legacy cookie rejected | ✅ PASS |
| Registration GET requires auth (source) | ✅ PASS |
| No Firebase runtime | ✅ PASS |
| PII stripped from public summary | ✅ PASS |
| Route 401 gate in source | ✅ PASS |
| Rate limit configured | ✅ PASS |

---

## Route Audit

**File:** `src/app/api/registration/[registrationId]/route.ts`

| Control | Line(s) | Status |
|---------|---------|--------|
| Token OR email required | 17–24, 48–53 | ✅ |
| 401 without credentials | 50–52 | ✅ |
| Rate limit 10/min/IP | 31–35 | ✅ |
| REG_ID_RE validation | 44–46 | ✅ |

---

## PII Stripping

**`toPublicRegistrationSummary()`** returns:
`registrationId`, `registrationType`, `fullName`, `institution`, `paymentStatus`, `accommodationRequired`, `accommodationStatus`, `createdAt`

**Excludes:** `email`, `contactNumber`, internal UUIDs.

---

## Live Production Gate

| Probe | Expected | Live |
|-------|----------|------|
| `GET /api/registration/SMK2026-000001` | 401 | **200 + PII** ❌ |

**Security release gate for production: NO GO** until redeploy completes.

---

## Explicit Decision

| Layer | GO / NO GO |
|-------|------------|
| Source code | **GO** |
| Automated tests | **GO** |
| Live production | **NO GO** |

---

*Evidence: `npm run test:security` output 2026-06-12; live curl P1.*
