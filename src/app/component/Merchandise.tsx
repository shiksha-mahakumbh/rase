"use client";

import React from "react";
import Head from "next/head";
import { motion } from "framer-motion";
import SlideShow from "./SlideShow";
import Image from "next/image";
import Link from "next/link";

const merchandiseItems = [
  {
    id: 1,
    title: "Official T-Shirt",
    desc: "Wear your pride! Celebrate the spirit of Shiksha Mahakumbh Abhiyan with this comfortable, premium-quality cotton T-shirt featuring our official logo.",
    slides: [
      { src: "/merchandise/tshirt/1.jpg", alt: "T-shirt Image 1" },
      { src: "/merchandise/tshirt/2.jpg", alt: "T-shirt Image 2" },
      { src: "/merchandise/tshirt/3.jpg", alt: "T-shirt Image 3" },
    ],
    price: 500,
  },
  {
    id: 2,
    title: "Official Mug",
    desc: "Sip inspiration every morning with our signature Shiksha Mahakumbh mug — designed to remind you of the movement for holistic education and national awakening.",
    slides: [{ src: "/merchandise/mug/1.jpg", alt: "Mug Image 1" }],
    price: 200,
  },
  {
    id: 3,
    title: "Cap",
    desc: "A perfect blend of style and purpose! Stay cool and connected to the spirit of innovation with the official Shiksha Mahakumbh cap.",
    slides: [
      { src: "/merchandise/cap/1.jpg", alt: "Cap Image 1" },
      { src: "/merchandise/cap/2.jpg", alt: "Cap Image 2" },
    ],
    price: 200,
  },
  {
    id: 4,
    title: "Official Bag",
    desc: "Carry knowledge with pride! The official Shiksha Mahakumbh backpack — strong, spacious, and symbolic of the journey of education.",
    slides: [
      { src: "/merchandise/bag/1.jpg", alt: "Bag Image 1" },
      { src: "/merchandise/bag/2.jpg", alt: "Bag Image 2" },
    ],
    price: 400,
  },
];

const Merchandise: React.FC = () => {
  return (
    <>
      <Head>
        <title>Official Merchandise | Shiksha Mahakumbh Abhiyan</title>
        <meta
          name="description"
          content="Explore official Shiksha Mahakumbh Abhiyan merchandise including T-shirts, mugs, caps, and bags — crafted to celebrate India's educational renaissance."
        />
        <meta
          name="keywords"
          content="Shiksha Mahakumbh Merchandise, Education Summit India, T-shirt, Mug, Cap, Bag, Vidya Bharti, DHE, IIT Ropar, NIPER Mohali, Indian Education"
        />
        <meta property="og:title" content="Official Merchandise | Shiksha Mahakumbh Abhiyan" />
        <meta
          property="og:description"
          content="Own a piece of the Shiksha Mahakumbh Abhiyan legacy — shop exclusive merchandise today."
        />
        <meta property="og:image" content="/merchandise/og-image.jpg" />
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href="https://www.rase.co.in/merchandise" />
      </Head>

      {/* Hero Section */}
      <section className="relative bg-white text-black py-20 text-center overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src="/images/merchandise-banner.jpg"
            alt="Shiksha Mahakumbh Merchandise Banner"
            fill
            className="object-cover opacity-30"
          />
        </div>
        <div className="relative z-10 px-4">
          <motion.h1
            initial={{ opacity: 0, y: -40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
            className="text-4xl md:text-5xl font-bold text-primary drop-shadow-md"
          >
            Official Merchandise
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mt-4 text-lg md:text-xl max-w-3xl mx-auto text-gray-700"
          >
            Celebrate the spirit of <span className="font-semibold text-primary">शिक्षा महाकुंभ अभियान</span> —
            where knowledge, culture, and innovation unite. Explore exclusive event merchandise!
          </motion.p>
        </div>
      </section>

      {/* Merchandise Grid */}
      <section className="bg-white py-16 px-6 md:px-12">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-12">
            {merchandiseItems.map((item, index) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="border border-gray-200 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 bg-white"
              >
                <div className="relative">
                  <SlideShow slides={item.slides} />
                  <span className="absolute top-3 right-3 bg-primary text-white px-3 py-1 text-sm font-semibold rounded-full shadow-md">
                    ₹{item.price}
                  </span>
                </div>

                <div className="p-6">
                  <h2 className="text-2xl font-bold text-primary mb-2">{item.title}</h2>
                  <p className="text-gray-700 text-base mb-4">{item.desc}</p>

                  <div className="flex justify-center mt-6">
                    <Link href="/commingsoon">
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        className="bg-primary text-white font-semibold py-2 px-5 rounded-lg shadow hover:bg-blue-800 transition"
                      >
                        Buy Now
                      </motion.button>
                    </Link>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          <div className="text-center mt-16">
            <p className="text-gray-700 text-lg max-w-2xl mx-auto leading-relaxed">
              Your purchase supports the vision of{" "}
              <span className="font-semibold text-primary">Shiksha Mahakumbh Abhiyan</span> — empowering
              education, innovation, and social transformation across Bharat.
            </p>
          </div>
        </div>
      </section>
    </>
  );
};

export default Merchandise;
