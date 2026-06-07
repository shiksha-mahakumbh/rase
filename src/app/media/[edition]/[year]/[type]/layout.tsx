import type { Metadata } from "next";
import { mediaArchiveMeta, type MediaArchiveSlug } from "@/lib/seo/mediaArchives";
import { MEDIA_ARCHIVE_CANONICAL } from "@/constants/canonical-routes";
import BreadcrumbJsonLd from "@/components/seo/BreadcrumbJsonLd";
import { CANONICAL_ROUTES } from "@/constants/canonical-routes";

const LEGACY_BY_CANONICAL: Record<string, MediaArchiveSlug> = {};
for (const [legacy, parts] of Object.entries(MEDIA_ARCHIVE_CANONICAL)) {
  const canonical = `/media/${parts.edition}/${parts.year}/${parts.type}`;
  const slug = legacy.replace(/^\//, "") as MediaArchiveSlug;
  LEGACY_BY_CANONICAL[canonical] = slug;
}

type Props = { params: Promise<{ edition: string; year: string; type: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { edition, year, type } = await params;
  const canonical = `/media/${edition}/${year}/${type}`;
  const slug = LEGACY_BY_CANONICAL[canonical];
  if (!slug) return { title: "Media Archive" };
  return mediaArchiveMeta(slug);
}

export default async function MediaArchiveLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ edition: string; year: string; type: string }>;
}) {
  const { edition, year, type } = await params;
  const path = `/media/${edition}/${year}/${type}`;
  const label = `${edition.replace(/-/g, " ")} ${year} ${type}`;

  return (
    <>
      <BreadcrumbJsonLd
        items={[
          { name: "Home", path: "/" },
          { name: "Media Centre", path: CANONICAL_ROUTES.mediaCenter },
          { name: label, path },
        ]}
      />
      {children}
    </>
  );
}
