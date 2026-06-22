import {
  COMMITTEE_BROCHURES,
  COMMITTEE_BROCHURES_FOLDER_URL,
  getBrochureDownloadUrl,
  getBrochureViewUrl,
} from "@/data/committee-brochures";
import { COMMITTEE_EDITION_6_0 } from "@/data/committee-members/edition-6-0";
import { PAST_EDITIONS } from "@/data/past-editions";
import { committeePathForEdition } from "@/lib/committee/edition-slugs";

export { COMMITTEE_BROCHURES_FOLDER_URL };

export type EditionBrochureCard = {
  edition: string;
  year: string;
  venue: string;
  dates: string;
  theme: string;
  fileName: string;
  fileSize: string;
  viewUrl: string;
  downloadUrl: string;
  eventHref: string;
  committeeHref: string;
  status: "upcoming" | "completed";
};

export const DOWNLOADS_HUB_STATS = [
  { label: "Edition Brochures", value: "6", hint: "PDF editions 1.0–6.0" },
  { label: "Global Access", value: "Free", hint: "Open download for all delegates" },
  { label: "Languages", value: "EN + HI", hint: "Bilingual programme content" },
  { label: "Formats", value: "PDF", hint: "Print-ready official brochures" },
] as const;

export const DOWNLOADS_PAGE_HERO = {
  eyebrow: "Official Resources · National & International Delegates",
  title: "Edition Brochures & Download Centre",
  subtitle:
    "Download official Shiksha Mahakumbh Abhiyan brochures for editions 1.0 through 6.0 — programmes, conclaves, registration details, and global participation information in print-ready PDF format.",
} as const;

function committeeHrefForEdition(edition: string): string {
  return committeePathForEdition(edition);
}

export const EDITION_BROCHURES: EditionBrochureCard[] = COMMITTEE_BROCHURES.map(
  (brochure) => {
    const past = PAST_EDITIONS.find((e) => e.edition === brochure.edition);
    const upcoming = brochure.edition === "6.0";

    return {
      edition: brochure.edition,
      year: past?.year ?? COMMITTEE_EDITION_6_0.year,
      venue: past?.venue ?? COMMITTEE_EDITION_6_0.venue,
      dates: past?.dates ?? COMMITTEE_EDITION_6_0.dates,
      theme: past?.theme ?? COMMITTEE_EDITION_6_0.theme,
      fileName: brochure.fileName,
      fileSize: brochure.fileSize,
      viewUrl: getBrochureViewUrl(brochure.driveFileId),
      downloadUrl: getBrochureDownloadUrl(brochure.driveFileId),
      eventHref: past?.href ?? COMMITTEE_EDITION_6_0.eventHref,
      committeeHref: committeeHrefForEdition(brochure.edition),
      status: (upcoming ? "upcoming" : "completed") as EditionBrochureCard["status"],
    };
  }
)
  .sort((a, b) => parseFloat(b.edition) - parseFloat(a.edition));
