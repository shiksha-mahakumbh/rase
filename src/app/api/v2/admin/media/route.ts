import { NextRequest } from "next/server";
import type { MediaType } from "@prisma/client";
import { createApiHandler } from "@/server/lib/api-handler";
import { withDeprecationHeaders } from "@/server/lib/admin-deprecation";
import { getRequestContext } from "@/server/lib/request";
import { ServiceError } from "@/server/lib/errors";
import { uploadMedia, listMedia } from "@/server/services/media.service";

const getHandler = createApiHandler(
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

const postHandler = createApiHandler(
  async (request: NextRequest) => {
    const form = await request.formData();
    const file = form.get("file");
    if (!(file instanceof File)) throw new ServiceError("File required", 400, "INVALID_BODY");
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

export const GET = withDeprecationHeaders(getHandler, {
  successor: "/api/v2/admin/media-library",
  note: "Legacy media API — use /api/v2/admin/media-library instead",
});

export const POST = withDeprecationHeaders(postHandler, {
  successor: "/api/v2/admin/media-library",
  note: "Legacy media API — use /api/v2/admin/media-library instead",
});
