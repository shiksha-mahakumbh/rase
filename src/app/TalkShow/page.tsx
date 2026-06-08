import PublicPageShell from "@/components/layouts/PublicPageShell";
import TalkShow from "@/app/component/TalkShow";
import { PAGE_HEROES } from "@/lib/page-heroes";

export default function TalkShowPage() {
  return (
    <PublicPageShell hero={PAGE_HEROES.talkShow}>
      <TalkShow />
    </PublicPageShell>
  );
}
