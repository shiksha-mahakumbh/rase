"use client";
import React, { Suspense } from "react";
import Link from "next/link";

interface CommitteeTreeProps {
  onSelect: (committee: string) => void;
}

const CommitteeGrid: React.FC<CommitteeTreeProps> = ({ onSelect }) => {
  // Grouped committees by title with years
  const committees = [
    {
      title: "Shiksha Kumbh",
      years: [
        {
          year: "2023",
          link: "https://sk23.rase.co.in",
          committeeLink: "/committee/shikshakumbh2023",
          onCommitteeSelect: "Shiksha Kumbh 2023 Committee",
        },
        {
          year: "2024",
          link: "https://sk24.rase.co.in",
          committeeLink: "/committee/shikshakumbh2024",
          onCommitteeSelect: "Shiksha Kumbh 2024 Committee",
        },
      ],
    },
    {
      title: "Shiksha MahaKumbh",
      years: [
        {
          year: "2023",
          link: "https://sm23.rase.co.in",
          committeeLink: "/committee/shikshamahakumbh2023",
          onCommitteeSelect: "Shiksha MahaKumbh 2023 Committee",
        },
        {
          year: "2024",
          link: "https://sm24.rase.co.in",
          committeeLink: "/committee/shikshamahakumbh2024",
          onCommitteeSelect: "Shiksha MahaKumbh 2024 Committee",
        },
      ],
    },
  ];

  return (
    <div
      style={{ overflow: "auto", maxHeight: "80vh", padding: "10px" }}
      className="flex justify-center items-center"
    >
      <Suspense fallback={<div>Loading...</div>}>
        <div className="max-w-6xl mx-auto w-full">
          <h1 className="text-center font-bold text-2xl mb-4">
            RASE CONFERENCES COMMITTEES
          </h1>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6 justify-center items-center">
            {committees.map((committee, index) => (
              <div
                key={index}
                className="border p-4 rounded-lg bg-white shadow-md transition-transform transform hover:scale-105"
              >
                <h2 className="text-center font-bold text-lg mb-4 text-gray-800">
                  {committee.title}
                </h2>

                {/* Render years under the same title */}
                <div className="space-y-4">
                  {committee.years.map((yearData, yearIndex) => (
                    <div key={yearIndex} className="text-center">
                      <span className="inline-block bg-gray-200 text-gray-800 p-1 px-3 rounded-full mb-2">
                        {yearData.year}
                      </span>
                      <div className="flex flex-col gap-2">
                        <Link href={yearData.link} passHref>
                          <button className="bg-blue-600 text-white p-2 rounded-lg tracking-widest hover:bg-blue-700 transition duration-300">
                            View {committee.title} {yearData.year}
                          </button>
                        </Link>
                        <Link href={yearData.committeeLink} passHref>
                          <button
                            className="bg-blue-600 text-white p-2 rounded-lg tracking-widest hover:bg-blue-700 transition duration-300"
                            onClick={() =>
                              onSelect(yearData.onCommitteeSelect)
                            }
                          >
                            Committee {yearData.year}
                          </button>
                        </Link>
                      </div>
                    </div>
                  ))}
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
