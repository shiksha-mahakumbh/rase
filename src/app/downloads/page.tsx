import type { Metadata } from "next";
import { loadCmsDownloads, loadDefaultOgImage, loadRouteSeo } from "@/lib/cms/server";
import DownloadsShowcase from "@/components/downloads/DownloadsShowcase";
import DownloadsJsonLd from "@/components/downloads/DownloadsJsonLd";
import PublicPageShell from "@/components/layouts/PublicPageShell";
import { createPageMetadata } from "@/lib/seo/metadata";
import { metadataFromCmsSeo } from "@/lib/seo/cms-metadata";
import { brandPageHero } from "@/lib/page-heroes";

export const revalidate = 300;

const FALLBACK_META = {
  title: "Brochures & Downloads — Shiksha Mahakumbh Editions 1.0–6.0",
  description:
    "Download official Shiksha Mahakumbh Abhiyan edition brochures (PDF), reports, guidelines, and circulars. Free access for national and international education delegates.",
  path: "/downloads",
  keywords: [
    "Shiksha Mahakumbh brochure",
    "edition brochure PDF",
    "Shiksha Mahakumbh downloads",
    "education conference brochure India",
    "NEP 2020 conference materials",
    "international education delegates",
  ],
};

export async function generateMetadata(): Promise<Metadata> {
  const [seo, ogImage] = await Promise.all([
    loadRouteSeo("downloads"),
    loadDefaultOgImage(),
  ]);

  if (seo) {
    return metadataFromCmsSeo(seo, { ...FALLBACK_META, ogImageUrl: ogImage });
  }

  return createPageMetadata({ ...FALLBACK_META, ogImageUrl: ogImage ?? undefined });
}

const BREADCRUMBS = [
  { name: "Home", path: "/" },
  { name: "Brochures & Downloads", path: "/downloads" },
];

export default async function DownloadsPage() {
  const downloads = await loadCmsDownloads();

  return (
    <PublicPageShell
      hero={brandPageHero(
        "Brochures & Downloads",
        "Official edition brochures (1.0–6.0), reports, guidelines, and resources — free for national and international delegates.",
        "Resources · Global Access"
      )}
      showCta={false}
      breadcrumbs={BREADCRUMBS}
      containerClassName="mx-auto max-w-6xl px-4 py-10 md:px-8 md:py-14"
    >
      <DownloadsJsonLd />
      <DownloadsShowcase initialDownloads={downloads} />
    </PublicPageShell>
  );
}
