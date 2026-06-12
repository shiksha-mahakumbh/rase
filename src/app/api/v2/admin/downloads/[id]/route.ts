import { NextRequest } from "next/server";
import type { DownloadStatus, DownloadType } from "@prisma/client";
import { createApiHandler, assertBody } from "@/server/lib/api-handler";
import { getRequestContext } from "@/server/lib/request";
import {
  updateDownload,
  deleteDownload,
  replaceDownload,
} from "@/server/services/download.service";
import { prisma } from "@/server/db/prisma";
import { ServiceError } from "@/server/lib/errors";

export const GET = createApiHandler(
  async (_request: NextRequest, context: { params: Promise<{ id: string }> }) => {
    const { id } = await context.params;
    const download = await prisma.download.findFirst({ where: { id, deletedAt: null } });
    if (!download) throw new ServiceError("Download not found", 404, "NOT_FOUND");
    return { success: true, download };
  },
  { requireAdmin: true }
);

export const PATCH = createApiHandler(
  async (request: NextRequest, context: { params: Promise<{ id: string }> }) => {
    const { id } = await context.params;
    const ctx = getRequestContext(request);
    const contentType = request.headers.get("content-type") ?? "";

    if (contentType.includes("multipart/form-data")) {
      const form = await request.formData();
      const file = form.get("file");
      if (!(file instanceof File)) throw new ServiceError("File required", 400, "FILE_REQUIRED");
      const result = await replaceDownload(id, {
        file: Buffer.from(await file.arrayBuffer()),
        fileName: file.name,
        contentType: file.type || "application/pdf",
        ipAddress: ctx.ip,
      });
      return { success: true, ...result };
    }

    const body = assertBody<{
      title?: string;
      slug?: string;
      description?: string;
      category?: string;
      downloadType?: DownloadType;
      tags?: string[];
      status?: DownloadStatus;
      isPublished?: boolean;
      expiresAt?: string;
      sortOrder?: number;
      seo?: Record<string, unknown>;
    }>(await request.json());

    const { expiresAt, seo, ...rest } = body;
    const download = await updateDownload(
      id,
      {
        ...rest,
        expiresAt: expiresAt ? new Date(expiresAt) : undefined,
        seo: seo as never,
      },
      ctx.ip
    );
    return { success: true, download };
  },
  { requireAdmin: true }
);

export const DELETE = createApiHandler(
  async (request: NextRequest, context: { params: Promise<{ id: string }> }) => {
    const { id } = await context.params;
    const ctx = getRequestContext(request);
    const download = await deleteDownload(id, ctx.ip);
    return { success: true, download };
  },
  { requireAdmin: true }
);
