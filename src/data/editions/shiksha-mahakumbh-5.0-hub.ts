import type { EditionDetailContent } from "@/data/editions/types";
import { SMK_5_0_PATH } from "@/data/editions/paths";

export { SMK_5_0_PATH };
export const SMK_5_0_LEGACY_PATH = "/past_event/sm25";

export const SMK_5_0_CONTENT: EditionDetailContent = {
  editionNumber: "5.0",
  theme: "Classroom to Society — Building a Healthier World through Education",
  dates: "31 October – 2 November 2025",
  year: "2025",
  venueShort: "NIPER Mohali",
  venueFull: "National Institute of Pharmaceutical Education and Research, Mohali",
  venueAddress: "Mohali, Punjab, India",
  organisers: ["Department of Holistic Education", "NIPER Mohali"],
  introduction:
    "The Shiksha Mahakumbh Abhiyan returned to Punjab for its 5th edition at NIPER Mohali — continuing the journey from NIT Jalandhar toward Viksit Vishwa through Shiksha, inspired by Vasudhaiva Kutumbakam and Panchkoshiya Shiksha.",
  turnaroundStats: [
    { label: "Research papers", value: "284" },
    { label: "Conclaves", value: "10" },
    { label: "Exhibitions", value: "35" },
    { label: "Student projects", value: "100" },
    { label: "Olympiad participants", value: "10,400" },
    { label: "VCs & Directors", value: "45" },
    { label: "ATL projects (5 states)", value: "70" },
    { label: "Physical participants", value: "2,000+" },
    { label: "Journal collaborations", value: "282" },
  ],
  highlights: [
    "Inaugural session on 31 Oct 2025 graced by Hon'ble Governor of Punjab Shri Gulab Chand Kataria as Chief Guest.",
    "Valedictory on 2 Nov 2025 graced by Hon'ble Lt. Governor of Ladakh Shri Kavinder Gupta — official coverage on ladakh.gov.in on Bharat @ 2047 and NEP 2020.",
    "15 thematic sections spanning Science, Medicine, Social Sciences, Law, Arts, Innovation, and Spiritual Education.",
    "DHE English Olympiad (13–16 Oct 2025): 10,040 students from 25 schools across Punjab, Haryana & Chandigarh.",
    "International Conference on Development, Democracy and Governance as part of Sociology section.",
    "Educational & Innovation Exhibition with 32 stalls; institutions presented best practices transforming classrooms.",
    "6th Edition announced at NIT Hamirpur with formal baton ceremony.",
    "Year-long Vyakhyan Mala lecture series resolution adopted for educational excellence and policy impact.",
    "Notable guests included Prof. Ryan Altman (Purdue University, USA) and Prof. R. P. Tiwari (VC, CUP Punjab).",
  ],
  galleryImages: [
    "/sm25printmedia/1.jpg",
    "/sm25printmedia/12.jpg",
    "/sm25printmedia/24.jpg",
    "/sm25printmedia/36.jpg",
    "/sm25printmedia/48.jpg",
  ],
  galleryUrl: "https://drive.google.com/drive/folders/1c2CKx2Z9IaN-dsoW-Ymw6Npx1EOTFcsA?usp=sharing",
  relatedLinks: [
    { label: "Digital media archive", href: "/media/shiksha-mahakumbh/5.0/digital" },
    { label: "Print media (85 clippings)", href: "/media/shiksha-mahakumbh/5.0/print" },
    {
      label: "UT Ladakh — official report",
      href: "https://ladakh.gov.in/shiksha-mahakumbh-abhiyan-2025/",
      external: true,
    },
    { label: "Upcoming SMK 6.0", href: "/upcoming-events" },
    { label: "Registration", href: "/registration" },
    {
      label: "Photo gallery (Drive)",
      href: "https://drive.google.com/drive/folders/1c2CKx2Z9IaN-dsoW-Ymw6Npx1EOTFcsA?usp=sharing",
      external: true,
    },
    { label: "All past editions", href: "/past-events" },
    { label: "Media centre", href: "/media-center" },
  ],
  contactEmail: "info@shikshamahakumbh.com",
};
