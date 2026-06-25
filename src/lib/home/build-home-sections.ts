import type { CmsHomepage } from "@/lib/cms/types";
import { getSection, sectionField, sectionItems } from "@/lib/cms/utils";
import { ROUTES } from "@/constants/routes";
import { CMT_SUBMISSION_URL, cmtSubmissionDateLabel } from "@/lib/registration/config";
import { sanitizeExternalUrl } from "@/lib/security/safe-external-url";

export type TrustStripLogo = { src: string; alt: string; href: string };

export type TrustStripContent = {
  tagline: string;
  logos: TrustStripLogo[];
};

export type WhyAttendFeature = {
  title: string;
  description: string;
  badge?: string;
};

export type WhyAttendContent = {
  eyebrow: string;
  title: string;
  description: string;
  features: WhyAttendFeature[];
};

export type DiscoverInsight = {
  title: string;
  date: string;
  author: string;
  href: string;
  tag: string;
  accent: string;
  tagBg: string;
  imageSrc: string;
  imageAlt: string;
  external: boolean;
};

export type DiscoverContent = {
  eyebrow: string;
  title: string;
  description: string;
  insights: DiscoverInsight[];
};

export type EventTrack = {
  title: string;
  date: string;
  venue: string;
  description: string;
  href: string;
  badge: string;
};

export type EventTracksContent = {
  eyebrow: string;
  title: string;
  description: string;
  tracks: EventTrack[];
};

const ORGANIZING_LOGOS: TrustStripLogo[] = [
  { src: "/logo.png", alt: "Department of Holistic Education", href: "https://www.dhe.org.in/" },
  { src: "/vidyabharti.png", alt: "Vidya Bharati", href: "https://www.vidyabharati.org/" },
  { src: "/shiksha.png", alt: "Shiksha Mahakumbh", href: "https://www.shikshamahakumbh.com/" },
  { src: "/sLogo.png", alt: "RASE", href: "https://www.rase.co.in/" },
];

const DEFAULT_WHY_ATTEND: WhyAttendFeature[] = [
  {
    title: "Policy & NEP 2020",
    description:
      "Engage with national education policy, implementation frameworks, and institutional roadmaps.",
    badge: "Impact",
  },
  {
    title: "Research & Publications",
    description:
      "Present abstracts, full papers, and proceedings aligned with Indian and global education research.",
    badge: "Academic",
  },
  {
    title: "Innovation & Startups",
    description:
      "Showcase projects, exhibitions, and entrepreneurial ideas from schools and higher education.",
    badge: "Innovation",
  },
  {
    title: "Olympiads & Talent",
    description:
      "Compete in olympiads, talent conclaves, and cultural programmes celebrating student excellence.",
  },
  {
    title: "Conclaves & Workshops",
    description:
      "Multi-track conclaves on holistic education, best practices, and Bharatiya knowledge systems.",
  },
  {
    title: "Global Networking",
    description:
      "Connect educators, NGOs, industry, and youth on one credible international platform.",
  },
];

const DEFAULT_DISCOVER: DiscoverInsight[] = [
  {
    title: "NEP 2020 Implementation Frameworks",
    date: "2026",
    author: "Academic Council",
    href: "/departments/academic-council",
    tag: "Policy",
    accent: "from-brand-blue/60 to-brand-blue/20",
    tagBg: "bg-brand-blue",
    imageSrc: "/2024M/Press8.jpg",
    imageAlt: "NEP 2020 policy session at Shiksha Mahakumbh",
    external: false,
  },
  {
    title: "Research Proceedings & Souvenir",
    date: "SMK 5.0 archive",
    author: "Past editions",
    href: "/publications/souvenir-abstracts-mtc",
    tag: "Research",
    accent: "from-brand-saffron/50 to-brand-saffron/15",
    tagBg: "bg-brand-saffron",
    imageSrc: "/2024M/Vyakhanmala.jpg",
    imageAlt: "Research proceedings release at Shiksha Mahakumbh",
    external: false,
  },
  {
    title: "Multi Track Conference",
    date: cmtSubmissionDateLabel(),
    author: "Research Track",
    href: CMT_SUBMISSION_URL,
    tag: "Submit",
    accent: "from-brand-emerald/50 to-brand-emerald/15",
    tagBg: "bg-brand-emerald",
    imageSrc: "/2024M/Press7.jpg",
    imageAlt: "Multi Track Conference inauguration",
    external: true,
  },
  {
    title: "Past Editions & Proceedings",
    date: "Archive",
    author: "SMK History",
    href: "/past-events",
    tag: "Editions",
    accent: "from-brand-violet/50 to-brand-violet/15",
    tagBg: "bg-brand-violet",
    imageSrc: "/2024K/k6.jpg",
    imageAlt: "Past Shiksha Mahakumbh edition ceremony",
    external: false,
  },
];

