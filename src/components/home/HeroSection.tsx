"use client";

import Image from "next/image";
import { CtaButton, StatCard } from "@/components/ui";
import { event, impactStats } from "@/design/tokens";
import { ROUTES } from "@/constants/routes";
import { CMT_SUBMISSION_URL } from "@/lib/registration/config";
import CountdownBanner from "./CountdownBanner";
import { useCms } from "@/lib/cms/context";
import { getSection, sectionField, sectionItems } from "@/lib/cms/utils";

const BRAND_HERO = "/branding/shiksha-mahakumbh-brand-hero.png";

export default function HeroSection() {
  const cms = useCms();
  const hero = getSection(cms?.homepage, "hero");
  const counters = getSection(cms?.homepage, "counters");

  const headline = sectionField(hero, "headline", "शिक्षा महाकुंभ अभियान");
  const subheadline = sectionField(
    hero,
    "subheadline",
    "वैश्विक विमर्श निर्माण को समर्पित"
  );
  const description = sectionField(
    hero,
    "description",
    "Department of Holistic Education · A national movement aligning NEP 2020, research, innovation, and Bharatiya knowledge traditions on one vibrant global platform."
  );
  const badge = sectionField(hero, "badge", `${event.name} · Registration Open`);
  const dates = sectionField(hero, "dates", "📅 9–11 October 2026");
  const venue = sectionField(hero, "venue", `📍 ${event.venue}, HP`);
  const heroImage = sectionField(hero, "imageUrl", BRAND_HERO);
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
          suffix:
            s.suffix ??
            (typeof s.value === "string" && Number.isNaN(Number(s.value)) ? s.value : ""),
        };
      })
    : impactStats;

  return (
    <section
      aria-label="Shiksha Mahakumbh hero"
      className="brand-hero-bg relative overflow-hidden"
    >
      {/* Decorative graphics */}
      <div
        className="pointer-events-none absolute -left-20 top-10 h-64 w-64 rounded-full bg-brand-saffron/15 blur-3xl"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute -right-16 top-1/3 h-72 w-72 rounded-full bg-brand-blue/10 blur-3xl"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute bottom-0 left-1/2 h-48 w-[120%] -translate-x-1/2 bg-gradient-to-t from-brand-saffron/8 to-transparent"
        aria-hidden
      />

      <div className="relative mx-auto max-w-7xl px-4 py-10 sm:px-6 md:py-14 lg:px-8 lg:py-16">
        <div className="grid items-center gap-8 lg:grid-cols-2 lg:gap-10">
          <div className="order-2 text-center lg:order-1 lg:text-left">
            <span className="inline-flex items-center gap-2 rounded-full border border-brand-saffron/50 bg-brand-saffron/10 px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-brand-saffron-dark">
              <span className="h-2 w-2 animate-pulse rounded-full bg-brand-saffron" />
              {badge}
            </span>

            <h1 className="mt-5 text-3xl font-extrabold leading-tight sm:text-4xl md:text-5xl">
              {headline.includes("महाकुंभ") ? (
                <span className="text-brand-navy">{headline}</span>
              ) : (
                <>
                  <span className="text-brand-blue">शिक्षा </span>
                  <span className="text-brand-saffron">महाकुंभ</span>
                  {headline ? (
                    <span className="mt-1 block text-brand-navy">{headline}</span>
                  ) : null}
                </>
              )}
              <span className="mt-2 block text-xl font-bold text-brand-blue/80 sm:text-2xl">
                {subheadline}
              </span>
            </h1>

            <p className="mx-auto mt-4 max-w-xl text-base leading-relaxed text-slate-600 md:text-lg lg:mx-0">
              {description}
            </p>

            <div className="mt-6 flex flex-wrap items-center justify-center gap-2 text-sm lg:justify-start">
              <span className="rounded-xl border border-brand-blue/15 bg-white px-4 py-2 font-semibold text-brand-navy shadow-sm">
                {dates}
              </span>
              <span className="rounded-xl border border-brand-saffron/25 bg-brand-surface-warm px-4 py-2 font-semibold text-brand-navy shadow-sm">
                {venue}
              </span>
            </div>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:justify-center lg:justify-start">
              <CtaButton href={ROUTES.registration} variant="primary">
                Register Now
              </CtaButton>
              <CtaButton href={CMT_SUBMISSION_URL} variant="secondary">
                Multi Track Conference
              </CtaButton>
              <CtaButton href="/abhiyaninphotoframe" variant="ghost">
                Abhiyan Photo Frame
              </CtaButton>
            </div>

            <div className="mt-8">
              <CountdownBanner theme="light" />
            </div>
          </div>

          <div className="order-1 lg:order-2">
            <div className="relative mx-auto max-w-lg lg:max-w-none">
              <div
                className="absolute -inset-3 rounded-3xl bg-gradient-to-br from-brand-saffron/30 via-white to-brand-blue/20 blur-sm"
                aria-hidden
              />
              <div className="relative overflow-hidden rounded-2xl border-2 border-white bg-white p-2 shadow-[0_20px_60px_rgba(255,153,51,0.18)]">
                <Image
                  src={heroImage}
                  alt="Shiksha Mahakumbh Abhiyan — Department of Holistic Education"
                  width={800}
                  height={600}
                  className="h-auto w-full rounded-xl object-contain"
                  priority
                  sizes="(max-width: 1024px) 100vw, 50vw"
                />
              </div>
            </div>

            <div className="mt-6 grid grid-cols-2 gap-3">
              {displayStats.map((s) => (
                <StatCard
                  key={s.label}
                  value={s.value}
                  label={s.label}
                  suffix={s.suffix}
                  variant="light"
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
