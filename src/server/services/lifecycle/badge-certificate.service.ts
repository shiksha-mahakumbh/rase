import type { BadgeTemplate, CertificateType } from "@prisma/client";
import { jsPDF } from "jspdf";
import { randomBytes } from "crypto";
import { prisma } from "@/server/db/prisma";
import { writeAuditLog } from "@/server/services/audit.service";
import { ServiceError } from "@/server/lib/errors";
import { EVENT_NAME } from "@/types/registration";
import { SITE_URL } from "@/config/site";
import { displayRegistrationType } from "@/server/lib/registration-type-labels";

const TYPE_TO_BADGE: Partial<Record<string, BadgeTemplate>> = {
  Delegate: "Delegate",
  Conclave: "Delegate",
  Exhibition: "Exhibitor",
  Accommodation: "Delegate",
  Volunteer: "Volunteer",
  Participant: "Student",
  Olympiad: "Student",
  Talent: "Student",
  Awards: "Speaker",
  Best_Practices: "Speaker",
};

const TYPE_TO_CERT: Partial<Record<string, CertificateType>> = {
  Delegate: "Participation",
  Conclave: "Participation",
  Exhibition: "Presentation",
  Volunteer: "Volunteer",
  Participant: "Participation",
  Olympiad: "Participation",
  Talent: "Presentation",
  Awards: "Speaker",
};

function defaultBadgeTemplate(registrationType: string): BadgeTemplate {
  return TYPE_TO_BADGE[registrationType] ?? "Delegate";
}

function defaultCertType(registrationType: string): CertificateType {
  return TYPE_TO_CERT[registrationType] ?? "Participation";
}

async function getReg(publicId: string) {
  const reg = await prisma.registration.findFirst({
    where: { registrationId: publicId, deletedAt: null },
  });
  if (!reg) throw new ServiceError("Registration not found", 404);
  return reg;
}

export async function generateBadgePdf(publicId: string, template?: BadgeTemplate) {
  const reg = await getReg(publicId);
  const badgeTemplate = template ?? defaultBadgeTemplate(String(reg.registrationType));
  const category = displayRegistrationType(String(reg.registrationType));
  const doc = new jsPDF({ unit: "mm", format: [90, 140] });
  doc.setFillColor(30, 58, 95);
  doc.rect(0, 0, 90, 28, "F");
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(10);
  doc.text(EVENT_NAME, 45, 10, { align: "center" });
  doc.setFontSize(8);
  doc.text(String(badgeTemplate).toUpperCase(), 45, 18, { align: "center" });

  doc.setTextColor(30, 58, 95);
  doc.setFontSize(14);
  doc.text(reg.fullName, 45, 40, { align: "center", maxWidth: 80 });
  doc.setFontSize(9);
  doc.text(reg.registrationId, 45, 52, { align: "center" });
  doc.text(category, 45, 60, { align: "center", maxWidth: 80 });
  doc.text(reg.institution, 45, 68, { align: "center", maxWidth: 80 });

  const buffer = Buffer.from(doc.output("arraybuffer"));
  const now = new Date();

  await prisma.attendeeBadge.upsert({
    where: { registrationId: reg.id },
    create: {
      registrationId: reg.id,
      badgeTemplate,
      generatedAt: now,
      storagePath: `generated/badges/${reg.registrationId}.pdf`,
    },
    update: { badgeTemplate, generatedAt: now },
  });

  await writeAuditLog({
    action: "badge_generated",
    registrationId: reg.id,
    payload: { registration_id: publicId, template: badgeTemplate },
  });

  return { pdf: buffer, registrationId: publicId, template: badgeTemplate };
}

