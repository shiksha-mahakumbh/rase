import { NextRequest, NextResponse } from "next/server";
import { SITE_URL } from "@/config/site";
import { purgePublicPageCaches } from "@/lib/cache/purge-public-pages";

export const dynamic = "force-dynamic";

const WARM_PATHS = ["/", "/hi", "/hi/introduction", "/registration", "/upcoming-events"];

function authorizeCron(request: NextRequest): boolean {
  const secret = process.env.CRON_SECRET;
  const auth = request.headers.get("authorization")?.replace(/^Bearer\s+/i, "");
  return Boolean(secret && auth === secret);
}

/** Cron: purge ISR/CMS caches then warm high-traffic public routes. */
export async function GET(request: NextRequest) {
  if (!authorizeCron(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

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
}
