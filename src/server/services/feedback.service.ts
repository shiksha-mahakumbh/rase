import type { FeedbackStatus } from "@prisma/client";
import { prisma } from "@/server/db/prisma";
import { writeAuditLog } from "@/server/services/audit.service";
import { sendFeedbackAcknowledgement } from "@/server/services/email.service";
import { ServiceError } from "@/server/lib/errors";

export async function submitFeedback(input: {
  fullName?: string;
  email?: string;
  rating?: number;
  category?: string;
  message: string;
  submittedIp?: string | null;
}) {
  if (!input.message.trim()) {
    throw new ServiceError("Feedback message is required", 400);
  }

  const row = await prisma.feedback.create({
    data: {
      fullName: input.fullName?.trim() ?? null,
      email: input.email?.trim().toLowerCase() ?? null,
      rating: input.rating ?? null,
      category: input.category?.trim() ?? null,
      message: input.message.trim(),
      submittedIp: input.submittedIp ?? null,
    },
  });

  await writeAuditLog({
    action: "system_event",
    entityType: "feedback",
    entityId: row.id,
    ipAddress: input.submittedIp ?? null,
    payload: { event: "feedback_submitted", rating: row.rating },
  });

  if (row.email) void sendFeedbackAcknowledgement({ email: row.email });

  return row;
}

export async function listFeedback(options: { limit?: number; offset?: number; status?: string }) {
  const { limit = 25, offset = 0, status } = options;
  const where = { deletedAt: null, ...(status ? { status: status as never } : {}) };
  const [items, total] = await Promise.all([
    prisma.feedback.findMany({ where, orderBy: { createdAt: "desc" }, take: limit, skip: offset }),
    prisma.feedback.count({ where }),
  ]);
  return { items, total, limit, offset };
}

export async function getFeedback(id: string) {
  const row = await prisma.feedback.findFirst({
    where: { id, deletedAt: null },
  });
  if (!row) throw new ServiceError("Feedback not found", 404, "NOT_FOUND");
  return row;
}

export async function updateFeedback(
  id: string,
  input: {
    status?: FeedbackStatus;
    adminReply?: string;
    repliedById?: string;
  }
) {
  const existing = await prisma.feedback.findFirst({
    where: { id, deletedAt: null },
  });
  if (!existing) throw new ServiceError("Feedback not found", 404, "NOT_FOUND");

  const hasReply = input.adminReply !== undefined && input.adminReply.trim().length > 0;
  const row = await prisma.feedback.update({
    where: { id },
    data: {
      ...(input.status !== undefined ? { status: input.status } : {}),
      ...(input.adminReply !== undefined ? { adminReply: input.adminReply.trim() || null } : {}),
      ...(hasReply
        ? {
            repliedAt: new Date(),
            repliedById: input.repliedById ?? null,
            ...(input.status === undefined && existing.status === "new"
              ? { status: "replied" as FeedbackStatus }
              : {}),
          }
        : {}),
    },
  });

  await writeAuditLog({
    action: "system_event",
    entityType: "feedback",
    entityId: row.id,
    actorUserId: input.repliedById,
    payload: { event: "feedback_updated", status: row.status },
  });

  return row;
}
