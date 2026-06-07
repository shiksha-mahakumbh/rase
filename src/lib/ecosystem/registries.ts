import { CONTENT_REGISTRY } from "@/lib/content/registry";
import { featuredSpeakers } from "@/data/authority-speakers";
import { successStories } from "@/data/authority";
import { contentItemToEcosystem, type EcosystemItem } from "./types";

const experts: EcosystemItem[] = [
  {
    id: "expert-nep",
    slug: "expert-nep",
    kind: "expert",
    title: "NEP 2020 Implementation Panel",
    excerpt: "National experts on policy translation in higher education.",
    tags: ["NEP", "policy", "expert"],
    category: "policy",
    publishedAt: "2025-06-01",
    href: "/introduction",
    organization: "Academic Council",
    role: "Policy",
    featured: true,
  },
  {
    id: "expert-iks",
    slug: "expert-iks",
    kind: "expert",
    title: "Indian Knowledge Systems",
    excerpt: "Scholars integrating IKS across curricula and research tracks.",
    tags: ["IKS", "expert"],
    category: "insight",
    publishedAt: "2025-05-01",
    href: "/departments/academic-council",
    organization: "SMK 6.0",
  },
];

const publications: EcosystemItem[] = [
  {
    id: "pub-proceedings",
    slug: "proceedings",
    kind: "publication",
    title: "Conference Proceedings",
    excerpt: "Multi-volume proceedings from Shiksha Mahakumbh editions.",
    tags: ["proceedings", "publication"],
    category: "research",
    publishedAt: "2024-06-01",
    href: "/proceedings",
    featured: true,
  },
  {
    id: "pub-books",
    slug: "books",
    kind: "publication",
    title: "Books & Compendiums",
    excerpt: "Best practices compendium and affiliated publications.",
    tags: ["books", "publication"],
    category: "research",
    publishedAt: "2024-01-01",
    href: "/books",
  },
  {
    id: "pub-journals",
    slug: "journals",
    kind: "publication",
    title: "Viksit Bharat Journals",
    excerpt: "Peer-reviewed outlets for education and development research.",
    tags: ["journal", "publication"],
    category: "research",
    publishedAt: "2024-01-01",
    href: "/journals",
  },
];

const caseStudies: EcosystemItem[] = [
  {
    id: "case-smk60-registration",
    slug: "smk60-national-registration",
    kind: "case-study",
    title: "SMK 6.0 National Registration Gateway",
    excerpt:
      "Unified registration for delegates, conclaves, olympiads, and awards with SMK2026 IDs and admin export.",
    tags: ["registration", "case-study", "SMK 6.0"],
    category: "insight",
    publishedAt: "2026-01-01",
    href: "/registration",
    featured: true,
  },
  {
    id: "case-olympiad",
    slug: "case-olympiad",
    kind: "case-study",
    title: "DHE Olympiad Scale-up",
    excerpt: "School-level olympiad reaching 10,000+ students nationally.",
    tags: ["olympiad", "case-study", "schools"],
    category: "insight",
    publishedAt: "2024-09-01",
    href: "/departments/academic-council",
  },
  {
    id: "case-conclave",
    slug: "case-conclave",
    kind: "case-study",
    title: "VC Conclave Policy Charter",
    excerpt: "Multi-stakeholder conclave producing actionable higher-ed recommendations.",
    tags: ["conclave", "case-study"],
    category: "policy",
    publishedAt: "2024-12-01",
    href: "/conclave",
  },
];

const speakers: EcosystemItem[] = featuredSpeakers.map((s, i) => ({
  id: `speaker-${i}-${s.name.replace(/\s/g, "-").toLowerCase()}`,
  slug: s.name.replace(/\s/g, "-").toLowerCase(),
  kind: "speaker" as const,
  title: s.name,
  excerpt: `${s.title} · ${s.organization}${s.topic ? ` — ${s.topic}` : ""}`,
  tags: ["speaker", s.edition ?? "SMK"].filter(Boolean) as string[],
  category: "insight" as const,
  publishedAt: "2026-01-01",
  href: "/introduction#speakers",
  organization: s.organization,
  role: s.title,
  image: s.imageSrc,
  featured: i < 2,
}));

const storyItems: EcosystemItem[] = successStories.map((s, i) => ({
  id: `story-${i}`,
  slug: `success-story-${i}`,
  kind: "success-story" as const,
  title: s.author,
  excerpt: s.quote,
  tags: ["success-story", s.role, s.edition ?? ""].filter(Boolean) as string[],
  category: "insight" as const,
  publishedAt: "2025-01-01",
  href: "/introduction#stories",
  role: s.role,
}));

const hubItems = CONTENT_REGISTRY.map((c) => contentItemToEcosystem(c));

export const ECOSYSTEM_REGISTRY: EcosystemItem[] = [
  ...hubItems,
  ...speakers,
  ...experts,
  ...publications,
  ...caseStudies,
  ...storyItems,
];

export function getRegistryByKind(kind: EcosystemItem["kind"]) {
  return ECOSYSTEM_REGISTRY.filter((i) => i.kind === kind);
}
