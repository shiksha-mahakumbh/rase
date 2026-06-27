import Link from "next/link";
import { CtaButton } from "@/components/ui";
import { ROUTES } from "@/constants/routes";
import { academicCouncilHash } from "@/lib/home/home-link-targets";
import type { HeroContent } from "@/lib/home/build-hero-content";
import CountdownBannerView from "./CountdownBannerView";
import HeroLcpImage from "./HeroLcpImage";

function HeroStats({ stats }: { stats: HeroContent["stats"] }) {
  return (
    <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3">
      {stats.map((s) => {
        const inner = (
          <>
            <p className="text-2xl font-extrabold text-brand-navy md:text-3xl">
              {s.value.toLocaleString("en-IN")}
              {s.suffix}
            </p>
            <p className="mt-1 text-xs font-medium uppercase tracking-wide text-slate-500 md:text-sm">
              {s.label}
            </p>
          </>
        );
        const className =
          "min-h-[5.5rem] rounded-2xl border border-brand-saffron/20 bg-white p-4 shadow-md shadow-brand-saffron/5 transition hover:border-brand-saffron/40 hover:shadow-lg md:p-5";

        if (s.href) {
          return (
            <Link key={s.label} href={s.href} className={`block ${className}`}>
              {inner}
            </Link>
          );
        }

        return (
          <div key={s.label} className={className}>
            {inner}
          </div>
        );
      })}
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
      className="brand-hero-bg relative min-h-[24rem] overflow-hidden sm:min-h-[26rem] lg:min-h-[30rem]"
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
                  <span className="text-orange-800">महाकुंभ</span>
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
                {content.cta?.register ?? "Register Now"}
              </CtaButton>
              <CtaButton href={academicCouncilHash("conference")} variant="secondary">
                {content.cta?.conference ?? "Multi Track Conference"}
              </CtaButton>
              <Link
                href={ROUTES.donation}
                className="inline-flex min-h-[44px] items-center justify-center rounded-xl border-2 border-brand-navy/15 px-5 py-2.5 text-sm font-bold text-brand-navy transition hover:border-brand-saffron/40 hover:text-brand-saffron"
              >
                {content.cta?.donation ?? "Support via Donation"}
              </Link>
              <Link
                href="/abhiyaninphotoframe"
                className="text-center text-sm font-semibold text-brand-navy underline decoration-brand-saffron/40 underline-offset-2 transition hover:text-brand-saffron focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-saffron sm:text-left"
              >
                {content.cta?.photoFrame ?? "Abhiyan Photo Frame →"}
              </Link>
            </div>

            <div className="mt-8">
              <CountdownBannerView theme="light" labels={content.countdown} />
            </div>
          </div>

          <div className="order-1 lg:order-2">
            <div className="relative mx-auto w-full max-w-xl lg:max-w-none">
              <div
                className="absolute -inset-3 rounded-3xl bg-gradient-to-br from-brand-saffron/30 via-white to-brand-blue/20 blur-sm"
                aria-hidden
              />
              <div className="relative rounded-2xl border-2 border-white bg-white p-3 shadow-[0_20px_60px_rgba(255,153,51,0.18)]">
                <div className="relative aspect-[1024/534] w-full">
                  <HeroLcpImage
                    src={heroImage}
                    alt="Shiksha Mahakumbh Abhiyan — Department of Holistic Education"
                    className="absolute inset-0 h-full w-full rounded-xl"
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
