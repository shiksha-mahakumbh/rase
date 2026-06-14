# Security Review Report — Phase 6

**Date:** 2026-05-29  
**Scope:** SMK 6.0 production readiness  
**Automated tests:** `npm run test` — **32/32 PASS**

---

## Verdict: **PASS WITH DOCUMENTED GAPS**

No critical vulnerabilities identified in automated tests. Medium-risk operational gaps (distributed rate limiting, fine-grained RBAC) documented for post-launch hardening.

---

## 1. Admin Authentication

| Control | Implementation | Status |
|---------|----------------|--------|
| Session cookie | HMAC-SHA256 signed `smk_admin_session` (7-day TTL) | ✅ |
| Legacy cookie rejection | Value `"1"` rejected | ✅ Tested |
| Middleware | Protects legacy PII export routes | ✅ |
| Supabase login | `/api/admin/login` → HttpOnly cookie | ✅ |
| Admin gateway | Cookie/Bearer + role check before v2 proxy | ✅ |
| Direct v2 admin APIs | Shared ops secret (`ADMIN_OPS_SECRET`) | ⚠️ No per-role server enforcement |
| Client RBAC | `adminAuth.tsx` UI gating only | ⚠️ UI-only for some actions |

**Recommendation:** Enforce role checks server-side on destructive admin endpoints before public launch scale.

---

## 2. API Protection

| Endpoint class | Protection | Status |
|----------------|------------|--------|
| `/api/v2/admin/*` | Ops secret or gateway | ✅ |
| `/api/registration/submit` | reCAPTCHA + rate limit 15/min | ✅ |
| `/api/registration/lookup` | Email or HMAC token + rate limit | ✅ |
| `/api/participant/*` | Reg ID + email match | ✅ |
| Public CMS reads | Intentionally open | ✅ By design |
| Contact / newsletter | reCAPTCHA + 5/min | ✅ |

---

## 3. Rate Limiting

**File:** `src/lib/security/rateLimit.ts`

| Route | Limit |
|-------|-------|
| Registration submit | 15/min/IP |
| Registration lookup | 10/min/IP |
| Email send | 10/min/IP |
| Razorpay webhook | 100/min/IP |
| Contact form | 5/min/IP |

**Gap:** In-memory store — not shared across Vercel serverless instances. Documented in prior security gates.

**Recommendation:** Migrate to Redis/Upstash for distributed rate limiting at scale.

---

## 4. Payment Verification

| Control | File | Status |
|---------|------|--------|
| Client checkout signature | `lib/razorpay/verify.ts` HMAC | ✅ |
| Webhook signature | `razorpay-webhook/route.ts` | ✅ 401 without sig |
| Amount validation | Min ₹1, captured status | ✅ |
| Submit gate | `assertVerifiedPaymentForSubmit` | ✅ |
| Webhook event persistence | `recordWebhookEvent` not called from route | ⚠️ Reconciliation via admin retry |

---

## 5. File Upload Security

**File:** `src/server/services/storage.service.ts`

| Control | Status |
|---------|--------|
| 10 MB max size | ✅ |
| Extension allowlist | ✅ |
| MIME allowlist | ✅ |
| Filename sanitization | ✅ |
| Auth on upload routes | ❌ Public (rate limit only) |
| Virus scanning | ❌ Stub only |

**Recommendation:** Consider registration-token binding for uploads on paid flows.

---

## 6. Public APIs — Intentionally Open

Registration submit, upload, CMS reads, analytics track, health, certificate verify — documented in Phase 6 E2E report. All have rate limits or captcha where abuse risk is high.

---

## 7. Security Headers

**File:** `next.config.js`

- `X-Frame-Options: SAMEORIGIN`
- `X-Content-Type-Options: nosniff`
- `Referrer-Policy: strict-origin-when-cross-origin`
- `Permissions-Policy` restricts camera/mic/geo

---

## 8. Secrets & Environment

Verify on Vercel production:

| Variable | Purpose |
|----------|---------|
| `ADMIN_SESSION_SECRET` / `ADMIN_OPS_SECRET` | Admin auth |
| `RAZORPAY_KEY_SECRET`, `RAZORPAY_WEBHOOK_SECRET` | Payments |
| `RECAPTCHA_SECRET_KEY` | Form protection |
| `BREVO_SMTP_*` or `SMTP_*` | Email |
| `DATABASE_URL`, `DIRECT_URL` | Supabase/Prisma |
| `WHATSAPP_*` | Optional messaging |

Run: `node scripts/verify-env.mjs` (local — does not expose values)

---

## Automated Test Results

```
test:security          9/9 PASS
registration-lookup    6/6 PASS
registration-types     7/7 PASS
visitor-analytics       10/10 PASS
```

---

## Risk Register

| ID | Severity | Finding | Mitigation |
|----|----------|---------|------------|
| S1 | Medium | In-memory rate limits | Upstash Redis post-launch |
| S2 | Medium | Upload routes unauthenticated | Rate limit + validation; monitor abuse |
| S3 | Low | Admin RBAC UI-only | Server-side role checks |
| S4 | Low | No virus scan on uploads | ClamAV or cloud scanner |
| S5 | Info | Webhook log not auto-persisted | Admin reconciliation workflow exists |

**No critical blockers for SMK 6.0 launch.**
