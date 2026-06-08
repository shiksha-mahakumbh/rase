import PublicPageShell from "@/components/layouts/PublicPageShell";
import Conclaves from "../component/conclave";
import { PAGE_HEROES } from "@/lib/page-heroes";

export default function ConclavePage() {
  return (
    <PublicPageShell hero={PAGE_HEROES.conclave}>
      <Conclaves />
    </PublicPageShell>
  );
}
