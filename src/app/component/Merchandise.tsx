// pages/merchandise.tsx

"use client";

import React from "react";
import { motion } from "framer-motion";
import SlideShow from "./SlideShow"; // Make sure the path is correct
import Head from "next/head";

const merchandiseItems = [
  {
    id: 1,
    title: "Shiksha Mahakumbh T-shirt",
    slides: [
      { src: "/merchandise/tshirt/1.jpg", alt: "T-shirt Image 1", legend: "" },
      { src: "/merchandise/tshirt/2.jpg", alt: "T-shirt Image 2", legend: "" },
      { src: "/merchandise/tshirt/3.jpg", alt: "T-shirt Image 3", legend: "" },
    ],
    price: 500,
  },
  {
    id: 2,
    title: "Official Mug",
    slides: [
      { src: "/merchandise/mug/1.jpg", alt: "Mug Image 1", legend: "" },
    ],
    price: 200,
  },
  {
    id: 3,
    title: "Cap",
    slides: [
      { src: "/merchandise/cap/1.jpg", alt: "Cap Image 1", legend: "" },
      { src: "/merchandise/cap/2.jpg", alt: "Cap Image 2", legend: "" },
    ],
    price: 200,
  },
  {
    id: 4,
    title: "Conference Bag",
    slides: [
      { src: "/merchandise/bag/1.jpg", alt: "Bag Image 1", legend: "" },
      { src: "/merchandise/bag/2.jpg", alt: "Bag Image 2", legend: "" },
    ],
    price: 400,
  },
];

const Merchandise = () => {
  return (
    <>
      {/* SEO Metadata */}
      <Head>
        <title>Official Merchandise | Shiksha Mahakumbh Abhiyan</title>
        <meta
          name="description"
          content="Explore official merchandise of Shiksha Mahakumbh Abhiyan – T-shirts, mugs, caps, and bags that symbolize the spirit of Bharat’s educational renaissance."
        />
        <meta
          name="keywords"
          content="Shiksha Mahakumbh merchandise, official T-shirt, educational event, Shiksha Mahakumbh store, IIT Ropar event, education campaign"
        />
        <meta name="robots" content="index, follow" />
      </Head>

      {/* Header Section */}
      <section className="bg-white text-black py-12 text-center px-4">
        <motion.h1
          className="text-4xl md:text-5xl font-bold mb-4 text-primary"
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          Shiksha Mahakumbh Official Merchandise
        </motion.h1>
        <motion.p
          className="text-lg md:text-xl max-w-3xl mx-auto text-gray-700"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.6 }}
        >
          Be part of the <strong>Shiksha Mahakumbh Abhiyan</strong> by owning
          exclusive event merchandise that represents unity, knowledge, and the
          spirit of <strong>Indian Education for Global Development</strong>.
        </motion.p>
      </section>

      {/* Merchandise Section */}
      <section className="bg-gray-50 py-12 px-4 md:px-16">
        <div className="max-w-6xl mx-auto grid gap-12">
          {merchandiseItems.map((item) => (
            <motion.div
              key={item.id}
              className="bg-white shadow-lg rounded-2xl overflow-hidden p-6 md:p-10 hover:shadow-xl transition-shadow duration-300"
              whileHover={{ scale: 1.02 }}
            >
              <h2 className="text-2xl md:text-3xl font-semibold mb-4 text-center text-primary">
                {item.title}
              </h2>

              <div className="max-w-3xl mx-auto mb-6">
                <SlideShow slides={item.slides} />
              </div>

              <p className="text-lg md:text-xl font-semibold text-center mb-6">
                <span className="font-bold text-primary text-2xl">₹{item.price}</span>{" "}
                <span className="text-gray-600 text-base">
                  + delivery charges
                </span>
              </p>

              <div className="text-center">
                <a href="/commingsoon" className="inline-block">
                  <motion.button
                    className="bg-primary text-white py-3 px-6 rounded-full font-semibold text-lg hover:bg-primary/90 transition"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Buy Now
                  </motion.button>
                </a>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Call-to-Action */}
      <section className="bg-primary text-white py-12 text-center">
        <h3 className="text-2xl md:text-3xl font-bold mb-4">
          Join the Movement of Educational Renaissance
        </h3>
        <p className="max-w-3xl mx-auto mb-6 text-lg text-gray-100">
          Support the mission of <strong>Shiksha Mahakumbh Abhiyan</strong> by
          purchasing official merchandise and spreading the message of holistic
          education across Bharat and the world.
        </p>
        <a href="/about">
          <motion.button
            className="bg-white text-primary font-semibold py-3 px-6 rounded-full hover:bg-gray-100"
            whileHover={{ scale: 1.05 }}
          >
            Learn More
          </motion.button>
        </a>
      </section>
    </>
  );
};

export default Merchandise;
