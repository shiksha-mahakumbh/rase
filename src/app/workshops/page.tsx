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
      <ul className="mt-8 space-y-2">
        {WORKSHOP_ARCHIVE.map((r) => (
          <li key={r.path}>
            <Link href={r.path} className="font-medium text-brand-navy hover:underline">
              {r.label}
            </Link>
          </li>
        ))}
        <li>
          <Link href="/proceedings" className="font-medium text-brand-saffron hover:underline">
            Proceedings
          </Link>
        </li>
      </ul>
    </ConferenceHubPage>
  );
}
