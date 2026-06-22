import PublicPageShell from "@/components/layouts/PublicPageShell";
import MediaCenter from "@/components/media/MediaCenter";
import MediaCenterShowcase from "@/components/media/MediaCenterShowcase";
import CmsMediaCenterHub from "@/components/media/CmsMediaCenterHub";
import { loadCmsMediaCenterHub } from "@/lib/cms/organizational";

const BREADCRUMBS = [
  { name: "Home", path: "/" },
  { name: "Media Centre", path: "/media-center" },
];

export default async function MediaCenterPage() {
  const hubItems = await loadCmsMediaCenterHub();

  return (
    <PublicPageShell
      showHero={false}
      skipContainer
      showCta
      relatedPath="/media-center"
      breadcrumbs={BREADCRUMBS}
    >
      <MediaCenterShowcase>
        {hubItems.length > 0 && <CmsMediaCenterHub items={hubItems} />}
        <MediaCenter />
      </MediaCenterShowcase>
    </PublicPageShell>
  );
}
