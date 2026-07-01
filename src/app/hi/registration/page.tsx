import RegistrationPageView from "@/app/registration/RegistrationPageView";
import RegistrationJsonLd from "@/components/seo/RegistrationJsonLd";
import { createPageMetadata } from "@/lib/seo/metadata";
import { withHreflang } from "@/lib/seo/hreflang";
import {
  REGISTRATION_OG_IMAGE,
  REGISTRATION_PATH,
  registrationMetaDescription,
} from "@/data/registration-hub";
import hiMessages from "@/i18n/messages/hi.json";
import { setRequestLocale } from "next-intl/server";

export async function generateMetadata() {
  setRequestLocale("hi");

  return withHreflang(
    createPageMetadata({
      title: hiMessages.registration.title,
      description: registrationMetaDescription(),
      path: "/hi/registration",
      locale: "hi_IN",
      ogImageUrl: REGISTRATION_OG_IMAGE,
    }),
    REGISTRATION_PATH
  );
}

export default function HiRegistrationPage() {
  setRequestLocale("hi");

  return (
    <>
      <RegistrationJsonLd />
      <RegistrationPageView />
    </>
  );
}
