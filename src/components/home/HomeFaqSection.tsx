"use client";

import { useState } from "react";
import Link from "next/link";
import { SectionHeader } from "@/components/ui";
import { ROUTES } from "@/constants/routes";
import { CMT_SUBMISSION_URL } from "@/lib/registration/config";
import { useCms } from "@/lib/cms/context";
import { extractFaqsFromCmsData } from "@/lib/cms/faq";
import { getSection, sectionField } from "@/lib/cms/utils";
import { HOME_DEFAULT_FAQS } from "@/data/home-faqs";

export default function HomeFaqSection() {
  const cms = useCms();
  const section = getSection(cms?.homepage, "stats");
  const cmsFaqs = extractFaqsFromCmsData(cms);
  const faqs = cmsFaqs.length > 0 ? cmsFaqs : HOME_DEFAULT_FAQS;

  const [open, setOpen] = useState<number | null>(0);

  return (
    <section id="faq" className="bg-brand-surface py-12 md:py-16" aria-label="Frequently asked questions">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        <SectionHeader
          eyebrow="FAQ"
          title={sectionField(section, "faqTitle", "Common Questions")}
          description={sectionField(
            section,
            "faqSubtitle",
            "Quick answers before you register or submit to the Multi Track Conference."
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
                  {faq.question.toLowerCase().includes("register") && (
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
                  {(faq.question.includes("Multi Track Conference") ||
                    faq.question.includes("research paper")) && (
                    <>
                      {" "}
                      <a
                        href={CMT_SUBMISSION_URL}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="font-semibold text-brand-navy underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-saffron"
                      >
                        Multi Track Conference (CMT)
                      </a>
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
