"use client";

import React, { useState } from "react";
import Head from "next/head";
import Link from "next/link";
import { motion } from "framer-motion";
import SlideShow from "../SlideShow"; // adjust path if needed

// ---------- DATA ----------
const committeeGroups = [
  {
    title: "Shiksha Mahakumbh Committees",
    description:
      "Meet the visionary leaders and academicians shaping Bharat’s educational renaissance under the Shiksha Mahakumbh Abhiyan.",
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
];

const advisoryMembers = [
  { name: "Prof. Dulal Panda", designation: "Director, NIPER SAS Nagar" },
  { name: "Dr. Thakur S.K.R", designation: "Scientist/Engineer-SF, ISRO; Director, DHE" },
  { name: "Dr. Gaurav Sharma", designation: "Principal Scientist, IIT Delhi" },
  { name: "Prof. Som Nath", designation: "Vice-Chancellor, Kurukshetra University" },
];

// Merchandise items
const merchandiseItems = [
  {
    id: 1,
    title: "T-shirt",
    slides: [
      { src: "/merchandise/tshirt/1.jpg", alt: "T-shirt 1", legend: "" },
      { src: "/merchandise/tshirt/2.jpg", alt: "T-shirt 2", legend: "" },
      { src: "/merchandise/tshirt/3.jpg", alt: "T-shirt 3", legend: "" },
    ],
    price: 500,
  },
  {
    id: 2,
    title: "Mug",
    slides: [{ src: "/merchandise/mug/1.jpg", alt: "Mug 1", legend: "" }],
    price: 200,
  },
  {
    id: 3,
    title: "Cap",
    slides: [{ src: "/merchandise/cap/1.jpg", alt: "Cap 1", legend: "" }],
    price: 200,
  },
  {
    id: 4,
    title: "Bag",
    slides: [{ src: "/merchandise/bag/1.jpg", alt: "Bag 1", legend: "" }],
    price: 400,
  },
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
        <title>Committees & Merchandise | Shiksha Mahakumbh Abhiyan</title>
        <meta
          name="description"
          content="Explore the Shiksha Mahakumbh committees and official merchandise — uniting scholars, innovators, and educators for Bharat’s global educational renaissance."
        />
        <meta
          name="keywords"
          content="Shiksha Mahakumbh, DHE, Vidya Bharti, education, committees, merchandise, Bharat, global education"
        />
      </Head>

      {/* HEADER */}
      <section className="bg-white text-black text-center py-16 px-4 border-b border-gray-200">
        <motion.h1
          className="text-4xl md:text-5xl font-bold mb-4 text-primary"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          Shiksha Mahakumbh Abhiyan – Committees & Official Merchandise
        </motion.h1>
        <p className="text-gray-700 max-w-3xl mx-auto">
          Celebrating Bharat’s educational excellence through collaboration, innovation, and unity.
        </p>
      </section>

      {/* COMMITTEE SECTION */}
      <section className="py-12 bg-gray-50 px-4 md:px-10">
        <div className="max-w-6xl mx-auto grid gap-8">
          {committeeGroups.map((committee, index) => (
            <motion.div
              key={index}
              className="bg-white shadow-lg rounded-2xl p-8 hover:shadow-xl transition"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-2xl font-bold text-primary mb-3 text-center">
                {committee.title}
              </h2>
              <p className="text-gray-700 text-center mb-6">{committee.description}</p>

              <div className="space-y-4 text-center">
                {committee.years.map((yearData, idx) => (
                  <div
                    key={idx}
                    className="border border-gray-200 rounded-xl p-4 hover:bg-gray-100 transition"
                  >
                    <span className="text-xl font-semibold text-primary">
                      {yearData.year}
                    </span>
                    <div className="mt-3 flex flex-col sm:flex-row justify-center gap-3">
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

      {/* MERCHANDISE SECTION */}
      <section className="bg-white py-16 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <motion.h2
            className="text-4xl font-bold text-primary mb-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            Official Shiksha Mahakumbh Merchandise
          </motion.h2>
          <p className="text-gray-700 mb-10 max-w-3xl mx-auto">
            Support the movement! Own official Shiksha Mahakumbh merchandise that celebrates Bharat’s educational journey.
          </p>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-10">
            {merchandiseItems.map((item) => (
              <motion.div
                key={item.id}
                className="border rounded-2xl shadow-md hover:shadow-lg transition bg-gray-50 p-6"
                whileHover={{ scale: 1.03 }}
              >
                <h3 className="text-2xl font-semibold mb-3 text-gray-800">
                  {item.title}
                </h3>
                <div className="mb-4">
                  <SlideShow slides={item.slides} />
                </div>
                <p className="text-lg font-semibold text-gray-900 mb-4">
                  Price: ₹{item.price} + Delivery
                </p>
                <Link href="/commingsoon">
                  <button className="bg-primary text-white py-2 px-5 rounded hover:bg-primary/90">
                    Buy Now
                  </button>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
};

export default CommitteesPage;
