import { NextRequest } from "next/server";
import type { DownloadType } from "@prisma/client";
import { createApiHandler } from "@/server/lib/api-handler";
import { listPublicDownloads } from "@/server/services/download.service";

export const GET = createApiHandler(
  async (request: NextRequest) => {
    const { searchParams } = new URL(request.url);
    const result = await listPublicDownloads({
      category: searchParams.get("category") ?? undefined,
      downloadType: (searchParams.get("type") as DownloadType) ?? undefined,
      tag: searchParams.get("tag") ?? undefined,
      limit: Number(searchParams.get("limit") ?? 50),
      offset: Number(searchParams.get("offset") ?? 0),
    });
    return { success: true, ...result };
  },
  { rateLimitKey: "v2-downloads-read", limit: 60 }
);
