import { NextRequest, NextResponse } from "next/server";
import { ADMIN_SESSION_COOKIE } from "@/constants/auth";
import { verifyAdminSessionToken } from "@/lib/security/admin-session";
import { verifyAdminRequest } from "@/server/lib/admin-request-auth";
import { ServiceError, toErrorResponse } from "@/server/lib/errors";

type RouteContext = { params: Promise<{ path: string[] }> };

function hasAdminCredentials(request: NextRequest): boolean {
  const cookie = request.cookies.get(ADMIN_SESSION_COOKIE)?.value;
  if (cookie && verifyAdminSessionToken(cookie)) {
    return true;
  }
  const token = request.headers.get("authorization")?.replace(/^Bearer\s+/i, "").trim();
  return Boolean(token);
}

function unauthorizedResponse() {
  return NextResponse.json(
    { error: "Unauthorized", code: "UNAUTHORIZED" },
    { status: 401 }
  );
}

async function proxyToV2Admin(request: NextRequest, segments: string[]) {
  const session = await verifyAdminRequest(request);

  const secret =
    process.env.ADMIN_OPS_SECRET ?? process.env.REGISTRATION_EMAIL_SECRET;
  if (!secret) {
    throw new ServiceError("Admin authentication not configured", 503, "ADMIN_NOT_CONFIGURED");
  }

  const incoming = new URL(request.url);
  const targetPath = `/api/v2/admin/${segments.join("/")}`;
  const targetUrl = new URL(targetPath, incoming.origin);
  targetUrl.search = incoming.search;

  const headers = new Headers();
  headers.set("x-ops-secret", secret);
  headers.set("x-admin-role", session.role);
  headers.set("x-admin-email", session.email);
  headers.set("x-admin-uid", session.uid);
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

  return new NextResponse(responseBody, {
    status: upstream.status,
    headers: responseHeaders,
  });
}

async function handleGateway(request: NextRequest, context: RouteContext) {
  if (!hasAdminCredentials(request)) {
    return unauthorizedResponse();
  }
  try {
    const { path } = await context.params;
    const segments = path.join("/");
    const response = await proxyToV2Admin(request, path);
    if (response.status >= 400) {
      console.error("ADMIN_FETCH_FAILED", {
        path: segments,
        status: response.status,
      });
    } else if (request.method === "GET") {
      console.info("ADMIN_FETCH_SUCCESS", { path: segments, status: response.status });
    }
    return response;
  } catch (error) {
    const mapped = toErrorResponse(error);
    console.error("ADMIN_FETCH_FAILED", {
      path: (await context.params).path.join("/"),
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

export async function GET(request: NextRequest, context: RouteContext) {
  return handleGateway(request, context);
}

export async function POST(request: NextRequest, context: RouteContext) {
  return handleGateway(request, context);
}

export async function PUT(request: NextRequest, context: RouteContext) {
  return handleGateway(request, context);
}

export async function PATCH(request: NextRequest, context: RouteContext) {
  return handleGateway(request, context);
}

export async function DELETE(request: NextRequest, context: RouteContext) {
  return handleGateway(request, context);
}
