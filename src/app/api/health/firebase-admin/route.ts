import { NextRequest, NextResponse } from "next/server";
import { diagnoseFirebaseAdmin } from "@/lib/firebase-admin";
import { getClientIp, rateLimit } from "@/lib/security/rateLimit";

export const dynamic = "force-dynamic";

function isAuthorized(request: NextRequest): boolean {
  const secret =
    process.env.ADMIN_OPS_SECRET ?? process.env.REGISTRATION_EMAIL_SECRET;
  if (!secret) {
    return process.env.NODE_ENV !== "production";
  }
  const provided =
    request.headers.get("x-ops-secret") ??
    request.headers.get("authorization")?.replace(/^Bearer\s+/i, "");
  return provided === secret;
}

export async function GET(request: NextRequest) {
  const ip = getClientIp(request);
  const limited = rateLimit({
    key: `ops-firebase-admin:${ip}`,
    limit: 20,
    windowMs: 60_000,
  });

  if (!limited.ok) {
    return NextResponse.json(
      { error: "Too many requests" },
      { status: 429, headers: { "Retry-After": String(limited.retryAfterSec) } }
    );
  }

  if (!isAuthorized(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const diagnostics = await diagnoseFirebaseAdmin();

  return NextResponse.json({
    checkedAt: new Date().toISOString(),
    expectedProjectId: "shiksha-mahakumbh-abhiyan",
    diagnostics,
    ready:
      diagnostics.initOk &&
      diagnostics.firestoreOk &&
      diagnostics.projectIdMatches,
  });
}
