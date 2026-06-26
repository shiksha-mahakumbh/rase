import type { UploadBucket } from "@/server/services/storage.service";

/** Maps registration type to storage bucket — server-side only; never trust client bucket. */
export const REGISTRATION_TYPE_BUCKET_MAP: Record<string, UploadBucket> = {
  Volunteer: "resumes",
  Talent: "resumes",
  NGO: "registrations",
  "Paper Submission": "papers",
  "Abstract Submission": "papers",
  "Best Practices": "registrations",
  Projects: "registrations",
  Olympiad: "registrations",
  Awards: "registrations",
  Accommodation: "registrations",
  "Delegate Registration": "registrations",
  "School Program": "registrations",
};

export function resolveRegistrationUploadBucket(registrationType: string): UploadBucket {
  return REGISTRATION_TYPE_BUCKET_MAP[registrationType] ?? "registrations";
}
