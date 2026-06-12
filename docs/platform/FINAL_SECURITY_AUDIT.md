# Final Security Audit

**Date:** May 2026  
**Target:** No critical issues  
**Current status:** **3 CRITICAL issues identified — launch blocked**

---

## Architecture summary

**Admin CMS path (strong):**
```
Browser → Firebase ID token → /api/admin/gateway/* → verifyFirebaseAdmin → x-ops-secret → /api/v2/admin/*
```

- All **52** `/api/v2/admin/*` routes use `createApiHandler({ requireAdmin: true })`
- `x-ops-secret` injected server-side only — not in client bundle
- Razorpay webhook verifies HMAC when `RAZORPAY_WEBHOOK_SECRET` set

---

## Findings by severity

### CRITICAL

| # | Issue | Location | Impact |
|---|-------|----------|--------|
| C1 | **Unauthenticated PII lookup by predictable registration ID** | `GET /api/registration/[registrationId]`, `GET /api/v2/registration/[id]` | IDs match `SMK2026-\d{6}` (~1M enumerable). Returns email, phone, institution, payment status, full Prisma row including uploads. Mass PII harvest with only IP rate limit (60/min). |
| C2 | **Forgeable legacy admin session cookie** | `src/constants/auth.ts`, `src/middleware.ts` | Cookie `smk_admin_session=1` set from client JS — no signature, not HttpOnly. Protects `*datadekh*` PII export pages. Anyone can set cookie. `/admin` itself not cookie-gated. |
| C3 | **Firebase rules deployment uncertainty** | `firebase/firestore.rules` vs `firebase/firestore.rules.production-backup` | Backup rules allow unauthenticated registration `create` and catch-all admin read/write. If production uses backup, client `addDoc` paths may be writable. |

### HIGH

| # | Issue | Location | Impact |
|---|-------|----------|--------|
| H1 | Shared secret fallback `ADMIN_OPS_SECRET` → `REGISTRATION_EMAIL_SECRET` | `admin-guard.ts` | Email secret compromise grants full v2 admin API |
| H2 | Direct v2 admin API if ops secret leaks | `/api/v2/admin/*` | No Firebase check on direct calls — catastrophic if secret in logs/CI |
| H3 | Unauthenticated multi-bucket upload | `POST /api/v2/registration/upload` | No auth; buckets include `media`, `committee`, `downloads`. MIME spoofable. Storage abuse. |
| H4 | Firebase upload 10-year signed URLs | `POST /api/registration/upload` | Leaked URL = decade-long document access |
| H5 | Supabase RLS/storage not fully deployed | `supabase/policies/*.sql` | Service role bypasses RLS; storage policies are comments only |
| H6 | Prisma RBAC schema unused | `User`, `Role`, `Permission` | Binary ops-secret only; all Firebase admins get full CMS mutations |
| H7 | `/api/v2/health` exposes DB connectivity | Unauthenticated | Reconnaissance aid |

### MEDIUM

| # | Issue | Location |
|---|-------|----------|
| M1 | In-memory rate limiting on Vercel | `rateLimit.ts` — per-instance, resets on cold start |
| M2 | `NEXT_PUBLIC_ADMIN_EMAILS` exposes bootstrap admin list | Client + server |
| M3 | Hardcoded Firebase client config | `firebase/client.ts` |
| M4 | Unauthenticated email sending | `/api/v2/registration/send-email` |
| M5 | Razorpay create-order — client-controlled amount | No server-side fee validation |
| M6 | Upload MIME hardening gaps | No magic-byte validation; virus scan placeholder |
| M7 | `/noticeboarddata` not in protected route list | Middleware gap |
| M8 | Legacy client Firestore writes in codebase | Safe only if strict rules deployed |
| M9 | `verify-env.mjs` incomplete | Missing ADMIN_OPS_SECRET, DATABASE_URL, Supabase vars |
| M10 | No Content-Security-Policy header | `next.config.js` |
| M11 | Admin gateway lacks rate limiting | Firebase token brute-force surface |
| M12 | PII in Prisma without field encryption | PAN, payment signatures in JSON columns |

### LOW

| # | Issue |
|---|-------|
| L1 | Dev-mode security bypasses (reCAPTCHA, webhook skip) |
| L2 | Duplicate Razorpay API paths |
| L3 | Minimal `vercel.json` |
| L4 | Health endpoint auth fallback in non-production |
| L5 | `.env.supabase` not in `.gitignore` |

---

## Admin route security

| Check | Status |
|-------|--------|
| Firebase auth on gateway | ✅ |
| Role verification | ✅ |
| Ops secret server-only | ✅ |
| Audit logging on mutations | ✅ |
| x-ops-secret never in client | ✅ Verified |
| CSRF protection | ⚠️ Bearer token (acceptable for SPA admin) |
| Session timeout | ⚠️ Firebase token refresh only |

---

## Auth layers

| Surface | Auth mechanism | Gap |
|---------|---------------|-----|
| `/admin/cms/*` | Firebase → gateway | ✅ |
| `/admin` (registrations) | Client-side AdminProvider only | ⚠️ No middleware gate |
| `*datadekh*` pages | Forgeable cookie | ❌ Critical |
| Public v2 APIs | None (by design) | Rate limit only |
| Registration submit | reCAPTCHA (production) | ✅ |

---

## Upload security

| Route | Auth | Validation | Risk |
|-------|------|------------|------|
| `/api/v2/registration/upload` | ❌ | Extension/MIME (spoofable) | High |
| `/api/registration/upload` | ❌ | Firebase signed URL | High (long TTL) |
| Admin media library | ✅ Admin | Lighter MIME check | Medium |

---

## Secrets exposure audit

| Secret | Client exposure | Status |
|--------|----------------|--------|
| `ADMIN_OPS_SECRET` | Server only | ✅ |
| `SUPABASE_SERVICE_ROLE_KEY` | Server only | ✅ |
| `RAZORPAY_KEY_SECRET` | Server only | ✅ |
| `FIREBASE_SERVICE_ACCOUNT_JSON` | Server only | ✅ |
| `NEXT_PUBLIC_ADMIN_EMAILS` | Client | ⚠️ Informational leak |
| Firebase web config | Client (expected) | ⚠️ Normal for Firebase |

---

## Remediation priority (pre-launch)

| Priority | Action | Blocks launch? |
|----------|--------|----------------|
| P0 | Auth-protect or sanitize registration lookup APIs | **YES** |
| P0 | Replace cookie-only data page protection with Firebase session or retire pages | **YES** |
| P0 | Confirm/deploy strict Firebase rules (not backup) | **YES** |
| P1 | Distinct `ADMIN_OPS_SECRET`; `REGISTRATION_EMAIL_REQUIRE_SECRET=true` | Recommended |
| P1 | Lock down `/api/v2/registration/upload` — auth, single bucket | Recommended |
| P1 | Apply Supabase RLS + storage policies in production | Recommended |
| P2 | Distributed rate limiting (Upstash/Vercel KV) | No |
| P2 | Add CSP header | No |
| P2 | Extend `verify-env` for all production vars | No |

---

## Security score

| Factor | Score |
|--------|------:|
| Admin CMS auth | 92 |
| Public API exposure | 45 |
| Data protection | 50 |
| Upload security | 40 |
| Secrets management | 78 |
| Infrastructure hardening | 70 |

**Overall: 68 / 100** (critical issues cap score until resolved)

**Post-remediation target: 93 / 100**
