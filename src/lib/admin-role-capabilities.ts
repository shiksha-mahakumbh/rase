import type { AdminRole } from "@/types/registration";
import type { PermissionSlug } from "@/lib/permissions";
import { FALLBACK_ROLE_PERMISSIONS } from "@/lib/permissions";

export function canMutateCms(role: AdminRole | null): boolean {
  return role === "Super Admin" || role === "Admin";
}

export function canAccessManagePath(role: AdminRole | null): boolean {
  return canMutateCms(role);
}

export function roleHasPermission(
  role: AdminRole | null,
  slug: PermissionSlug,
  permissions?: readonly PermissionSlug[] | null
): boolean {
  if (!role) return false;
  if (permissions?.length) return permissions.includes(slug);
  const fallback = FALLBACK_ROLE_PERMISSIONS[role];
  return fallback?.includes(slug) ?? false;
}

export function canPerformCheckIn(
  role: AdminRole | null,
  permissions?: readonly PermissionSlug[] | null
): boolean {
  return roleHasPermission(role, "registrations.update", permissions);
}

export function canAccessCheckInGate(
  role: AdminRole | null,
  permissions?: readonly PermissionSlug[] | null
): boolean {
  return roleHasPermission(role, "registrations.read", permissions);
}

export function canExport(
  role: AdminRole | null,
  permissions?: readonly PermissionSlug[] | null
): boolean {
  return roleHasPermission(role, "registrations.export", permissions);
}

export function canAccessSensitiveAdmin(
  role: AdminRole | null,
  permissions?: readonly PermissionSlug[] | null
): boolean {
  return roleHasPermission(role, "audit_logs.read", permissions);
}

export function canUpdateRegistrations(
  role: AdminRole | null,
  permissions?: readonly PermissionSlug[] | null
): boolean {
  return roleHasPermission(role, "registrations.update", permissions);
}
