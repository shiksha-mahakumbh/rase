import type { WhatsAppMessageStatus } from "@prisma/client";
import { prisma } from "@/server/db/prisma";
import { writeAuditLog } from "@/server/services/audit.service";

type SendWhatsAppInput = {
  phone: string;
  template: string;
  body: string;
  registrationId?: string;
};

function normalizePhone(phone: string) {
  const digits = phone.replace(/\D/g, "");
  if (digits.length === 10) return `91${digits}`;
  return digits;
}

function isWhatsAppConfigured() {
  return Boolean(
    process.env.WHATSAPP_API_URL?.trim() &&
      (process.env.WHATSAPP_API_TOKEN?.trim() || process.env.WHATSAPP_ACCESS_TOKEN?.trim())
  );
}

async function callWhatsAppProvider(phone: string, body: string, template: string) {
  const url = process.env.WHATSAPP_API_URL!.trim();
  const token =
    process.env.WHATSAPP_API_TOKEN?.trim() ??
    process.env.WHATSAPP_ACCESS_TOKEN?.trim() ??
    "";
  const phoneNumberId = process.env.WHATSAPP_PHONE_NUMBER_ID?.trim();

  const payload = phoneNumberId
    ? {
        messaging_product: "whatsapp",
        to: normalizePhone(phone),
        type: "text",
        text: { body },
      }
    : { phone: normalizePhone(phone), message: body, template };

  const endpoint = phoneNumberId
    ? `${url.replace(/\/$/, "")}/${phoneNumberId}/messages`
    : url;

  const res = await fetch(endpoint, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  const data = (await res.json().catch(() => ({}))) as Record<string, unknown>;
  if (!res.ok) {
    const errMsg =
      typeof data.error === "object" && data.error !== null && "message" in data.error
        ? String((data.error as { message: unknown }).message)
        : String(data.error ?? data.message ?? `WhatsApp API ${res.status}`);
    throw new Error(errMsg);
  }

  const messages = data.messages as Array<{ id?: string }> | undefined;
  return String(messages?.[0]?.id ?? data.id ?? data.messageId ?? "");
}

export async function sendWhatsAppMessage(input: SendWhatsAppInput) {
  const phone = normalizePhone(input.phone);
  if (!phone) {
    return { ok: false, status: "skipped" as WhatsAppMessageStatus, error: "Invalid phone" };
  }

  const log = await prisma.whatsAppMessageLog.create({
    data: {
      registrationId: input.registrationId,
      phone,
      template: input.template,
      body: input.body,
      status: "queued",
    },
  });

  if (!isWhatsAppConfigured()) {
    await prisma.whatsAppMessageLog.update({
      where: { id: log.id },
      data: { status: "skipped", errorMessage: "WhatsApp provider not configured" },
    });
    return { ok: false, status: "skipped" as WhatsAppMessageStatus, logId: log.id };
  }

  try {
    const providerMessageId = await callWhatsAppProvider(phone, input.body, input.template);
    await prisma.whatsAppMessageLog.update({
      where: { id: log.id },
      data: {
        status: "sent",
        providerMessageId: providerMessageId || null,
        sentAt: new Date(),
      },
    });
    await writeAuditLog({
      action: "whatsapp_sent",
      registrationId: input.registrationId,
      payload: { template: input.template, phone, logId: log.id },
    });
    return { ok: true, status: "sent" as WhatsAppMessageStatus, logId: log.id, providerMessageId };
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Send failed";
    await prisma.whatsAppMessageLog.update({
      where: { id: log.id },
      data: { status: "failed", errorMessage: msg },
    });
    await writeAuditLog({
      action: "whatsapp_failed",
      registrationId: input.registrationId,
      payload: { template: input.template, phone, error: msg },
    });
    return { ok: false, status: "failed" as WhatsAppMessageStatus, logId: log.id, error: msg };
  }
}

export async function listWhatsAppLogs(options: { limit?: number; offset?: number; status?: string }) {
  const { limit = 30, offset = 0, status } = options;
  const where = status ? { status: status as WhatsAppMessageStatus } : {};
  const [items, total] = await Promise.all([
    prisma.whatsAppMessageLog.findMany({
      where,
      orderBy: { createdAt: "desc" },
      take: limit,
      skip: offset,
      include: {
        registration: { select: { registrationId: true, fullName: true } },
      },
    }),
    prisma.whatsAppMessageLog.count({ where }),
  ]);
  return { items, total, limit, offset };
}
