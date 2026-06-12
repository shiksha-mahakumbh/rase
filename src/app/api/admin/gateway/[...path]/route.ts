import { NextRequest, NextResponse } from "next/server";
import { verifyAdminRequest } from "@/server/lib/admin-request-auth";
import { ServiceError, toErrorResponse } from "@/server/lib/errors";

type RouteContext = { params: Promise<{ path: string[] }> };

async function proxyToV2Admin(request: NextRequest, segments: string[]) {
  await verifyAdminRequest(request);

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

export async function GET(request: NextRequest, context: RouteContext) {
  try {
    const { path } = await context.params;
    return proxyToV2Admin(request, path);
  } catch (error) {
    const mapped = toErrorResponse(error);
    return NextResponse.json(
      { error: mapped.error, code: mapped.code },
      { status: mapped.status }
    );
  }
}

export async function POST(request: NextRequest, context: RouteContext) {
  try {
    const { path } = await context.params;
    return proxyToV2Admin(request, path);
  } catch (error) {
    const mapped = toErrorResponse(error);
    return NextResponse.json(
      { error: mapped.error, code: mapped.code },
      { status: mapped.status }
    );
  }
}

export async function PUT(request: NextRequest, context: RouteContext) {
  try {
    const { path } = await context.params;
    return proxyToV2Admin(request, path);
  } catch (error) {
    const mapped = toErrorResponse(error);
    return NextResponse.json(
      { error: mapped.error, code: mapped.code },
      { status: mapped.status }
    );
  }
}

export async function PATCH(request: NextRequest, context: RouteContext) {
  try {
    const { path } = await context.params;
    return proxyToV2Admin(request, path);
  } catch (error) {
    const mapped = toErrorResponse(error);
    return NextResponse.json(
      { error: mapped.error, code: mapped.code },
      { status: mapped.status }
    );
  }
}

export async function DELETE(request: NextRequest, context: RouteContext) {
  try {
    const { path } = await context.params;
    return proxyToV2Admin(request, path);
  } catch (error) {
    const mapped = toErrorResponse(error);
    return NextResponse.json(
      { error: mapped.error, code: mapped.code },
      { status: mapped.status }
    );
  }
}
