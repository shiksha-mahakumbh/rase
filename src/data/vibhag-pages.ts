export interface VibhagPage {
  path: string;
  slug: string;
  title: string;
  titleHindi: string;
  description: string;
}

export const VIBHAG_PAGES: VibhagPage[] = [
  {
    path: "/departments/academic-council",
    slug: "AcademicCouncil24",
    title: "Academic Council",
    titleHindi: "शैक्षिक विभाग",
    description:
      "Multi-track conference, conclaves, DHE Olympiads, exhibitions, Bal Shodh Patrika, best practices, and student projects — NIT Hamirpur, 9–11 Oct 2026",
  },
  {
    path: "/departments/prabandhan",
    slug: "Prabandhan24",
    title: "Prabandhan Vibhag",
    titleHindi: "प्रबंधन विभाग",
    description: "Event management, logistics, and operations coordination",
  },
  {
    path: "/departments/prachar",
    slug: "Prachar24",
    title: "Prachar Vibhag",
    titleHindi: "प्रचार विभाग",
    description: "Outreach, publicity, and communications",
  },
  {
    path: "/departments/sampark",
    slug: "Sampark24",
    title: "Sampark Vibhag",
    titleHindi: "संपर्क विभाग",
    description: "Institutional liaison and stakeholder engagement",
  },
  {
    path: "/departments/vitt",
    slug: "Vitt24",
    title: "Vitt Vibhag",
    titleHindi: "वित्त विभाग",
    description: "Finance and resource management",
  },
];

export function getVibhagBySlug(slug: string): VibhagPage | undefined {
  return VIBHAG_PAGES.find((p) => p.slug === slug);
}
