import { NextRequest } from "next/server";
import type { ContentLocale } from "@prisma/client";
import { createApiHandler } from "@/server/lib/api-handler";
import { listPublicNotices } from "@/server/services/notice.service";
import { resolvePublicNotices, resolveWidgetNotices } from "@/data/default-notices";
import type { CmsNotice } from "@/lib/cms/types";

function mapApiNotice(n: Awaited<ReturnType<typeof listPublicNotices>>["items"][number]): CmsNotice {
  return {
    id: n.id,
    title: n.title,
    slug: n.slug,
    description: n.description,
    priority: n.priority,
    isPinned: n.isPinned,
    publishAt: n.publishAt?.toISOString() ?? null,
    expireAt: n.expireAt?.toISOString() ?? null,
    category: n.category ? { name: n.category.name, slug: n.category.slug } : null,
    attachments: n.attachments.map((a) => ({
      id: a.id,
      fileName: a.fileName,
      fileUrl: a.fileUrl,
      mimeType: a.mimeType,
    })),
  };
}

export const GET = createApiHandler(
  async (request: NextRequest) => {
    const { searchParams } = new URL(request.url);
    const locale = (searchParams.get("locale") ?? "en") as ContentLocale;
    const widget = searchParams.get("widget") === "true";
    const limit = Number(searchParams.get("limit") ?? (widget ? 5 : 25));
    const offset = Number(searchParams.get("offset") ?? 0);

    const result = await listPublicNotices({
      locale,
      categorySlug: searchParams.get("category") ?? undefined,
      pinnedOnly: searchParams.get("pinned") === "true",
      widget,
      limit,
      offset,
    });

    const mapped = result.items.map(mapApiNotice);
    const items = widget
      ? resolveWidgetNotices(mapped, mapped, locale, limit)
      : resolvePublicNotices(mapped, locale).slice(0, limit);

    return { ...result, items, total: items.length };
  },
  { rateLimitKey: "v2-notices-read", limit: 60 }
);
