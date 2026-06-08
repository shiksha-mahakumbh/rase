import PublicPageShell from "@/components/layouts/PublicPageShell";
import GlimpsesContent from "@/components/media/GlimpsesContent";
import { PAGE_HEROES } from "@/lib/page-heroes";
import { createPageMetadata } from "@/lib/seo/metadata";

export const metadata = createPageMetadata({
  title: "Glimpses of Shiksha Mahakumbh Abhiyan | शिक्षा महाकुंभ अभियान",
  description:
    "Explore glimpses of शिक्षा महाकुंभ अभियान (Shiksha Mahakumbh Abhiyan) — India's leading movement uniting education, research, innovation, and global development.",
  path: "/glimpses",
  keywords: [
    "Shiksha Mahakumbh",
    "Education Summit India",
    "Indian Education System",
    "Global Education",
    "DHE",
    "Holistic Education",
  ],
});

export default function GlimpsesPage() {
  return (
    <PublicPageShell
      hero={PAGE_HEROES.glimpses}
      relatedPath="/media-center"
      containerClassName="mx-auto max-w-5xl px-4 py-12 md:px-8 md:py-16"
    >
      <GlimpsesContent />
    </PublicPageShell>
  );
}
