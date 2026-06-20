import PublicPageShell from "@/components/layouts/PublicPageShell";
import Introduction from "@/components/content/Introduction";
import { INTRODUCTION_HERO } from "@/data/introduction-content";

const PAGE_HERO = {
  eyebrow: "Shiksha Mahakumbh Abhiyan · Department of Holistic Education",
  title: INTRODUCTION_HERO.title,
  subtitle: INTRODUCTION_HERO.subtitle,
  accent: "brand" as const,
  imageSrc: "/branding/shiksha-mahakumbh-brand-hero.png",
};

export default function IntroductionContent() {
  return (
    <PublicPageShell
      hero={PAGE_HERO}
      relatedPath="/introduction"
      containerClassName="mx-auto max-w-6xl px-4 py-8 md:px-8 md:py-12"
    >
      <Introduction />
    </PublicPageShell>
  );
}
