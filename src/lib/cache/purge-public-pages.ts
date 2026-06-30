import { revalidatePath } from "next/cache";
import type { ContentLocale } from "@prisma/client";
import { purgeCmsContentCaches, purgeCmsGlobalSiteCaches } from "@/server/lib/cms-cache-purge";

export { purgeCmsContentCaches, purgeCmsGlobalSiteCaches };

const HOME_PATHS = ["/", "/hi"] as const;
const CMS_LOCALES: ContentLocale[] = ["en", "hi"];

/** Drop stale ISR HTML + CMS data cache after deploys or cron warm. */
export function purgePublicPageCaches() {
  purgeCmsGlobalSiteCaches();
  for (const path of HOME_PATHS) {
    revalidatePath(path);
  }
}
