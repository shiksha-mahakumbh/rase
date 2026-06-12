# H6 — Security Verification

**Audit date:** 2026-05-29  
**Verdict:** ✅ **PASS (source + automated tests)** | ❌ **FAIL (live production)**

---

## 1. Registration Lookup — Anonymous Access

### Source code

**File:** `src/app/api/registration/[registrationId]/route.ts`

| Control | Implementation |
|---------|----------------|
| Requires `token` OR `email` | Lines 17–24, 48–53 |
| Missing credentials → **401** | `{ error: "Email or confirmation token required" }` |
| Rate limit | 10 req/min/IP |
| Email must match record | `getPublicRegistrationSummary()` + `emailsMatch()` |
| PII scope | `toPublicRegistrationSummary()` — excludes `contactNumber` |

### Live production

| Probe | HTTP | PII exposed? |
|-------|------|--------------|
| `GET /api/registration/SMK2026-000001` | **200** | ✅ Yes — name, email, phone |
| `GET ...?email=wrong@example.com` | **200** | ✅ Yes — no email validation |

❌ **Anonymous users CAN read registration data on live production.**

---

## 2. Admin Endpoints — Anonymous Access

| Probe | HTTP | Expected |
|-------|------|----------|
| `GET /api/admin/registrations` (no cookie) | **404** | Protected or 401 |
| `GET /admin` (no cookie) | **200** | Login page (public) ✅ |
| `GET /admin` + `Cookie: admin_session=1` | **200** | Login page (legacy not accepted as session) ✅ |
| `GET /participantregistrationdatadekh` | **307** → `/admin` | Redirect unauthenticated ✅ |
| Same with legacy cookie | **307** | Legacy does not bypass ✅ |

**Source middleware** (`src/middleware.ts`):
- Legacy value `"1"` rejected at line 43
- Protected datadekh paths require `hasValidAdminSession()` (lines 64–70)
- `/admin` login path intentionally open (lines 56–61)

✅ Datadekh pages protected on live. Admin API surface limited (404).

---

## 3. Admin Session Forgery

### Source

| Test | Result |
|------|--------|
| HMAC-signed session verifies | ✅ PASS |
| Legacy cookie `=1` rejected | ✅ PASS |
| Middleware rejects legacy | ✅ PASS |
| Tampered token rejected | ✅ PASS (lookup token tests) |

**Automated:** `node scripts/staging-security-check.mjs` — **9/9 PASS**

### Live

| Test | Result |
|------|--------|
| Forge session with `admin_session=1` | Does not grant datadekh access (307) ✅ |
| Forge valid HMAC without secret | **Not tested** (would require secret) |
| Supabase admin auth on live | **UNKNOWN** — old deploy may use Firebase auth |

---

## 4. Upload Access

| Route | Live (no auth) | Source |
|-------|----------------|--------|
| `POST /api/storage/upload` | **404** | N/A |
| `POST /api/v2/registration/upload` | **404** | Rate-limited; server-side validation |
| `POST /api/registration/upload` | **500** | Rate-limited; Supabase upload in source |

**Source controls** (`storage.service.ts`):
- MIME allowlist
- 10 MB max
- Extension allowlist
- Uploads via service role (not public anon)

⚠️ Live `/api/registration/upload` returns 500 — route exists but backend error (likely Firebase/Supabase mismatch on old deploy). Not an open upload on successful 200.

---

## 5. Rate Limiting

| Endpoint | Source | Live verified |
|----------|--------|---------------|
| Registration lookup | 10/min/IP | **Not load-tested** |
| Registration upload | 30/min/IP | **Not load-tested** |
| Razorpay webhook | 100/min/IP | **Not load-tested** |

Code present; live enforcement **assumed** not probed at limit.

---

## 6. PII in Public Responses

| Field | Source public summary | Live response |
|-------|----------------------|---------------|
| `fullName` | ✅ Included (after auth) | ✅ Exposed without auth |
| `email` | ✅ Included (after auth) | ✅ Exposed without auth |
| `contactNumber` | ❌ Excluded in source | ✅ **Exposed on live** |
| `institution` | ✅ Included (after auth) | ✅ Exposed without auth |

Source `getPublicRegistrationSummary()` select block (lines 296–306) does **not** include `contactNumber` — confirms live runs **older code**.

---

## 7. Security Test Matrix

| Requirement | Source | Automated | Live |
|-------------|--------|-----------|------|
| Lookup requires token/email | ✅ | ✅ | ❌ |
| Rate limiting coded | ✅ | — | UNKNOWN |
| PII minimized | ✅ | — | ❌ |
| Admin HMAC session | ✅ | ✅ | UNKNOWN |
| Legacy cookie rejected | ✅ | ✅ | ✅ (datadekh) |
| No Firebase runtime | ✅ | ✅ | N/A |
| Upload not public | ✅ | — | ⚠️ 500/404 |

---

## H6 Summary

**Critical live finding:** Registration lookup is **publicly enumerable** with full PII including phone number.

**Root cause:** Deployment drift (H3) — security fixes exist in uncommitted source, not on production.

**Post-deploy verification required:**
```bash
curl.exe -s -o NUL -w "%{http_code}" "https://www.shikshamahakumbh.com/api/registration/SMK2026-000001"
# MUST return 401
```

---

*Evidence: source files, `staging-security-check.mjs`, live curl probes 2026-05-29. No credentials used.*
