import { prisma } from "@/server/db/prisma";
import { writeAuditLog } from "@/server/services/audit.service";
import { ServiceError } from "@/server/lib/errors";
import { displayRegistrationType } from "@/server/lib/registration-type-labels";

function parseRegistrationId(raw: string): string {
  const trimmed = raw.trim();
  try {
    const parsed = JSON.parse(trimmed) as { registrationId?: string };
    if (parsed.registrationId) return parsed.registrationId;
  } catch {
    // not JSON — use as-is
  }
  const match = trimmed.match(/SMK2026-\d{6}/i);
  if (match) return match[0].toUpperCase();
  return trimmed;
}

export async function lookupAttendeeForCheckIn(rawId: string) {
  const registrationId = parseRegistrationId(rawId);
  const reg = await prisma.registration.findFirst({
    where: {
      deletedAt: null,
      OR: [{ registrationId }, { id: registrationId }],
    },
    include: {
      attendeeCertificate: { select: { certificateNo: true } },
      sessionAttendances: { select: { sessionName: true, attendedAt: true } },
    },
  });

  if (!reg) throw new ServiceError("Registration not found", 404, "NOT_FOUND");

  const meta = (reg.metadata ?? {}) as Record<string, unknown>;

  return {
    registrationId: reg.registrationId,
    name: reg.fullName,
    category: displayRegistrationType(String(reg.registrationType)),
    institution: reg.institution,
    email: reg.email,
    mobile: reg.contactNumber,
    paymentStatus: reg.paymentStatus.replace(/_/g, " "),
    checkInStatus: reg.checkInStatus.replace(/_/g, " "),
    checkedInAt: reg.checkedInAt?.toISOString() ?? null,
    kitDistributed: reg.kitDistributed,
    certificateEligible: reg.certificateEligible,
    certificateStatus: reg.certificateLifecycleStatus.replace(/_/g, " "),
    isFirstCheckIn: reg.checkInStatus !== "Checked_In",
    sessions: reg.sessionAttendances.map((s) => ({
      name: s.sessionName,
      attendedAt: s.attendedAt.toISOString(),
    })),
    subCategory: String(meta.category ?? meta.projectStudentType ?? meta.accommodationBedType ?? ""),
  };
}

export async function performCheckInAction(input: {
  registrationId: string;
  action: "check_in" | "kit" | "certificate_eligible" | "session";
  sessionName?: string;
  location?: string;
  actorUserId?: string;
}) {
  const publicId = parseRegistrationId(input.registrationId);
  const reg = await prisma.registration.findFirst({
    where: { registrationId: publicId, deletedAt: null },
  });
  if (!reg) throw new ServiceError("Registration not found", 404);

  const now = new Date();

  if (input.action === "check_in") {
    if (reg.checkInStatus === "Checked_In") {
      return {
        duplicate: true,
        message: "ALREADY CHECKED-IN",
        attendee: await lookupAttendeeForCheckIn(publicId),
      };
    }

    await prisma.$transaction(async (tx) => {
      await tx.registration.update({
        where: { id: reg.id },
        data: {
          checkInStatus: "Checked_In",
          checkedInAt: now,
          checkedInByUserId: input.actorUserId ?? null,
          checkInLocation: input.location ?? null,
        },
      });
      await tx.checkInRecord.create({
        data: {
          registrationId: reg.id,
          action: "check_in",
          location: input.location,
          recordedByUserId: input.actorUserId,
        },
      });
    });

    await writeAuditLog({
      action: "check_in_recorded",
      registrationId: reg.id,
      actorUserId: input.actorUserId,
      payload: {
        registration_id: publicId,
        user_email: reg.email,
        location: input.location,
      },
    });

    return {
      duplicate: false,
      message: "FIRST CHECK-IN",
      attendee: await lookupAttendeeForCheckIn(publicId),
    };
  }

  if (input.action === "kit") {
    await prisma.$transaction(async (tx) => {
      await tx.registration.update({
        where: { id: reg.id },
        data: { kitDistributed: true, kitDistributedAt: now },
      });
      await tx.checkInRecord.create({
        data: {
          registrationId: reg.id,
          action: "kit",
          recordedByUserId: input.actorUserId,
        },
      });
    });
    await writeAuditLog({
      action: "kit_distributed",
      registrationId: reg.id,
      actorUserId: input.actorUserId,
      payload: { registration_id: publicId },
    });
    return { success: true, attendee: await lookupAttendeeForCheckIn(publicId) };
  }

  if (input.action === "certificate_eligible") {
    const paidOk =
      reg.paymentStatus === "Paid" ||
      reg.paymentStatus === "Not_Required" ||
      reg.paymentStatus === "Submitted";
    if (!paidOk) {
      throw new ServiceError("Payment must be complete before certificate eligibility", 400);
    }

    await prisma.$transaction(async (tx) => {
      await tx.registration.update({
        where: { id: reg.id },
        data: {
          certificateEligible: true,
          certificateLifecycleStatus: "Eligible",
        },
      });
      await tx.checkInRecord.create({
        data: {
          registrationId: reg.id,
          action: "certificate_eligible",
          recordedByUserId: input.actorUserId,
        },
      });
    });
    await writeAuditLog({
      action: "certificate_eligible",
      registrationId: reg.id,
      actorUserId: input.actorUserId,
      payload: { registration_id: publicId },
    });
    return { success: true, attendee: await lookupAttendeeForCheckIn(publicId) };
  }

  if (input.action === "session") {
    const sessionName = input.sessionName?.trim();
    if (!sessionName) throw new ServiceError("sessionName required", 400);

    await prisma.sessionAttendance.upsert({
      where: {
        registrationId_sessionName: {
          registrationId: reg.id,
          sessionName,
        },
      },
      create: {
        registrationId: reg.id,
        sessionName,
        recordedByUserId: input.actorUserId,
      },
      update: { attendedAt: now },
    });

    await prisma.checkInRecord.create({
      data: {
        registrationId: reg.id,
        action: "session",
        sessionName,
        recordedByUserId: input.actorUserId,
      },
    });

    return { success: true, attendee: await lookupAttendeeForCheckIn(publicId) };
  }

  throw new ServiceError("Unknown action", 400);
}
