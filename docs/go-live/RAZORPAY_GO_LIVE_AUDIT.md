# G5 — Razorpay Production Readiness (Code Audit)

**Audit date:** 2026-05-29  
**Scope:** Code review only — **no live webhook or payment E2E tests**  
**Verdict:** ✅ **PASS (source)** | ⚠️ **UNKNOWN (production behavior post-cutover)**

---

## 1. Webhook Endpoint

**Route:** `POST /api/payments/razorpay-webhook`  
**File:** `src/app/api/payments/razorpay-webhook/route.ts`

| Control | Implementation |
|---------|----------------|
| Rate limit | 100 req/min/IP |
| Secret required (prod) | `RAZORPAY_WEBHOOK_SECRET` — returns **503** if missing in production |
| Signature verify | HMAC-SHA256 on raw body vs `x-razorpay-signature` |
| Invalid signature | **401** |
| Handler | `processRazorpayWebhookEvent(event)` |

**Production URL (expected after deploy):**  
`https://www.shikshamahakumbh.com/api/payments/razorpay-webhook`

⚠️ Razorpay dashboard webhook registration — **UNKNOWN** (not verified in this audit).

---

## 2. Webhook Secret Configuration

| Environment | Variable | Vercel status |
|-------------|----------|---------------|
| Production | `RAZORPAY_WEBHOOK_SECRET` | ✅ Present (encrypted) |
| Development | `RAZORPAY_WEBHOOK_SECRET` | ✅ Present |
| Preview | `RAZORPAY_WEBHOOK_SECRET` | ❌ Missing |

Code path rejects unsigned/invalid webhooks in production. Dev mode skips verification when secret absent.

---

## 3. Payment Success Flow (Code)

**Service:** `src/server/services/payment.service.ts`

Flow for `payment.captured` / order paid events:

1. Parse Razorpay payload
2. Resolve registration by order ID / notes
3. Map status → `Paid` on `Registration` and `PaymentRecord`
4. Idempotent duplicate detection via `razorpayPaymentId`
5. Write audit log + optional `webhookEvent` record

Key functions:
- `processRazorpayWebhookEvent()`
- `markPaymentCompleted()`
- `recordWebhookEvent()`

✅ Prisma persistence path is implemented.

---

## 4. Payment Failure Flow (Code)

For failed / authorized-but-not-captured events:

- Updates `PaymentRecord.status` → `Failed` or `Pending_Payment` as appropriate
- Updates `Registration.paymentStatus` consistently
- Returns **202** with `{ processed: false }` for non-fatal handler misses (logged)

✅ Failure paths do not silently succeed.

---

## 5. Prisma Payment Persistence

**Models used:** `PaymentRecord`, `Registration`, `WebhookEvent`

| Operation | Verified in code |
|-----------|------------------|
| Create payment record | ✅ `createPaymentRecord()` |
| Webhook idempotency | ✅ `razorpayEventId` unique check |
| Duplicate payment ID | ✅ `isDuplicate` flag |
| Registration status sync | ✅ `registration.update({ paymentStatus })` |

**Database state:** 0 payment records in Supabase (G1) — persistence **untested against live data**.

---

## 6. Client-Side / Order Creation

Production env has:
- `RAZORPAY_KEY_ID`
- `RAZORPAY_KEY_SECRET`
- `NEXT_PUBLIC_RAZORPAY_KEY_ID`

Order creation routes exist under registration payment flow (not re-audited line-by-line in G5).

---

## 7. G5 Gaps (Not Code)

| Gap | Severity |
|-----|----------|
| No live webhook delivery test | P0 before go-live |
| Supabase DB empty — webhook updates have no rows to match | P0 |
| Preview env missing Razorpay secrets | P1 |
| Razorpay dashboard webhook URL alignment | UNKNOWN |

---

## 8. G5 Summary

| Area | Status |
|------|--------|
| Webhook route + HMAC | ✅ Code complete |
| Success/failure handling | ✅ Code complete |
| Prisma persistence | ✅ Code complete |
| Live Razorpay integration | ⚠️ UNKNOWN |
| Data to persist against | ❌ Empty DB |

---

*Code-only audit. No payments executed. No deployment.*
