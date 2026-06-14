import { NextRequest } from "next/server";
import { createApiHandler, assertBody } from "@/server/lib/api-handler";
import {
  detectOrphanPayments,
  runRecoveryAction,
} from "@/server/services/admin/reconciliation.service";

export const GET = createApiHandler(
  async () => {
    const items = await detectOrphanPayments();
    const counts = items.reduce(
      (acc, row) => {
        acc[row.issueType] = (acc[row.issueType] ?? 0) + 1;
        acc.total += 1;
        return acc;
      },
      {} as Record<string, number> & { total: number }
    );
    counts.total = items.length;
    return { items, counts };
  },
  { requireAdmin: true, rateLimitKey: "admin-payment-recovery", limit: 60 }
);

export const POST = createApiHandler(
  async (request: NextRequest) => {
    const body = assertBody<{ action?: string; registrationId?: string; paymentId?: string; razorpayPaymentId?: string }>(
      await request.json()
    );
    const action = String(body.action ?? "").trim();
    if (!action) throw new Error("action required");
    return runRecoveryAction(action, body as Record<string, unknown>);
  },
  { requireAdmin: true, rateLimitKey: "admin-payment-recovery-action", limit: 30 }
);
