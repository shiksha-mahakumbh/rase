# Go-Live Validation Report — Shiksha Mahakumbh Web

**Edition:** SMK 6.0 · National launch  
**Report date:** 29 May 2026  
**Canonical URL:** `https://www.rase.co.in`  
**Codebase:** Phase 7 (post Phases 1–6)  
**Automated probe:** `node scripts/validate-go-live.mjs`

---

## Executive summary

| Category | Repo / code | Production (live probe) |
|----------|-------------|-------------------------|
| Infrastructure | **PASS** (templates + routes exist) | **VERIFY** (see §1) |
| Security | **PASS** (implementation) | **VERIFY** (keys, rules deploy) |
| Analytics | **PASS** (implementation) | **VERIFY** (GTM/GA4 live) |
| Registration | **PASS** | **VERIFY** (one E2E test) |
| Overall | **READY WITH CONDITIONS** | Deploy latest build + complete checklist |

**Live probe note (29 May 2026):** `curl` returned HTTP **200** for `/api/health`, `/sitemap.xml`, and `/robots.txt`, but response bodies were **HTML** (full page). **Root cause:** legacy `vercel.json` catch-all `"dest": "/"` — fixed in Phase 8. See `docs/PRODUCTION_DEPLOYMENT_AUDIT.md`. Re-run `node scripts/validate-go-live.mjs` after redeploy.

---

## Launch checklist

### Infrastructure

| # | Item | Repo | Production | Action if FAIL |
|---|------|------|------------|----------------|
| 1 | Firestore rules deployed | **PASS** (`firebase/firestore.rules`) | **VERIFY** | Firebase Console → Firestore → Rules → publish; match repo |
| 2 | Storage rules deployed | **PASS** (`firebase/storage.rules`) | **VERIFY** | Firebase Console → Storage → Rules → publish |
| 3 | Environment variables | Documented | **VERIFY** | Hosting env: see `DEPLOYMENT_CHECKLIST.md` |
| 4 | Health endpoint | **PASS** (`/api/health`) | **VERIFY** | Must return `{"status":"ok",...}` JSON |
| 5 | Sitemap accessible | **PASS** (`src/app/sitemap.ts`) | **VERIFY** | `GET /sitemap.xml` → XML `urlset` |
| 6 | robots.txt accessible | **PASS** (`src/app/robots.ts`) | **VERIFY** | `GET /robots.txt` → `User-agent` lines |

### Security

| # | Item | Repo | Production | Action if FAIL |
|---|------|------|------------|----------------|
| 7 | reCAPTCHA working | **PASS** (client + `/api/registration/verify-captcha`) | **VERIFY** | Set `NEXT_PUBLIC_RECAPTCHA_SITE_KEY` + `RECAPTCHA_SECRET_KEY` for production domain |
| 8 | Razorpay webhook verified | **PASS** (HMAC in `/api/payments/razorpay-webhook`) | **VERIFY** | Set `RAZORPAY_WEBHOOK_SECRET`; dashboard URL → `/api/payments/razorpay-webhook` |
| 9 | Email delivery | **PASS** (`/api/registration/send-email`) | **VERIFY** | `SMTP_*`, `REGISTRATION_EMAIL_SECRET`; send test mail |
| 10 | Rate limits | **PASS** (`lib/security/rateLimit.ts` on APIs) | **VERIFY** | Burst-test email/captcha routes; expect 429 |

### Analytics

| # | Item | Repo | Production | Action if FAIL |
|---|------|------|------------|----------------|
| 11 | GA4 receiving events | **PASS** (consent-gated loader) | **VERIFY** | GA4 DebugView after cookie accept |
| 12 | GTM firing | **PASS** | **VERIFY** | GTM Preview mode on homepage + registration |
| 13 | Custom events visible | **PASS** (`lib/analytics/events.ts`) | **VERIFY** | `registration_started`, `registration_completed`, etc. |
| 14 | UTM attribution | **PASS** (`attribution.ts` → Firestore) | **VERIFY** | Register with `?utm_source=test`; check admin doc fields |

---

## Detailed validation

### 1. Firestore rules

- Registration create: `SMK2026-[0-9]{6}`, email, fullName ≥ 2 chars.
- Admin read/update: `adminUsers` role check.
- `registrationCounters`: client write **denied** — confirm counter increment still works via transaction path documented in Phase 6.
- **Deploy command:** Firebase CLI `firebase deploy --only firestore:rules` (from project with `firebase.json`).

**Status:** Repo **PASS** · Deployed **VERIFY**.

### 2. Storage rules

- Max 10 MB; types: pdf, jpeg, png, webp, csv, xlsx under `registrations/{type}/**`.

**Status:** Repo **PASS** · Deployed **VERIFY**.

### 3. Environment variables (production)

| Variable | Required for launch |
|----------|---------------------|
| `NEXT_PUBLIC_SITE_URL` | Yes — `https://www.rase.co.in` |
| `NEXT_PUBLIC_RECAPTCHA_SITE_KEY` | Yes |
| `RECAPTCHA_SECRET_KEY` | Yes |
| `REGISTRATION_EMAIL_SECRET` | Yes (email API) |
| `RAZORPAY_WEBHOOK_SECRET` | Yes if payments live |
| `NEXT_PUBLIC_ADMIN_EMAILS` | Yes (admin bootstrap) |
| `NEXT_PUBLIC_GTM_ID` or `NEXT_PUBLIC_GA_ID` | Yes |
| `SMTP_HOST`, `SMTP_USER`, `SMTP_PASS`, etc. | Yes for confirmation email |
| `NEXT_PUBLIC_ADSENSE_ENABLED` | No until AdSense approved |

### 4. Health endpoint

Expected:

```json
{ "status": "ok", "service": "rase-web", "timestamp": "...", "version": "..." }
```

Configure uptime monitor: ping every 1–5 min; alert on non-200 or `status !== "ok"`.

### 5. Sitemap & robots

- Submit `https://www.rase.co.in/sitemap.xml` in Google Search Console after deploy.
- Locale URLs (`/hi/registration`, etc.) are **not** in sitemap yet (WARN) — add when prioritizing multilingual SEO.

### 6. reCAPTCHA

- Production **must not** rely on dev bypass (missing keys).
- Test: complete registration step 3 with keys set; invalid token should block submit.

### 7. Razorpay webhook

- Signature verification: **PASS** in code.
- Payment → Firestore sync: **not implemented** (WARN) — reconcile payments in admin manually until server sync is added.
- Webhook URL: `https://www.rase.co.in/api/payments/razorpay-webhook`

### 8. Email

- Registration succeeds even if email fails (by design).
- Verify SMTP with a real registration in staging/production.

### 9. Rate limits

- Applied on: registration verify-captcha, send-email, client-error, webhooks (see `middleware` / route handlers).

---

## Post-deploy sign-off (manual)

| Role | Name | Date | Signature |
|------|------|------|-----------|
| Tech lead | | | |
| Content lead | | | |
| DHE / RASE coordinator | | | |

**Minimum E2E before national campaigns:**

1. [ ] Register one delegate → `SMK2026-XXXXXX` in Firestore  
2. [ ] Admin login → list + export registration  
3. [ ] Cookie consent → GTM network requests in DevTools  
4. [ ] `/knowledge` search returns ecosystem items  
5. [ ] `node scripts/validate-go-live.mjs` → 3/3 PASS  

---

## Related documents

- `docs/DEPLOYMENT_CHECKLIST.md`
- `docs/LAUNCH_READINESS_REPORT.md`
- `docs/MONITORING_RUNBOOK.md`
- `docs/FINAL_LIGHTHOUSE_REPORT.md`
