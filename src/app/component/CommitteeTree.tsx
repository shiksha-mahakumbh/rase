"use client";
import React, { useState, Suspense } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Globe } from "lucide-react";

interface CommitteeTreeProps {
  onSelect: (committee: string) => void;
}

const CommitteeGrid: React.FC<CommitteeTreeProps> = ({ onSelect }) => {
  const [visibleArchives, setVisibleArchives] = useState<{ [key: string]: boolean }>({});

  const events = [
    {
      title: "Shiksha Mahakumbh 4.0",
      year: "2024",
      series: "Series 4.0",
      desc: "Held at IIT Ropar, the 4th edition continued the mission of global educational transformation under the Shiksha Mahakumbh Abhiyan.",
      links: {
        website: "https://sm24.rase.co.in",
        committee: "/committee/shikshamahakumbh2024",
        drive: "https://drive.google.com/drive/folders/1XnauGu1-dQ2KCpTzvIMHhUwlBF-6GDEN",
      },
    },
    {
      title: "Shiksha Kumbh 3.0",
      year: "2024",
      series: "Series 3.0",
      desc: "Focused on school and higher education synergy, hosted at IIT Ropar with nationwide participation.",
      links: {
        website: "https://sk24.rase.co.in",
        committee: "/committee/shikshakumbh2024",
        drive: "https://drive.google.com/drive/folders/1SgwPcXC3xRR7V3hAtKJSzeggBB9Xpwnk",
      },
    },
    {
      title: "Shiksha Kumbh 2.0",
      year: "2023",
      series: "Series 2.0",
      desc: "A milestone event emphasizing innovation in Indian education systems and global development frameworks.",
      links: {
        website: "https://sk23.rase.co.in",
        committee: "/committee/shikshakumbh2023",
        drive: "https://drive.google.com/drive/folders/1T5HOcgbHQs6MNouIiWb0i4DGkrRd23vY",
      },
    },
    {
      title: "Shiksha Mahakumbh 1.0",
      year: "2023",
      series: "Series 1.0",
      desc: "The inaugural edition that launched the Shiksha Mahakumbh Abhiyan, shaping a new vision for Bharat’s education model.",
      links: {
        website: "https://sm23.rase.co.in",
        committee: "/committee/shikshamahakumbh2023",
        drive: "https://drive.google.com/drive/folders/1u_rgXNeYBuwnLae7irG4NiHgEil69j16",
      },
    },
  ];

  return (
    <div className="bg-white text-black min-h-screen py-10 px-4 md:px-10">
      <Suspense fallback={<div>Loading...</div>}>
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: -30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-12"
          >
            <h1 className="text-4xl font-bold text-gray-900 mb-2">Shiksha Mahakumbh Abhiyan</h1>
            <p className="text-lg text-gray-600">
              A Journey of Transforming Education from Bharat to the World 🌍
            </p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-8">
            {events.map((event, index) => (
              <motion.div
                key={index}
                className="p-6 rounded-2xl shadow-md bg-gradient-to-br from-gray-50 to-gray-100 border border-gray-200 hover:shadow-xl transition-all duration-300"
                whileHover={{ scale: 1.03 }}
              >
                <div className="flex justify-between items-center mb-3">
                  <h2 className="text-xl font-semibold text-blue-700">{event.title}</h2>
                  <span className="text-sm bg-blue-100 text-blue-800 px-3 py-1 rounded-full font-medium">
                    {event.series}
                  </span>
                </div>

                <p className="text-gray-700 mb-4 text-sm leading-relaxed">{event.desc}</p>

                <div className="space-y-3">
                  <Link href={event.links.website} passHref>
                    <button className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition">
                      🌐 Visit Official Website
                    </button>
                  </Link>
                  <Link href={event.links.committee} passHref>
                    <button
                      className="w-full border border-blue-600 text-blue-700 py-2 rounded-lg hover:bg-blue-50 transition"
                      onClick={() => onSelect(event.title + " Committee")}
                    >
                      🧭 View Committee Details
                    </button>
                  </Link>
                  <Link href={event.links.drive} passHref>
                    <button className="w-full bg-gray-800 text-white py-2 rounded-lg hover:bg-gray-900 transition">
                      📸 View Event Gallery
                    </button>
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>

          <motion.div
            className="text-center mt-12 text-gray-600 text-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4, duration: 1 }}
          >
            <p>
              The <strong>Shiksha Mahakumbh Abhiyan</strong> connects scholars, educators, and
              innovators globally — creating a unified movement for transforming education.
            </p>
          </motion.div>
        </div>
      </Suspense>
    </div>
  );
};

export default CommitteeGrid;
