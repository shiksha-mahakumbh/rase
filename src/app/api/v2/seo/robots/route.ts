import { createApiHandler } from "@/server/lib/api-handler";
import { getRobotsConfig } from "@/server/services/seo.service";

export const GET = createApiHandler(async () => {
  const config = await getRobotsConfig();
  return { success: true, config };
});
