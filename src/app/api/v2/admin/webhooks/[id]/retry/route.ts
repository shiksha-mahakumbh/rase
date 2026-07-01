import { ADMIN_MANAGE_ROLES } from "@/server/lib/admin-rbac";
import { NextRequest } from "next/server";
import { createApiHandler } from "@/server/lib/api-handler";
import { getAdminActorUid } from "@/server/lib/admin-rbac";
import { retryWebhookEvent } from "@/server/services/admin/reconciliation.service";

export const POST = createApiHandler(
  async (request: NextRequest, context: { params: Promise<{ id: string }> }) => {
    const { id } = await context.params;
    return retryWebhookEvent(id, getAdminActorUid(request) ?? undefined);
  },
  { requireAdmin: true, adminRoles: ADMIN_MANAGE_ROLES, rateLimitKey: "admin-webhook-retry", limit: 20 }
);
