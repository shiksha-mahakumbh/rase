import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { ADMIN_SESSION_COOKIE } from "@/constants/auth";
import { verifyAdminSessionToken } from "@/lib/security/admin-session";
import { getClientIp, rateLimitAsync } from "@/lib/security/rateLimit";

/** Return current admin session from HMAC cookie (if valid). */
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
  const secret = process.env.ADMIN_SESSION_SECRET;

  if (!raw || !secret) {
    return NextResponse.json({ authenticated: false });
  }

  const session = verifyAdminSessionToken(raw);
  if (!session) {
    return NextResponse.json({ authenticated: false });
  }

  return NextResponse.json({
    authenticated: true,
    email: session.email,
    role: session.role,
    uid: session.uid,
  });
}
