import { createApiHandler } from "@/server/lib/api-handler";
import { listNoticeCategories } from "@/server/services/notice.service";

export const GET = createApiHandler(async () => ({
  items: await listNoticeCategories(),
}));
