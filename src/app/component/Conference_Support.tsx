"use client";
import Image from "next/image";
import React from "react";
import Marquee from "react-fast-marquee";

const Conference_Support: React.FC = () => {
  interface Item {
    imageUrl: string;
    link: string;
  }

  const partners: Item[] = [
    { imageUrl: "/2024M/our partners/1.png", link: "" },
    { imageUrl: "/2024M/our partners/3.png", link: "" },
    { imageUrl: "/2024M/our partners/4.png", link: "" },
    { imageUrl: "/2024M/our partners/5.png", link: "" },
    { imageUrl: "/2024M/our partners/6.png", link: "" },
    { imageUrl: "/2024M/our partners/7.png", link: "" },
    { imageUrl: "/2024M/our partners/8.jpg", link: "" },
    { imageUrl: "/2024M/our partners/9.png", link: "" },
    { imageUrl: "/2024M/our partners/10.png", link: "" },
    { imageUrl: "/2024M/our partners/11.png", link: "" },
    { imageUrl: "/2024M/our partners/12.jpg", link: "" },
    { imageUrl: "/2024M/our partners/13.png", link: "" },
    { imageUrl: "/2024M/our partners/14.png", link: "" },
    { imageUrl: "/2024M/our partners/15.jpg", link: "" },
    { imageUrl: "/2024M/our partners/16.png", link: "" },
    { imageUrl: "/2024M/our partners/17.jpg", link: "" },
    { imageUrl: "/2024M/our partners/18.png", link: "" },
    { imageUrl: "/2024M/our partners/19.png", link: "" },
    { imageUrl: "/2024M/our partners/20.png", link: "" },
    { imageUrl: "/2024M/our partners/21.png", link: "" },
    { imageUrl: "/2024M/our partners/22.png", link: "" },
    { imageUrl: "/2024M/our partners/23.png", link: "" },
  ];

  return (
    <section className="w-full py-8 bg-gradient-to-r from-[#f8f9fa] via-[#ffffff] to-[#f8f9fa] rounded-xl shadow-md">
      <h1 className="text-center text-2xl md:text-3xl font-extrabold text-[#4d1414] mb-6 tracking-wide">
        🌍 Academic & Knowledge Partners
      </h1>

      <Marquee
        pauseOnHover={true}
        pauseOnClick={true}
        gradient={false}
        speed={60}
      >
        {partners.map((partner, index) => (
          <a
            key={index}
            href={partner.link || "#"}
            target="_blank"
            rel="noopener noreferrer"
            className="group relative flex items-center justify-center mx-6"
          >
            <div className="p-3 bg-white rounded-xl shadow-lg transition-transform transform group-hover:scale-110 group-hover:shadow-2xl">
              <Image
                src={partner.imageUrl}
                alt={`Academic Partner ${index + 1}`}
                height={120}
                width={120}
                className="object-contain w-28 h-28 md:w-32 md:h-32"
              />
            </div>
          </a>
        ))}
      </Marquee>

      <p className="text-center text-gray-600 mt-6 text-sm md:text-base">
        🤝 Collaborating with leading institutions worldwide to foster{" "}
        <span className="font-semibold text-[#b22222]">
          education, research, and innovation
        </span>
        .
      </p>
    </section>
  );
};

export default Conference_Support;
