import { NextRequest } from "next/server";
import { createApiHandler } from "@/server/lib/api-handler";
import { listPaymentAuditLogs } from "@/server/services/admin/payments-admin.service";

export const GET = createApiHandler(
  async (request: NextRequest) => {
    const { searchParams } = new URL(request.url);
    return listPaymentAuditLogs({
      limit: Number(searchParams.get("limit") ?? 50),
      offset: Number(searchParams.get("offset") ?? 0),
      registrationId: searchParams.get("registrationId") ?? undefined,
      paymentId: searchParams.get("paymentId") ?? undefined,
      orderId: searchParams.get("orderId") ?? undefined,
    });
  },
  { requireAdmin: true, rateLimitKey: "admin-payment-audit", limit: 60 }
);
