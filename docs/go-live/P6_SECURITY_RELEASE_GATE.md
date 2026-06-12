# P6 — Security Release Gate

**Audit date:** 2026-05-29  
**Prior reports:** H6, `docs/staging/env-check-result.json`  
**Decision:** **NO GO** (live production)

---

## Verification Matrix

| Control | Source | Automated | Live Production |
|---------|--------|-----------|-----------------|
| Registration lookup requires token/email | ✅ | ✅ | ❌ **200 + PII** |
| Anonymous lookup blocked | ✅ | ✅ | ❌ |
| Email mismatch rejected | ✅ | ✅ | ❌ **200 with wrong email** |
| PII stripped (`contactNumber`) | ✅ | — | ❌ **Exposed** |
| Admin HMAC session | ✅ | ✅ | UNKNOWN |
| Legacy admin cookie rejected | ✅ | ✅ | ✅ (datadekh 307) |
| Rate limits coded | ✅ | — | Not load-tested |
| Webhook HMAC validation | ✅ | — | ✅ **401** unsigned |
| No Firebase runtime | ✅ | ✅ | N/A (stale deploy) |

---

## 1. Registration Lookup

**Source:** `src/app/api/registration/[registrationId]/route.ts`
- 401 without `token` or `email` query param
- Rate limit 10/min/IP

**Live probes (2026-05-29):**
```
GET /api/registration/SMK2026-000001           → HTTP 200 (PII)
GET /api/registration/SMK2026-000001?email=x@y.com → HTTP 200
```

**Automated:** `registration_get_requires_auth` — **PASS** (source only)

---

## 2. Admin HMAC Session

**Source:** `src/lib/security/admin-session.ts`, `src/middleware.ts`

- Signed cookie verified with `ADMIN_SESSION_SECRET`
- Legacy value `"1"` returns false (line 43)

**Automated:**
- `admin_session_valid` — PASS
- `admin_session_legacy_rejected` — PASS
- `middleware_rejects_legacy_cookie` — PASS

**Live:** Protected datadekh paths redirect (307) without valid session — ✅

---

## 3. Rate Limits

Coded in:
- Registration lookup: 10/min/IP
- Registration upload: 30/min/IP
- Razorpay webhook: 100/min/IP

**Live enforcement:** Not verified at threshold.

---

## 4. Webhook Validation

**Live:**
```
POST /api/payments/razorpay-webhook {} → HTTP 401
```

✅ Signature gate active on deployed webhook route.

---

## 5. PII Stripping

**Source:** `getPublicRegistrationSummary()` select excludes sensitive fields; `toPublicRegistrationSummary()` shapes response.

**Live:** Returns `contactNumber`, `email`, `fullName` without authentication.

---

## 6. Automated Suite

```bash
node scripts/staging-security-check.mjs
# 9/9 PASS (2026-05-29)
```

Validates **repository source**, not live production.

---

## Security Release Gate Decision

| Layer | GO? |
|-------|-----|
| Source code | ✅ Ready |
| Automated tests | ✅ Pass |
| **Live production** | ❌ **NO GO** |

**Explicit NO GO** until:
```bash
curl.exe -s -o NUL -w "%{http_code}" \
  "https://www.shikshamahakumbh.com/api/registration/SMK2026-000001"
# MUST return 401
```

---

*Evidence: source files, `staging-security-check.mjs`, live curl. No production changes.*
