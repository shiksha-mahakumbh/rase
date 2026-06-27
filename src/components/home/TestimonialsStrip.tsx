import Link from "next/link";
import { SectionHeader } from "@/components/ui";
import { ROUTES } from "@/constants/routes";

export default function TestimonialsStrip() {
  return (
    <section
      id="testimonials"
      className="border-y border-brand-saffron/15 bg-white py-12 md:py-14"
      aria-label="Messages of support"
    >
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        <SectionHeader
          eyebrow="Voices of Support"
          title="Best Wishes from Leaders & Institutions"
          description="Dignitaries, educators, and institutions share messages for Shiksha Mahakumbh Abhiyan."
        />
        <div className="mt-8 flex flex-wrap justify-center gap-4">
          <Link
            href={ROUTES.bestWishes}
            className="inline-flex min-h-[48px] items-center justify-center rounded-xl bg-brand-navy px-6 py-3 text-sm font-bold text-white hover:bg-brand-navy-light"
          >
            Read best wishes
          </Link>
          <Link
            href={ROUTES.speakers}
            className="inline-flex min-h-[48px] items-center justify-center rounded-xl border-2 border-brand-saffron px-6 py-3 text-sm font-bold text-brand-saffron"
          >
            Speakers directory
          </Link>
          <Link
            href="/introduction#leadership"
            className="inline-flex min-h-[48px] items-center justify-center rounded-xl border border-slate-200 px-6 py-3 text-sm font-bold text-brand-navy hover:border-brand-saffron/40"
          >
            Leadership & vision
          </Link>
        </div>
      </div>
    </section>
  );
}
