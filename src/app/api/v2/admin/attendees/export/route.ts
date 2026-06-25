import { NextRequest, NextResponse } from "next/server";
import { getClientIp, rateLimitAsync } from "@/lib/security/rateLimit";
import { exportAttendeesCsv } from "@/server/services/lifecycle/attendee.service";
import { toErrorResponse } from "@/server/lib/errors";

export async function GET(request: NextRequest) {
  const ip = getClientIp(request);
  const limited = await rateLimitAsync({ key: `admin-attendees-export:${ip}`, limit: 20, windowMs: 60_000 });
  if (!limited.ok) {
    return NextResponse.json({ error: "Too many requests" }, { status: 429 });
  }

  try {
    const { requireAdminSecret } = await import("@/server/lib/admin-guard");
    const { assertAdminRoles, ADMIN_EXPORT_ROLES } = await import("@/server/lib/admin-rbac");
    requireAdminSecret(request);
    assertAdminRoles(request, ADMIN_EXPORT_ROLES);
    const { searchParams } = new URL(request.url);
    const csv = await exportAttendeesCsv({
      search: searchParams.get("search") ?? undefined,
      category: searchParams.get("category") ?? undefined,
      state: searchParams.get("state") ?? undefined,
      institution: searchParams.get("institution") ?? undefined,
      checkInStatus: searchParams.get("checkInStatus") ?? undefined,
      paymentStatus: searchParams.get("paymentStatus") ?? undefined,
    });
    return new NextResponse(csv, {
      headers: {
        "Content-Type": "text/csv",
        "Content-Disposition": `attachment; filename="attendees-${Date.now()}.csv"`,
      },
    });
  } catch (error) {
    const mapped = toErrorResponse(error);
    return NextResponse.json({ error: mapped.error }, { status: mapped.status });
  }
}
