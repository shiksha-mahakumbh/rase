import PublicPageShell from "@/components/layouts/PublicPageShell";
import CommitteeDetailShell from "./CommitteeDetailShell";
import { brandPageHero } from "@/lib/page-heroes";
import type { ReactNode } from "react";

interface CommitteeEditionPageProps {
  editionTitle: string;
  children: ReactNode;
}

export default function CommitteeEditionPage({
  editionTitle,
  children,
}: CommitteeEditionPageProps) {
  return (
    <PublicPageShell
      hero={brandPageHero(
        editionTitle,
        "Committee members guiding and managing initiatives to promote quality education and holistic development across India.",
        "Governance & Leadership"
      )}
      relatedPath="/committees"
      showCta={false}
      skipContainer
    >
      <CommitteeDetailShell editionTitle={editionTitle}>{children}</CommitteeDetailShell>
    </PublicPageShell>
  );
}
