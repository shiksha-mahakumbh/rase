"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import GlassCard from "./home/GlassCard";
import { PAST_EDITIONS } from "@/data/past-editions";

const highlightEditions = PAST_EDITIONS.slice(0, 3);

export const CustomCard: React.FC = () => {
  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {highlightEditions.map((edition, index) => (
        <motion.div
          key={edition.id}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: index * 0.1, duration: 0.5 }}
        >
          <GlassCard className="home-card-hover flex h-full flex-col overflow-hidden">
            {edition.imageSrc ? (
              <div className="relative h-48 w-full overflow-hidden">
                <Image
                  alt={edition.title}
                  src={edition.imageSrc}
                  fill
                  className="object-cover transition-transform duration-500 hover:scale-105"
                  sizes="(max-width: 768px) 100vw, 33vw"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
              </div>
            ) : null}
            <div className="flex flex-1 flex-col p-5">
              <h2 className="mb-2 text-xl font-bold text-brand-navy">{edition.title}</h2>
              <p className="text-sm font-medium text-primary">{edition.venue} · {edition.dates}</p>
              <p className="mt-2 flex-1 text-sm leading-relaxed text-[#555]">
                {edition.theme}
              </p>
              <Link
                href={edition.href}
                className="mt-4 text-sm font-semibold text-brand-saffron hover:underline"
              >
                View edition →
              </Link>
            </div>
          </GlassCard>
        </motion.div>
      ))}
    </div>
  );
};
