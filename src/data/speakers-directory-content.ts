/** English UI & SEO copy for /speakers/directory — speaker names stay in data file */

export const SPEAKERS_DIRECTORY_HERO = {
  eyebrow: "Shiksha Mahakumbh Abhiyan · Department of Holistic Education",
  title: "Speaker Directory",
  subtitle:
    "Complete directory of dignitaries, leaders, and experts across Shiksha Mahakumbh editions 1.0 through 5.0.",
  titleHi: "वक्ता सूची",
} as const;

export const SPEAKERS_DIRECTORY_INTRO = {
  heading: "Speakers & Distinguished Guests",
  headingHi: "वक्ता एवं गरिमामयी विभाग",
  description:
    "Browse all speakers recorded in the Abhiyan photo frame and edition archives — vice-chancellors, directors, policymakers, innovators, and social leaders.",
} as const;

export const EDITION_DIRECTORY_ACCENTS: Record<
  string,
  { header: string; badge: string; border: string }
> = {
  "1.0": {
    header: "from-brand-blue to-brand-blue/85",
    badge: "bg-brand-blue/15 text-brand-blue",
    border: "border-brand-blue/25",
  },
  "2.0": {
    header: "from-brand-saffron to-brand-saffron/85",
    badge: "bg-brand-saffron/20 text-brand-navy",
    border: "border-brand-saffron/30",
  },
  "3.0": {
    header: "from-brand-emerald to-emerald-600",
    badge: "bg-brand-emerald/15 text-emerald-800",
    border: "border-emerald-200/60",
  },
  "4.0": {
    header: "from-violet-600 to-violet-500",
    badge: "bg-violet-100 text-violet-800",
    border: "border-violet-200/60",
  },
  "5.0": {
    header: "from-brand-navy to-brand-navy/80",
    badge: "bg-brand-navy/10 text-brand-navy",
    border: "border-brand-navy/20",
  },
};

export const SPEAKERS_DIRECTORY_KEYWORDS = [
  "Shiksha Mahakumbh speakers",
  "education conference speakers India",
  "Shiksha Mahakumbh Abhiyan",
  "vice chancellor conclave",
  "NEP 2020 speakers",
  "Indian education summit",
  "Department of Holistic Education",
  "NIT Jalandhar Shiksha Mahakumbh",
  "speaker directory",
] as const;
