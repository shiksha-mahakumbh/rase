import PublicPageShell from "@/components/layouts/PublicPageShell";
import Feedback from "@/components/content/Feedback";
import { brandPageHero } from "@/lib/page-heroes";

export default function FeedbackPage() {
  return (
    <PublicPageShell
      hero={brandPageHero(
        "Feedback",
        "Share your experience and help improve Shiksha Mahakumbh programmes.",
        "Community"
      )}
    >
      <Feedback />
    </PublicPageShell>
  );
}
