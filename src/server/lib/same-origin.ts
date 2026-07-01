import type { NextRequest } from "next/server";
import { ServiceError } from "@/server/lib/errors";

/** Reject cross-site browser mutations when Origin/Referer do not match Host. */
export function assertSameOrigin(request: NextRequest): void {
  if (process.env.NODE_ENV !== "production") return;

  const host = request.headers.get("host");
  if (!host) return;

  const allowedOrigins = new Set([
    `https://${host}`,
    `http://${host}`,
  ]);

  const origin = request.headers.get("origin");
  if (origin) {
    if (allowedOrigins.has(origin)) return;
    throw new ServiceError("Forbidden", 403, "CSRF");
  }

  const referer = request.headers.get("referer");
  if (referer) {
    try {
      if (new URL(referer).host === host) return;
    } catch {
      // fall through
    }
  }

  throw new ServiceError("Forbidden", 403, "CSRF");
}
