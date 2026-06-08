import PublicPageShell from "@/components/layouts/PublicPageShell";
import AbstractSubmission from "../component/AbstractSubmission";
import { PAGE_HEROES } from "@/lib/page-heroes";

export default function AbstractPage() {
  return (
    <PublicPageShell hero={PAGE_HEROES.abstract} skipContainer>
      <AbstractSubmission />
    </PublicPageShell>
  );
}
