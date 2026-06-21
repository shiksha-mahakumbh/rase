import { editionTitle } from "@/data/past-editions";
import { committeePathForEdition } from "@/lib/committee/edition-slugs";

export interface CommitteeEdition {
  title: string;
  year: string;
  description: string;
  link: string;
  committeeLink: string;
  onCommitteeSelect: string;
  edition: string;
}

/** @deprecated Prefer COMMITTEE_HUB_EDITIONS from committee-hub.ts */
export const COMMITTEE_EDITIONS: CommitteeEdition[] = [
  {
    title: editionTitle("6.0"),
    year: "2026",
    edition: "6.0",
    description:
      "Upcoming edition at NIT Hamirpur — Shiksha, Prakriti aur Pragati with seven conclaves and fifteen research tracks.",
    link: "/departments/academic-council",
    committeeLink: committeePathForEdition("6.0"),
    onCommitteeSelect: "Shiksha Mahakumbh 6.0 Committee",
  },
  {
    title: editionTitle("5.0"),
    year: "2025",
    edition: "5.0",
    description:
      "Classroom to Society — linking education with health and societal wellbeing at NIPER SAS Nagar.",
    link: "/past_event/sm25",
    committeeLink: committeePathForEdition("5.0"),
    onCommitteeSelect: "Shiksha Mahakumbh 5.0 Committee",
  },
  {
    title: editionTitle("4.0"),
    year: "2024",
    edition: "4.0",
    description:
      "Indian Education System for Global Development — leadership conclaves at Kurukshetra University.",
    link: "/past_event/sm24",
    committeeLink: committeePathForEdition("4.0"),
    onCommitteeSelect: "Shiksha Mahakumbh 4.0 Committee",
  },
  {
    title: editionTitle("3.0"),
    year: "2024",
    edition: "3.0",
    description:
      "Academic-driven startups and J&K economic development at NIT Srinagar.",
    link: "/past_event/sk24",
    committeeLink: committeePathForEdition("3.0"),
    onCommitteeSelect: "Shiksha Mahakumbh 3.0 Committee",
  },
  {
    title: editionTitle("2.0"),
    year: "2023",
    edition: "2.0",
    description:
      "Role of academic-driven startups in the economy — NIT Kurukshetra edition.",
    link: "/past_event/sk23",
    committeeLink: committeePathForEdition("2.0"),
    onCommitteeSelect: "Shiksha Mahakumbh 2.0 Committee",
  },
  {
    title: editionTitle("1.0"),
    year: "2023",
    edition: "1.0",
    description:
      "The inaugural edition setting the foundation for the Mahakumbh series at NIT Jalandhar.",
    link: "/past_event/sm23",
    committeeLink: committeePathForEdition("1.0"),
    onCommitteeSelect: "Shiksha Mahakumbh 1.0 Committee",
  },
];
