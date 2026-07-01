import type { Prisma, RegistrationType as PrismaRegistrationType } from "@prisma/client";
import { prisma } from "@/server/db/prisma";
import { writeAuditLog } from "@/server/services/audit.service";
import { ServiceError } from "@/server/lib/errors";
import {
  asAccommodationStatus,
  asPaymentStatus,
  asRegistrationStatus,
  extractCommonFields,
  toPrismaRegistrationType,
} from "@/server/lib/registration-types";
import { REGISTRATION_ID_PREFIX } from "@/types/registration";
import { emailsMatch, toPublicRegistrationSummary } from "@/lib/security/registration-lookup";
import { generateRegistrationQrDataUrl } from "@/server/services/receipt-qr.service";
import { displayRegistrationType } from "@/server/lib/registration-type-labels";
import { buildAdminRegistrationView } from "@/server/services/admin/registration-admin-view.service";
import type { AdminRegistrationView } from "@/lib/admin/registration-detail-types";

export type SaveRegistrationInput = {
  registrationType: string;
  data: Record<string, unknown>;
  paymentStatus?: string;
  registrationStatus?: string;
  accommodationStatus?: string;
  submittedIp?: string | null;
  userAgent?: string | null;
};

export type SaveRegistrationResult = {
  registrationId: string;
  id: string;
  typeDocId: string;
};

const COUNTER_YEAR = 2026;
const COUNTER_PREFIX = REGISTRATION_ID_PREFIX;

export async function generateRegistrationId(): Promise<string> {
  return prisma.$transaction(async (tx) => {
    const counter = await tx.registrationCounter.upsert({
      where: { prefix: COUNTER_PREFIX },
      create: { year: COUNTER_YEAR, prefix: COUNTER_PREFIX, lastNumber: 0 },
      update: {},
    });

    const updated = await tx.registrationCounter.update({
      where: { id: counter.id },
      data: { lastNumber: { increment: 1 } },
    });

    return `${COUNTER_PREFIX}-${String(updated.lastNumber).padStart(6, "0")}`;
  });
}

async function createTypeExtension(
  tx: Prisma.TransactionClient,
  registrationId: string,
  prismaType: PrismaRegistrationType,
  data: Record<string, unknown>
) {
  switch (prismaType) {
    case "Conclave": {
      const row = await tx.conclaveRegistration.create({
        data: {
          registrationId,
          conclaveSelection: String(data.conclaveSelection ?? "Research Conclave"),
          participationType: String(data.participationType ?? "Observer"),
        },
      });
      return row.id;
    }
    case "Delegate": {
      const row = await tx.delegateRegistration.create({
        data: {
          registrationId,
          delegateCategory: String(data.delegateCategory ?? "General"),
          panNumber: data.panNumber ? String(data.panNumber) : null,
          chequeNumber: data.chequeNumber ? String(data.chequeNumber) : null,
        },
      });
      return row.id;
    }
    case "Exhibition": {
      const row = await tx.exhibitionRegistration.create({
        data: {
          registrationId,
          projectTitle: data.title ? String(data.title) : data.projectTitle ? String(data.projectTitle) : null,
          projectSummary: data.description ? String(data.description) : data.projectSummary ? String(data.projectSummary) : null,
        },
      });
      return row.id;
    }
    case "Awards": {
      const row = await tx.awardsRegistration.create({
        data: {
          registrationId,
          awardCategory: String(data.awardCategory ?? "General"),
          nominationDetails: data.achievements ? String(data.achievements) : data.nominationDetails ? String(data.nominationDetails) : null,
        },
      });
      return row.id;
    }
    case "Best_Practices": {
      const row = await tx.bestPracticeRegistration.create({
        data: {
          registrationId,
          title: String(data.title ?? "Untitled"),
          organizationName: String(data.organizationName ?? data.institution ?? "N/A"),
          areaOfWork: String(data.areaOfWork ?? "Other"),
          description: String(data.briefDescription ?? data.description ?? ""),
          wordCount: data.wordCount != null ? Number(data.wordCount) : null,
        },
      });
      return row.id;
    }
    case "Olympiad": {
      const row = await tx.olympiadRegistration.create({
        data: {
          registrationId,
          olympiadTrack: String(data.olympiadType ?? data.olympiadTrack ?? "General"),
          schoolName: data.schoolName ? String(data.schoolName) : null,
          grade: data.grade ? String(data.grade) : null,
        },
      });
      return row.id;
    }
    case "Talent": {
      const row = await tx.talentRegistration.create({
        data: {
          registrationId,
          talentCategory: String(data.talentCategory ?? data.title ?? "General"),
          performanceTitle: data.performanceTitle ? String(data.performanceTitle) : null,
        },
      });
      return row.id;
    }
    case "Volunteer": {
      const row = await tx.volunteerApplication.create({
        data: {
          registrationId,
          volunteerRole: String(data.volunteerRole ?? "General"),
          availability: data.availability ? String(data.availability) : null,
        },
      });
      return row.id;
    }
    case "NGO": {
      const row = await tx.ngoRegistration.create({
        data: {
          registrationId,
          ngoName: String(data.ngoName ?? data.organizationName ?? "N/A"),
          registrationNumber: data.registrationNumber ? String(data.registrationNumber) : null,
        },
      });
      return row.id;
    }
    case "Participant": {
      const row = await tx.participantRegistration.create({
        data: {
          registrationId,
          participantType: String(data.participantType ?? data.schoolProgramType ?? "School Program"),
        },
      });
      return row.id;
    }
    case "Accommodation": {
      const row = await tx.accommodationRequest.create({
        data: {
          registrationId,
          status: "Requested",
          notes: data.notes ? String(data.notes) : null,
        },
      });
      return row.id;
    }
    case "Legacy_Other":
      return registrationId;
    default:
      throw new ServiceError(`Type extension not implemented: ${prismaType}`, 400, "TYPE_NOT_SUPPORTED");
  }
}

