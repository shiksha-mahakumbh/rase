import PublicPageShell from "@/components/layouts/PublicPageShell";
import MediaCenter from "@/components/media/MediaCenter";
import CmsMediaCenterHub from "@/components/media/CmsMediaCenterHub";
import { loadCmsMediaCenterHub } from "@/lib/cms/organizational";

const PAGE_HERO = {
  eyebrow: "Media Centre",
  title: "Media & Archives",
  subtitle:
    "Photos, videos, press releases, and edition-wise digital and print media archives.",
  accent: "navy" as const,
};

export default async function MediaCenterPage() {
  const hubItems = await loadCmsMediaCenterHub();

  return (
    <PublicPageShell hero={PAGE_HERO} showHero={false} skipContainer showCta>
      {hubItems.length > 0 && (
        <div className="mx-auto max-w-7xl px-4 pt-8 md:px-8">
          <CmsMediaCenterHub items={hubItems} />
        </div>
      )}
      <MediaCenter />
    </PublicPageShell>
  );
}
