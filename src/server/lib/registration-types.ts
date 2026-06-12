import type {
  RegistrationType as PrismaRegistrationType,
  Gender,
  YesNo,
  VidyaBhartiStatus,
  PaymentStatus,
  RegistrationStatus,
  AccommodationStatus,
} from "@prisma/client";
import { ServiceError } from "@/server/lib/errors";

export const SUPPORTED_V2_TYPES = [
  "Conclave",
  "Delegate Registration",
  "Delegate",
  "Exhibition",
  "Accommodation",
  "Volunteer",
  "School Program",
  "Olympiad",
  "Awards",
  "Best Practices",
  "Talent",
  "NGO",
  "Paper Submission",
  "Abstract Submission",
  "Projects",
  "Organiser",
] as const;

export type SupportedRegistrationType = (typeof SUPPORTED_V2_TYPES)[number];

const TYPE_MAP: Record<string, PrismaRegistrationType> = {
  Conclave: "Conclave",
  Delegate: "Delegate",
  "Delegate Registration": "Delegate",
  Exhibition: "Exhibition",
  Accommodation: "Accommodation",
  Volunteer: "Volunteer",
  "School Program": "Participant",
  Olympiad: "Olympiad",
  Awards: "Awards",
  "Best Practices": "Best_Practices",
  Talent: "Talent",
  NGO: "NGO",
  "Paper Submission": "Legacy_Other",
  "Abstract Submission": "Legacy_Other",
  Projects: "Exhibition",
  Organiser: "Legacy_Other",
};

export function toPrismaRegistrationType(type: string): PrismaRegistrationType {
  const mapped = TYPE_MAP[type];
  if (!mapped) {
    throw new ServiceError(`Unsupported registration type: ${type}`, 400, "INVALID_TYPE");
  }
  return mapped;
}

export function isSupportedType(type: string): boolean {
  return type in TYPE_MAP;
}

export function asGender(value: unknown): Gender {
  const v = String(value ?? "Other");
  if (v === "Male" || v === "Female" || v === "Other") return v;
  return "Other";
}

export function asYesNo(value: unknown): YesNo {
  return String(value) === "Yes" ? "Yes" : "No";
}

export function asVidyaBharti(value: unknown): VidyaBhartiStatus {
  return String(value) === "Vidya Bharti" ? "Vidya_Bharti" : "Non_Vidya_Bharti";
}

export function asPaymentStatus(value: unknown): PaymentStatus {
  const v = String(value ?? "Not Required");
  const map: Record<string, PaymentStatus> = {
    "Pending Payment": "Pending_Payment",
    Paid: "Paid",
    Failed: "Failed",
    Submitted: "Submitted",
    "Not Required": "Not_Required",
  };
  return map[v] ?? "Not_Required";
}

export function asRegistrationStatus(value: unknown): RegistrationStatus {
  const v = String(value ?? "Submitted");
  if (["Pending", "Submitted", "Verified", "Approved", "Rejected"].includes(v)) {
    return v as RegistrationStatus;
  }
  return "Submitted";
}

export function asAccommodationStatus(value: unknown): AccommodationStatus {
  const v = String(value ?? "Not Required");
  const map: Record<string, AccommodationStatus> = {
    "Not Required": "Not_Required",
    Requested: "Requested",
    Confirmed: "Confirmed",
    Allocated: "Allocated",
  };
  return map[v] ?? "Not_Required";
}

export function extractCommonFields(data: Record<string, unknown>) {
  return {
    fullName: String(data.fullName ?? "").trim(),
    gender: asGender(data.gender),
    designation: String(data.designation ?? "").trim() || "N/A",
    institution: String(data.institution ?? "").trim() || "N/A",
    address: String(data.address ?? "").trim() || "N/A",
    country: String(data.country ?? "India").trim(),
    email: String(data.email ?? "").trim().toLowerCase(),
    contactNumber: String(data.contactNumber ?? data.phone ?? "").trim(),
    whatsappNumber: data.whatsappNumber ? String(data.whatsappNumber) : null,
    vidyaBharti: asVidyaBharti(data.vidyaBharti),
    accommodationRequired: asYesNo(data.accommodationRequired),
    accommodationDate: data.accommodationDate ? String(data.accommodationDate) : null,
    accommodationType: data.accommodationType ? String(data.accommodationType) : null,
    participantCategory: data.participantCategory ? String(data.participantCategory) : null,
    registrationFee: data.registrationFee != null ? Number(data.registrationFee) : null,
    utrNumber: data.utrNumber ? String(data.utrNumber) : null,
    transactionId: data.transactionId ? String(data.transactionId) : null,
    razorpayOrderId: data.razorpayOrderId ? String(data.razorpayOrderId) : null,
    razorpayPaymentId: data.razorpayPaymentId ? String(data.razorpayPaymentId) : null,
  };
}
