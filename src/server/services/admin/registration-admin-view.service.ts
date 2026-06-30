import type { Prisma } from "@prisma/client";
import { getSupabaseAdmin } from "@/server/db/supabase";
import { displayRegistrationType } from "@/server/lib/registration-type-labels";
import {
  displayAccommodationStatus,
  displayCertificateStatus,
  displayCheckInStatus,
  displayGender,
  displayPaymentStatus,
  displayRegistrationStatus,
  displayUploadFieldName,
  displayVidyaBharti,
  humanizeFieldKey,
  paymentStatusOptionsForRegistration,
  REGISTRATION_STATUS_OPTIONS,
} from "@/lib/admin/registration-labels";

const TYPE_RELATION_KEYS = [
  "conclaveRegistration",
  "delegateRegistration",
  "exhibitionRegistration",
  "awardsRegistration",
  "bestPracticeRegistration",
  "olympiadRegistration",
  "talentRegistration",
  "volunteerApplication",
  "ngoRegistration",
  "participantRegistration",
] as const;

const SKIP_TYPE_KEYS = new Set([
  "id",
  "registrationId",
  "createdAt",
  "updatedAt",
  "deletedAt",
]);

const SKIP_METADATA_KEYS = new Set([
  "paymentReceipt",
  "supportingPdf",
  "supportingPhotos",
  "recommendationLetter",
  "studentList",
  "receipt",
]);

import type { AdminRegistrationView, AdminRegistrationDocument } from "@/lib/admin/registration-detail-types";

async function freshSignedUrl(bucket: string, storagePath: string): Promise<string | null> {
  try {
    const supabase = getSupabaseAdmin();
    const { data, error } = await supabase.storage
      .from(bucket)
      .createSignedUrl(storagePath, 3600);
    if (error || !data?.signedUrl) return null;
    return data.signedUrl;
  } catch {
    return null;
  }
}

function fileMetaUrl(meta: unknown): string | null {
  if (!meta || typeof meta !== "object") return null;
  const url = (meta as { url?: string }).url;
  return typeof url === "string" && url.trim() ? url : null;
}

function flattenTypeDetails(row: Record<string, unknown>): Record<string, string> {
  const out: Record<string, string> = {};
  for (const key of TYPE_RELATION_KEYS) {
    const rel = row[key];
    if (!rel || typeof rel !== "object") continue;
    for (const [field, value] of Object.entries(rel as Record<string, unknown>)) {
      if (SKIP_TYPE_KEYS.has(field)) continue;
      if (value == null || value === "") continue;
      if (typeof value === "object") continue;
      out[humanizeFieldKey(field)] = String(value);
    }
  }
  return out;
}

function extractExtraMetadata(metadata: unknown, typeDetails: Record<string, string>): Record<string, string> {
  if (!metadata || typeof metadata !== "object") return {};
  const out: Record<string, string> = {};
  for (const [key, value] of Object.entries(metadata as Record<string, unknown>)) {
    if (SKIP_METADATA_KEYS.has(key)) continue;
    if (key in typeDetails) continue;
    if (value == null || value === "") continue;
    if (typeof value === "object") continue;
    out[humanizeFieldKey(key)] = String(value);
  }
  return out;
}

