import type { EditionDetailContent } from "@/data/editions/types";
import { SMK_4_0_PATH } from "@/data/editions/paths";

export { SMK_4_0_PATH };
export const SMK_4_0_LEGACY_PATH = "/past_event/sm24";

export const SMK_4_0_CONTENT: EditionDetailContent = {
  editionNumber: "4.0",
  theme: "Indian Education System for Global Development",
  dates: "16–17 December 2024",
  year: "2024",
  venueShort: "Kurukshetra University",
  venueFull: "Kurukshetra University, Kurukshetra",
  venueAddress: "Kurukshetra, Haryana, India",
  organisers: [
    "Department of Holistic Education",
    "Kurukshetra University",
    "Collaborating institutions across Punjab, Haryana, Himachal Pradesh, Delhi & Chandigarh",
  ],
  introduction:
    "Shiksha Mahakumbh 4.0 emerged as a transformative milestone in Bharat's educational landscape — a dynamic platform exploring the role of the Indian education system in driving global welfare and innovation, with parallel conclaves across academia, industry, media, science, and student leadership.",
  turnaroundStats: [
    { label: "Physical attendees", value: "2,400+" },
    { label: "National delegates", value: "200+" },
    { label: "VCs & Directors", value: "35" },
    { label: "Teachers in conclave", value: "92" },
    { label: "Student leaders", value: "300" },
    { label: "Research papers", value: "91" },
    { label: "Conclaves & sessions", value: "21" },
    { label: "Exhibitions", value: "30" },
    { label: "ATL projects", value: "15" },
    { label: "Co-organising institutions", value: "18" },
    { label: "Organisers & volunteers", value: "150" },
    { label: "Media professionals", value: "60+" },
  ],
  campaignStats: [
    { label: "Email invitations", value: "15,000" },
    { label: "Hand-delivered invitations", value: "300" },
    { label: "States represented", value: "10" },
    { label: "Media outlets", value: "40+" },
  ],
  highlights: [
    "VC/Directors' Conclave on industry-academia-society integration; Principals' Conclave on NEP 2020 best practices.",
    "Entrepreneurs' and Bureaucrats' conclaves on employment creation and government scheme implementation.",
    "Scientists' Conclave on lab-to-land research; Media & Social Media Influencers' conclaves on global education platforms.",
    "Paper presentations in 6 seminar rooms at UIET across sustainable education, digital innovation, and inclusivity.",
    "Keynote addresses by Shri Sunil Deodhar (My Home India), Gyananand Ji Maharaj, Shri Satish Kumar (SJM), Shri Avnish Bhatnagar (Vidya Bharati), and others.",
    "Valedictory reflections by Shri Rakesh Sinha (Ex MP, Rajya Sabha), Shri K G Suresh (Ex DG, IIMC), and future roadmap by Dr. Thakur SKR (ISRO & Director, DHE).",
    "Outstanding teachers, students, and startups felicitated; MTC souvenir abstracts and proceedings materials released for SMK 4.0.",
    "Chief guests included Prof. Rakesh Sinha, Shri K G Suresh, and Shri Sunil Deodhar.",
  ],
  galleryImages: [
    "/sm24printmedia/1-lcp.webp",
    "/sm24printmedia/10-opt.webp",
    "/sm24printmedia/20-opt.webp",
    "/sm24printmedia/30-opt.webp",
    "/sm24printmedia/40-opt.webp",
  ],
  galleryUrl: "https://drive.google.com/drive/folders/1XnauGu1-dQ2KCpTzvIMHhUwlBF-6GDEN",
  campaignPdf: "/RASE_2024_4TH_EDITION_Campaign.pdf",
  relatedLinks: [
    { label: "Proceedings hub", href: "/proceedings" },
    {
      label: "MTC Souvenir Abstracts (PDF)",
      href: "/publications/souvenir-abstracts-mtc#smk-4.0",
    },
    { label: "Campaign report (PDF)", href: "/RASE_2024_4TH_EDITION_Campaign.pdf" },
    { label: "Digital media archive", href: "/media/shiksha-mahakumbh/4.0/digital" },
    { label: "Print media", href: "/media/shiksha-mahakumbh/4.0/print" },
    { label: "Gallery", href: "https://drive.google.com/drive/folders/1XnauGu1-dQ2KCpTzvIMHhUwlBF-6GDEN", external: true },
    { label: "Best Wishes", href: "/best-wishes" },
    { label: "All past editions", href: "/past-events" },
  ],
};
