import { createApiHandler } from "@/server/lib/api-handler";
import { generateSitemapIndex } from "@/server/services/seo.service";

export const GET = createApiHandler(
  async () => {
    const entries = await generateSitemapIndex();
    return { success: true, count: entries.length, entries };
  },
  { rateLimitKey: "v2-sitemap", limit: 30 }
);
