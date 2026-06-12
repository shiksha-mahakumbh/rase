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
    edition: "Shiksha Mahakumbh 2024",
    year: "2024",
    breadcrumbLabel: "Shiksha Mahakumbh 2024",
    component: () => import("@/app/committee/shikshamahakumbh2024/LegacyEdition"),
  },
  {
    slug: "shikshamahakumbh2023",
    edition: "Shiksha Mahakumbh 2023",
    year: "2023",
    breadcrumbLabel: "Shiksha Mahakumbh 2023",
    component: () => import("@/app/committee/shikshamahakumbh2023/LegacyEdition"),
  },
  {
    slug: "shikshakumbh2024",
    edition: "Shiksha Kumbh 2024",
    year: "2024",
    breadcrumbLabel: "Shiksha Kumbh 2024",
    component: () => import("@/app/committee/shikshakumbh2024/LegacyEdition"),
  },
  {
    slug: "shikshakumbh2023",
    edition: "Shiksha Kumbh 2023",
    year: "2023",
    breadcrumbLabel: "Shiksha Kumbh 2023",
    component: () => import("@/app/committee/shikshakumbh2023/LegacyEdition"),
  },
];

export function getCommitteeLegacyEntry(slug: string) {
  return COMMITTEE_LEGACY_EDITIONS.find((entry) => entry.slug === slug) ?? null;
}

export const COMMITTEE_LEGACY_SLUGS = COMMITTEE_LEGACY_EDITIONS.map((entry) => entry.slug);
