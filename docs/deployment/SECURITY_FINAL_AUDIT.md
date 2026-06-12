# Security Final Audit

**Date:** 2026-06-10  
**Method:** `node scripts/staging-security-check.mjs` + code review + **live production probe**

---

## Summary

| Area | Local code | Live production | Verdict |
|------|------------|-----------------|---------|
| Registration lookup protection | ✅ 401 without token | ❌ **200 + PII exposed** | **P0 FAIL** |
| Admin cookie signing | ✅ HMAC | Unverified live | CONDITIONAL |
| Firestore rules (source) | ✅ Deny create | Deploy unverified | CONDITIONAL |
| Middleware legacy cookie | ✅ Rejects `=1` | Unverified live | CONDITIONAL |
| Admin API gateway | ✅ `ADMIN_OPS_SECRET` | Preview missing | CONDITIONAL |
| Secrets in repo | ✅ `.env` gitignored | Vercel encrypted | PASS |

**Critical finding: Production is running a stale deployment without P0 security fixes.**

---

## Automated code tests

```
node scripts/staging-security-check.mjs → 9/9 PASS
```

| Test | Result |
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

## Live production probe (2026-06-10)

**Request:**
```
GET https://www.shikshamahakumbh.com/api/registration/SMK2026-000001
(no email, no token)
```

**Response:** `200 OK` with full registration PII (name, email, phone, institution, payment status)

**Expected (current codebase):** `401` — `"Email or confirmation token required"`

**Evidence in code:**

```51:56:rase/src/app/api/registration/[registrationId]/route.ts
  const email = await resolveVerifiedEmail(registrationId, request);
  if (!email) {
    return NextResponse.json(
      { error: "Email or confirmation token required" },
      { status: 401 }
    );
```

**Conclusion:** Production deployment predates P0 security remediation. **Redeploy mandatory.**

---

## Admin cookie signing

**File:** `src/middleware.ts`

| Control | Implementation |
|---------|----------------|
| Cookie name | `ADMIN_SESSION_COOKIE` from `@/constants/auth` |
| Legacy value `1` | Rejected (`raw === "1" return false`) |
| Verification | `verifyAdminSessionTokenEdge()` with `ADMIN_SESSION_SECRET` |
| Fallback secret | `ADMIN_OPS_SECRET` |
| Protected paths | `PROTECTED_DATA_ROUTE_PREFIXES` → redirect to `/admin` |

**Vercel:** `ADMIN_SESSION_SECRET` on Production + Development ✅; Preview ❌

---

## Registration lookup protection

**File:** `src/lib/security/registration-lookup.ts`

| Control | Status |
|---------|--------|
| HMAC-SHA256 tokens | ✅ |
| Timing-safe compare | ✅ |
| 7-day TTL | ✅ |
| Secret chain | `REGISTRATION_LOOKUP_SECRET` → `REGISTRATION_EMAIL_SECRET` → `ADMIN_OPS_SECRET` |
| Rate limit | 10/min/IP on GET route |

---

## Public API exposure

| Endpoint | Auth | Risk |
|----------|------|------|
| `GET /api/registration/[id]` | Token or email required (code) | **P0 on live prod** |
| `POST /api/payments/razorpay-webhook` | HMAC signature | ✅ |
| `POST /api/registration/submit` | reCAPTCHA + server validation | ✅ (not modified) |
| `GET /api/v2/health` | None | ✅ Low risk |
| `/api/v2/admin/*` | `ADMIN_OPS_SECRET` gateway | ✅ |
| Legacy data pages | Middleware + admin session | ✅ |

---

## Middleware protection

| Path class | Protection |
|------------|------------|
| `/admin/*` | Allowed through (auth at app layer) |
| Protected data routes | Admin session required |
| `/api/*` | Excluded from middleware matcher |
| SEO | `X-Robots-Tag: noindex` on admin/legacy data |

---

## Admin routes

| Layer | Mechanism |
|-------|-----------|
| UI pages `/admin/*` | Client-side Firebase auth + session |
| API `/api/v2/admin/*` | `ADMIN_OPS_SECRET` header |
| API gateway `/api/admin/gateway/*` | Secret + proxy |
| Legacy data viewers | Middleware session check |

---

## Secrets handling

| Secret | Local | Vercel Prod | Concern |
|--------|:-----:|:-----------:|---------|
| `ADMIN_OPS_SECRET` | ✅ | ✅ | — |
| `ADMIN_SESSION_SECRET` | ✅ | ✅ | — |
| `REGISTRATION_LOOKUP_SECRET` | ✅ | ✅ | — |
| `RAZORPAY_WEBHOOK_SECRET` | ✅ | ✅ | — |
| `FIREBASE_SERVICE_ACCOUNT_JSON` | ✅ | ✅ | Rotate if exposed |
| `SUPABASE_SERVICE_ROLE_KEY` | ✅ | ✅ | Server-only ✅ |
| DB password in `.env` | ✅ | Via integration | Rotate if exposed in chat |

---

## Security readiness score

| Category | Local code | Production live |
|----------|:----------:|:---------------:|
| Registration lookup | 100 | **0** |
| Admin session | 95 | 70 (unverified) |
| Firestore rules | 95 | 50 (unverified deploy) |
| API gateway | 90 | 80 |
| **Overall security** | **93/100** | **35/100** |
