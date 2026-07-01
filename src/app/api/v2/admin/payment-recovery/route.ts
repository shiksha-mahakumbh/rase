import { NextRequest } from "next/server";
import { createApiHandler, assertBody } from "@/server/lib/api-handler";
import {
  detectOrphanPayments,
  runRecoveryAction,
} from "@/server/services/admin/reconciliation.service";
import { getAdminActorUid } from "@/server/lib/admin-rbac";
import { ServiceError } from "@/server/lib/errors";

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
  { requireAdmin: true, adminResource: "payments", rateLimitKey: "admin-payment-recovery",
    limit: 60,
  }
);

export const POST = createApiHandler(
  async (request: NextRequest) => {
    const body = assertBody<{ action?: string; registrationId?: string; paymentId?: string; razorpayPaymentId?: string }>(
      await request.json()
    );
    const action = String(body.action ?? "").trim();
    if (!action) throw new ServiceError("action required", 400, "INVALID_ACTION");
    return runRecoveryAction(action, body as Record<string, unknown>, getAdminActorUid(request) ?? undefined);
  },
  { requireAdmin: true, adminResource: "payments", mutationPermission: "payments.read", rateLimitKey: "admin-payment-recovery-action", limit: 30 }
);
