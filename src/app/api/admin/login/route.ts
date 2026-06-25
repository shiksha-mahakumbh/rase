import { NextRequest, NextResponse } from "next/server";
import {
  ADMIN_SESSION_COOKIE,
  adminSessionCookieOptions,
  createAdminSessionToken,
} from "@/lib/security/admin-session";
import { getClientIp, rateLimitAsync } from "@/lib/security/rateLimit";
import { ServiceError } from "@/server/lib/errors";
import { signInWithEmailPassword } from "@/server/services/auth.service";

/** Email/password admin login → signed HttpOnly session cookie. */
export async function POST(request: NextRequest) {
  const ip = getClientIp(request);
  const limited = await rateLimitAsync({
    key: `admin-login:${ip}`,
    limit: 10,
    windowMs: 60_000,
  });
  if (!limited.ok) {
    return NextResponse.json(
      { error: "Too many login attempts. Try again later." },
      { status: 429, headers: { "Retry-After": String(limited.retryAfterSec) } }
    );
  }

  try {
    const body = await request.json();
    const email = typeof body.email === "string" ? body.email : "";
    const password = typeof body.password === "string" ? body.password : "";

    if (!email || !password) {
      return NextResponse.json({ error: "Email and password required" }, { status: 400 });
    }

    const session = await signInWithEmailPassword(email, password);
    const token = createAdminSessionToken({
      uid: session.uid,
      email: session.email,
      role: session.role,
    });

    const response = NextResponse.json({
      success: true,
      role: session.role,
      email: session.email,
      uid: session.uid,
    });
    response.cookies.set(ADMIN_SESSION_COOKIE, token, adminSessionCookieOptions());
    return response;
  } catch (error) {
    const status = error instanceof ServiceError ? error.status : 401;
    const message =
      error instanceof ServiceError ? error.message : "Login failed";
    return NextResponse.json({ error: message }, { status });
  }
}
