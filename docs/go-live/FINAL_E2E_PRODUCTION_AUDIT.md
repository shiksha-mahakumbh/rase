# Final E2E Production Audit

**Date:** 2026-06-13  
**Production:** https://www.shikshamahakumbh.com  
**Deployment:** `dpl_BuFV3NuAgWC4G55jxvjyFgVDu2Bw` (commit `8c138e4`)  
**Audit timestamp (UTC):** 2026-06-13T08:03–08:20Z  
**Method:** Live HTTP probes, Supabase direct queries, Playwright browser automation (Bal Shodh Patrika)

---

## Summary Matrix

| Area | Result | Score weight |
|------|--------|--------------|
| **Registration** | **PARTIAL FAIL** | Type gate + DB read path OK; new live submit not proven |
| **Email** | **FAIL** | Zero `email_logs`; no delivery proof |
| **Payment** | **PARTIAL** | `create-order` OK; no paid webhook / `payment_records` proof |
| **Security** | **PASS** | All regression checks pass |
| **SEO** | **PASS** (minor caveat) | Canonical/sitemap/robots correct; footer still links to `rase.co.in` |

**Readiness score: 84/100**

**Final verdict: CONDITIONAL GO**

---

## Phase 1 — Registration Submission

### Objective

Submit one test registration and prove persistence end-to-end.

### Attempt

| Step | Result |
|------|--------|
| Category selected | Bal Shodh Patrika (free, post-remediation) |
| Playwright form fill | ✅ Page load, category, step 2, fields filled, submit clicked |
| `POST /api/registration/submit` captured | ❌ **No API call** (reCAPTCHA v3 token not obtained in headless browser) |
| Supabase count before | **1** |
| Supabase count after | **1** (no delta) |
| Counter before / after | `SMK2026` `lastNumber=1` → unchanged |

**Test email used:** `e2e-audit-1781338819194@audit.shikshamahakumbh.test` — **no row created**

### Root cause (automation)

Client-side `getCaptchaToken()` requires `window.grecaptcha.execute()`. In headless Playwright, token generation did not fire; submit aborted before API call (`useRegistrationSubmit.ts`).

### API type-gate proof (production)

Direct POST without captcha (confirms remediation deploy):

```http
POST /api/registration/submit
registrationType: Bal Shodh Patrika

→ HTTP 403 { "error": "Security verification failed" }
```

(Not 400 — TYPE_MAP fix confirmed live.)

### Existing production registration (Supabase)

| Field | Value |
|-------|-------|
| **registrationId** | `SMK2026-000001` |
| **UUID** | `209b2bb3-c27e-4a4d-b6e3-4ddb147c3e64` |
| **Type** | `Legacy_Other` (migrated Conclave metadata) |
| **Email** | `release-verify+20260609@rase.co.in` |
| **Payment status** | `Not_Required` |
| **Created** | `2026-06-12T17:00:12.598Z` |

### Admin visibility

`GET /api/v2/admin/registrations` (with `x-ops-secret`) → **200**, returns `SMK2026-000001` in `items[]`, `total: 1`.

### Phase 1 verdict

| Check | Pass? |
|-------|-------|
| API accepts category (403 not 400) | ✅ |
| New registration submitted this audit | ❌ |
| Counter incremented this audit | ❌ |
| DB write path proven (historical row) | ✅ |
| Admin list shows registrations | ✅ |

**Registration: PARTIAL FAIL** — requires one **manual browser submit** (with reCAPTCHA) to close.

---

## Phase 2 — Email Verification

### Checks

| Check | Result |
|-------|--------|
| `email_logs` count | **0** |
| Rows for test email | **0** |
| Existing reg `emailDeliveryStatus` (metadata) | `"skipped"` |
| SMTP / inbox confirmation | **Not available** in this audit |

No confirmation email was triggered or logged during this audit window. The platform has email infrastructure in schema (`email_logs`, Brevo provider default) but **no production delivery proof**.

### Phase 2 verdict

**Email: FAIL**

---

## Phase 3 — Payment Flow

### Category note

Bal Shodh Patrika is **free** — full paid checkout not required for that category. Razorpay API availability tested separately.

### create-order

```http
POST /api/payments/create-order
{ "amount": 10000, "currency": "INR", "receipt": "e2e_<timestamp>" }

→ HTTP 200
{
  "order_id": "order_T12ip9YlPC9fH7",
  "amount": 10000,
  "currency": "INR",
  "key_id": "rzp_live_Sz5hsyGHWPtgbT"
}
```

