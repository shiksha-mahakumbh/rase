"use client";

import React from "react";
import { motion } from "framer-motion";
import SectionShell from "./home/SectionShell";
import GlassCard from "./home/GlassCard";
import {
  GlobeEducationIcon,
  InnovationIcon,
  KnowledgeIcon,
  LeadershipIcon,
  ResearchIcon,
  SocietyIcon,
} from "./home/icons";
import type { EditionItem } from "./home/types";
import { PAST_EDITIONS } from "@/data/past-editions";

const contentParagraphs: { text: React.ReactNode; icon: React.ReactNode }[] = [
  {
    icon: <GlobeEducationIcon className="h-6 w-6" />,
    text: (
      <>
        <strong>Shiksha Mahakumbh Abhiyan</strong> is a{" "}
        <strong>
          visionary, multi-edition, multinational, and multidimensional movement
        </strong>{" "}
        conceptualized by a distinguished ISRO scientist and eminent author, and
        shaped under the guidance of visionary educationists and social
        reformers. The initiative brings together{" "}
        <strong>education, policy, industry, civil society, and youth</strong> on
        a shared platform to reimagine and strengthen the{" "}
        <strong>Bhartiya education system</strong> while positioning{" "}
        <strong>Bharat</strong> as a meaningful contributor to the global
        education discourse.
      </>
    ),
  },
  {
    icon: <KnowledgeIcon className="h-6 w-6" />,
    text: (
      <>
        Rooted in <strong>Bharatiya knowledge traditions</strong> and aligned
        with global educational contexts, the Abhiyan serves as a{" "}
        <strong>
          powerful platform for collaboration, innovation, and implementation
        </strong>
        . Its aspiration goes beyond national boundaries—envisioning education on
        a global stage, much like the Olympic spirit—where local experiences and
        global perspectives converge to shape the future of learning.
      </>
    ),
  },
  {
    icon: <InnovationIcon className="h-6 w-6" />,
    text: (
      <>
        At its core lies a <strong>pragmatic yet forward-looking vision</strong>
        : to build a global education ecosystem that is{" "}
        <strong>
          inclusive, interdisciplinary, ethical, and transformation-driven
        </strong>
        —deeply connected with the real needs of society.
      </>
    ),
  },
  {
    icon: <ResearchIcon className="h-6 w-6" />,
    text: (
      <>
        Each edition of the Mahakumbh extends beyond dialogue and deliberation.
        It generates <strong>concrete action plans</strong>, fosters{" "}
        <strong>institutional partnerships</strong>, and encourages{" "}
        <strong>community participation</strong>, ensuring sustainable and
        measurable impact.
      </>
    ),
  },
  {
    icon: <SocietyIcon className="h-6 w-6" />,
    text: (
      <>
        A distinctive strength of the Shiksha Mahakumbh Abhiyan is its{" "}
        <strong>Whole-of-Society approach</strong>, transcending academic
        boundaries to engage teachers, students, institutional leaders,
        policymakers, industry representatives, social organizations, and media
        in a unified mission.
      </>
    ),
  },
  {
    icon: <LeadershipIcon className="h-6 w-6" />,
    text: (
      <>
        By positioning education as a{" "}
        <strong>catalyst for societal transformation</strong>, the movement
        calls for advancing with{" "}
        <strong>national consciousness and global responsibility</strong>.
      </>
    ),
  },
  {
    icon: <GlobeEducationIcon className="h-6 w-6" />,
    text: (
      <>
        Each edition builds upon the achievements of the previous one, creating
        a <strong>continuous chain of innovation and implementation</strong>.
      </>
    ),
  },
];

const editions: EditionItem[] = PAST_EDITIONS.map((e) => ({
  title: `${e.edition === "1.0" ? "First" : e.edition === "2.0" ? "Second" : e.edition === "3.0" ? "Third" : e.edition === "4.0" ? "Fourth" : "Fifth"} Edition – ${e.venue}`,
  date: e.dates,
  theme: e.theme,
  focus: e.coreEssence,
}));

