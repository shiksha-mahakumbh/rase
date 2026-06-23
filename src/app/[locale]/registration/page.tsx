import RegistrationPageView from "@/app/registration/RegistrationPageView";
import RegistrationJsonLd from "@/components/seo/RegistrationJsonLd";
import { createPageMetadata } from "@/lib/seo/metadata";
import {
  REGISTRATION_OG_IMAGE,
  REGISTRATION_PATH,
  registrationMetaDescription,
} from "@/data/registration-hub";
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
    description: registrationMetaDescription(),
    path: locale === "en" ? REGISTRATION_PATH : `/${locale}${REGISTRATION_PATH}`,
    locale: "en_IN",
    ogImageUrl: REGISTRATION_OG_IMAGE,
  });
}

export default function LocaleRegistrationPage() {
  return (
    <>
      <RegistrationJsonLd />
      <RegistrationPageView />
    </>
  );
}
