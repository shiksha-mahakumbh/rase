"use client";

import { FeatureCard, SectionHeader } from "@/components/ui";
import { useCms } from "@/lib/cms/context";
import { getSection, sectionField, sectionItems } from "@/lib/cms/utils";
import { iconForWhyAttend } from "./why-attend-icons";

const DEFAULT_FEATURES = [
  {
    title: "Policy & NEP 2020",
    description:
      "Engage with national education policy, implementation frameworks, and institutional roadmaps.",
    badge: "Impact",
  },
  {
    title: "Research & Publications",
    description:
      "Present abstracts, full papers, and proceedings aligned with Indian and global education research.",
    badge: "Academic",
  },
  {
    title: "Innovation & Startups",
    description:
      "Showcase projects, exhibitions, and entrepreneurial ideas from schools and higher education.",
    badge: "Innovation",
  },
  {
    title: "Olympiads & Talent",
    description:
      "Compete in olympiads, talent conclaves, and cultural programmes celebrating student excellence.",
  },
  {
    title: "Conclaves & Workshops",
    description:
      "Multi-track conclaves on holistic education, best practices, and Bharatiya knowledge systems.",
  },
  {
    title: "Global Networking",
    description:
      "Connect educators, NGOs, industry, and youth on one credible international platform.",
  },
];

export default function WhyAttendSection() {
  const cms = useCms();
  const section = getSection(cms?.homepage, "stats");
  const cmsFeatures = sectionItems<{
    title: string;
    description: string;
    badge?: string;
  }>(section, "features");

  const features = cmsFeatures.length ? cmsFeatures : DEFAULT_FEATURES;

  return (
    <section
      id="why-attend"
      aria-label="Why attend Shiksha Mahakumbh"
      className="bg-white py-12 md:py-16 lg:py-20"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeader
          eyebrow={sectionField(section, "eyebrow", "Why Attend")}
          title={section?.title ?? "Why Shiksha Mahakumbh?"}
          description={sectionField(
            section,
            "subtitle",
            "Six reasons educators, researchers, students, and institutions join India's flagship education summit."
          )}
        />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((f) => (
            <FeatureCard
              key={f.title}
              title={f.title}
              description={f.description}
              badge={f.badge}
              icon={iconForWhyAttend(f.title)}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