export async function saveRegistration(input: SaveRegistrationInput): Promise<SaveRegistrationResult> {
  const prismaType = toPrismaRegistrationType(input.registrationType);
  const common = extractCommonFields(input.data);

  if (common.fullName.length < 2) {
    throw new ServiceError("Full name is required", 400, "INVALID_NAME");
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(common.email)) {
    throw new ServiceError("Valid email is required", 400, "INVALID_EMAIL");
  }

  const registrationId = await generateRegistrationId();
  const paymentStatus = asPaymentStatus(input.paymentStatus ?? input.data.paymentStatus);
  const registrationStatus = asRegistrationStatus(input.registrationStatus ?? input.data.registrationStatus);
  const accommodationStatus = asAccommodationStatus(
    input.accommodationStatus ??
      (common.accommodationRequired === "Yes" ? "Requested" : "Not Required")
  );

  const result = await prisma.$transaction(async (tx) => {
    const master = await tx.registration.create({
      data: {
        registrationId,
        registrationType: prismaType,
        registrationStatus,
        paymentStatus,
        accommodationStatus,
        ...common,
        metadata: input.data as Prisma.InputJsonValue,
        source: "supabase",
        submittedIp: input.submittedIp ?? null,
        userAgent: input.userAgent ?? null,
      },
    });

    const typeDocId = await createTypeExtension(tx, master.id, prismaType, input.data);

    if (common.accommodationRequired === "Yes" && prismaType !== "Accommodation") {
      await tx.accommodationRequest.upsert({
        where: { registrationId: master.id },
        create: {
          registrationId: master.id,
          status: "Requested",
          notes: input.data.accommodationNotes ? String(input.data.accommodationNotes) : null,
        },
        update: { status: "Requested" },
      });
    }

    if (input.data.payment && typeof input.data.payment === "object") {
      const payment = input.data.payment as Record<string, unknown>;
      await tx.paymentRecord.create({
        data: {
          registrationId: master.id,
          amount: Number(payment.registrationFee ?? common.registrationFee ?? 0),
          status: paymentStatus,
          razorpayOrderId: payment.razorpayOrderId ? String(payment.razorpayOrderId) : null,
          razorpayPaymentId: payment.razorpayPaymentId ? String(payment.razorpayPaymentId) : null,
          metadata: payment as Prisma.InputJsonValue,
        },
      });
    }

    return { master, typeDocId };
  });

  await writeAuditLog({
    action: "registration_created",
    registrationId: result.master.id,
    ipAddress: input.submittedIp ?? null,
    userAgent: input.userAgent ?? null,
    payload: {
      registrationId,
      registrationType: input.registrationType,
      typeDocId: result.typeDocId,
    },
  });

  return {
    registrationId,
    id: result.master.id,
    typeDocId: result.typeDocId,
  };
}

