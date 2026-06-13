# Email Delivery Proof

**Production:** https://www.shikshamahakumbh.com  
**Audit timestamp (UTC):** 2026-06-13T08:28:28Z  
**Dependency:** Task 1 registration (Bal Shodh Patrika) — **did not succeed**

---

## Result: **FAIL** (no email event produced)

---

## Checks performed

| Check | Result |
|-------|--------|
| `email_logs` table count | **0** (before and after audit run) |
| Rows for test email `proof-e2e-*@audit.shikshamahakumbh.test` | **0** |
| `POST /api/registration/send-email` during browser run | **Not called** (registration submit returned 403) |
| Message ID | **None** |
| SMTP response captured | **None** |
| Inbox delivery | **Not verified** |

---

## Code path note (fresh inspection)

Production confirmation email is triggered **client-side** after successful submit:

```
POST /api/registration/submit (success)
  → POST /api/registration/send-email
```

The `send-email` route (`src/app/api/registration/send-email/route.ts`):

- Sends via **nodemailer** when `SMTP_HOST`, `SMTP_USER`, `SMTP_PASS` are set
- Updates `registrations.email_delivery_status` (`sent` | `failed` | `skipped`)
- Does **not** write to `email_logs` (that table is used by `email.service.ts` elsewhere)

Therefore **`email_logs` = 0 does not alone prove SMTP is broken** — but no submit succeeded, so no email path ran.

### Existing registration metadata

`SMK2026-000001` metadata shows `"emailDeliveryStatus": "skipped"` (migration-era row).

---

## Evidence

```json
{
  "before": { "allEmailCount": 0, "emails": [] },
  "after": { "allEmailCount": 0, "emails": [] },
  "sendEmailResponse": null
}
```

Source: `docs/go-live/_proof-artifacts/proof-run.json`

---

## Manual close-out (after successful registration)

1. Complete Task 1 manual browser submit.
2. Check browser Network tab for `POST /api/registration/send-email` → expect `{ "success": true, "emailStatus": "sent" }`.
3. Query Supabase: `SELECT email_delivery_status FROM registrations WHERE registration_id = 'SMK2026-000002'`.
4. Optionally query `email_logs` if v2 email service is wired later.

---

## Verdict

| Check | Pass? |
|-------|-------|
| email_logs row | ❌ |
| SMTP send succeeded | ❌ (not exercised) |
| Delivery status recorded | ❌ |
| Recipient inbox | ❌ |

**Email delivery proof: FAIL**
