import PublicPageShell from "@/components/layouts/PublicPageShell";
import Topics from "../component/Topics";
import { PAGE_HEROES } from "@/lib/page-heroes";

export default function TopicsPage() {
  return (
    <PublicPageShell hero={PAGE_HEROES.topics}>
      <Topics />
    </PublicPageShell>
  );
}
