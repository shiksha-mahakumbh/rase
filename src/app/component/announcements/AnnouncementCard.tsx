"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import AnnouncementBadge from "./AnnouncementBadge";
import type {
  AnnouncementItem,
  AnnouncementPresentation,
} from "../navbar/types";
import { ConferenceIcon, GlobeEducationIcon } from "../home/icons";

interface AnnouncementCardProps {
  item: AnnouncementItem;
  presentation: AnnouncementPresentation;
  featured?: boolean;
  index: number;
}

const iconMap = {
  edition: ConferenceIcon,
  concluded: ConferenceIcon,
  register: GlobeEducationIcon,
};

const AnnouncementCard: React.FC<AnnouncementCardProps> = ({
  item,
  presentation,
  featured = false,
  index,
}) => {
  const Icon = iconMap[presentation.icon];

  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.08, duration: 0.45 }}
      whileHover={{ y: -4 }}
      className="h-full"
    >
      <Link
        href={item.link}
        target="_blank"
        rel="noopener noreferrer"
        className={`group flex h-full flex-col overflow-hidden rounded-2xl border bg-white/80 backdrop-blur-md transition-all duration-300 hover:shadow-xl ${
          featured
            ? "border-primary/25 bg-gradient-to-br from-white via-[#fff9f5] to-amber-50/40 shadow-lg shadow-primary/5"
            : "border-gray-200/80 shadow-md hover:border-[#F59E0B]/40"
        }`}
      >
        {/* Top accent */}
        <div
          className={`h-1 w-full ${
            featured
              ? "bg-gradient-to-r from-primary via-[#F59E0B] to-primary"
              : "bg-gradient-to-r from-[#F59E0B]/60 to-primary/40"
          }`}
        />

        <div className={`flex flex-1 flex-col p-4 md:p-5 ${featured ? "md:p-6" : ""}`}>
          <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
            <span className="text-[10px] font-bold uppercase tracking-[0.15em] text-gray-500">
              {presentation.category}
            </span>
            <div className="flex flex-wrap gap-1.5">
              {presentation.badges.map((badge) => (
                <AnnouncementBadge key={badge} label={badge} />
              ))}
            </div>
          </div>

          <div className="mb-3 flex items-start gap-3">
            <div
              className={`flex flex-shrink-0 items-center justify-center rounded-xl ${
                featured
                  ? "h-12 w-12 bg-primary/10 text-primary"
                  : "h-10 w-10 bg-amber-50 text-[#F59E0B]"
              }`}
            >
              <Icon className={featured ? "h-6 w-6" : "h-5 w-5"} />
            </div>
            <div className="relative h-6 w-6 flex-shrink-0">
              <Image
                src={item.imageUrl}
                alt="New Icon"
                width={24}
                height={24}
                className="animate-bounce"
                unoptimized
              />
            </div>
          </div>

          <p
            className={`flex-1 font-medium leading-relaxed text-gray-800 transition-colors group-hover:text-primary ${
              featured ? "text-base md:text-lg" : "text-sm md:text-base"
            }`}
          >
            {item.text}
          </p>

          {presentation.timelineLabel && (
            <div className="mt-4 flex items-center gap-2 border-t border-gray-100 pt-3">
              <span className="h-2 w-2 rounded-full bg-[#F59E0B] ring-4 ring-[#F59E0B]/20" />
              <span className="text-xs font-semibold text-gray-500">
                {presentation.timelineLabel}
              </span>
            </div>
          )}

          <span className="mt-4 inline-flex items-center text-xs font-bold uppercase tracking-wider text-[#F59E0B] opacity-0 transition-opacity group-hover:opacity-100">
            View details →
          </span>
        </div>
      </Link>
    </motion.div>
  );
};

export default AnnouncementCard;
