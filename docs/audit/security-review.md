# Security Review — Post P0 Remediation

**Date:** 29 May 2026  
**Scope:** Verification after P0 audit fixes  
**Environment:** Code review + production header probe (`https://www.rase.co.in`)

---

## Executive Summary

P0 remediation **closed three critical API/XSS gaps**. Security posture improved from **C+ to B** for application-layer controls. **Production readiness for security is partial** — dependency CVEs, distributed rate limiting, and analytics consent remain open (P1).

---

## 1. HTTPS Enforcement

| Check | Status | Evidence |
|-------|--------|----------|
| HTTPS on production | ✅ PASS | `https://www.rase.co.in` serves 200 |
| HTTP → HTTPS redirect | ✅ PASS | Vercel default |
| Mixed content | ⚠️ MONITOR | CSP includes `upgrade-insecure-requests` |
| HSTS | ✅ PASS | `Strict-Transport-Security: max-age=63072000` (Vercel) |

---

## 2. Security Headers

| Header | Status | Notes |
|--------|--------|-------|
| `Strict-Transport-Security` | ✅ | Vercel-managed |
| `X-Frame-Options` | ✅ | `SAMEORIGIN` |
| `X-Content-Type-Options` | ✅ | `nosniff` |
| `Referrer-Policy` | ✅ | `strict-origin-when-cross-origin` |
| `Permissions-Policy` | ✅ | camera/mic/geo disabled |
| `Content-Security-Policy` | ✅ **NEW** | Added in `next.config.js` — allows known third parties |

**CSP caveat:** Includes `'unsafe-inline'` and `'unsafe-eval'` for Next.js/GTM compatibility. Tighten with nonces in P2.

---

## 3. XSS Protection

| Control | Status | Notes |
|---------|--------|-------|
| CMS HTML sanitization | ✅ **NEW** | `sanitizeCmsHtml()` + `SafeHtml` on 6 CMS components |
| JSON-LD injection | ✅ | `JSON.stringify` only — unchanged |
| Stored XSS via CMS | ⚠️ MITIGATED | DOMPurify strips scripts/event handlers |
| `eval()` in Feedback.tsx | ❌ OPEN | P3 — `src/components/content/Feedback.tsx` |

---

## 4. CSRF Protection

| Surface | Status | Notes |
|---------|--------|-------|
| JSON API routes | ✅ | Same-origin + no cookie auth on public POST |
| Admin session cookie | ✅ | `SameSite: lax`, HttpOnly, HMAC-signed |
| Admin forms | ✅ | Session required via middleware |
| CSRF tokens | ⚠️ N/A | Not implemented — acceptable for JSON API pattern |

---

## 5. Authentication

| Component | Status | Notes |
|-----------|--------|-------|
| Admin session (HMAC) | ✅ | 7-day TTL, `secure` in prod |
| Legacy cookie `=1` | ✅ **NEW** | Explicitly rejected in middleware |
| Middleware admin gate | ✅ | `/admin/*`, `/event/checkin/*` |
| Participant dashboard | ⚠️ WEAK | registrationId + email only (P2) |
| Registration lookup token | ✅ | HMAC, 7-day expiry, email-bound |

---

## 6. Authorization

| Layer | Status | Notes |
|-------|--------|-------|
| Admin gateway RBAC | ✅ | Signed `x-admin-context-sig` headers |
| v2 admin `createApiHandler` | ✅ | RBAC on mutations |
| `ADMIN_OPS_SECRET` bearer | ⚠️ HIGH RISK | Single key unlocks admin API (P1) |
| v2 registration submit | ✅ **FIXED** | Payment guard parity with legacy |
| v2 registration upload | ✅ **FIXED** | Server-side bucket only |

---

## 7. Rate Limiting

| Route class | Status | Notes |
|-------------|--------|-------|
| Registration submit | ✅ | 15/min |
| Registration upload | ✅ | 30/min |
| Contact / newsletter | ✅ | 5/min |
| Upstash Redis | ⚠️ OPTIONAL | In-memory fallback on serverless (P1) |
| `/api/visitors` POST | ⚠️ OPEN | No rate limit (P3) |

---

## 8. Dependency Vulnerabilities

**`npm audit` (29 May 2026):** 42 vulnerabilities (3 critical, 28 high, 10 moderate, 1 low)

| Severity | Count | Action |
|----------|-------|--------|
| Critical | 3 | P1 — `npm audit fix` + manual review |
| High | 28 | P1 — transitive deps (xlsx, postcss, etc.) |
| Moderate | 10 | P2 |

**Not addressed in P0** — requires dependency upgrade sprint without breaking registration.

---

## 9. Environment Variables & Secrets

| Check | Status | Notes |
|-------|--------|-------|
| `.env` gitignored | ✅ | |
| No secrets in `src/` | ✅ | |
| `verify-env.mjs` | ✅ | Pre-deploy validation script |
| `ADMIN_SESSION_SECRET` required | ✅ | Fail-closed in prod |
| Exposed Vercel token (prior chat) | ⚠️ | User must rotate if pasted in chat |

---

## 10. File Upload Security

| Control | Status |
|---------|--------|
| Size limit (10 MB) | ✅ |
| MIME/extension allowlist | ✅ |
| Server-side bucket mapping | ✅ **FIXED on v2** |
| Virus scan hook | ❌ No-op stub (P3) |
| Audit logging | ✅ |

---

## 11. API Security Summary

| Endpoint | Pre-P0 | Post-P0 |
|----------|--------|---------|
| `POST /api/v2/registration/submit` | ❌ No payment verify | ✅ Guard + consume |
| `POST /api/v2/registration/upload` | ❌ Client bucket | ✅ Type-mapped bucket |
| `POST /api/registration/submit` | ✅ | ✅ Unchanged |
| Razorpay webhook HMAC | ✅ | ✅ |
| reCAPTCHA production fail-closed | ✅ | ✅ |

---

## 12. P0 Security Tests

```
test:security — 13/13 PASS (staging-security-check)
test:v2-registration-security — 9/9 PASS
test:registration-types — 7/7 PASS
test:registration-lookup-security — 6/6 PASS
```

---

## Risk Matrix (Remaining)

| Risk | Severity | Priority |
|------|----------|----------|
| npm audit CVEs | High | P1 |
| ADMIN_OPS_SECRET single bearer | High | P1 |
| First-party analytics without consent | High | P1 |
| No Upstash in prod | Medium | P1 |
| CSP unsafe-inline | Medium | P2 |
| Participant dashboard enumeration | Medium | P2 |

---

## Verdict

**Security gate for P0:** ✅ **PASSED** — critical exploitable endpoints patched.  
**Full production security certification:** ❌ **NOT YET** — dependency CVEs and P1 items remain.

---

*Cross-reference: `docs/audit/implementation-plan.md`, `docs/go-live/SECURITY_REVIEW_REPORT.md`*
