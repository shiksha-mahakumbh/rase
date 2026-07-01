import { ADMIN_MANAGE_ROLES } from "@/server/lib/admin-rbac";
import { NextRequest } from "next/server";
import { createApiHandler } from "@/server/lib/api-handler";
import { resendDonationReceiptEmail } from "@/server/services/donation.service";
export { runtime, maxDuration } from "@/lib/server/pdf-api-route";

export const POST = createApiHandler(
  async (_request: NextRequest, context: { params: Promise<{ donationId: string }> }) => {
    const { donationId } = await context.params;
    return resendDonationReceiptEmail(donationId);
  },
  { requireAdmin: true, adminRoles: ADMIN_MANAGE_ROLES, rateLimitKey: "admin-donation-resend-receipt", limit: 30 }
);
