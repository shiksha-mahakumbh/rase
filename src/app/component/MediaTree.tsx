import React from "react";
import Link from "next/link";

const MediaGrid: React.FC = () => {
  // Grouped media items by title with years
  const items = [
    {
      label: "Shiksha Kumbh",
      years: [
        {
          year: "2023",
          children: [
            { label: "Digital Media", link: "/shikshakumbh2023digitalmedia" },
            { label: "Print Media", link: "/printmediashikshakumbh2023" },
          ],
        },
        {
          year: "2024",
          children: [
            { label: "Digital Media", link: "/shikshakumbh2024digitalmedia" },
            { label: "Print Media", link: "/printmediashikshakumbh2024" },
          ],
        },
      ],
    },
    {
      label: "Shiksha MahaKumbh",
      years: [
        {
          year: "2023",
          children: [
            { label: "Digital Media", link: "/shikshamahakumbh2023digitalmedia" },
            { label: "Print Media", link: "/printmediashikshamahakumbh2023" },
          ],
        },
        {
          year: "2024",
          children: [
            { label: "Digital Media", link: "/comingsoon" },
            { label: "Print Media", link: "/printmediashikshamahakumbh2024" },
          ],
        },
      ],
    },
  ];

  return (
    <div
      style={{ overflow: "auto", maxHeight: "80vh", padding: "10px" }}
      className="flex justify-center items-center"
    >
      <div className="max-w-6xl mx-auto">
        <h1 className="text-center font-bold text-2xl mb-4">
          <Link href="/" passHref>
            <button className="bg-transparent text-primary tracking-widest hover:text-blue-600">
              RASE CONFERENCES MEDIA
            </button>
          </Link>
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 justify-center items-center">
          {items.map((item, index) => (
            <div
              key={index}
              className="border p-4 rounded-lg bg-white shadow-md"
            >
              <h2 className="text-center font-bold text-lg mb-4 text-gray-800">
                {item.label}
              </h2>
              {item.years && (
                <div className="space-y-4">
                  {item.years.map((yearData, yearIndex) => (
                    <div key={yearIndex} className="text-center">
                      <span className="inline-block bg-gray-200 text-gray-800 p-1 px-3 rounded-full mb-2">
                        {yearData.year}
                      </span>
                      <div className="flex flex-col gap-2">
                        {yearData.children.map((child, childIndex) => (
                          child.link ? (
                            <Link key={childIndex} href={child.link} passHref>
                              <div className="text-center">
                                <button className="bg-blue-600 text-white p-2 rounded-lg tracking-widest hover:bg-blue-700">
                                  {child.label}
                                </button>
                              </div>
                            </Link>
                          ) : (
                            <span key={childIndex}>{child.label}</span>
                          )
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MediaGrid;
