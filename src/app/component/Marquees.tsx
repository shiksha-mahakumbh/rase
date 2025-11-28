"use client";
import React from "react";
import Marquee from "react-fast-marquee";
import Link from "next/link";

interface Item {
  imageUrl: string;
  text: string;
  link: string;
}

const items: Item[] = [
  {
    imageUrl: "/new.gif",
    text: "शिक्षा महाकुंभ अभियान – 6th Edition at NIT Hamirpur from 9th Oct to 11th Oct 2026.",
    link: "https://www.rase.co.in",
  },
  {
    imageUrl: "/new.gif",
    text: "शिक्षा महाकुंभ 5.0 concluded at NIPER Mohali, 31 Oct to 2nd Nov 2025. Download photos here.",
    link: "https://drive.google.com/drive/folders/1c2CKx2Z9IaN-dsoW-Ymw6Npx1EOTFcsA",
  },
  {
    imageUrl: "/new.gif",
    text: "Join the revolution through education at NIT Hamirpur, register now.",
    link: "https://www.rase.co.in/registration/Single_Registration",
  },
  // {
  //   imageUrl: "/new.gif",
  //   text: "शिक्षा महाकुंभ अभियान office inaugurated at NIPER SAS Nagar campus.",
  //   link: "https://www.rase.co.in",
  // },
];

const Marquees: React.FC = () => {
  return (
    <div className="bg-white border-t-4 border-b-4 border-[#F59E0B]">
      <div className="bg-[#F59E0B] text-white font-bold py-2 px-4 text-lg uppercase tracking-wide">
        Announcements
      </div>
      <Marquee pauseOnHover={true} pauseOnClick={true} gradient={false} speed={60}>
        <div className="flex space-x-6 py-4 px-4">
          {items.map((item, index) => (
            <Link key={index} href={item.link} target="_blank">
              <div className="flex items-center space-x-3 bg-[#F5F5F5] hover:bg-[#E0E0E0] transition-transform transform hover:scale-105 rounded-full px-4 py-2 cursor-pointer border border-[#F59E0B] shadow-sm">
                <img
                  src={item.imageUrl}
                  alt="New Icon"
                  className="h-6 w-6 animate-bounce"
                />
                <p className="text-black font-medium text-sm lg:text-base hover:text-[#F59E0B] max-w-xs lg:max-w-md">
                  {item.text}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </Marquee>
    </div>
  );
};

export default Marquees;
