"use client";

import React from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import GlassCard from "./home/GlassCard";

interface CardItem {
  src: string;
  alt: string;
  title: string;
  description: string;
  tags: string[];
}

const cardData: CardItem[] = [
  {
    src: "/2023K/k2.JPG",
    alt: "Shiksha Kumbh 2023",
    title: "RASE 2023 1st Edition",
    description: `We introduce "Shiksha Kumbh," a groundbreaking concept designed to complement Shiksha Mahakumbh and ensure that the light of education reaches every institution. The first edition of Shiksha Kumbh was held at NIT Kurukshetra in December 2023.`,
    tags: ["#shiksha", "#kumbh", "#bharat"],
  },
  {
    src: "/2023M/k1.png",
    alt: "Shiksha MahaKumbh 2023",
    title: "RASE 2023 2nd Edition",
    description: `This journey has seen the successful launch of the "Shiksha Mahakumbh" initiative, which made its historic debut in June 2023, with the inaugural session held at NIT Jalandhar, marking a momentous stride in our quest to reimagine education.`,
    tags: ["#dhe", "#mahakumbh", "#drthakur"],
  },
  {
    src: "/2024K/k2.jpeg",
    alt: "Shiksha Kumbh 2024",
    title: "RASE 2024\u00a03rd\u00a0Edition",
    description: `The conference will highlight the economic impact of academic-driven startups, fostering collaboration, skill development, and rural innovation. It aims to cultivate entrepreneurship culture and utilize educational infrastructure for startup growth.`,
    tags: ["#kumbh", "#shiksha", "#dhe"],
  },
];

export const CustomCard: React.FC = () => {
  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {cardData.map((item, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: index * 0.1, duration: 0.5 }}
        >
          <GlassCard className="home-card-hover flex h-full flex-col overflow-hidden">
            <div className="relative h-48 w-full overflow-hidden">
              <Image
                alt={item.alt}
                src={item.src}
                fill
                className="object-cover transition-transform duration-500 hover:scale-105"
                sizes="(max-width: 768px) 100vw, 33vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
            </div>
            <div className="flex flex-1 flex-col p-5">
              <h2 className="mb-2 text-xl font-bold text-[#502a2a]">
                {item.title}
              </h2>
              <p className="flex-1 text-sm leading-relaxed text-[#555]">
                {item.description}
              </p>
              <div className="mt-4 flex flex-wrap gap-2">
                {item.tags.map((tag, tagIndex) => (
                  <span
                    key={tagIndex}
                    className="rounded-full bg-[#502a2a] px-3 py-1 text-xs font-medium text-white"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </GlassCard>
        </motion.div>
      ))}
    </div>
  );
};
