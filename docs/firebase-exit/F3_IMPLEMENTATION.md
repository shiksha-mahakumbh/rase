# F3 — Payment Cutover (Razorpay → Prisma)

**Status:** Complete (implementation only)

## Summary

Razorpay webhooks update `PaymentRecord` and linked `Registration` rows in Postgres via Prisma. Firestore payment handler removed.

## Key files

| File | Role |
|------|------|
| `src/server/services/payment.service.ts` | `processRazorpayWebhookEvent()` |
| `src/app/api/payments/razorpay-webhook/route.ts` | Webhook entry (imports payment.service) |

## Deleted

- `src/lib/firestore/payments.server.ts`

## Data model

Uses existing Prisma models: `PaymentRecord`, `Registration` (no new tables).

## Not run

Production webhook cutover and payment reconciliation — documented in `DATA_MIGRATION_RUNBOOK.md`.
