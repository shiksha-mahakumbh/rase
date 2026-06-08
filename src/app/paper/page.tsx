import PublicPageShell from "@/components/layouts/PublicPageShell";
import PaperSubmission from "../component/Papersubmit";

const PAGE_HERO = {
  eyebrow: "Research",
  title: "Paper Submission Portal",
  subtitle: "Redirecting to the academic council paper submission portal.",
  accent: "emerald" as const,
};

export default function PaperPage() {
  return (
    <PublicPageShell hero={PAGE_HERO} showCta={false}>
      <PaperSubmission />
    </PublicPageShell>
  );
}
