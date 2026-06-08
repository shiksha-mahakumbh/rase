import PublicPageShell from "@/components/layouts/PublicPageShell";
import Feedback from "../component/Feedback";

const PAGE_HERO = {
  eyebrow: "Community",
  title: "Feedback",
  subtitle: "Share your experience and help improve Shiksha Mahakumbh programmes.",
  accent: "saffron" as const,
};

export default function FeedbackPage() {
  return (
    <PublicPageShell hero={PAGE_HERO}>
      <Feedback />
    </PublicPageShell>
  );
}
