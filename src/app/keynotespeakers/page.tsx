import PublicPageShell from "@/components/layouts/PublicPageShell";
import KeynoteSpeakers from "@/components/content/KeynoteSpeakers";
import Marquees from "@/components/layout/Marquees";
import { brandPageHero } from "@/lib/page-heroes";

export default function KeynoteSpeakersPage() {
  return (
    <PublicPageShell
      hero={brandPageHero(
        "Keynote Speakers",
        "Distinguished speakers and thought leaders at Shiksha Mahakumbh summits.",
        "Programmes"
      )}
      skipContainer
    >
      <Marquees />
      <div className="mx-auto max-w-7xl px-4 py-8 md:px-8">
        <KeynoteSpeakers />
      </div>
    </PublicPageShell>
  );
}
