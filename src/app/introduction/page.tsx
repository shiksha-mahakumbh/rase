import { createPageMetadata } from "@/lib/seo/metadata";
import { withHreflang } from "@/lib/seo/hreflang";
import {
  INTRODUCTION_HERO,
  INTRODUCTION_OG_IMAGE,
} from "@/data/introduction-content";

export const metadata = withHreflang(
  createPageMetadata({
  title: `${INTRODUCTION_HERO.title} — Introduction`,
  description:
    "Official introduction to Shiksha Mahakumbh Abhiyan — a people's movement for global educational transformation. Multi-edition national education summit aligned with NEP 2020, Whole-of-Society impact, and Bharat's role in global learning.",
  path: "/introduction",
  keywords: [
    "Shiksha Mahakumbh Abhiyan",
    "global educational transformation",
    "NEP 2020",
    "national education movement",
    "Department of Holistic Education",
    "Whole-of-Society education",
    "Indian education conference",
    "Bharatiya knowledge traditions",
    "education policy India",
  ],
  locale: "en_IN",
  ogImageUrl: INTRODUCTION_OG_IMAGE,
  }),
  "/introduction"
);

export { default } from "./IntroductionContent";
