import type { ContactStatus } from "@prisma/client";
import { prisma } from "@/server/db/prisma";
import { writeAuditLog } from "@/server/services/audit.service";
import { sendContactAcknowledgement, sendAdminAlert, sendContactReplyEmail } from "@/server/services/email.service";
import { ServiceError } from "@/server/lib/errors";

export async function submitContactMessage(input: {
  fullName: string;
  email: string;
  phone?: string;
  subject?: string;
  message: string;
  submittedIp?: string | null;
}) {
  if (!input.fullName.trim() || !input.email.trim() || !input.message.trim()) {
    throw new ServiceError("Name, email, and message are required", 400);
  }

  const row = await prisma.contactMessage.create({
    data: {
      fullName: input.fullName.trim(),
      email: input.email.trim().toLowerCase(),
      phone: input.phone?.trim() ?? null,
      subject: input.subject?.trim() ?? null,
      message: input.message.trim(),
      submittedIp: input.submittedIp ?? null,
    },
  });

  await writeAuditLog({
    action: "system_event",
    entityType: "contact_messages",
    entityId: row.id,
    ipAddress: input.submittedIp ?? null,
    payload: { event: "contact_submitted", email: row.email },
  });

  void sendContactAcknowledgement({ fullName: row.fullName, email: row.email });
  void sendAdminAlert({
    message: `New contact message from ${row.fullName} <${row.email}>: ${row.subject ?? "(no subject)"}`,
  });

  return row;
}

export async function listContactMessages(options: { limit?: number; offset?: number; status?: string }) {
  const { limit = 25, offset = 0, status } = options;
  const where = { deletedAt: null, ...(status ? { status: status as never } : {}) };
  const [items, total] = await Promise.all([
    prisma.contactMessage.findMany({ where, orderBy: { createdAt: "desc" }, take: limit, skip: offset }),
    prisma.contactMessage.count({ where }),
  ]);
  return { items, total, limit, offset };
}

export async function getContactMessage(id: string) {
  const row = await prisma.contactMessage.findFirst({
    where: { id, deletedAt: null },
  });
  if (!row) throw new ServiceError("Contact message not found", 404, "NOT_FOUND");
  return row;
}

export async function updateContactMessage(
  id: string,
  input: {
    status?: ContactStatus;
    adminReply?: string;
    repliedById?: string;
  }
) {
  const existing = await prisma.contactMessage.findFirst({
    where: { id, deletedAt: null },
  });
  if (!existing) throw new ServiceError("Contact message not found", 404, "NOT_FOUND");

  const hasReply = input.adminReply !== undefined && input.adminReply.trim().length > 0;
  const row = await prisma.contactMessage.update({
    where: { id },
    data: {
      ...(input.status !== undefined ? { status: input.status } : {}),
      ...(input.adminReply !== undefined ? { adminReply: input.adminReply.trim() || null } : {}),
      ...(hasReply
        ? {
            repliedAt: new Date(),
            repliedById: input.repliedById ?? null,
            ...(input.status === undefined && existing.status === "new"
              ? { status: "replied" as ContactStatus }
              : {}),
          }
        : {}),
    },
  });

  await writeAuditLog({
    action: "system_event",
    entityType: "contact_messages",
    entityId: row.id,
    actorUserId: input.repliedById,
    payload: { event: "contact_updated", status: row.status },
  });

  if (hasReply && row.email && row.adminReply) {
    void sendContactReplyEmail({
      fullName: row.fullName,
      email: row.email,
      reply: row.adminReply,
    });
  }

  return row;
}
