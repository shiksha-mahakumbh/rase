import { NextRequest } from "next/server";
import type { ContentLocale } from "@prisma/client";
import { createApiHandler } from "@/server/lib/api-handler";
import { getPublicHomepage } from "@/server/services/homepage.service";
import { ServiceError } from "@/server/lib/errors";

export const GET = createApiHandler(
  async (request: NextRequest) => {
    const locale = (new URL(request.url).searchParams.get("locale") ?? "en") as ContentLocale;
    const result = await getPublicHomepage(locale);
    if (!result) throw new ServiceError("Homepage not published", 404, "NOT_FOUND");
    return { success: true, ...result };
  },
  { rateLimitKey: "v2-homepage-read", limit: 60 }
);
