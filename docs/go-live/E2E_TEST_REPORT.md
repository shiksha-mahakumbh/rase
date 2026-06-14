# E2E Test Report — Phase 6 (SMK 6.0)

**Date:** 2026-05-29  
**Production URL:** https://www.shikshamahakumbh.com  
**Local build:** PASS (353 pages, exit 0)

---

## Executive Summary

| Layer | Result | Notes |
|-------|--------|-------|
| Production smoke (HTTP) | **PASS** 10/10 | Homepage, registration, sitemap, health |
| Go-live probes | **PASS** 3/3 | health, robots, sitemap |
| Automated security tests | **PASS** 32/32 | Local `npm run test` |
| Full registration E2E (browser) | **BLOCKED** | reCAPTCHA rejects automation (documented 2026-06-13) |
| Payment → receipt → email chain | **MANUAL REQUIRED** | Razorpay live keys; no automated payment in CI |
| Phase 5B routes on production | **PENDING DEPLOY** | `/abhiyan`, edition media URLs return 404 on live |

---

## Automated Production Probes (2026-05-29)

### Smoke test — `node scripts/production-smoke-test.mjs`

| Test | Status |
|------|--------|
| `/api/health` JSON | PASS |
| `/robots.txt` | PASS |
| `/sitemap.xml` | PASS |
| `/` homepage | PASS |
| `/registration` | PASS |
| `/registration/success` | PASS |
| `/knowledge` | PASS |
| `/introduction` | PASS |
| `/hi/registration` | PASS |
| `/admin` | PASS |

### Security API probes

| Test | Expected | Actual | Status |
|------|----------|--------|--------|
| Webhook without signature | 401 | 401 | PASS |
| Certificate verify invalid code | 404 | 404 | PASS |
| Registration lookup without credentials | 401 | 405 | ⚠️ Method/route mismatch on GET; POST enforces auth per source audit |

### Content / routing (post–Phase 5B — not yet on production)

| Path | Live status | Local build |
|------|-------------|-------------|
| `/abhiyan` | 404 | ✅ Built |
| `/media/shiksha-mahakumbh/4.0/digital` | 404 | ✅ Built |
| Sitemap edition URLs (`4.0`, `1.0`) | Not present | ✅ In local sitemap |

**Action:** Deploy latest `main` to Vercel to activate Phase 5A/5B routes on production.

---

## E2E Scenario Matrix

### 1. Registration → Payment → Receipt → QR → Email → Admin

| Step | Implementation | Automated | Manual status |
|------|----------------|-----------|---------------|
| Hub category select | `/registration` → type-specific form | Playwright blocked by reCAPTCHA | Requires human browser |
| Free category submit | `POST /api/registration/submit` | Blocked (403 captcha) | Use Bal Shodh Patrika manual test |
| Paid category | Razorpay checkout → verify | Not automated | Test Delegate Teacher ₹1000 in staging |
| Payment verify | `POST /api/payments/verify-payment` HMAC | Unit-tested in handlers | Live Razorpay test mode |
| Receipt PDF | `receipt.service.ts` → participant download | Admin API only | `/api/participant/download?type=receipt` |
| QR generation | Embedded in receipt + email CID | Source verified | Visual check in email client |
| Confirmation email | `email.service.ts` → Brevo SMTP | Logs in `email_logs` | Resend via admin receipt service |
| Admin visibility | `/admin/registrations/[id]` | Gateway auth required | Supabase row + admin search |

**Prior proof:** `docs/go-live/REGISTRATION_E2E_PROOF.md` — SMK2026-000001 exists in production DB.

### 2. Accommodation

| Item | Path | Status |
|------|------|--------|
| Registration form | `/registration/Accommodation` (legacy) | ⚠️ Stale 2025 copy — use hub Accommodation type |
| Hub flow | `/registration` → Accommodation | Code OK; manual E2E pending |
| Lifecycle emails | `accommodation-lifecycle.service.ts` | Admin-triggered; manual test |

### 3. Research submission

| Item | Path | Status |
|------|------|--------|
| Multi Track Conference | Redirects to CMT (`ShikshaMahakumbh2025`) | External; link live |
| Abstract / full paper legacy | `/abstractdatadekh`, etc. | Admin-only data views |

### 4. Certificate generation

| Item | API | Status |
|------|-----|--------|
| Admin badge PDF | `GET /api/v2/admin/badges/[id]` | Ops secret required |
| Admin certificate PDF | `GET /api/v2/admin/certificates/[id]` | Ops secret required |
| Public verify | `GET /api/certificate/verify/[code]` | PASS (404 on invalid) |
| Participant download | `GET /api/participant/download` | Email + reg ID match |

### 5. Check-in

| Item | Path | Status |
|------|------|--------|
| Event check-in UI | `/event/checkin` | Built; manual QR scan test at venue |
| QR payload | Registration ID in receipt service | Source verified |

### 6. Participant dashboard

| Item | Path | Status |
|------|------|--------|
| Dashboard | `/dashboard` | Built |
| API | `POST /api/participant/dashboard` | Rate limited 20/min; email + reg ID |

### 7. WhatsApp delivery

| Item | Status |
|------|--------|
| Provider | Meta Cloud API or generic webhook (`whatsapp.service.ts`) |
| Config | Requires `WHATSAPP_API_URL`, token, optional `WHATSAPP_PHONE_NUMBER_ID` |
| Logs | `/admin/cms/whatsapp-logs` |
| Automated E2E | **Not run** — needs live credentials + test number |

### 8. Document generation

| Item | API | Status |
|------|-----|--------|
| Invitation / acceptance letters | `/api/v2/admin/documents` | Admin only |
| PDF engine | jsPDF in `document-generation.service.ts` | Source verified |

---

## Manual E2E Close-Out Checklist

Execute in a **normal browser** (not automation):

- [ ] **Free registration:** Bal Shodh Patrika → success → SMK2026-00000X
- [ ] **Paid registration:** Delegate Teacher ₹1000 → Razorpay → receipt email with QR
- [ ] **Participant portal:** `/dashboard` with reg ID + email → profile update
- [ ] **Download:** Receipt PDF from email link or participant API
- [ ] **Admin:** Search registration in `/admin/registrations`
- [ ] **Certificate:** Generate badge/certificate from admin CMS for test reg
- [ ] **Check-in:** Scan QR at `/event/checkin`
- [ ] **WhatsApp:** Send test message via workflow rule or bulk attendee action
- [ ] **Accommodation:** Submit + confirm admin lifecycle email

---

## Blockers

| ID | Severity | Blocker | Resolution |
|----|----------|---------|------------|
| E1 | High | reCAPTCHA blocks automated registration E2E | Manual browser test |
| E2 | Medium | Phase 5B routes not on production | Deploy latest commit |
| E3 | Low | WhatsApp E2E needs live Meta credentials | Ops test with real phone |

---

## References

- `scripts/production-smoke-test.mjs`
- `scripts/validate-go-live.mjs`
- `docs/go-live/REGISTRATION_E2E_PROOF.md`
- `docs/go-live/PAYMENT_E2E_PROOF.md`
- `docs/go-live/EMAIL_DELIVERY_PROOF.md`
