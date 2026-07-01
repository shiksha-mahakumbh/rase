import type { NextRequest } from "next/server";
import type { AdminRole } from "@/types/registration";
import type { PermissionSlug } from "@/lib/permissions";
import { ServiceError } from "@/server/lib/errors";
import { verifyAdminGatewayContext } from "@/server/lib/admin-gateway-context";
import { roleHasPermission as dbRoleHasPermission } from "@/server/services/permission.service";

export const ADMIN_MANAGE_ROLES: AdminRole[] = ["Super Admin", "Admin"];

/** Sensitive admin reads (audit trails, webhooks, subscriber PII). */
export const ADMIN_SENSITIVE_READ_ROLES: AdminRole[] = ADMIN_MANAGE_ROLES;

export const ADMIN_REGISTRATION_UPDATE_ROLES: AdminRole[] = [
  "Super Admin",
  "Admin",
  "Data Entry",
];

export const ADMIN_EXPORT_ROLES: AdminRole[] = ["Super Admin", "Admin", "Data Entry"];

/** Gate staff may perform check-in actions without full admin privileges. */
export const ADMIN_CHECKIN_ROLES: AdminRole[] = ADMIN_REGISTRATION_UPDATE_ROLES;

export function getAdminRoleFromRequest(request: NextRequest): AdminRole | null {
  return verifyAdminGatewayContext(request);
}

export function assertAdminRoles(
  request: NextRequest,
  allowed: readonly AdminRole[]
): AdminRole {
  const role = getAdminRoleFromRequest(request);
  if (!role || !allowed.includes(role)) {
    throw new ServiceError("Forbidden", 403, "FORBIDDEN");
  }
  return role;
}

export async function assertPermission(
  request: NextRequest,
  slug: PermissionSlug
): Promise<AdminRole> {
  const role = getAdminRoleFromRequest(request);
  if (!role) {
    throw new ServiceError("Forbidden", 403, "FORBIDDEN");
  }
  const allowed = await dbRoleHasPermission(role, slug);
  if (!allowed) {
    throw new ServiceError("Forbidden", 403, "FORBIDDEN");
  }
  return role;
}

export async function assertAnyPermission(
  request: NextRequest,
  slugs: readonly PermissionSlug[]
): Promise<AdminRole> {
  const role = getAdminRoleFromRequest(request);
  if (!role) {
    throw new ServiceError("Forbidden", 403, "FORBIDDEN");
  }
  for (const slug of slugs) {
    if (await dbRoleHasPermission(role, slug)) return role;
  }
  throw new ServiceError("Forbidden", 403, "FORBIDDEN");
}

/** Actor uid from signed gateway headers (cookie proxy). */
export function getAdminActorUid(request: NextRequest): string | null {
  if (!getAdminRoleFromRequest(request)) return null;
  return request.headers.get("x-admin-uid");
}
