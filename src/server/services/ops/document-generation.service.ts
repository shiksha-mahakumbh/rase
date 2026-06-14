import type { DocumentLetterType } from "@prisma/client";
import { jsPDF } from "jspdf";
import { randomUUID } from "crypto";
import { prisma } from "@/server/db/prisma";
import { writeAuditLog } from "@/server/services/audit.service";
import { EVENT_NAME } from "@/types/registration";

const LETTER_TITLES: Record<DocumentLetterType, string> = {
  invitation_letter: "Invitation Letter",
  acceptance_letter: "Acceptance Letter",
  participation_letter: "Letter of Participation",
  volunteer_letter: "Volunteer Appointment Letter",
  appreciation_letter: "Letter of Appreciation",
};

function buildLetterBody(type: DocumentLetterType, vars: Record<string, string>) {
  const name = vars.fullName ?? vars.authorName ?? "Participant";
  switch (type) {
    case "invitation_letter":
      return `Dear ${name},\n\nYou are cordially invited to participate in ${EVENT_NAME}.\n\nRegistration ID: ${vars.registrationId ?? "—"}\nInstitution: ${vars.institution ?? "—"}\n\nWe look forward to your valuable participation.`;
    case "acceptance_letter":
      return `Dear ${name},\n\nWe are pleased to inform you that your submission "${vars.title ?? "your paper"}" has been accepted for ${EVENT_NAME}.`;
    case "participation_letter":
      return `Dear ${name},\n\nThis certifies your participation in ${EVENT_NAME} as a ${vars.category ?? "delegate"}.`;
    case "volunteer_letter":
      return `Dear ${name},\n\nYou have been appointed as a volunteer for ${EVENT_NAME}. Department: ${vars.department ?? "Operations"}.`;
    case "appreciation_letter":
      return `Dear ${name},\n\nThe organizing committee of ${EVENT_NAME} expresses sincere appreciation for your contribution and dedication.`;
    default:
      return `Dear ${name},\n\n${EVENT_NAME}`;
  }
}

function generateLetterPdf(title: string, body: string, recipientName: string) {
  const doc = new jsPDF({ unit: "mm", format: "a4" });
  doc.setFontSize(18);
  doc.text(EVENT_NAME, 20, 25);
  doc.setFontSize(14);
  doc.text(title, 20, 40);
  doc.setFontSize(11);
  const lines = doc.splitTextToSize(body, 170);
  doc.text(lines, 20, 55);
  doc.setFontSize(10);
  doc.text(`Date: ${new Date().toLocaleDateString("en-IN")}`, 20, 270);
  doc.text("Organizing Committee", 20, 278);
  return Buffer.from(doc.output("arraybuffer"));
}

export async function generateDocument(input: {
  documentType: DocumentLetterType;
  registrationId?: string;
  vars?: Record<string, string>;
}) {
  let vars = input.vars ?? {};
  let regUuid: string | undefined;

  if (input.registrationId) {
    const reg = await prisma.registration.findFirst({
      where: { registrationId: input.registrationId, deletedAt: null },
    });
    if (reg) {
      regUuid = reg.id;
      vars = {
        fullName: reg.fullName,
        registrationId: reg.registrationId,
        institution: reg.institution,
        category: String(reg.registrationType),
        email: reg.email,
        ...vars,
      };
    }
  }

  const title = LETTER_TITLES[input.documentType];
  const body = buildLetterBody(input.documentType, vars);
  const pdf = generateLetterPdf(title, body, vars.fullName ?? "Participant");
  const batchId = randomUUID();

  const doc = await prisma.generatedDocument.create({
    data: {
      documentType: input.documentType,
      registrationId: regUuid,
      title,
      recipientName: vars.fullName ?? vars.authorName,
      bulkBatchId: batchId,
      metadata: vars as object,
    },
  });

  await writeAuditLog({
    action: "document_generated",
    registrationId: regUuid,
    payload: { documentType: input.documentType, documentId: doc.id },
  });

  return { document: doc, pdf, batchId };
}

export async function bulkGenerateDocuments(input: {
  documentType: DocumentLetterType;
  registrationIds: string[];
}) {
  const results: Array<{ registrationId: string; ok: boolean; documentId?: string }> = [];
  const batchId = randomUUID();

  for (const registrationId of input.registrationIds) {
    try {
      const { document } = await generateDocument({
        documentType: input.documentType,
        registrationId,
      });
      await prisma.generatedDocument.update({
        where: { id: document.id },
        data: { bulkBatchId: batchId },
      });
      results.push({ registrationId, ok: true, documentId: document.id });
    } catch {
      results.push({ registrationId, ok: false });
    }
  }

  return { batchId, results, success: results.filter((r) => r.ok).length };
}

export async function listGeneratedDocuments(options: { limit?: number; documentType?: DocumentLetterType }) {
  const { limit = 30, documentType } = options;
  return prisma.generatedDocument.findMany({
    where: documentType ? { documentType } : {},
    orderBy: { createdAt: "desc" },
    take: limit,
    include: {
      registration: { select: { registrationId: true, fullName: true } },
    },
  });
}
