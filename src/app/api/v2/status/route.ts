import { NextResponse } from "next/server";
import { probeServiceStatus } from "@/lib/monitoring/service-status";

export const dynamic = "force-dynamic";
export const revalidate = 0;

/** Public status JSON for uptime monitors and the /status page. */
export async function GET() {
  const payload = await probeServiceStatus();
  return NextResponse.json(payload, {
    headers: {
      "Cache-Control": "no-store, max-age=0",
    },
  });
}
