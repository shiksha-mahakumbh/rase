import { createApiHandler } from "@/server/lib/api-handler";
import { getPublicSiteConfig } from "@/server/services/site-settings.service";

export const revalidate = 60;

export const GET = createApiHandler(async () => {
  const settings = await getPublicSiteConfig("en");
  return { maintenanceMode: Boolean(settings.maintenanceMode) };
});
