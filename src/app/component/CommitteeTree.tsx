// pages/committee/index.tsx

"use client";

import React, { useState } from "react";
import Head from "next/head";
import Link from "next/link";
import { motion } from "framer-motion";

// ---------- DATA SECTION ----------
const committeeGroups = [
  {
    title: "Shiksha Mahakumbh Committees",
    description:
      "Meet the visionary leaders, academicians, and contributors shaping Bharat’s educational renaissance under the Shiksha Mahakumbh Abhiyan.",
    years: [
      {
        year: "2025",
        committeeLink: "/committee/shikshamahakumbh2025",
        website: "https://sm25.rase.co.in",
      },
      {
        year: "2024",
        committeeLink: "/committee/shikshamahakumbh2024",
        website: "https://sm24.rase.co.in",
      },
      {
        year: "2023",
        committeeLink: "/committee/shikshamahakumbh2023",
        website: "https://sm23.rase.co.in",
      },
    ],
  },
  {
    title: "Shiksha Kumbh Committees",
    description:
      "The Shiksha Kumbh initiatives form the foundation for academic collaboration and innovation across Bharat and the world.",
    years: [
      {
        year: "2024",
        committeeLink: "/committee/shikshakumbh2024",
        website: "https://sk24.rase.co.in",
      },
      {
        year: "2023",
        committeeLink: "/committee/shikshakumbh2023",
        website: "https://sk23.rase.co.in",
      },
    ],
  },
];

// ---------- MEMBER STRUCTURE ----------
const advisoryMembers = [
  { name: "Prof. Dulal Panda", designation: "Director, NIPER SAS Nagar" },
  { name: "Dr. Thakur S.K.R", designation: "Scientist/Engineer-SF, ISRO; Director, Department of Holistic Education (DHE)" },
  { name: "Prof. Kulbhushan Tikoo", designation: "NIPER SAS Nagar" },
  { name: "Dr. Jatinder Garg", designation: "Central University of HP" },
  { name: "Dr. Gaurav Sharma", designation: "Principal Scientist, IIT Delhi" },
  { name: "Prof. Som Nath", designation: "Vice-Chancellor, Kurukshetra University" },
  { name: "Dr. Ravi Kant", designation: "IIT Ropar" },
  { name: "Dr. Ramotar Meena", designation: "Jawaharlal Nehru University" },
  { name: "Dr. Rajneesh Talwar", designation: "Chitkara University" },
  { name: "Dr. Pooja Mahajan", designation: "Member, Department of Holistic Education" },
];

// ---------- MAIN COMPONENT ----------
const CommitteesPage = () => {
  const [expandedCommittee, setExpandedCommittee] = useState<string | null>(null);

  const toggleCommittee = (title: string) => {
    setExpandedCommittee(expandedCommittee === title ? null : title);
  };

  return (
    <>
      <Head>
        <title>Committees | Shiksha Mahakumbh Abhiyan</title>
        <meta
          name="description"
          content="Explore the committees and key members behind Shiksha Mahakumbh and Shiksha Kumbh — the national education renaissance initiatives uniting scholars, innovators, and institutions for global development."
        />
        <meta
          name="keywords"
          content="Shiksha Mahakumbh, committees, education event, Vidya Bharti, IIT Ropar, DHE, Shiksha Kumbh, educational collaboration, Bharat"
        />
        <meta name="robots" content="index, follow" />
      </Head>

      {/* HEADER SECTION */}
      <section className="bg-white text-black text-center py-16 px-4 border-b border-gray-200">
        <motion.h1
          className="text-4xl md:text-5xl font-bold mb-4 text-primary"
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          Committees of Shiksha Mahakumbh Abhiyan
        </motion.h1>
        <motion.p
          className="max-w-3xl mx-auto text-lg text-gray-700"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.6 }}
        >
          Guiding Bharat’s Educational Renaissance through Collaboration, Vision,
          and Leadership.
        </motion.p>
      </section>

      {/* COMMITTEE CARDS */}
      <section className="py-12 bg-gray-50 px-4 md:px-10">
        <div className="max-w-7xl mx-auto grid gap-8 md:grid-cols-2">
          {committeeGroups.map((committee, index) => (
            <motion.div
              key={index}
              className="bg-white shadow-lg rounded-2xl p-8 hover:shadow-xl transition-all"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-2xl font-bold text-primary mb-3 text-center">
                {committee.title}
              </h2>
              <p className="text-gray-700 text-center mb-6">{committee.description}</p>

              {/* Latest year first */}
              <div className="space-y-4 text-center">
                {committee.years.map((yearData, idx) => (
                  <div
                    key={idx}
                    className="border border-gray-200 rounded-xl p-4 hover:bg-gray-100 transition"
                  >
                    <span className="text-xl font-semibold text-primary">
                      {yearData.year}
                    </span>
                    <div className="mt-2 flex flex-col sm:flex-row justify-center gap-3">
                      <Link href={yearData.website}>
                        <button className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary/90 transition">
                          View Event
                        </button>
                      </Link>
                      <Link href={yearData.committeeLink}>
                        <button className="bg-gray-800 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition">
                          View Committee
                        </button>
                      </Link>
                    </div>
                  </div>
                ))}
              </div>

              {/* Expand/Collapse Advisory */}
              <div className="text-center mt-6">
                <button
                  className="text-blue-600 font-semibold underline"
                  onClick={() => toggleCommittee(committee.title)}
                >
                  {expandedCommittee === committee.title
                    ? "Hide Key Advisors"
                    : "View Key Advisors"}
                </button>
              </div>

              {expandedCommittee === committee.title && (
                <div className="mt-6 overflow-x-auto">
                  <table className="min-w-full border border-gray-300 rounded-lg text-left">
                    <thead>
                      <tr className="bg-primary text-white">
                        <th className="p-3">Name</th>
                        <th className="p-3">Designation</th>
                      </tr>
                    </thead>
                    <tbody>
                      {advisoryMembers.map((member, i) => (
                        <tr
                          key={i}
                          className={`${
                            i % 2 === 0 ? "bg-white" : "bg-gray-100"
                          } hover:bg-gray-200`}
                        >
                          <td className="p-3 border border-gray-200 text-gray-900">
                            {member.name}
                          </td>
                          <td className="p-3 border border-gray-200 text-gray-800">
                            {member.designation}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </motion.div>
          ))}
        </div>
      </section>

      {/* CTA SECTION */}
      <section className="bg-primary text-white text-center py-12">
        <h3 className="text-3xl font-bold mb-4">
          Shiksha Mahakumbh 2025 – Join the Journey of Transformation
        </h3>
        <p className="max-w-3xl mx-auto mb-6 text-lg text-gray-100">
          Participate in our conclaves, research forums, and educational
          collaborations to strengthen Bharat’s vision for global development.
        </p>
        <Link href="/conclave">
          <motion.button
            className="bg-white text-primary font-semibold py-3 px-6 rounded-full hover:bg-gray-100"
            whileHover={{ scale: 1.05 }}
          >
            Explore Conclaves
          </motion.button>
        </Link>
      </section>
    </>
  );
};

export default CommitteesPage;
