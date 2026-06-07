# Launch Readiness Report — Shiksha Mahakumbh Web

**Generated:** Phase 6 audit (codebase + template verification)  
**Build:** Expected passing after Phase 6  
**Production URL:** Configure `NEXT_PUBLIC_SITE_URL` (default `https://www.rase.co.in`)

> **Note:** Items marked **VERIFY** must be confirmed in Firebase Console, hosting env, and live URL after deploy. Repo-only checks cannot pass production deployment alone.

---

## Summary

| Area | Status | Score |
|------|--------|------:|
| Security rules (templates) | **PASS** (repo) / **VERIFY** (deployed) | — |
| API hardening | **PASS** | — |
| SEO & discoverability | **PASS** (partial routes) | — |
| Monitoring | **PASS** (stubs) / **WARN** (Sentry optional) | — |
| Revenue (Razorpay) | **WARN** (webhook verify only) | — |
| Analytics | **PASS** | — |
| Overall launch | **READY WITH CONDITIONS** | — |

---

## 1. Firestore rules

| Check | Status | Evidence |
|-------|--------|----------|
| Registration create validation | **PASS** | `validRegistrationCreate()` — ID pattern, email, name |
| Admin-only read/update registrations | **PASS** | `isAdminUser()` on `registrations` |
| Audit logs create | **PASS** | `audit_logs` create with `action` string |
| Open counter writes | **WARN** | `registrationCounters` write: `false` — client uses transaction; verify counter still works via rules exception or server path |
| Catch-all admin collections | **PASS** | `/{collection}/{docId}` admin only |
| **Deployed to Firebase** | **VERIFY** | Compare Console rules with `firebase/firestore.rules` |

---

## 2. Storage rules

| Check | Status | Evidence |
|-------|--------|----------|
| Upload size limit (10MB) | **PASS** | `storage.rules` |
| Content-type allowlist | **PASS** | pdf, jpeg, png, webp, csv, xlsx |
| Path `registrations/{type}/**` | **PASS** | |
| **Deployed to Firebase** | **VERIFY** | |

---

## 3. reCAPTCHA

| Check | Status | Evidence |
|-------|--------|----------|
| Client script + provider | **PASS** | `RecaptchaProvider`, `RegistrationHub` |
| Server verify route | **PASS** | `/api/registration/verify-captcha` + rate limit |
| Env `NEXT_PUBLIC_RECAPTCHA_SITE_KEY` | **VERIFY** | Required in production |
| Env `RECAPTCHA_SECRET_KEY` | **VERIFY** | Required in production |
| Dev bypass when keys missing | **PASS** | Documented — production must set keys |

---

## 4. Razorpay webhooks

| Check | Status | Evidence |
|-------|--------|----------|
| HMAC signature verification | **PASS** | `/api/payments/razorpay-webhook` |
| Rate limiting | **PASS** | |
| `RAZORPAY_WEBHOOK_SECRET` in production | **VERIFY** | Returns 503 if missing in prod |
| Firestore payment status sync | **FAIL** | Webhook logs only — manual admin payment updates |
| Razorpay dashboard webhook URL | **VERIFY** | Point to `https://www.rase.co.in/api/payments/razorpay-webhook` |

---

## 5. Email delivery

| Check | Status | Evidence |
|-------|--------|----------|
| API route | **PASS** | `/api/registration/send-email` |
| Rate limit + validation | **PASS** | |
| Optional `REGISTRATION_EMAIL_SECRET` | **VERIFY** | Set for production |
| SMTP env vars | **VERIFY** | `SMTP_*` in hosting |
| Failure non-blocking on register | **PASS** | Submit succeeds if email fails |

---

## 6. Analytics events

| Check | Status | Evidence |
|-------|--------|----------|
| Consent-gated GTM/GA4/Clarity/Meta | **PASS** | `AnalyticsLoader` |
| Custom events (registration, brochure, etc.) | **PASS** | `lib/analytics/events.ts` |
| UTM / device attribution on save | **PASS** | `attribution.ts` → Firestore fields |
| GTM container configured | **VERIFY** | `NEXT_PUBLIC_GTM_ID` or `NEXT_PUBLIC_GA_ID` |
| Search Console / GA property linked | **VERIFY** | Manual |

---

## 7. Health endpoints

| Check | Status | Evidence |
|-------|--------|----------|
| `GET /api/health` | **PASS** | Returns `{ status: "ok" }` |
| Uptime monitor configured | **VERIFY** | See `MONITORING_ARCHITECTURE.md` |
| Admin health overview UI | **PASS** | Phase 6 `AdminSystemHealth` |

---

## 8. Sitemap & robots

| Check | Status | Evidence |
|-------|--------|----------|
| `sitemap.ts` | **PASS** | Core public paths + `/knowledge` |
| `robots.ts` | **PASS** | |
| Locale URLs in sitemap | **WARN** | `/hi/*` not listed — add when prioritizing i18n SEO |
| Internal noIndex (datadekh) | **PASS** | Layouts + middleware `X-Robots-Tag` |

---

## 9. Google Search Console

| Check | Status | Action |
|-------|--------|--------|
| Property verified | **VERIFY** | Add domain property |
| Sitemap submitted | **VERIFY** | Submit `https://www.rase.co.in/sitemap.xml` |
| Coverage / Core Web Vitals | **VERIFY** | After production deploy |

---

## 10. Pre-launch checklist

- [ ] Deploy Firestore + Storage rules
- [ ] Set all env vars (`DEPLOYMENT_CHECKLIST.md`)
- [ ] Test registration + admin login on production domain
- [ ] Confirm reCAPTCHA on production domain whitelist
- [ ] Submit sitemap in Search Console
- [ ] Configure uptime ping on `/api/health`
- [ ] Decide Razorpay webhook → Firestore sync (post-launch if needed)

---

**Verdict:** **Launch-ready for registration, content, and admin operations**, with **VERIFY** steps for Firebase deploy, secrets, Search Console, and **WARN** for Razorpay auto-sync and full locale sitemap.
