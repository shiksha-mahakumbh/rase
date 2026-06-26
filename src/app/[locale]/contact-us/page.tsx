import ContactPageView from "@/app/contact-us/ContactPageView";
import { createPageMetadata } from "@/lib/seo/metadata";
import { withHreflang } from "@/lib/seo/hreflang";
import { openGraphLocale } from "@/lib/cookie-consent";
import {
  CONTACT_OG_IMAGE,
  CONTACT_PATH,
  contactMetaDescription,
} from "@/data/contact-hub";
import { getTranslations } from "next-intl/server";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "meta" });

  return withHreflang(
    createPageMetadata({
      title: t("contactTitle"),
      description: contactMetaDescription(),
      path: locale === "en" ? CONTACT_PATH : `/${locale}/contact-us`,
      locale: openGraphLocale(locale),
      ogImageUrl: CONTACT_OG_IMAGE,
    }),
    CONTACT_PATH
  );
}

export default function LocaleContactPage() {
  return <ContactPageView />;
}
