"use client";
import React from "react";
import Link from "next/link";

interface CommitteeTreeProps {
  onSelect: (committee: string) => void;
}

const CommitteeTimeline: React.FC<CommitteeTreeProps> = ({ onSelect }) => {
  const committees = [
    {
      title: "Shiksha Mahakumbh 1.0",
      year: "2023",
      description: "The inaugural edition setting the foundation for future Mahakumbh series.",
      link: "https://rase.co.in",
      committeeLink: "/committee/shikshamahakumbh2023",
      onCommitteeSelect: "Shiksha Mahakumbh 1.0 Committee",
    },
    {
      title: "Shiksha Mahakumbh 2.0",
      year: "2023",
      description: "Early edition emphasizing teacher workshops and rural school outreach.",
      link: "https://rase.co.in",
      committeeLink: "/committee/shikshakumbh2023",
      onCommitteeSelect: "Shiksha Mahakumbh 2.0 Committee",
    },
    {
      title: "Shiksha Mahakumbh 3.0",
      year: "2024",
      description: "Focused on innovations in school education and student empowerment.",
      link: "https://rase.co.in",
      committeeLink: "/committee/shikshakumbh2024",
      onCommitteeSelect: "Shiksha Mahakumbh 3.0 Committee",
    },
    {
      title: "Shiksha Mahakumbh 4.0",
      year: "2024",
      description: "Celebrating excellence in Indian education system with interactive workshops.",
      link: "https://rase.co.in",
      committeeLink: "/committee/shikshamahakumbh2024",
      onCommitteeSelect: "Shiksha Mahakumbh 4.0 Committee",
    },
    {
      title: "Shiksha Mahakumbh 5.0",
      year: "2025",
      description: "The latest edition, focusing on global education trends and innovations.",
      link: "https://rase.co.in",
      committeeLink: "/committee/shikshamahakumbh2025",
      onCommitteeSelect: "Shiksha Mahakumbh 5.0 Committee",
    },
  ];

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-4xl font-extrabold text-center mb-12 text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
        Shiksha Mahakumbh Timeline
      </h1>

      <div className="relative border-l-4 border-blue-600 ml-4">
        {committees.map((committee, index) => (
          <div key={index} className="mb-10 ml-6 relative">
            {/* Circle marker */}
            <div className="absolute -left-7 top-0 w-6 h-6 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 shadow-lg"></div>

            {/* Card */}
            <div className="bg-white p-6 rounded-xl shadow-lg transform hover:scale-105 transition duration-300">
              <div className="flex justify-between items-center mb-2">
                <h2 className="text-xl font-bold text-gray-800">{committee.title}</h2>
                <span className="bg-yellow-400 text-black font-semibold px-3 py-1 rounded-full text-sm">
                  {committee.year}
                </span>
              </div>
              <p className="text-gray-700 mb-4">{committee.description}</p>
              <div className="flex flex-col md:flex-row gap-3">
                <Link href={committee.link} passHref>
                  <button className="bg-blue-600 text-white p-2 rounded-lg hover:bg-blue-700 transition duration-300 w-full md:w-auto">
                    View Event
                  </button>
                </Link>
                <Link href={committee.committeeLink} passHref>
                  <button
                    className="bg-purple-600 text-white p-2 rounded-lg hover:bg-purple-700 transition duration-300 w-full md:w-auto"
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
  );
};

export default CommitteeTimeline;
