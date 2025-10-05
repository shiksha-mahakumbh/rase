"use client";

import React, { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import Head from "next/head";
import Image from "next/image";

const Glimpses: React.FC = () => {
  const [open, setOpen] = useState<string | null>(null);
  const toggle = (label: string) => setOpen(open === label ? null : label);

  const items = [
    {
      label: "शिक्षा महाकुंभ 4.0",
      engLabel: "Shiksha Mahakumbh 4.0",
      year: "2024",
      theme: "Indian Education System for Global Development",
      color: "from-blue-700 to-indigo-800",
      image: "/images/smk4.jpg",
      children: [
        { label: "Digital Media", link: "/shikshamahakumbh2024digitalmedia" },
        { label: "Print Media", link: "/printmediashikshamahakumbh2024" },
      ],
      archive: [
        {
          year: "2023",
          label: "शिक्षा महाकुंभ 1.0",
          engLabel: "Shiksha Mahakumbh 1.0",
          children: [
            { label: "Digital Media", link: "/shikshamahakumbh2023digitalmedia" },
            { label: "Print Media", link: "/printmediashikshamahakumbh2023" },
          ],
        },
      ],
    },
    {
      label: "शिक्षा महाकुंभ 3.0",
      engLabel: "Shiksha Mahakumbh 3.0",
      year: "2024",
      theme: "Role of Startups in Developing Economy of",
      color: "from-orange-500 to-red-600",
      image: "/images/smk3.jpg",
      children: [
        { label: "Digital Media", link: "/shikshakumbh2024digitalmedia" },
        { label: "Print Media", link: "/printmediashikshakumbh2024" },
      ],
      archive: [
        {
          year: "2023",
          label: "शिक्षा महाकुंभ 2.0",
          engLabel: "Shiksha Mahakumbh 2.0",
          children: [
            { label: "Digital Media", link: "/shikshakumbh2023digitalmedia" },
            { label: "Print Media", link: "/printmediashikshakumbh2023" },
          ],
        },
      ],
    },
  ];

  return (
    <>
      <Head>
        <title>Glimpses of Shiksha Mahakumbh Abhiyan | शिक्षा महाकुंभ अभियान</title>
        <meta
          name="description"
          content="Explore glimpses of शिक्षा महाकुंभ अभियान (Shiksha Mahakumbh Abhiyan) — India’s leading movement uniting education, research, innovation, and global development."
        />
        <meta
          name="keywords"
          content="Shiksha Mahakumbh, Education Summit India, Vidya Bharti, Indian Education System, Global Education, NIPER Mohali, IIT Ropar, DHE, Holistic Education"
        />
        <meta property="og:title" content="Glimpses of Shiksha Mahakumbh Abhiyan" />
        <meta
          property="og:description"
          content="Explore media glimpses of Shiksha Mahakumbh Abhiyan – celebrating education, innovation, and national development."
        />
        <meta property="og:image" content="/images/smk4.jpg" />
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href="https://www.rase.co.in/glimpses" />
      </Head>

      {/* Hero Section */}
      <section className="relative bg-white overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src="/images/glimpses-banner.jpg"
            alt="Glimpses of Shiksha Mahakumbh Abhiyan"
            layout="fill"
            objectFit="cover"
            priority
            className="opacity-60"
          />
        </div>
        <div className="relative z-10 flex flex-col items-center justify-center text-center py-24 px-6">
          <h1 className="text-4xl md:text-5xl font-bold text-primary mb-3 drop-shadow-md">
            झलकियाँ – शिक्षा महाकुंभ अभियान
          </h1>
          <p className="text-lg md:text-xl text-black max-w-3xl leading-relaxed">
            <span className="font-semibold text-primary">Shiksha Mahakumbh Abhiyan</span> is a
            national initiative uniting thinkers, academicians, innovators, and youth — building
            Bharat’s educational vision for a global future.
          </p>
        </div>
      </section>

      {/* Media Grid Section */}
      <section className="bg-white py-12 px-4 md:px-10">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-center text-3xl md:text-4xl font-bold text-primary mb-10 tracking-wide">
            Media Archives – <span className="text-black">शिक्षा महाकुंभ अभियान</span>
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {items.map((item, index) => (
              <motion.div
                key={index}
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.3 }}
                className="rounded-2xl overflow-hidden shadow-lg border border-gray-200 bg-gradient-to-br from-white to-gray-50"
              >
                <div className="relative">
                  <Image
                    src={item.image}
                    alt={`${item.engLabel} Glimpses`}
                    width={800}
                    height={400}
                    className="object-cover w-full h-52"
                  />
                  <div
                    className={`absolute inset-0 bg-gradient-to-t ${item.color} opacity-80`}
                  ></div>
                  <div className="absolute bottom-3 left-0 w-full text-center text-white">
                    <h2 className="text-xl font-semibold">{item.label}</h2>
                    <p className="text-sm opacity-90">{item.theme}</p>
                    <span className="text-xs bg-white/30 px-3 py-1 rounded-full mt-1 inline-block">
                      {item.year}
                    </span>
                  </div>
                </div>

                <div className="p-6">
                  <div className="flex flex-col gap-3">
                    {item.children.map((child, i) => (
                      <Link key={i} href={child.link}>
                        <button className="w-full bg-primary text-white font-medium py-2 rounded-md hover:bg-blue-800 transition duration-300">
                          {child.label}
                        </button>
                      </Link>
                    ))}
                  </div>

                  <div className="mt-6 text-center">
                    <button
                      onClick={() => toggle(item.label)}
                      className="text-primary font-medium hover:underline transition"
                    >
                      {open === item.label ? "Hide Archived Media ▲" : "View Archived Media ▼"}
                    </button>
                  </div>

                  <AnimatePresence>
                    {open === item.label && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.4 }}
                        className="mt-4 border-t border-gray-200 pt-4"
                      >
                        {item.archive.map((arch, j) => (
                          <div key={j} className="mb-3">
                            <h3 className="text-md font-semibold text-gray-800 text-center mb-2">
                              {arch.label} ({arch.year})
                            </h3>
                            <div className="flex flex-col gap-2">
                              {arch.children.map((child, k) => (
                                <Link key={k} href={child.link}>
                                  <button className="w-full bg-gray-100 border border-gray-300 text-gray-700 font-medium py-2 rounded-md hover:bg-gray-200 transition duration-300">
                                    {child.label}
                                  </button>
                                </Link>
                              ))}
                            </div>
                          </div>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </motion.div>
            ))}
          </div>

          <div className="text-center mt-14">
            <p className="text-gray-700 text-base max-w-3xl mx-auto leading-relaxed">
              Discover the inspiring journey of{" "}
              <span className="font-semibold text-primary">शिक्षा महाकुंभ अभियान</span> — where
              education meets innovation and culture. Join us in building Bharat’s educational vision
              for the world.
            </p>
          </div>
        </div>
      </section>
    </>
  );
};
export default Glimpses;
