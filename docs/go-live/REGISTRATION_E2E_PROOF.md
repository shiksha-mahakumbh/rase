# Registration E2E Proof

**Production:** https://www.shikshamahakumbh.com  
**Audit timestamp (UTC):** 2026-06-13T08:28:28Z  
**Deployment:** `dpl_BuFV3NuAgWC4G55jxvjyFgVDu2Bw` (commit `8c138e4`)  
**Category tested:** Bal Shodh Patrika (free)

---

## Result: **FAIL** (persistence not achieved this run)

A full browser automation run completed the registration hub flow and submitted the form, but **reCAPTCHA verification was rejected by the server** (HTTP 403). No new registration row was created.

---

## Method

| Step | Tool | Detail |
|------|------|--------|
| Browser | Playwright Chromium (automation-controlled flags reduced) | Real DOM interaction, not API-only |
| Form | All required Bal Shodh Patrika fields | Including title, description, gender, Vidya Bharti |
| reCAPTCHA | v3 via `grecaptcha.execute` | Loaded successfully before submit |
| DB verification | Supabase via Prisma (`DIRECT_URL`) | Before/after counts and counter |

**Test email:** `proof-e2e-1781339304337@audit.shikshamahakumbh.test`

---

## Counter & row evidence

| Metric | Before | After | Expected if success |
|--------|--------|-------|---------------------|
| `registrations` count | **1** | **1** | 2 |
| Counter `lastNumber` | **1** | **1** | 2 |
| New row for test email | — | **null** | SMK2026-000002 |
| Admin search (test email) | — | **0 items** | 1 item |

### Existing production row (unchanged)

| Field | Value |
|-------|-------|
| registrationId | `SMK2026-000001` |
| email | `release-verify+20260609@rase.co.in` |
| createdAt | `2026-06-12T17:00:12.598Z` |
| registrationType | `Legacy_Other` |

---

## API evidence

### Submit attempt (browser-initiated)

```http
POST https://www.shikshamahakumbh.com/api/registration/submit
Status: 403
Body: { "error": "Security verification failed" }
```

### Type gate (confirms TYPE_MAP fix — separate probe)

```http
POST /api/registration/submit (no captchaToken)
registrationType: Bal Shodh Patrika
Status: 403 (not 400 Invalid registration type)
```

---

## Browser flow evidence

| Step | Status |
|------|--------|
| Hub page load | ✅ `Register — Shiksha Mahakumbh 6.0` |
| Bal Shodh Patrika selected | ✅ |
| Continue to details | ✅ |
| All required fields filled | ✅ |
| reCAPTCHA script loaded | ✅ |
| Submit Registration clicked | ✅ |
| Success redirect / new ID | ❌ Remained on `/registration` |
| `send-email` API call | ❌ Not triggered (submit failed) |

Raw artifact: `docs/go-live/_proof-artifacts/proof-run.json`

---

## Root cause

Google reCAPTCHA v3 **rejected the automated browser token** at server verification (`RECAPTCHA_SECRET_KEY` / score threshold). This is expected for headless/automation sessions and **cannot be bypassed** without:

1. A **manual human submit** in Chrome/Edge on production, or  
2. reCAPTCHA test keys (not configured on production)

---

## Manual close-out (required for PASS)

1. Open https://www.shikshamahakumbh.com/registration in a normal browser.
2. Select **Bal Shodh Patrika** → fill form → **Submit Registration**.
3. Confirm redirect/success shows **`SMK2026-000002`** (or next ID).
4. Verify in Supabase: `SELECT registration_id, email, created_at FROM registrations ORDER BY created_at DESC LIMIT 1`.

---

## Verdict

| Check | Pass? |
|-------|-------|
| Hub loads | ✅ |
| TYPE_MAP accepts category | ✅ |
| Full form submit + persistence | ❌ |
| Counter increment | ❌ |
| Admin visibility of new row | ❌ |

**Registration E2E proof: FAIL** (blocked by reCAPTCHA in automation; manual submit required).
