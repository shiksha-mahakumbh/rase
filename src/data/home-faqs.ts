import type { FaqItem } from "@/lib/cms/faq";
import { SITE_URL } from "@/config/site";

export const HOME_DEFAULT_FAQS: FaqItem[] = [
  {
    question: "What is Shiksha Mahakumbh Abhiyan?",
    answer:
      "A national–international multidisciplinary education movement aligned with NEP 2020 and Bharat@2047.",
  },
  {
    question: "When is Shiksha Mahakumbh 6.0?",
    answer: "9–11 October 2026 at NIT Hamirpur, Himachal Pradesh, India.",
  },
  {
    question: "How do I register for the 6th edition?",
    answer:
      "Use the unified registration portal for delegates, conclaves, olympiads, awards, exhibitions, and accommodation requests.",
  },
  {
    question: "How do I submit to the Multi Track Conference?",
    answer:
      "Use the official Microsoft CMT portal for paper and abstract submissions, deadlines, and peer review.",
  },
  {
    question: "Is accommodation available?",
    answer:
      "Yes — select accommodation during registration; the organising team confirms availability.",
  },
  {
    question: "How do I register?",
    answer: `Register online at ${SITE_URL}/registration`,
  },
];
