import { NextRequest, NextResponse } from "next/server";
import { getClientIp, rateLimitAsync } from "@/lib/security/rateLimit";
import type { AdminRole } from "@/types/registration";
import type { PermissionSlug } from "@/lib/permissions";

export type AdminBinaryGuardOptions = {
  rateLimitKey: string;
  limit?: number;
  windowMs?: number;
  /** Explicit permission slug (DB-backed). */
  permission?: PermissionSlug;
  /** When omitted, export roles for reads and manage roles for mutations */
  roles?: readonly AdminRole[];
  mutation?: boolean;
};

/** Shared auth + rate limit for admin routes that return binary payloads (PDF, CSV, PNG). */
export async function adminBinaryGuard(
  request: NextRequest,
  options: AdminBinaryGuardOptions
): Promise<NextResponse | null> {
  const ip = getClientIp(request);
  const limited = await rateLimitAsync({
    key: `${options.rateLimitKey}:${ip}`,
    limit: options.limit ?? (options.mutation ? 60 : 120),
    windowMs: options.windowMs ?? 60_000,
  });
  if (!limited.ok) {
    return NextResponse.json(
      { error: "Too many requests" },
      { status: 429, headers: { "Retry-After": String(limited.retryAfterSec) } }
    );
  }

  const { requireAdminSecret } = await import("@/server/lib/admin-guard");
  requireAdminSecret(request);

  if (options.permission) {
    const { assertPermission } = await import("@/server/lib/admin-rbac");
    await assertPermission(request, options.permission);
    return null;
  }

  const { assertAdminRoles, ADMIN_EXPORT_ROLES, ADMIN_MANAGE_ROLES } = await import(
    "@/server/lib/admin-rbac"
  );
  const roles =
    options.roles ?? (options.mutation ? ADMIN_MANAGE_ROLES : ADMIN_EXPORT_ROLES);
  assertAdminRoles(request, roles);
  return null;
}
