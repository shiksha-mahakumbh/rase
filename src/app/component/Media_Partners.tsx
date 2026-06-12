"use client";
import Image from "next/image";
import React from "react";
import Marquee from "react-fast-marquee";
import { motion } from "framer-motion";
import SectionShell from "./home/SectionShell";
import GlassCard from "./home/GlassCard";
import { useCms } from "@/lib/cms/context";
import { getHomepagePartners } from "@/lib/cms/partners";
import type { CmsPartnerCard } from "@/lib/cms/types";

const DEFAULT_MEDIA = [
    {
      imageUrl: "/2024K/BW.jpg",
      link: "https://businessworld.in/",
      name: "Business World",
    },
    {
      imageUrl: "/2024K/dainik.jpg",
      link: "https://epaper.dainiksaveratimes.in/",
      name: "Dainik Savera",
    },
    {
      imageUrl: "/2024K/utam.png",
      link: "https://www.uttamhindu.com/",
      name: "Uttam Hindu",
    },
];

const MediaPartners: React.FC<{ cmsPartners?: CmsPartnerCard[] }> = ({
  cmsPartners = [],
}) => {
  const cms = useCms();
  const cmsMedia = getHomepagePartners(cms?.homepage, "media");
  const cmsMediaPartners =
    cmsMedia.length > 0
      ? cmsMedia
      : cmsPartners
          .filter((p) => p.partnerCategory === "media")
          .map((p) => ({
            name: p.name,
            logoUrl: p.logoUrl ?? "",
            website: p.website ?? undefined,
          }));

  const mediaPartners =
    cmsMediaPartners.length > 0
      ? cmsMediaPartners.map((p) => ({
          imageUrl: p.logoUrl ?? (p as { imageUrl?: string }).imageUrl ?? "",
          link: p.website ?? (p as { link?: string }).link ?? "",
          name: p.name,
        }))
      : DEFAULT_MEDIA;

  return (
    <SectionShell
      background="warm"
      className="px-4 py-10 md:px-8 md:py-14"
      ariaLabel="Media partners"
    >
      <div className="mx-auto max-w-7xl">
        <div className="mb-8 text-center">
          <p className="mb-2 text-sm font-semibold uppercase tracking-[0.2em] text-primary/70">
            Media &amp; Outreach
          </p>
          <h2 className="home-section-title">
            Our Esteemed Media Partners
          </h2>
          <p className="mt-3 text-base text-gray-600 md:text-lg">
            Empowering voices, spreading knowledge, shaping perspectives
          </p>
        </div>

        <Marquee pauseOnHover={true} speed={45} gradient={false}>
          {mediaPartners.map((partner, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              className="flex items-center justify-center"
            >
              <a
                href={partner.link}
                target="_blank"
                rel="noopener noreferrer"
                className="group relative m-6"
                aria-label={`Visit ${partner.name}`}
              >
                <GlassCard className="p-5">
                  <Image
                    className="h-24 w-28 object-contain transition-transform duration-300 group-hover:scale-110 group-hover:drop-shadow-lg md:h-28 md:w-28"
                    src={partner.imageUrl}
                    alt={`${partner.name} logo`}
                    height={120}
                    width={120}
                    loading="lazy"
                  />
                </GlassCard>
                <p className="mt-3 text-center text-sm font-medium text-gray-700 group-hover:text-primary">
                  {partner.name}
                </p>
              </a>
            </motion.div>
          ))}
        </Marquee>
      </div>
    </SectionShell>
  );
};

export default MediaPartners;
