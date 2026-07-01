# Admin Authentication Hardening

**Date:** July 2026  
**Status:** IMPLEMENTED  
**Blocker:** P0 — Forgeable admin session cookie

---

## Audit findings (pre-remediation)

| Location | Weak check | Risk |
|----------|------------|------|
| `src/middleware.ts` | `smk_admin_session === "1"` | Client-set cookie, no signature |
| `src/constants/auth.ts` | `document.cookie = ...=1` | Forgeable from DevTools |
| `src/lib/adminAuth.tsx` | Called `setAdminSessionCookie()` on login | Set weak cookie client-side |

---

## Remediation implemented

### Strategy: Supabase-verified signed HttpOnly session cookie

```
Login → Supabase password / access token → POST /api/admin/login or /api/admin/session
       → HMAC-signed HttpOnly cookie (includes sessionVersion)
Middleware → verify HMAC signature + expiry → allow protected routes
Gateway → signed x-admin-context-sig headers → v2 admin API
Logout → DELETE /api/admin/session → clear cookie
Role change → bump users.session_version → existing cookies invalidated
```

### New / updated modules

| File | Purpose |
|------|---------|
| `src/lib/security/admin-session.ts` | Create/verify signed session (Node) |
| `src/lib/security/admin-session-edge.ts` | Verify in Edge middleware (Web Crypto) |
| `src/app/api/admin/login/route.ts` | Email/password login → signed cookie |
| `src/app/api/admin/session/route.ts` | POST (exchange Supabase token) / DELETE (logout) |
| `src/server/lib/same-origin.ts` | CSRF protection via Origin/Referer check |
| `src/server/lib/admin-gateway-context.ts` | Separate `ADMIN_GATEWAY_SIGNING_SECRET` for role header signing |
| `prisma/schema.prisma` | `User.sessionVersion` for session revocation |

### Cookie properties

| Property | Value |
|----------|-------|
| Name | `smk_admin_session` |
| Value | `{base64url(payload)}.{hmac-sha256}` |
| HttpOnly | ✅ |
| Secure | ✅ (production) |
| SameSite | Lax |
| Max-Age | 7 days |
| Payload | `{ uid, email, role, sessionVersion, exp }` |

### Weak cookie rejected

Middleware explicitly rejects legacy value `=== "1"`.

### Client changes

| File | Change |
|------|--------|
| `src/lib/adminAuth.tsx` | Calls `/api/admin/session` POST/DELETE; no client cookie write |
| `src/constants/auth.ts` | `setAdminSessionCookie()` deprecated to no-op |

### Admin API security

| Layer | Mechanism |
|-------|-----------|
| CMS APIs | Supabase session → `/api/admin/gateway` → signed headers → v2 admin |
| All v2 admin routes | `requireAdmin: true` + DB-backed RBAC permissions |

### Environment

| Variable | Purpose |
|----------|---------|
| `ADMIN_SESSION_SECRET` | HMAC signing for admin session cookie |
| `ADMIN_OPS_SECRET` | Gateway → v2 admin API authentication |
| `ADMIN_GATEWAY_SIGNING_SECRET` | Optional separate secret for `x-admin-context-sig` (recommended) |

---

## Verification checklist

- [ ] Set `document.cookie = "smk_admin_session=1"` → protected routes **redirect to /admin**
- [ ] Login as admin → POST `/api/admin/login` sets HttpOnly cookie
- [ ] Valid signed cookie → protected routes **accessible**
- [ ] Tampered cookie signature → **redirect to /admin**
- [ ] Expired cookie → **redirect to /admin**
- [ ] Logout → DELETE clears cookie
- [ ] Role change or deactivation → `session_version` bump invalidates cookie
- [ ] Cross-origin POST to `/api/admin/login` → **403** (same-origin check)

---

## Remaining recommendations (P1)

- Gate `/admin` page itself with middleware signed-session check (defense in depth)
- Rotate `ADMIN_SESSION_SECRET` on schedule
- Set `ADMIN_GATEWAY_SIGNING_SECRET` distinct from `ADMIN_OPS_SECRET` in production
