import type { NextRequest } from "next/server";

export type RequestContext = {
  ip: string | null;
  userAgent: string | null;
};

export function getRequestContext(request: NextRequest): RequestContext {
  const forwarded = request.headers.get("x-forwarded-for");
  const ip =
    forwarded?.split(",")[0]?.trim() ??
    request.headers.get("x-real-ip") ??
    null;
  return {
    ip,
    userAgent: request.headers.get("user-agent"),
  };
}
