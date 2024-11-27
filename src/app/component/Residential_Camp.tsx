"use client";
import React from "react";
import CompanyInfo from "../component/CompanyInfo";
import Footer from "../component/Footer";
import NavBar from "../component/NavBar";
import Image from "next/image"; // Import the Image component from Next.js

const speakers = [
  {
    id: 1,
    name: "",
    designation: "",
    place: "",
    imageSrc: "/2024M/res/res1.jpg",
  },
  {
    id: 2,
    name: "",
    designation: "",
    place: "",
    imageSrc: "/2024M/res/res2.jpg",
  },
  {
    id: 3,
    name: "",
    designation: "",
    place: "",
    imageSrc: "/2024M/res/res3.jpg",
  },
  {
    id: 4,
    name: "",
    designation: "",
    place: "",
    imageSrc: "/2024M/res/res4.jpg",
  },
  {
    id: 5,
    name: "",
    designation: "",
    place: "",
    imageSrc: "/2024M/res/res5.jpg",
  },
  {
    id: 6,
    name: "",
    designation: "",
    place: "",
    imageSrc: "/2024M/res/res6.jpg",
  },
  {
    id: 7,
    name: "",
    designation: "",
    place: "",
    imageSrc: "/2024M/res/res7.jpg",
  },
  {
    id: 8,
    name: "",
    designation: "",
    place: "",
    imageSrc: "/2024M/res/res8.jpg",
  },
  {
    id: 9,
    name: "",
    designation: "",
    place: "",
    imageSrc: "/2024M/res/res9.jpg",
  },
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
        alt={name}
        layout="fill" // Makes image fill the container
        objectFit="cover" // Ensures proper cropping
        className="rounded-lg"
        priority // Prioritize image loading for above-the-fold images
        placeholder="blur" // Add a blurred placeholder while the image loads
        blurDataURL="/path-to-placeholder-image.jpg" // Optional LQIP (Low-Quality Image Placeholder)
      />
    </div>
    <h3 className="text-lg font-bold mt-4 text-center">{name}</h3>
    <p className="text-sm text-gray-600 text-center">{designation}</p>
    <p className="mt-2 text-gray-800 text-center">{place}</p>
  </div>
);

const Residential_Camp: React.FC = () => {
  return (
    <div className="bg-white min-h-screen">
      <CompanyInfo />
      <NavBar />
      <div className="p-4">
        <p className="text-xl md:text-2xl text-primary text-center uppercase font-bold mb-8">
          Residential Camp Shiksha Mahakumbh 2024
        </p>
        <div className="flex flex-wrap justify-center">
          {speakers.map((guest) => (
            <div key={guest.id} className="w-full sm:w-1/2 lg:w-1/3 xl:w-1/4 p-4">
              <Guest {...guest} />
            </div>
          ))}
        </div>
        <Footer />
      </div>
    </div>
  );
};

export default Residential_Camp;
