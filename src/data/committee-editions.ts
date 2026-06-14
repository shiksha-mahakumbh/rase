export interface CommitteeEdition {
  title: string;
  year: string;
  description: string;
  link: string;
  committeeLink: string;
  onCommitteeSelect: string;
  edition: string;
}

import { editionTitle } from "@/data/past-editions";

export const COMMITTEE_EDITIONS: CommitteeEdition[] = [
  {
    title: editionTitle("1.0"),
    year: "2023",
    edition: "1.0",
    description:
      "The inaugural edition setting the foundation for future Mahakumbh series.",
    link: "https://rase.co.in",
    committeeLink: "/committee/shikshamahakumbh2023",
    onCommitteeSelect: "Shiksha Mahakumbh 1.0 Committee",
  },
  {
    title: editionTitle("2.0"),
    year: "2023",
    edition: "2.0",
    description:
      "Early edition emphasizing teacher workshops and rural school outreach.",
    link: "https://rase.co.in",
    committeeLink: "/committee/shikshakumbh2023",
    onCommitteeSelect: "Shiksha Mahakumbh 2.0 Committee",
  },
  {
    title: editionTitle("3.0"),
    year: "2024",
    edition: "3.0",
    description:
      "Focused on innovations in school education and student empowerment.",
    link: "https://rase.co.in",
    committeeLink: "/committee/shikshakumbh2024",
    onCommitteeSelect: "Shiksha Mahakumbh 3.0 Committee",
  },
  {
    title: editionTitle("4.0"),
    year: "2024",
    edition: "4.0",
    description:
      "Celebrating excellence in Indian education system with interactive workshops.",
    link: "https://rase.co.in",
    committeeLink: "/committee/shikshamahakumbh2024",
    onCommitteeSelect: "Shiksha Mahakumbh 4.0 Committee",
  },
  {
    title: editionTitle("5.0"),
    year: "2025",
    edition: "5.0",
    description:
      "The latest edition, focusing on global education trends and innovations.",
    link: "https://rase.co.in",
    committeeLink: "/committee/shikshamahakumbh2025",
    onCommitteeSelect: "Shiksha Mahakumbh 5.0 Committee",
  },
];
