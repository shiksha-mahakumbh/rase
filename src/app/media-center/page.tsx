import PublicPageShell from "@/components/layouts/PublicPageShell";
import MediaCenterShowcase from "@/components/media/MediaCenterShowcase";
import MediaCenterJsonLd from "@/components/media/MediaCenterJsonLd";
import { loadCmsMediaCenterHub } from "@/lib/cms/organizational";

const BREADCRUMBS = [
  { name: "Home", path: "/" },
  { name: "Media Centre", path: "/media-center" },
];

export default async function MediaCenterPage() {
  const cmsItems = await loadCmsMediaCenterHub();

  return (
    <PublicPageShell
      showHero={false}
      skipContainer
      showCta
      relatedPath="/media-center"
      breadcrumbs={BREADCRUMBS}
    >
      <MediaCenterJsonLd cmsItems={cmsItems} />
      <MediaCenterShowcase cmsItems={cmsItems} />
    </PublicPageShell>
  );
}
