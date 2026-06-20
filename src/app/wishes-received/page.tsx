import PublicPageShell from "@/components/layouts/PublicPageShell";
import WishesReceived from "@/components/content/wishes_received";
import { brandPageHero } from "@/lib/page-heroes";

export default function WishesReceivedPage() {
  return (
    <PublicPageShell
      hero={brandPageHero(
        "Wishes Received for the success of Shiksha Mahakumbh 2024",
        "Messages and best wishes from dignitaries, leaders, and institutions supporting the national education movement.",
        "Distinguished Greetings"
      )}
      relatedPath="/wishes-received"
      skipContainer
      showCta={false}
    >
      <WishesReceived />
    </PublicPageShell>
  );
}
