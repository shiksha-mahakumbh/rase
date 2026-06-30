import { NextRequest, NextResponse } from "next/server";
import { verifySupabaseAdmin } from "@/server/lib/supabase-admin-auth";
import { ServiceError } from "@/server/lib/errors";
import { getClientIp, rateLimitAsync } from "@/lib/security/rateLimit";
import {
  ADMIN_SESSION_COOKIE,
  adminSessionCookieOptions,
  createAdminSessionToken,
} from "@/lib/security/admin-session";
import { assertAdminSession, clearAdminSessionCookie } from "@/server/lib/admin-request-auth";

/** Exchange Supabase access token for signed HttpOnly admin session cookie. */
export async function POST(request: NextRequest) {
  const ip = getClientIp(request);
  const limited = await rateLimitAsync({
    key: `admin-session:${ip}`,
    limit: 10,
    windowMs: 60_000,
  });
  if (!limited.ok) {
    return NextResponse.json(
      { error: "Too many requests" },
      { status: 429, headers: { "Retry-After": String(limited.retryAfterSec) } }
    );
  }

  try {
    const session = await verifySupabaseAdmin(request);
    const token = createAdminSessionToken({
      uid: session.uid,
      email: session.email,
      role: session.role,
    });

    const response = NextResponse.json({ success: true, role: session.role });
    response.cookies.set(ADMIN_SESSION_COOKIE, token, adminSessionCookieOptions());
    return response;
  } catch (error) {
    const status = error instanceof ServiceError ? error.status : 401;
    return NextResponse.json({ error: "Unauthorized" }, { status });
  }
}

/** Clear signed admin session cookie (requires valid session). */
export async function DELETE(request: NextRequest) {
  const ip = getClientIp(request);
  const limited = await rateLimitAsync({
    key: `admin-session-logout:${ip}`,
    limit: 30,
    windowMs: 60_000,
  });
  if (!limited.ok) {
    return NextResponse.json(
      { error: "Too many requests" },
      { status: 429, headers: { "Retry-After": String(limited.retryAfterSec) } }
    );
  }

  try {
    await assertAdminSession(request);
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const response = NextResponse.json({ success: true });
  clearAdminSessionCookie(response);
  return response;
}
