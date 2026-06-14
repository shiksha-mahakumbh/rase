# Admin Payment Monitoring & Reconciliation (Phase 2)

Production monitoring for Shiksha Mahakumbh — payments, receipts, QR codes, emails, webhooks, and orphan recovery.

## Admin Pages (CMS → Operations)

| Page | Path | Purpose |
|------|------|---------|
| Payment Monitoring | `/admin/cms/payment-monitoring` | Dashboard cards + charts |
| Payments | `/admin/cms/payments` | Full payment list with filters |
| Payment Recovery | `/admin/cms/payment-recovery` | Orphan detection + repair actions |
| Receipts & QR | `/admin/cms/receipts` | Receipt/QR regenerate, download, resend |
| Email Logs | `/admin/cms/email-logs` | Delivery status + resend |
| Webhook Logs | `/admin/cms/webhooks` | Razorpay events + retry |
| Payment Audit | `/admin/cms/payment-audit` | End-to-end audit trail |

All pages require admin login (CMS `AdminGate` + gateway cookie + `x-ops-secret` on v2 APIs).

## Database Changes

Migration: `prisma/migrations/20250615_admin_monitoring/migration.sql`

**registrations** — new columns:
- `receipt_generated_at`, `receipt_sent_at`, `receipt_downloaded_at`
- `qr_generated_at`, `qr_storage_path`, `qr_sent_at`

**webhook_events** — `retry_count`, `last_processed_at`

**AuditAction** enum — extended with payment lifecycle actions

Run: `npx prisma migrate deploy`

## API Routes

| Method | Path | Description |
|--------|------|-------------|
| GET | `/api/v2/admin/payments` | Paginated payment list |
| GET | `/api/v2/admin/payments/analytics` | Monitoring dashboard stats |
| GET/POST | `/api/v2/admin/payment-recovery` | Orphan list / recovery actions |
| GET | `/api/v2/admin/payment-audit` | Payment audit trail |
| GET | `/api/v2/admin/email-logs` | Email log list |
| POST | `/api/v2/admin/email-logs/[id]/resend` | Resend from log |
| GET | `/api/v2/admin/webhooks` | Webhook event list |
| POST | `/api/v2/admin/webhooks/[id]/retry` | Reprocess webhook |
| GET/POST | `/api/v2/admin/receipts/[registrationId]` | Download/regenerate PDF or QR |

Gateway proxy: `/api/admin/gateway/{path}` (existing).

## Recovery Actions (POST payment-recovery)

| Action | Body | Effect |
|--------|------|--------|
| `regenerate-receipt` | `registrationId` | PDF + audit log |
| `regenerate-qr` | `registrationId` | PNG + path + audit log |
| `resend-email` | `registrationId` | Payment email with PDF + QR |
| `send-receipt` | `registrationId` | Regenerate + resend |
| `manual-link` | `registrationId`, `razorpayPaymentId` | Link orphan verified payment |

## Orphan Detection Rules

1. **verified_no_registration** — `razorpay_verified_payments.consumed_at IS NULL`
2. **registration_no_payment** — fee > 0, status Pending_Payment, no payment ID
3. **payment_no_receipt** — Paid but `receipt_generated_at` null
4. **payment_email_failed** — Paid but email delivery failed
5. **registration_no_qr** — Paid but `qr_generated_at` null

## Security

- All v2 routes: `requireAdmin: true` + rate limiting
- Receipt download: admin secret guard + IP rate limit
- Recovery actions write `audit_logs` with actor context
- No public access to monitoring endpoints

## Testing Checklist

- [ ] Run migration on staging/production
- [ ] Login as admin → open Payment Monitoring (cards load)
- [ ] Payments page: filter by date, status, search by SMK ID
- [ ] Payment Recovery: orphan badges match DB state
- [ ] Manual link: verified payment → registration
- [ ] Receipts page: download PDF/QR via gateway
- [ ] Resend email → new row in `email_logs`, status sent/failed
- [ ] Webhook retry on failed event
- [ ] Payment Audit shows order_created → registration_saved chain
- [ ] Non-admin receives 401 on direct v2 API call
