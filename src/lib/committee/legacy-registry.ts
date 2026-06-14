import type { ComponentType } from "react";

export type CommitteeLegacyEntry = {
  slug: string;
  edition: string;
  year: string;
  breadcrumbLabel: string;
  component: () => Promise<{ default: ComponentType }>;
};

export const COMMITTEE_LEGACY_EDITIONS: CommitteeLegacyEntry[] = [
  {
    slug: "shikshamahakumbh2025",
    edition: "Shiksha Mahakumbh 5.0 — NIPER Mohali",
    year: "2025",
    breadcrumbLabel: "Shiksha Mahakumbh 5.0",
    component: () => import("@/app/committee/shikshamahakumbh2025/LegacyEdition"),
  },
  {
    slug: "shikshamahakumbh2024",
    edition: "Shiksha Mahakumbh 4.0 — Kurukshetra University",
    year: "2024",
    breadcrumbLabel: "Shiksha Mahakumbh 4.0",
    component: () => import("@/app/committee/shikshamahakumbh2024/LegacyEdition"),
  },
  {
    slug: "shikshamahakumbh2023",
    edition: "Shiksha Mahakumbh 1.0 — NIT Jalandhar",
    year: "2023",
    breadcrumbLabel: "Shiksha Mahakumbh 1.0",
    component: () => import("@/app/committee/shikshamahakumbh2023/LegacyEdition"),
  },
  {
    slug: "shikshakumbh2024",
    edition: "Shiksha Mahakumbh 3.0 — NIT Srinagar",
    year: "2024",
    breadcrumbLabel: "Shiksha Mahakumbh 3.0",
    component: () => import("@/app/committee/shikshakumbh2024/LegacyEdition"),
  },
  {
    slug: "shikshakumbh2023",
    edition: "Shiksha Mahakumbh 2.0 — NIT Kurukshetra",
    year: "2023",
    breadcrumbLabel: "Shiksha Mahakumbh 2.0",
    component: () => import("@/app/committee/shikshakumbh2023/LegacyEdition"),
  },
];

export function getCommitteeLegacyEntry(slug: string) {
  return COMMITTEE_LEGACY_EDITIONS.find((entry) => entry.slug === slug) ?? null;
}

export const COMMITTEE_LEGACY_SLUGS = COMMITTEE_LEGACY_EDITIONS.map((entry) => entry.slug);
