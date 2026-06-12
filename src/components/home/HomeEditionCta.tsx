"use client";

import { CtaButton } from "@/components/ui";
import GlassCard from "@/app/component/home/GlassCard";
import { ROUTES } from "@/constants/routes";
import { useCms } from "@/lib/cms/context";
import { getSection, sectionField } from "@/lib/cms/utils";

export default function HomeEditionCta() {
  const cms = useCms();
  const cta = getSection(cms?.homepage, "cta");

  const edition = sectionField(cta, "editionLabel", "6th Edition");
  const headline = sectionField(
    cta,
    "headline",
    "NIT Hamirpur · 9–11 Oct 2026"
  );
  const body = sectionField(
    cta,
    "body",
    "Multi-track conclaves, olympiads, research, exhibitions, and awards."
  );
  const buttonLabel = sectionField(cta, "buttonLabel", "View full programme");
  const buttonUrl = sectionField(cta, "buttonUrl", ROUTES.academicCouncil);

  return (
    <GlassCard className="flex h-full flex-col justify-center p-6">
      <p className="text-sm font-semibold text-brand-saffron">{edition}</p>
      <p className="mt-2 text-lg font-bold text-brand-navy">{headline}</p>
      <p className="mt-2 text-sm text-slate-600">{body}</p>
      <div className="mt-4">
        <CtaButton href={buttonUrl} variant="ghost">
          {buttonLabel}
        </CtaButton>
      </div>
    </GlassCard>
  );
}
