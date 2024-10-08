import React from "react";
import Link from "next/link";

const MediaGrid: React.FC = () => {
  const items = [
    {
      label: "Shiksha Kumbh 2023",
      children: [
        { label: "Digital Media", link: "/shikshakumbh2023digitalmedia" },
        { label: "Print Media", link: "/printmediashikshakumbh2023" },
      ],
    },
    {
      label: "Shiksha Kumbh 2024",
      children: [
        { label: "Digital Media", link: "/shikshakumbh2024digitalmedia" },
        { label: "Print Media", link: "/printmediashikshakumbh2024" },
      ],
    },
    {
      label: "Shiksha MahaKumbh 2023",
      children: [
        { label: "Digital Media", link: "/shikshamahakumbh2023digitalmedia" },
        { label: "Print Media", link: "/printmediashikshamahakumbh2023" },
      ],
    },
    {
      label: "Shiksha MahaKumbh 2024",
      children: [
        { label: "Digital Media", link: "/commingsoon" },
        { label: "Print Media", link: "/printmediashikshamahakumbh2024" },
      ],
    },
  ];

  return (
    <div className="p-4">
      <h1 className="text-center font-bold text-2xl mb-4">
        <Link href="/" passHref>
          <button className="bg-transparent text-primary tracking-widest hover:text-blue-600">
            RASE CONFERENCES MEDIA
          </button>
        </Link>
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {items.map((item, index) => (
          <div key={index} className="border p-4 rounded-lg bg-white shadow-md">
            <h2 className="text-center font-bold text-lg mb-2 text-gray-800">
              {item.label}
            </h2>
            {item.children && (
              <div className="flex flex-col gap-2">
                {item.children.map((child, childIndex) => (
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
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default MediaGrid;
