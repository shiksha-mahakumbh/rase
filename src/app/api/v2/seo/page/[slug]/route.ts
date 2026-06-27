import { NextRequest } from "next/server";
import type { ContentLocale } from "@prisma/client";
import { createApiHandler } from "@/server/lib/api-handler";
import { getSeoForPageSlug, resolveOpenGraphImage } from "@/server/services/seo.service";
import { ServiceError } from "@/server/lib/errors";

/** Public SEO lookup by CMS page slug (P3-14). */
export const GET = createApiHandler(
  async (request: NextRequest, context: { params: Promise<{ slug: string }> }) => {
    const { slug } = await context.params;
    const locale = (new URL(request.url).searchParams.get("locale") ?? "en") as ContentLocale;
    const seo = await getSeoForPageSlug(slug, locale);
    if (!seo) throw new ServiceError("SEO metadata not found for slug", 404);
    return {
      success: true,
      slug,
      seo,
      openGraphImage: resolveOpenGraphImage(seo),
    };
  },
  { rateLimitKey: "v2-seo-slug", limit: 120 }
);
