import PublicPageShell from "@/components/layouts/PublicPageShell";
import KeynoteSpeakers from "../component/KeynoteSpeakers";
import Marquees from "../component/Marquees";

const PAGE_HERO = {
  eyebrow: "Programmes",
  title: "Keynote Speakers",
  subtitle: "Distinguished speakers and thought leaders at Shiksha Mahakumbh summits.",
  accent: "saffron" as const,
};

export default function KeynoteSpeakersPage() {
  return (
    <PublicPageShell hero={PAGE_HERO} skipContainer>
      <Marquees />
      <div className="mx-auto max-w-7xl px-4 py-8 md:px-8">
        <KeynoteSpeakers />
      </div>
    </PublicPageShell>
  );
}
