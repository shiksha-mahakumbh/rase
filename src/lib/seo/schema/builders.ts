import {
  EVENT_SCHEMA,
  ORGANIZATION_SCHEMA,
  SITE_NAME,
  SITE_URL,
} from "@/config/site";

const ORG_ID = `${SITE_URL}/#organization`;

type JsonLd = Record<string, unknown>;

function withContext(schema: JsonLd): JsonLd {
  return { "@context": "https://schema.org", ...schema };
}

/** Reference org by @id — avoids duplicate Organization JSON-LD on child pages */
export function orgReference() {
  return { "@id": ORG_ID };
}

export function buildEducationalOrganizationSchema(opts?: {
  name?: string;
  description?: string;
}): JsonLd {
  return withContext({
    "@type": "EducationalOrganization",
    "@id": ORG_ID,
    name: opts?.name ?? SITE_NAME,
    url: SITE_URL,
    logo: ORGANIZATION_SCHEMA.logo,
    sameAs: ORGANIZATION_SCHEMA.sameAs,
    description:
      opts?.description ??
      "National multidisciplinary education movement aligned with NEP 2020.",
  });
}

export function buildPersonSchema(person: {
  name: string;
  jobTitle?: string;
  worksFor?: string;
  url?: string;
}): JsonLd {
  return withContext({
    "@type": "Person",
    name: person.name,
    jobTitle: person.jobTitle,
    worksFor: person.worksFor
      ? { "@type": "Organization", name: person.worksFor }
      : undefined,
    url: person.url,
  });
}

export function buildCourseSchema(course: {
  name: string;
  description: string;
  provider?: string;
  url: string;
}): JsonLd {
  return withContext({
    "@type": "Course",
    name: course.name,
    description: course.description,
    provider: course.provider
      ? { "@type": "Organization", name: course.provider }
      : orgReference(),
    url: `${SITE_URL}${course.url}`,
  });
}

export function buildArticleSchema(article: {
  headline: string;
  description: string;
  path: string;
  datePublished?: string;
  author?: string;
}): JsonLd {
  return withContext({
    "@type": "Article",
    headline: article.headline,
    description: article.description,
    datePublished: article.datePublished,
    author: article.author
      ? { "@type": "Person", name: article.author }
      : undefined,
    mainEntityOfPage: `${SITE_URL}${article.path}`,
    publisher: orgReference(),
  });
}

export function buildNewsArticleSchema(article: {
  headline: string;
  description: string;
  path: string;
  datePublished?: string;
  image?: string;
}): JsonLd {
  return withContext({
    "@type": "NewsArticle",
    headline: article.headline,
    description: article.description,
    datePublished: article.datePublished,
    image: article.image ? `${SITE_URL}${article.image}` : undefined,
    mainEntityOfPage: `${SITE_URL}${article.path}`,
    publisher: {
      "@type": "Organization",
      name: SITE_NAME,
      logo: { "@type": "ImageObject", url: ORGANIZATION_SCHEMA.logo },
    },
  });
}

export function buildEventSchema(
  overrides: Partial<typeof EVENT_SCHEMA> & { "@type"?: string } = {}
): JsonLd {
  return withContext({
    ...EVENT_SCHEMA,
    "@type": overrides["@type"] ?? "Event",
    ...overrides,
  });
}

export function buildEducationEventSchema(opts: {
  name: string;
  description: string;
  path: string;
  startDate?: string;
  endDate?: string;
}): JsonLd {
  return withContext({
    "@type": "EducationEvent",
    name: opts.name,
    description: opts.description,
    url: `${SITE_URL}${opts.path}`,
    startDate: opts.startDate,
    endDate: opts.endDate,
    organizer: orgReference(),
  });
}

export function buildFaqSchema(
  items: { question: string; answer: string }[]
): JsonLd {
  return withContext({
    "@type": "FAQPage",
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: { "@type": "Answer", text: item.answer },
    })),
  });
}

export function buildBreadcrumbSchema(
  items: { name: string; path: string }[]
): JsonLd {
  return withContext({
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: `${SITE_URL}${item.path}`,
    })),
  });
}

