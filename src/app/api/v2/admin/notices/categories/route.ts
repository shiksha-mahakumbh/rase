import { createApiHandler, assertBody } from "@/server/lib/api-handler";
import { createNoticeCategory, listNoticeCategories } from "@/server/services/notice.service";

export const GET = createApiHandler(
  async () => ({ items: await listNoticeCategories(true) }),
  { requireAdmin: true, adminResource: "media" }
);

export const POST = createApiHandler(
  async (request) => {
    const body = assertBody<{
      name: string;
      slug?: string;
      description?: string;
      sortOrder?: number;
    }>(await request.json());
    const category = await createNoticeCategory(body);
    return { success: true, category };
  },
  { requireAdmin: true, adminResource: "media" }
);
