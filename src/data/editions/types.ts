export type EditionStat = { label: string; value: string };

export type EditionRelatedLink = {
  label: string;
  href: string;
  external?: boolean;
};

export type EditionDetailContent = {
  editionNumber: string;
  theme: string;
  dates: string;
  year: string;
  venueShort: string;
  venueFull: string;
  venueAddress: string;
  organisers: readonly string[];
  introduction?: string;
  objective?: string;
  objectiveExtended?: string;
  contactEmail?: string;
  venueAbout?: string;
  campaignStats?: readonly EditionStat[];
  turnaroundStats?: readonly EditionStat[];
  highlights?: readonly string[];
  declarations?: readonly string[];
  leadership?: {
    story?: string;
    people?: readonly { name: string; role: string }[];
  };
  galleryImages?: readonly string[];
  galleryUrl?: string;
  campaignPdf?: string;
  proceedingHref?: string;
  relatedLinks?: readonly EditionRelatedLink[];
};
