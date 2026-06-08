"use client";

import { CtaButton } from "@/components/ui";
import { ROUTES } from "@/constants/routes";

export default function PageCtaSection() {
  return (
    <section
      aria-labelledby="page-cta-heading"
      className="border-t border-slate-200/80 bg-white px-4 py-12 md:px-8 md:py-16"
    >
      <div className="mx-auto max-w-7xl text-center">
        <h2
          id="page-cta-heading"
          className="home-section-title text-2xl md:text-3xl"
        >
          Join Shiksha Mahakumbh 6.0
        </h2>
        <p className="mx-auto mt-3 max-w-2xl text-base text-slate-600 md:text-lg">
          Register for India&apos;s premier multidisciplinary education summit —
          aligned with NEP 2020 and Bharat@2047.
        </p>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <CtaButton href={ROUTES.registration} variant="primary">
            Register Now
          </CtaButton>
          <CtaButton href={ROUTES.contact} variant="ghost">
            Contact Us
          </CtaButton>
        </div>
      </div>
    </section>
  );
}
