import { NextRequest, NextResponse } from "next/server";
import { getClientIp, rateLimit } from "@/lib/security/rateLimit";
import { ServiceError, toErrorResponse } from "@/server/lib/errors";

type HandlerOptions = {
  rateLimitKey?: string;
  limit?: number;
  windowMs?: number;
  requireAdmin?: boolean;
};

/** Default context for App Router route handlers (Next.js 15). */
export type AppRouteContext = { params: Promise<Record<string, string>> };

export function createApiHandler<T, C extends AppRouteContext = AppRouteContext>(
  handler: (request: NextRequest, context: C) => Promise<T>,
  options: HandlerOptions = {}
) {
  return async (request: NextRequest, context: C) => {
    const ip = getClientIp(request);
    if (options.rateLimitKey) {
      const limited = rateLimit({
        key: `${options.rateLimitKey}:${ip}`,
        limit: options.limit ?? 30,
        windowMs: options.windowMs ?? 60_000,
      });
      if (!limited.ok) {
        return NextResponse.json(
          { error: "Too many requests" },
          { status: 429, headers: { "Retry-After": String(limited.retryAfterSec) } }
        );
      }
    }

    try {
      if (options.requireAdmin) {
        const { requireAdminSecret } = await import("@/server/lib/admin-guard");
        requireAdminSecret(request);
      }
      const result = await handler(request, context);
      return NextResponse.json(result);
    } catch (error) {
      const mapped = toErrorResponse(error);
      return NextResponse.json(
        { error: mapped.error, code: mapped.code },
        { status: mapped.status }
      );
    }
  };
}

export function assertBody<T extends object>(body: unknown): T {
  if (!body || typeof body !== "object") {
    throw new ServiceError("Invalid request body", 400, "INVALID_BODY");
  }
  return body as T;
}
