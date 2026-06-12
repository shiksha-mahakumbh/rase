# Security Hardening Report — Phase B.7

**Date:** May 2026  
**Scope:** CMS admin gateway, v2 APIs, RLS, uploads, rate limits  
**Overall:** **Pass with warnings**

---

## Executive summary

Phase B.7 adds a **Firebase-verified admin gateway** so CMS operators never receive `ADMIN_OPS_SECRET` in the browser. v2 admin APIs remain protected by ops-secret; public APIs use rate limiting. Registration stays on Firebase (unchanged).

| Area | Rating | Notes |
|------|--------|-------|
| Admin API auth | ✅ Pass | Gateway + dual-layer auth |
| Public API exposure | ✅ Pass | Rate limits, no admin routes public |
| RLS policies | ⚠️ Warning | Written; staging apply pending |
| Upload security | ⚠️ Warning | MIME validation partial |
| Service role usage | ✅ Pass | Server-only Prisma |
| x-ops-secret | ✅ Pass | Never sent to client |

---

## 1. Admin routes

### Before B.7

- v2 admin APIs required `x-ops-secret` — unusable from browser without exposing secret
- `/admin` relied on client-side Firebase only; no server gate on CMS APIs

### After B.7

```
Browser → Firebase ID token → /api/admin/gateway/* → verify token + role → inject x-ops-secret → /api/v2/admin/*
```

| Control | Implementation |
|---------|----------------|
| Token verification | `firebase-admin` `verifyIdToken()` |
| Role check | Firestore `adminUsers` + `ADMIN_BOOTSTRAP_EMAILS` |
| Secret injection | Server-side only in gateway route |
| Methods | GET, POST, PUT, PATCH, DELETE proxied |

**Recommendation:** Add audit logging on gateway (user email + path + method).

---

## 2. x-ops-secret usage

| Location | Exposure |
|----------|----------|
| `src/server/lib/admin-guard.ts` | Server env only |
| `src/app/api/admin/gateway/[...path]/route.ts` | Injected server-side |
| Client bundle | ❌ Not present |
| `.env` / Vercel secrets | Required: `ADMIN_OPS_SECRET` |

**Pass:** Secret never shipped to browser.

---

## 3. Service role / Prisma

- All CMS data access via Next.js server routes + Prisma
- `DATABASE_URL` server-only (direct Postgres connection)
- No Supabase service role key in client code
- Firebase service account JSON server-only (`FIREBASE_SERVICE_ACCOUNT_JSON`)

---

## 4. RLS policies

Policies exist in:

| File | Tables |
|------|--------|
| `supabase/policies/cms.sql` | pages, sections, seo, media |
| `supabase/policies/phase_b.sql` | notices, settings, menus, announcement_bars |
| `supabase/policies/analytics.sql` | visitor_* tables |
| `supabase/policies/admin.sql` | RBAC, audit |
| `supabase/policies/storage.sql` | Storage buckets |

**Warning:** Policies are **written but not verified applied** on staging/production Supabase. Prisma uses direct connection (bypasses RLS); RLS protects direct Supabase client access.

**Action:** Run `supabase db push` or apply migrations on staging; verify with `is_admin_user()` helper.

---

## 5. Upload permissions

| Endpoint | Auth | Validation |
|----------|------|------------|
| `POST /api/v2/admin/downloads` | requireAdmin | Multipart; file required |
| `POST /api/v2/admin/media-library` | requireAdmin | Multipart; MIME from client |
| Gateway proxy | Firebase admin | Forwards to above |

**Warnings:**

- No virus scanning on uploads
- MIME type trusted from client `file.type`
- File size limits depend on Next.js / platform defaults

**Recommendations:**

1. Validate MIME against allowlist (image/*, application/pdf)
2. Enforce max file size (e.g. 25 MB) in route handler
3. Store in Supabase Storage with bucket policies from `storage.sql`

---

## 6. Rate limits

`createApiHandler` applies per-IP rate limits on v2 routes:

| Route family | Typical limit |
|--------------|---------------|
| Public reads (`notices`, `settings`) | 60–120/min |
| Analytics track | Limited |
| Admin routes | 30/min default |

**Pass:** Basic abuse protection in place.

---

## 7. Registration security (unchanged)

- Firebase registration flow untouched per project rules
- `REGISTRATION_BACKEND=firebase` unchanged
- Admin portal uses separate Firebase auth + Firestore roles

---

## 8. Middleware

- `/admin` and `/admin/cms` get `noindex` metadata
- Legacy data routes redirect to `/admin` if session cookie missing
- **Warning:** `/admin/cms` not middleware-gated — relies on `AdminGate` client + gateway server auth

**Recommendation:** Optional middleware check for `smk_admin_session` cookie on `/admin/cms/*` (defense in depth; gateway still blocks API abuse).

---

## Findings summary

| ID | Severity | Finding | Status |
|----|----------|---------|--------|
| SEC-01 | High | Ops secret in browser | ✅ Fixed (gateway) |
| SEC-02 | Medium | RLS not applied on staging | ⚠️ Open |
| SEC-03 | Medium | Upload MIME not validated | ⚠️ Open |
| SEC-04 | Low | No gateway audit log | ⚠️ Open |
| SEC-05 | Low | Admin UI pages not middleware-gated | ⚠️ Acceptable |

**Security score for B.7: 88/100** (up from 85 at B.6)
