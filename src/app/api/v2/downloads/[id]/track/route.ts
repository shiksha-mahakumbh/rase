import { createApiHandler } from "@/server/lib/api-handler";
import { trackDownload } from "@/server/services/download.service";

export const POST = createApiHandler(
  async (_request, context: { params: Promise<{ id: string }> }) => {
    const { id } = await context.params;
    const row = await trackDownload(id);
    return { success: true, downloadCount: row.downloadCount };
  }
);
