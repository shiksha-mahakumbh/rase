import { NextRequest } from "next/server";
import { createApiHandler, assertBody } from "@/server/lib/api-handler";
import { updatePage, deletePage, publishPage, archivePage } from "@/server/services/page.service";
import { prisma } from "@/server/db/prisma";
import { ServiceError } from "@/server/lib/errors";

export const GET = createApiHandler(
  async (_request: NextRequest, context: { params: Promise<{ id: string }> }) => {
    const { id } = await context.params;
    const page = await prisma.page.findUnique({
      where: { id },
      include: { sections: { orderBy: { sortOrder: "asc" } } },
    });
    if (!page) throw new ServiceError("Page not found", 404);
    const seo = await prisma.seoMetadata.findFirst({
      where: { entityType: "page", entityId: id },
    });
    return { success: true, page, seo };
  },
  { requireAdmin: true, adminResource: "media" }
);

export const PATCH = createApiHandler(
  async (request: NextRequest, context: { params: Promise<{ id: string }> }) => {
    const { id } = await context.params;
    const body = assertBody<Record<string, unknown>>(await request.json());

    if (body.action === "publish") {
      const page = await publishPage(id);
      return { success: true, page };
    }
    if (body.action === "archive") {
      const page = await archivePage(id);
      return { success: true, page };
    }

    const page = await updatePage(id, body as never);
    return { success: true, page };
  },
  { requireAdmin: true, adminResource: "media" }
);

export const DELETE = createApiHandler(
  async (_request: NextRequest, context: { params: Promise<{ id: string }> }) => {
    const { id } = await context.params;
    await deletePage(id);
    return { success: true };
  },
  { requireAdmin: true, adminResource: "media" }
);
