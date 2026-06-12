# Security Final Verification

**Date:** 2026-05-29  
**Auditor:** Principal Release Engineer  
**Method:** `npm run test:security` + live HTTP probe + source review

---

## Executive Summary

| Layer | Status |
|-------|--------|
| Source code + automated tests | ✅ **15/15 PASS** |
| Live production behavior | ❌ **CRITICAL — PII exposed without auth** |

**Security verification: FAIL on live production**

---

## Automated Tests (2026-05-29)

```bash
npm run test:security
→ 15/15 PASS (9 staging + 6 registration lookup)
```

| Test area | Result |
|-----------|--------|
| HMAC registration lookup token | PASS |
| HMAC admin session | PASS |
| Legacy admin cookie rejected | PASS |
| Route requires token/email (source) | PASS |
| PII stripped from public summary (source) | PASS |
| Rate limit configured (source) | PASS |
| No Firebase runtime in `src/` | PASS |
| Registration backend = supabase | PASS |

---

## Source Code Controls (verified)

### Registration lookup — 401 without credentials

```48:54:src/app/api/registration/[registrationId]/route.ts
  const email = await resolveVerifiedEmail(registrationId, request);
  if (!email) {
    return NextResponse.json(
      { error: "Email or confirmation token required" },
      { status: 401 }
    );
  }
```

### Rate limiting — 10 req/min/IP

```31:35:src/app/api/registration/[registrationId]/route.ts
  const limited = rateLimit({
    key: `registration-lookup:${ip}`,
    limit: 10,
    windowMs: 60_000,
  });
```

### Admin sessions — HMAC-SHA256

- `src/lib/security/admin-session.ts` — Node verification
- `src/lib/security/admin-session-edge.ts` — Edge middleware
- Legacy `=1` cookie rejected (test PASS)

### PII stripping

`toPublicRegistrationSummary()` excludes email and phone (test PASS).

---

## Live Production Probe (2026-05-29)

```
GET https://www.rase.co.in/api/registration/SMK2026-000001
(no token, no email query param)
```

| Check | Result | Expected (remediated source) |
|-------|--------|------------------------------|
| HTTP status | **200** | **401** |
| Response contains `"email"` key | **Yes** | **No** |
| Response contains `contactNumber` | **Yes** | **No** |
| Content-Type | application/json | — |
| Body length | 327 bytes | — |

**Conclusion:** Live production still runs pre-remediation Firebase-era code. Registration PII is publicly accessible without authentication.

---

## Live vs Source Gap

| Control | Source (HEAD) | Live production |
|---------|---------------|-----------------|
| 401 without credentials | ✅ | ❌ 200 |
| No email in response | ✅ | ❌ Exposed |
| No phone in response | ✅ | ❌ Exposed |
| Rate limit | ✅ Configured | Unverified live |
| HMAC admin sessions | ✅ | Unverified live |

---

## RLS Defense in Depth (Supabase)

Public schema: **55 RLS policies** applied. Application-layer auth is primary; service role bypasses RLS by design.

---

## Signoff

| Gate | Result |
|------|--------|
| Source security | ✅ PASS |
| Live registration API | ❌ **FAIL — P0** |
| Automated tests | ✅ 15/15 |

**Remediation:** Deploy current HEAD + verify live returns 401 without credentials.

---

*Fresh tests and live probe — 2026-05-29. PII content not reproduced in this report.*
