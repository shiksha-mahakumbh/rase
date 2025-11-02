"use client";
import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { motion, useAnimation } from "framer-motion";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";

const ShikshaMahakumbhTimeline: React.FC = () => {
  const [archives, setArchives] = useState<{ [key: string]: boolean }>({});
  const scrollRef = useRef<HTMLDivElement>(null);
  const lineRef = useRef<HTMLDivElement>(null);
  const controls = useAnimation();

  const toggleArchive = (edition: string) =>
    setArchives((prev) => ({ ...prev, [edition]: !prev[edition] }));

  const mahakumbhSeries = [
    {
      title: "Shiksha Mahakumbh 1.0",
      year: "2023",
      description: "The inaugural edition laying the foundation for nationwide education renaissance.",
      link: "https://sm23.rase.co.in",
      campaign: "/RASE_2023_1ST_EDITION_Campaign.pdf",
      mainPhotos: "https://drive.google.com/drive/folders/1T5HOcgbHQs6MNouIiWb0i4DGkrRd23vY",
      day1Photos: "https://drive.google.com/drive/folders/1tKbSQtOUq7ji2s0-5hueAqTQlal9ScpJ",
    },
    {
      title: "Shiksha Mahakumbh 2.0",
      year: "2023",
      description: "Expanded edition connecting educators and students to holistic learning and outreach.",
      link: "https://sm23.rase.co.in",
      campaign: "/RASE_2023_2ND_EDITION_Campaign.pdf",
      mainPhotos: "https://drive.google.com/drive/folders/1u_rgXNeYBuwnLae7irG4NiHgEil69j16",
      day1Photos: "https://drive.google.com/drive/folders/1Xu4WfCeWLQp037EJn5Q0ULmREtnLplwq",
    },
    {
      title: "Shiksha Mahakumbh 3.0",
      year: "2024",
      description: "Focused on innovation, research, and student empowerment across India.",
      link: "https://sk24.rase.co.in",
      campaign: "/RASE_2024_3RD_EDITION_Campaign.pdf",
      mainPhotos: "https://drive.google.com/drive/folders/1XnauGu1-dQ2KCpTzvIMHhUwlBF-6GDEN",
      day1Photos: "https://drive.google.com/drive/folders/1SgwPcXC3xRR7V3hAtKJSzeggBB9Xpwnk",
    },
    {
      title: "Shiksha Mahakumbh 4.0",
      year: "2024",
      description: "Bringing together national leaders, educators, and innovators for holistic growth.",
      link: "https://rase.co.in",
      campaign: "/RASE_2024_4TH_EDITION_Campaign.pdf",
      mainPhotos: "https://drive.google.com/drive/folders/1XnauGu1-dQ2KCpTzvIMHhUwlBF-6GDEN",
      day1Photos: "https://drive.google.com/drive/folders/1SgwPcXC3xRR7V3hAtKJSzeggBB9Xpwnk",
    },
    {
      title: "Shiksha Mahakumbh 5.0",
      year: "2025",
      description: "Classroom to Society: Building a Healthier World Through Education.",
      link: "https://rase.co.in",
      campaign: "https://drive.google.com/drive/folders/1c2CKx2Z9IaN-dsoW-Ymw6Npx1EOTFcsA?usp=sharing",
      mainPhotos: "https://drive.google.com/drive/folders/1c2CKx2Z9IaN-dsoW-Ymw6Npx1EOTFcsA?usp=sharing",
      // day1Photos: "https://drive.google.com/drive/folders/1c2CKx2Z9IaN-dsoW-Ymw6Npx1EOTFcsA?usp=sharing",
    },
  ];

  const scrollLeft = () => {
    if (scrollRef.current)
      scrollRef.current.scrollBy({ left: -400, behavior: "smooth" });
  };

  const scrollRight = () => {
    if (scrollRef.current)
      scrollRef.current.scrollBy({ left: 400, behavior: "smooth" });
  };

  // Animate connecting line on scroll
  useEffect(() => {
    const handleScroll = () => {
      if (scrollRef.current && lineRef.current) {
        const scrollWidth = scrollRef.current.scrollWidth - scrollRef.current.clientWidth;
        const scrollLeft = scrollRef.current.scrollLeft;
        const progress = (scrollLeft / scrollWidth) * 100;
        lineRef.current.style.width = `${progress}%`;
      }
    };
    scrollRef.current?.addEventListener("scroll", handleScroll);
    return () => scrollRef.current?.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <section className="py-12 bg-gradient-to-r from-blue-50 to-purple-50">
      <div className="text-center mb-12">
        <motion.h1
          className="text-4xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-700 to-purple-700 tracking-wide"
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          शिक्षा महाकुंभ अभियान
        </motion.h1>
        <p className="mt-4 text-lg md:text-xl text-gray-700 max-w-3xl mx-auto">
          A nationwide movement redefining Indian education through innovation, inclusion, and inspiration.
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

        {/* Timeline Line */}
        <div className="absolute top-32 left-6 right-6 h-1 bg-gray-300 rounded-full z-0 hidden md:block"></div>
        <motion.div
          ref={lineRef}
          className="absolute top-32 left-6 h-1 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full z-10 hidden md:block"
        ></motion.div>

        <div
          ref={scrollRef}
          className="flex space-x-8 overflow-x-auto scrollbar-hide px-6 md:px-12 relative z-10"
        >
          {mahakumbhSeries.map((edition, index) => (
            <motion.div
              key={index}
              className="min-w-[320px] md:min-w-[400px] bg-white rounded-3xl shadow-xl p-6 flex-shrink-0 hover:scale-105 transition-transform relative"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.2 }}
            >
              {/* Timeline Dot */}
              <div className="absolute -top-6 left-1/2 transform -translate-x-1/2">
                <div className="w-6 h-6 bg-purple-600 border-2 border-white rounded-full shadow-lg"></div>
              </div>

              <h2 className="text-2xl font-bold text-center text-blue-800 mb-2">{edition.title}</h2>
              <span className="block text-center text-sm font-semibold text-gray-500 mb-3">
                Edition Year: {edition.year}
              </span>
              <p className="text-gray-600 mb-4 text-center">{edition.description}</p>

              <div className="flex justify-center gap-3 flex-wrap mb-3">
                <Link href={edition.link}>
                  <button className="bg-blue-600 text-white py-2 px-4 rounded-full hover:bg-blue-700 transition">
                    Visit Official Page
                  </button>
                </Link>
                <button
                  onClick={() => toggleArchive(edition.title)}
                  className="bg-purple-600 text-white py-2 px-4 rounded-full hover:bg-purple-700 transition"
                >
                  {archives[edition.title] ? "Hide Archive" : "View Archive"}
                </button>
              </div>

              {archives[edition.title] && (
                <motion.div
                  className="bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-xl p-4 space-y-3 mt-3"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5 }}
                >
                  <div className="flex flex-col md:flex-row md:justify-center gap-3 flex-wrap">
                    <PhotoLink title="Campaign Details" link={edition.campaign} />
                    <PhotoLink title="Mahakumbh Photos" link={edition.mainPhotos} />
                    <PhotoLink title="Day 1 Photos" link={edition.day1Photos} />
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

// Photo Link Component
const PhotoLink = ({ title, link }: { title: string; link: string }) => (
  <Link href={link} target="_blank">
    <button className="bg-white text-blue-700 font-semibold py-2 px-3 rounded-lg hover:bg-gray-100 transition text-sm">
      {title}
    </button>
  </Link>
);

export default ShikshaMahakumbhTimeline;
