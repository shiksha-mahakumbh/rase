import PublicPageShell from "@/components/layouts/PublicPageShell";
import CommitteeDetailShell from "./CommitteeDetailShell";
import CommitteeEditionJsonLd from "./CommitteeEditionJsonLd";
import { brandPageHero } from "@/lib/page-heroes";
import type { CommitteeEditionData } from "@/data/committee-members";
import type { ReactNode } from "react";

interface CommitteeEditionPageProps {
  editionTitle: string;
  edition?: CommitteeEditionData;
  children: ReactNode;
}

export default function CommitteeEditionPage({
  editionTitle,
  edition,
  children,
}: CommitteeEditionPageProps) {
  return (
    <PublicPageShell
      hero={
        edition
          ? undefined
          : brandPageHero(
              editionTitle,
              "Committee members guiding and managing initiatives to promote quality education and holistic development across India.",
              "Governance & Leadership"
            )
      }
      showHero={!edition}
      relatedPath="/committees"
      showCta={false}
      skipContainer
    >
      {edition && <CommitteeEditionJsonLd edition={edition} />}
      <CommitteeDetailShell editionTitle={edition?.breadcrumbLabel ?? editionTitle}>
        {children}
      </CommitteeDetailShell>
    </PublicPageShell>
  );
}
