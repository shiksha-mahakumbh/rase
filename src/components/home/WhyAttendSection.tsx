"use client";

import { FeatureCard, SectionHeader } from "@/components/ui";
import { useCms } from "@/lib/cms/context";
import { getSection, sectionField, sectionItems } from "@/lib/cms/utils";

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

function IconGrid() {
  return (
    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden>
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
    </svg>
  );
}

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
    <section aria-label="Why attend Shiksha Mahakumbh" className="bg-brand-surface py-12 md:py-16 lg:py-20">
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
              icon={<IconGrid />}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
