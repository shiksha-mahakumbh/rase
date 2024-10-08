"use client";
import React from "react";

interface CommitteeMember {
  id: number;
  name: string;
  designation: string;
}

interface CommitteePageProps {
  selectedCommittee: string;
  committeeData: Record<string, CommitteeMember[]>;
}

const CommitteePage: React.FC<CommitteePageProps> = ({
  selectedCommittee,
  committeeData,
}) => {
  const committee = committeeData[selectedCommittee] ?? []; // Fallback to empty array if selectedCommittee is not found

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">{selectedCommittee}</h2>
      <ul className="space-y-4">
        {committee.length > 0 ? (
          committee.map((member, index) => (
            <li
              key={index}
              className="flex items-center justify-between bg-gray-100 rounded-lg p-4 transition hover:bg-gray-200"
            >
              <div className="text-left">
                <h2 className="text-lg font-semibold">{member.name}</h2>
                <p className="text-sm">{member.designation}</p>
              </div>
            </li>
          ))
        ) : (
          <li>No committee members found for {selectedCommittee}</li>
        )}
      </ul>
    </div>
  );
};

export default CommitteePage;
