import { NextRequest, NextResponse } from "next/server";
import { SITE_URL } from "@/config/site";

export const dynamic = "force-dynamic";

const WARM_PATHS = ["/", "/hi", "/hi/introduction", "/registration", "/upcoming-events"];

/** Cron: warm ISR cache for high-traffic public routes (especially /hi). */
export async function GET(request: NextRequest) {
  const secret = process.env.CRON_SECRET;
  const auth = request.headers.get("authorization")?.replace(/^Bearer\s+/i, "");
  if (!secret || auth !== secret) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const base = SITE_URL.replace(/\/$/, "");
  const results: Array<{ path: string; status: number | "error" }> = [];

  for (const path of WARM_PATHS) {
    try {
      const res = await fetch(`${base}${path}`, {
        headers: { "User-Agent": "rase-cache-warmer/1.0" },
        cache: "no-store",
      });
      results.push({ path, status: res.status });
    } catch {
      results.push({ path, status: "error" });
    }
  }

  return NextResponse.json({ ok: true, warmed: results });
}
