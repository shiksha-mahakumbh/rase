import type { Metadata } from "next";
import { createPageMetadata } from "@/lib/seo/metadata";
import { DEFAULT_OG_IMAGE, SITE_NAME, SITE_URL } from "@/config/site";

type BaseOpts = {
  title: string;
  description: string;
  path: string;
  keywords?: string[];
  noIndex?: boolean;
  image?: string;
};

function buildMetadata(
  opts: BaseOpts,
  openGraphType: "website" | "article" | "book"
): Metadata {
  const base = createPageMetadata({
    title: opts.title,
    description: opts.description,
    path: opts.path,
    keywords: opts.keywords,
    noIndex: opts.noIndex,
  });

  const image = opts.image ?? DEFAULT_OG_IMAGE;
  const url = `${SITE_URL}${opts.path}`;

  return {
    ...base,
    openGraph: {
      ...(typeof base.openGraph === "object" ? base.openGraph : {}),
      type: openGraphType,
      url,
      images: [{ url: image, width: 512, height: 512, alt: opts.title }],
    },
  };
}

/** Events, summits, workshops */
export function createEventMetadata(opts: {
  title: string;
  description: string;
  path: string;
  startDate?: string;
  endDate?: string;
  location?: string;
  keywords?: string[];
  noIndex?: boolean;
}): Metadata {
  return buildMetadata(
    {
      title: opts.title,
      description: opts.description,
      path: opts.path,
      keywords: opts.keywords,
      noIndex: opts.noIndex,
    },
    "website"
  );
}

/** Press releases and news articles */
export function createArticleMetadata(opts: {
  title: string;
  description: string;
  path: string;
  publishedTime?: string;
  author?: string;
  keywords?: string[];
  noIndex?: boolean;
  image?: string;
}): Metadata {
  const meta = buildMetadata(
    {
      title: opts.title,
      description: opts.description,
      path: opts.path,
      keywords: opts.keywords,
      noIndex: opts.noIndex,
      image: opts.image,
    },
    "article"
  );

  if (opts.publishedTime && typeof meta.openGraph === "object") {
    return {
      ...meta,
      openGraph: {
        ...meta.openGraph,
        type: "article",
        publishedTime: opts.publishedTime,
        authors: opts.author ? [opts.author] : undefined,
      },
    };
  }

  return meta;
}

/** Committee and organising body pages */
export function createCommitteeMetadata(opts: {
  title: string;
  description: string;
  path: string;
  edition?: string;
  keywords?: string[];
}): Metadata {
  const title = opts.edition
    ? `${opts.title} — ${opts.edition}`
    : opts.title;

  return buildMetadata(
    {
      title,
      description: opts.description,
      path: opts.path,
      keywords: [
        ...(opts.keywords ?? []),
        "organising committee",
        "Shiksha Mahakumbh",
        opts.edition ?? "",
      ].filter(Boolean),
    },
    "website"
  );
}

/** Proceedings, journals, books */
export function createPublicationMetadata(opts: {
  title: string;
  description: string;
  path: string;
  publicationType?: "Proceedings" | "Journal" | "Book" | "Paper";
  isbn?: string;
  keywords?: string[];
  image?: string;
}): Metadata {
  return buildMetadata(
    {
      title: opts.title,
      description: opts.description,
      path: opts.path,
      keywords: opts.keywords,
      image: opts.image,
    },
    opts.publicationType === "Book" ? "website" : "article"
  );
}

export function createNoIndexMetadata(opts: {
  title: string;
  path: string;
}): Metadata {
  return {
    title: `${opts.title} | ${SITE_NAME}`,
    robots: { index: false, follow: false, nocache: true },
    alternates: { canonical: `${SITE_URL}${opts.path}` },
  };
}

/** Redirect-only shells — keep out of index but pass link equity (Phase 6) */
export function createRedirectShellMetadata(opts: {
  title: string;
  path: string;
}): Metadata {
  return {
    title: `${opts.title} | ${SITE_NAME}`,
    robots: { index: false, follow: true },
    alternates: { canonical: `${SITE_URL}${opts.path}` },
  };
}
