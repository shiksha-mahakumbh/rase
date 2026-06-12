import type { Metadata } from "next";
import HomePage from "@/components/home/HomePage";
import HomeJsonLd from "@/components/home/HomeJsonLd";
import { CmsProvider } from "@/lib/cms/context";
import { extractFaqsFromCmsData } from "@/lib/cms/faq";
import { loadCmsHomepage, loadCmsPageData } from "@/lib/cms/server";
import { createPageMetadata } from "@/lib/seo/metadata";
import { metadataFromCmsSeo } from "@/lib/seo/cms-metadata";
import { withHreflang } from "@/lib/seo/hreflang";
import { getTranslations } from "next-intl/server";
import type { ContentLocale } from "@prisma/client";

const FALLBACK_META = {
  title: "Shiksha Mahakumbh 6.0 — National Education Summit",
  description:
    "Join Shiksha Mahakumbh 6.0 at NIT Hamirpur, 9–11 October 2026. India's premier multidisciplinary education summit.",
  path: "/hi",
};

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const cmsLocale = (locale === "hi" ? "hi" : "en") as ContentLocale;
  const t = await getTranslations({ locale, namespace: "meta" });

  const homepage = await loadCmsHomepage(cmsLocale);
  if (homepage?.seo) {
    return withHreflang(
      metadataFromCmsSeo(homepage.seo, {
        title: t("homeTitle"),
        description: t("homeDescription"),
        path: locale === "en" ? "/" : `/${locale}`,
      }),
      "/"
    );
  }

  return withHreflang(
    createPageMetadata({
      title: t("homeTitle"),
      description: t("homeDescription"),
      path: locale === "en" ? "/" : `/${locale}`,
      locale: locale === "hi" ? "hi_IN" : "en_IN",
    }),
    "/"
  );
}

export default async function LocaleHomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const cmsLocale = (locale === "hi" ? "hi" : "en") as ContentLocale;
  const cmsData = await loadCmsPageData(cmsLocale);
  const faqs = extractFaqsFromCmsData(cmsData);

  return (
    <CmsProvider data={cmsData}>
      <HomeJsonLd faqs={faqs} />
      {cmsData.homepage?.seo?.schemaJsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(cmsData.homepage.seo.schemaJsonLd),
          }}
        />
      )}
      <HomePage />
    </CmsProvider>
  );
}
