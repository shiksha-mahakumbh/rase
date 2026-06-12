"use client";

import Image from "next/image";
import { CtaButton, StatCard } from "@/components/ui";
import { event, impactStats } from "@/design/tokens";
import { ROUTES } from "@/constants/routes";
import CountdownBanner from "./CountdownBanner";
import { useCms } from "@/lib/cms/context";
import { getSection, sectionField, sectionItems } from "@/lib/cms/utils";

export default function HeroSection() {
  const cms = useCms();
  const hero = getSection(cms?.homepage, "hero");
  const counters = getSection(cms?.homepage, "counters");

  const headline = sectionField(hero, "headline", "शिक्षा महाकुंभ अभियान");
  const subheadline = sectionField(
    hero,
    "subheadline",
    "A National Movement for Global Education"
  );
  const description = sectionField(
    hero,
    "description",
    "Join policymakers, researchers, institutions, and youth at India's premier multidisciplinary education summit — aligned with NEP 2020 and the Bharat@2047 vision."
  );
  const badge = sectionField(hero, "badge", `${event.name} · Registration Open`);
  const dates = sectionField(hero, "dates", "📅 9–11 October 2026");
  const venue = sectionField(hero, "venue", `📍 ${event.venue}, HP`);
  const heroImage = sectionField(hero, "imageUrl", "/shiksha.png");
  const stats = sectionItems<{ label: string; value: string | number; suffix?: string }>(
    counters
  );
  const displayStats = stats.length
    ? stats.map((s) => {
        const numeric =
          typeof s.value === "number" ? s.value : parseInt(String(s.value), 10);
        return {
          label: s.label,
          value: Number.isFinite(numeric) ? numeric : 0,
          suffix: s.suffix ?? (typeof s.value === "string" && Number.isNaN(Number(s.value)) ? s.value : ""),
        };
      })
    : impactStats;

  return (
    <section
      aria-label="Shiksha Mahakumbh hero"
      className="relative overflow-hidden bg-gradient-to-br from-brand-navy via-brand-navy-light to-brand-navy"
    >
      <div
        className="pointer-events-none absolute inset-0 opacity-20"
        aria-hidden
        style={{
          backgroundImage:
            "radial-gradient(circle at 20% 50%, #FF9933 0%, transparent 40%), radial-gradient(circle at 80% 20%, #059669 0%, transparent 35%)",
        }}
      />
      <div className="relative mx-auto max-w-7xl px-4 py-12 sm:px-6 md:py-16 lg:py-20 lg:px-8">
        <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-12">
          <div className="text-center lg:text-left">
            <span className="inline-flex items-center gap-2 rounded-full border border-brand-saffron/40 bg-brand-saffron/10 px-3 py-1 text-xs font-bold uppercase tracking-wider text-brand-saffron">
              <span className="h-2 w-2 animate-pulse rounded-full bg-brand-saffron" />
              {badge}
            </span>

            <h1 className="mt-4 text-3xl font-extrabold leading-tight text-white sm:text-4xl md:text-5xl lg:text-[3.25rem]">
              {headline}
              <span className="mt-2 block text-2xl font-bold text-brand-saffron sm:text-3xl">
                {subheadline}
              </span>
            </h1>

            <p className="mx-auto mt-4 max-w-xl text-base leading-relaxed text-white/90 md:text-lg lg:mx-0">
              {description}
            </p>

            <div className="mt-6 flex flex-wrap items-center justify-center gap-2 text-sm text-white/80 lg:justify-start">
              <span className="rounded-lg bg-white/10 px-3 py-1.5 font-semibold">{dates}</span>
              <span className="rounded-lg bg-white/10 px-3 py-1.5 font-semibold">{venue}</span>
            </div>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:justify-center lg:justify-start">
              <CtaButton href={ROUTES.registration} variant="primary">
                Register Now
              </CtaButton>
              <CtaButton href="/abstract" variant="secondary">
                Submit Paper
              </CtaButton>
              <CtaButton href={ROUTES.registration} variant="outline">
                Become Volunteer
              </CtaButton>
            </div>

            <div className="mt-8">
              <CountdownBanner />
            </div>
          </div>

          <div className="relative mx-auto w-full max-w-md lg:max-w-none">
            <div className="relative aspect-[4/3] overflow-hidden rounded-2xl border border-white/20 shadow-2xl">
              <Image
                src={heroImage}
                alt="Shiksha Mahakumbh Abhiyan"
                fill
                className="object-contain p-6"
                priority
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
            </div>
            <div className="mt-4 grid grid-cols-2 gap-3">
              {displayStats.map((s) => (
                <StatCard
                  key={s.label}
                  value={s.value}
                  label={s.label}
                  suffix={s.suffix}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
