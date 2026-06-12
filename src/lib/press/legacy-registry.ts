import type { ComponentType } from "react";

export type PressLegacyEntry = {
  slug: string;
  pressNumber?: number;
  component: () => Promise<{ default: ComponentType }>;
};

export const PRESS_LEGACY_ARTICLES: PressLegacyEntry[] = [
  {
    slug: "education-summit-coverage",
    pressNumber: 6,
    component: () => import("@/app/press/education-summit-coverage/LegacyArticle"),
  },
  {
    slug: "baton-ceremony-smk-4",
    pressNumber: 1,
    component: () => import("@/app/press/baton-ceremony-smk-4/LegacyArticle"),
  },
  {
    slug: "summit-highlights",
    pressNumber: 5,
    component: () => import("@/app/press/summit-highlights/LegacyArticle"),
  },
  {
    slug: "shiksha-mahakumbh-4-0",
    pressNumber: 2,
    component: () => import("@/app/press/shiksha-mahakumbh-4-0/LegacyArticle"),
  },
  {
    slug: "residential-camp-success",
    pressNumber: 3,
    component: () => import("@/app/press/residential-camp-success/LegacyArticle"),
  },
  {
    slug: "residential-camp-hindi",
    pressNumber: 4,
    component: () => import("@/app/press/residential-camp-hindi/LegacyArticle"),
  },
  {
    slug: "mahakumbh-programme-update",
    pressNumber: 5,
    component: () => import("@/app/press/mahakumbh-programme-update/LegacyArticle"),
  },
  {
    slug: "national-coverage",
    pressNumber: 5,
    component: () => import("@/app/press/national-coverage/LegacyArticle"),
  },
  {
    slug: "education-movement",
    pressNumber: 5,
    component: () => import("@/app/press/education-movement/LegacyArticle"),
  },
];

export function getPressLegacyEntry(slug: string) {
  return PRESS_LEGACY_ARTICLES.find((entry) => entry.slug === slug) ?? null;
}

export const PRESS_LEGACY_SLUGS = PRESS_LEGACY_ARTICLES.map((entry) => entry.slug);
