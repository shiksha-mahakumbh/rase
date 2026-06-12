import CommitteeEditionPage from "@/components/committee/CommitteeEditionPage";
import CommitteeMemberSection from "@/components/committee/CommitteeMemberSection";
import type { CmsLoadedCommittee } from "@/lib/cms/types";

export default function CmsCommitteeView({ committee }: { committee: CmsLoadedCommittee }) {
  const editionTitle =
    committee.edition ?? committee.name;

  const members = committee.members.map((m) => ({
    name: m.fullName,
    designation: [m.designation, m.institution].filter(Boolean).join(" — ") || "Member",
    photo: m.photoUrl ?? undefined,
  }));

  return (
    <CommitteeEditionPage editionTitle={editionTitle}>
      {committee.description && (
        <p className="mb-8 text-base leading-relaxed text-gray-600">{committee.description}</p>
      )}
      <CommitteeMemberSection title="Committee Members" members={members} badge="Organising" />
    </CommitteeEditionPage>
  );
}
