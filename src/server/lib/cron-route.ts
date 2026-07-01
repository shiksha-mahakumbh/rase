import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { assertCronAuthorized } from "@/server/lib/cron-auth";
import { ServiceError } from "@/server/lib/errors";

export function cronUnauthorizedResponse(error: unknown): NextResponse {
  const status = error instanceof ServiceError ? error.status : 401;
  const message = error instanceof ServiceError ? error.message : "Unauthorized";
  return NextResponse.json({ error: message }, { status });
}

export function withCronAuth(
  handler: (request: NextRequest) => Promise<NextResponse>
): (request: NextRequest) => Promise<NextResponse> {
  return async (request: NextRequest) => {
    try {
      assertCronAuthorized(request);
    } catch (error) {
      return cronUnauthorizedResponse(error);
    }
    return handler(request);
  };
}
