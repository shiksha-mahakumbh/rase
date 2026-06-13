# Manual Final Go-Live Report — Production

**Production URL:** https://www.shikshamahakumbh.com  
**Report generated (UTC):** 2026-06-13T08:36:30Z  
**Deployment:** `dpl_BuFV3NuAgWC4G55jxvjyFgVDu2Bw` (commit `8c138e4`)  
**Evidence source:** Fresh headed-browser registration attempt + live HTTP probes + Supabase direct queries  
**Prior audit reports:** Not used as evidence (re-verified independently)

---

## Executive Summary

Manual production verification was executed against the live site using **headed Google Chrome** (non-headless). The Bal Shodh Patrika registration form was filled completely and submitted, but **reCAPTCHA v3 rejected the session** (HTTP 403). Registration persistence, email delivery, and payment completion could not be proven end-to-end in this run.

Security controls and SEO canonicalization **pass**. Infrastructure remediation (TYPE_MAP, admin gateway 401) is deployed and operational.

---

## Results Matrix

| Area | PASS / FAIL | Score (weight) | Notes |
|------|-------------|----------------|-------|
| **Registration Persistence** | **FAIL** | 0 / 25 | Submit 403; counter stuck at 1; no `SMK2026-000002+` |
| **Email Delivery** | **FAIL** | 0 / 20 | `send-email` never called; `email_logs` = 0 |
| **Payment Persistence** | **FAIL** | 8 / 20 | `create-order` 200 live; no paid webhook / DB rows |
| **Security** | **PASS** | 25 / 25 | Lookup 401, gateway 401, webhook 401, rate limit 429 |
| **SEO** | **PASS** | 18 / 20 | Canonical/sitemap/robots on `.com`; 8 footer `rase.co.in` links |

---

## Readiness Score

**51 / 100**

| Band | Verdict |
|------|---------|
| ≥ 90 | GO |
| 75 – 89 | CONDITIONAL GO |
| < 75 | **NO GO** |

### **Verdict: NO GO**

Registration, email, and payment persistence require a **human-operated browser session** (no automation) to complete reCAPTCHA and, for payments, an authorized live transaction.

---

## Phase 1 — Registration (FAIL)

| Item | Evidence |
|------|----------|
| Browser | Headed Chrome, `headless: false` |
| Category | Bal Shodh Patrika |
| Before-submit screenshot | `_manual-proof-artifacts/03-before-submit.png` |
| After-submit screenshot | `_manual-proof-artifacts/04-after-submit.png` (403 toast) |
| Submit response | 403 `{ "error": "Security verification failed" }` at `2026-06-13T08:34:20.475Z` |
| Registration ID | **None generated** |
| Counter before | `SMK2026` / `lastNumber: 1` |
| Counter after | `SMK2026` / `lastNumber: 1` |
| Expected ID | `SMK2026-000002` or higher — **not achieved** |

Detail: [`MANUAL_REGISTRATION_PROOF.md`](./MANUAL_REGISTRATION_PROOF.md)

---

## Phase 2 — Email (FAIL)

| Item | Evidence |
|------|----------|
| `send-email` network call | Not observed |
| Expected `{ "emailStatus": "sent" }` | Not received |
| `email_logs` count | **0** |
| `registrations.emailDeliveryStatus` (SMK2026-000001) | `null` |
| Inbox confirmation | Not tested |

Detail: [`MANUAL_EMAIL_PROOF.md`](./MANUAL_EMAIL_PROOF.md)

---

## Phase 3 — Payment (PARTIAL)

| Item | Evidence |
|------|----------|
| `create-order` | **200** — `order_T13GdyUoF1g2pq`, `key_id: rzp_live_Sz5hsyGHWPtgbT` |
| Payment completed | **No** (live key — charge not authorized) |
| `payment_records` | **0 rows** |
| `webhook_events` | **0 rows** |
| Unsigned webhook probe | **401** `{ "error": "Invalid signature" }` |

Detail: [`MANUAL_PAYMENT_PROOF.md`](./MANUAL_PAYMENT_PROOF.md)

---

## Security Verification (PASS)

**Probed at:** 2026-06-13T08:35:49Z

| Control | Status | Response |
|---------|--------|----------|
| Registration lookup without auth | **401** | `{ "error": "Email or confirmation token required" }` |
| Admin gateway unauthenticated | **401** | `{ "error": "Unauthorized", "code": "UNAUTHORIZED" }` |
| Razorpay webhook unsigned | **401** | `{ "error": "Invalid signature" }` |
| Rate limiting (20× submit burst) | **429 triggered** | Statuses: 400, 429 |

---

## SEO Verification (PASS — minor caveat)

| Check | Value |
|-------|-------|
| Homepage canonical | `https://www.shikshamahakumbh.com` |
| `og:url` | `https://www.shikshamahakumbh.com` |
| Sitemap `<loc>` count | 114 (all `.com`) |
| Sitemap `rase.co.in` refs | 0 |
| `robots.txt` Sitemap | `https://www.shikshamahakumbh.com/sitemap.xml` |
| Homepage `rase.co.in` footer links | **8** (cosmetic / legacy org links) |

---

## Database Snapshot (final)

**Queried at:** 2026-06-13T08:35:47.741Z

```
registrations:          1 row  (SMK2026-000001)
registration_counters:  lastNumber = 1
email_logs:             0 rows
payment_records:        0 rows
webhook_events:         0 rows
```

---

## Conditions for GO Re-assessment

1. **Human registration:** Submit Bal Shodh Patrika in a normal browser → confirm `SMK2026-000002+`, counter increment, success UI.
2. **Email:** Capture DevTools `send-email` response with `"emailStatus": "sent"`; verify inbox; check `email_delivery_status` on the new row.
3. **Payment:** Complete one authorized live Razorpay payment → confirm `payment_records`, `webhook_events`, and registration payment fields populated.
4. Re-run this report with fresh timestamps and artifacts.

---

## Artifact Index

| File | Description |
|------|-------------|
| `docs/go-live/_manual-proof-artifacts/manual-run.json` | Headed registration run (network, DB before/after) |
| `docs/go-live/_manual-proof-artifacts/live-probes.json` | Security, SEO, create-order, DB snapshot |
| `docs/go-live/_manual-proof-artifacts/01-hub.png` | Registration hub |
| `docs/go-live/_manual-proof-artifacts/02-form-step.png` | Form step 2 |
| `docs/go-live/_manual-proof-artifacts/03-before-submit.png` | Filled form before submit |
| `docs/go-live/_manual-proof-artifacts/04-after-submit.png` | After submit (403 toast) |
| `docs/go-live/MANUAL_REGISTRATION_PROOF.md` | Phase 1 detail |
| `docs/go-live/MANUAL_EMAIL_PROOF.md` | Phase 2 detail |
| `docs/go-live/MANUAL_PAYMENT_PROOF.md` | Phase 3 detail |

---

## Authorization

| Role | Decision | Date |
|------|----------|------|
| Automated manual verification (this run) | **NO GO** | 2026-06-13 |
| Human sign-off pending | Required for registration / email / payment | — |
