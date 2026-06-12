import { NextRequest, NextResponse } from "next/server";
import { verifySupabaseAdmin } from "@/server/lib/supabase-admin-auth";
import { ServiceError } from "@/server/lib/errors";
import {
  ADMIN_SESSION_COOKIE,
  adminSessionCookieOptions,
  createAdminSessionToken,
} from "@/lib/security/admin-session";

/** Exchange Supabase access token for signed HttpOnly admin session cookie. */
export async function POST(request: NextRequest) {
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

/** Clear signed admin session cookie. */
export async function DELETE() {
  const response = NextResponse.json({ success: true });
  response.cookies.set(ADMIN_SESSION_COOKIE, "", {
    ...adminSessionCookieOptions(0),
    maxAge: 0,
  });
  return response;
}
