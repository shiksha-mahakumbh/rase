"use client";
import React from "react";
import Image from "next/image";

const speakers = [
  {
    id: 1,
    name: "",
    designation: "",
    place: "",
    imageSrc: "/2024M/baton/baton1.jpg",
  },
  {
    id: 2,
    name: "",
    designation: "",
    place: "",
    imageSrc: "/2024M/baton/baton2.jpg",
  },
  {
    id: 3,
    name: "",
    designation: "",
    place: "",
    imageSrc: "/2024M/baton/baton3.jpg",
  },
  {
    id: 4,
    name: "",
    designation: "",
    place: "",
    imageSrc: "/2024M/baton/baton4.jpg",
  },
  {
    id: 5,
    name: "",
    designation: "",
    place: "",
    imageSrc: "/2024M/baton/baton5.jpg",
  }
];

const Guest: React.FC<{
  name: string;
  designation: string;
  place: string;
  imageSrc: string;
}> = ({ name, designation, place, imageSrc }) => (
  <div className="border rounded-lg p-4 shadow-md flex flex-col items-center">
    <div className="w-full h-60 overflow-hidden rounded-lg relative">
      <Image
        src={imageSrc}
        alt={name || "Baton ceremony participant"}
        fill
        sizes="(max-width: 768px) 100vw, 20vw"
        className="rounded-lg object-cover"
        loading="lazy"
      />
    </div>
    <h3 className="text-lg font-bold mt-4 text-center">{name}</h3>
    <p className="text-sm text-gray-600 text-center">{designation}</p>
    <p className="mt-2 text-gray-800 text-center">{place}</p>
  </div>
);

const BatonCeremony: React.FC = () => {
  return (
    <div className="p-4">
      <p className="text-xl md:text-2xl text-primary text-center uppercase font-bold mb-8">
        Baton Ceremony Shiksha Mahakumbh 2024
      </p>
      <div className="flex flex-wrap justify-center">
        {speakers.map((guest) => (
          <div key={guest.id} className="w-full sm:w-1/2 lg:w-1/3 xl:w-1/4 p-4">
            <Guest {...guest} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default BatonCeremony;
