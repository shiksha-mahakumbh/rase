import { revalidatePath, revalidateTag } from "next/cache";
import type { ContentLocale } from "@prisma/client";

const HOME_PATHS = ["/", "/hi"] as const;
const CMS_LOCALES: ContentLocale[] = ["en", "hi"];

/** Drop stale ISR HTML + CMS data cache after deploys or cron warm. */
export function purgePublicPageCaches() {
  revalidatePath("/", "layout");

  for (const path of HOME_PATHS) {
    revalidatePath(path);
  }

  for (const locale of CMS_LOCALES) {
    revalidateTag(`cms-page-data-${locale}`);
    revalidateTag(`cms-home-shell-${locale}`);
  }
}
