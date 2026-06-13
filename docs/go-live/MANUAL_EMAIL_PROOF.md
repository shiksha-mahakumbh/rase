# Manual Email Delivery Proof — Production

**Production URL:** https://www.shikshamahakumbh.com  
**Audit window (UTC):** 2026-06-13T08:34:03Z – 2026-06-13T08:35:47Z  
**Prerequisite:** Registration from Phase 1 (`MANUAL_REGISTRATION_PROOF.md`)

---

## Verdict: **FAIL** (blocked — no successful registration this run)

Email delivery could not be verified because Phase 1 registration submit failed at reCAPTCHA (HTTP 403). The client never reached the post-submit `send-email` call.

---

## Expected Flow (when registration succeeds)

1. `POST /api/registration/submit` → 200 with `registrationId`
2. Client calls `POST /api/registration/send-email`
3. Response: `{ "success": true, "emailStatus": "sent" }`
4. `registrations.email_delivery_status` updated on the row

**Note:** The legacy `send-email` route updates `registrations.emailDeliveryStatus` via nodemailer directly. It does **not** write to `email_logs`. The v2 `email.service.ts` path uses `email_logs`; the live registration UI uses the legacy route.

---

## Network Evidence (this run)

| Request | Observed |
|---------|----------|
| `POST /api/registration/submit` | **403** — `{ "error": "Security verification failed" }` |
| `POST /api/registration/send-email` | **Not called** |

Capture: `docs/go-live/_manual-proof-artifacts/manual-run.json` → `sendEmailResponse: null`

---

## Database Verification

**Checked at:** 2026-06-13T08:35:47.741Z

### `email_logs`

| Metric | Value |
|--------|-------|
| Total rows | **0** |
| Rows for test email `manual-proof-1781339639856@audit.shikshamahakumbh.test` | **0** |

### `registrations.email_delivery_status`

| Registration | `emailDeliveryStatus` |
|--------------|----------------------|
| `SMK2026-000001` | `null` |
| Test registration (this run) | Row does not exist |

---

## Inbox Verification

| Check | Result |
|-------|--------|
| Email received | **Not tested** — no successful registration |
| Subject line | N/A |
| Timestamp | N/A |
| Spam folder | N/A |

Test mailbox `manual-proof-1781339639856@audit.shikshamahakumbh.test` is a synthetic audit address with no inbox access configured in this environment.

---

## How to Complete This Phase Manually

1. Complete Phase 1 in a **non-automated** browser session.
2. Open DevTools → **Network** tab before clicking Submit.
3. Filter for `send-email`.
4. Record:
   - Request URL: `https://www.shikshamahakumbh.com/api/registration/send-email`
   - Status code
   - Response body (expect `"emailStatus": "sent"`)
5. Query Supabase:
   - `SELECT email_delivery_status FROM registrations WHERE registration_id = '<new_id>';`
   - Optionally check `email_logs` if v2 path is used elsewhere.
6. Check recipient inbox (and spam) for confirmation email subject containing the registration ID.

---

## Artifacts

- `docs/go-live/_manual-proof-artifacts/manual-run.json`
- `docs/go-live/_manual-proof-artifacts/live-probes.json`
