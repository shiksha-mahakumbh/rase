import type { Metadata } from "next";
import { loadCmsDownloads, loadDefaultOgImage, loadRouteSeo } from "@/lib/cms/server";
import DownloadsShowcase from "@/components/downloads/DownloadsShowcase";
import DownloadsJsonLd from "@/components/downloads/DownloadsJsonLd";
import PublicPageShell from "@/components/layouts/PublicPageShell";
import { createPageMetadata } from "@/lib/seo/metadata";
import { metadataFromCmsSeo } from "@/lib/seo/cms-metadata";

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
      showHero={false}
      showCta={false}
      breadcrumbs={BREADCRUMBS}
      relatedPath="/downloads"
      skipContainer
    >
      <DownloadsJsonLd />
      <DownloadsShowcase initialDownloads={downloads} />
    </PublicPageShell>
  );
}
