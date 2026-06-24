"use client";

import Image from "next/image";
import Link from "next/link";
import { CtaButton } from "@/components/ui";
import { ROUTES } from "@/constants/routes";

const PILLARS = [
  {
    title: "NEP 2020",
    subtitle: "Policy & Implementation",
    color: "from-brand-blue to-brand-blue-light",
    href: "/introduction",
  },
  {
    title: "Research",
    subtitle: "Papers & Proceedings",
    color: "from-brand-saffron to-brand-saffron-dark",
    href: "/proceedings",
  },
  {
    title: "Olympiads",
    subtitle: "Talent & Excellence",
    color: "from-brand-emerald to-emerald-600",
    href: ROUTES.registration,
  },
  {
    title: "Conclaves",
    subtitle: "7 Thematic Forums",
    color: "from-brand-violet to-brand-violet-light",
    href: "/committees",
  },
];

export default function BrandShowcaseSection() {
  return (
    <section
      aria-label="Shiksha Mahakumbh brand vision"
      className="border-y border-brand-saffron/20 bg-white py-12 md:py-16"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid items-center gap-10 lg:grid-cols-2">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-brand-saffron-dark">
              Department of Holistic Education
            </p>
            <h2 className="mt-2 text-2xl font-extrabold text-brand-navy md:text-3xl">
              Where Bharatiya wisdom meets{" "}
              <span className="text-brand-blue">modern science</span>
            </h2>
            <p className="mt-4 text-base leading-relaxed text-slate-600">
              From ISRO&apos;s reach to the call of the conch — Shiksha Mahakumbh Abhiyan celebrates
              holistic education that is vibrant, inclusive, and globally relevant. Our visual identity
              reflects energy, tradition, and forward-looking innovation.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <CtaButton href={ROUTES.registration} variant="primary">
                Join the movement
              </CtaButton>
              <CtaButton href="/past-events" variant="ghost">
                Explore past editions
              </CtaButton>
            </div>
          </div>

          <div className="relative">
            <Image
              src="/2024M/Press7.jpg"
              alt="Inauguration of Shiksha Mahakumbh — national education summit"
              width={640}
              height={480}
              className="relative z-10 w-full rounded-2xl shadow-xl"
              sizes="(max-width: 1024px) 100vw, 50vw"
            />
          </div>
        </div>

        <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {PILLARS.map((p) => (
            <Link
              key={p.title}
              href={p.href}
              className="group overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
            >
              <div className={`h-2 bg-gradient-to-r ${p.color}`} />
              <div className="p-5">
                <h3 className="text-lg font-bold text-brand-navy group-hover:text-brand-saffron">
                  {p.title}
                </h3>
                <p className="mt-1 text-sm text-slate-500">{p.subtitle}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
