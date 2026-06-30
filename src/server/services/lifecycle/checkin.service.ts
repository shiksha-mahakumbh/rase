import type { Registration } from "@prisma/client";
import { prisma } from "@/server/db/prisma";
import { writeAuditLog } from "@/server/services/audit.service";
import { ServiceError } from "@/server/lib/errors";
import { displayRegistrationType } from "@/server/lib/registration-type-labels";

/** Parse plain ID, JSON QR payload, or SMK####-###### from scanner input. */
export function parseRegistrationId(raw: string): string {
  const trimmed = raw.trim();
  try {
    const parsed = JSON.parse(trimmed) as { registrationId?: string };
    if (parsed.registrationId) return parsed.registrationId.trim().toUpperCase();
  } catch {
    // not JSON — use as-is
  }
  const match = trimmed.match(/SMK\d{4}-\d{6}/i);
  if (match) return match[0].toUpperCase();
  return trimmed.toUpperCase();
}

function maskPhone(value: string): string {
  const digits = value.replace(/\D/g, "");
  if (digits.length <= 4) return "****";
  return `******${digits.slice(-4)}`;
}

function formatEnumLabel(value: string): string {
  return value.replace(/_/g, " ");
}

function buildCheckInEligibility(reg: Registration): {
  canCheckIn: boolean;
  canReceiveKit: boolean;
  canMarkCertificate: boolean;
  warnings: string[];
  blockReason: string | null;
} {
  const warnings: string[] = [];
  let blockReason: string | null = null;

  if (reg.registrationStatus === "Rejected") {
    blockReason = "Registration was rejected — check-in is not allowed.";
    return {
      canCheckIn: false,
      canReceiveKit: false,
      canMarkCertificate: false,
      warnings,
      blockReason,
    };
  }

  if (reg.registrationStatus === "Pending") {
    warnings.push("Registration is still pending verification.");
  }

  const paymentBlocked =
    reg.paymentStatus === "Pending_Payment" || reg.paymentStatus === "Failed";

  if (paymentBlocked) {
    warnings.push(`Payment status: ${formatEnumLabel(reg.paymentStatus)}.`);
    if (!blockReason) {
      blockReason = "Payment must be completed before venue check-in.";
    }
  }

  const canCheckIn = !blockReason && reg.checkInStatus !== "Checked_In";
  const canReceiveKit = reg.registrationStatus !== "Rejected" && !reg.kitDistributed;
  const paidOk =
    reg.paymentStatus === "Paid" ||
    reg.paymentStatus === "Not_Required" ||
    reg.paymentStatus === "Submitted";
  const canMarkCertificate =
    reg.registrationStatus !== "Rejected" && paidOk && !reg.certificateEligible;

  return { canCheckIn, canReceiveKit, canMarkCertificate, warnings, blockReason };
}

function assertRegistrationActionAllowed(reg: Registration) {
  if (reg.registrationStatus === "Rejected") {
    throw new ServiceError("Registration was rejected — action not allowed", 403, "REGISTRATION_REJECTED");
  }
}

function assertCheckInAllowed(reg: Registration) {
  assertRegistrationActionAllowed(reg);
  if (reg.paymentStatus === "Pending_Payment" || reg.paymentStatus === "Failed") {
    throw new ServiceError(
      "Payment must be completed before venue check-in",
      403,
      "PAYMENT_REQUIRED"
    );
  }
}

function mapAttendeeLookup(reg: Registration, sessions: Array<{ sessionName: string; attendedAt: Date }>) {
  const meta = (reg.metadata ?? {}) as Record<string, unknown>;
  const eligibility = buildCheckInEligibility(reg);

  return {
    registrationId: reg.registrationId,
    name: reg.fullName,
    category: displayRegistrationType(String(reg.registrationType)),
    institution: reg.institution,
    registrationStatus: formatEnumLabel(reg.registrationStatus),
    paymentStatus: formatEnumLabel(reg.paymentStatus),
    checkInStatus: formatEnumLabel(reg.checkInStatus),
    checkedInAt: reg.checkedInAt?.toISOString() ?? null,
    kitDistributed: reg.kitDistributed,
    certificateEligible: reg.certificateEligible,
    certificateStatus: formatEnumLabel(reg.certificateLifecycleStatus),
    isFirstCheckIn: reg.checkInStatus !== "Checked_In",
    contactHint: maskPhone(reg.contactNumber),
    sessions: sessions.map((s) => ({
      name: s.sessionName,
      attendedAt: s.attendedAt.toISOString(),
    })),
    subCategory: String(meta.category ?? meta.projectStudentType ?? meta.accommodationBedType ?? ""),
    warnings: eligibility.warnings,
    blockReason: eligibility.blockReason,
    canCheckIn: eligibility.canCheckIn,
    canReceiveKit: eligibility.canReceiveKit,
    canMarkCertificate: eligibility.canMarkCertificate,
  };
}

