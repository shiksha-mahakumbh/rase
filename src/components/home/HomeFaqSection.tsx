"use client";

import { useState } from "react";
import { SectionHeader } from "@/components/ui";
import { ROUTES } from "@/constants/routes";
import Link from "next/link";

const faqs = [
  {
    q: "What is Shiksha Mahakumbh Abhiyan?",
    a: "A national–international multidisciplinary education movement hosted across editions at premier institutions, aligned with NEP 2020 and Bharat@2047.",
  },
  {
    q: "How do I register for the 6th edition?",
    a: "Use the unified registration portal for delegates, conclaves, olympiads, awards, exhibitions, and accommodation requests.",
  },
  {
    q: "When and where is SMK 6.0?",
    a: "9–11 October 2026 at NIT Hamirpur, Himachal Pradesh, India.",
  },
  {
    q: "How do I submit a research paper?",
    a: "Visit the abstract submission page for guidelines, deadlines, and the peer-review process.",
  },
  {
    q: "Is accommodation available?",
    a: "Yes — select accommodation during registration; the organising team confirms availability.",
  },
];

export default function HomeFaqSection() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section className="bg-brand-surface py-12 md:py-16" aria-label="Frequently asked questions">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        <SectionHeader
          eyebrow="FAQ"
          title="Common Questions"
          description="Quick answers before you register or submit your paper."
        />
        <div className="space-y-3">
          {faqs.map((faq, i) => (
            <div
              key={faq.q}
              className="overflow-hidden rounded-xl border border-slate-200 bg-white"
            >
              <button
                type="button"
                className="flex w-full min-h-[44px] items-center justify-between gap-4 px-4 py-4 text-left font-semibold text-brand-navy md:px-5"
                aria-expanded={open === i}
                onClick={() => setOpen(open === i ? null : i)}
              >
                {faq.q}
                <span className="text-brand-saffron" aria-hidden>
                  {open === i ? "−" : "+"}
                </span>
              </button>
              {open === i && (
                <p className="border-t border-slate-100 px-4 pb-4 text-sm leading-relaxed text-slate-600 md:px-5">
                  {faq.a}
                  {i === 1 && (
                    <>
                      {" "}
                      <Link
                        href={ROUTES.registration}
                        className="font-semibold text-brand-navy underline"
                      >
                        Register here
                      </Link>
                      .
                    </>
                  )}
                  {i === 3 && (
                    <>
                      {" "}
                      <Link href="/abstract" className="font-semibold text-brand-navy underline">
                        Submit abstract
                      </Link>
                      .
                    </>
                  )}
                </p>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
