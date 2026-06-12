import type { NextRequest } from "next/server";
import { ServiceError } from "@/server/lib/errors";

export function requireAdminSecret(request: NextRequest): void {
  const secret =
    process.env.ADMIN_OPS_SECRET ?? process.env.REGISTRATION_EMAIL_SECRET;
  if (!secret) {
    throw new ServiceError("Admin authentication not configured", 503, "ADMIN_NOT_CONFIGURED");
  }
  const provided =
    request.headers.get("x-ops-secret") ??
    request.headers.get("authorization")?.replace(/^Bearer\s+/i, "");
  if (!provided || provided !== secret) {
    throw new ServiceError("Unauthorized", 401, "UNAUTHORIZED");
  }
}
