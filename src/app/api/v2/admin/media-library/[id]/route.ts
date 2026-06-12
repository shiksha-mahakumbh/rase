import { NextRequest } from "next/server";
import { createApiHandler } from "@/server/lib/api-handler";
import { getRequestContext } from "@/server/lib/request";
import {
  deleteMediaAsset,
  replaceMediaAsset,
  getSignedMediaUrl,
  trackMediaUsage,
} from "@/server/services/media-library.service";
import { prisma } from "@/server/db/prisma";
import { ServiceError } from "@/server/lib/errors";

export const GET = createApiHandler(
  async (request: NextRequest, context: { params: Promise<{ id: string }> }) => {
    const { id } = await context.params;
    const asset = await prisma.mediaAsset.findUnique({
      where: { id },
      include: { folder: true },
    });
    if (!asset) throw new ServiceError("Asset not found", 404);

    const signed =
      new URL(request.url).searchParams.get("signed") === "true"
        ? await getSignedMediaUrl(id)
        : null;

    return { success: true, asset, signedUrl: signed };
  },
  { requireAdmin: true }
);

export const PATCH = createApiHandler(
  async (request: NextRequest, context: { params: Promise<{ id: string }> }) => {
    const { id } = await context.params;
    const form = await request.formData();
    const file = form.get("file");
    if (!(file instanceof File)) throw new Error("File required for replace");

    const ctx = getRequestContext(request);
    const asset = await replaceMediaAsset(id, {
      file: Buffer.from(await file.arrayBuffer()),
      fileName: file.name,
      mimeType: file.type || "application/octet-stream",
      ipAddress: ctx.ip,
    });

    return { success: true, asset };
  },
  { requireAdmin: true }
);

export const DELETE = createApiHandler(
  async (request: NextRequest, context: { params: Promise<{ id: string }> }) => {
    const { id } = await context.params;
    const ctx = getRequestContext(request);
    await deleteMediaAsset(id, ctx.ip);
    return { success: true };
  },
  { requireAdmin: true }
);
