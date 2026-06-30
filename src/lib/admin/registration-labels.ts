/** Human-readable labels for Prisma registration enums (shared admin UI + server). */

const PAYMENT_LABELS: Record<string, string> = {
  Pending_Payment: "Pending Payment",
  Paid: "Paid",
  Failed: "Failed",
  Submitted: "Submitted",
  Not_Required: "Not Required",
  Pending: "Pending Payment",
};

const ACCOMMODATION_LABELS: Record<string, string> = {
  Not_Required: "Not Required",
  Requested: "Requested",
  Confirmed: "Confirmed",
  Allocated: "Allocated",
};

const VIDYA_LABELS: Record<string, string> = {
  Vidya_Bharti: "Vidya Bharti",
  Non_Vidya_Bharti: "Non Vidya Bharti",
};

const CHECK_IN_LABELS: Record<string, string> = {
  Not_Checked_In: "Not Checked In",
  Checked_In: "Checked In",
};

const CERTIFICATE_LABELS: Record<string, string> = {
  Not_Applicable: "Not Applicable",
  Not_Eligible: "Not Eligible",
  Eligible: "Eligible",
  Issued: "Issued",
  Revoked: "Revoked",
};

const UPLOAD_FIELD_LABELS: Record<string, string> = {
  paymentReceipt: "Payment Receipt",
  supportingPdf: "Supporting PDF",
  supportingPhotos: "Supporting Photo",
  recommendationLetter: "Recommendation Letter",
  studentList: "Student List",
  resume: "Resume",
  paper: "Paper",
  file: "Uploaded File",
  download: "Download",
};

export function displayPaymentStatus(value: unknown): string {
  const key = String(value ?? "");
  return PAYMENT_LABELS[key] ?? key.replace(/_/g, " ");
}

export function displayAccommodationStatus(value: unknown): string {
  const key = String(value ?? "");
  return ACCOMMODATION_LABELS[key] ?? key.replace(/_/g, " ");
}

export function displayRegistrationStatus(value: unknown): string {
  return String(value ?? "Submitted");
}

export function displayVidyaBharti(value: unknown): string {
  const key = String(value ?? "");
  return VIDYA_LABELS[key] ?? key.replace(/_/g, " ");
}

export function displayGender(value: unknown): string {
  return String(value ?? "—");
}

export function displayCheckInStatus(value: unknown): string {
  const key = String(value ?? "");
  return CHECK_IN_LABELS[key] ?? key.replace(/_/g, " ");
}

export function displayCertificateStatus(value: unknown): string {
  const key = String(value ?? "");
  return CERTIFICATE_LABELS[key] ?? key.replace(/_/g, " ");
}

export function displayUploadFieldName(fieldName: string): string {
  return UPLOAD_FIELD_LABELS[fieldName] ?? fieldName.replace(/([A-Z])/g, " $1").replace(/^./, (c) => c.toUpperCase());
}

export function humanizeFieldKey(key: string): string {
  return key
    .replace(/([A-Z])/g, " $1")
    .replace(/_/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase())
    .trim();
}

export const REGISTRATION_STATUS_OPTIONS = [
  "Pending",
  "Submitted",
  "Verified",
  "Approved",
  "Rejected",
] as const;

export function paymentStatusOptionsForRegistration(
  registrationType: string,
  registrationFee: number | null | undefined
): string[] {
  const fee = registrationFee ?? 0;
  const type =
    registrationType === "Delegate" ? "Delegate Registration" : registrationType;
  const paidCapable = [
    "Delegate Registration",
    "Accommodation",
    "Projects",
    "Projects / Exhibition",
    "Exhibition",
  ].includes(type);
  const needsPayment =
    type === "Projects" ||
    type === "Accommodation" ||
    type === "Projects / Exhibition" ||
    (paidCapable && fee > 0);

  if (needsPayment) return ["Pending Payment", "Paid", "Failed"];
  return ["Submitted", "Not Required"];
}
