import type { Metadata } from "next";
import { loadCmsDownloads, loadDefaultOgImage, loadRouteSeo } from "@/lib/cms/server";
import DownloadsClient from "./DownloadsClient";
import PublicPageShell from "@/components/layouts/PublicPageShell";
import { createPageMetadata } from "@/lib/seo/metadata";
import { metadataFromCmsSeo } from "@/lib/seo/cms-metadata";
import { buildWebPageSchema } from "@/server/services/seo.service";

export const revalidate = 300;

const FALLBACK_META = {
  title: "Downloads — Brochures, Reports & Guidelines",
  description:
    "Download official Shiksha Mahakumbh brochures, reports, guidelines, circulars, and presentations.",
  path: "/downloads",
  keywords: ["Shiksha Mahakumbh downloads", "brochures", "reports", "guidelines"],
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

import { brandPageHero } from "@/lib/page-heroes";

const BREADCRUMBS = [
  { name: "Home", path: "/" },
  { name: "Downloads", path: "/downloads" },
];

export default async function DownloadsPage() {
  const downloads = await loadCmsDownloads();

  const jsonLd = buildWebPageSchema({
    title: "Downloads Center — Shiksha Mahakumbh",
    description: "Official downloadable resources",
    url: "/downloads",
  });

  return (
    <PublicPageShell
      hero={brandPageHero(
        "Downloads Center",
        "Official brochures, reports, guidelines, circulars, and presentations.",
        "Resources"
      )}
      showCta={false}
      breadcrumbs={BREADCRUMBS}
    >
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <DownloadsClient initialDownloads={downloads} />
    </PublicPageShell>
  );
}
