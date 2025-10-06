"use client";
import React, { Suspense, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";

const GridComponent: React.FC = () => {
  const [showArchiveKumbh, setShowArchiveKumbh] = useState(false);
  const [showArchiveMahaKumbh, setShowArchiveMahaKumbh] = useState(false);

  const toggleArchiveKumbh = () => setShowArchiveKumbh((prev) => !prev);
  const toggleArchiveMahaKumbh = () => setShowArchiveMahaKumbh((prev) => !prev);

  return (
    <Suspense fallback={<div>Loading...</div>}>
      {/* SEO & Heading Section */}
      <section className="text-center py-10 bg-gradient-to-r from-[#f5f7fa] to-[#c3cfe2]">
        <motion.h1
          className="text-4xl md:text-5xl font-extrabold text-primary tracking-wide"
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          शिक्षा महाकुंभ अभियान (Shiksha Mahakumbh Abhiyan)
        </motion.h1>
        <p className="mt-4 text-lg text-gray-700 max-w-3xl mx-auto">
          A nationwide movement to redefine Indian education through innovation, inclusion, and inspiration.
          Join the legacy of knowledge and transformation — from classrooms to society.
        </p>
      </section>

      {/* Event Grid Section */}
      <section className="container mx-auto p-6 md:p-10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          {/* Shiksha Kumbh Box */}
          <motion.div
            className="bg-white border border-gray-200 rounded-2xl shadow-xl hover:shadow-2xl transition-all p-6"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-2xl md:text-3xl font-bold text-primary text-center mb-4">
              Shiksha Kumbh 3.0 (2024)
            </h2>
            <p className="text-center text-gray-600 mb-6">
              Organized to connect youth, researchers, and educators towards India’s educational renaissance.
            </p>

            <div className="text-center mb-6">
              <Link href="https://sk24.rase.co.in">
                <button className="bg-primary text-white py-2 px-5 rounded-full hover:bg-primary-dark transition">
                  Visit Official Page
                </button>
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <PhotoLink title="Day 1 Photos" link="https://drive.google.com/drive/folders/1SgwPcXC3xRR7V3hAtKJSzeggBB9Xpwnk" />
              <PhotoLink title="Day 2 Photos" link="https://drive.google.com/drive/folders/1SgwPcXC3xRR7V3hAtKJSzeggBB9Xpwnk" />
            </div>

            {/* Archive Toggle */}
            <ArchiveToggle
              showArchive={showArchiveKumbh}
              toggleArchive={toggleArchiveKumbh}
              year="2023"
              website="https://sk23.rase.co.in"
              campaign="/RASE_2023_2nd_EDITION_Campaign.pdf"
              mainPhotos="https://drive.google.com/drive/folders/1T5HOcgbHQs6MNouIiWb0i4DGkrRd23vY"
              day1="https://drive.google.com/drive/folders/1tKbSQtOUq7ji2s0-5hueAqTQlal9ScpJ"
            />
          </motion.div>

          {/* Shiksha Mahakumbh Box */}
          <motion.div
            className="bg-white border border-gray-200 rounded-2xl shadow-xl hover:shadow-2xl transition-all p-6"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-2xl md:text-3xl font-bold text-primary text-center mb-4">
              Shiksha Mahakumbh 4.0 (2024)
            </h2>
            <p className="text-center text-gray-600 mb-6">
              Bringing together leaders, educators, and innovators for holistic national growth through education.
            </p>

            <div className="text-center mb-6">
              <Link href="https://rase.co.in">
                <button className="bg-primary text-white py-2 px-5 rounded-full hover:bg-primary-dark transition">
                  Visit Official Page
                </button>
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <PhotoLink title="Mahakumbh Photos" link="https://drive.google.com/drive/folders/1XnauGu1-dQ2KCpTzvIMHhUwlBF-6GDEN" />
              <PhotoLink title="Baton Ceremony" link="/BatonCeremony" />
              <PhotoLink title="Residential Camp" link="/ResidentialCamp" />
            </div>

            {/* Archive Toggle */}
            <ArchiveToggle
              showArchive={showArchiveMahaKumbh}
              toggleArchive={toggleArchiveMahaKumbh}
              year="2023"
              website="https://sm23.rase.co.in"
              campaign="/RASE_2023_1ST_EDITION_Campaign.pdf"
              mainPhotos="https://drive.google.com/drive/folders/1u_rgXNeYBuwnLae7irG4NiHgEil69j16?usp=sharing"
              day1="https://drive.google.com/drive/folders/1Xu4WfCeWLQp037EJn5Q0ULmREtnLplwq"
            />
          </motion.div>
        </div>
      </section>
    </Suspense>
  );
};

// ✅ Reusable Component for Photo Buttons
const PhotoLink = ({ title, link }: { title: string; link: string }) => (
  <div className="text-center">
    <p className="font-semibold text-gray-700 mb-1">{title}</p>
    <Link href={link}>
      <button className="bg-primary text-white py-2 px-3 rounded-lg hover:bg-primary-dark transition text-sm">
        View Photos
      </button>
    </Link>
  </div>
);

// ✅ Reusable Component for Archives
const ArchiveToggle = ({
  showArchive,
  toggleArchive,
  year,
  website,
  campaign,
  mainPhotos,
  day1,
}: any) => (
  <div className="text-center mt-6">
    <button
      onClick={toggleArchive}
      className="bg-primary text-white py-2 px-4 rounded-full hover:bg-primary-dark transition"
    >
      {showArchive ? "Hide Archive" : "View Archive"}
    </button>

    {showArchive && (
      <motion.div
        className="mt-4 p-4 bg-gradient-to-r from-primary to-blue-700 text-white rounded-lg space-y-2"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <p className="font-bold text-lg">Edition {year}</p>
        <Link href={website}>
          <button className="bg-white text-primary py-2 px-4 rounded-full hover:bg-gray-100 transition">
            Visit Official Website
          </button>
        </Link>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-3">
          <PhotoLink title="Campaign Details" link={campaign} />
          <PhotoLink title="Mahakumbh Photos" link={mainPhotos} />
          <PhotoLink title="Day 1 Photos" link={day1} />
        </div>
      </motion.div>
    )}
  </div>
);

export default GridComponent;
