import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { ADMIN_SESSION_COOKIE } from "@/constants/auth";
import {
  adminSessionCookieOptions,
  createAdminSessionToken,
  verifyAdminSessionToken,
} from "@/lib/security/admin-session";
import { ServiceError } from "@/server/lib/errors";
import { resolveAdminSessionForUser } from "@/server/services/auth.service";
import type { AdminRole } from "@/types/registration";

export type VerifiedAdminSession = {
  uid: string;
  email: string;
  role: AdminRole;
  sessionVersion: number;
};

/** Re-resolve admin role from DB; returns null if user inactive or role revoked. */
export async function refreshAdminRole(
  uid: string,
  email: string
): Promise<AdminRole | null> {
  const session = await resolveAdminSessionForUser(uid, email);
  return session?.role ?? null;
}

/** Verify HMAC cookie and refresh role from DB (stale sessions fail closed). */
export async function verifyAndRefreshAdminSession(
  token: string
): Promise<VerifiedAdminSession | null> {
  const session = verifyAdminSessionToken(token);
  if (!session) return null;

  const fresh = await resolveAdminSessionForUser(session.uid, session.email);
  if (!fresh) return null;
  if (fresh.sessionVersion !== session.sessionVersion) return null;

  return fresh;
}

export function clearAdminSessionCookie(response: NextResponse) {
  response.cookies.set(ADMIN_SESSION_COOKIE, "", {
    ...adminSessionCookieOptions(0),
    maxAge: 0,
  });
}

/** Set a fresh signed cookie when DB role or session version differs from token. */
export function maybeRotateAdminSessionCookie(
  response: NextResponse,
  session: VerifiedAdminSession,
  tokenSession: { role: AdminRole; sessionVersion: number }
) {
  if (
    session.role === tokenSession.role &&
    session.sessionVersion === tokenSession.sessionVersion
  ) {
    return;
  }
  const token = createAdminSessionToken({
    uid: session.uid,
    email: session.email,
    role: session.role,
    sessionVersion: session.sessionVersion,
  });
  response.cookies.set(ADMIN_SESSION_COOKIE, token, adminSessionCookieOptions());
}

/** Verify admin via cookie (refreshed) or Supabase Bearer token. */
export async function verifyAdminRequest(
  request: NextRequest
): Promise<VerifiedAdminSession> {
  const cookie = request.cookies.get(ADMIN_SESSION_COOKIE)?.value;
  if (cookie) {
    const session = await verifyAndRefreshAdminSession(cookie);
    if (session) return session;
    throw new ServiceError("Unauthorized", 401, "UNAUTHORIZED");
  }

  const { verifySupabaseAdmin } = await import("@/server/lib/supabase-admin-auth");
  const token = request.headers.get("authorization")?.replace(/^Bearer\s+/i, "").trim();
  if (!token) {
    throw new ServiceError("Unauthorized", 401, "UNAUTHORIZED");
  }

  return verifySupabaseAdmin(request);
}

export async function assertAdminSession(request: NextRequest): Promise<VerifiedAdminSession> {
  const cookie = request.cookies.get(ADMIN_SESSION_COOKIE)?.value;
  if (!cookie) {
    throw new ServiceError("Unauthorized", 401, "UNAUTHORIZED");
  }
  const session = await verifyAndRefreshAdminSession(cookie);
  if (!session) {
    throw new ServiceError("Unauthorized", 401, "UNAUTHORIZED");
  }
  return session;
}
