"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";

const ProjectDisplaySubmission = () => {
  return (
    <div className="grid gap-6 md:grid-cols-2">
      <motion.div
        whileHover={{ y: -4 }}
        className="flex-1 rounded-2xl border border-gray-100 bg-gradient-to-br from-white to-[#faf7f5] p-6 shadow-lg"
      >
        <h2 className="mb-4 text-xl font-semibold text-primary">HEI</h2>
        <p className="mb-4 text-gray-700">
          Project Display Registration for Shiksha Mahakumbh 2024 as HEI students
        </p>
        <Link
          className="inline-flex rounded-xl bg-primary px-5 py-2.5 text-sm font-bold text-white transition hover:bg-[#7a4343]"
          href="/heiprojectdisplaysubmission"
        >
          Click here to Register
        </Link>
      </motion.div>

      <motion.div
        whileHover={{ y: -4 }}
        className="flex-1 rounded-2xl border border-gray-100 bg-gradient-to-br from-white to-[#faf7f5] p-6 shadow-lg"
      >
        <h2 className="mb-4 text-xl font-semibold text-primary">School</h2>
        <p className="mb-4 text-gray-700">
          Project Display Registration for Shiksha Mahakumbh 2024 as School students
        </p>
        <Link
          className="inline-flex rounded-xl bg-primary px-5 py-2.5 text-sm font-bold text-white transition hover:bg-[#7a4343]"
          href="/schoolprojectdisplaysubmission"
        >
          Click here to Register
        </Link>
      </motion.div>
    </div>
  );
};

export default ProjectDisplaySubmission;
