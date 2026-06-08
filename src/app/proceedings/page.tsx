import PublicPageShell from "@/components/layouts/PublicPageShell";
import ProceedingsShell from "./ProceedingsShell";
import { PAGE_HEROES } from "@/lib/page-heroes";

export default function ProceedingsPage() {
  return (
    <PublicPageShell hero={PAGE_HEROES.proceedings} relatedPath="/proceedings">
      <ProceedingsShell />
    </PublicPageShell>
  );
}
