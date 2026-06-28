export const DELEGATE_CATEGORY_KEYS = [
  "Student (Free)",
  "Teacher (₹1100)",
  "Principal (₹1100)",
  "Research Scholar (₹251)",
  "Director / VC / Chairperson (₹2100)",
  "Industry Delegate (₹5100)",
] as const;

export type DelegateCategory = (typeof DELEGATE_CATEGORY_KEYS)[number];

export const DELEGATE_FEES: Record<DelegateCategory, number> = {
  "Student (Free)": 0,
  "Teacher (₹1100)": 1100,
  "Principal (₹1100)": 1100,
  "Research Scholar (₹251)": 251,
  "Director / VC / Chairperson (₹2100)": 2100,
  "Industry Delegate (₹5100)": 5100,
};

export const DELEGATE_STUDENT_TYPE_KEYS = ["School Student", "College Student"] as const;
export type DelegateStudentType = (typeof DELEGATE_STUDENT_TYPE_KEYS)[number];

const NON_STUDENT_DESIGNATION_RE =
  /\b(principal|director|professor|dean|vc|vice.?chancellor|chairperson|ceo|manager|teacher|faculty|hod|head of department|industry)\b/i;

export function isKnownDelegateCategory(category: string): category is DelegateCategory {
  return Object.prototype.hasOwnProperty.call(DELEGATE_FEES, category);
}

export function delegateFeeForCategory(category: string | undefined): number {
  if (!category || !isKnownDelegateCategory(category)) return 0;
  return DELEGATE_FEES[category];
}

export function isDelegateStudentCategory(category: string | undefined): boolean {
  return category === "Student (Free)";
}

function hasUploadedFile(value: unknown): boolean {
  if (!value) return false;
  if (typeof value === "string") return value.trim().length > 0;
  if (typeof value === "object" && value !== null) {
    const obj = value as { url?: string; path?: string; name?: string };
    return Boolean(obj.url?.trim() || obj.path?.trim() || obj.name?.trim());
  }
  return false;
}

export function validateDelegateStudentFields(data: Record<string, unknown>): string | null {
  if (!isDelegateStudentCategory(String(data.delegateCategory ?? ""))) {
    return null;
  }

  const studentType = String(data.studentType ?? "");
  if (studentType !== "School Student" && studentType !== "College Student") {
    return "Select whether you are a school or college student";
  }

  const studentIdNumber = String(data.studentIdNumber ?? "").trim();
  if (studentIdNumber.length < 3) {
    return "Student roll number or enrollment ID is required";
  }

  const courseOrClass = String(data.courseOrClass ?? "").trim();
  if (courseOrClass.length < 2) {
    return "Course, class, or year of study is required";
  }

  const designation = String(data.designation ?? "").trim();
  if (designation.length < 2) {
    return "Designation is required (e.g. Class 12 Student, B.Tech 2nd Year)";
  }
  if (NON_STUDENT_DESIGNATION_RE.test(designation)) {
    return "Student delegates must use a student designation (not teacher, principal, or industry role)";
  }

  const institution = String(data.institution ?? "").trim();
  if (institution.length < 2) {
    return "School or college name is required";
  }

  return null;
}

export function validateDelegateStudentIdCard(data: Record<string, unknown>): string | null {
  if (!isDelegateStudentCategory(String(data.delegateCategory ?? ""))) {
    return null;
  }
  const payment =
    data.payment && typeof data.payment === "object"
      ? (data.payment as Record<string, unknown>)
      : null;
  const studentIdCard =
    data.studentIdCard ?? payment?.studentIdCard ?? data.studentIdCardUrl;
  if (!hasUploadedFile(studentIdCard)) {
    return "Upload a valid student ID card (school/college ID)";
  }
  return null;
}

export function validateDelegateStudentProof(data: Record<string, unknown>): string | null {
  return validateDelegateStudentFields(data) ?? validateDelegateStudentIdCard(data);
}

export function validateDelegateRegistrationPayload(data: Record<string, unknown>): string | null {
  const category = String(data.delegateCategory ?? "").trim();
  if (!category) {
    return "Delegate category is required";
  }
  if (!isKnownDelegateCategory(category)) {
    return "Invalid delegate category";
  }

  const gender = String(data.gender ?? "");
  if (!["Male", "Female", "Other"].includes(gender)) {
    return "Gender is required";
  }

  const designation = String(data.designation ?? "").trim();
  if (designation.length < 2) {
    return "Designation is required";
  }

  const institution = String(data.institution ?? "").trim();
  if (institution.length < 2) {
    return "Institution is required";
  }

  const address = String(data.address ?? "").trim();
  if (address.length < 5) {
    return "Address is required";
  }

  const country = String(data.country ?? "").trim();
  if (country.length < 2) {
    return "Country is required";
  }

  const vidyaBharti = String(data.vidyaBharti ?? "");
  if (!["Vidya Bharti", "Non Vidya Bharti"].includes(vidyaBharti)) {
    return "Vidya Bharti affiliation is required";
  }

  if (data.accommodationRequired === "Yes") {
    if (!String(data.accommodationDate ?? "").trim()) {
      return "Accommodation date is required";
    }
    if (!String(data.accommodationType ?? "").trim()) {
      return "Accommodation type is required";
    }
    if (!String(data.participantCategory ?? "").trim()) {
      return "Participant category is required for accommodation";
    }
  }

  return validateDelegateStudentProof(data);
}
