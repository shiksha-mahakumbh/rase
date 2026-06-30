import { NextRequest, NextResponse } from "next/server";
import type { AppRouteContext } from "@/server/lib/api-handler";

type DeprecationOptions = {
  successor: string;
  note?: string;
};

/** Attach RFC 8594 deprecation headers to an admin route handler response. */
export function withDeprecationHeaders<C extends AppRouteContext>(
  handler: (request: NextRequest, context: C) => Promise<NextResponse>,
  options: DeprecationOptions
) {
  return async (request: NextRequest, context: C) => {
    const response = await handler(request, context);
    response.headers.set("Deprecation", "true");
    response.headers.set("Link", `<${options.successor}>; rel="successor-version"`);
    response.headers.set(
      "X-Deprecated-Endpoint",
      options.note ?? `Use ${options.successor} instead`
    );
    return response;
  };
}
