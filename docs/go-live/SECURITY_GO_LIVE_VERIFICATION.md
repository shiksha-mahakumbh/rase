# G6 — Security Go-Live Verification

**Audit date:** 2026-05-29  
**Verdict:** ✅ **PASS (source)** | ❌ **FAIL (live production)**

---

## 1. Registration Lookup — Source Code

**Route:** `GET /api/registration/[registrationId]`  
**File:** `src/app/api/registration/[registrationId]/route.ts`

| Requirement | Implementation |
|-------------|----------------|
| Requires `token` OR `email` query param | ✅ Lines 17–24, 48–53 |
| Returns 401 without credentials | ✅ `{ error: "Email or confirmation token required" }` |
| Rate limit | ✅ 10/min/IP |
| ID format validation | ✅ `REG_ID_RE` |

**Token verification:** `verifyRegistrationLookupToken()` in `@/lib/security/registration-lookup` (HMAC).

---

## 2. Registration Lookup — Live Production

**Probes:** `https://www.shikshamahakumbh.com` (2026-05-29)

| Request | HTTP | Body summary |
|---------|------|--------------|
| `GET /api/registration/SMK2026-000001` (no params) | **200** | Full PII: name, email, phone, institution |
| `GET ...?email=wrong@example.com` | **200** | Same data returned |

❌ **CRITICAL:** Live deploy does **not** enforce source-code auth rules. Registration lookup is **publicly enumerable** on production.

**Root cause (inferred):** Production runs **pre-security-migration build** (Firebase-era or older API), not current Supabase/HMAC source.

---

## 3. Admin — HMAC Session (Source)

**Files:**
- `src/lib/security/admin-session.ts`
- `src/server/lib/supabase-admin-auth.ts`
- Middleware session validation

| Control | Status |
|---------|--------|
| HMAC-signed admin session cookie | ✅ Implemented |
| Legacy cookie value `=1` rejected | ✅ Middleware + tests |
| Supabase auth for admin login | ✅ Implemented |

---

## 4. Automated Security Suite

**Command:** `node scripts/staging-security-check.mjs` (2026-05-29)

| Test | Result |
|------|--------|
| `lookup_token_valid` | PASS |
| `lookup_token_wrong_id` | PASS |
| `lookup_token_tampered` | PASS |
| `admin_session_valid` | PASS |
| `admin_session_legacy_rejected` | PASS |
| `registration_get_requires_auth` | PASS |
| `middleware_rejects_legacy_cookie` | PASS |
| `registration_backend_supabase` | PASS |
| `src_no_firebase_runtime` | PASS |

**9/9 PASS** — validates **local source**, not live production.

---

## 5. Admin Live Behavior

| Check | Status |
|-------|--------|
| Live admin login with legacy cookie | **UNKNOWN** — not probed (would require credentials) |
| Live HMAC session after deploy | **UNKNOWN** — pending new deployment |

---

## 6. Secrets on Vercel (Production)

| Secret | Present |
|--------|---------|
| `ADMIN_SESSION_SECRET` | ✅ |
| `ADMIN_OPS_SECRET` | ✅ |
| `REGISTRATION_LOOKUP_SECRET` | ✅ |

Secrets exist; **live app not using new lookup logic** until redeploy.

---

## 7. G6 Summary

| Layer | Registration lookup | Admin session |
|-------|---------------------|---------------|
| Source code | ✅ PASS | ✅ PASS |
| Automated tests | ✅ PASS | ✅ PASS |
| Live production | ❌ **FAIL (PII leak)** | ⚠️ UNKNOWN |

**G6 P0 blocker:** Deploy current build to production **before** any public cutover announcement. Existing live API exposes registration PII without authentication.

---

*Live GET probes only. No credentials used. No deployment.*
