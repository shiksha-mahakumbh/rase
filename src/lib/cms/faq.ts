import type { CmsFaqItem, CmsHomepage, CmsPageData } from "./types";
import { getSection, sectionItems } from "./utils";

export type FaqItem = { question: string; answer: string };

export function extractHomepageFaqs(
  homepage: CmsHomepage | null | undefined,
  featuredFaqs?: CmsFaqItem[]
): FaqItem[] {
  if (featuredFaqs?.length) {
    return featuredFaqs.map((faq) => ({
      question: faq.question,
      answer: faq.answer,
    }));
  }

  const stats = getSection(homepage, "stats");
  const raw = sectionItems<{
    question?: string;
    answer?: string;
    q?: string;
    a?: string;
  }>(stats, "faqs");

  return raw
    .map((item) => ({
      question: item.question ?? item.q ?? "",
      answer: item.answer ?? item.a ?? "",
    }))
    .filter((item) => item.question && item.answer);
}

export function extractFaqsFromCmsData(cms: CmsPageData | null | undefined): FaqItem[] {
  if (!cms) return [];
  return extractHomepageFaqs(cms.homepage, cms.featuredFaqs);
}

export function buildFaqPageSchema(faqs: FaqItem[]) {
  if (!faqs.length) return null;
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  };
}