const DISCOVER_ACCENTS = [
  {
    accent: "from-brand-blue/60 to-brand-blue/20",
    tagBg: "bg-brand-blue",
    imageSrc: "/2024M/Press8.jpg",
    imageAlt: "Shiksha Mahakumbh highlight",
  },
  {
    accent: "from-brand-saffron/50 to-brand-saffron/15",
    tagBg: "bg-brand-saffron",
    imageSrc: "/2024M/Vyakhanmala.jpg",
    imageAlt: "Shiksha Mahakumbh highlight",
  },
  {
    accent: "from-brand-emerald/50 to-brand-emerald/15",
    tagBg: "bg-brand-emerald",
    imageSrc: "/2024M/Press7.jpg",
    imageAlt: "Shiksha Mahakumbh highlight",
  },
  {
    accent: "from-brand-violet/50 to-brand-violet/15",
    tagBg: "bg-brand-violet",
    imageSrc: "/2024K/k6.jpg",
    imageAlt: "Shiksha Mahakumbh highlight",
  },
];

const DEFAULT_TRACKS: EventTrack[] = [
  {
    title: "Multi-Track Conclaves",
    date: "During SMK 6.0",
    venue: "NIT Hamirpur",
    description: "Holistic education, policy, and Bharatiya knowledge systems.",
    href: ROUTES.academicCouncil,
    badge: "Conclave",
  },
  {
    title: "Multi Track Conference",
    date: cmtSubmissionDateLabel(),
    venue: "Microsoft CMT",
    description: "Submit papers and abstracts via the official CMT portal.",
    href: CMT_SUBMISSION_URL,
    badge: "Research",
  },
  {
    title: "Olympiads & Awards",
    date: "Classes 3–10 · dates TBA",
    venue: "National participation",
    description: "Student olympiads, best practices, and recognition awards — register via the hub; exam dates to be announced.",
    href: ROUTES.registration,
    badge: "Students",
  },
  {
    title: "Exhibitions & Projects",
    date: "Showcase",
    venue: "Innovation pavilion",
    description: "School and HEI project displays, startups, and exhibitions.",
    href: ROUTES.registration,
    badge: "Innovation",
  },
  {
    title: "Workshops",
    date: "Hands-on",
    venue: "On campus",
    description: "Capacity building sessions for educators and coordinators.",
    href: "/workshops",
    badge: "Workshop",
  },
  {
    title: "Accommodation",
    date: "On request",
    venue: "Hamirpur region",
    description: "Request accommodation during registration for approved delegates.",
    href: ROUTES.registration,
    badge: "Travel",
  },
];

function dedupeLogos<T extends { src: string }>(logos: T[]): T[] {
  const seen = new Set<string>();
  return logos.filter((logo) => {
    if (seen.has(logo.src)) return false;
    seen.add(logo.src);
    return true;
  });
}

export function buildTrustStripContent(
  homepage: CmsHomepage | null | undefined
): TrustStripContent {
  const stats = getSection(homepage, "stats");
  const cmsLogos = sectionItems<{
    src?: string;
    logoUrl?: string;
    alt?: string;
    name?: string;
    href?: string;
    website?: string;
  }>(stats, "logos");

  const logos = dedupeLogos(
    cmsLogos.length > 0
      ? cmsLogos.slice(0, 4).map((l) => ({
          src: l.src ?? l.logoUrl ?? "/logo.png",
          alt: l.alt ?? l.name ?? "Partner",
          href: sanitizeExternalUrl(l.href ?? l.website) ?? "",
        }))
      : ORGANIZING_LOGOS.map((l) => ({ ...l }))
  );

  return {
    tagline: sectionField(
      stats,
      "tagline",
      "An initiative of DHE · In collaboration with INIs & national partners"
    ),
    logos,
  };
}