export async function lookupAttendeeForCheckIn(rawId: string) {
  const registrationId = parseRegistrationId(rawId);
  const reg = await prisma.registration.findFirst({
    where: {
      deletedAt: null,
      OR: [{ registrationId }, { id: registrationId }],
    },
    include: {
      sessionAttendances: { select: { sessionName: true, attendedAt: true } },
    },
  });

  if (!reg) throw new ServiceError("Registration not found", 404, "NOT_FOUND");

  return mapAttendeeLookup(reg, reg.sessionAttendances);
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
  if (!reg) throw new ServiceError("Registration not found", 404, "NOT_FOUND");

  assertRegistrationActionAllowed(reg);
  const now = new Date();

  if (input.action === "check_in") {
    if (reg.checkInStatus === "Checked_In") {
      return {
        duplicate: true,
        message: "ALREADY CHECKED-IN",
        attendee: await lookupAttendeeForCheckIn(publicId),
      };
    }

    assertCheckInAllowed(reg);

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
    if (reg.kitDistributed) {
      return {
        duplicate: true,
        message: "KIT ALREADY DISTRIBUTED",
        attendee: await lookupAttendeeForCheckIn(publicId),
      };
    }

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
    return { success: true, message: "KIT DISTRIBUTED", attendee: await lookupAttendeeForCheckIn(publicId) };
  }

  if (input.action === "certificate_eligible") {
    const paidOk =
      reg.paymentStatus === "Paid" ||
      reg.paymentStatus === "Not_Required" ||
      reg.paymentStatus === "Submitted";
    if (!paidOk) {
      throw new ServiceError("Payment must be complete before certificate eligibility", 400, "PAYMENT_REQUIRED");
    }
    if (reg.certificateEligible) {
      return {
        duplicate: true,
        message: "ALREADY CERTIFICATE ELIGIBLE",
        attendee: await lookupAttendeeForCheckIn(publicId),
      };
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
    return {
      success: true,
      message: "CERTIFICATE ELIGIBLE",
      attendee: await lookupAttendeeForCheckIn(publicId),
    };
  }

  if (input.action === "session") {
    const sessionName = input.sessionName?.trim();
    if (!sessionName) throw new ServiceError("sessionName required", 400, "SESSION_REQUIRED");

    const eventSession = await prisma.eventSession.findFirst({
      where: {
        deletedAt: null,
        isActive: true,
        title: { equals: sessionName, mode: "insensitive" },
      },
      select: { id: true },
    });

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
        eventSessionId: eventSession?.id ?? null,
        recordedByUserId: input.actorUserId,
      },
      update: { attendedAt: now, recordedByUserId: input.actorUserId ?? undefined },
    });

    await prisma.checkInRecord.create({
      data: {
        registrationId: reg.id,
        action: "session",
        sessionName,
        recordedByUserId: input.actorUserId,
      },
    });

    await writeAuditLog({
      action: "session_attendance_recorded",
      registrationId: reg.id,
      actorUserId: input.actorUserId,
      payload: { registration_id: publicId, session_name: sessionName },
    });

    return { success: true, message: "SESSION RECORDED", attendee: await lookupAttendeeForCheckIn(publicId) };
  }

  throw new ServiceError("Unknown action", 400, "INVALID_ACTION");
}

export async function listRecentCheckIns(limit = 15) {
  const rows = await prisma.checkInRecord.findMany({
    where: { action: "check_in" },
    orderBy: { recordedAt: "desc" },
    take: limit,
    include: {
      registration: {
        select: {
          registrationId: true,
          fullName: true,
          checkInLocation: true,
          checkedInAt: true,
        },
      },
    },
  });

  return rows.map((row) => ({
    registrationId: row.registration.registrationId,
    name: row.registration.fullName,
    location: row.location ?? row.registration.checkInLocation,
    checkedInAt: (row.registration.checkedInAt ?? row.recordedAt).toISOString(),
  }));
}
