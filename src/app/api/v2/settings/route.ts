import { NextRequest } from "next/server";
import type { ContentLocale } from "@prisma/client";
import { createApiHandler } from "@/server/lib/api-handler";
import { getPublicSiteConfig } from "@/server/services/site-settings.service";

export const GET = createApiHandler(
  async (request: NextRequest) => {
    const locale = (new URL(request.url).searchParams.get("locale") ?? "en") as ContentLocale;
    const settings = await getPublicSiteConfig(locale);
    return { success: true, settings };
  },
  { rateLimitKey: "v2-settings-read", limit: 120 }
);
