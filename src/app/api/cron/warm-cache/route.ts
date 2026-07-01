import { NextRequest, NextResponse } from "next/server";
import { SITE_URL } from "@/config/site";
import { purgePublicPageCaches } from "@/lib/cache/purge-public-pages";
import { withCronAuth } from "@/server/lib/cron-route";

export const dynamic = "force-dynamic";

const WARM_PATHS = ["/", "/hi", "/hi/introduction", "/registration", "/upcoming-events"];

/** Cron: purge ISR/CMS caches then warm high-traffic public routes. */
export const GET = withCronAuth(async (_request: NextRequest) => {
  purgePublicPageCaches();

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

  return NextResponse.json({ ok: true, purged: true, warmed: results });
});