export async function buildAdminRegistrationView(
  row: Record<string, unknown>
): Promise<AdminRegistrationView> {
  const registrationId = String(row.registrationId ?? "");
  const prismaType = String(row.registrationType ?? "");
  const displayType = displayRegistrationType(prismaType);
  const fee = row.registrationFee != null ? Number(row.registrationFee) : null;

  const uploadedFiles = Array.isArray(row.uploadedFiles) ? row.uploadedFiles : [];
  const documents: AdminRegistrationDocument[] = [];
  const seen = new Set<string>();

  for (const file of uploadedFiles) {
    if (!file || typeof file !== "object") continue;
    const f = file as Record<string, unknown>;
    const fieldName = String(f.fieldName ?? "file");
    const storagePath = String(f.storagePath ?? "");
    const bucket = String(f.bucket ?? "registrations");
    const label = displayUploadFieldName(fieldName);
    let url = storagePath ? await freshSignedUrl(bucket, storagePath) : null;
    if (!url && typeof f.signedUrl === "string") url = f.signedUrl;
    if (!url) continue;
    const dedupe = `${fieldName}:${url}`;
    if (seen.has(dedupe)) continue;
    seen.add(dedupe);
    documents.push({ label, url, fieldName });
  }

  const legacyFileFields: Array<[string, string]> = [
    ["paymentReceipt", "Payment Receipt"],
    ["supportingPdf", "Supporting PDF"],
    ["recommendationLetter", "Recommendation Letter"],
    ["studentList", "Student List"],
  ];
  for (const [field, label] of legacyFileFields) {
    const url = fileMetaUrl(row[field]);
    if (!url || seen.has(`${field}:${url}`)) continue;
    seen.add(`${field}:${url}`);
    documents.push({ label, url, fieldName: field });
  }

  const photos = row.supportingPhotos;
  if (Array.isArray(photos)) {
    photos.forEach((p, i) => {
      const url = fileMetaUrl(p);
      if (!url) return;
      const key = `photo-${i}:${url}`;
      if (seen.has(key)) return;
      seen.add(key);
      documents.push({ label: `Supporting Photo ${i + 1}`, url, fieldName: "supportingPhotos" });
    });
  }

  const metadata = row.metadata;
  const typeDetails = flattenTypeDetails(row);
  const extraMetadata = extractExtraMetadata(metadata, typeDetails);

  const paymentRecords = Array.isArray(row.paymentRecords) ? row.paymentRecords : [];
  const latestPayment = paymentRecords[0] as Record<string, unknown> | undefined;

  const delegate = row.delegateRegistration as Record<string, unknown> | undefined;
  const chequeNumber =
    (delegate?.chequeNumber as string | undefined) ??
    (row.chequeNumber as string | undefined) ??
    null;
  const panNumber =
    (delegate?.panNumber as string | undefined) ?? (row.panNumber as string | undefined) ?? null;

  const emailLogs = (Array.isArray(row.emailLogs) ? row.emailLogs : []).map((log) => {
    const e = log as Record<string, unknown>;
    return {
      subject: String(e.subject ?? ""),
      status: String(e.status ?? ""),
      sentAt: e.sentAt ? String(e.sentAt) : null,
      createdAt: String(e.createdAt ?? ""),
    };
  });

  const statusHistory = (Array.isArray(row.statusHistory) ? row.statusHistory : []).map((h) => {
    const s = h as Record<string, unknown>;
    return {
      fromStatus: s.fromStatus ? displayRegistrationStatus(s.fromStatus) : null,
      toStatus: displayRegistrationStatus(s.toStatus),
      createdAt: String(s.createdAt ?? ""),
    };
  });

  const accommodationRequired = String(row.accommodationRequired ?? "No");

  return {
    id: String(row.id ?? ""),
    registrationId,
    registrationType: displayType,
    registrationStatus: displayRegistrationStatus(row.registrationStatus),
    paymentStatus: displayPaymentStatus(row.paymentStatus),
    accommodationStatus: displayAccommodationStatus(row.accommodationStatus),
    emailDeliveryStatus: row.emailDeliveryStatus ? String(row.emailDeliveryStatus) : null,
    personal: {
      fullName: String(row.fullName ?? ""),
      gender: displayGender(row.gender),
      designation: String(row.designation ?? ""),
      institution: String(row.institution ?? ""),
      address: String(row.address ?? ""),
      country: String(row.country ?? ""),
      email: String(row.email ?? ""),
      contactNumber: String(row.contactNumber ?? ""),
      whatsappNumber: row.whatsappNumber ? String(row.whatsappNumber) : null,
      vidyaBharti: displayVidyaBharti(row.vidyaBharti),
    },
    accommodation:
      accommodationRequired === "Yes"
        ? {
            required: accommodationRequired,
            date: row.accommodationDate ? String(row.accommodationDate) : null,
            type: row.accommodationType ? String(row.accommodationType) : null,
            category: row.participantCategory ? String(row.participantCategory) : null,
            status: displayAccommodationStatus(row.accommodationStatus),
          }
        : null,
    payment: {
      status: displayPaymentStatus(row.paymentStatus),
      utrNumber: row.utrNumber ? String(row.utrNumber) : null,
      transactionId: row.transactionId ? String(row.transactionId) : null,
      chequeNumber,
      panNumber,
      registrationFee: fee,
      razorpayOrderId: row.razorpayOrderId ? String(row.razorpayOrderId) : null,
      razorpayPaymentId: row.razorpayPaymentId ? String(row.razorpayPaymentId) : null,
      latestRecord: latestPayment
        ? {
            amount: Number(latestPayment.amount ?? 0),
            status: displayPaymentStatus(latestPayment.status),
            currency: String(latestPayment.currency ?? "INR"),
            razorpayPaymentId: latestPayment.razorpayPaymentId
              ? String(latestPayment.razorpayPaymentId)
              : null,
            createdAt: String(latestPayment.createdAt ?? ""),
          }
        : null,
    },
    lifecycle: {
      checkInStatus: displayCheckInStatus(row.checkInStatus),
      checkedInAt: row.checkedInAt ? String(row.checkedInAt) : null,
      checkInLocation: row.checkInLocation ? String(row.checkInLocation) : null,
      kitDistributed: Boolean(row.kitDistributed),
      kitDistributedAt: row.kitDistributedAt ? String(row.kitDistributedAt) : null,
      certificateEligible: Boolean(row.certificateEligible),
      certificateLifecycleStatus: displayCertificateStatus(row.certificateLifecycleStatus),
      receiptGeneratedAt: row.receiptGeneratedAt ? String(row.receiptGeneratedAt) : null,
      receiptSentAt: row.receiptSentAt ? String(row.receiptSentAt) : null,
      qrGeneratedAt: row.qrGeneratedAt ? String(row.qrGeneratedAt) : null,
    },
    typeDetails,
    extraMetadata,
    documents,
    emailLogs,
    statusHistory,
    statusOptions: {
      registration: [...REGISTRATION_STATUS_OPTIONS],
      payment: paymentStatusOptionsForRegistration(displayType, fee),
      accommodation: ["Not Required", "Requested", "Confirmed", "Allocated"],
    },
    links: {
      receiptsAdmin: `/admin/cms/receipts`,
      paymentAudit: `/admin/cms/payment-audit`,
      checkIn: `/admin/cms/checkin?id=${encodeURIComponent(row.registrationId)}`,
    },
    createdAt: String(row.createdAt ?? ""),
    updatedAt: String(row.updatedAt ?? ""),
  };
}
