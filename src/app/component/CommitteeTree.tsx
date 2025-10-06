"use client";
import React, { useState, Suspense } from "react";
import Link from "next/link";

interface CommitteeTreeProps {
  onSelect: (committee: string) => void;
}

const CommitteeGrid: React.FC<CommitteeTreeProps> = ({ onSelect }) => {
  const [archiveVisibility, setArchiveVisibility] = useState<{ [key: string]: boolean }>({});

  // Shiksha Mahakumbh series
  const committees = [
       {
      title: "Shiksha Mahakumbh 5.0",
      year: "2025",
      link: "https://rase.co.in",
      committeeLink: "/committee/shikshamahakumbh2025",
      onCommitteeSelect: "Shiksha Mahakumbh 5.0 Committee",
    },
    {
      title: "Shiksha Mahakumbh 4.0",
      year: "2024",
      link: "https://rase.co.in",
      committeeLink: "/committee/shikshamahakumbh2024",
      onCommitteeSelect: "Shiksha Mahakumbh 4.0 Committee",
    },
    {
      title: "Shiksha Mahakumbh 3.0",
      year: "2024",
      link: "https://rase.co.in",
      committeeLink: "/committee/shikshakumbh2024",
      onCommitteeSelect: "Shiksha Mahakumbh 3.0 Committee",
    },
    {
      title: "Shiksha Mahakumbh 2.0",
      year: "2023",
      link: "https://rase.co.in",
      committeeLink: "/committee/shikshakumbh2023",
      onCommitteeSelect: "Shiksha Mahakumbh 2.0 Committee",
    },
    {
      title: "Shiksha Mahakumbh 1.0",
      year: "2023",
      link: "https://rase.co.in",
      committeeLink: "/committee/shikshamahakumbh2023",
      onCommitteeSelect: "Shiksha Mahakumbh 1.0 Committee",
    },
  ];

  const toggleArchive = (title: string) => {
    setArchiveVisibility((prev) => ({ ...prev, [title]: !prev[title] }));
  };

  return (
    <div className="flex justify-center items-center p-4" style={{ overflow: "auto", maxHeight: "80vh" }}>
      <Suspense fallback={<div>Loading...</div>}>
        <div className="max-w-6xl w-full mx-auto">
          <h1 className="text-center font-bold text-3xl mb-8 text-primary">
            Shiksha Mahakumbh Committees
          </h1>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {committees.map((committee, index) => (
              <div
                key={index}
                className="border p-4 rounded-lg bg-white shadow-lg transition-transform transform hover:scale-105"
              >
                <h2 className="text-center font-bold text-xl mb-4 text-gray-800">{committee.title}</h2>
                <div className="text-center mb-4">
                  <span className="inline-block bg-gray-200 text-gray-800 p-1 px-3 rounded-full mb-2">
                    {committee.year}
                  </span>
                  <div className="flex flex-col gap-2">
                    <Link href={committee.link} passHref>
                      <button className="bg-blue-600 text-white p-2 rounded-lg tracking-widest hover:bg-blue-700 transition duration-300">
                        View {committee.title}
                      </button>
                    </Link>
                    <Link href={committee.committeeLink} passHref>
                      <button
                        className="bg-blue-600 text-white p-2 rounded-lg tracking-widest hover:bg-blue-700 transition duration-300"
                        onClick={() => onSelect(committee.onCommitteeSelect)}
                      >
                        Committee Details
                      </button>
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </Suspense>
    </div>
  );
};

export default CommitteeGrid;
