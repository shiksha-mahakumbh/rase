import PublicPageShell from "@/components/layouts/PublicPageShell";
import RegistrationQuickLinks from "@/components/registration/RegistrationQuickLinks";
import RegistrationHub from "./RegistrationHub";
import {
  REGISTRATION_BREADCRUMBS,
  REGISTRATION_HERO_IMAGE,
  REGISTRATION_HERO_IMAGE_ALT,
  REGISTRATION_PAGE_HERO,
  REGISTRATION_PATH,
} from "@/data/registration-hub";

export default function RegistrationPageView() {
  return (
    <PublicPageShell
      hero={{
        eyebrow: REGISTRATION_PAGE_HERO.eyebrow,
        title: (
          <>
            <span className="text-brand-blue">{REGISTRATION_PAGE_HERO.titleEn}</span>
            <span lang="hi" className="mt-1 block text-2xl text-brand-saffron md:text-3xl">
              {REGISTRATION_PAGE_HERO.titleHi}
            </span>
          </>
        ),
        subtitle: REGISTRATION_PAGE_HERO.subtitle,
        accent: "brand",
        imageSrc: REGISTRATION_HERO_IMAGE,
        imageAlt: REGISTRATION_HERO_IMAGE_ALT,
        imagePriority: false,
      }}
      breadcrumbs={[...REGISTRATION_BREADCRUMBS]}
      relatedPath={REGISTRATION_PATH}
      showCta={false}
      skipContainer
    >
      <RegistrationQuickLinks />
      <RegistrationHub />
    </PublicPageShell>
  );
}
