import type { Metadata } from "next";
import Link from "next/link";
import ConferenceHubPage from "@/components/conferences/ConferenceHubPage";
import { WORKSHOP_ARCHIVE, WORKSHOPS_HUB } from "@/lib/knowledge-graph/conference-catalog";
import { buildBreadcrumbSchema, buildCollectionPageSchema } from "@/lib/seo/schema";

export const metadata: Metadata = {
  title: WORKSHOPS_HUB.title,
  description: WORKSHOPS_HUB.description,
  alternates: { canonical: WORKSHOPS_HUB.path },
};

const WORKSHOP_HINTS: Record<string, string> = {
  "/past_event/Teacher_Development_Program":
    "Faculty development in collaboration with NITTTR — March 2024",
  "/past_event/Spoken_English_Workshop":
    "Professional spoken English programme for educators — January 2024",
  "/past_event/Innovation_and_Entrepreneurship_Dhe_Workshop":
    "Innovation & entrepreneurship for students, teachers, and ATL coordinators — May 2024",
};

export default function WorkshopsHubPage() {
  const schemas = [
    buildCollectionPageSchema({
      name: WORKSHOPS_HUB.title,
      description: WORKSHOPS_HUB.description,
      path: WORKSHOPS_HUB.path,
    }),
    buildBreadcrumbSchema([
      { name: "Home", path: "/" },
      { name: "Conferences", path: "/conferences" },
      { name: "Workshops", path: WORKSHOPS_HUB.path },
    ]),
  ];

  return (
    <ConferenceHubPage
      hub={WORKSHOPS_HUB}
      schemas={schemas}
      breadcrumbParent={{ label: "Conferences", href: "/conferences" }}
    >
      <p className="mt-6 text-slate-600">
        Explore archived workshops from the Shiksha Mahakumbh Abhiyan — teacher development,
        language skills, and innovation programmes.
      </p>

      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {WORKSHOP_ARCHIVE.map((r) => (
          <Link
            key={r.path}
            href={r.path}
            className="group rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:border-brand-saffron/40 hover:shadow-md"
          >
            <h2 className="font-bold text-brand-navy group-hover:text-brand-blue">{r.label}</h2>
            {WORKSHOP_HINTS[r.path] && (
              <p className="mt-2 text-sm text-slate-600">{WORKSHOP_HINTS[r.path]}</p>
            )}
            <span className="mt-3 inline-block text-sm font-semibold text-brand-saffron">
              View archive →
            </span>
          </Link>
        ))}
      </div>

      <p className="mt-10">
        <Link
          href="/proceedings"
          className="font-semibold text-brand-blue hover:text-brand-saffron"
        >
          Browse proceedings →
        </Link>
      </p>
    </ConferenceHubPage>
  );
}
