# Security Deployment Verification

**Date:** 2026-06-10  
**Scope:** Registration lookup, admin session, Firestore rules source

---

## Summary

| Layer | Verdict | Evidence |
|-------|---------|----------|
| **Codebase (repo)** | **PASS** | 9/9 automated tests + source review |
| **Production (live)** | **FAIL** | Anonymous registration lookup returns PII |
| **Deployment gap** | **CONFIRMED** | Fixes in repo; not deployed to production |

---

## 1. Registration lookup endpoint

### Requirement

Anonymous `GET /api/registration/[registrationId]` must be blocked unless caller provides:
- HMAC confirmation `token`, OR
- matching `email` query parameter

### Codebase evidence — **PASS**

**File:** `src/app/api/registration/[registrationId]/route.ts`

```51:56:rase/src/app/api/registration/[registrationId]/route.ts
  const email = await resolveVerifiedEmail(registrationId, request);
  if (!email) {
    return NextResponse.json(
      { error: "Email or confirmation token required" },
      { status: 401 }
    );
```

| Check | Result | Evidence |
|-------|--------|----------|
| Token path | ✅ PASS | `verifyRegistrationLookupToken()` L20–23 |
| Email path | ✅ PASS | `email` query param L26–27 |
| No credential → 401 | ✅ PASS | L52–56 |
| Rate limit | ✅ PASS | 10/min/IP L34–44 |
| ID format validation | ✅ PASS | `REG_ID_RE` L47–48 |
| Email mismatch → 404 | ✅ PASS | L82–84 |

**Automated test:** `registration_get_requires_auth` — **PASS**

```
node scripts/staging-security-check.mjs → 9/9 PASS (2026-06-10)
```

### Production live evidence — **FAIL**

**Probe (2026-06-10):**
```
GET https://www.shikshamahakumbh.com/api/registration/SMK2026-000001
(no token, no email)
```

| Expected | Actual |
|----------|--------|
| `401` — "Email or confirmation token required" | **`200 OK`** with full PII (name, email, phone, institution, payment status) |

**Conclusion:** Production deployment is **stale** — predates P0 security remediation. Codebase has fix; **deploy required**.

---

## 2. Registration lookup token (HMAC)

**File:** `src/lib/security/registration-lookup.ts`

| Test | Result |
|------|--------|
| Valid token verifies | ✅ PASS |
| Wrong registration ID rejected | ✅ PASS |
| Tampered token rejected | ✅ PASS |
| Timing-safe compare | ✅ `timingSafeEqual` |
| Secret chain | `REGISTRATION_LOOKUP_SECRET` → fallbacks |

---

## 3. Admin session secret and HMAC verification

### `ADMIN_SESSION_SECRET`

| Environment | Present | Evidence |
|-------------|---------|----------|
| Local `.env` | ✅ | `staging-env-check.mjs` 21/21 |
| Vercel Production | ✅ | `vercel env ls` |
| Vercel Development | ✅ | `vercel env ls` |
| Vercel Preview | ❌ | Not listed |

### HMAC cookie verification

**File:** `src/middleware.ts`

```41:49:rase/src/middleware.ts
async function hasValidAdminSession(request: NextRequest): Promise<boolean> {
  const raw = request.cookies.get(ADMIN_SESSION_COOKIE)?.value;
  if (!raw || raw === "1") return false;

  const secret = process.env.ADMIN_SESSION_SECRET ?? process.env.ADMIN_OPS_SECRET;
  if (!secret) return false;

  const session = await verifyAdminSessionTokenEdge(raw, secret);
  return session !== null;
}
```

| Check | Result | Evidence |
|-------|--------|----------|
| `ADMIN_SESSION_SECRET` referenced | ✅ PASS | L45 |
| HMAC verification | ✅ PASS | `verifyAdminSessionTokenEdge` L48 |
| Fallback to `ADMIN_OPS_SECRET` | ✅ PASS | L45 |
| No secret → deny | ✅ PASS | L46 `return false` |

**Automated tests:**
- `admin_session_valid` — **PASS**
- `admin_session_legacy_rejected` — **PASS**

---

## 4. Legacy `smk_admin_session=1` cookie rejection

**Cookie name:** `smk_admin_session` (`src/constants/auth.ts` L2)

| Check | Result | Evidence |
|-------|--------|----------|
| Cookie constant defined | ✅ PASS | `ADMIN_SESSION_COOKIE = "smk_admin_session"` |
| Value `"1"` rejected | ✅ PASS | `middleware.ts` L43: `raw === "1" return false` |
| Legacy value in test | ✅ PASS | `admin_session_legacy_rejected` test |

---

## 5. Firestore rules (source)

| Check | Result |
|-------|--------|
| `registrations` create denied | ✅ PASS |
| Backup rules identified | ✅ PASS |
| Backup NOT in `firebase.json` | ✅ PASS |

---

## PASS / FAIL matrix

| Control | Codebase | Production live |
|---------|:--------:|:---------------:|
| Registration lookup requires token/email | **PASS** | **FAIL** |
| HMAC lookup tokens | **PASS** | N/A (not deployed) |
| `ADMIN_SESSION_SECRET` configured | **PASS** | Unverified live |
| HMAC admin cookie verification | **PASS** | Unverified live |
| Legacy `smk_admin_session=1` rejected | **PASS** | Unverified live |
| Firestore rules deny client create | **PASS** | Deploy unverified |
| Rate limiting on lookup | **PASS** | Unknown live |

---

## Required remediation

| # | Action | Owner |
|---|--------|-------|
| 1 | `npx vercel --prod` — deploy current codebase | DevOps |
| 2 | Post-deploy: `GET /api/registration/SMK2026-000001` → **must return 401** | QA |
| 3 | `firebase deploy --only firestore:rules,storage` + Console verify | DevOps |
| 4 | Copy security secrets to Vercel Preview | DevOps |

**No code changes applied in this audit.**
