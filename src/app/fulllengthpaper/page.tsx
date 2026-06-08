import PublicPageShell from "@/components/layouts/PublicPageShell";
import Fulllengthpaper from "../component/Fulllengthpaper";
import { PAGE_HEROES } from "@/lib/page-heroes";

export default function FullLengthPaperPage() {
  return (
    <PublicPageShell hero={PAGE_HEROES.fullLengthPaper} relatedPath="/fulllengthpaper">
      <Fulllengthpaper />
    </PublicPageShell>
  );
}
