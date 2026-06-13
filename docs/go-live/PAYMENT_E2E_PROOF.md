# Payment E2E Proof

**Production:** https://www.shikshamahakumbh.com  
**Audit timestamp (UTC):** 2026-06-13T08:28:28Z  
**Paid categories (config):** Delegate Registration, Accommodation, Projects

---

## Result: **PARTIAL FAIL** (create-order only; no completed payment)

---

## Phase executed

### 1. Create order — **PASS**

```http
POST https://www.shikshamahakumbh.com/api/payments/create-order
Body: { "amount": 10000, "currency": "INR", "receipt": "proof_<timestamp>" }

Status: 200
{
  "order_id": "order_T139KjQCD561mz",
  "amount": 10000,
  "currency": "INR",
  "key_id": "rzp_live_Sz5hsyGHWPtgbT"
}
```

| Field | Value |
|-------|-------|
| order_id | `order_T139KjQCD561mz` |
| key_id | `rzp_live_Sz5hsyGHWPtgbT` (**live** Razorpay key) |

### 2. Complete test payment — **NOT EXECUTED**

Production uses **live** Razorpay credentials. Completing checkout would charge real funds. Automated audit **did not** proceed with payment UI or live card entry.

### 3. Webhook → payment_records — **NOT PROVEN**

| Table / check | Count |
|---------------|-------|
| `payment_records` | **0** |
| `webhook_events` | **0** |

### 4. Unsigned webhook rejection — **PASS** (security control)

```http
POST /api/payments/razorpay-webhook (no signature)
Status: 401
Body: { "error": "Invalid signature" }
```

---

## Expected full E2E path (reference)

```
Registration (paid category) → RazorpayCheckout
  → POST /api/payments/create-order
  → User pays in Razorpay modal
  → POST /api/payments/verify-payment (signature check)
  → POST /api/payments/razorpay-webhook (HMAC validated)
  → payment_records row + registration.paymentStatus = Paid
```

Only step 1 was proven in this audit.

---

## Blocker for automated payment proof

| Issue | Detail |
|-------|--------|
| Live Razorpay key on production | Cannot safely auto-complete payment |
| No test-mode keys in probe response | `rzp_live_*` returned |
| No registration linked to order | Order created in isolation |

---

## Recommended manual close-out

1. Use Razorpay **test mode** keys on a staging deployment, **or**  
2. On production: complete one **minimum-amount** live payment for Projects/Delegate with finance approval, then verify:
   - `SELECT * FROM payment_records ORDER BY created_at DESC LIMIT 1`
   - `webhook_events` row with `signature_valid = true`
   - Registration row `payment_status = Paid`

---

## Verdict

| Check | Pass? |
|-------|-------|
| create-order | ✅ |
| Payment completed | ❌ |
| Webhook received & validated | ❌ |
| payment_records row | ❌ |
| Registration linked | ❌ |

**Payment E2E proof: PARTIAL FAIL**
