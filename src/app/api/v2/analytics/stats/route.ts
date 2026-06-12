import { NextResponse } from "next/server";
import { createApiHandler } from "@/server/lib/api-handler";
import { getPublicVisitorStats } from "@/server/services/visitor-analytics.service";

export const GET = createApiHandler(async () => {
  const stats = await getPublicVisitorStats();
  return { success: true, ...stats };
});

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: {
      "Cache-Control": "public, s-maxage=30, stale-while-revalidate=60",
    },
  });
}
