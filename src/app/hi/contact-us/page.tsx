import ContactPageView from "@/app/contact-us/ContactPageView";
import { createPageMetadata } from "@/lib/seo/metadata";
import { withHreflang } from "@/lib/seo/hreflang";
import {
  CONTACT_OG_IMAGE,
  CONTACT_PATH,
  contactMetaDescription,
} from "@/data/contact-hub";
import { getTranslations } from "next-intl/server";

export async function generateMetadata() {
  const t = await getTranslations({ locale: "hi", namespace: "meta" });

  return withHreflang(
    createPageMetadata({
      title: t("contactTitle"),
      description: contactMetaDescription(),
      path: "/hi/contact-us",
      locale: "hi_IN",
      ogImageUrl: CONTACT_OG_IMAGE,
    }),
    CONTACT_PATH
  );
}

export default function HiContactPage() {
  return <ContactPageView />;
}
