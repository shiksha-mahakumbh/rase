import Introduction from "@/components/content/Introduction";
import PublicPageShell from "@/components/layouts/PublicPageShell";
import {
  INTRODUCTION_HERO_IMAGE,
  INTRODUCTION_HERO_IMAGE_ALT,
} from "@/data/introduction-content";
import { getTranslations } from "next-intl/server";

export default async function HiIntroductionContent() {
  const t = await getTranslations({ locale: "hi", namespace: "introduction" });
  const meta = await getTranslations({ locale: "hi", namespace: "meta" });

  const hero = {
    eyebrow: "शिक्षा महाकुंभ अभियान · Department of Holistic Education",
    title: t("heroTitle"),
    subtitle: t("heroSubtitle"),
    accent: "brand" as const,
    imageSrc: INTRODUCTION_HERO_IMAGE,
    imageAlt: INTRODUCTION_HERO_IMAGE_ALT,
  };

  return (
    <PublicPageShell
      hero={hero}
      breadcrumbs={[
        { name: "मुख्य पृष्ठ", path: "/" },
        { name: meta("aboutTitle"), path: "/hi/introduction" },
      ]}
      relatedPath="/hi/introduction"
      containerClassName="mx-auto max-w-6xl px-4 py-8 md:px-8 md:py-12"
    >
      <Introduction />
    </PublicPageShell>
  );
}
