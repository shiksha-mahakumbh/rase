import { NextRequest, NextResponse } from "next/server";
import { proxyToV2Admin } from "@/server/lib/admin-gateway-proxy";
import { verifyAdminRequest } from "@/server/lib/admin-request-auth";
import { ServiceError } from "@/server/lib/errors";

export const runtime = "nodejs";

export async function POST(request: NextRequest) {
  try {
    const session = await verifyAdminRequest(request);
    return proxyToV2Admin(request, session, ["payment-recovery"]);
  } catch (error) {
    const status = error instanceof ServiceError ? error.status : 401;
    const message = error instanceof ServiceError ? error.message : "Unauthorized";
    return NextResponse.json({ error: message }, { status });
  }
}
