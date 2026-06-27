import type { Metadata } from "next";
import { createPageMetadata } from "@/lib/seo/metadata";
import { metadataFromCmsSeo } from "@/lib/seo/cms-metadata";
import { withHreflang } from "@/lib/seo/hreflang";
import { loadCmsHomepage } from "@/lib/cms/server";
import { getTranslations } from "next-intl/server";
import { cmsLocaleForRoute } from "@/lib/home/cms-locale";

export async function buildLocaleHomeMetadata(locale: string): Promise<Metadata> {
  const cmsLocale = cmsLocaleForRoute(locale);
  const t = await getTranslations({ locale, namespace: "meta" });
  const path = locale === "en" ? "/" : `/${locale}`;

  const homepage = await loadCmsHomepage(cmsLocale);
  if (homepage?.seo) {
    return withHreflang(
      metadataFromCmsSeo(homepage.seo, {
        title: t("homeTitle"),
        description: t("homeDescription"),
        path,
      }),
      "/"
    );
  }

  return withHreflang(
    createPageMetadata({
      title: t("homeTitle"),
      description: t("homeDescription"),
      path,
      locale: locale === "hi" ? "hi_IN" : "en_IN",
    }),
    "/"
  );
}
