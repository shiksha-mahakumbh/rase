"use client";
import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";

const ShikshaMahakumbhMediaTimeline: React.FC = () => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const lineRef = useRef<HTMLDivElement>(null);
  const [archives, setArchives] = useState<{ [key: string]: boolean }>({});

  const toggleArchive = (edition: string) =>
    setArchives((prev) => ({ ...prev, [edition]: !prev[edition] }));

  // Timeline data (corrected series)
  const editions = [
    {
      title: "Shiksha Mahakumbh 1.0",
      year: "2023",
      media: [{ label: "Wishes Received", link: "/comingsoon" }],
    },
    {
      title: "Shiksha Mahakumbh 2.0",
      year: "2023",
      media: [{ label: "Wishes Received", link: "/comingsoon" }],
    },
    {
      title: "Shiksha Mahakumbh 3.0",
      year: "2024",
      media: [{ label: "Wishes Received", link: "/comingsoon" }],
    },
    {
      title: "Shiksha Mahakumbh 4.0",
      year: "2024",
      media: [{ label: "Wishes Received", link: "/Wishes_Received" }],
    },
  ];

  // Scroll carousel
  const scrollLeft = () => scrollRef.current?.scrollBy({ left: -300, behavior: "smooth" });
  const scrollRight = () => scrollRef.current?.scrollBy({ left: 300, behavior: "smooth" });

  // Animate timeline line width
  useEffect(() => {
    const handleScroll = () => {
      if (scrollRef.current && lineRef.current) {
        const scrollWidth = scrollRef.current.scrollWidth - scrollRef.current.clientWidth;
        const progress = (scrollRef.current.scrollLeft / scrollWidth) * 100;
        lineRef.current.style.width = `${progress}%`;
      }
    };
    scrollRef.current?.addEventListener("scroll", handleScroll);
    return () => scrollRef.current?.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <section className="py-12 bg-gradient-to-r from-blue-50 to-purple-50">
      <div className="text-center mb-10">
        <h1 className="text-4xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-700 to-purple-700">
          शिक्षा महाकुंभ अभियान – Media Timeline
        </h1>
        <p className="mt-4 text-gray-700 max-w-3xl mx-auto">
          Explore the journey of Shiksha Mahakumbh editions through official media and messages.
        </p>
      </div>

      <div className="relative">
        {/* Scroll Buttons */}
        <button
          onClick={scrollLeft}
          className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-blue-600 text-white p-3 rounded-full shadow-lg hover:bg-blue-700 transition"
        >
          <FaArrowLeft />
        </button>
        <button
          onClick={scrollRight}
          className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-blue-600 text-white p-3 rounded-full shadow-lg hover:bg-blue-700 transition"
        >
          <FaArrowRight />
        </button>

        {/* Timeline line */}
        <div className="absolute top-32 left-6 right-6 h-1 bg-gray-300 rounded-full hidden md:block"></div>
        <motion.div
          ref={lineRef}
          className="absolute top-32 left-6 h-1 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full hidden md:block"
        />

        {/* Horizontal carousel */}
        <div
          ref={scrollRef}
          className="flex space-x-8 overflow-x-auto scrollbar-hide px-6 md:px-12 relative z-10"
        >
          {editions.map((edition, index) => (
            <motion.div
              key={index}
              className="min-w-[280px] md:min-w-[350px] bg-white rounded-3xl shadow-2xl p-6 flex-shrink-0 hover:scale-105 transition-transform relative"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.2 }}
            >
              {/* Timeline Dot */}
              <div className="absolute -top-6 left-1/2 transform -translate-x-1/2">
                <div className="w-6 h-6 bg-purple-600 border-2 border-white rounded-full shadow-lg" />
              </div>

              <h2 className="text-xl md:text-2xl font-bold text-center text-blue-800 mb-2">
                {edition.title}
              </h2>
              <span className="block text-center text-sm font-semibold text-gray-500 mb-3">
                Year: {edition.year}
              </span>

              <div className="flex flex-col gap-2 mb-3">
                {edition.media.map((mediaItem, idx) => (
                  <Link key={idx} href={mediaItem.link} target="_blank">
                    <button className="bg-blue-600 text-white py-2 px-3 rounded-full hover:bg-blue-700 transition text-sm">
                      {mediaItem.label}
                    </button>
                  </Link>
                ))}
              </div>

              {/* Archive toggle */}
              <button
                onClick={() => toggleArchive(edition.title)}
                className="mt-3 w-full bg-purple-600 text-white py-2 px-4 rounded-full hover:bg-purple-700 transition"
              >
                {archives[edition.title] ? "Hide Archive" : "View Archive"}
              </button>

              {archives[edition.title] && (
                <motion.div
                  className="bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-xl p-4 mt-3 space-y-2"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5 }}
                >
                  <p className="font-semibold text-center">Archived Media for {edition.title}</p>
                  <div className="flex flex-wrap justify-center gap-2">
                    {edition.media.map((mediaItem, idx) => (
                      <Link key={idx} href={mediaItem.link} target="_blank">
                        <button className="bg-white text-purple-700 font-semibold py-1 px-2 rounded hover:bg-gray-100 text-sm">
                          {mediaItem.label}
                        </button>
                      </Link>
                    ))}
                  </div>
                </motion.div>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ShikshaMahakumbhMediaTimeline;
