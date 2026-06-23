import PublicPageShell from "@/components/layouts/PublicPageShell";
import MahakumbhAbhiyanSpeakersDirectory from "@/components/speakers/MahakumbhAbhiyanSpeakersDirectory";
import {
  SPEAKERS_DIRECTORY_BREADCRUMBS,
  SPEAKERS_DIRECTORY_HERO,
  SPEAKERS_DIRECTORY_HERO_IMAGE,
  SPEAKERS_DIRECTORY_HERO_IMAGE_ALT,
  SPEAKERS_DIRECTORY_PATH,
} from "@/data/speakers-directory-content";

export default function SpeakersDirectoryPage() {
  return (
    <PublicPageShell
      hero={{
        eyebrow: SPEAKERS_DIRECTORY_HERO.eyebrow,
        title: (
          <>
            {SPEAKERS_DIRECTORY_HERO.title}
            <span className="mt-1 block text-xl font-semibold text-brand-saffron md:text-2xl">
              {SPEAKERS_DIRECTORY_HERO.titleEditionLine}
            </span>
          </>
        ),
        subtitle: SPEAKERS_DIRECTORY_HERO.subtitle,
        accent: "brand",
        imageSrc: SPEAKERS_DIRECTORY_HERO_IMAGE,
        imageAlt: SPEAKERS_DIRECTORY_HERO_IMAGE_ALT,
      }}
      breadcrumbs={[...SPEAKERS_DIRECTORY_BREADCRUMBS]}
      relatedPath={SPEAKERS_DIRECTORY_PATH}
      showCta={false}
      containerClassName="mx-auto max-w-7xl px-4 py-8 md:px-8 md:py-10"
    >
      <MahakumbhAbhiyanSpeakersDirectory />
    </PublicPageShell>
  );
}
