import { NextRequest, NextResponse } from "next/server";
import { proxyToV2Admin } from "@/server/lib/admin-gateway-proxy";
import { verifyAdminRequest } from "@/server/lib/admin-request-auth";
import { getClientIp, rateLimitAsync } from "@/lib/security/rateLimit";
import { ServiceError } from "@/server/lib/errors";
import { assertSameOrigin } from "@/server/lib/same-origin";

export const runtime = "nodejs";

async function handle(request: NextRequest, context: { params: Promise<{ path: string[] }> }) {
  assertSameOrigin(request);
  const ip = getClientIp(request);
  const limited = await rateLimitAsync({
    key: `admin-gateway:${ip}`,
    limit: 120,
    windowMs: 60_000,
  });
  if (!limited.ok) {
    return NextResponse.json(
      { error: "Too many requests" },
      { status: 429, headers: { "Retry-After": String(limited.retryAfterSec) } }
    );
  }

  try {
    const session = await verifyAdminRequest(request);
    const { path } = await context.params;
    return proxyToV2Admin(request, session, path);
  } catch (error) {
    const status = error instanceof ServiceError ? error.status : 401;
    const message = error instanceof ServiceError ? error.message : "Unauthorized";
    return NextResponse.json({ error: message }, { status });
  }
}

export async function GET(request: NextRequest, context: { params: Promise<{ path: string[] }> }) {
  return handle(request, context);
}

export async function POST(request: NextRequest, context: { params: Promise<{ path: string[] }> }) {
  return handle(request, context);
}

export async function PATCH(request: NextRequest, context: { params: Promise<{ path: string[] }> }) {
  return handle(request, context);
}

export async function PUT(request: NextRequest, context: { params: Promise<{ path: string[] }> }) {
  return handle(request, context);
}

export async function DELETE(request: NextRequest, context: { params: Promise<{ path: string[] }> }) {
  return handle(request, context);
}
