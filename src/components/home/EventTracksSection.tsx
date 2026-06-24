"use client";

import { EventCard, SectionHeader } from "@/components/ui";
import { ROUTES } from "@/constants/routes";
import { CMT_SUBMISSION_URL } from "@/lib/registration/config";
import { useCms } from "@/lib/cms/context";
import { getSection, sectionField, sectionItems } from "@/lib/cms/utils";

const DEFAULT_TRACKS = [
  {
    title: "Multi-Track Conclaves",
    date: "During SMK 6.0",
    venue: "NIT Hamirpur",
    description: "Holistic education, policy, and Bharatiya knowledge systems.",
    href: ROUTES.academicCouncil,
    badge: "Conclave",
  },
  {
    title: "Multi Track Conference",
    date: "Submissions open",
    venue: "Microsoft CMT",
    description: "Submit papers and abstracts via the official CMT portal.",
    href: CMT_SUBMISSION_URL,
    badge: "Research",
  },
  {
    title: "Olympiads & Awards",
    date: "Competitive tracks",
    venue: "National participation",
    description: "Student olympiads, best practices, and recognition awards.",
    href: ROUTES.registration,
    badge: "Students",
  },
  {
    title: "Exhibitions & Projects",
    date: "Showcase",
    venue: "Innovation pavilion",
    description: "School and HEI project displays, startups, and exhibitions.",
    href: ROUTES.registration,
    badge: "Innovation",
  },
  {
    title: "Workshops",
    date: "Hands-on",
    venue: "On campus",
    description: "Capacity building sessions for educators and coordinators.",
    href: ROUTES.academicCouncil,
    badge: "Workshop",
  },
  {
    title: "Accommodation",
    date: "On request",
    venue: "Hamirpur region",
    description: "Request accommodation during registration for approved delegates.",
    href: ROUTES.registration,
    badge: "Travel",
  },
];

export default function EventTracksSection() {
  const cms = useCms();
  const section = getSection(cms?.homepage, "featured_programs");
  const programs = sectionItems<{
    title: string;
    description: string;
    url?: string;
    date?: string;
    venue?: string;
    badge?: string;
  }>(section);

  const tracks = programs.length
    ? programs.map((p) => ({
        title: p.title,
        date: p.date ?? "During SMK 6.0",
        venue: p.venue ?? "NIT Hamirpur",
        description: p.description,
        href: p.url ?? ROUTES.registration,
        badge: p.badge ?? "Programme",
      }))
    : DEFAULT_TRACKS;

  return (
    <section id="tracks" className="bg-brand-surface py-12 md:py-16 lg:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeader
          eyebrow="Programme"
          title={section?.title ?? "Tracks & Experiences"}
          description={sectionField(
            section,
            "subtitle",
            "Conferences, research, competitions, exhibitions, and networking — one integrated summit."
          )}
        />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {tracks.map((t) => (
            <EventCard key={t.title} {...t} ctaLabel="Explore" />
          ))}
        </div>
      </div>
    </section>
  );
}
