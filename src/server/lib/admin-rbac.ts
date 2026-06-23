import type { NextRequest } from "next/server";
import type { AdminRole } from "@/types/registration";
import { ServiceError } from "@/server/lib/errors";

export const ADMIN_MANAGE_ROLES: AdminRole[] = ["Super Admin", "Admin"];

export const ADMIN_EXPORT_ROLES: AdminRole[] = ["Super Admin", "Admin", "Data Entry"];

export function getAdminRoleFromRequest(request: NextRequest): AdminRole | null {
  const role = request.headers.get("x-admin-role");
  if (role === "Super Admin" || role === "Admin" || role === "Data Entry") {
    return role;
  }
  return null;
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
