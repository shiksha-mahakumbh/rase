import { NextRequest } from "next/server";
import type { ContentLocale } from "@prisma/client";
import { createApiHandler, assertBody } from "@/server/lib/api-handler";
import {
  getOrCreateHomepage,
  updateHomepageSections,
  updateHomepageMeta,
  publishHomepage,
  HOMEPAGE_SECTION_KEYS,
} from "@/server/services/homepage.service";

export const GET = createApiHandler(
  async (request: NextRequest) => {
    const locale = (new URL(request.url).searchParams.get("locale") ?? "en") as ContentLocale;
    const page = await getOrCreateHomepage(locale);
    return { success: true, page, sectionKeys: HOMEPAGE_SECTION_KEYS };
  },
  { requireAdmin: true }
);

export const PUT = createApiHandler(
  async (request: NextRequest) => {
    const body = assertBody<{
      locale?: ContentLocale;
      sections?: Array<{
        sectionKey: (typeof HOMEPAGE_SECTION_KEYS)[number];
        title?: string;
        content?: Record<string, unknown>;
        sortOrder?: number;
        isVisible?: boolean;
      }>;
      meta?: {
        title?: string;
        excerpt?: string;
        seo?: Record<string, unknown>;
      };
    }>(await request.json());

    const locale = body.locale ?? "en";
    const results: Record<string, unknown> = {};

    if (body.sections?.length) {
      results.sections = await updateHomepageSections(body.sections as never, locale);
    }
    if (body.meta) {
      results.meta = await updateHomepageMeta(
        { ...body.meta, seo: body.meta.seo as never },
        locale
      );
    }

    return { success: true, ...results };
  },
  { requireAdmin: true }
);

export const PATCH = createApiHandler(
  async (request: NextRequest) => {
    const body = assertBody<{ action: "publish"; locale?: ContentLocale }>(await request.json());
    if (body.action === "publish") {
      const page = await publishHomepage(body.locale ?? "en");
      return { success: true, page };
    }
    return { success: false };
  },
  { requireAdmin: true }
);
