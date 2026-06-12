# Security Review — Full Platform Audit (Post B.7)

**Date:** May 2026  
**Current security score:** 88/100  
**Registration backend:** Firebase (unchanged)

---

## Executive summary

The platform uses a **dual-backend** model: Firebase for registration/volunteers, Supabase/Prisma for CMS and visitor analytics. Admin CMS access is gated through a Firebase-verified gateway that injects `x-ops-secret` server-side. No critical vulnerabilities found in audited paths; warnings remain on RLS staging apply and upload MIME hardening.

---

## 1. Admin routes

| Route | Auth | Server gate | Score |
|-------|------|-------------|------:|
| `/admin` | Firebase Google OAuth | Client role check | 85 |
| `/admin/cms/*` | Firebase + gateway | ✅ `verifyIdToken` + role | 92 |
| `/api/admin/gateway/*` | Bearer token | ✅ Proxies to v2 admin | 95 |
| `/api/v2/admin/*` | `x-ops-secret` | ✅ `requireAdmin` guard | 95 |

**Gap:** Gateway does not yet log operator email per mutation (recommended).

---

## 2. CMS / v2 API protection

| Control | Status |
|---------|--------|
| Public read APIs rate-limited | ✅ 30–120 req/min per IP |
| Write APIs admin-only | ✅ |
| `ServiceError` sanitization | ✅ No stack traces in prod |
| CORS | ✅ Same-origin default |
| Input validation (Zod) | ✅ Most admin routes |

**Sensitive public endpoints:**

| Endpoint | Protection |
|----------|------------|
| `/api/v2/contact` | reCAPTCHA + 5/min |
| `/api/v2/feedback` | 5/min |
| `/api/v2/registration/submit` | reCAPTCHA + rate limit |
| `/api/v2/newsletter/subscribe` | 5/min |
| `/api/v2/analytics/track` | 120/min |

---

## 3. Supabase policies

| Policy file | Tables | Applied in prod |
|-------------|--------|-----------------|
| `cms.sql` | pages, sections, seo | ⚠️ Verify |
| `phase_b.sql` | notices, menus, settings | ⚠️ Verify |
| `analytics.sql` | visitor_* | ⚠️ Verify |
| `admin.sql` | RBAC, audit | ⚠️ Verify |
| `storage.sql` | media buckets | ⚠️ Verify |

**Note:** App uses Prisma with direct Postgres — RLS is defense-in-depth if anon key is ever exposed.

---

## 4. Firebase routes

| Area | Status |
|------|--------|
| Registration submit | ✅ Firebase rules (unchanged) |
| Volunteer applications | ✅ Firebase admin |
| Payment (Razorpay) | ✅ Server-side verify (unchanged) |
| `REGISTRATION_BACKEND=firebase` | ✅ No v2 registration write in prod |

**Do not modify** per audit mandate.

---

## 5. Uploads & downloads

| Item | Status |
|------|--------|
| Media upload (admin) | ✅ Auth via gateway |
| Registration file upload | ✅ Rate limited |
| MIME type validation | ⚠️ Partial — extend allowlist |
| Signed URLs for private files | N/A — public CDN URLs |
| Download access control | ✅ Published flag in CMS |

---

## 6. Secrets management

| Secret | Client exposure |
|--------|-----------------|
| `ADMIN_OPS_SECRET` | ❌ Server only |
| `DATABASE_URL` | ❌ Server only |
| `FIREBASE_SERVICE_ACCOUNT_JSON` | ❌ Server only |
| `RECAPTCHA_SECRET` | ❌ Server only |
| Firebase web config | ✅ Public (expected) |
| Supabase anon key | ⚠️ If used client-side — audit env |

---

## 7. Rate limiting

| Implementation | Location |
|----------------|----------|
| In-memory sliding window | `src/lib/security/rateLimit.ts` |
| Per-route keys | `api-handler.ts`, individual routes |

**Limitation:** In-memory rate limits reset on serverless cold starts. Acceptable for current scale; consider Upstash Redis at high traffic.

---

## 8. Captcha

| Form | reCAPTCHA v3 |
|------|--------------|
| Contact | ✅ |
| Registration submit (v2 path) | ✅ |
| Feedback | ❌ Not implemented |
| Newsletter | ❌ Not implemented |

---

## 9. Findings summary

| ID | Severity | Finding | Recommendation |
|----|----------|---------|----------------|
| SEC-1 | Medium | RLS policies not verified in production | Run policy apply checklist |
| SEC-2 | Medium | Upload MIME validation partial | Whitelist pdf, jpg, png, webp |
| SEC-3 | Low | Admin page views pollute analytics | Exclude `/admin/*` |
| SEC-4 | Low | Feedback lacks captcha | Add reCAPTCHA on feedback |
| SEC-5 | Low | Gateway audit trail incomplete | Log email + path on writes |

---

## Security score

| Area | Weight | Score |
|------|-------:|------:|
| Admin auth | 25% | 92 |
| API protection | 25% | 90 |
| Secrets | 20% | 95 |
| Uploads | 15% | 78 |
| Rate limits / captcha | 15% | 85 |
| **Total** | 100% | **88** |
