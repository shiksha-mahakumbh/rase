import type { Metadata } from "next";
import PublicPageShell from "@/components/layouts/PublicPageShell";
import BreadcrumbJsonLd from "@/components/seo/BreadcrumbJsonLd";
import SpeakersHub from "@/components/speakers/SpeakersHub";
import { loadCmsSpeakers } from "@/lib/cms/organizational";
import { createPageMetadata } from "@/lib/seo/metadata";

const FALLBACK = {
  title: "Speakers & Dignitaries",
  description:
    "National leaders, scholars, and reformers who have shaped the Shiksha Mahakumbh movement.",
  path: "/speakers",
};

export const metadata: Metadata = createPageMetadata(FALLBACK);

export default async function SpeakersPage() {
  const speakers = await loadCmsSpeakers();

  return (
    <>
      <BreadcrumbJsonLd
        items={[
          { name: "Home", path: "/" },
          { name: "Speakers", path: "/speakers" },
        ]}
      />
      <PublicPageShell
        hero={{
          eyebrow: "Leadership",
          title: "Speakers & Dignitaries",
          subtitle:
            "National leaders, scholars, and reformers who have shaped the Shiksha Mahakumbh movement.",
          accent: "navy",
        }}
        relatedPath="/speakers"
        showCta={false}
      >
        <SpeakersHub speakers={speakers} />
      </PublicPageShell>
    </>
  );
}