export function buildResearchProjectSchema(project: {
  name: string;
  description: string;
  path: string;
}): JsonLd {
  return withContext({
    "@type": "ResearchProject",
    name: project.name,
    description: project.description,
    url: `${SITE_URL}${project.path}`,
    funder: orgReference(),
  });
}

export function buildEducationalOccupationalProgramSchema(program: {
  name: string;
  description: string;
  path: string;
}): JsonLd {
  return withContext({
    "@type": "EducationalOccupationalProgram",
    name: program.name,
    description: program.description,
    url: `${SITE_URL}${program.path}`,
    provider: orgReference(),
  });
}

export function buildCollectionPageSchema(opts: {
  name: string;
  description: string;
  path: string;
}): JsonLd {
  return withContext({
    "@type": "CollectionPage",
    name: opts.name,
    description: opts.description,
    url: `${SITE_URL}${opts.path}`,
    isPartOf: orgReference(),
  });
}

export function buildBookSchema(book: {
  id: string;
  name: string;
  description: string;
  pagePath: string;
  image?: string;
  datePublished?: string;
  isbn?: string;
  edition?: string;
  purchasePath?: string;
}): JsonLd {
  const pageUrl = `${SITE_URL}${book.pagePath}#${book.id}`;
  return withContext({
    "@type": "Book",
    "@id": pageUrl,
    name: book.name,
    description: book.description,
    url: pageUrl,
    mainEntityOfPage: pageUrl,
    inLanguage: "en-IN",
    image: book.image ? `${SITE_URL}${book.image}` : undefined,
    datePublished: book.datePublished,
    isbn: book.isbn,
    about: book.edition
      ? { "@type": "Event", name: `Shiksha Mahakumbh ${book.edition}` }
      : undefined,
    publisher: orgReference(),
    offers: book.purchasePath
      ? {
          "@type": "Offer",
          url: `${SITE_URL}${book.purchasePath}`,
          availability: "https://schema.org/InStock",
          description: "Contact Department of Holistic Education to request a copy.",
        }
      : undefined,
  });
}

export function buildItemListSchema(opts: {
  name: string;
  items: { name: string; url: string }[];
}): JsonLd {
  return withContext({
    "@type": "ItemList",
    name: opts.name,
    itemListElement: opts.items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      url: item.url.startsWith("http") ? item.url : `${SITE_URL}${item.url}`,
    })),
  });
}

export function buildWebPageSchema(opts: {
  name: string;
  description: string;
  path: string;
}): JsonLd {
  return withContext({
    "@type": "WebPage",
    name: opts.name,
    description: opts.description,
    url: `${SITE_URL}${opts.path}`,
    isPartOf: { "@type": "WebSite", name: SITE_NAME, url: SITE_URL },
    about: orgReference(),
  });
}

/** Directory / listing pages for people, institutions, etc. */
export function buildProfilePageSchema(opts: {
  name: string;
  description: string;
  path: string;
}): JsonLd {
  return withContext({
    "@type": "ProfilePage",
    name: opts.name,
    description: opts.description,
    url: `${SITE_URL}${opts.path}`,
    mainEntity: orgReference(),
  });
}

export function buildDatasetSchema(opts: {
  name: string;
  description: string;
  path: string;
}): JsonLd {
  return withContext({
    "@type": "Dataset",
    name: opts.name,
    description: opts.description,
    url: `${SITE_URL}${opts.path}`,
    creator: orgReference(),
  });
}

export function buildScholarlyArticleSchema(article: {
  headline: string;
  description: string;
  path: string;
  datePublished?: string;
  author?: string;
}): JsonLd {
  return withContext({
    "@type": "ScholarlyArticle",
    headline: article.headline,
    description: article.description,
    datePublished: article.datePublished,
    author: article.author
      ? { "@type": "Person", name: article.author }
      : undefined,
    mainEntityOfPage: `${SITE_URL}${article.path}`,
    publisher: orgReference(),
  });
}
