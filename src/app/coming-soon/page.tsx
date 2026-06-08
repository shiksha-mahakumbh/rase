import PublicPageShell from "@/components/layouts/PublicPageShell";
import ComingSoon from "../component/CommingSoon";
import { PAGE_HEROES } from "@/lib/page-heroes";

export default function ComingSoonPage() {
  return (
    <PublicPageShell hero={PAGE_HEROES.comingSoon}>
      <ComingSoon />
    </PublicPageShell>
  );
}
