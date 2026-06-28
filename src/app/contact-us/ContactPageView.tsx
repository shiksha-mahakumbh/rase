import PublicPageShell from "@/components/layouts/PublicPageShell";
import ContactQuickLinks from "@/components/contact/ContactQuickLinks";
import ContactJsonLd from "@/components/contact/ContactJsonLd";
import ContactUs from "@/components/content/ContactUs";
import DeferredRecaptchaScript from "@/components/security/DeferredRecaptchaScript";
import {
  CONTACT_BREADCRUMBS,
  CONTACT_HERO_IMAGE,
  CONTACT_HERO_IMAGE_ALT,
  CONTACT_PAGE_HERO,
  CONTACT_PATH,
} from "@/data/contact-hub";

export default function ContactPageView() {
  return (
    <PublicPageShell
      hero={{
        eyebrow: CONTACT_PAGE_HERO.eyebrow,
        title: CONTACT_PAGE_HERO.title,
        subtitle: CONTACT_PAGE_HERO.subtitle,
        accent: "brand",
        imageSrc: CONTACT_HERO_IMAGE,
        imageAlt: CONTACT_HERO_IMAGE_ALT,
      }}
      showCta={false}
      breadcrumbs={[...CONTACT_BREADCRUMBS]}
      relatedPath={CONTACT_PATH}
      skipContainer
    >
      <ContactJsonLd />
      <DeferredRecaptchaScript />
      <ContactQuickLinks />
      <ContactUs />
    </PublicPageShell>
  );
}
