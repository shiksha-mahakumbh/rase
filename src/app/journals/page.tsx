import PublicPageShell from "@/components/layouts/PublicPageShell";
import Journals from "../component/Journals";

const PAGE_HERO = {
  eyebrow: "Publications",
  title: "Journals",
  subtitle: "Academic journals affiliated with the national education movement.",
  accent: "navy" as const,
};

export default function JournalsPage() {
  return (
    <PublicPageShell hero={PAGE_HERO}>
      <Journals />
    </PublicPageShell>
  );
}
