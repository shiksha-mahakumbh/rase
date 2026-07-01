import type { NextRequest } from "next/server";
import { ServiceError } from "@/server/lib/errors";
import {
  resolveAdminSessionForUser,
  verifySupabaseAccessToken,
  type AdminSessionPayload,
} from "@/server/services/auth.service";

export type { AdminSessionPayload };

export async function verifySupabaseAdmin(
  request: NextRequest
): Promise<AdminSessionPayload> {
  const authHeader = request.headers.get("authorization");
  const token = authHeader?.replace(/^Bearer\s+/i, "").trim();
  if (!token) {
    throw new ServiceError("Unauthorized", 401, "UNAUTHORIZED");
  }

  const { uid, email } = await verifySupabaseAccessToken(token);
  const session = await resolveAdminSessionForUser(uid, email);
  if (!session) {
    throw new ServiceError("Forbidden", 403, "FORBIDDEN");
  }

  return session;
}
