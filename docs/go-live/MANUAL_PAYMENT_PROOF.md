# Manual Razorpay Payment Proof — Production

**Production URL:** https://www.shikshamahakumbh.com  
**Audit window (UTC):** 2026-06-13T08:35:49Z – 2026-06-13T08:36:17Z  
**Razorpay mode:** **Live** (`rzp_live_Sz5hsyGHWPtgbT`)

---

## Verdict: **PARTIAL FAIL**

`create-order` succeeds against live Razorpay. No completed payment, webhook execution, or persistence rows were produced in this verification run (real charge not authorized).

---

## Phase 3 Checklist

| Check | Expected | Observed | Result |
|-------|----------|----------|--------|
| `create-order` succeeds | HTTP 200 + `order_id` | HTTP **200** | **PASS** |
| Payment succeeds | Razorpay success screen + `payment_id` | Not performed | **FAIL** |
| Webhook executes | Signed POST accepted | Not triggered | **FAIL** |
| Signature validation | Valid sig → 200 | Unsigned probe → **401** | **PASS** (reject path) |

---

## create-order Evidence

**Timestamp:** 2026-06-13T08:35:49Z (approx.)

```
POST https://www.shikshamahakumbh.com/api/payments/create-order
Status: 200
```

**Request body (probe):**

```json
{
  "registrationType": "Delegate Registration",
  "amount": 500,
  "currency": "INR",
  "participantName": "Manual Proof Auditor",
  "participantEmail": "payment-probe-<timestamp>@audit.shikshamahakumbh.test",
  "participantPhone": "9876501234"
}
```

**Response:**

```json
{
  "order_id": "order_T13GdyUoF1g2pq",
  "amount": 500,
  "currency": "INR",
  "key_id": "rzp_live_Sz5hsyGHWPtgbT"
}
```

Full capture: `docs/go-live/_manual-proof-artifacts/live-probes.json`

---

## Payment Completion (not performed)

| Artifact | Status |
|----------|--------|
| Razorpay checkout success screen | **Not captured** |
| `payment_id` | **None** |
| Webhook HAR / server log | **None** |

**Reason:** Production uses a **live** Razorpay key. Completing checkout would charge real funds (₹500+ depending on category). This run stopped after order creation per safe audit practice.

### Paid categories available on site

- Delegate Registration
- Accommodation
- Projects

---

## Webhook Security Probe (unsigned)

**Timestamp:** 2026-06-13T08:35:49Z

```
POST https://www.shikshamahakumbh.com/api/payments/razorpay-webhook
Body: {}
Status: 401
Response: { "error": "Invalid signature" }
```

Unsigned/forged webhooks are correctly rejected.

---

## Database Verification

**Checked at:** 2026-06-13T08:35:47.741Z

### `payment_records`

| Metric | Value |
|--------|-------|
| Total rows | **0** |
| Row for `order_T13GdyUoF1g2pq` | **None** |

### `webhook_events`

| Metric | Value |
|--------|-------|
| Total rows | **0** |

### `registrations` (payment fields)

| `registrationId` | `paymentStatus` | `razorpayOrderId` | `razorpayPaymentId` |
|------------------|-----------------|-------------------|---------------------|
| `SMK2026-000001` | `Not_Required` | `null` | `null` |

No registration references a completed payment.

---

## How to Complete This Phase Manually

1. Navigate to https://www.shikshamahakumbh.com/registration
2. Select a **paid** category (e.g. Delegate Registration)
3. Complete the form and reCAPTCHA in a normal browser
4. Proceed through Razorpay checkout with an **authorized test/live card**
5. Capture:
   - `order_id` from Network tab (`create-order`)
   - `payment_id` from Razorpay success callback / Network
   - Success screen screenshot
6. Verify Supabase within 2 minutes:
   - `SELECT * FROM payment_records WHERE razorpay_order_id = '<order_id>';`
   - `SELECT * FROM webhook_events ORDER BY created_at DESC LIMIT 5;`
   - `SELECT payment_status, razorpay_order_id, razorpay_payment_id FROM registrations WHERE registration_id = '<id>';`

---

## Artifacts

- `docs/go-live/_manual-proof-artifacts/live-probes.json`
