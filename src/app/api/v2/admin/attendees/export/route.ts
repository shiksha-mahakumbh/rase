import { NextRequest, NextResponse } from "next/server";
import { adminBinaryGuard } from "@/server/lib/admin-binary-guard";
import { exportAttendeesCsv } from "@/server/services/lifecycle/attendee.service";
import { toErrorResponse } from "@/server/lib/errors";

export async function GET(request: NextRequest) {
  const blocked = await adminBinaryGuard(request, {
    rateLimitKey: "admin-attendees-export",
    limit: 20,
  });
  if (blocked) return blocked;

  try {
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
