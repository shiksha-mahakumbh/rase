"use client";

import React from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import SectionShell from "./home/SectionShell";
import GlassCard from "./home/GlassCard";
import { GlobeEducationIcon, InnovationIcon, KnowledgeIcon } from "./home/icons";

const CompanyInfo: React.FC = () => {
  return (
    <SectionShell
      background="gradient"
      className="px-4 py-8 md:px-8 md:py-12"
      ariaLabel="Welcome to Shiksha Mahakumbh Abhiyan"
    >
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-8 md:flex-row">
        {/* Left Section - Welcome Text */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="flex max-w-xl flex-col items-center space-y-4 text-center md:items-start md:text-left"
        >
          <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-primary">
            <GlobeEducationIcon className="h-4 w-4" />
            Global Educational Movement
          </div>
          <h2 className="text-3xl font-extrabold leading-tight text-brand-navy md:text-4xl lg:text-5xl">
            Welcome to{" "}
            <span className="home-gradient-text">Shiksha Mahakumbh Abhiyan</span>
          </h2>
          <p className="text-base leading-relaxed text-gray-700 md:text-lg">
            An initiative by the{" "}
            <strong>Department of Holistic Education (DHE)</strong> in
            collaboration with <strong>INIs</strong>, committed to fostering
            education, research, innovation, and{" "}
            <em>Bharatiye Knowledge Systems</em> for{" "}
            <strong>Bharat@2047</strong>.
          </p>
          <div className="flex flex-wrap justify-center gap-3 md:justify-start">
            <GlassCard hover={false} className="flex items-center gap-2 px-4 py-2">
              <InnovationIcon className="h-4 w-4 text-primary" />
              <span className="text-sm font-medium text-gray-700">
                Research &amp; Innovation
              </span>
            </GlassCard>
            <GlassCard hover={false} className="flex items-center gap-2 px-4 py-2">
              <KnowledgeIcon className="h-4 w-4 text-primary" />
              <span className="text-sm font-medium text-gray-700">
                Academic Excellence
              </span>
            </GlassCard>
          </div>
        </motion.div>

        {/* Center Logo Section */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.15 }}
          className="relative flex flex-col items-center"
        >
          <div
            aria-hidden="true"
            className="absolute inset-0 -z-10 rounded-full bg-gradient-to-br from-amber-200/40 to-primary/10 blur-2xl"
          />
          <GlassCard className="p-6">
            <a href="/" aria-label="Shiksha Mahakumbh Home">
              <Image
                src="/shiksha.png"
                alt="Shiksha Mahakumbh Abhiyan Logo"
                className="h-24 w-24 transition-transform duration-300 hover:scale-110 md:h-28 md:w-28"
                height={112}
                width={112}
                priority
              />
            </a>
          </GlassCard>
          <h3 className="mt-4 text-xl font-semibold tracking-wide text-brand-navy md:text-2xl">
            शिक्षा महाकुंभ अभियान
          </h3>
          <h3 className="text-lg font-bold text-brand-saffron md:text-xl">
            Shiksha Mahakumbh Abhiyan
          </h3>
        </motion.div>

        {/* Right Section - DHE Logo */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="flex flex-col items-center"
        >
          <GlassCard className="p-4">
            <a
              href="https://dhe.org.in"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Department of Holistic Education"
            >
              <Image
                src="/DHELogo.png"
                alt="Department of Holistic Education (DHE) Logo"
                className="h-20 w-20 transition-transform duration-300 hover:scale-110 md:h-28 md:w-28 lg:h-32 lg:w-32"
                height={128}
                width={128}
              />
            </a>
          </GlassCard>
          <p className="mt-3 text-center text-xs font-medium uppercase tracking-wider text-gray-500">
            Department of Holistic Education
          </p>
        </motion.div>
      </div>
    </SectionShell>
  );
};

export default CompanyInfo;
