"use client";
import React, { Suspense } from "react";
import Link from "next/link";

interface CommitteeTreeProps {
  onSelect: (committee: string) => void;
}

const CommitteeGrid: React.FC<CommitteeTreeProps> = ({ onSelect }) => {
  const committees = [
    {
      title: "Shiksha Kumbh 2023",
      link: "https://sk23.rase.co.in",
      committeeLink: "/committee/shikshakumbh2023",
      onCommitteeSelect: "Shiksha Kumbh 2023 Committee",
    },
    {
      title: "Shiksha Kumbh 2024",
      link: "https://sk24.rase.co.in",
      committeeLink: "/committee/shikshakumbh2024",
      onCommitteeSelect: "Shiksha Kumbh 2024 Committee",
    },
    {
      title: "Shiksha MahaKumbh 2023",
      link: "https://sm23.rase.co.in",
      committeeLink: "/committee/shikshamahakumbh2023",
      onCommitteeSelect: "Shiksha MahaKumbh 2023 Committee",
    },
    {
      title: "Shiksha MahaKumbh 2024",
      link: "https://sm24.rase.co.in",
      committeeLink: "/committee/shikshamahakumbh2024",
      onCommitteeSelect: "Shiksha MahaKumbh 2024 Committee",
    },
  ];

  return (
    <div style={{ overflow: "auto", maxHeight: "80vh", padding: "10px" }}>
      <Suspense fallback={<div>Loading...</div>}>
        <h1 className="text-center font-bold text-2xl mb-4">
          RASE CONFERENCES COMMITTEES
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {committees.map((committee, index) => (
            <div
              key={index}
              className="border p-4 rounded-lg bg-white shadow-md"
            >
              <h2 className="text-center font-bold text-lg mb-2 text-gray-800">
                {committee.title}
              </h2>
              <div className="flex flex-col gap-2">
                <Link href={committee.link}>
                  <button className="bg-blue-600 text-white p-2 rounded-lg tracking-widest hover:bg-blue-700">
                    View {committee.title}
                  </button>
                </Link>
                <Link href={committee.committeeLink}>
                  <button
                    className="bg-blue-600 text-white p-2 rounded-lg tracking-widest hover:bg-blue-700"
                    onClick={() => onSelect(committee.onCommitteeSelect)}
                  >
                    Committee
                  </button>
                </Link>
              </div>
            </div>
          ))}
        </div>
      </Suspense>
    </div>
  );
};

export default CommitteeGrid;
