"use client";

import { SectionHeader } from "@/components/ui";
import { useCms } from "@/lib/cms/context";
import { getSection, sectionItems } from "@/lib/cms/utils";

const DEFAULT_TESTIMONIALS = [
  {
    quote:
      "Shiksha Mahakumbh brings together policy, practice, and research in a way few national platforms achieve.",
    author: "Academic Delegate",
    role: "Higher Education Institution",
  },
  {
    quote:
      "The multi-track conclaves and olympiads create real opportunities for students beyond classroom learning.",
    author: "School Coordinator",
    role: "Vidya Bharati Network",
  },
  {
    quote:
      "A credible, well-organised summit aligned with NEP 2020 and Bharat's education vision.",
    author: "Research Scholar",
    role: "Paper Presenter",
  },
];

export default function TestimonialsSection() {
  const cms = useCms();
  const section = getSection(cms?.homepage, "testimonials");
  const testimonials = sectionItems<{
    quote: string;
    author?: string;
    name?: string;
    role?: string;
  }>(section);
  const items = testimonials.length
    ? testimonials.map((t) => ({
        quote: t.quote,
        author: t.author ?? t.name ?? "Participant",
        role: t.role ?? "",
      }))
    : DEFAULT_TESTIMONIALS;

  return (
    <section className="bg-gradient-to-b from-brand-surface to-white py-12 md:py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeader
          eyebrow={section?.title ?? "Impact Stories"}
          title="What Participants Say"
          description="Trust built through five editions of national and international participation."
        />
        <div className="grid gap-4 md:grid-cols-3">
          {items.map((t) => (
            <blockquote
              key={`${t.author}-${t.quote.slice(0, 20)}`}
              className="flex h-full flex-col rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
            >
              <p className="flex-1 text-sm italic leading-relaxed text-slate-700 md:text-base">
                &ldquo;{t.quote}&rdquo;
              </p>
              <footer className="mt-4 border-t border-slate-100 pt-3">
                <cite className="not-italic">
                  <span className="block text-sm font-bold text-brand-navy">{t.author}</span>
                  {t.role && <span className="text-xs text-slate-500">{t.role}</span>}
                </cite>
              </footer>
            </blockquote>
          ))}
        </div>
      </div>
    </section>
  );
}
