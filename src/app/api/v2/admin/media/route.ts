import { NextRequest } from "next/server";
import type { MediaType } from "@prisma/client";
import { createApiHandler } from "@/server/lib/api-handler";
import { getRequestContext } from "@/server/lib/request";
import { uploadMedia, listMedia } from "@/server/services/media.service";

export const GET = createApiHandler(
  async (request: NextRequest) => {
    const { searchParams } = new URL(request.url);
    const mediaType = searchParams.get("mediaType") as MediaType | null;
    return {
      items: await listMedia({
        mediaType: mediaType ?? undefined,
        category: searchParams.get("category") ?? undefined,
        featuredOnly: searchParams.get("featured") === "true",
      }),
    };
  },
  { requireAdmin: true }
);

export const POST = createApiHandler(
  async (request: NextRequest) => {
    const form = await request.formData();
    const file = form.get("file");
    if (!(file instanceof File)) throw new Error("File required");
    const ctx = getRequestContext(request);
    const result = await uploadMedia({
      file: Buffer.from(await file.arrayBuffer()),
      fileName: file.name,
      contentType: file.type || "application/octet-stream",
      mediaType: (form.get("mediaType")?.toString() ?? "image") as MediaType,
      title: form.get("title")?.toString(),
      category: form.get("category")?.toString(),
      eventId: form.get("eventId")?.toString(),
      isFeatured: form.get("isFeatured") === "true",
      ipAddress: ctx.ip,
    });
    return { success: true, ...result };
  },
  { requireAdmin: true }
);
