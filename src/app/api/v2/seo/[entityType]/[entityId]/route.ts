import { NextRequest } from "next/server";
import type { ContentLocale } from "@prisma/client";
import { createApiHandler } from "@/server/lib/api-handler";
import { getSeoForEntity, resolveOpenGraphImage } from "@/server/services/seo.service";
import { ServiceError } from "@/server/lib/errors";

export const GET = createApiHandler(
  async (request: NextRequest, context: { params: Promise<{ entityType: string; entityId: string }> }) => {
    const { entityType, entityId } = await context.params;
    const locale = (new URL(request.url).searchParams.get("locale") ?? "en") as ContentLocale;
    const seo = await getSeoForEntity(entityType, entityId, locale);
    if (!seo) throw new ServiceError("SEO metadata not found", 404);
    return {
      success: true,
      seo,
      openGraphImage: resolveOpenGraphImage(seo),
    };
  },
  { rateLimitKey: "v2-seo-read", limit: 120 }
);
