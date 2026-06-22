import type { EditionDetailContent } from "@/data/editions/types";
import { SMK_1_0_PATH } from "@/data/editions/paths";

export { SMK_1_0_PATH };
export const SMK_1_0_LEGACY_PATH = "/past_event/sm23";

export const SMK_1_0_CONTENT: EditionDetailContent = {
  editionNumber: "1.0",
  theme: "Recent Advances in School Education",
  dates: "9–11 June 2023",
  year: "2023",
  venueShort: "NIT Jalandhar",
  venueFull: "Dr. B. R. Ambedkar National Institute of Technology, Jalandhar",
  venueAddress: "Jalandhar, Punjab, India",
  organisers: [
    "Sarvhitkari Educational Society",
    "Dr. B. R. Ambedkar National Institute of Technology, Jalandhar",
  ],
  objective:
    "To create an atmosphere for the implementation of NEP 2020 and ensure participation of all in education.",
  objectiveExtended:
    "The conference brought together leading academic scientists, researchers, research scholars, educators, and industry to exchange experiences on school education — a premier interdisciplinary forum for innovations, trends, and practical solutions in global school education for sustainable societal growth.",
  contactEmail: "shikshamahakumbh23@gmail.com",
  venueAbout:
    "Dr. B. R. Ambedkar National Institute of Technology, Jalandhar (erstwhile REC Jalandhar), was established in 1987 and attained National Institute of Technology status on 17 October 2002. The institute provides high-quality technical education in engineering and technology and offers BTech programmes across twelve disciplines, along with MSc, MTech, and PhD research programmes.",
  campaignStats: [
    { label: "Corporate invitations", value: "752" },
    { label: "Personal invitations", value: "1,241" },
    { label: "States & UTs reached", value: "10 + 4" },
    { label: "Invitations by letters", value: "5,000" },
    { label: "Press conferences", value: "31" },
    { label: "Invitations by email", value: "10,000" },
  ],
  turnaroundStats: [
    { label: "Research papers", value: "81" },
    { label: "Student projects", value: "41" },
    { label: "Exhibition stalls", value: "42" },
    { label: "Cultural performances", value: "12" },
    { label: "Footfall", value: "5,000+" },
    { label: "VCs & Directors", value: "11" },
    { label: "Chief guests", value: "Major Anurag Thakur, Governors of Haryana & Punjab" },
  ],
  highlights: [
    "2,689 registered participants with total footfall of more than 5,000.",
    "More than 500 organising committee members across the country.",
    "Decision to organise Shiksha Mahakumbh annually was taken.",
    "Mobile Science Lab donated by the Hon'ble Governor, Punjab.",
    "Leadership of Vidya Bharati in Punjab was established.",
    "More than 300 new personnel joined the movement.",
    "Online funding experiment was a great success.",
    "4 serving DEOs from Punjab participated; 206 talent recognition applications received.",
    "Supporting partners included DAV University, IKG PTU, Vijnana Bharati, Bhartiya Shikshan Mandal, Ministry of Education, and Ministry of Youth Affairs & Sports.",
  ],
  leadership: {
    story:
      "An idea of organising a national conference on Recent Advances in School Education was initially conceptualised by Dr Thakur SKR.",
    people: [
      { name: "Shri Vijay Nadda", role: "Advisor" },
      { name: "Dr. Thakur SKR", role: "Director" },
    ],
  },
  galleryImages: [
    "/2023M/k1.jpeg",
    "/2023M/k1.png",
    "/2023M/k3.jpeg",
    "/2023M/k4.jpeg",
    "/2023M/k6.jpeg",
    "/2023M/k7.jpeg",
    "/2023M/k8.jpeg",
    "/2023M/k9.jpeg",
  ],
  galleryUrl: "https://drive.google.com/drive/folders/1Xu4WfCeWLQp037EJn5Q0ULmREtnLplwq",
  campaignPdf: "/RASE_2023_1ST_EDITION_Campaign.pdf",
  proceedingHref: "/proceeding2",
  relatedLinks: [
    { label: "Proceedings Volume II (PDF)", href: "/Proceeding2.pdf" },
    { label: "Read Volume II online", href: "/proceeding2" },
    { label: "Campaign report (PDF)", href: "/RASE_2023_1ST_EDITION_Campaign.pdf" },
    { label: "Proceedings hub", href: "/proceedings" },
    { label: "All past editions", href: "/past-events" },
    { label: "Best Wishes", href: "/best-wishes" },
  ],
};
