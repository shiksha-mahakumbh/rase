import { NextRequest } from "next/server";
import { createApiHandler } from "@/server/lib/api-handler";
import { prisma } from "@/server/db/prisma";
import { ServiceError } from "@/server/lib/errors";
import { resendPaymentEmail } from "@/server/services/admin/receipt-admin.service";

export const POST = createApiHandler(
  async (_request: NextRequest, context: { params: Promise<{ id: string }> }) => {
    const { id } = await context.params;
    const log = await prisma.emailLog.findUnique({
      where: { id },
      include: { registration: { select: { registrationId: true } } },
    });
    if (!log) throw new ServiceError("Email log not found", 404);
    if (!log.registration?.registrationId) {
      throw new ServiceError("No registration linked to this email", 400);
    }
    return resendPaymentEmail(log.registration.registrationId);
  },
  { requireAdmin: true, rateLimitKey: "admin-email-resend", limit: 20 }
);
