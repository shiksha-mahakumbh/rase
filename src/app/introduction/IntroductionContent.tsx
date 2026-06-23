import PublicPageShell from "@/components/layouts/PublicPageShell";
import Introduction from "@/components/content/Introduction";
import {
  INTRODUCTION_HERO,
  INTRODUCTION_HERO_IMAGE,
  INTRODUCTION_HERO_IMAGE_ALT,
} from "@/data/introduction-content";

const PAGE_HERO = {
  eyebrow: "Shiksha Mahakumbh Abhiyan · Department of Holistic Education",
  title: INTRODUCTION_HERO.title,
  subtitle: INTRODUCTION_HERO.subtitle,
  accent: "brand" as const,
  imageSrc: INTRODUCTION_HERO_IMAGE,
  imageAlt: INTRODUCTION_HERO_IMAGE_ALT,
};

const BREADCRUMBS = [
  { name: "Home", path: "/" },
  { name: "About", path: "/introduction" },
  { name: "Introduction", path: "/introduction" },
];

export default function IntroductionContent() {
  return (
    <PublicPageShell
      hero={PAGE_HERO}
      breadcrumbs={BREADCRUMBS}
      relatedPath="/introduction"
      containerClassName="mx-auto max-w-6xl px-4 py-8 md:px-8 md:py-12"
    >
      <Introduction />
    </PublicPageShell>
  );
}
