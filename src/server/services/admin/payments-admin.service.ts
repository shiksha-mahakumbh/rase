import type { Prisma, PaymentStatus, RegistrationStatus, EmailDeliveryStatus } from "@prisma/client";
import { prisma } from "@/server/db/prisma";
import {
  deriveArtifactStatus,
  displayRegistrationType,
} from "@/server/services/admin/receipt-admin.service";

export type AdminPaymentListOptions = {
  limit?: number;
  offset?: number;
  search?: string;
  dateFrom?: string;
  dateTo?: string;
  category?: string;
  paymentStatus?: string;
  registrationStatus?: string;
  emailStatus?: string;
};

function parseDateStart(value: string) {
  const d = new Date(value);
  d.setHours(0, 0, 0, 0);
  return d;
}

function parseDateEnd(value: string) {
  const d = new Date(value);
  d.setHours(23, 59, 59, 999);
  return d;
}

function mapPaymentStatusFilter(value: string): PaymentStatus | undefined {
  const map: Record<string, PaymentStatus> = {
    "Pending Payment": "Pending_Payment",
    Pending_Payment: "Pending_Payment",
    Paid: "Paid",
    Failed: "Failed",
    Submitted: "Submitted",
    "Not Required": "Not_Required",
    Not_Required: "Not_Required",
  };
  return map[value];
}

function mapRegistrationStatusFilter(value: string): RegistrationStatus | undefined {
  const allowed = ["Pending", "Submitted", "Verified", "Approved", "Rejected"];
  return allowed.includes(value) ? (value as RegistrationStatus) : undefined;
}

export async function listAdminPayments(options: AdminPaymentListOptions) {
  const {
    limit = 25,
    offset = 0,
    search,
    dateFrom,
    dateTo,
    category,
    paymentStatus,
    registrationStatus,
    emailStatus,
  } = options;

  const where: Prisma.RegistrationWhereInput = { deletedAt: null };

  if (dateFrom || dateTo) {
    where.createdAt = {};
    if (dateFrom) where.createdAt.gte = parseDateStart(dateFrom);
    if (dateTo) where.createdAt.lte = parseDateEnd(dateTo);
  }

  if (paymentStatus) {
    const ps = mapPaymentStatusFilter(paymentStatus);
    if (ps) where.paymentStatus = ps;
  }

  if (registrationStatus) {
    const rs = mapRegistrationStatusFilter(registrationStatus);
    if (rs) where.registrationStatus = rs;
  }

  if (emailStatus) {
    where.emailDeliveryStatus = emailStatus as EmailDeliveryStatus;
  }

  if (category) {
    where.registrationType = category as Prisma.EnumRegistrationTypeFilter;
  }

  if (search?.trim()) {
    const q = search.trim();
    where.OR = [
      { registrationId: { contains: q, mode: "insensitive" } },
      { email: { contains: q, mode: "insensitive" } },
      { fullName: { contains: q, mode: "insensitive" } },
      { contactNumber: { contains: q } },
      { razorpayPaymentId: { contains: q, mode: "insensitive" } },
      { razorpayOrderId: { contains: q, mode: "insensitive" } },
      { utrNumber: { contains: q, mode: "insensitive" } },
    ];
  }

  const [rows, total] = await Promise.all([
    prisma.registration.findMany({
      where,
      orderBy: { createdAt: "desc" },
      take: limit,
      skip: offset,
      include: {
        paymentRecords: {
          where: { deletedAt: null },
          orderBy: { createdAt: "desc" },
          take: 1,
        },
        emailLogs: {
          orderBy: { createdAt: "desc" },
          take: 1,
          select: { status: true, sentAt: true, template: true },
        },
      },
    }),
    prisma.registration.count({ where }),
  ]);

  const items = rows.map((reg) => {
    const payment = reg.paymentRecords[0];
    const artifacts = deriveArtifactStatus(reg);

    return {
      id: reg.id,
      registrationId: reg.registrationId,
      registrationCategory: displayRegistrationType(String(reg.registrationType)),
      registrationType: reg.registrationType,
      applicantName: reg.fullName,
      email: reg.email,
      mobile: reg.contactNumber,
      razorpayOrderId: reg.razorpayOrderId ?? payment?.razorpayOrderId ?? null,
      razorpayPaymentId: reg.razorpayPaymentId ?? payment?.razorpayPaymentId ?? null,
      amount: Number(reg.registrationFee ?? payment?.amount ?? 0),
      paymentStatus: reg.paymentStatus.replace(/_/g, " "),
      registrationStatus: reg.registrationStatus,
      receiptStatus: artifacts.receipt,
      emailStatus: artifacts.email,
      qrStatus: artifacts.qr,
      createdAt: reg.createdAt.toISOString(),
      receiptGeneratedAt: reg.receiptGeneratedAt?.toISOString() ?? null,
      qrStoragePath: reg.qrStoragePath,
    };
  });

  return { items, total, limit, offset };
}