export async function generateCertificatePdf(
  publicId: string,
  certType?: CertificateType,
  actorUserId?: string
) {
  const reg = await getReg(publicId);

  if (!reg.certificateEligible && reg.certificateLifecycleStatus !== "Eligible") {
    const paidOk =
      reg.paymentStatus === "Paid" ||
      reg.paymentStatus === "Not_Required" ||
      reg.paymentStatus === "Submitted";
    if (!paidOk || reg.checkInStatus !== "Checked_In") {
      throw new ServiceError(
        "Certificate requires completed registration, payment, and verified attendance",
        400,
        "NOT_ELIGIBLE"
      );
    }
  }

  const certificateType = certType ?? defaultCertType(String(reg.registrationType));
  const verifyCode = randomBytes(16).toString("hex");
  const certificateNo = `CERT-${reg.registrationId.replace(/^SMK/, "")}`;
  const verifyUrl = `${SITE_URL}/certificate/verify/${verifyCode}`;

  const doc = new jsPDF({ unit: "pt", format: "a4", orientation: "landscape" });
  const w = doc.internal.pageSize.getWidth();
  const h = doc.internal.pageSize.getHeight();

  doc.setDrawColor(30, 58, 95);
  doc.setLineWidth(3);
  doc.rect(30, 30, w - 60, h - 60);

  doc.setFont("helvetica", "bold");
  doc.setFontSize(28);
  doc.setTextColor(30, 58, 95);
  doc.text("Certificate of " + certificateType, w / 2, 90, { align: "center" });

  doc.setFontSize(14);
  doc.setFont("helvetica", "normal");
  doc.text("This is to certify that", w / 2, 130, { align: "center" });
  doc.setFontSize(22);
  doc.setFont("helvetica", "bold");
  doc.text(reg.fullName, w / 2, 165, { align: "center" });

  doc.setFontSize(12);
  doc.setFont("helvetica", "normal");
  doc.text(
    `has participated in ${EVENT_NAME} as ${displayRegistrationType(String(reg.registrationType))}.`,
    w / 2,
    200,
    { align: "center", maxWidth: w - 120 }
  );
  doc.text(`Institution: ${reg.institution}`, w / 2, 230, { align: "center" });
  doc.text(`Certificate No: ${certificateNo}`, w / 2, 260, { align: "center" });
  doc.text(`Registration ID: ${reg.registrationId}`, w / 2, 280, { align: "center" });
  doc.text(`Verify: ${verifyUrl}`, w / 2, 300, { align: "center", maxWidth: w - 120 });

  doc.setFontSize(11);
  doc.text("Department of Holistic Education", 80, h - 80);
  doc.text(new Date().toLocaleDateString("en-IN"), w - 120, h - 80, { align: "center" });

  const pdf = Buffer.from(doc.output("arraybuffer"));
  const now = new Date();

  await prisma.$transaction(async (tx) => {
    await tx.attendeeCertificate.upsert({
      where: { registrationId: reg.id },
      create: {
        registrationId: reg.id,
        certificateNo,
        certificateType,
        verifyCode,
        issuedAt: now,
        issuedByUserId: actorUserId,
        storagePath: `generated/certificates/${certificateNo}.pdf`,
      },
      update: {
        certificateType,
        verifyCode,
        issuedAt: now,
        issuedByUserId: actorUserId,
        revokedAt: null,
      },
    });
    await tx.registration.update({
      where: { id: reg.id },
      data: { certificateLifecycleStatus: "Issued" },
    });
  });

  await writeAuditLog({
    action: "certificate_issued",
    registrationId: reg.id,
    actorUserId,
    payload: {
      registration_id: publicId,
      certificate_no: certificateNo,
      verify_code: verifyCode,
    },
  });

  void import("@/server/services/ops/workflow-automation.service")
    .then(({ fireWorkflowForRegistration }) =>
      fireWorkflowForRegistration("certificate_available", reg.id)
    )
    .catch(() => {});

  return { pdf, certificateNo, verifyCode, registrationId: publicId };
}

export async function verifyCertificate(verifyCode: string) {
  const cert = await prisma.attendeeCertificate.findFirst({
    where: { verifyCode, revokedAt: null },
    include: {
      registration: {
        select: {
          registrationId: true,
          fullName: true,
          institution: true,
          registrationType: true,
          email: true,
        },
      },
    },
  });
  if (!cert?.registration) return null;

  return {
    valid: true,
    certificateNo: cert.certificateNo,
    certificateType: cert.certificateType,
    issuedAt: cert.issuedAt?.toISOString() ?? null,
    registrationId: cert.registration.registrationId,
    name: cert.registration.fullName,
    institution: cert.registration.institution,
    category: displayRegistrationType(String(cert.registration.registrationType)),
  };
}

export async function bulkGenerateBadges(registrationIds: string[]) {
  const results: Array<{ registrationId: string; ok: boolean; error?: string }> = [];
  for (const id of registrationIds) {
    try {
      await generateBadgePdf(id);
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

export async function bulkGenerateCertificates(
  registrationIds: string[],
  actorUserId?: string
) {
  const results: Array<{ registrationId: string; ok: boolean; certificateNo?: string; error?: string }> = [];
  for (const id of registrationIds) {
    try {
      const r = await generateCertificatePdf(id, undefined, actorUserId);
      results.push({ registrationId: id, ok: true, certificateNo: r.certificateNo });
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

export { defaultBadgeTemplate, defaultCertType };
