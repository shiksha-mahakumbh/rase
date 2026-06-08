import type { Metadata } from "next";
import Link from "next/link";
import ConferenceHubPage from "@/components/conferences/ConferenceHubPage";
import { SUMMIT_ROUTES, SUMMITS_HUB } from "@/lib/knowledge-graph/conference-catalog";
import { buildBreadcrumbSchema, buildCollectionPageSchema } from "@/lib/seo/schema";

export const metadata: Metadata = {
  title: SUMMITS_HUB.title,
  description: SUMMITS_HUB.description,
  alternates: { canonical: SUMMITS_HUB.path },
};

export default function SummitsHubPage() {
  const schemas = [
    buildCollectionPageSchema({
      name: SUMMITS_HUB.title,
      description: SUMMITS_HUB.description,
      path: SUMMITS_HUB.path,
    }),
    buildBreadcrumbSchema([
      { name: "Home", path: "/" },
      { name: "Conferences", path: "/conferences" },
      { name: "Summits", path: SUMMITS_HUB.path },
    ]),
  ];

  return (
    <ConferenceHubPage
      hub={SUMMITS_HUB}
      schemas={schemas}
      breadcrumbParent={{ label: "Conferences", href: "/conferences" }}
    >
      <ul className="mt-8 space-y-2">
        {SUMMIT_ROUTES.map((r) => (
          <li key={r.path}>
            <Link href={r.path} className="font-medium text-brand-navy hover:underline">
              {r.label}
            </Link>
          </li>
        ))}
        <li>
          <Link
            href="/departments/academic-council"
            className="font-medium text-brand-navy hover:underline"
          >
            Academic Council
          </Link>
        </li>
        <li>
          <Link href="/conclave" className="font-medium text-brand-navy hover:underline">
            Academic Conclave
          </Link>
        </li>
      </ul>
    </ConferenceHubPage>
  );
}
