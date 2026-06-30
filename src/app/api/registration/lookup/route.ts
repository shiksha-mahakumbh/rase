import { NextRequest, NextResponse } from "next/server";
import { getClientIp, rateLimitAsync } from "@/lib/security/rateLimit";
import { handlePublicRegistrationLookupPost } from "@/server/lib/registration-lookup-handler";
import { toErrorResponse } from "@/server/lib/errors";

/** @deprecated Use POST /api/v2/registration/lookup — returns flat JSON for backward compatibility. */
export async function POST(request: NextRequest) {
  const ip = getClientIp(request);
  const limited = await rateLimitAsync({
    key: `registration-lookup-post:${ip}`,
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
    const body = await request.json();
    const summary = await handlePublicRegistrationLookupPost(body);
    return NextResponse.json(summary, {
      headers: {
        Deprecation: "true",
        Link: '</api/v2/registration/lookup>; rel="successor-version"',
      },
    });
  } catch (error) {
    const mapped = toErrorResponse(error);
    return NextResponse.json({ error: mapped.error }, { status: mapped.status });
  }
}
