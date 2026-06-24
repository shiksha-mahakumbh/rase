import Image from "next/image";
import Link from "next/link";
import { CtaButton } from "@/components/ui";
import { ROUTES } from "@/constants/routes";
import { CMT_SUBMISSION_URL } from "@/lib/registration/config";
import type { HeroContent } from "@/lib/home/build-hero-content";
import CountdownBannerView from "./CountdownBannerView";

function HeroStats({ stats }: { stats: HeroContent["stats"] }) {
  return (
    <div className="mt-6 grid grid-cols-2 gap-3">
      {stats.map((s) => (
        <div
          key={s.label}
          className="rounded-2xl border border-brand-saffron/20 bg-white p-4 shadow-md shadow-brand-saffron/5 md:p-5"
        >
          <p className="text-2xl font-extrabold text-brand-navy md:text-3xl">
            {s.value.toLocaleString("en-IN")}
            {s.suffix}
          </p>
          <p className="mt-1 text-xs font-medium uppercase tracking-wide text-slate-500 md:text-sm">
            {s.label}
          </p>
        </div>
      ))}
    </div>
  );
}

export default function HeroSection({ content }: { content: HeroContent }) {
  const {
    headline,
    subheadline,
    description,
    badge,
    dates,
    venue,
    heroImage,
    stats,
  } = content;

  return (
    <section
      aria-label="Shiksha Mahakumbh hero"
      className="brand-hero-bg relative overflow-hidden"
    >
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

            <h1 className="mt-5 font-devanagari text-3xl font-extrabold leading-tight sm:text-4xl md:text-5xl">
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

            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center sm:justify-center lg:justify-start">
              <CtaButton href={ROUTES.registration} variant="primary">
                Register Now
              </CtaButton>
              <CtaButton href={CMT_SUBMISSION_URL} variant="secondary">
                Multi Track Conference
              </CtaButton>
              <Link
                href="/abhiyaninphotoframe"
                className="text-center text-sm font-semibold text-brand-navy underline decoration-brand-saffron/40 underline-offset-2 transition hover:text-brand-saffron focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-saffron sm:text-left"
              >
                Abhiyan Photo Frame →
              </Link>
            </div>

            <div className="mt-8">
              <CountdownBannerView theme="light" />
            </div>
          </div>

          <div className="order-1 lg:order-2">
            <div className="relative mx-auto max-w-lg lg:max-w-none">
              <div
                className="absolute -inset-3 rounded-3xl bg-gradient-to-br from-brand-saffron/30 via-white to-brand-blue/20 blur-sm"
                aria-hidden
              />
              <div className="relative overflow-hidden rounded-2xl border-2 border-white bg-white p-2 shadow-[0_20px_60px_rgba(255,153,51,0.18)]">
                <div className="relative aspect-[4/3] w-full">
                  <Image
                    src={heroImage}
                    alt="Shiksha Mahakumbh Abhiyan — Department of Holistic Education"
                    fill
                    className="rounded-xl object-contain"
                    priority
                    fetchPriority="high"
                    unoptimized
                    sizes="(max-width: 1024px) 100vw, 50vw"
                  />
                </div>
              </div>
            </div>

            <HeroStats stats={stats} />
          </div>
        </div>
      </div>
    </section>
  );
}
