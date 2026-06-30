import { NextRequest, NextResponse } from "next/server";
import { getClientIp, rateLimitAsync } from "@/lib/security/rateLimit";
import { ServiceError, toErrorResponse } from "@/server/lib/errors";
import { ADMIN_MANAGE_ROLES } from "@/server/lib/admin-rbac";

import type { AdminRole } from "@/types/registration";

type HandlerOptions = {
  rateLimitKey?: string;
  limit?: number;
  windowMs?: number;
  requireAdmin?: boolean;
  /** Requires signed gateway role header to match one of these roles */
  adminRoles?: readonly AdminRole[];
  /** When true, skip default mutation RBAC (Super Admin / Admin only) */
  skipMutationRoleCheck?: boolean;
};

/** Default context for App Router route handlers (Next.js 15). */
export type AppRouteContext = { params: Promise<Record<string, string>> };

export function createApiHandler<T, C extends AppRouteContext = AppRouteContext>(
  handler: (request: NextRequest, context: C) => Promise<T>,
  options: HandlerOptions = {}
) {
  return async (request: NextRequest, context: C) => {
    const ip = getClientIp(request);
    const method = request.method.toUpperCase();
    const isMutation = !["GET", "HEAD"].includes(method);
    const rateLimitKey =
      options.rateLimitKey ?? (options.requireAdmin && isMutation ? "v2-admin-mutation" : undefined);
    if (rateLimitKey) {
      const limited = await rateLimitAsync({
        key: `${rateLimitKey}:${ip}`,
        limit: options.limit ?? 60,
        windowMs: options.windowMs ?? 60_000,
      });
      if (!limited.ok) {
        return NextResponse.json(
          { error: "Too many requests" },
          { status: 429, headers: { "Retry-After": String(limited.retryAfterSec) } }
        );
      }
    }

    try {
      if (options.requireAdmin) {
        const { requireAdminSecret } = await import("@/server/lib/admin-guard");
        requireAdminSecret(request);
        if (options.adminRoles?.length) {
          const { assertAdminRoles } = await import("@/server/lib/admin-rbac");
          assertAdminRoles(request, options.adminRoles);
        } else if (isMutation && !options.skipMutationRoleCheck) {
          const { assertAdminRoles } = await import("@/server/lib/admin-rbac");
          assertAdminRoles(request, ADMIN_MANAGE_ROLES);
        }
      }
      const result = await handler(request, context);
      return NextResponse.json(result);
    } catch (error) {
      const mapped = toErrorResponse(error);
      return NextResponse.json(
        { error: mapped.error, code: mapped.code },
        { status: mapped.status }
      );
    }
  };
}

export function assertBody<T extends object>(body: unknown): T {
  if (!body || typeof body !== "object") {
    throw new ServiceError("Invalid request body", 400, "INVALID_BODY");
  }
  return body as T;
}
