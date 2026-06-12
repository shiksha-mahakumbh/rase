# F1 — Supabase Auth Implementation

**Status:** Complete (implementation only; not deployed)

## Summary

Replaced Firebase client auth and `verifyIdToken` with Supabase email/password login and the existing HMAC `ADMIN_SESSION_COOKIE` pattern.

## Key files

| File | Role |
|------|------|
| `src/lib/supabase/browser.ts` | Browser Supabase client |
| `src/lib/supabase/server.ts` | Server Supabase client (SSR) |
| `src/server/services/auth.service.ts` | Login + `resolveAdminRoleForUser()` via Prisma RBAC |
| `src/server/lib/supabase-admin-auth.ts` | Replaces `firebase-admin-auth.ts` |
| `src/server/lib/admin-request-auth.ts` | HMAC cookie OR Bearer for admin APIs |
| `src/app/api/admin/login/route.ts` | POST email/password → HMAC session cookie |
| `src/app/api/admin/session/bootstrap/route.ts` | GET current session from cookie |
| `src/lib/adminAuth.tsx` | Client admin context (email/password, no Firebase) |
| `src/lib/admin-cms-api.ts` | Cookie-based gateway fetch + `adminCmsUpload` |
| `src/components/admin/cms/AdminGate.tsx` | CMS login gate (email/password) |

## Deleted

- `src/server/lib/firebase-admin-auth.ts`
- `src/lib/resolveAdminRole.ts` (Firestore `adminUsers`)

## Verification

- Admin login: `POST /api/admin/login` with `{ email, password }`
- Session bootstrap: `GET /api/admin/session/bootstrap` (cookie)
- Gateway proxy: `/api/admin/gateway/*` → `/api/v2/admin/*`
