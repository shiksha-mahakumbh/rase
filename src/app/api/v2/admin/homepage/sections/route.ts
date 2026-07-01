import { NextRequest } from "next/server";
import type { ContentLocale, Prisma } from "@prisma/client";
import { createApiHandler, assertBody } from "@/server/lib/api-handler";
import { updateHomepageSection, HOMEPAGE_SECTION_KEYS } from "@/server/services/homepage.service";

export const PUT = createApiHandler(
  async (request: NextRequest) => {
    const body = assertBody<{
      sectionKey: (typeof HOMEPAGE_SECTION_KEYS)[number];
      locale?: ContentLocale;
      title?: string;
      content?: Prisma.InputJsonValue;
      sortOrder?: number;
      isVisible?: boolean;
    }>(await request.json());

    const section = await updateHomepageSection(body.sectionKey, {
      locale: body.locale,
      title: body.title,
      content: body.content,
      sortOrder: body.sortOrder,
      isVisible: body.isVisible,
    });

    return { success: true, section };
  },
  { requireAdmin: true, adminResource: "media" }
);