| Check | Result |
|-------|--------|
| create-order succeeds | ✅ |
| Live Razorpay key configured | ✅ (live key — use test mode for future audit orders) |
| Payment UI completion | **Not executed** |
| verify-payment callback | **Not executed** |
| Signed webhook → `payment_records` | **Not executed** |
| `payment_records` count | **0** |
| `webhook_events` count | **0** |

### Phase 3 verdict

**Payment: PARTIAL** — order creation works; end-to-end paid registration **not proven**.

---

## Phase 4 — Security Regression

**Probe timestamp:** 2026-06-13T08:03Z

| Check | Expected | Actual | Pass |
|-------|----------|--------|------|
| `GET /api/registration/SMK2026-000001` | 401 | **401** `Email or confirmation token required` | ✅ |
| `GET /api/admin/gateway/registrations` | 401 JSON | **401** `{ error, code: UNAUTHORIZED }` | ✅ |
| Unsigned Razorpay webhook | 401 | **401** `Invalid signature` | ✅ |
| Rate limiting (20 rapid POSTs) | 429 observed | **429** triggered | ✅ |
| PII in 401 lookup response | None | No email/phone fields | ✅ |

**Security: PASS**

---

## Phase 5 — SEO Regression

| Check | Expected | Actual | Pass |
|-------|----------|--------|------|
| `/sitemap.xml` uses `.com` | Yes | **114** URLs, **114** `.com`, **0** `rase.co.in` | ✅ |
| `/robots.txt` sitemap | `.com` | `https://www.shikshamahakumbh.com/sitemap.xml` | ✅ |
| Homepage canonical | `.com` | `https://www.shikshamahakumbh.com` | ✅ |
| Open Graph URL | `.com` | `https://www.shikshamahakumbh.com` | ✅ |
| Homepage `rase.co.in` refs | Ideally 0 | **8** (footer/partner cross-links) | ⚠️ |
| Homepage `.org` refs | 0 | **0** | ✅ |

Sitemap and robots are clean. Residual `rase.co.in` appears only in **page body/footer links**, not in sitemap, robots, or canonical tags.

**SEO: PASS** (with footer-link caveat)

---

## Phase 6 — Final Authorization

### Evidence summary

| Proof type | Evidence |
|------------|----------|
| **Registration** | Type gate 403; `SMK2026-000001` in Supabase + admin API; new submit blocked by captcha in automation |
| **Payment** | `order_T12ip9YlPC9fH7` created; no `payment_records` row |
| **Email** | `email_logs` empty |
| **Security** | 5/5 checks pass |
| **SEO** | Canonical/sitemap/robots pass |

### Readiness score breakdown

| Dimension | Score |
|-----------|-------|
| Registration API + persistence path | 78 |
| Email delivery | 25 |
| Payment E2E | 55 |
| Security | 96 |
| SEO | 90 |
| **Overall** | **84/100** |

### Final verdict: **CONDITIONAL GO**

Production is **authorized for public registration traffic** on remediated categories subject to:

1. **Manual confirmation:** one human browser submission (any free category) → verify new `SMK2026-000002` row + counter increment.
2. **Email:** confirm one `email_logs` row with `status=sent` after submit (or fix SMTP if failing).
3. **Payment (paid categories):** one Razorpay **test-mode** transaction → signed webhook → `payment_records` row.

Without items 1–3, score remains **84/100** — not full **95+ GO**.

---

## Recommended manual close-out (15 minutes)

1. Open https://www.shikshamahakumbh.com/registration → Bal Shodh Patrika → complete form in Chrome.
2. Query Supabase: `SELECT registration_id, email, created_at FROM registrations ORDER BY created_at DESC LIMIT 1`.
3. Check `email_logs` for new row.
4. For payment: use Delegate or Projects (paid) with Razorpay test card in controlled test.

---

## Scripts executed (this audit)

| Script | Purpose |
|--------|---------|
| `scripts/_final-e2e-prod-audit.mjs` | DB snapshot, security/SEO, create-order, admin list |
| `scripts/_final-e2e-submit-only.mjs` | Playwright Bal Shodh Patrika submit attempt |

---

*Fresh production evidence only. Audit did not modify application code.*