export function buildWhyAttendContent(
  homepage: CmsHomepage | null | undefined
): WhyAttendContent {
  const section = getSection(homepage, "stats");
  const cmsFeatures = sectionItems<{
    title: string;
    description: string;
    badge?: string;
  }>(section, "features");

  return {
    eyebrow: sectionField(section, "eyebrow", "Why Attend"),
    title: section?.title ?? "Why Shiksha Mahakumbh?",
    description: sectionField(
      section,
      "subtitle",
      "Six reasons educators, researchers, students, and institutions join India's flagship education summit."
    ),
    features: cmsFeatures.length ? cmsFeatures : DEFAULT_WHY_ATTEND,
  };
}

export function buildDiscoverContent(
  homepage: CmsHomepage | null | undefined
): DiscoverContent {
  const discover = getSection(homepage, "discover");
  const cmsItems = sectionItems<{
    title?: string;
    date?: string;
    author?: string;
    href?: string;
    url?: string;
    tag?: string;
    imageSrc?: string;
    imageAlt?: string;
    external?: boolean;
  }>(discover, "items");

  const insights: DiscoverInsight[] =
    cmsItems.length > 0
      ? cmsItems.map((item, index) => {
          const preset = DISCOVER_ACCENTS[index % DISCOVER_ACCENTS.length];
          const href = item.href ?? item.url ?? "/";
          const external =
            item.external ?? (href.startsWith("http://") || href.startsWith("https://"));
          return {
            title: item.title ?? "Update",
            date: item.date ?? "2026",
            author: item.author ?? "SMK",
            href,
            tag: item.tag ?? "News",
            accent: preset.accent,
            tagBg: preset.tagBg,
            imageSrc: item.imageSrc ?? preset.imageSrc,
            imageAlt: item.imageAlt ?? item.title ?? "Shiksha Mahakumbh update",
            external,
          };
        })
      : DEFAULT_DISCOVER;

  return {
    eyebrow: sectionField(discover, "eyebrow", "Insights & Updates"),
    title: sectionField(discover, "title", "Research Highlights & Announcements"),
    description: sectionField(
      discover,
      "description",
      "Policy, research, and conclave updates from Shiksha Mahakumbh Abhiyan."
    ),
    insights,
  };
}

export function buildEventTracksContent(
  homepage: CmsHomepage | null | undefined
): EventTracksContent {
  const section = getSection(homepage, "featured_programs");
  const programs = sectionItems<{
    title: string;
    description: string;
    url?: string;
    date?: string;
    venue?: string;
    badge?: string;
  }>(section);

  const tracks: EventTrack[] = programs.length
    ? programs.map((p) => ({
        title: p.title,
        date: p.date ?? "During SMK 6.0",
        venue: p.venue ?? "NIT Hamirpur",
        description: p.description,
        href: p.url ?? ROUTES.registration,
        badge: p.badge ?? "Programme",
      }))
    : DEFAULT_TRACKS;

  return {
    eyebrow: "Programme",
    title: section?.title ?? "Tracks & Experiences",
    description: sectionField(
      section,
      "subtitle",
      "Conferences, research, competitions, exhibitions, and networking — one integrated summit."
    ),
    tracks,
  };
}

export type HomeSectionsContent = {
  trustStrip: TrustStripContent;
  whyAttend: WhyAttendContent;
  discover: DiscoverContent;
  eventTracks: EventTracksContent;
};

export function buildHomeSectionsContent(
  homepage: CmsHomepage | null | undefined
): HomeSectionsContent {
  return {
    trustStrip: buildTrustStripContent(homepage),
    whyAttend: buildWhyAttendContent(homepage),
    discover: buildDiscoverContent(homepage),
    eventTracks: buildEventTracksContent(homepage),
  };
}
