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

const PAGE_HERO = {
  eyebrow: "Resources",
  title: "Downloads Center",
  subtitle: "Official brochures, reports, guidelines, circulars, and presentations.",
  accent: "navy" as const,
};

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
    <PublicPageShell hero={PAGE_HERO} showCta={false} breadcrumbs={BREADCRUMBS}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <DownloadsClient initialDownloads={downloads} />
    </PublicPageShell>
  );
}
