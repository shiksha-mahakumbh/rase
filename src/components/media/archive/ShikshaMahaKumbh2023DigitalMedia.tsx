"use client";

import DigitalMediaArchiveGrid from "./DigitalMediaArchiveGrid";

const media = [
  {
    name: "शिक्षा महाकुंभ (RASE 2023)",
    url: "https://youtu.be/sO8r04Y7-Q4",
    description: "Kanhaiya Mittal Message to It and Students ",
  },
  {
    name: "शिक्षा महाकुंभ (RASE 2023)",
    url: "https://www.youtube.com/watch?v=7Kog32TfBIY",
    description: "Interview  with Shiksha Mahakumbh Founder ",
  },
  {
    name: "Dainik Savera",
    url: "https://fb.watch/l0qAUsH5YS/",
    description: "जालंधर मे पहली बार होने जा रहा है शिक्षा का महाकुम्भ",
  },
  {
    name: "Punjab Kesari",
    url: "https://fb.watch/n2F3e83PNr/",
    description: "जालंधर में होने वाला शिक्षा का महाकुंभ रचेगा इतिहास, जानें क्या होगा खास?",
  },
  {
    name: "Haryana Bulletin News",
    url: "https://fb.watch/n2Fj7Bpe2p/",
    description: "शिक्षा महाकुंभ में होगा शिक्षा के व्यवसायीकरण को लेकर मंथन",
  },
  {
    name: "Real Flavours",
    url: "https://fb.watch/kNE0I653ko/?mibextid=5Ufylb",
    description: "Mahakumbh of Education will be held on June 9, 10, 11 at Jalandhar to discuss the curriculum of the new education policy",
  },
];

export default function ShikshaMahaKumbh2023DigitalMedia() {
  return (
    <DigitalMediaArchiveGrid
      sections={[{ title: "Shiksha Mahakumbh 1.0 — Digital Media", items: media }]}
    />
  );
}
