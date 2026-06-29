import type { Prisma } from "@prisma/client";
import { prisma } from "@/server/db/prisma";
import { ServiceError } from "@/server/lib/errors";
import { writeAuditLog } from "@/server/services/audit.service";
import { displayRegistrationType } from "@/server/services/admin/receipt-admin.service";
import { SITE_URL } from "@/config/site";

export async function listAlumni(options: {
  limit?: number;
  offset?: number;
  state?: string;
  eventEdition?: string;
  search?: string;
}) {
  const { limit = 50, offset = 0, state, eventEdition, search } = options;
  const where: Prisma.AlumniRecordWhereInput = {};
  if (state) where.state = { equals: state, mode: "insensitive" };
  if (eventEdition) where.eventEdition = eventEdition;
  if (search) {
    where.OR = [
      { fullName: { contains: search, mode: "insensitive" } },
      { email: { contains: search, mode: "insensitive" } },
      { institution: { contains: search, mode: "insensitive" } },
    ];
  }

  const [items, total] = await Promise.all([
    prisma.alumniRecord.findMany({
      where,
      orderBy: { convertedAt: "desc" },
      take: limit,
      skip: offset,
      include: {
        registration: { select: { registrationId: true, registrationType: true } },
      },
    }),
    prisma.alumniRecord.count({ where }),
  ]);

  return { items, total, limit, offset };
}

export async function convertAttendeesToAlumni(options: {
  eventEdition?: string;
  registrationIds?: string[];
  actorUserId?: string;
}) {
  const edition = options.eventEdition ?? "SMK2026";
  const where = {
    deletedAt: null,
    checkInStatus: "Checked_In" as const,
    alumniRecord: null,
    ...(options.registrationIds?.length
      ? { registrationId: { in: options.registrationIds } }
      : {}),
  };

  const attendees = await prisma.registration.findMany({
    where,
    include: {
      sessionAttendances: true,
      researchSubmissions: true,
      attendeeCertificate: true,
    },
    take: options.registrationIds?.length ? undefined : 500,
  });

  const converted: string[] = [];

  for (const reg of attendees) {
    const history = [
      {
        event: edition,
        category: displayRegistrationType(String(reg.registrationType)),
        checkInAt: reg.checkedInAt?.toISOString(),
        sessions: reg.sessionAttendances.map((s) => s.sessionName),
        certificateIssued: Boolean(reg.attendeeCertificate),
        researchPapers: reg.researchSubmissions.map((r) => r.title),
      },
    ];

    const interests: string[] = [];
    if (reg.registrationType === "Volunteer") interests.push("Volunteering");
    if (reg.researchSubmissions.length) interests.push("Research");

    await prisma.alumniRecord.create({
      data: {
        registrationId: reg.id,
        eventEdition: edition,
        fullName: reg.fullName,
        email: reg.email,
        institution: reg.institution,
        state: reg.state,
        interests,
        researchAreas: reg.researchSubmissions.map((r) => r.title.slice(0, 80)),
        participationHistory: history,
      },
    });
    converted.push(reg.registrationId);
  }

  if (converted.length) {
    await writeAuditLog({
      action: "alumni_converted",
      actorUserId: options.actorUserId,
      payload: { count: converted.length, eventEdition: edition },
    });
  }

  return { converted, count: converted.length };
}

export async function updateAlumni(
  id: string,
  data: { interests?: string[]; researchAreas?: string[]; state?: string }
) {
  return prisma.alumniRecord.update({
    where: { id },
    data: {
      ...(data.interests ? { interests: data.interests } : {}),
      ...(data.researchAreas ? { researchAreas: data.researchAreas } : {}),
      ...(data.state !== undefined ? { state: data.state } : {}),
    },
  });
}

export async function getParticipantDashboard(registrationId: string, email: string) {
  const reg = await prisma.registration.findFirst({
    where: { registrationId, deletedAt: null },
    include: {
      accommodationRequest: { include: { room: true } },
      attendeeCertificate: true,
      attendeeBadge: true,
      sessionAttendances: { include: { eventSession: true }, orderBy: { attendedAt: "desc" } },
      researchSubmissions: { select: { id: true, title: true, status: true } },
    },
  });

  if (!reg) return null;
  if (reg.email.toLowerCase() !== email.toLowerCase()) return null;

  const certUrl = reg.attendeeCertificate
    ? `${SITE_URL}/certificate/verify/${reg.attendeeCertificate.verifyCode}`
    : null;

  return {
    registrationId: reg.registrationId,
    fullName: reg.fullName,
    email: reg.email,
    category: displayRegistrationType(String(reg.registrationType)),
    institution: reg.institution,
    paymentStatus: String(reg.paymentStatus).replace(/_/g, " "),
    checkInStatus: String(reg.checkInStatus).replace(/_/g, " "),
    accommodation: reg.accommodationRequest
      ? {
          status: String(reg.accommodationRequest.status).replace(/_/g, " "),
          building: reg.accommodationRequest.building ?? reg.accommodationRequest.room?.building,
          roomNumber: reg.accommodationRequest.roomNumber ?? reg.accommodationRequest.room?.roomNumber,
          bedNumber: reg.accommodationRequest.bedNumber ?? reg.accommodationRequest.room?.bedNumber,
          checkInDate: reg.accommodationRequest.checkInDate?.toISOString().slice(0, 10),
          checkOutDate: reg.accommodationRequest.checkOutDate?.toISOString().slice(0, 10),
        }
      : null,
    certificate: reg.attendeeCertificate
      ? {
          certificateNo: reg.attendeeCertificate.certificateNo,
          type: reg.attendeeCertificate.certificateType,
          verifyUrl: certUrl,
          issuedAt: reg.attendeeCertificate.issuedAt?.toISOString(),
        }
      : null,
    badgeAvailable: Boolean(reg.attendeeBadge?.generatedAt) || reg.paymentStatus === "Paid",
    receiptAvailable:
      reg.paymentStatus === "Paid" || reg.paymentStatus === "Not_Required",
    qrAvailable: true,
    sessions: reg.sessionAttendances.map((s) => ({
      name: s.sessionName,
      attendedAt: s.attendedAt.toISOString(),
      venue: s.eventSession?.venue,
    })),
    research: reg.researchSubmissions.map((r) => ({
      title: r.title,
      status: String(r.status).replace(/_/g, " "),
    })),
    canUpdateProfile: true,
    profile: {
      contactNumber: reg.contactNumber,
      whatsappNumber: reg.whatsappNumber,
      address: reg.address,
      designation: reg.designation,
    },
  };
}

export async function updateParticipantProfile(
  registrationId: string,
  email: string,
  data: { contactNumber?: string; whatsappNumber?: string; address?: string }
) {
  const reg = await prisma.registration.findFirst({
    where: { registrationId, deletedAt: null },
  });
  if (!reg) throw new ServiceError("Registration not found", 404);
  if (reg.email.toLowerCase() !== email.toLowerCase()) {
    throw new ServiceError("Unauthorized", 403);
  }

  return prisma.registration.update({
    where: { id: reg.id },
    data: {
      ...(data.contactNumber ? { contactNumber: data.contactNumber.trim() } : {}),
      ...(data.whatsappNumber !== undefined ? { whatsappNumber: data.whatsappNumber.trim() || null } : {}),
      ...(data.address ? { address: data.address.trim() } : {}),
    },
  });
}
