# Razorpay Audit

**Date:** June 2026

---

## Webhook route

| Item | Value |
|------|-------|
| Path | `/api/payments/razorpay-webhook` |
| File | `src/app/api/payments/razorpay-webhook/route.ts` |
| Method | `POST` |
| Rate limit | 100 req/min per IP |

---

## Signature verification

| Check | Status |
|-------|--------|
| Reads `RAZORPAY_WEBHOOK_SECRET` | ✅ |
| HMAC SHA-256 on raw body | ✅ |
| Compares `x-razorpay-signature` header | ✅ |
| Returns 401 on invalid signature | ✅ |
| Returns 503 if secret missing (production) | ✅ |
| Dev skip mode without secret | ⚠️ Returns `{ ok: true, mode: "dev-skip" }` |

**Secret configured:** Local ✅ | Vercel Production ✅ | Vercel Preview ❌

---

## Event processing

**Handler:** `processRazorpayWebhookEvent()` in `src/lib/firestore/payments.server.ts`

| Behavior | Detail |
|----------|--------|
| Event name filtering | **None** — all events processed identically |
| Registration lookup | By `razorpayOrderId` or payment `notes` |
| Status mapping | `captured`/`paid` → `Paid`; `failed` → `Failed` |
| Duplicate protection | Skips if already `Paid` with same `razorpayPaymentId` |
| Storage | Updates Firestore `registrations`, type collections, `paymentRecords` |
| Audit | Writes `audit_logs` collection |

### Event support matrix

| Razorpay event | Explicit handler | Effective behavior |
|----------------|------------------|-------------------|
| `payment.captured` | No filter | ✅ Processes if payload has payment entity |
| `order.paid` | No filter | ✅ Processes if payload has order entity |
| `payment.failed` | No filter | ✅ Sets `Failed` status |
| `payment.authorized` | No filter | ⚠️ May set `Pending Payment` |
| `refund.created` | **Not implemented** | ⚠️ Would attempt generic update |
| `refund.processed` | **Not implemented** | ⚠️ Same |

---

## Webhook URL configuration

### Current state

| Source | URL |
|--------|-----|
| User Razorpay dashboard | `https://shikshamahakumbh.com/api/payments/razorpay-webhook` |
| `NEXT_PUBLIC_SITE_URL` | `https://shikshamahakumbh.org` |

### **Mismatch:** webhook uses `.com`, site URL uses `.org`

### Correct URL (recommended)

```
https://shikshamahakumbh.com/api/payments/razorpay-webhook
```

Use whichever domain is the **live production host** on Vercel. Webhook domain must match deployed app.

---

## Required Razorpay webhook events

| Event | Required? | Reason |
|-------|-----------|--------|
| `payment.captured` | **YES** | Primary payment confirmation |
| `payment.failed` | **YES** | Mark registration payment failed |
| `order.paid` | **RECOMMENDED** | Backup if using Orders API |
| `payment.authorized` | Optional | Only if capturing later |
| `refund.*` | Optional | No refund handler in code today |
| `subscription.*` | **REMOVE** | Not used |
| `invoice.*` | **REMOVE** | Not used |

---

## Payment flow (client → server)

1. Registration form creates Razorpay order (Firebase path)
2. Client checkout with `NEXT_PUBLIC_RAZORPAY_KEY_ID`
3. Webhook confirms payment server-side
4. Firestore `paymentStatus` updated to `Paid`

**Client-side success alone does NOT confirm payment** — webhook is required.

---

## Answers

| Question | Answer |
|----------|--------|
| Is webhook correctly configured? | **PARTIAL** — code ✅, secret ✅, domain mismatch ⚠️ |
| What URL should Razorpay use? | `https://shikshamahakumbh.com/api/payments/razorpay-webhook` (if `.com` is canonical) |
| Which events are required? | `payment.captured`, `payment.failed`, `order.paid` |
| Which events should be removed? | All subscription/invoice events; refund events until handler exists |

---

## Pre-launch checklist

- [ ] Confirm webhook URL domain matches Vercel production domain
- [ ] Test webhook with Razorpay test mode → expect 200 + `processed: true`
- [ ] Verify `RAZORPAY_WEBHOOK_SECRET` on Vercel Production
- [ ] Add secret to Preview if testing on preview URLs
- [ ] Confirm live keys (`rzp_live_*`) intentional for production
