import IntroductionContent from "@/app/introduction/IntroductionContent";
import { createPageMetadata } from "@/lib/seo/metadata";
import { getTranslations } from "next-intl/server";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "meta" });

  return createPageMetadata({
    title: t("aboutTitle"),
    description: t("aboutDescription"),
    path: locale === "en" ? "/introduction" : `/${locale}/introduction`,
  });
}

export default function LocaleIntroductionPage() {
  return <IntroductionContent />;
}
