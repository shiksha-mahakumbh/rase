import { NextRequest } from "next/server";
import type { ContentLocale, MenuType } from "@prisma/client";
import { createApiHandler, assertBody } from "@/server/lib/api-handler";
import { createMenu, listMenus, seedDefaultMenus } from "@/server/services/menu.service";

export const GET = createApiHandler(
  async (request: NextRequest) => {
    const { searchParams } = new URL(request.url);
    const locale = (searchParams.get("locale") as ContentLocale) ?? undefined;
    const includeInactive = searchParams.get("includeInactive") === "true";
    return { items: await listMenus(locale, includeInactive) };
  },
  { requireAdmin: true, adminResource: "media" }
);

export const POST = createApiHandler(
  async (request: NextRequest) => {
    const body = assertBody<{
      action?: "seed";
      name?: string;
      slug?: string;
      menuType?: MenuType;
      locale?: ContentLocale;
    }>(await request.json());

    if (body.action === "seed") {
      const items = await seedDefaultMenus(body.locale ?? "en");
      return { success: true, items };
    }

    if (!body.name || !body.menuType) {
      return { success: false, error: "name and menuType required" };
    }

    const menu = await createMenu({
      name: body.name,
      slug: body.slug,
      menuType: body.menuType,
      locale: body.locale,
    });
    return { success: true, menu };
  },
  { requireAdmin: true, adminResource: "media" }
);
