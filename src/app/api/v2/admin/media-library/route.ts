import { NextRequest } from "next/server";
import type { MediaAssetType } from "@prisma/client";
import { createApiHandler } from "@/server/lib/api-handler";
import { getRequestContext } from "@/server/lib/request";
import { ServiceError } from "@/server/lib/errors";
import { searchMediaAssets, uploadMediaAsset } from "@/server/services/media-library.service";

export const GET = createApiHandler(
  async (request: NextRequest) => {
    const { searchParams } = new URL(request.url);
    const tags = searchParams.get("tags");
    return searchMediaAssets({
      query: searchParams.get("q") ?? undefined,
      folderId: searchParams.get("folderId") ?? undefined,
      assetType: (searchParams.get("assetType") as MediaAssetType) ?? undefined,
      tags: tags ? tags.split(",") : undefined,
      limit: Number(searchParams.get("limit") ?? 30),
      offset: Number(searchParams.get("offset") ?? 0),
    });
  },
  { requireAdmin: true }
);

export const POST = createApiHandler(
  async (request: NextRequest) => {
    const form = await request.formData();
    const file = form.get("file");
    if (!(file instanceof File)) throw new ServiceError("File required", 400, "INVALID_BODY");

    const tagsRaw = form.get("tags")?.toString();
    const ctx = getRequestContext(request);

    const asset = await uploadMediaAsset({
      file: Buffer.from(await file.arrayBuffer()),
      fileName: file.name,
      mimeType: file.type || "application/octet-stream",
      folderId: form.get("folderId")?.toString(),
      altText: form.get("altText")?.toString(),
      tags: tagsRaw ? tagsRaw.split(",").map((t) => t.trim()) : undefined,
      ipAddress: ctx.ip,
    });

    return { success: true, asset };
  },
  { requireAdmin: true }
);
