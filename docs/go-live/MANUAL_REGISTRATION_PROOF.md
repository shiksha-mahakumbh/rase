# Manual Registration Proof — Production

**Production URL:** https://www.shikshamahakumbh.com  
**Registration path:** https://www.shikshamahakumbh.com/registration  
**Category tested:** Bal Shodh Patrika (free)  
**Audit window (UTC):** 2026-06-13T08:34:03Z – 2026-06-13T08:35:47Z  
**Deployment:** `dpl_BuFV3NuAgWC4G55jxvjyFgVDu2Bw` (commit `8c138e4`)  
**Method:** Headed Google Chrome via Playwright (`headless: false`, `channel: "chrome"`, automation flags reduced)

---

## Verdict: **FAIL**

A real browser session completed the full Bal Shodh Patrika form and clicked **Submit Registration**, but **reCAPTCHA v3 rejected the submission**. No new registration row was persisted and the counter did not increment.

---

## Phase 1 Checklist

| Check | Expected | Observed | Result |
|-------|----------|----------|--------|
| Registration succeeds | HTTP 200 + success UI | HTTP **403** + toast error | **FAIL** |
| Registration ID generated | `SMK2026-000002` or higher | None | **FAIL** |
| ID > `SMK2026-000001` | Yes | N/A | **FAIL** |
| Counter increments | `lastNumber` 1 → 2 | Unchanged at **1** | **FAIL** |

---

## Test Data Used

| Field | Value |
|-------|-------|
| Full Name | Manual Production Proof |
| Email | `manual-proof-1781339639856@audit.shikshamahakumbh.test` |
| Contact | 9876501234 |
| Designation | Verification Auditor |
| Institution | DHE QA Team |
| Address | Department of Holistic Education, NIT Hamirpur, HP |
| Country | India |
| Gender | Male |
| Vidya Bharti | Non Vidya Bharti |
| Title | Manual Bal Shodh Patrika Proof Entry |
| Description | Manual production verification submission for Bal Shodh Patrika registration persistence and email delivery proof. |
| Accommodation | No |

---

## Screenshots

| Stage | File |
|-------|------|
| Registration hub (before category) | `docs/go-live/_manual-proof-artifacts/01-hub.png` |
| Form step loaded | `docs/go-live/_manual-proof-artifacts/02-form-step.png` |
| **Before submit** (all fields filled) | `docs/go-live/_manual-proof-artifacts/03-before-submit.png` |
| **After submit** (403 toast visible) | `docs/go-live/_manual-proof-artifacts/04-after-submit.png` |

The after-submit screenshot shows the toast: **"Security verification failed. Please refresh and try again."**

---

## Network Evidence

**Timestamp:** 2026-06-13T08:34:20.475Z

```
POST https://www.shikshamahakumbh.com/api/registration/submit
Status: 403
Body: { "error": "Security verification failed" }
```

No `POST /api/registration/send-email` request was observed (submit did not succeed).

Full capture: `docs/go-live/_manual-proof-artifacts/manual-run.json`

---

## Database Verification (Supabase via Prisma)

### Before submission (2026-06-13T08:34:03.631Z)

| Table | Value |
|-------|-------|
| `registrations` row count | **1** |
| `registration_counters.lastNumber` | **1** |
| `registration_counters.prefix` | `SMK2026` |

### After submission (2026-06-13T08:35:47.741Z)

| Table | Value |
|-------|-------|
| `registrations` row count | **1** (unchanged) |
| `registration_counters.lastNumber` | **1** (unchanged) |
| New row for test email | **None** |

### Existing registration (baseline)

| Field | Value |
|-------|-------|
| `registrationId` | `SMK2026-000001` |
| `email` | `release-verify+20260609@rase.co.in` |
| `registrationType` | `Legacy_Other` |
| `createdAt` | `2026-06-12T17:00:12.598Z` |

### Counter delta

| Metric | Previous | New | Delta |
|--------|----------|-----|-------|
| `lastNumber` | 1 | 1 | **0** |
| `registrations.count` | 1 | 1 | **0** |

---

## Root Cause

Production reCAPTCHA v3 (`grecaptcha.execute`) assigns low trust scores to Playwright-controlled Chrome sessions, even when launched headed with `--disable-blink-features=AutomationControlled`. The server correctly rejects the token with HTTP 403.

**To pass Phase 1:** A human operator must submit the form in their own browser (Edge/Chrome without automation), complete reCAPTCHA naturally, and re-run DB verification for the new `SMK2026-000002+` row.

---

## Artifacts

- `docs/go-live/_manual-proof-artifacts/manual-run.json`
- `docs/go-live/_manual-proof-artifacts/01-hub.png` … `04-after-submit.png`
- `docs/go-live/_manual-proof-artifacts/live-probes.json` (DB snapshot)