/** Admin-only — formatted registration view (public ID or UUID). */
export async function getRegistrationForAdminView(
  idOrPublicId: string
): Promise<AdminRegistrationView | null> {
  const isPublicId = /^SMK/.test(idOrPublicId);
  const row = await prisma.registration.findFirst({
    where: isPublicId
      ? { registrationId: idOrPublicId, deletedAt: null }
      : { id: idOrPublicId, deletedAt: null },
    include: {
      conclaveRegistration: true,
      delegateRegistration: true,
      exhibitionRegistration: true,
      awardsRegistration: true,
      bestPracticeRegistration: true,
      olympiadRegistration: true,
      talentRegistration: true,
      volunteerApplication: true,
      ngoRegistration: true,
      participantRegistration: true,
      accommodationRequest: true,
      uploadedFiles: { where: { isCurrent: true, deletedAt: null } },
      paymentRecords: { where: { deletedAt: null }, orderBy: { createdAt: "desc" }, take: 1 },
      emailLogs: { orderBy: { createdAt: "desc" }, take: 20 },
      statusHistory: { orderBy: { createdAt: "desc" }, take: 20 },
    },
  });

  if (!row) return null;
  const serialized = serializeRegistrationForAdmin(row);
  return buildAdminRegistrationView(serialized);
}

function serializeRegistrationForAdmin(row: object) {
  return JSON.parse(
    JSON.stringify(row, (_key, value) => {
      if (value instanceof Date) return value.toISOString();
      if (
        value != null &&
        typeof value === "object" &&
        "toNumber" in value &&
        typeof (value as { toNumber: () => number }).toNumber === "function"
      ) {
        return (value as { toNumber: () => number }).toNumber();
      }
      return value;
    })
  ) as Record<string, unknown>;
}

/** Admin-only — full registration row by public ID. */
export async function getRegistrationByPublicId(registrationId: string) {
  return getRegistrationForAdminView(registrationId);
}

/** Public lookup — requires verified email; returns summary fields only. */
export async function getPublicRegistrationSummary(
  registrationId: string,
  email: string
) {
  const row = await prisma.registration.findFirst({
    where: { registrationId, deletedAt: null },
    select: {
      registrationId: true,
      registrationType: true,
      fullName: true,
      institution: true,
      email: true,
      contactNumber: true,
      registrationFee: true,
      paymentStatus: true,
      razorpayPaymentId: true,
      razorpayOrderId: true,
      metadata: true,
      accommodationRequired: true,
      accommodationStatus: true,
      createdAt: true,
      updatedAt: true,
    },
  });

  if (!row) return null;
  if (!emailsMatch(row.email, email)) return null;

  const meta = (row.metadata ?? {}) as Record<string, unknown>;
  const category = String(
    meta.delegateCategory ??
      meta.category ??
      meta.projectStudentType ??
      meta.accommodationBedType ??
      displayRegistrationType(String(row.registrationType))
  );

  const qrDataUrl = await generateRegistrationQrDataUrl({
    registrationId: row.registrationId,
    fullName: row.fullName,
    registrationType: String(row.registrationType),
    category,
    institution: row.institution ?? "",
    email: row.email,
  });

  return toPublicRegistrationSummary({
    ...row,
    registrationType: String(row.registrationType),
    paymentStatus: String(row.paymentStatus),
    registrationFee: row.registrationFee != null ? Number(row.registrationFee) : 0,
    delegateCategory: category,
    accommodationRequired: row.accommodationRequired,
    accommodationStatus: row.accommodationStatus,
    createdAt: row.createdAt,
    updatedAt: row.updatedAt,
    qrDataUrl,
  });
}

