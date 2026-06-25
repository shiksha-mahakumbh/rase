import { NextRequest, NextResponse } from "next/server";
import { proxyToV2Admin } from "@/server/lib/admin-gateway-proxy";
import { verifyAdminRequest } from "@/server/lib/admin-request-auth";
import { ServiceError } from "@/server/lib/errors";

export const runtime = "nodejs";

async function handle(request: NextRequest, context: { params: Promise<{ path: string[] }> }) {
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
