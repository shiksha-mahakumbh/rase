import type { Metadata } from "next";
import PublicPageShell from "@/components/layouts/PublicPageShell";
import BreadcrumbJsonLd from "@/components/seo/BreadcrumbJsonLd";
import SpeakersDirectoryJsonLd from "@/components/seo/SpeakersDirectoryJsonLd";
import MahakumbhAbhiyanSpeakersDirectory from "@/components/speakers/MahakumbhAbhiyanSpeakersDirectory";
import { createPageMetadata } from "@/lib/seo/metadata";
import {
  SPEAKERS_DIRECTORY_HERO,
  SPEAKERS_DIRECTORY_KEYWORDS,
} from "@/data/speakers-directory-content";

export const metadata: Metadata = createPageMetadata({
  title: "Speaker Directory — Shiksha Mahakumbh Editions 1.0–5.0",
  description:
    "Complete speaker directory for Shiksha Mahakumbh Abhiyan — 200+ dignitaries, vice-chancellors, directors, policymakers, and experts across editions 1.0 to 5.0.",
  path: "/speakers/directory",
  keywords: [...SPEAKERS_DIRECTORY_KEYWORDS],
  locale: "en_IN",
});

export default function SpeakersDirectoryPage() {
  return (
    <>
      <BreadcrumbJsonLd
        items={[
          { name: "Home", path: "/" },
          { name: "Speakers", path: "/speakers" },
          { name: "Speaker Directory", path: "/speakers/directory" },
        ]}
      />
      <SpeakersDirectoryJsonLd />
      <PublicPageShell
        hero={{
          eyebrow: SPEAKERS_DIRECTORY_HERO.eyebrow,
          title: (
            <>
              {SPEAKERS_DIRECTORY_HERO.title}
              <span className="mt-1 block text-xl font-semibold text-brand-saffron md:text-2xl">
                Editions 1.0 – 5.0
              </span>
            </>
          ),
          subtitle: SPEAKERS_DIRECTORY_HERO.subtitle,
          accent: "brand",
          imageSrc: "/branding/shiksha-mahakumbh-brand-hero.png",
        }}
        relatedPath="/speakers/directory"
        showCta={false}
        containerClassName="mx-auto max-w-7xl px-4 py-8 md:px-8 md:py-10"
      >
        <MahakumbhAbhiyanSpeakersDirectory />
      </PublicPageShell>
    </>
  );
}