export async function listPaymentAuditLogs(options: {
  limit?: number;
  offset?: number;
  registrationId?: string;
  paymentId?: string;
  orderId?: string;
}) {
  const { limit = 50, offset = 0, registrationId, paymentId, orderId } = options;

  const paymentActions = [
    "payment_created",
    "payment_completed",
    "payment_captured",
    "payment_failed",
    "payment_verified",
    "payment_recovered",
    "order_created",
    "payment_initiated",
    "registration_saved",
    "registration_created",
    "receipt_generated",
    "qr_generated",
    "email_sent",
    "email_failed",
    "email_resent",
    "webhook_retried",
  ] as const;

  const where: Prisma.AuditLogWhereInput = {
    action: { in: [...paymentActions] },
  };

  if (registrationId) {
    const reg = await prisma.registration.findFirst({
      where: {
        OR: [
          { registrationId, deletedAt: null },
          { id: registrationId, deletedAt: null },
        ],
      },
      select: { id: true },
    });
    if (reg) where.registrationId = reg.id;
  }

  const [items, total] = await Promise.all([
    prisma.auditLog.findMany({
      where,
      orderBy: { createdAt: "desc" },
      take: limit,
      skip: offset,
      include: {
        registration: {
          select: {
            registrationId: true,
            email: true,
            razorpayPaymentId: true,
            razorpayOrderId: true,
          },
        },
      },
    }),
    prisma.auditLog.count({ where }),
  ]);

  const filtered = items.filter((row) => {
    if (!paymentId && !orderId) return true;
    const payload = row.payload as Record<string, unknown>;
    const reg = row.registration;
    if (paymentId) {
      const pid = String(
        payload.payment_id ?? payload.razorpayPaymentId ?? reg?.razorpayPaymentId ?? ""
      );
      if (!pid.includes(paymentId)) return false;
    }
    if (orderId) {
      const oid = String(
        payload.order_id ?? payload.razorpayOrderId ?? reg?.razorpayOrderId ?? ""
      );
      if (!oid.includes(orderId)) return false;
    }
    return true;
  });

  return {
    items: filtered.map((row) => {
      const payload = row.payload as Record<string, unknown>;
      return {
        id: row.id,
        action: row.action,
        timestamp: row.createdAt.toISOString(),
        registrationId:
          row.registration?.registrationId ??
          String(payload.registration_id ?? payload.publicRegistrationId ?? "—"),
        orderId: String(payload.order_id ?? row.registration?.razorpayOrderId ?? "—"),
        paymentId: String(payload.payment_id ?? row.registration?.razorpayPaymentId ?? "—"),
        userEmail: String(payload.user_email ?? row.registration?.email ?? "—"),
        payload,
      };
    }),
    total: paymentId || orderId ? filtered.length : total,
    limit,
    offset,
  };
}
