"use client";
import Image from "next/image";
import React from "react";
import Marquee from "react-fast-marquee";
import { motion } from "framer-motion";

const MediaPartners: React.FC = () => {
  interface Item {
    imageUrl: string;
    link: string;
    name: string;
  }

  const mediaPartners: Item[] = [
    { imageUrl: "/2024K/BW.jpg", link: "https://businessworld.in/", name: "Business World" },
    { imageUrl: "/2024K/dainik.jpg", link: "https://epaper.dainiksaveratimes.in/", name: "Dainik Savera" },
    { imageUrl: "/2024K/utam.png", link: "https://www.uttamhindu.com/", name: "Uttam Hindu" },
  ];

  return (
    <section className="w-full py-10 bg-gradient-to-r from-amber-50 to-rose-50 relative overflow-hidden">
      {/* Heading */}
      <div className="text-center mb-6">
        <h2 className="text-3xl md:text-4xl font-extrabold text-primary tracking-wide">
          Our Esteemed Media Partners
        </h2>
        <p className="text-gray-600 mt-2 text-base md:text-lg">
          Empowering voices, spreading knowledge, shaping perspectives
        </p>
      </div>

      {/* Marquee */}
      <Marquee pauseOnHover={true} speed={50} gradient={false}>
        {mediaPartners.map((partner, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="flex justify-center items-center"
          >
            <a
              href={partner.link}
              target="_blank"
              rel="noopener noreferrer"
              className="m-6 group relative"
              aria-label={`Visit ${partner.name}`}
            >
              <div className="p-4 rounded-2xl shadow-md bg-white/80 backdrop-blur-md border border-gray-100 hover:shadow-2xl transition-all duration-300">
                <Image
                  className="w-28 h-28 object-contain transition-transform duration-300 group-hover:scale-110 group-hover:drop-shadow-lg"
                  src={partner.imageUrl}
                  alt={`${partner.name} Logo`}
                  height={120}
                  width={120}
                />
              </div>
              <p className="text-center text-sm mt-2 font-medium text-gray-700 group-hover:text-primary">
                {partner.name}
              </p>
            </a>
          </motion.div>
        ))}
      </Marquee>
    </section>
  );
};

export default MediaPartners;
