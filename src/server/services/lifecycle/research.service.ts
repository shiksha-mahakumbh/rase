import type { ResearchSubmissionStatus } from "@prisma/client";
import { prisma } from "@/server/db/prisma";
import { writeAuditLog } from "@/server/services/audit.service";
import { ServiceError } from "@/server/lib/errors";
import { queueEmail } from "@/server/services/email.service";
import { EVENT_NAME } from "@/types/registration";

export async function listResearchSubmissions(options: {
  limit?: number;
  offset?: number;
  status?: ResearchSubmissionStatus;
  reviewerUserId?: string;
}) {
  const { limit = 25, offset = 0, status, reviewerUserId } = options;
  const where = {
    ...(status ? { status } : {}),
    ...(reviewerUserId ? { reviewerUserId } : {}),
  };

  const [items, total] = await Promise.all([
    prisma.researchSubmission.findMany({
      where,
      orderBy: { createdAt: "desc" },
      take: limit,
      skip: offset,
      include: {
        registration: { select: { registrationId: true, fullName: true } },
      },
    }),
    prisma.researchSubmission.count({ where }),
  ]);

  return { items, total, limit, offset };
}

export async function createResearchSubmission(input: {
  title: string;
  authorName: string;
  authorEmail: string;
  institution?: string;
  abstractText: string;
  registrationId?: string;
}) {
  let regUuid: string | undefined;
  if (input.registrationId) {
    const reg = await prisma.registration.findFirst({
      where: { registrationId: input.registrationId, deletedAt: null },
    });
    regUuid = reg?.id;
  }

  return prisma.researchSubmission.create({
    data: {
      title: input.title.trim(),
      authorName: input.authorName.trim(),
      authorEmail: input.authorEmail.trim().toLowerCase(),
      institution: input.institution?.trim(),
      abstractText: input.abstractText.trim(),
      registrationId: regUuid,
    },
  });
}

export async function updateResearchSubmission(
  id: string,
  data: {
    status?: ResearchSubmissionStatus;
    reviewerUserId?: string;
    score?: number;
    remarks?: string;
    recommendation?: string;
    sendAcceptanceLetter?: boolean;
  },
  actorUserId?: string
) {
  const existing = await prisma.researchSubmission.findUnique({ where: { id } });
  if (!existing) throw new ServiceError("Submission not found", 404);

  const row = await prisma.researchSubmission.update({
    where: { id },
    data: {
      status: data.status,
      reviewerUserId: data.reviewerUserId,
      score: data.score,
      remarks: data.remarks,
      recommendation: data.recommendation,
    },
  });

  if (data.sendAcceptanceLetter && data.status === "Accepted") {
    await queueEmail({
      toEmail: row.authorEmail,
      subject: `${EVENT_NAME} — Abstract Accepted`,
      html: `<p>Dear ${row.authorName},</p>
        <p>Congratulations! Your abstract <strong>${row.title}</strong> has been accepted for ${EVENT_NAME}.</p>
        ${data.remarks ? `<p>Reviewer remarks: ${data.remarks}</p>` : ""}
        <p>We look forward to your presentation.</p>`,
      template: "registration_confirmation",
    });
    await prisma.researchSubmission.update({
      where: { id },
      data: { acceptanceLetterSentAt: new Date() },
    });
  }

  if (data.status === "Accepted") {
    void import("@/server/services/ops/workflow-automation.service")
      .then(({ triggerWorkflows }) =>
        triggerWorkflows("paper_accepted", {
          registrationUuid: row.registrationId ?? undefined,
          email: row.authorEmail,
          vars: {
            authorName: row.authorName,
            email: row.authorEmail,
            title: row.title,
            fullName: row.authorName,
          },
        })
      )
      .catch(() => {});
  }

  await writeAuditLog({
    action: "research_submission_updated",
    actorUserId,
    payload: {
      submission_id: id,
      status: data.status,
      score: data.score,
    },
  });

  return row;
}

export async function getReviewerQueue(reviewerUserId: string) {
  return listResearchSubmissions({
    status: "Under_Review",
    reviewerUserId,
    limit: 50,
    offset: 0,
  });
}
