import type { CmsHomepage } from "./types";
import { getSection, sectionItems } from "./utils";

export type PartnerItem = {
  name: string;
  logoUrl: string;
  website?: string;
  type?: string;
  partnerType?: string;
  imageUrl?: string;
  link?: string;
  text?: string;
};

export function getHomepagePartners(
  homepage: CmsHomepage | null | undefined,
  type?: string
): PartnerItem[] {
  const section = getSection(homepage, "partners");
  const items = sectionItems<PartnerItem>(section);
  if (!type) return items;
  return items.filter(
    (item) => (item.type ?? item.partnerType ?? "academic") === type
  );
}
