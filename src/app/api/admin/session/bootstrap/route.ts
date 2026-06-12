import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { ADMIN_SESSION_COOKIE } from "@/constants/auth";
import { verifyAdminSessionToken } from "@/lib/security/admin-session";

/** Return current admin session from HMAC cookie (if valid). */
export async function GET() {
  const cookieStore = await cookies();
  const raw = cookieStore.get(ADMIN_SESSION_COOKIE)?.value;
  const secret = process.env.ADMIN_SESSION_SECRET ?? process.env.ADMIN_OPS_SECRET;

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
