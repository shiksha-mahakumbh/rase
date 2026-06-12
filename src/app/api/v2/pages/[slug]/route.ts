import { NextRequest } from "next/server";
import type { ContentLocale } from "@prisma/client";
import { createApiHandler } from "@/server/lib/api-handler";
import { getPageBySlug } from "@/server/services/page.service";
import { ServiceError } from "@/server/lib/errors";

export const GET = createApiHandler(
  async (request: NextRequest, context: { params: Promise<{ slug: string }> }) => {
    const { slug } = await context.params;
    const locale = (new URL(request.url).searchParams.get("locale") ?? "en") as ContentLocale;
    const result = await getPageBySlug(slug, locale);
    if (!result) throw new ServiceError("Page not found", 404, "NOT_FOUND");
    return { success: true, ...result };
  },
  { rateLimitKey: "v2-pages-read", limit: 60 }
);