const Info: React.FC = () => {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "EventSeries",
    name: "Shiksha Mahakumbh Abhiyan",
    description:
      "A global educational movement connecting policy, academia, industry, and society to transform education.",
    event: PAST_EDITIONS.map((e) => ({
      "@type": "Event",
      name: e.title,
      startDate: e.dateStart,
      endDate: e.dateEnd ?? e.dateStart,
      location: { "@type": "Place", name: e.venueFull },
      description: e.theme,
    })),
  };

  return (
    <SectionShell
      id="about"
      background="warm"
      className="px-4 py-12 md:px-8 md:py-16"
      ariaLabel="About Shiksha Mahakumbh Abhiyan"
    >
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="mx-auto max-w-7xl">
        <GlassCard className="overflow-hidden p-8 md:p-12">
          {/* Heading */}
          <div className="mb-10 text-center">
            <p className="mb-3 text-sm font-semibold uppercase tracking-[0.2em] text-primary/70">
              About the Movement
            </p>
            <h1 className="home-section-title leading-snug">
              Shiksha Mahakumbh Abhiyan:
              <span className="mt-2 block text-[#7a4343]">
                A People&apos;s Movement for Global Educational Transformation
              </span>
            </h1>
          </div>

          {/* Bento Grid Content */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {contentParagraphs.map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.06, duration: 0.45 }}
                className={`home-card-hover rounded-2xl border border-gray-100 bg-gradient-to-br from-white to-[#faf7f5] p-5 shadow-sm ${
                  index === 0 ? "md:col-span-2 lg:col-span-2" : ""
                }`}
              >
                <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  {item.icon}
                </div>
                <p className="text-justify text-[15.5px] leading-relaxed text-gray-800 md:text-base">
                  {item.text}
                </p>
              </motion.div>
            ))}
          </div>

          {/* Divider */}
          <div className="my-12 border-t border-gray-200" />

          {/* Major Editions - Interactive Timeline */}
          <div className="mb-8 text-center">
            <p className="mb-2 text-sm font-semibold uppercase tracking-[0.2em] text-primary/70">
              Knowledge Journey
            </p>
            <h2 className="text-2xl font-bold text-brand-navy md:text-3xl">
              Major Editions
            </h2>
          </div>

          <div className="relative space-y-6">
            <div aria-hidden="true" className="home-timeline-connector hidden md:block" />
            {editions.map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: index % 2 === 0 ? -20 : 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.08 }}
                className={`relative flex md:w-1/2 ${
                  index % 2 === 0
                    ? "md:mr-auto md:pr-8"
                    : "md:ml-auto md:pl-8"
                }`}
              >
                <div className="home-card-hover w-full rounded-2xl border border-gray-200 bg-gradient-to-br from-[#fff7f7] to-[#f5f0f0] p-5 shadow-md">
                  <div className="mb-2 flex items-center gap-2">
                    <span className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-sm font-bold text-white">
                      {index + 1}
                    </span>
                    <h3 className="text-lg font-bold text-brand-navy">
                      🔹 {item.title}
                    </h3>
                  </div>
                  <p className="mb-2 text-sm text-gray-600">{item.date}</p>
                  <p>
                    <strong>Theme:</strong> {item.theme}
                  </p>
                  <p>
                    <strong>Core Focus:</strong> {item.focus}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Closing Statement */}
          <GlassCard
            hover={false}
            className="mt-10 border-primary/10 bg-primary/5 p-6 text-center"
          >
            <p className="text-lg font-semibold text-brand-navy md:text-xl">
              Shiksha Mahakumbh Abhiyan continues to evolve as a dynamic
              national and global movement—bridging vision with action, and
              ideas with impact.
            </p>
          </GlassCard>
        </GlassCard>
      </div>
    </SectionShell>
  );
};

export default Info;
