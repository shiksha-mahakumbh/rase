import { NextRequest } from "next/server";
import { createApiHandler } from "@/server/lib/api-handler";
import { getDownloadById } from "@/server/services/download.service";
import { ServiceError } from "@/server/lib/errors";

export const GET = createApiHandler(
  async (_request: NextRequest, context: { params: Promise<{ id: string }> }) => {
    const { id } = await context.params;
    const result = await getDownloadById(id);
    if (!result) throw new ServiceError("Download not found", 404, "NOT_FOUND");
    return { success: true, ...result };
  },
  { rateLimitKey: "v2-downloads-read", limit: 60 }
);
