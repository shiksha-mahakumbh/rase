// components/Commites.tsx

"use client";

import React from "react";
import { motion } from "framer-motion";
import Head from "next/head";

interface AdvisoryMember {
  name: string;
  designation: string;
}

interface AdvisoryCouncilProps {
  title: string;
  members: AdvisoryMember[];
}

const Commites: React.FC<AdvisoryCouncilProps> = ({ title, members }) => {
  return (
    <>
      {/* SEO Metadata */}
      <Head>
        <title>{`${title} | Shiksha Mahakumbh Abhiyan`}</title>
        <meta
          name="description"
          content={`Meet the esteemed members of ${title}, contributing to the Shiksha Mahakumbh Abhiyan — a global movement for holistic education and Indian knowledge systems.`}
        />
        <meta
          name="keywords"
          content={`Shiksha Mahakumbh Committee, ${title}, Shiksha Mahakumbh Abhiyan, Indian Education, Global Development`}
        />
      </Head>

      <section className="bg-white py-12 px-4 md:px-16">
        {/* Title Section */}
        <motion.div
          className="text-center mb-10"
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-3xl md:text-4xl font-bold text-primary mb-3">
            {title}
          </h2>
          <p className="text-gray-700 text-lg max-w-3xl mx-auto">
            The driving force behind <strong>Shiksha Mahakumbh Abhiyan</strong> —
            uniting visionary educators, leaders, and changemakers to transform
            education globally.
          </p>
          <div className="mt-4 mx-auto w-24 border-b-4 border-primary rounded-full"></div>
        </motion.div>

        {/* Members Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {members.map((member, index) => (
            <motion.div
              key={index}
              className="bg-gradient-to-br from-white to-gray-50 shadow-md hover:shadow-xl transition-shadow duration-300 rounded-2xl p-6 border border-gray-200 text-center"
              whileHover={{ scale: 1.03 }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05, duration: 0.4 }}
            >
              <div className="mb-3">
                <div className="w-20 h-20 mx-auto rounded-full bg-primary text-white flex items-center justify-center text-2xl font-bold shadow-md">
                  {member.name.charAt(0)}
                </div>
              </div>
              <h3 className="text-lg md:text-xl font-semibold text-gray-900">
                {member.name}
              </h3>
              <p className="text-gray-600 mt-2 text-sm md:text-base italic">
                {member.designation}
              </p>
            </motion.div>
          ))}
        </div>

        {/* Footer Message */}
        <motion.div
          className="text-center mt-12 text-gray-700"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.6 }}
        >
          <p className="text-base md:text-lg">
            Together, we are building a stronger educational foundation for{" "}
            <strong>Bharat</strong> and the <strong>World</strong>.
          </p>
        </motion.div>
      </section>
    </>
  );
};

export default Commites;
