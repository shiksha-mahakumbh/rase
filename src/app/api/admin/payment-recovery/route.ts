import { NextRequest, NextResponse } from "next/server";
import { ADMIN_SESSION_COOKIE } from "@/constants/auth";
import { verifyAdminSessionToken } from "@/lib/security/admin-session";
import { verifyAdminRequest } from "@/server/lib/admin-request-auth";
import { ServiceError, toErrorResponse } from "@/server/lib/errors";

function hasAdminCredentials(request: NextRequest): boolean {
  const cookie = request.cookies.get(ADMIN_SESSION_COOKIE)?.value;
  if (cookie && verifyAdminSessionToken(cookie)) {
    return true;
  }
  const token = request.headers.get("authorization")?.replace(/^Bearer\s+/i, "").trim();
  return Boolean(token);
}

async function proxyPaymentRecovery(request: NextRequest) {
  if (!hasAdminCredentials(request)) {
    return NextResponse.json(
      { error: "Unauthorized", code: "UNAUTHORIZED" },
      { status: 401 }
    );
  }

  await verifyAdminRequest(request);

  const secret =
    process.env.ADMIN_OPS_SECRET ?? process.env.REGISTRATION_EMAIL_SECRET;
  if (!secret) {
    return NextResponse.json(
      { error: "Admin authentication not configured", code: "ADMIN_NOT_CONFIGURED" },
      { status: 503 }
    );
  }

  const incoming = new URL(request.url);
  const targetUrl = new URL("/api/v2/admin/payment-recovery", incoming.origin);
  targetUrl.search = incoming.search;

  const headers = new Headers();
  headers.set("x-ops-secret", secret);
  const contentType = request.headers.get("content-type");
  if (contentType) headers.set("content-type", contentType);

  const method = request.method.toUpperCase();
  const hasBody = !["GET", "HEAD"].includes(method);
  const body = hasBody ? await request.arrayBuffer() : undefined;

  const upstream = await fetch(targetUrl.toString(), {
    method,
    headers,
    body: body?.byteLength ? body : undefined,
    cache: "no-store",
  });

  const responseBody = await upstream.arrayBuffer();
  const responseHeaders = new Headers();
  const upstreamType = upstream.headers.get("content-type");
  if (upstreamType) responseHeaders.set("content-type", upstreamType);

  if (upstream.status >= 400) {
    console.error("ADMIN_FETCH_FAILED", {
      path: "payment-recovery",
      status: upstream.status,
    });
  } else if (method === "GET") {
    console.info("ADMIN_FETCH_SUCCESS", { path: "payment-recovery", status: upstream.status });
  }

  return new NextResponse(responseBody, {
    status: upstream.status,
    headers: responseHeaders,
  });
}

export async function GET(request: NextRequest) {
  try {
    return await proxyPaymentRecovery(request);
  } catch (error) {
    const mapped = toErrorResponse(error);
    console.error("ADMIN_FETCH_FAILED", {
      path: "payment-recovery",
      status: mapped.status,
      error: mapped.error,
      code: mapped.code,
    });
    return NextResponse.json(
      { error: mapped.error, code: mapped.code },
      { status: mapped.status }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    return await proxyPaymentRecovery(request);
  } catch (error) {
    const mapped = toErrorResponse(error);
    if (error instanceof ServiceError && mapped.error.includes("Unknown action")) {
      return NextResponse.json({ error: mapped.error }, { status: mapped.status });
    }
    console.error("ADMIN_FETCH_FAILED", {
      path: "payment-recovery",
      status: mapped.status,
      error: mapped.error,
      code: mapped.code,
    });
    return NextResponse.json(
      { error: mapped.error, code: mapped.code },
      { status: mapped.status }
    );
  }
}
