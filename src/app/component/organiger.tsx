"use client";
import Image from "next/image";
import React from "react";
import Marquee from "react-fast-marquee";

const Organiger: React.FC = () => {
  interface Item {
    imageUrl: string;
    text: string;
    link: string;
  }

  const marquees: Item[] = [
    { imageUrl: "/l1.jpeg", text: "Shiksha Mahakumbh - IIT Ropar", link: "https://www.youtube.com/watch?v=FFfdSd8_XOw" },
    { imageUrl: "/drdo.jpg", text: "Shiksha Mahakumbh - IIT Ropar", link: "https://www.youtube.com/watch?v=FFfdSd8_XOw" },
    { imageUrl: "/l2.png", text: "Shiksha Mahakumbh - IIT Ropar", link: "https://www.youtube.com/watch?v=FFfdSd8_XOw" },
    { imageUrl: "/l3.jpg", text: "Shiksha Mahakumbh - IIT Ropar", link: "https://www.youtube.com/watch?v=FFfdSd8_XOw" },
    { imageUrl: "/l4.png", text: "Shiksha Mahakumbh - IIT Ropar", link: "https://www.youtube.com/watch?v=FFfdSd8_XOw" },
    { imageUrl: "/l5.png", text: "Shiksha Mahakumbh - IIT Ropar", link: "https://www.youtube.com/watch?v=FFfdSd8_XOw" },
    { imageUrl: "/l6.png", text: "Shiksha Mahakumbh - IIT Ropar", link: "https://www.youtube.com/watch?v=FFfdSd8_XOw" },
    { imageUrl: "/l7.png", text: "Shiksha Mahakumbh - IIT Ropar", link: "https://www.youtube.com/watch?v=FFfdSd8_XOw" },
    { imageUrl: "/l8.png", text: "Shiksha Mahakumbh - IIT Ropar", link: "https://www.youtube.com/watch?v=FFfdSd8_XOw" },
    { imageUrl: "/l9.jpg", text: "Shiksha Mahakumbh - IIT Ropar", link: "https://www.youtube.com/watch?v=FFfdSd8_XOw" },
  ];

  return (
    <div className="flex flex-col w-full bg-gradient-to-r from-blue-50 to-indigo-100 py-10">
      {/* Heading */}
      <div className="text-center mb-6">
        <h1 className="text-3xl font-bold text-indigo-700 drop-shadow-md">🌟 Our Sponsors 🌟</h1>
        <p className="text-gray-600 mt-2 text-sm md:text-base">
          Empowering <span className="font-semibold text-indigo-600">Shiksha Mahakumbh</span> with their invaluable support
        </p>
      </div>

      {/* Sponsors Carousel */}
      <Marquee pauseOnHover={true} pauseOnClick={true} speed={40} gradient={false}>
        {marquees.map((sponsor, index) => (
          <a
            key={index}
            href={sponsor.link}
            target="_blank"
            rel="noopener noreferrer"
            className="mx-8 group"
          >
            <div className="p-4 bg-white rounded-2xl shadow-md hover:shadow-xl transition-transform transform hover:scale-110 duration-300 flex items-center justify-center">
              <Image
                className="w-24 h-24 object-contain"
                src={sponsor.imageUrl}
                alt={`Sponsor ${index + 1}`}
                height={100}
                width={100}
              />
            </div>
          </a>
        ))}
      </Marquee>
    </div>
  );
};

export default Organiger;
