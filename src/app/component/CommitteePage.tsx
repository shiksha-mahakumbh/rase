import React from "react";
import CommitteeMemberSection, {
  type CommitteeMember,
} from "@/components/committee/CommitteeMemberSection";

interface AdvisoryCouncilProps {
  title: string;
  members: CommitteeMember[];
}

const Committees: React.FC<AdvisoryCouncilProps> = ({ title, members }) => {
  return (
    <div className="flex flex-col items-center p-6">
      <CommitteeMemberSection title={title} members={members} />
      <p className="mt-6 max-w-3xl text-center text-sm text-gray-600 sm:text-base">
        These are the dedicated members of the {title} for the Shiksha Mahakumbh
        Abhiyan, guiding and managing initiatives to promote quality education and
        holistic development across India.
      </p>
    </div>
  );
};

export default Committees;
