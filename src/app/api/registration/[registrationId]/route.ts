import { NextRequest, NextResponse } from "next/server";
import { getClientIp, rateLimitAsync } from "@/lib/security/rateLimit";
import { handlePublicRegistrationLookup } from "@/server/lib/registration-lookup-handler";
import { toErrorResponse } from "@/server/lib/errors";

type RouteContext = {
  params: Promise<{ registrationId: string }>;
};

/** @deprecated Use /api/v2/registration/[id] — returns flat JSON for backward compatibility. */
export async function GET(request: NextRequest, context: RouteContext) {
  const { registrationId } = await context.params;

  const ip = getClientIp(request);
  const limited = await rateLimitAsync({
    key: `registration-lookup:${ip}`,
    limit: 10,
    windowMs: 60_000,
  });

  if (!limited.ok) {
    return NextResponse.json(
      { error: "Too many requests" },
      { status: 429, headers: { "Retry-After": String(limited.retryAfterSec) } }
    );
  }

  try {
    const summary = await handlePublicRegistrationLookup(request, registrationId);
    return NextResponse.json(summary, {
      headers: {
        Deprecation: "true",
        Link: `</api/v2/registration/${registrationId}>; rel="successor-version"`,
      },
    });
  } catch (error) {
    const mapped = toErrorResponse(error);
    return NextResponse.json(
      {
        error: mapped.error,
        ...(process.env.NODE_ENV !== "production" && mapped.code
          ? { code: mapped.code }
          : {}),
      },
      { status: mapped.status }
    );
  }
}
