import { ADMIN_MANAGE_ROLES } from "@/server/lib/admin-rbac";
import { NextRequest } from "next/server";
import { createApiHandler } from "@/server/lib/api-handler";
import { getAdminActorUid } from "@/server/lib/admin-rbac";
import { prisma } from "@/server/db/prisma";
import { ServiceError } from "@/server/lib/errors";
import { resendPaymentEmail } from "@/server/services/admin/receipt-admin.service";
export { runtime, maxDuration } from "@/lib/server/pdf-api-route";

export const POST = createApiHandler(
  async (request: NextRequest, context: { params: Promise<{ id: string }> }) => {
    const { id } = await context.params;
    const log = await prisma.emailLog.findUnique({
      where: { id },
      include: { registration: { select: { registrationId: true } } },
    });
    if (!log) throw new ServiceError("Email log not found", 404);
    if (!log.registration?.registrationId) {
      throw new ServiceError("No registration linked to this email", 400);
    }
    return resendPaymentEmail(log.registration.registrationId, getAdminActorUid(request) ?? undefined);
  },
  { requireAdmin: true, adminRoles: ADMIN_MANAGE_ROLES, rateLimitKey: "admin-email-resend", limit: 20 }
);
