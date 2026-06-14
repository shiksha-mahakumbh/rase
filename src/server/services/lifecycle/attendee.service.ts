import type { Prisma, RegistrationType, CheckInStatus, PaymentStatus } from "@prisma/client";
import { prisma } from "@/server/db/prisma";
import { displayRegistrationType } from "@/server/services/admin/receipt-admin.service";

export type AttendeeListOptions = {
  limit?: number;
  offset?: number;
  search?: string;
  category?: string;
  state?: string;
  institution?: string;
  checkInStatus?: string;
  paymentStatus?: string;
};

function resolveState(reg: {
  state: string | null;
  address: string;
  metadata: unknown;
}): string {
  if (reg.state?.trim()) return reg.state.trim();
  const meta = (reg.metadata ?? {}) as Record<string, unknown>;
  if (typeof meta.state === "string" && meta.state.trim()) return meta.state.trim();
  const parts = reg.address.split(",").map((s) => s.trim());
  if (parts.length >= 2) return parts[parts.length - 2] ?? "—";
  return "—";
}

function qrStatus(reg: { qrGeneratedAt: Date | null }) {
  return reg.qrGeneratedAt ? "generated" : "missing";
}

function certificateStatus(reg: {
  certificateLifecycleStatus: string;
  attendeeCertificate: { certificateNo: string } | null;
}) {
  if (reg.attendeeCertificate) return "issued";
  return reg.certificateLifecycleStatus.replace(/_/g, " ");
}

export function mapAttendeeRow(reg: {
  id: string;
  registrationId: string;
  fullName: string;
  email: string;
  contactNumber: string;
  registrationType: RegistrationType;
  institution: string;
  state: string | null;
  address: string;
  metadata: unknown;
  paymentStatus: PaymentStatus;
  checkInStatus: CheckInStatus;
  accommodationStatus: string;
  certificateLifecycleStatus: string;
  qrGeneratedAt: Date | null;
  createdAt: Date;
  attendeeCertificate: { certificateNo: string } | null;
}) {
  return {
    id: reg.id,
    registrationId: reg.registrationId,
    name: reg.fullName,
    email: reg.email,
    mobile: reg.contactNumber,
    category: displayRegistrationType(String(reg.registrationType)),
    registrationType: reg.registrationType,
    institution: reg.institution,
    state: resolveState(reg),
    paymentStatus: reg.paymentStatus.replace(/_/g, " "),
    checkInStatus: reg.checkInStatus.replace(/_/g, " "),
    accommodationStatus: reg.accommodationStatus.replace(/_/g, " "),
    certificateStatus: certificateStatus(reg),
    qrStatus: qrStatus(reg),
    createdAt: reg.createdAt.toISOString(),
  };
}

export async function listAttendees(options: AttendeeListOptions) {
  const {
    limit = 25,
    offset = 0,
    search,
    category,
    state,
    institution,
    checkInStatus,
    paymentStatus,
  } = options;

  const where: Prisma.RegistrationWhereInput = { deletedAt: null };

  if (category) where.registrationType = category as RegistrationType;
  if (state) where.state = { contains: state, mode: "insensitive" };
  if (institution) where.institution = { contains: institution, mode: "insensitive" };
  if (checkInStatus) {
    const map: Record<string, CheckInStatus> = {
      "Checked In": "Checked_In",
      "Not Checked In": "Not_Checked_In",
      Checked_In: "Checked_In",
      Not_Checked_In: "Not_Checked_In",
    };
    if (map[checkInStatus]) where.checkInStatus = map[checkInStatus];
  }
  if (paymentStatus) {
    const map: Record<string, PaymentStatus> = {
      Paid: "Paid",
      "Pending Payment": "Pending_Payment",
      Failed: "Failed",
    };
    if (map[paymentStatus]) where.paymentStatus = map[paymentStatus];
  }
  if (search?.trim()) {
    const q = search.trim();
    where.OR = [
      { registrationId: { contains: q, mode: "insensitive" } },
      { fullName: { contains: q, mode: "insensitive" } },
      { email: { contains: q, mode: "insensitive" } },
      { contactNumber: { contains: q } },
      { institution: { contains: q, mode: "insensitive" } },
    ];
  }

  const [rows, total] = await Promise.all([
    prisma.registration.findMany({
      where,
      orderBy: { createdAt: "desc" },
      take: limit,
      skip: offset,
      include: { attendeeCertificate: { select: { certificateNo: true } } },
    }),
    prisma.registration.count({ where }),
  ]);

  return {
    items: rows.map(mapAttendeeRow),
    total,
    limit,
    offset,
  };
}

export async function exportAttendeesCsv(options: Omit<AttendeeListOptions, "limit" | "offset">) {
  const { items } = await listAttendees({ ...options, limit: 5000, offset: 0 });
  const header = [
    "Registration ID",
    "Name",
    "Email",
    "Mobile",
    "Category",
    "Institution",
    "State",
    "Payment Status",
    "Check-in Status",
    "Accommodation Status",
    "Certificate Status",
    "QR Status",
    "Created Date",
  ];
  const lines = items.map((r) =>
    [
      r.registrationId,
      r.name,
      r.email,
      r.mobile,
      r.category,
      r.institution,
      r.state,
      r.paymentStatus,
      r.checkInStatus,
      r.accommodationStatus,
      r.certificateStatus,
      r.qrStatus,
      r.createdAt,
    ]
      .map((c) => `"${String(c).replace(/"/g, '""')}"`)
      .join(",")
  );
  return [header.join(","), ...lines].join("\n");
}

export async function getAttendeeIdsForBulk(filter: Record<string, string>) {
  const { items } = await listAttendees({
    category: filter.category,
    state: filter.state,
    institution: filter.institution,
    checkInStatus: filter.checkInStatus,
    paymentStatus: filter.paymentStatus,
    search: filter.search,
    limit: 500,
    offset: 0,
  });
  return items.map((i) => i.registrationId);
}
