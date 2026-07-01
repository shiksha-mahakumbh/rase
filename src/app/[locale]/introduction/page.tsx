import IntroductionContent from "@/app/introduction/IntroductionContent";
import { createPageMetadata } from "@/lib/seo/metadata";
import { withHreflang } from "@/lib/seo/hreflang";
import { openGraphLocale } from "@/lib/seo/locale";
import { getTranslations, setRequestLocale } from "next-intl/server";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "meta" });

  return withHreflang(
    createPageMetadata({
      title: t("aboutTitle"),
      description: t("aboutDescription"),
      path: locale === "en" ? "/introduction" : `/${locale}/introduction`,
      locale: openGraphLocale(locale),
    }),
    "/introduction"
  );
}

export default function LocaleIntroductionPage() {
  return <IntroductionContent />;
}
