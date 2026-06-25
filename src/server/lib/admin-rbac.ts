import type { NextRequest } from "next/server";
import type { AdminRole } from "@/types/registration";
import { ServiceError } from "@/server/lib/errors";
import { verifyAdminGatewayContext } from "@/server/lib/admin-gateway-context";

export const ADMIN_MANAGE_ROLES: AdminRole[] = ["Super Admin", "Admin"];

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
