import { NextRequest } from "next/server";
import { createApiHandler, assertBody } from "@/server/lib/api-handler";
import { getAttendeeIdsForBulk } from "@/server/services/lifecycle/attendee.service";
import {
  bulkGenerateBadges,
  bulkGenerateCertificates,
} from "@/server/services/lifecycle/badge-certificate.service";
import { resendPaymentEmail } from "@/server/services/admin/receipt-admin.service";
import { createCampaign, sendCampaign } from "@/server/services/lifecycle/communication.service";
import { getAdminActorUid } from "@/server/lib/admin-rbac";
import { ServiceError } from "@/server/lib/errors";
export { runtime, maxDuration } from "@/lib/server/pdf-api-route";

export const POST = createApiHandler(
  async (request: NextRequest) => {
    const actorUserId = getAdminActorUid(request) ?? undefined;
    const body = assertBody<{
      action?: string;
      registrationIds?: string[];
      filter?: Record<string, string>;
      campaign?: { name: string; subject?: string; bodyHtml?: string };
    }>(await request.json());

    const ids =
      body.registrationIds?.length
        ? body.registrationIds
        : await getAttendeeIdsForBulk(body.filter ?? {});

    switch (body.action) {
      case "export-csv":
        return { registrationIds: ids, count: ids.length };
      case "generate-badges":
        return bulkGenerateBadges(ids);
      case "generate-certificates":
        return bulkGenerateCertificates(ids);
      case "send-email": {
        const results = [];
        for (const id of ids.slice(0, 50)) {
          try {
            await resendPaymentEmail(id, actorUserId);
            results.push({ registrationId: id, ok: true });
          } catch (e) {
            results.push({
              registrationId: id,
              ok: false,
              error: e instanceof Error ? e.message : "Failed",
            });
          }
        }
        return results;
      }
      case "send-whatsapp":
        return ids.map((id) => ({
          registrationId: id,
          ok: true,
          note: "WhatsApp links available per attendee mobile in admin UI",
        }));
      case "email-campaign": {
        const campaign = await createCampaign({
          name: body.campaign?.name ?? "Attendee Campaign",
          channel: "email",
          targetFilter: body.filter ?? {},
          subject: body.campaign?.subject,
          bodyHtml: body.campaign?.bodyHtml,
        });
        return sendCampaign(campaign.id);
      }
      default:
        throw new ServiceError("Unknown bulk action", 400, "INVALID_ACTION");
    }
  },
  { requireAdmin: true, rateLimitKey: "admin-attendees-bulk", limit: 20 }
);
