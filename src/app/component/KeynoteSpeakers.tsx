"use client"
import React from "react";
import Guest from "./Guest";

const speakers = [
  {
    id: 1,
    name: "Dr. Sharanjeet Kaur",
    designation: "CHAIRPERSON",
    place: "RCI",
    imageSrc: "/keynotespeakers/rcichairperson.png",
  },
  {
    id: 2,
    name: "Shri Amogh Lila Das",
    designation: "Vice-President",
    place: "ISKCON Dwarka",
    imageSrc: "/keynotespeakers/iskconvp.png",
  },
  {
    id: 3,
    name: "Advocate Ashwini Upadhyay",
    designation: "Activist and Lawyer",
    place: "Supreme Court",
    imageSrc: "/keynotespeakers/ashwini.jpg",
  },
  {
    id: 4,
    name: "Justice Hemant Gupta",
    designation: "Former Judge",
    place: "Supreme Court",
    imageSrc: "/keynotespeakers/justicehemantgupta.jpg",
  },
];

const KeynoteSpeakers: React.FC = () => {
  return (
    <div className="p-4">
      <div className="p-4">
        <p className="text-2xl text-red-800 text-center uppercase font-bold mb-4">
          KeyNote Speakers
        </p>
        <div className="flex flex-wrap">
          {speakers.map((guest) => (
            <div key={guest.id} className="w-full sm:w-1/2 lg:w-1/3 p-2">
              <Guest {...guest} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default KeynoteSpeakers;
