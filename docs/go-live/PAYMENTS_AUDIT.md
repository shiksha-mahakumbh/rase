# G5 — Payments Audit

**Audit date:** 2026-06-12  
**Stack:** Razorpay → `/api/payments/razorpay-webhook` → Prisma

---

## Webhook endpoint

| Item | Value |
|------|-------|
| Route | `POST /api/payments/razorpay-webhook` |
| Handler | `src/app/api/payments/razorpay-webhook/route.ts` |
| Service | `processRazorpayWebhookEvent()` in `payment.service.ts` |
| Signature | HMAC SHA256 `x-razorpay-signature` vs `RAZORPAY_WEBHOOK_SECRET` |
| Rate limit | 100 req/min/IP |
| Dev without secret | Returns `{ ok: true, mode: "dev-skip" }` |
| Production without secret | HTTP 503 |

**Code quality:** ✅ Production-safe signature verification.

---

## Configuration

| Variable | Local env | Vercel Production |
|----------|-----------|-------------------|
| `RAZORPAY_KEY_ID` | ✅ | ✅ |
| `RAZORPAY_KEY_SECRET` | ✅ | ✅ |
| `NEXT_PUBLIC_RAZORPAY_KEY_ID` | ✅ | ✅ |
| `RAZORPAY_WEBHOOK_SECRET` | ✅ | ✅ |

Prior audit noted Razorpay dashboard webhook URL on `shikshamahakumbh.com` — **must match deployed host** after cutover.

---

## Payment processing flow

1. Match registration by `razorpayOrderId` on `Registration` or `PaymentRecord`
2. Fallback: `notes.registrationId` in Razorpay order/payment entity
3. Update `Registration.paymentStatus`, `razorpayPaymentId`, `razorpayOrderId`
4. Upsert `PaymentRecord` with amount, status, metadata
5. Idempotent skip when already `Paid` with same payment ID

---

## Database state

| Table | Rows | Notes |
|-------|------|-------|
| `payment_records` | **0** | No migrated or live payment history |
| `registrations` with Razorpay fields | **0** | Empty DB |

**Post-migration requirement:** Import or reconcile historical payments before disabling Firebase payment handler.

---

## Registration linkage gaps

| Scenario | Handled? |
|----------|----------|
| Order created with `notes.registrationId` | ✅ |
| Order ID stored on registration at checkout | ✅ (if checkout flow sets it) |
| Legacy Firebase-only payments | ❌ Not in Supabase |
| Webhook arrives before registration row | Returns 202 / not found |

**Not audited live:** End-to-end checkout creating Razorpay order with correct notes on production URL.

---

## Firebase exit impact

- `src/lib/firestore/payments.server.ts` **deleted**
- Old production deploy may still use Firebase webhook path — **stale deploy risk**

After go-live deploy, Razorpay dashboard must point to:

```text
https://www.shikshamahakumbh.com/api/payments/razorpay-webhook
```

---

## Payments score

| Dimension | Score /100 |
|-----------|------------|
| Webhook code | 88 |
| Secret management | 80 |
| DB integration | 85 (code) / **0** (data) |
| E2E verified | **0** |
| Dashboard URL alignment | ⚠️ Unverified |

**G5 verdict:** **CONDITIONAL** — implementation ready; no production E2E; empty payment tables; webhook URL must be reconfirmed after deploy.
