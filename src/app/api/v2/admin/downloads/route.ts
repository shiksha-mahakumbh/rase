import { NextRequest } from "next/server";
import type { DownloadStatus, DownloadType } from "@prisma/client";
import { createApiHandler } from "@/server/lib/api-handler";
import { getRequestContext } from "@/server/lib/request";
import { ServiceError } from "@/server/lib/errors";
import { createDownload, listDownloads } from "@/server/services/download.service";

export const GET = createApiHandler(
  async (request: NextRequest) => {
    const { searchParams } = new URL(request.url);
    return listDownloads({
      status: (searchParams.get("status") as DownloadStatus) ?? undefined,
      downloadType: (searchParams.get("type") as DownloadType) ?? undefined,
      limit: Number(searchParams.get("limit") ?? 50),
      offset: Number(searchParams.get("offset") ?? 0),
      includeDeleted: searchParams.get("includeDeleted") === "true",
    });
  },
  { requireAdmin: true }
);

export const POST = createApiHandler(
  async (request: NextRequest) => {
    const form = await request.formData();
    const file = form.get("file");
    if (!(file instanceof File)) throw new ServiceError("File required", 400, "INVALID_BODY");
    const ctx = getRequestContext(request);
    const tagsRaw = form.get("tags")?.toString();
    const result = await createDownload({
      title: form.get("title")?.toString() ?? file.name,
      slug: form.get("slug")?.toString(),
      description: form.get("description")?.toString(),
      category: form.get("category")?.toString(),
      downloadType: (form.get("downloadType")?.toString() as never) ?? undefined,
      tags: tagsRaw ? tagsRaw.split(",").map((t) => t.trim()) : undefined,
      expiresAt: form.get("expiresAt")?.toString()
        ? new Date(form.get("expiresAt")!.toString())
        : undefined,
      file: Buffer.from(await file.arrayBuffer()),
      fileName: file.name,
      contentType: file.type || "application/pdf",
      ipAddress: ctx.ip,
    });
    return { success: true, ...result };
  },
  { requireAdmin: true }
);
