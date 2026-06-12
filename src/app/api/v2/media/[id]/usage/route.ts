import { createApiHandler } from "@/server/lib/api-handler";
import { trackMediaUsage } from "@/server/services/media-library.service";

export const POST = createApiHandler(
  async (_request, context: { params: Promise<{ id: string }> }) => {
    const { id } = await context.params;
    const asset = await trackMediaUsage(id);
    return { success: true, usageCount: asset.usageCount };
  },
  { rateLimitKey: "v2-media-usage", limit: 120 }
);
