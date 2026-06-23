import RegistrationJsonLd from "@/components/seo/RegistrationJsonLd";
import { createPageMetadata } from "@/lib/seo/metadata";
import {
  REGISTRATION_OG_IMAGE,
  REGISTRATION_PATH,
  REGISTRATION_SEO_KEYWORDS,
  registrationMetaDescription,
} from "@/data/registration-hub";

export const metadata = createPageMetadata({
  title: "Register — Shiksha Mahakumbh 6.0",
  description: registrationMetaDescription(),
  path: REGISTRATION_PATH,
  keywords: [...REGISTRATION_SEO_KEYWORDS],
  locale: "en_IN",
  ogImageUrl: REGISTRATION_OG_IMAGE,
});

export default function RegistrationLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <RegistrationJsonLd />
      {children}
    </>
  );
}
