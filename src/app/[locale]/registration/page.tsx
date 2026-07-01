import RegistrationPageView from "@/app/registration/RegistrationPageView";
import RegistrationJsonLd from "@/components/seo/RegistrationJsonLd";
import { createPageMetadata } from "@/lib/seo/metadata";
import { withHreflang } from "@/lib/seo/hreflang";
import { openGraphLocale } from "@/lib/seo/locale";
import {
  REGISTRATION_OG_IMAGE,
  REGISTRATION_PATH,
  registrationMetaDescription,
} from "@/data/registration-hub";
import { getTranslations, setRequestLocale } from "next-intl/server";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "registration" });

  return withHreflang(
    createPageMetadata({
      title: t("title"),
      description: registrationMetaDescription(),
      path: locale === "en" ? REGISTRATION_PATH : `/${locale}${REGISTRATION_PATH}`,
      locale: openGraphLocale(locale),
      ogImageUrl: REGISTRATION_OG_IMAGE,
    }),
    REGISTRATION_PATH
  );
}

export default function LocaleRegistrationPage() {
  return (
    <>
      <RegistrationJsonLd />
      <RegistrationPageView />
    </>
  );
}
