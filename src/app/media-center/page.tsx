import PublicPageShell from "@/components/layouts/PublicPageShell";
import MediaCenter from "@/components/media/MediaCenter";
import CmsMediaCenterHub from "@/components/media/CmsMediaCenterHub";
import { loadCmsMediaCenterHub } from "@/lib/cms/organizational";
import { brandPageHero } from "@/lib/page-heroes";

export default async function MediaCenterPage() {
  const hubItems = await loadCmsMediaCenterHub();

  return (
    <PublicPageShell
      hero={brandPageHero(
        <>
          <span className="text-brand-blue">Media &amp; Archives</span>
          <span className="mt-1 block text-2xl text-brand-saffron md:text-3xl">
            झलकियाँ – शिक्षा महाकुंभ अभियान
          </span>
        </>,
        "Photos, videos, press releases, and edition-wise digital and print media archives.",
        "Media Centre"
      )}
      skipContainer
      showCta
    >
      {hubItems.length > 0 && (
        <div className="mx-auto max-w-7xl px-4 pt-8 md:px-8">
          <CmsMediaCenterHub items={hubItems} />
        </div>
      )}
      <MediaCenter />
    </PublicPageShell>
  );
}
