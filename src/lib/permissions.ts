/** Permission slugs — must match `supabase/seed.sql`. */
export const PERMISSION_SLUGS = [
  "registrations.read",
  "registrations.create",
  "registrations.update",
  "registrations.delete",
  "registrations.export",
  "committees.read",
  "committees.manage",
  "media.read",
  "media.manage",
  "contact.read",
  "contact.manage",
  "feedback.read",
  "feedback.manage",
  "exports.create",
  "payments.read",
  "audit_logs.read",
  "users.manage",
  "settings.manage",
] as const;

export type PermissionSlug = (typeof PERMISSION_SLUGS)[number];

export type AdminResource =
  | "registrations"
  | "committees"
  | "media"
  | "contact"
  | "feedback"
  | "payments"
  | "audit_logs"
  | "settings"
  | "users"
  | "exports";

/** Map admin API resource + HTTP method → permission slug (mirrors seed matrix). */
export function permissionForAdminResource(
  resource: AdminResource,
  method: string
): PermissionSlug {
  const mutation = !["GET", "HEAD"].includes(method.toUpperCase());
  switch (resource) {
    case "registrations":
      return mutation ? "registrations.update" : "registrations.read";
    case "committees":
      return mutation ? "committees.manage" : "committees.read";
    case "media":
      return mutation ? "media.manage" : "media.read";
    case "contact":
      return mutation ? "contact.manage" : "contact.read";
    case "feedback":
      return mutation ? "feedback.manage" : "feedback.read";
    case "payments":
      return "payments.read";
    case "audit_logs":
      return "audit_logs.read";
    case "settings":
      return "settings.manage";
    case "users":
      return "users.manage";
    case "exports":
      return mutation ? "exports.create" : "registrations.export";
    default:
      return mutation ? "media.manage" : "media.read";
  }
}

/** Static fallback when DB permission cache is unavailable (mirrors seed.sql). */
export const FALLBACK_ROLE_PERMISSIONS: Record<string, readonly PermissionSlug[]> = {
  "Super Admin": PERMISSION_SLUGS,
  Admin: [
    "registrations.read",
    "registrations.create",
    "registrations.update",
    "registrations.delete",
    "registrations.export",
    "committees.read",
    "committees.manage",
    "media.read",
    "media.manage",
    "contact.read",
    "contact.manage",
    "feedback.read",
    "feedback.manage",
    "exports.create",
    "payments.read",
    "audit_logs.read",
  ],
  "Data Entry": ["registrations.read", "registrations.update", "registrations.export"],
  Coordinator: ["registrations.read", "committees.read"],
};
