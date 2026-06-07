import { EventCard, SectionHeader } from "@/components/ui";
import { ROUTES } from "@/constants/routes";

const tracks = [
  {
    title: "Multi-Track Conclaves",
    date: "During SMK 6.0",
    venue: "NIT Hamirpur",
    description: "Holistic education, policy, and Bharatiya knowledge systems.",
    href: ROUTES.academicCouncil,
    badge: "Conclave",
  },
  {
    title: "Research & Papers",
    date: "Submissions open",
    venue: "Online + onsite",
    description: "Abstract and full-length papers with peer-review process.",
    href: "/abstract",
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
  return (
    <section className="bg-brand-surface py-12 md:py-16 lg:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeader
          eyebrow="Programme"
          title="Tracks & Experiences"
          description="Conferences, research, competitions, exhibitions, and networking — one integrated summit."
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
