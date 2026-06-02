"use client";

import React from "react";
import Marquee from "react-fast-marquee";
import Link from "next/link";
import Image from "next/image";
import { REGISTRATION_PATH } from "./UpcomingEvent";

const tickerItems = [
  {
    text: "Shiksha Mahakumbh 6.0 — 9–11 Oct 2026 at NIT Hamirpur. Registration open.",
    link: REGISTRATION_PATH,
    external: false,
  },
  {
    text: "Shiksha Mahakumbh 5.0 concluded at NIPER Mohali (31 Oct – 2 Nov 2025). View photos.",
    link: "https://drive.google.com/drive/folders/1c2CKx2Z9IaN-dsoW-Ymw6Npx1EOTFcsA",
    external: true,
  },
  {
    text: "Programmes @ Shiksha Mahakumbh 6.0 — explore the academic council schedule.",
    link: "/VibhagRoute/AcademicCouncil24",
    external: false,
  },
];

const Marquees: React.FC = () => {
  return (
    <section
      className="border-y border-primary/10 bg-gradient-to-r from-[#faf8f6] via-white to-amber-50/40"
      aria-label="Announcements"
    >
      <div className="mx-auto max-w-7xl px-4 py-4 md:py-5">
        <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#F59E0B] opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-[#F59E0B]" />
            </span>
            <h2 className="text-sm font-bold uppercase tracking-wider text-primary md:text-base">
              Announcements
            </h2>
          </div>
          <Link
            href={REGISTRATION_PATH}
            className="rounded-lg bg-primary px-3 py-1.5 text-xs font-bold text-white hover:bg-primary/90"
          >
            Register Now
          </Link>
        </div>

        <div className="overflow-hidden rounded-xl border border-[#F59E0B]/20 bg-white/90 shadow-sm">
          <Marquee
            pauseOnHover
            pauseOnClick
            gradient
            gradientColor="#ffffff"
            gradientWidth={40}
            speed={40}
          >
            <div className="flex gap-3 px-3 py-2">
              {tickerItems.map((item, index) => {
                const content = (
                  <span className="flex items-center gap-2 rounded-full border border-primary/15 bg-white px-4 py-1.5 text-sm font-medium text-gray-800 shadow-sm">
                    <Image
                      src="/new.gif"
                      alt=""
                      width={16}
                      height={16}
                      className="shrink-0"
                      unoptimized
                    />
                    {item.text}
                  </span>
                );

                return item.external ? (
                  <a
                    key={index}
                    href={item.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mx-1"
                  >
                    {content}
                  </a>
                ) : (
                  <Link key={index} href={item.link} className="mx-1">
                    {content}
                  </Link>
                );
              })}
            </div>
          </Marquee>
        </div>
      </div>
    </section>
  );
};

export default Marquees;
