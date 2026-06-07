export interface VibhagPage {
  path: string;
  slug: string;
  title: string;
  titleHindi: string;
  description: string;
}

export const VIBHAG_PAGES: VibhagPage[] = [
  {
    path: "/VibhagRoute/AcademicCouncil24",
    slug: "AcademicCouncil24",
    title: "Academic Council",
    titleHindi: "शैक्षिक विभाग",
    description: "Academic programmes, research tracks, and council initiatives",
  },
  {
    path: "/VibhagRoute/Prabandhan24",
    slug: "Prabandhan24",
    title: "Prabandhan Vibhag",
    titleHindi: "प्रबंधन विभाग",
    description: "Event management, logistics, and operations coordination",
  },
  {
    path: "/VibhagRoute/Prachar24",
    slug: "Prachar24",
    title: "Prachar Vibhag",
    titleHindi: "प्रचार विभाग",
    description: "Outreach, publicity, and communications",
  },
  {
    path: "/VibhagRoute/Sampark24",
    slug: "Sampark24",
    title: "Sampark Vibhag",
    titleHindi: "संपर्क विभाग",
    description: "Institutional liaison and stakeholder engagement",
  },
  {
    path: "/VibhagRoute/Vitt24",
    slug: "Vitt24",
    title: "Vitt Vibhag",
    titleHindi: "वित्त विभाग",
    description: "Finance and resource management",
  },
];

export function getVibhagBySlug(slug: string): VibhagPage | undefined {
  return VIBHAG_PAGES.find((p) => p.slug === slug);
}
