"use client";

import Image from "next/image";
import { CtaButton, StatCard } from "@/components/ui";
import { event, impactStats } from "@/design/tokens";
import { ROUTES } from "@/constants/routes";
import CountdownBanner from "./CountdownBanner";

export default function HeroSection() {
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
              {event.name} · Registration Open
            </span>

            <h1 className="mt-4 text-3xl font-extrabold leading-tight text-white sm:text-4xl md:text-5xl lg:text-[3.25rem]">
              शिक्षा महाकुंभ अभियान
              <span className="mt-2 block text-2xl font-bold text-brand-saffron sm:text-3xl">
                A National Movement for Global Education
              </span>
            </h1>

            <p className="mt-4 max-w-xl text-base leading-relaxed text-white/90 md:text-lg lg:mx-0 mx-auto">
              Join policymakers, researchers, institutions, and youth at India&apos;s
              premier multidisciplinary education summit — aligned with{" "}
              <strong className="text-white">NEP 2020</strong> and the{" "}
              <strong className="text-white">Bharat@2047</strong> vision.
            </p>

            <div className="mt-6 flex flex-wrap items-center justify-center gap-2 text-sm text-white/80 lg:justify-start">
              <span className="rounded-lg bg-white/10 px-3 py-1.5 font-semibold">
                📅 9–11 October 2026
              </span>
              <span className="rounded-lg bg-white/10 px-3 py-1.5 font-semibold">
                📍 {event.venue}, HP
              </span>
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
                src="/shiksha.png"
                alt="Shiksha Mahakumbh Abhiyan"
                fill
                className="object-contain p-6"
                priority
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
            </div>
            <div className="mt-4 grid grid-cols-2 gap-3">
              {impactStats.map((s) => (
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
