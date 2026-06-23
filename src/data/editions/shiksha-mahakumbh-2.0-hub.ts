import type { EditionDetailContent } from "@/data/editions/types";
import { SMK_2_0_PATH } from "@/data/editions/paths";

export { SMK_2_0_PATH };
export const SMK_2_0_LEGACY_PATH = "/past_event/sk23";

export const SMK_2_0_CONTENT: EditionDetailContent = {
  editionNumber: "2.0",
  theme: "Role of Academic-driven Startups in Economy",
  dates: "20 December 2023",
  year: "2023",
  venueShort: "NIT Kurukshetra",
  venueFull: "National Institute of Technology, Kurukshetra",
  venueAddress: "Kurukshetra, Haryana, India",
  organisers: [
    "Department of Holistic Education",
    "National Institute of Technology, Kurukshetra",
    "Shri Krishna Ayush University & Hindu Shiksha Samiti (collaborating partners)",
  ],
  introduction:
    "Shiksha Kumbh — an integral edition of Shiksha Mahakumbh Abhiyan — was conceived by Dr Thakur SKR (ISRO) and implemented under the guidance of Shri Vijay Nadda. Held at NIT Kurukshetra, this edition focused on how student-led startups in teaching institutions impact the national economy. The inaugural session was graced by the Hon'ble Governor of Haryana, Shri Bandaru Dattatreya.",
  objective:
    "From Education to Startups, Startups to Economy — exploring academic-driven entrepreneurship as a national growth engine.",
  turnaroundStats: [
    { label: "Research papers", value: "43" },
    { label: "Footfall", value: "5,000+" },
    { label: "Participants", value: "2,000+" },
    { label: "Participating organisations", value: "10" },
    { label: "Exhibitions", value: "10" },
    { label: "VCs & Directors", value: "5" },
    { label: "Proceedings papers (Vol. I)", value: "65" },
  ],
  highlights: [
    "Dozens of intellectuals deliberated on the Shiksha Kumbh theme; hundreds of papers were submitted on the conference theme.",
    "Young entrepreneurs showcased startup exhibitions that inspired student participants.",
    "A month-long campaign reached teaching institutions across Haryana, generating thousands of applications.",
    "Prize distribution at the valedictory session; cultural performances including Sardar Ali Sufi band marked a successful first Shiksha Kumbh edition.",
    "Proceedings Volume I (Shiksha Mahakumbh 2.0) released — 65 papers across Skill & Startup, Entrepreneurship, and Best Practices & Innovations.",
    "Chief guests included Shri Bandaru Dattatreya, Governor of Haryana, and Swami Bhitiharanand Ji Sachidananda, Ramakrishna Mission.",
  ],
  leadership: {
    story:
      "Shiksha Kumbh is organised on special themes for deliberation while Shiksha Mahakumbh places all 140 crore citizens at the centre. This edition launched the startup-economy dialogue that continues across subsequent Mahakumbh editions.",
    people: [
      { name: "Shri Vijay Nadda", role: "Guiding mentor" },
      { name: "Dr. Thakur SKR", role: "Director, DHE" },
    ],
  },
  galleryImages: ["/2023K/k1.jpg", "/2023K/k2.JPG", "/2023K/b1.JPG", "/2023K/bandaru_dattareya.JPG"],
  galleryUrl: "https://drive.google.com/drive/folders/1tKbSQtOUq7ji2s0-5hueAqTQlal9ScpJ",
  campaignPdf: "/RASE_2023_2ND_EDITION_Campaign.pdf",
  proceedingHref: "/proceeding1",
  relatedLinks: [
    { label: "Proceedings Volume I (PDF)", href: "/Proceeding1.pdf" },
    { label: "Read proceedings online", href: "/proceeding1" },
    { label: "Campaign report (PDF)", href: "/RASE_2023_2ND_EDITION_Campaign.pdf" },
    { label: "Digital media archive", href: "/media/shiksha-mahakumbh/2.0/digital" },
    { label: "Print media", href: "/media/shiksha-mahakumbh/2.0/print" },
    { label: "Gallery", href: "https://drive.google.com/drive/folders/1tKbSQtOUq7ji2s0-5hueAqTQlal9ScpJ", external: true },
    { label: "All past editions", href: "/past-events" },
  ],
};
