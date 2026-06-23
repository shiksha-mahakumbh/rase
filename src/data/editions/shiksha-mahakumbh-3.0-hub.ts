import type { EditionDetailContent } from "@/data/editions/types";
import { SMK_3_0_PATH } from "@/data/editions/paths";

export { SMK_3_0_PATH };
export const SMK_3_0_LEGACY_PATH = "/past_event/sk24";

export const SMK_3_0_CONTENT: EditionDetailContent = {
  editionNumber: "3.0",
  theme: "Role of Academic-driven Startups in Developing Economy of J & K",
  dates: "29–30 June 2024",
  year: "2024",
  venueShort: "NIT Srinagar",
  venueFull: "National Institute of Technology, Srinagar",
  venueAddress: "Srinagar, Jammu & Kashmir, India",
  organisers: [
    "Department of Holistic Education",
    "National Institute of Technology, Srinagar",
    "Four collaborating institutions",
  ],
  introduction:
    "RASE 2024 at NIT Srinagar brought together educators, industrialists, researchers, and students from across Bharat to deliberate on academic-driven startups for the developing economy of Jammu & Kashmir.",
  turnaroundStats: [
    { label: "Best teachers felicitated", value: "95" },
    { label: "Topper students", value: "1,400" },
    { label: "Schools represented", value: "156" },
    { label: "Districts (Kashmir + Jammu)", value: "14" },
    { label: "National delegates", value: "157" },
    { label: "Industrialists", value: "22" },
    { label: "VCs & Directors", value: "10" },
    { label: "Startup exhibitions", value: "15" },
    { label: "Research papers", value: "59" },
    { label: "Physical participation", value: "1,800+" },
    { label: "Student startup presentations", value: "50" },
    { label: "Toycathon certificates", value: "115" },
  ],
  campaignStats: [
    { label: "Email invitations", value: "5,000" },
    { label: "Personal invitations", value: "1,000" },
    { label: "States represented", value: "10" },
    { label: "Media coverage", value: "100+ newspapers & portals" },
  ],
  highlights: [
    "All best teachers and topper students from participating schools were felicitated.",
    "All startup presenters were felicitated; 6 sessions including inaugural, panel discussions, solo presentations, and valedictory.",
    "Hon'ble Lieutenant Governor graced the inaugural day; Hon'ble MoS (IC) Science & Technology graced the valedictory as Chief Guest.",
    "Special presentation by Voluntary Medicare Society Srinagar on startups and products by special children.",
    "Proceedings Volume III documents 61 peer-reviewed papers across Startup Conceptualization, Marketing & Funding, and related themes (59 presented at the summit).",
  ],
  declarations: [
    "Special focus on livelihood of special children through collaboration between INIs and rehabilitation centres — promoting dedicated startups for such children.",
    "Region-specific startups in healthcare, agriculture, IT, exotic tourism, and naturopathy need identification and promotion in Kashmir.",
    "Industrialists should be motivated by central schemes and CSR to support student, society, and women-led startups in tough terrains.",
    "Mandatory internships of INI students in these regions at least once per course — enabling cross-cultural engagement and integration with mainstream society.",
  ],
  galleryImages: [
    "/sk24printmedia/1.jpg",
    "/sk24printmedia/10-opt.webp",
    "/sk24printmedia/18-opt.webp",
    "/sk24printmedia/22.jpg",
    "/sk24printmedia/31.jpg",
  ],
  galleryUrl: "https://drive.google.com/drive/folders/1SgwPcXC3xRR7V3hAtKJSzeggBB9Xpwnk",
  campaignPdf: "/RASE_2024_3RD_EDITION_Campaign.pdf",
  proceedingHref: "/proceeding3",
  relatedLinks: [
    { label: "Proceedings Volume III (PDF)", href: "/Proceeding3.pdf" },
    { label: "Read proceedings online", href: "/proceeding3" },
    { label: "Campaign report (PDF)", href: "/RASE_2024_3RD_EDITION_Campaign.pdf" },
    { label: "Digital media archive", href: "/media/shiksha-mahakumbh/3.0/digital" },
    { label: "Print media", href: "/media/shiksha-mahakumbh/3.0/print" },
    { label: "Gallery", href: "https://drive.google.com/drive/folders/1SgwPcXC3xRR7V3hAtKJSzeggBB9Xpwnk", external: true },
    { label: "All past editions", href: "/past-events" },
  ],
};
