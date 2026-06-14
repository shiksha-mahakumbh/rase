# Email & WhatsApp Template Review — Phase 6

**Date:** 2026-05-29  
**Primary files:** `src/server/services/email.service.ts`, `src/server/services/ops/whatsapp.service.ts`

---

## Email Templates

All templates are **inline HTML** in `buildHtml()` — no external `.html` template files.

### Template inventory

| Template ID | Trigger | Subject pattern | Status |
|-------------|---------|-----------------|--------|
| `registration_confirmation` | Post-submit / send-email API | Registration confirmed | ✅ Uses `EVENT_NAME` (SMK 6.0) |
| `payment_confirmation` | After verified payment | Payment received | ✅ Table layout, receipt link, QR CID |
| `admin_alert` | Admin notifications | Admin alert | ✅ |
| `contact_acknowledgement` | Contact form | Acknowledgement | ✅ |
| `feedback_acknowledgement` | Feedback form | Thank you | ✅ Uses `EVENT_NAME` |

### Payment confirmation content checklist

| Element | Present | Notes |
|---------|---------|-------|
| Registration ID | ✅ | From payload |
| Transaction ID | ✅ | Razorpay payment ID |
| Amount paid | ✅ | Formatted in table |
| Category | ✅ | Registration type |
| Receipt download link | ✅ | `receiptUrl` when provided |
| QR code (inline) | ✅ | `cid:registration-qr` attachment |
| Mobile-friendly layout | ⚠️ | Basic inline CSS; test in Gmail mobile |
| Logo / branding header | ❌ | Plain text header — consider adding SMK logo |
| Event dates/venue | ❌ | Not in template — add NIT Hamirpur Oct 2026 |

### SMTP configuration

| Provider | Env vars | Fallback |
|----------|----------|----------|
| Brevo (preferred) | `BREVO_SMTP_HOST`, `USER`, `PASS`, `FROM` | Generic SMTP |
| Generic | `SMTP_HOST`, `SMTP_USER`, `SMTP_PASS`, `FROM` | — |

**From address default:** `noreply@shikshamahakumbh.com`

### Email delivery monitoring

- Logs: `email_logs` table (Prisma)
- Admin UI: `/admin/cms/email-logs`
- Retries: MAX_ATTEMPTS = 3 in `email.service.ts`

### Recommendations before launch

1. Add branded header (logo URL from CDN/static) to `payment_confirmation` and `registration_confirmation`
2. Include event block: **SMK 6.0 · NIT Hamirpur · 9–11 Oct 2026**
3. Test QR rendering in Gmail, Outlook, and mobile clients
4. Verify receipt PDF attachment opens correctly on Android/iOS

---

## WhatsApp Templates

**File:** `src/server/services/ops/whatsapp.service.ts`

| Aspect | Implementation |
|--------|----------------|
| Template files | None — free-text `body` + string `template` label for logging |
| Provider | Meta Cloud API (if `WHATSAPP_PHONE_NUMBER_ID`) or generic webhook |
| Phone normalize | 10-digit → `91XXXXXXXXXX` |
| Logging | `whats_app_message_logs` table |
| Admin UI | `/admin/cms/whatsapp-logs` |

### Triggers

| Source | Template label |
|--------|----------------|
| Workflow automation | From rule config |
| Communication campaigns | `"campaign"` |
| Bulk attendee action | Admin-initiated |

### Configuration checklist

- [ ] `WHATSAPP_API_URL` set on Vercel
- [ ] `WHATSAPP_API_TOKEN` or `WHATSAPP_ACCESS_TOKEN`
- [ ] `WHATSAPP_PHONE_NUMBER_ID` (Meta Cloud)
- [ ] Meta Business template approval (if using template messages vs text)
- [ ] Test send to ops phone before bulk

### Recommendations

1. Define standard message bodies for: registration confirm, payment confirm, accommodation assign
2. Register Meta-approved templates if switching from free-text to template API
3. Include registration ID and QR link in WhatsApp body for check-in

---

## Cross-Channel Consistency

| Field | Email | WhatsApp | Receipt PDF |
|-------|-------|----------|-------------|
| Event name | SMK 6.0 via EVENT_NAME | Manual in body | ✅ |
| Registration ID | ✅ | Should include | ✅ |
| QR code | ✅ inline + attachment | Link recommended | ✅ |
| Venue/dates | ❌ missing in email | ❌ | Verify in PDF |

---

## Test Plan

- [ ] Submit test registration → confirm email received within 2 min
- [ ] Complete test payment → payment email with QR visible
- [ ] Forward email to mobile → QR scannable
- [ ] Trigger WhatsApp workflow rule → message delivered + logged
- [ ] Check `/admin/cms/email-logs` and `whatsapp-logs` for status
