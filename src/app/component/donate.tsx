"use client";
import React from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import BrochureDownloadLink from "@/components/analytics/BrochureDownloadLink";

const Donate: React.FC = () => {
  return (
    <div className="bg-white text-black min-h-screen py-12 px-6 md:px-12">
      {/* Hero Section */}
      <div className="text-center mb-12">
        <motion.h1
          className="text-3xl md:text-5xl font-bold text-primary tracking-wide mb-4"
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          🙏 Support the Vision of <span className="text-blue-700">Shiksha Mahakumbh Abhiyan</span>
        </motion.h1>
        <p className="text-gray-700 text-lg md:text-xl max-w-3xl mx-auto leading-relaxed">
          Together, let us build a future where <strong>Education, Culture, and Technology</strong> come together 
          for the holistic development of Bharat and the world.  
          <br />Your contribution fuels knowledge, innovation, and transformation.
        </p>
      </div>

      {/* Main Donation Section */}
      <motion.div
        className="flex flex-col md:flex-row items-center justify-between bg-gradient-to-r from-blue-50 to-white rounded-2xl shadow-lg p-8 max-w-6xl mx-auto"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
      >
        {/* Left Side - Image */}
        <div className="flex justify-center md:w-1/2 mb-8 md:mb-0">
          <Image
            src="/2024K/Sponsor.png"
            alt="Donate for Shiksha Mahakumbh"
            width={400}
            height={400}
            className="rounded-xl object-cover shadow-md"
          />
        </div>

        {/* Right Side - Details */}
        <div className="md:w-1/2 text-left space-y-6">
          <h2 className="text-2xl md:text-3xl font-bold text-blue-700">
            Bank Details for Donation
          </h2>

          <div className="bg-white border border-gray-200 p-6 rounded-xl shadow-sm">
            <p className="leading-7">
              <strong>Account Name:</strong> Shiksha Mahakumbh<br />
              <strong>Account No.:</strong> 42563560855<br />
              <strong>Bank:</strong> State Bank of India<br />
              <strong>Branch:</strong> Chandigarh Main Branch<br />
              <strong>IFSC Code:</strong> SBIN0000628<br />
              <strong>UPI ID:</strong> shikshamahakumbh@sbi
            </p>
          </div>

          <div className="flex flex-wrap gap-4">
            <BrochureDownloadLink
              href="/2024K/Sponsership-Brochure-Shiksha-Mahakumbh-2025-1.pdf"
              plan="sponsorship-1"
              className="rounded-lg bg-blue-600 px-5 py-3 font-semibold text-white shadow-md transition duration-300 hover:bg-blue-700"
            >
              📘 View Sponsorship Plan 1
            </BrochureDownloadLink>

            <BrochureDownloadLink
              href="/2024K/Sponsership-Brochure-Shiksha-Mahakumbh-2025-2.pdf"
              plan="sponsorship-2"
              className="rounded-lg bg-yellow-500 px-5 py-3 font-semibold text-white shadow-md transition duration-300 hover:bg-yellow-600"
            >
              📗 View Sponsorship Plan 2
            </BrochureDownloadLink>
          </div>

          <p className="text-gray-600 text-base leading-relaxed">
            Every rupee you contribute strengthens <strong>the nation’s educational foundation</strong> and
            inspires millions of young minds.  
            <br />Be part of the movement. Join, Volunteer, or Sponsor today!
          </p>

          <div className="pt-4">
            <a
              href="https://shikshamahakumbh.com"
              target="_blank"
              className="inline-block bg-gradient-to-r from-blue-700 to-blue-500 text-white font-semibold px-6 py-3 rounded-full shadow-lg hover:scale-105 transition-transform"
            >
              🌍 Join the Shiksha Mahakumbh Movement
            </a>
          </div>
        </div>
      </motion.div>

      {/* Bottom Call to Action */}
      <motion.div
        className="text-center mt-16 max-w-3xl mx-auto"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5, duration: 0.8 }}
      >
        <h3 className="text-xl md:text-2xl font-semibold text-gray-800 mb-3">
          “Let’s make Education a Sacred Movement — a Mahakumbh of Knowledge.”
        </h3>
        <p className="text-gray-600">
          Stay tuned for updates at{" "}
          <a
            href="https://shikshamahakumbh.com"
            className="text-blue-700 font-semibold underline"
            target="_blank"
          >
            shikshamahakumbh.com
          </a>
        </p>
      </motion.div>
    </div>
  );
};

export default Donate;
