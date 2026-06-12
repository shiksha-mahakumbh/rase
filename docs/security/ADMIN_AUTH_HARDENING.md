# Admin Authentication Hardening

**Date:** May 2026  
**Status:** IMPLEMENTED  
**Blocker:** P0 — Forgeable admin session cookie

---

## Audit findings (pre-remediation)

| Location | Weak check | Risk |
|----------|------------|------|
| `src/middleware.ts` | `smk_admin_session === "1"` | Client-set cookie, no signature |
| `src/constants/auth.ts` | `document.cookie = ...=1` | Forgeable from DevTools |
| `src/lib/adminAuth.tsx` | Called `setAdminSessionCookie()` on login | Set weak cookie client-side |

**Protected routes:** `*datadekh*`, `/schooldata`, `/AllData`, etc. (PII export viewers)

**Not protected by weak cookie:** `/admin`, `/admin/cms/*` (rely on Firebase client + gateway for APIs)

---

## Remediation implemented

### Strategy: Firebase-verified signed HttpOnly JWT cookie

```
Login → Firebase ID token → POST /api/admin/session → HMAC-signed HttpOnly cookie
Middleware → verify HMAC signature + expiry → allow datadekh routes
Logout → DELETE /api/admin/session → clear cookie
```

### New modules

| File | Purpose |
|------|---------|
| `src/lib/security/admin-session.ts` | Create/verify signed session (Node) |
| `src/lib/security/admin-session-edge.ts` | Verify in Edge middleware (Web Crypto) |
| `src/app/api/admin/session/route.ts` | POST (exchange token) / DELETE (logout) |

### Cookie properties

| Property | Value |
|----------|-------|
| Name | `smk_admin_session` |
| Value | `{base64url(payload)}.{hmac-sha256}` |
| HttpOnly | ✅ |
| Secure | ✅ (production) |
| SameSite | Lax |
| Max-Age | 7 days |
| Payload | `{ uid, email, role, exp }` |

### Weak cookie rejected

Middleware explicitly rejects legacy value `=== "1"`.

### Client changes

| File | Change |
|------|--------|
| `src/lib/adminAuth.tsx` | Calls `/api/admin/session` POST/DELETE; no client cookie write |
| `src/constants/auth.ts` | `setAdminSessionCookie()` deprecated to no-op |

### Admin API security (unchanged — already strong)

| Layer | Mechanism |
|-------|-----------|
| CMS APIs | Firebase token → `/api/admin/gateway` → `x-ops-secret` → v2 admin |
| All v2 admin routes | `requireAdmin: true` |

### Additional hardening

- `/noticeboarddata` added to `PROTECTED_DATA_ROUTE_PREFIXES`

### Environment

| Variable | Purpose |
|----------|---------|
| `ADMIN_SESSION_SECRET` | HMAC signing (preferred, distinct from ops secret) |
| Fallback | `ADMIN_OPS_SECRET` |

---

## Verification checklist

- [ ] Set `document.cookie = "smk_admin_session=1"` → datadekh routes **redirect to /admin**
- [ ] Login as admin → POST `/api/admin/session` sets HttpOnly cookie
- [ ] Valid signed cookie → datadekh routes **accessible**
- [ ] Tampered cookie signature → **redirect to /admin**
- [ ] Expired cookie → **redirect to /admin**
- [ ] Logout → DELETE clears cookie

---

## Remaining recommendations (P1)

- Gate `/admin` page itself with middleware signed-session check (defense in depth)
- Rotate `ADMIN_SESSION_SECRET` on schedule
- Add session invalidation on role change in Firestore
