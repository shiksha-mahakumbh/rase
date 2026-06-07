import type { AuthoritySectionKey } from "@/data/authority";
import { AUTHORITY_SECTION_ORDER } from "@/data/authority";
import ImpactStatisticsSection from "./ImpactStatisticsSection";
import PastEditionsSection from "./PastEditionsSection";
import ResearchOutputSection from "./ResearchOutputSection";
import ParticipatingInstitutionsSection from "./ParticipatingInstitutionsSection";
import PartnerOrganizationsSection from "./PartnerOrganizationsSection";
import GovernmentEngagementSection from "./GovernmentEngagementSection";
import SuccessStoriesSection from "./SuccessStoriesSection";
import SpeakersSection from "./SpeakersSection";

const SECTION_MAP = {
  impact: ImpactStatisticsSection,
  editions: PastEditionsSection,
  research: ResearchOutputSection,
  institutions: ParticipatingInstitutionsSection,
  partners: PartnerOrganizationsSection,
  government: GovernmentEngagementSection,
  stories: SuccessStoriesSection,
  speakers: SpeakersSection,
} as const;

export interface AuthoritySectionsProps {
  /** Subset and order; defaults to full ecosystem narrative */
  sections?: AuthoritySectionKey[];
  impactVariant?: "default" | "compact";
  className?: string;
}

export default function AuthoritySections({
  sections = AUTHORITY_SECTION_ORDER,
  impactVariant = "default",
  className = "",
}: AuthoritySectionsProps) {
  return (
    <div className={className}>
      {sections.map((key) => {
        const Component = SECTION_MAP[key];
        if (key === "impact") {
          return (
            <ImpactStatisticsSection
              key={key}
              variant={impactVariant}
            />
          );
        }
        return <Component key={key} />;
      })}
    </div>
  );
}

export {
  ImpactStatisticsSection,
  PastEditionsSection,
  ResearchOutputSection,
  ParticipatingInstitutionsSection,
  PartnerOrganizationsSection,
  GovernmentEngagementSection,
  SuccessStoriesSection,
};
