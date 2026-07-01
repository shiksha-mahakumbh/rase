import { createApiHandler } from "@/server/lib/api-handler";
import { listEntityRevisions } from "@/server/services/entity-revision.service";

export const GET = createApiHandler(
  async (_request, context: { params: Promise<{ id: string }> }) => {
    const { id } = await context.params;
    const revisions = await listEntityRevisions("committee", id);
    return { success: true, revisions };
  },
  { requireAdmin: true, adminResource: "committees" }
);
