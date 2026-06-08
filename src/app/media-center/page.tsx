import PublicPageShell from "@/components/layouts/PublicPageShell";
import MediaCenter from "@/components/media/MediaCenter";

const PAGE_HERO = {
  eyebrow: "Media Centre",
  title: "Media & Archives",
  subtitle:
    "Photos, videos, press releases, and edition-wise digital and print media archives.",
  accent: "navy" as const,
};

export default function MediaCenterPage() {
  return (
    <PublicPageShell hero={PAGE_HERO} showHero={false} skipContainer showCta>
      <MediaCenter />
    </PublicPageShell>
  );
}
