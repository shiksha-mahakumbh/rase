import { NextRequest } from "next/server";
import type { NoticeStatus } from "@prisma/client";
import { createApiHandler, assertBody } from "@/server/lib/api-handler";
import {
  updateNotice,
  publishNotice,
  archiveNotice,
  deleteNotice,
} from "@/server/services/notice.service";
import { prisma } from "@/server/db/prisma";
import { ServiceError } from "@/server/lib/errors";

export const GET = createApiHandler(
  async (_request: NextRequest, context: { params: Promise<{ id: string }> }) => {
    const { id } = await context.params;
    const notice = await prisma.notice.findFirst({
      where: { id, deletedAt: null },
      include: {
        category: true,
        attachments: { orderBy: { sortOrder: "asc" } },
      },
    });
    if (!notice) throw new ServiceError("Notice not found", 404, "NOT_FOUND");
    return { success: true, notice };
  },
  { requireAdmin: true }
);

export const PATCH = createApiHandler(
  async (request: NextRequest, context: { params: Promise<{ id: string }> }) => {
    const { id } = await context.params;
    const body = assertBody<{
      action?: "publish" | "archive";
      title?: string;
      slug?: string;
      categoryId?: string;
      description?: string;
      priority?: number;
      status?: NoticeStatus;
      isPinned?: boolean;
      publishAt?: string;
      expireAt?: string;
      attachments?: Array<Record<string, unknown>>;
      seo?: Record<string, unknown>;
    }>(await request.json());

    if (body.action === "publish") {
      const notice = await publishNotice(id);
      return { success: true, notice };
    }
    if (body.action === "archive") {
      const notice = await archiveNotice(id);
      return { success: true, notice };
    }

    const { action: _a, publishAt, expireAt, attachments, seo, ...rest } = body;
    const notice = await updateNotice(id, {
      ...rest,
      publishAt: publishAt ? new Date(publishAt) : undefined,
      expireAt: expireAt ? new Date(expireAt) : undefined,
      attachments: attachments as never,
      seo: seo as never,
    });
    return { success: true, notice };
  },
  { requireAdmin: true }
);

export const DELETE = createApiHandler(
  async (_request: NextRequest, context: { params: Promise<{ id: string }> }) => {
    const { id } = await context.params;
    const notice = await deleteNotice(id);
    return { success: true, notice };
  },
  { requireAdmin: true }
);
