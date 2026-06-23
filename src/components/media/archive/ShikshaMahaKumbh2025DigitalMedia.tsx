"use client";

import DigitalMediaArchiveGrid from "./DigitalMediaArchiveGrid";
import { SMK_50_DIGITAL_MEDIA } from "@/data/media/shiksha-mahakumbh-5.0-digital-media";

export default function ShikshaMahaKumbh2025DigitalMedia() {
  return (
    <DigitalMediaArchiveGrid
      pageTitle="Shiksha Mahakumbh 5.0 — Digital Media"
      intro={
        <>
          Online news, government portals, YouTube, Facebook, and Instagram coverage from NIPER
          Mohali — including official reporting from the{" "}
          <a
            href="https://ladakh.gov.in/shiksha-mahakumbh-abhiyan-2025/"
            className="font-semibold text-brand-blue hover:underline"
            target="_blank"
            rel="noopener noreferrer"
          >
            Union Territory of Ladakh
          </a>
          .
        </>
      }
      sections={[{ title: "Coverage links", items: SMK_50_DIGITAL_MEDIA }]}
    />
  );
}
