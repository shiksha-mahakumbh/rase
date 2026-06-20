import PublicPageShell from "@/components/layouts/PublicPageShell";
import Journals from "@/components/content/Journals";
import { brandPageHero } from "@/lib/page-heroes";

export default function JournalsPage() {
  return (
    <PublicPageShell
      hero={brandPageHero(
        "Journals",
        "Academic journals affiliated with the national education movement.",
        "Publications"
      )}
    >
      <Journals />
    </PublicPageShell>
  );
}
