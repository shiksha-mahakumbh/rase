import RegistrationHub from "@/app/registration/RegistrationHub";
import { createPageMetadata } from "@/lib/seo/metadata";
import { getTranslations } from "next-intl/server";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "registration" });

  return createPageMetadata({
    title: t("title"),
    description:
      "Official registration for Shiksha Mahakumbh 6.0 — delegates, conclaves, olympiads, awards, and more.",
    path: locale === "en" ? "/registration" : `/${locale}/registration`,
  });
}

export default function LocaleRegistrationPage() {
  return <RegistrationHub />;
}
