# Backup & Recovery Guide — SMK 6.0

**Date:** 2026-05-29  
**Platform:** Supabase (PostgreSQL) + Supabase Storage + Vercel  
**Production:** https://www.shikshamahakumbh.com

---

## 1. Database Backup

### Supabase automated backups

| Tier | Frequency | Retention |
|------|-----------|-----------|
| Pro plan | Daily | 7 days (configurable) |
| Point-in-time | If enabled | Per Supabase project settings |

**Verify:** Supabase Dashboard → Project Settings → Database → Backups

### Manual backup (operator)

```bash
# Requires pg_dump and DIRECT_URL (non-pooled)
pg_dump "$DIRECT_URL" --format=custom --file=smk-backup-$(date +%Y%m%d).dump
```

**Pre-event recommendation:** Full dump before 9 Oct 2026 + daily during event week.

### Critical tables

| Table | Purpose |
|-------|---------|
| `registrations` | All participant data |
| `razorpay_verified_payments` | Payment proofs |
| `email_logs` | Email delivery audit |
| `whats_app_message_logs` | WhatsApp audit |
| `visitor_sessions` | Analytics |
| CMS tables | Pages, events, speakers, etc. |

---

## 2. Database Restore

### From Supabase dashboard

1. Project → Database → Backups → Restore to new project or point-in-time
2. Update Vercel `DATABASE_URL` / `DIRECT_URL` if restoring to new instance
3. Run `npx prisma migrate deploy` to ensure schema match

### From manual dump

```bash
pg_restore --clean --if-exists -d "$DIRECT_URL" smk-backup-YYYYMMDD.dump
```

**Warning:** `--clean` drops existing objects. Use staging first.

### Post-restore verification

```sql
SELECT count(*) FROM registrations;
SELECT max(registration_id) FROM registrations;
SELECT count(*) FROM email_logs WHERE status = 'sent';
```

---

## 3. Storage Backup

**Buckets:** Registration uploads, CMS media (Supabase Storage)

### Export approach

- Supabase Dashboard → Storage → bucket → download critical folders
- Or use Supabase CLI / API bulk download before event

### Restore

Re-upload to same bucket paths; signed URLs regenerate automatically.

**RLS policies:** Documented in `supabase/policies/storage-production.sql`

---

## 4. Payment Recovery

### Orphan / missed webhook

| Tool | Path |
|------|------|
| Admin reconciliation | `/admin` → payment monitoring / reconciliation CMS |
| Service | `src/server/services/admin/reconciliation.service.ts` |
| Manual retry | `retryWebhookEvent()` |

### Steps

1. Identify registration with `paymentStatus = pending` but Razorpay shows captured
2. Admin → find payment in Razorpay dashboard → note `payment_id`, `order_id`
3. Use admin reconciliation to link or manually update via ops API
4. Resend payment confirmation email (see §6)

### Razorpay dashboard

- Live: https://dashboard.razorpay.com
- Export settlements daily during event

---

## 5. Email Recovery

### Failed sends

1. Check `/admin/cms/email-logs` for `status = failed`
2. Review error message in log row
3. Resend via:
   - `src/server/services/admin/receipt-admin.service.ts` → `sendPaymentConfirmation`
   - Admin registration detail page resend action (if available)
   - Direct API: `POST /api/registration/send-email` with reg credentials

### SMTP outage

- Failover: Configure backup SMTP in env (Brevo primary, generic fallback)
- Queue: Failed emails remain in `email_logs` with retry count

---

## 6. QR Regeneration

**Service:** `src/server/services/admin/receipt-admin.service.ts`

```typescript
regenerateQr(registrationId)   // New QR buffer
regenerateReceipt(registrationId)  // Full PDF with QR
```

**Admin API:** `GET /api/v2/admin/receipts/[registrationId]` (ops secret)

**Participant self-service:** `GET /api/participant/download?type=receipt&registrationId=...&email=...`

---

## 7. Receipt Regeneration

Same as QR — `generateReceiptPdfBuffer()` in `receipt.service.ts`.

| Action | Who | Method |
|--------|-----|--------|
| Admin download | Ops team | v2 admin receipts API |
| Participant download | Registrant | Participant download API |
| Email resend | Admin | receipt-admin service |

**Audit:** All regenerations should log to audit service where wired.

---

## 8. Certificate / Badge Recovery

| Document | Service | Admin API |
|----------|---------|-----------|
| Badge | `badge-certificate.service.ts` | `/api/v2/admin/badges/[id]` |
| Certificate | Same | `/api/v2/admin/certificates/[id]` |

Public verification: `/api/certificate/verify/[code]`

---

## 9. Application Rollback (Vercel)

1. Vercel Dashboard → Deployments → select last known good deploy
2. Promote to Production
3. Note rollback deploy ID in incident log

**Documented rollback ID (prior):** `dpl_4LbmLW5RKASduH6dWXoHnrFuNLtt` — verify current before event

---

## 10. Incident Response Contacts

| Role | Responsibility |
|------|----------------|
| Platform lead | Vercel deploy, env vars |
| Database admin | Supabase backup/restore |
| Finance ops | Razorpay reconciliation |
| Comms lead | Email/WhatsApp resend |

---

## Pre-Event Backup Checklist

- [ ] Confirm Supabase daily backups enabled
- [ ] Manual pg_dump 48h before event
- [ ] Export Razorpay settlement report baseline
- [ ] Screenshot Vercel env var list (names only, not values)
- [ ] Document current production deploy ID
- [ ] Test restore on staging project (quarterly)
