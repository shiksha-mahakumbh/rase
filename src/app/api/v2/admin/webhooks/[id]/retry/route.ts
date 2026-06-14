import { NextRequest } from "next/server";
import { createApiHandler } from "@/server/lib/api-handler";
import { retryWebhookEvent } from "@/server/services/admin/reconciliation.service";

export const POST = createApiHandler(
  async (_request: NextRequest, context: { params: Promise<{ id: string }> }) => {
    const { id } = await context.params;
    return retryWebhookEvent(id);
  },
  { requireAdmin: true, rateLimitKey: "admin-webhook-retry", limit: 20 }
);