export async function softDeleteRegistration(registrationId: string, context?: { ip?: string | null }) {
  const row = await prisma.registration.findFirst({
    where: { registrationId, deletedAt: null },
  });
  if (!row) throw new ServiceError("Registration not found", 404, "NOT_FOUND");

  await prisma.registration.update({
    where: { id: row.id },
    data: { deletedAt: new Date() },
  });

  await writeAuditLog({
    action: "registration_deleted",
    registrationId: row.id,
    ipAddress: context?.ip ?? null,
    payload: { registrationId },
  });

  return { success: true };
}

export async function listRegistrations(options: {
  limit?: number;
  offset?: number;
  type?: string;
  status?: string;
  search?: string;
}) {
  const { limit = 25, offset = 0, type, status, search } = options;
  const where: Prisma.RegistrationWhereInput = { deletedAt: null };
  if (type) where.registrationType = toPrismaRegistrationType(type);
  if (status) where.registrationStatus = asRegistrationStatus(status);
  if (search) {
    where.OR = [
      { fullName: { contains: search, mode: "insensitive" } },
      { email: { contains: search, mode: "insensitive" } },
      { registrationId: { contains: search, mode: "insensitive" } },
    ];
  }

  const [items, total] = await Promise.all([
    prisma.registration.findMany({
      where,
      orderBy: { createdAt: "desc" },
      take: limit,
      skip: offset,
    }),
    prisma.registration.count({ where }),
  ]);

  const serialized = items.map((row) => ({
    ...row,
    registrationFee:
      row.registrationFee != null ? Number(row.registrationFee) : null,
  }));

  return { items: serialized, total, limit, offset };
}

export type BulkStatusField =
  | "registrationStatus"
  | "paymentStatus"
  | "accommodationStatus";

export async function updateRegistrationsBulk(
  ids: string[],
  field: BulkStatusField,
  value: string
) {
  if (!ids.length) {
    throw new ServiceError("No registration IDs provided", 400, "INVALID_IDS");
  }

  const data: Prisma.RegistrationUpdateManyMutationInput = {
    updatedAt: new Date(),
  };

  if (field === "registrationStatus") {
    data.registrationStatus = asRegistrationStatus(value);
  } else if (field === "paymentStatus") {
    data.paymentStatus = asPaymentStatus(value);
  } else {
    data.accommodationStatus = asAccommodationStatus(value);
  }

  const result = await prisma.registration.updateMany({
    where: { id: { in: ids }, deletedAt: null },
    data,
  });

  await writeAuditLog({
    action: "registration_updated",
    payload: { ids, field, value, count: result.count },
  });

  return { updated: result.count };
}

export async function updateRegistrationByPublicId(
  registrationId: string,
  field: BulkStatusField,
  value: string,
  context?: { actorUserId?: string | null }
) {
  const row = await prisma.registration.findFirst({
    where: { registrationId, deletedAt: null },
  });
  if (!row) throw new ServiceError("Registration not found", 404, "NOT_FOUND");

  const data: Prisma.RegistrationUpdateInput = { updatedAt: new Date() };
  if (field === "registrationStatus") {
    const next = asRegistrationStatus(value);
    data.registrationStatus = next;
    if (row.registrationStatus !== next) {
      await prisma.registrationStatusHistory.create({
        data: {
          registrationId: row.id,
          fromStatus: row.registrationStatus,
          toStatus: next,
          changedByUserId: context?.actorUserId ?? null,
        },
      });
    }
  } else if (field === "paymentStatus") {
    data.paymentStatus = asPaymentStatus(value);
  } else {
    data.accommodationStatus = asAccommodationStatus(value);
  }

  await prisma.registration.update({ where: { id: row.id }, data });

  await writeAuditLog({
    action: field === "registrationStatus" ? "registration_status_changed" : "registration_updated",
    registrationId: row.id,
    actorUserId: context?.actorUserId ?? null,
    payload: { registrationId, field, value },
  });

  return { success: true };
}
