import { createApiHandler } from "@/server/lib/api-handler";
import { listPageRevisions } from "@/server/services/page.service";

export const GET = createApiHandler(
  async (_request, context: { params: Promise<{ id: string }> }) => {
    const { id } = await context.params;
    const revisions = await listPageRevisions(id);
    return { success: true, revisions };
  },
  { requireAdmin: true, adminResource: "media" }
);
