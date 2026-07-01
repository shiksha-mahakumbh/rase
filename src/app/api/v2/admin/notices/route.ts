import { NextRequest } from "next/server";
import type { ContentLocale, NoticeStatus } from "@prisma/client";
import { createApiHandler, assertBody } from "@/server/lib/api-handler";
import { createNotice, listNotices } from "@/server/services/notice.service";

export const GET = createApiHandler(
  async (request: NextRequest) => {
    const { searchParams } = new URL(request.url);
    return listNotices({
      status: (searchParams.get("status") as NoticeStatus) ?? undefined,
      locale: (searchParams.get("locale") as ContentLocale) ?? undefined,
      categoryId: searchParams.get("categoryId") ?? undefined,
      limit: Number(searchParams.get("limit") ?? 25),
      offset: Number(searchParams.get("offset") ?? 0),
      includeDeleted: searchParams.get("includeDeleted") === "true",
    });
  },
  { requireAdmin: true, adminResource: "media" }
);

export const POST = createApiHandler(
  async (request: NextRequest) => {
    const body = assertBody<{
      title: string;
      slug?: string;
      categoryId?: string;
      description: string;
      priority?: number;
      status?: NoticeStatus;
      isPinned?: boolean;
      locale?: ContentLocale;
      publishAt?: string;
      expireAt?: string;
      attachments?: Array<Record<string, unknown>>;
      seo?: Record<string, unknown>;
    }>(await request.json());

    const notice = await createNotice({
      ...body,
      publishAt: body.publishAt ? new Date(body.publishAt) : undefined,
      expireAt: body.expireAt ? new Date(body.expireAt) : undefined,
      attachments: body.attachments as never,
      seo: body.seo as never,
    });

    return { success: true, notice };
  },
  { requireAdmin: true, adminResource: "media" }
);
