import Link from "next/link";
import PublicPageShell from "@/components/layouts/PublicPageShell";
import JsonLd from "@/components/seo/JsonLd";
import type { ReactNode } from "react";

export interface ConferenceHubConfig {
  path: string;
  title: string;
  description: string;
  eyebrow?: string;
  accent?: "navy" | "saffron" | "emerald";
}

interface ConferenceHubPageProps {
  hub: ConferenceHubConfig;
  schemas: Record<string, unknown>[];
  breadcrumbParent: { label: string; href: string };
  children: ReactNode;
}

export default function ConferenceHubPage({
  hub,
  schemas,
  breadcrumbParent,
  children,
}: ConferenceHubPageProps) {
  return (
    <PublicPageShell
      hero={{
        eyebrow: hub.eyebrow ?? "Conferences",
        title: hub.title,
        subtitle: hub.description,
        accent: hub.accent ?? "saffron",
      }}
      relatedPath={hub.path}
      containerClassName="mx-auto max-w-4xl px-4 py-10 md:px-8 md:py-14"
    >
      {schemas.map((schema, i) => (
        <JsonLd key={i} data={schema} />
      ))}
      <nav aria-label="Breadcrumb" className="text-sm text-slate-600">
        <Link href={breadcrumbParent.href} className="hover:text-brand-saffron">
          {breadcrumbParent.label}
        </Link>
        <span className="mx-2" aria-hidden="true">
          /
        </span>
        <span className="font-medium text-brand-navy">{hub.title}</span>
      </nav>
      {children}
    </PublicPageShell>
  );
}
