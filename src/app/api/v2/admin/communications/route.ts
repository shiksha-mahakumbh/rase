import { NextRequest } from "next/server";
import { createApiHandler, assertBody } from "@/server/lib/api-handler";
import { ServiceError } from "@/server/lib/errors";
import {
  listCampaigns,
  createCampaign,
  sendCampaign,
  getCampaignRecipients,
} from "@/server/services/lifecycle/communication.service";
import type { CommunicationChannel } from "@prisma/client";

export const GET = createApiHandler(
  async (request: NextRequest) => {
    const { searchParams } = new URL(request.url);
    const campaignId = searchParams.get("campaignId");
    if (campaignId) return getCampaignRecipients(campaignId);
    return listCampaigns({
      limit: Number(searchParams.get("limit") ?? 25),
      offset: Number(searchParams.get("offset") ?? 0),
    });
  },
  { requireAdmin: true, rateLimitKey: "admin-communications", limit: 60 }
);

export const POST = createApiHandler(
  async (request: NextRequest) => {
    const body = assertBody<{
      action?: string;
      campaignId?: string;
      name?: string;
      channel?: CommunicationChannel;
      targetFilter?: Record<string, string>;
      subject?: string;
      bodyHtml?: string;
    }>(await request.json());

    if (body.action === "send" && body.campaignId) {
      return sendCampaign(body.campaignId);
    }

    if (!body.name || !body.channel) throw new ServiceError("name and channel required", 400, "INVALID_BODY");
    return createCampaign({
      name: body.name,
      channel: body.channel,
      targetFilter: body.targetFilter ?? {},
      subject: body.subject,
      bodyHtml: body.bodyHtml,
    });
  },
  { requireAdmin: true, rateLimitKey: "admin-communications-create", limit: 20 }
);
