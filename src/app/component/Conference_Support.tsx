"use client";
import Image from "next/image";
import React from "react";
import Marquee from "react-fast-marquee";
import { motion } from "framer-motion";
import SectionShell from "./home/SectionShell";
import GlassCard from "./home/GlassCard";
import { normalizeStaticImageSrc } from "./home/normalizeImageSrc";

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
    <SectionShell
      background="gradient"
      className="px-4 py-10 md:px-8 md:py-14"
      ariaLabel="Academic and knowledge partners"
    >
      <div className="mx-auto max-w-7xl">
        <GlassCard className="overflow-hidden p-6 md:p-10">
          <div className="mb-8 text-center">
            <p className="mb-2 text-sm font-semibold uppercase tracking-[0.2em] text-primary/70">
              Partners &amp; Collaborators
            </p>
            <h1 className="home-section-title">
              🌍 Academic &amp; Knowledge Partners
            </h1>
          </div>

          <Marquee
            pauseOnHover={true}
            pauseOnClick={true}
            gradient={true}
            gradientColor="#ffffff"
            gradientWidth={80}
            speed={50}
          >
            {partners.map((partner, index) => (
              <motion.a
                key={index}
                href={partner.link || "#"}
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.08 }}
                className="group relative mx-4 flex items-center justify-center md:mx-6"
              >
                <div className="rounded-2xl border border-gray-100 bg-white p-4 shadow-md transition-shadow group-hover:shadow-2xl">
                  <Image
                    src={normalizeStaticImageSrc(partner.imageUrl)}
                    alt={`Academic Partner ${index + 1}`}
                    height={120}
                    width={120}
                    className="h-24 w-24 object-contain md:h-28 md:w-28"
                  />
                </div>
              </motion.a>
            ))}
          </Marquee>

          <p className="mt-8 text-center text-sm text-gray-600 md:text-base">
            🤝 Collaborating with leading institutions worldwide to foster{" "}
            <span className="font-semibold text-[#b22222]">
              education, research, and innovation
            </span>
            .
          </p>
        </GlassCard>
      </div>
    </SectionShell>
  );
};

export default Conference_Support;
