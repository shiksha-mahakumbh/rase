import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { ADMIN_SESSION_COOKIE } from "@/constants/auth";
import { verifyAdminSessionToken } from "@/lib/security/admin-session";
import { getClientIp, rateLimitAsync } from "@/lib/security/rateLimit";
import {
  clearAdminSessionCookie,
  maybeRotateAdminSessionCookie,
  verifyAndRefreshAdminSession,
} from "@/server/lib/admin-request-auth";
import { getPermissionsForRole } from "@/server/services/permission.service";

/** Return current admin session from HMAC cookie (if valid), re-validated against DB. */
export async function GET(request: NextRequest) {
  const ip = getClientIp(request);
  const limited = await rateLimitAsync({
    key: `admin-session-bootstrap:${ip}`,
    limit: 60,
    windowMs: 60_000,
  });
  if (!limited.ok) {
    return NextResponse.json(
      { error: "Too many requests" },
      { status: 429, headers: { "Retry-After": String(limited.retryAfterSec) } }
    );
  }

  const cookieStore = await cookies();
  const raw = cookieStore.get(ADMIN_SESSION_COOKIE)?.value;

  if (!raw) {
    return NextResponse.json({ authenticated: false });
  }

  const tokenSession = verifyAdminSessionToken(raw);
  if (!tokenSession) {
    const response = NextResponse.json({ authenticated: false });
    clearAdminSessionCookie(response);
    return response;
  }

  const session = await verifyAndRefreshAdminSession(raw);
  if (!session) {
    const response = NextResponse.json({ authenticated: false });
    clearAdminSessionCookie(response);
    return response;
  }

  const permissionSet = await getPermissionsForRole(session.role);

  const response = NextResponse.json({
    authenticated: true,
    email: session.email,
    role: session.role,
    uid: session.uid,
    permissions: Array.from(permissionSet),
  });
  maybeRotateAdminSessionCookie(response, session, tokenSession.role);
  return response;
}
