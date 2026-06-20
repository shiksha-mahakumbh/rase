import type { Metadata } from "next";
import PublicPageShell from "@/components/layouts/PublicPageShell";
import AbhiyanPhotoFrameContent from "@/components/abhiyan/AbhiyanPhotoFrameContent";
import BreadcrumbJsonLd from "@/components/seo/BreadcrumbJsonLd";
import AbhiyanPhotoFrameJsonLd from "@/components/seo/AbhiyanPhotoFrameJsonLd";
import { createPageMetadata } from "@/lib/seo/metadata";

export const metadata: Metadata = createPageMetadata({
  title: "Shiksha Mahakumbh Abhiyan Photo Frame",
  description:
    "Official Shiksha Mahakumbh Abhiyan photo frame — patron, advisors, edition chief guests, invitation campaign dignitaries, coordinators, and PDF across editions 1.0–5.0. National education movement, NEP 2020 aligned.",
  path: "/abhiyaninphotoframe",
  keywords: [
    "Shiksha Mahakumbh Abhiyan",
    "Shiksha Mahakumbh photo frame",
    "Department of Holistic Education",
    "Indian education conference",
    "NEP 2020",
    "education dignitaries India",
    "invitation campaign",
    "national education movement",
  ],
  locale: "en_IN",
});

export default function AbhiyanPhotoFramePage() {
  return (
    <>
      <BreadcrumbJsonLd
        items={[
          { name: "Home", path: "/" },
          { name: "Abhiyan Photo Frame", path: "/abhiyaninphotoframe" },
        ]}
      />
      <AbhiyanPhotoFrameJsonLd />
      <PublicPageShell
        hero={{
          eyebrow: "Shiksha Mahakumbh Abhiyan · शिक्षा महाकुंभ अभियान",
          title: "Abhiyan Photo Frame",
          subtitle: "Leadership, editions, invitation campaign & coordinators — Editions 1.0 to 5.0",
          accent: "brand",
          imageSrc: "/branding/shiksha-mahakumbh-brand-hero.png",
        }}
        relatedPath="/abhiyaninphotoframe"
        showCta={false}
        containerClassName="mx-auto max-w-6xl px-4 py-8 md:px-8 md:py-10"
      >
        <AbhiyanPhotoFrameContent />
      </PublicPageShell>
    </>
  );
}
