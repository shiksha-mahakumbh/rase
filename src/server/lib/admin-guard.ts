import type { NextRequest } from "next/server";
import { ServiceError } from "@/server/lib/errors";
import { verifyAdminGatewayContext } from "@/server/lib/admin-gateway-context";

function opsSecretMatches(request: NextRequest, secret: string): boolean {
  const provided =
    request.headers.get("x-ops-secret") ??
    request.headers.get("authorization")?.replace(/^Bearer\s+/i, "");
  return Boolean(provided && provided === secret);
}

/** v2 admin routes — ops secret plus signed gateway context in production. */
export function requireAdminSecret(request: NextRequest): void {
  const secret = process.env.ADMIN_OPS_SECRET;
  if (!secret) {
    throw new ServiceError("Admin authentication not configured", 503, "ADMIN_NOT_CONFIGURED");
  }

  if (!opsSecretMatches(request, secret)) {
    throw new ServiceError("Unauthorized", 401, "UNAUTHORIZED");
  }

  const allowDirect = process.env.ADMIN_OPS_ALLOW_DIRECT === "true";
  if (allowDirect || process.env.NODE_ENV !== "production") {
    return;
  }

  const email = request.headers.get("x-admin-email");
  const role = request.headers.get("x-admin-role");
  const uid = request.headers.get("x-admin-uid");
  const sig = request.headers.get("x-admin-context-sig");

  if (!email || !role || !uid || !sig) {
    throw new ServiceError(
      "Admin API requires authenticated gateway session",
      403,
      "GATEWAY_REQUIRED"
    );
  }

  if (!verifyAdminGatewayContext(request)) {
    throw new ServiceError("Invalid admin gateway context", 403, "GATEWAY_INVALID");
  }
}
