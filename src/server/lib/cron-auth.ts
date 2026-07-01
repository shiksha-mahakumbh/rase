import type { NextRequest } from "next/server";
import { ServiceError } from "@/server/lib/errors";

/** Vercel cron jobs send Authorization: Bearer <CRON_SECRET>. */
export function assertCronAuthorized(request: NextRequest): void {
  const secret = process.env.CRON_SECRET;
  if (!secret) {
    if (process.env.NODE_ENV === "production") {
      throw new ServiceError("Cron not configured", 503, "CRON_NOT_CONFIGURED");
    }
    throw new ServiceError("Unauthorized", 401, "UNAUTHORIZED");
  }

  const auth = request.headers.get("authorization")?.replace(/^Bearer\s+/i, "");
  if (auth !== secret) {
    throw new ServiceError("Unauthorized", 401, "UNAUTHORIZED");
  }
}
