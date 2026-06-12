import { NextRequest } from "next/server";
import type { ContentLocale, MenuType } from "@prisma/client";
import { createApiHandler } from "@/server/lib/api-handler";
import { getMenuBySlug, getMenuByType } from "@/server/services/menu.service";
import { ServiceError } from "@/server/lib/errors";

export const GET = createApiHandler(
  async (request: NextRequest) => {
    const { searchParams } = new URL(request.url);
    const locale = (searchParams.get("locale") ?? "en") as ContentLocale;
    const slug = searchParams.get("slug");
    const menuType = searchParams.get("type") as MenuType | null;

    let menu = null;
    if (slug) {
      menu = await getMenuBySlug(slug, locale);
    } else if (menuType) {
      menu = await getMenuByType(menuType, locale);
    } else {
      throw new ServiceError("slug or type query param required", 400, "INVALID_QUERY");
    }

    if (!menu) throw new ServiceError("Menu not found", 404, "NOT_FOUND");
    return { success: true, menu };
  },
  { rateLimitKey: "v2-menus-read", limit: 60 }
);
