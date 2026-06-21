import CommitteeMemberSection from "@/components/committee/CommitteeMemberSection";
import type { CommitteeEditionData } from "@/data/committee-members";

interface CommitteeEditionContentProps {
  edition: CommitteeEditionData;
}

export default function CommitteeEditionContent({ edition }: CommitteeEditionContentProps) {
  return (
    <>
      {edition.sections.map((section) => (
        <CommitteeMemberSection
          key={section.title}
          title={section.title}
          members={section.members}
          badge={section.badge}
        />
      ))}
    </>
  );
}
