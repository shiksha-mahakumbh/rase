import GalleryJsonLd from "@/components/gallery/GalleryJsonLd";
import GalleryShowcase from "@/components/gallery/GalleryShowcase";
import PublicPageShell from "@/components/layouts/PublicPageShell";
import type { GalleryTab } from "@/data/gallery-hub";

const BREADCRUMBS = [
  { name: "Home", path: "/" },
  { name: "Media Centre", path: "/media-center" },
  { name: "Gallery", path: "/gallery" },
];

type Props = {
  searchParams: Promise<{ tab?: string }>;
};

export default async function GalleryRoutePage({ searchParams }: Props) {
  const params = await searchParams;
  const activeTab: GalleryTab = params.tab === "videos" ? "videos" : "photos";

  return (
    <PublicPageShell
      showHero={false}
      showCta={false}
      breadcrumbs={BREADCRUMBS}
      relatedPath="/gallery"
      skipContainer
    >
      <GalleryJsonLd />
      <GalleryShowcase activeTab={activeTab} />
    </PublicPageShell>
  );
}
