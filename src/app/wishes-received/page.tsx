import PublicPageShell from "@/components/layouts/PublicPageShell";
import WishesReceived from "@/app/component/wishes_received";

const PAGE_HERO = {
  eyebrow: "Distinguished Greetings",
  title: "Wishes Received for the success of Shiksha Mahakumbh 2024",
  subtitle:
    "Messages and best wishes from dignitaries, leaders, and institutions supporting the national education movement.",
  accent: "navy" as const,
};

export default function WishesReceivedPage() {
  return (
    <PublicPageShell
      hero={PAGE_HERO}
      relatedPath="/wishes-received"
      skipContainer
      showCta={false}
    >
      <WishesReceived />
    </PublicPageShell>
  );
}
