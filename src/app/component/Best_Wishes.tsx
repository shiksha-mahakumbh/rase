"use client"
import React, { useState } from "react";
import Link from "next/link";

const MediaGrid: React.FC = () => {
  // State to track which media archives are shown
  const [archiveVisibility, setArchiveVisibility] = useState<{ [key: string]: boolean }>({});

  // Grouped media items by title with years
  const items = [
    {
      label: "Shiksha Kumbh",
      years: [
        {
          year: "2025",
          children: [
            { label: "Wishes Received", link: "/comingsoon" },
            
          ],
        
        },
      ],
    },
    {
      label: "Shiksha Mahakumbh",
      years: [
        {
          year: "2024",
          children: [
            { label: "Wishes Received", link: "/Wishes_Received" },
            
          ],
        
        },
      ],
    },
  ];

  // Toggle the visibility of the archive for a specific media item
  const toggleArchive = (label: string) => {
    setArchiveVisibility((prevState) => ({
      ...prevState,
      [label]: !prevState[label], // Toggle archive visibility
    }));
  };

  return (
    <div style={{ overflow: "auto", maxHeight: "80vh", padding: "10px" }} className="flex justify-center items-center">
      <div className="max-w-6xl mx-auto w-full">
        <h1 className="text-center font-bold text-2xl mb-4">
          <Link href="/" passHref>
            <button className="bg-transparent text-primary tracking-widest hover:text-blue-600">
               Wishes
            </button>
          </Link>
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 justify-center items-center">
          {items.map((item, index) => {
            // Latest year (always shown)
            const latestYear = item.years[0]; // Assuming the latest year is always the first
            // Archived years (hidden initially)
            const archivedYears = item.years.slice(1); // All other years

            return (
              <div key={index} className="border p-4 rounded-lg bg-white shadow-md transition-transform transform hover:scale-105">
                <h2 className="text-center font-bold text-lg mb-4 text-gray-800">{item.label}</h2>

                {/* Latest year always visible */}
                <div className="text-center mb-4">
                  <span className="inline-block bg-gray-200 text-gray-800 p-1 px-3 rounded-full mb-2">{latestYear.year}</span>
                  <div className="flex flex-col gap-2">
                    {latestYear.children.map((child, childIndex) => (
                      <Link key={childIndex} href={child.link} passHref>
                        <div className="text-center">
                          <button className="bg-blue-600 text-white p-2 rounded-lg tracking-widest hover:bg-blue-700 transition duration-300">
                            {child.label}
                          </button>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>

                {/* Archive toggle button */}
                {archivedYears.length > 0 && (
                  <div className="text-center mb-4">
                    <button
                      className="bg-gray-600 text-white p-2 rounded-lg tracking-widest hover:bg-gray-700 transition duration-300"
                      onClick={() => toggleArchive(item.label)}
                    >
                      {archiveVisibility[item.label] ? "Hide Archived Media" : "View Archived Media"}
                    </button>
                  </div>
                )}

                {/* Archived years (conditionally rendered) */}
                {archiveVisibility[item.label] &&
                  archivedYears.map((yearData, yearIndex) => (
                    <div key={yearIndex} className="text-center mb-4">
                      <span className="inline-block bg-gray-200 text-gray-800 p-1 px-3 rounded-full mb-2">{yearData.year}</span>
                      <div className="flex flex-col gap-2">
                        {yearData.children.map((child, childIndex) => (
                          <Link key={childIndex} href={child.link} passHref>
                            <div className="text-center">
                              <button className="bg-blue-600 text-white p-2 rounded-lg tracking-widest hover:bg-blue-700 transition duration-300">
                                {child.label}
                              </button>
                            </div>
                          </Link>
                        ))}
                      </div>
                    </div>
                  ))}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default MediaGrid;
