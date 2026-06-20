"use client";

import React from "react";
import Image from "next/image";

const speakers = [
  { id: 1, name: "", designation: "", place: "", imageSrc: "/2024M/res/res1.jpg" },
  { id: 2, name: "", designation: "", place: "", imageSrc: "/2024M/res/res2.jpg" },
  { id: 3, name: "", designation: "", place: "", imageSrc: "/2024M/res/res3.jpg" },
  { id: 4, name: "", designation: "", place: "", imageSrc: "/2024M/res/res4.jpg" },
  { id: 5, name: "", designation: "", place: "", imageSrc: "/2024M/res/res5.jpg" },
  { id: 6, name: "", designation: "", place: "", imageSrc: "/2024M/res/res6.jpg" },
  { id: 7, name: "", designation: "", place: "", imageSrc: "/2024M/res/res7.jpg" },
  { id: 8, name: "", designation: "", place: "", imageSrc: "/2024M/res/res8.jpg" },
  { id: 9, name: "", designation: "", place: "", imageSrc: "/2024M/res/res9.jpg" },
];

const Guest: React.FC<{
  name: string;
  designation: string;
  place: string;
  imageSrc: string;
}> = ({ name, designation, place, imageSrc }) => (
  <div className="flex flex-col items-center rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
    <div className="relative h-60 w-full overflow-hidden rounded-xl">
      <Image
        src={imageSrc}
        alt={name || "Residential camp highlight"}
        fill
        className="object-cover"
        sizes="(max-width: 768px) 100vw, 25vw"
      />
    </div>
    {name && <h3 className="mt-4 text-center text-lg font-bold text-brand-navy">{name}</h3>}
    {designation && <p className="text-center text-sm text-slate-600">{designation}</p>}
    {place && <p className="mt-2 text-center text-slate-700">{place}</p>}
  </div>
);

const Residential_Camp: React.FC = () => {
  return (
    <div>
      <p className="home-section-title mb-8 text-center text-xl uppercase md:text-2xl">
        Residential Camp Shiksha Mahakumbh 2024
      </p>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {speakers.map((guest) => (
          <Guest key={guest.id} {...guest} />
        ))}
      </div>
    </div>
  );
};

export default Residential_Camp;
