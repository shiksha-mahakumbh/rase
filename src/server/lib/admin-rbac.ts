import type { NextRequest } from "next/server";
import type { AdminRole } from "@/types/registration";
import { ServiceError } from "@/server/lib/errors";
import { verifyAdminGatewayContext } from "@/server/lib/admin-gateway-context";

export const ADMIN_MANAGE_ROLES: AdminRole[] = ["Super Admin", "Admin"];

/** Sensitive admin reads (audit trails, webhooks, subscriber PII). */
export const ADMIN_SENSITIVE_READ_ROLES: AdminRole[] = ADMIN_MANAGE_ROLES;

export const ADMIN_EXPORT_ROLES: AdminRole[] = ["Super Admin", "Admin", "Data Entry"];

/** Gate staff may perform check-in actions without full admin privileges. */
export const ADMIN_CHECKIN_ROLES: AdminRole[] = ["Super Admin", "Admin", "Data Entry"];

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

/** Actor uid from signed gateway headers (cookie proxy). */
export function getAdminActorUid(request: NextRequest): string | null {
  if (!getAdminRoleFromRequest(request)) return null;
  return request.headers.get("x-admin-uid");
}
