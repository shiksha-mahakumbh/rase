# P0 Security Remediation Report

**Date:** May 2026  
**Scope:** Launch blockers only — no Phase D, no feature work

---

## Executive summary

Three P0 security blockers identified in the final pre-production audit have been **remediated in code**. Staging deployment and production Firebase rules verification remain **operational tasks**.

| Blocker | Code fix | Ops remaining |
|---------|----------|---------------|
| Registration PII exposure | ✅ Implemented | Smoke test on staging |
| Forgeable admin cookie | ✅ Implemented | Set `ADMIN_SESSION_SECRET` |
| Firebase rules uncertainty | ✅ Repo verified strict | Deploy + confirm in Console |
| Staging readiness | ✅ Artifacts ready | Migrate + seed DB |

---

## Blocker 1 — Registration data exposure

**Status:** FIXED

### Changes
- HMAC confirmation tokens issued at registration submit
- GET lookup requires `token` or `email` parameter
- New POST `/api/registration/lookup` for ID + email verification
- Public responses sanitized (no email, phone, uploads, payments)
- Rate limit reduced to 10/min

### Files changed
- `src/lib/security/registration-lookup.ts` (new)
- `src/app/api/registration/[registrationId]/route.ts`
- `src/app/api/registration/lookup/route.ts` (new)
- `src/app/api/v2/registration/[id]/route.ts`
- `src/app/api/registration/submit/route.ts`
- `src/app/api/v2/registration/submit/route.ts`
- `src/server/services/registration.service.ts`
- `src/lib/useRegistrationSubmit.ts`
- `src/components/registration/SuccessExperience.tsx`

**Detail:** `docs/security/REGISTRATION_LOOKUP_HARDENING.md`

---

## Blocker 2 — Admin authentication

**Status:** FIXED

### Changes
- Signed HttpOnly cookie via `POST /api/admin/session`
- Middleware verifies HMAC signature (rejects legacy `=1`)
- Client no longer sets cookies via `document.cookie`
- `/noticeboarddata` added to protected routes

### Files changed
- `src/lib/security/admin-session.ts` (new)
- `src/lib/security/admin-session-edge.ts` (new)
- `src/app/api/admin/session/route.ts` (new)
- `src/middleware.ts`
- `src/lib/adminAuth.tsx`
- `src/constants/auth.ts`
- `src/constants/routes.ts`

**Detail:** `docs/security/ADMIN_AUTH_HARDENING.md`

---

## Blocker 3 — Firebase rules

**Status:** REPO PASS — production deploy unverified

### Changes
- Strict rules audited: anonymous read/write denied on registrations
- Dangerous backup rules documented as DO NOT DEPLOY
- Added `firebase/RULES_DEPLOYMENT.md`

**Detail:** `docs/security/FIREBASE_RULES_VERIFICATION.md`

---

## Blocker 4 — Staging readiness

**Status:** CODE READY — ops pending

- 8 migrations present and schema valid
- 4 seed scripts available
- 22 admin modules + Phase C public routes implemented
- TypeScript compiles

**Detail:** `docs/security/STAGING_READINESS_VERIFICATION.md`

---

## Environment variables added

| Variable | Purpose |
|----------|---------|
| `REGISTRATION_LOOKUP_SECRET` | HMAC for confirmation tokens |
| `ADMIN_SESSION_SECRET` | HMAC for admin session cookie |

Updated in `.env.example`. Fallback to existing secrets if unset.

---

## Validation

| Command | Result |
|---------|--------|
| `npx tsc --noEmit` | ✅ Pass |
| `npx prisma validate` | ✅ Pass |

---

## Out of scope (P1 — not implemented)

- Upload route hardening (`/api/v2/registration/upload`)
- Supabase RLS production deploy
- Distributed rate limiting
- CSP headers
- `/admin` page middleware gate

---

## STOP

P0 code remediation complete. Awaiting approval for staging deployment.
