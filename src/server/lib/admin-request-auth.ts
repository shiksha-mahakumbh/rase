import type { NextRequest } from "next/server";
import { ADMIN_SESSION_COOKIE } from "@/constants/auth";
import { verifyAdminSessionToken } from "@/lib/security/admin-session";
import { ServiceError } from "@/server/lib/errors";
import { verifySupabaseAdmin, type AdminSessionPayload } from "@/server/lib/supabase-admin-auth";

/** Verify admin via HMAC session cookie or Supabase Bearer token. */
export async function verifyAdminRequest(
  request: NextRequest
): Promise<AdminSessionPayload> {
  const cookie = request.cookies.get(ADMIN_SESSION_COOKIE)?.value;
  if (cookie && cookie !== "1") {
    const session = verifyAdminSessionToken(cookie);
    if (session) {
      return {
        uid: session.uid,
        email: session.email,
        role: session.role,
      };
    }
  }

  return verifySupabaseAdmin(request);
}

export function assertAdminSession(request: NextRequest): AdminSessionPayload {
  const cookie = request.cookies.get(ADMIN_SESSION_COOKIE)?.value;
  if (!cookie || cookie === "1") {
    throw new ServiceError("Unauthorized", 401, "UNAUTHORIZED");
  }
  const session = verifyAdminSessionToken(cookie);
  if (!session) {
    throw new ServiceError("Unauthorized", 401, "UNAUTHORIZED");
  }
  return {
    uid: session.uid,
    email: session.email,
    role: session.role,
  };
}
