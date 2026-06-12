import { NextRequest } from "next/server";
import type { ContentLocale, PageStatus, PageType } from "@prisma/client";
import { createApiHandler, assertBody } from "@/server/lib/api-handler";
import { createPage, listPages } from "@/server/services/page.service";

export const GET = createApiHandler(
  async (request: NextRequest) => {
    const { searchParams } = new URL(request.url);
    return listPages({
      status: (searchParams.get("status") as PageStatus) ?? undefined,
      pageType: (searchParams.get("pageType") as PageType) ?? undefined,
      locale: (searchParams.get("locale") as ContentLocale) ?? undefined,
      limit: Number(searchParams.get("limit") ?? 25),
      offset: Number(searchParams.get("offset") ?? 0),
      includeDeleted: searchParams.get("includeDeleted") === "true",
    });
  },
  { requireAdmin: true }
);

export const POST = createApiHandler(
  async (request: NextRequest) => {
    const body = assertBody<{
      title: string;
      slug?: string;
      pageType?: PageType;
      locale?: ContentLocale;
      excerpt?: string;
      content?: string;
      status?: PageStatus;
      publishAt?: string;
      seo?: Record<string, unknown>;
      sections?: Array<Record<string, unknown>>;
    }>(await request.json());

    const page = await createPage({
      ...body,
      publishAt: body.publishAt ? new Date(body.publishAt) : undefined,
      sections: body.sections as never,
      seo: body.seo as never,
    });

    return { success: true, page };
  },
  { requireAdmin: true }
);
