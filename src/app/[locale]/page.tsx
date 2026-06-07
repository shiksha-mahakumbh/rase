import HomePage from "@/components/home/HomePage";
import HomeJsonLd from "@/components/home/HomeJsonLd";
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
    title: t("homeTitle"),
    description: t("homeDescription"),
    path: locale === "en" ? "/" : `/${locale}`,
  });
}

export default function LocaleHomePage() {
  return (
    <>
      <HomeJsonLd />
      <HomePage />
    </>
  );
}
