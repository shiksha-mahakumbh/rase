import type { CommunicationChannel, Prisma } from "@prisma/client";
import { prisma } from "@/server/db/prisma";
import { writeAuditLog } from "@/server/services/audit.service";
import { ServiceError } from "@/server/lib/errors";
import { queueEmail } from "@/server/services/email.service";
import { listAttendees } from "@/server/services/lifecycle/attendee.service";

export async function listCampaigns(options: { limit?: number; offset?: number }) {
  const { limit = 25, offset = 0 } = options;
  const [items, total] = await Promise.all([
    prisma.communicationCampaign.findMany({
      orderBy: { createdAt: "desc" },
      take: limit,
      skip: offset,
    }),
    prisma.communicationCampaign.count(),
  ]);
  return { items, total, limit, offset };
}

async function resolveRecipients(targetFilter: Record<string, string>) {
  const { items } = await listAttendees({
    category: targetFilter.category,
    state: targetFilter.state,
    checkInStatus: targetFilter.checkInStatus,
    paymentStatus: targetFilter.paymentStatus,
    limit: 500,
    offset: 0,
  });

  let filtered = items;
  if (targetFilter.audience === "speakers") {
    filtered = items.filter((i) => i.category.toLowerCase().includes("award") || i.category.toLowerCase().includes("speaker"));
  } else if (targetFilter.audience === "volunteers") {
    filtered = items.filter((i) => i.category.toLowerCase().includes("volunteer"));
  } else if (targetFilter.audience === "delegates") {
    filtered = items.filter((i) => i.category.toLowerCase().includes("delegate") || i.category.toLowerCase().includes("conclave"));
  }

  return filtered;
}

export async function createCampaign(input: {
  name: string;
  channel: CommunicationChannel;
  targetFilter: Record<string, string>;
  subject?: string;
  bodyHtml?: string;
  createdByUserId?: string;
}) {
  return prisma.communicationCampaign.create({
    data: {
      name: input.name.trim(),
      channel: input.channel,
      targetFilter: input.targetFilter as Prisma.InputJsonValue,
      subject: input.subject,
      bodyHtml: input.bodyHtml,
      createdByUserId: input.createdByUserId,
      status: "draft",
    },
  });
}

export async function sendCampaign(campaignId: string, actorUserId?: string) {
  const campaign = await prisma.communicationCampaign.findUnique({
    where: { id: campaignId },
  });
  if (!campaign) throw new ServiceError("Campaign not found", 404);
  if (campaign.status === "sending") {
    throw new ServiceError("Campaign already sending", 409);
  }

  const targetFilter = campaign.targetFilter as Record<string, string>;
  const recipients = await resolveRecipients(targetFilter);

  await prisma.communicationCampaign.update({
    where: { id: campaignId },
    data: { status: "sending" },
  });

  let delivered = 0;
  let failed = 0;

  for (const r of recipients) {
    const reg = await prisma.registration.findFirst({
      where: { registrationId: r.registrationId, deletedAt: null },
    });

    try {
      if (campaign.channel === "email") {
        await queueEmail({
          toEmail: r.email,
          subject: campaign.subject ?? campaign.name,
          html: campaign.bodyHtml ?? `<p>Dear ${r.name},</p><p>${campaign.name}</p>`,
          template: "registration_confirmation",
          publicRegistrationId: r.registrationId,
          registrationUuid: reg?.id,
        });
        delivered++;
        await prisma.communicationRecipient.create({
          data: {
            campaignId,
            registrationId: reg?.id,
            email: r.email,
            phone: r.mobile,
            status: "delivered",
            sentAt: new Date(),
          },
        });
      } else if (campaign.channel === "whatsapp") {
        const { sendWhatsAppMessage } = await import("@/server/services/ops/whatsapp.service");
        const wa = await sendWhatsAppMessage({
          phone: r.mobile,
          template: "campaign",
          body: (campaign.bodyHtml ?? campaign.name).replace(/<[^>]+>/g, ""),
          registrationId: reg?.id,
        });
        if (wa.ok) delivered++;
        else failed++;
        await prisma.communicationRecipient.create({
          data: {
            campaignId,
            registrationId: reg?.id,
            email: r.email,
            phone: r.mobile,
            status: wa.ok ? "delivered" : "failed",
            sentAt: new Date(),
            errorMessage: wa.error,
          },
        });
      } else {
        // SMS — log as queued until provider integrated
        await prisma.communicationRecipient.create({
          data: {
            campaignId,
            registrationId: reg?.id,
            email: r.email,
            phone: r.mobile,
            status: "queued",
            sentAt: new Date(),
          },
        });
        delivered++;
      }
    } catch (e) {
      failed++;
      await prisma.communicationRecipient.create({
        data: {
          campaignId,
          registrationId: reg?.id,
          email: r.email,
          phone: r.mobile,
          status: "failed",
          errorMessage: e instanceof Error ? e.message : "Send failed",
        },
      });
    }
  }

  await prisma.communicationCampaign.update({
    where: { id: campaignId },
    data: {
      status: failed > 0 && delivered === 0 ? "failed" : "completed",
      deliveredCount: delivered,
      failedCount: failed,
      sentAt: new Date(),
    },
  });

  await writeAuditLog({
    action: "communication_campaign_sent",
    actorUserId,
    payload: {
      campaign_id: campaignId,
      delivered,
      failed,
      channel: campaign.channel,
    },
  });

  return { delivered, failed, total: recipients.length };
}

export async function getCampaignRecipients(campaignId: string) {
  return prisma.communicationRecipient.findMany({
    where: { campaignId },
    orderBy: { createdAt: "desc" },
    take: 100,
  });
}
