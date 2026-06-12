"use client";

import { useState } from "react";
import { SectionHeader } from "@/components/ui";
import { ROUTES } from "@/constants/routes";
import Link from "next/link";
import { useCms } from "@/lib/cms/context";
import { extractFaqsFromCmsData } from "@/lib/cms/faq";
import { getSection, sectionField } from "@/lib/cms/utils";

const DEFAULT_FAQS = [
  {
    question: "What is Shiksha Mahakumbh Abhiyan?",
    answer:
      "A national–international multidisciplinary education movement hosted across editions at premier institutions, aligned with NEP 2020 and Bharat@2047.",
  },
  {
    question: "How do I register for the 6th edition?",
    answer:
      "Use the unified registration portal for delegates, conclaves, olympiads, awards, exhibitions, and accommodation requests.",
    registerLink: true,
  },
  {
    question: "When and where is SMK 6.0?",
    answer: "9–11 October 2026 at NIT Hamirpur, Himachal Pradesh, India.",
  },
  {
    question: "How do I submit a research paper?",
    answer: "Visit the abstract submission page for guidelines, deadlines, and the peer-review process.",
    abstractLink: true,
  },
  {
    question: "Is accommodation available?",
    answer: "Yes — select accommodation during registration; the organising team confirms availability.",
  },
] as const;

export default function HomeFaqSection() {
  const cms = useCms();
  const section = getSection(cms?.homepage, "stats");
  const cmsFaqs = extractFaqsFromCmsData(cms);
  const faqs =
    cmsFaqs.length > 0
      ? cmsFaqs
      : DEFAULT_FAQS.map((f) => ({
          question: f.question,
          answer: f.answer,
        }));

  const [open, setOpen] = useState<number | null>(0);

  return (
    <section className="bg-brand-surface py-12 md:py-16" aria-label="Frequently asked questions">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        <SectionHeader
          eyebrow="FAQ"
          title={sectionField(section, "faqTitle", "Common Questions")}
          description={sectionField(
            section,
            "faqSubtitle",
            "Quick answers before you register or submit your paper."
          )}
        />
        <div className="space-y-3">
          {faqs.map((faq, i) => (
            <div
              key={faq.question}
              className="overflow-hidden rounded-xl border border-slate-200 bg-white"
            >
              <button
                type="button"
                className="flex min-h-[44px] w-full items-center justify-between gap-4 px-4 py-4 text-left font-semibold text-brand-navy focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-saffron md:px-5"
                aria-expanded={open === i}
                aria-controls={`faq-panel-${i}`}
                id={`faq-trigger-${i}`}
                onClick={() => setOpen(open === i ? null : i)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    setOpen(open === i ? null : i);
                  }
                }}
              >
                {faq.question}
                <span className="text-brand-saffron" aria-hidden>
                  {open === i ? "−" : "+"}
                </span>
              </button>
              {open === i && (
                <p
                  id={`faq-panel-${i}`}
                  role="region"
                  aria-labelledby={`faq-trigger-${i}`}
                  className="border-t border-slate-100 px-4 pb-4 text-sm leading-relaxed text-slate-600 md:px-5"
                >
                  {faq.answer}
                  {faq.question.includes("register") && (
                    <>
                      {" "}
                      <Link
                        href={ROUTES.registration}
                        className="font-semibold text-brand-navy underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-saffron"
                      >
                        Register here
                      </Link>
                      .
                    </>
                  )}
                  {faq.question.includes("research paper") && (
                    <>
                      {" "}
                      <Link
                        href="/abstract"
                        className="font-semibold text-brand-navy underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-saffron"
                      >
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
