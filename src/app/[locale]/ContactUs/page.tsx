import ContactPageView from "@/app/contact-us/ContactPageView";
import { createPageMetadata } from "@/lib/seo/metadata";
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

  return createPageMetadata({
    title: t("contactTitle"),
    description: contactMetaDescription(),
    path: locale === "en" ? CONTACT_PATH : `/${locale}/ContactUs`,
    locale: "en_IN",
    ogImageUrl: CONTACT_OG_IMAGE,
  });
}

export default function LocaleContactPage() {
  return <ContactPageView />;
}
