"use client";
import Image from "next/image";
import React from "react";
import Marquee from "react-fast-marquee";
import { motion } from "framer-motion";
import SectionShell from "./home/SectionShell";
import GlassCard from "./home/GlassCard";

const Organiger: React.FC = () => {
  interface Item {
    imageUrl: string;
    text: string;
    link: string;
  }

  const marquees: Item[] = [
    {
      imageUrl: "/l1.jpeg",
      text: "Shiksha Mahakumbh - IIT Ropar",
      link: "https://www.youtube.com/watch?v=FFfdSd8_XOw",
    },
    {
      imageUrl: "/drdo.jpg",
      text: "Shiksha Mahakumbh - IIT Ropar",
      link: "https://www.youtube.com/watch?v=FFfdSd8_XOw",
    },
    {
      imageUrl: "/l2.png",
      text: "Shiksha Mahakumbh - IIT Ropar",
      link: "https://www.youtube.com/watch?v=FFfdSd8_XOw",
    },
    {
      imageUrl: "/l3.jpg",
      text: "Shiksha Mahakumbh - IIT Ropar",
      link: "https://www.youtube.com/watch?v=FFfdSd8_XOw",
    },
    {
      imageUrl: "/l4.png",
      text: "Shiksha Mahakumbh - IIT Ropar",
      link: "https://www.youtube.com/watch?v=FFfdSd8_XOw",
    },
    {
      imageUrl: "/l5.png",
      text: "Shiksha Mahakumbh - IIT Ropar",
      link: "https://www.youtube.com/watch?v=FFfdSd8_XOw",
    },
    {
      imageUrl: "/l6.png",
      text: "Shiksha Mahakumbh - IIT Ropar",
      link: "https://www.youtube.com/watch?v=FFfdSd8_XOw",
    },
    {
      imageUrl: "/l7.png",
      text: "Shiksha Mahakumbh - IIT Ropar",
      link: "https://www.youtube.com/watch?v=FFfdSd8_XOw",
    },
    {
      imageUrl: "/l8.png",
      text: "Shiksha Mahakumbh - IIT Ropar",
      link: "https://www.youtube.com/watch?v=FFfdSd8_XOw",
    },
    {
      imageUrl: "/l9.jpg",
      text: "Shiksha Mahakumbh - IIT Ropar",
      link: "https://www.youtube.com/watch?v=FFfdSd8_XOw",
    },
  ];

  return (
    <SectionShell
      background="cool"
      className="px-4 py-10 md:px-8 md:py-14"
      ariaLabel="Sponsors"
    >
      <div className="mx-auto max-w-7xl">
        <div className="mb-8 text-center">
          <p className="mb-2 text-sm font-semibold uppercase tracking-[0.2em] text-indigo-600/70">
            Sponsorship
          </p>
          <h1 className="text-3xl font-extrabold text-indigo-700 drop-shadow-md md:text-4xl">
            🌟 Our Sponsors 🌟
          </h1>
          <p className="mt-3 text-sm text-gray-600 md:text-base">
            Empowering{" "}
            <span className="font-semibold text-indigo-600">
              Shiksha Mahakumbh
            </span>{" "}
            with their invaluable support
          </p>
        </div>

        <GlassCard className="overflow-hidden p-4 md:p-6">
          <Marquee
            pauseOnHover={true}
            pauseOnClick={true}
            speed={40}
            gradient={true}
            gradientColor="#eef2ff"
            gradientWidth={60}
          >
            {marquees.map((sponsor, index) => (
              <a
                key={index}
                href={sponsor.link}
                target="_blank"
                rel="noopener noreferrer"
                className="group mx-6"
              >
                <motion.div
                  whileHover={{ scale: 1.1, y: -4 }}
                  className="flex items-center justify-center rounded-2xl border border-indigo-100 bg-white p-4 shadow-md transition-shadow hover:shadow-xl"
                >
                  <Image
                    className="h-24 w-24 object-contain"
                    src={sponsor.imageUrl}
                    alt={`Sponsor ${index + 1}`}
                    height={100}
                    width={100}
                  />
                </motion.div>
              </a>
            ))}
          </Marquee>
        </GlassCard>
      </div>
    </SectionShell>
  );
};

export default Organiger;
