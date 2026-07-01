import { NextRequest } from "next/server";
import { createApiHandler } from "@/server/lib/api-handler";
import { getAdminActorUid } from "@/server/lib/admin-rbac";
import { retryWebhookEvent } from "@/server/services/admin/reconciliation.service";

export const POST = createApiHandler(
  async (request: NextRequest, context: { params: Promise<{ id: string }> }) => {
    const { id } = await context.params;
    return retryWebhookEvent(id, getAdminActorUid(request) ?? undefined);
  },
  {
    requireAdmin: true,
    adminResource: "payments",
    mutationPermission: "payments.read",
    rateLimitKey: "admin-webhook-retry",
    limit: 20,
  }
);
