import { CANONICAL_ROUTES } from "@/constants/canonical-routes";

export const ACADEMIC_COUNCIL_PATH = CANONICAL_ROUTES.departments.academicCouncil;

export function academicCouncilHash(slug: string): string {
  return `${ACADEMIC_COUNCIL_PATH}#${slug}`;
}

/** Homepage hero stat cards — label-based href resolution (CMS-safe). */
export function resolveHeroStatHref(label: string): string | undefined {
  const key = label.toLowerCase();
  if (key.includes("completed") && key.includes("edition")) return CANONICAL_ROUTES.pastEvents;
  if (key.includes("current edition")) return ACADEMIC_COUNCIL_PATH;
  if (key.includes("institution")) return "/#conference-support";
  if (key.includes("research paper")) return "/publications";
  if (key.includes("states") || key.includes("ut")) return "/abhiyaninphotoframe";
  if (key.includes("2047") || key.includes("nep")) return CANONICAL_ROUTES.introduction;
  if (key.includes("student")) return CANONICAL_ROUTES.registration;
  if (key.includes("partner")) return "/partners";
  return undefined;
}

export function resolveWhyAttendHref(title: string): string | undefined {
  const key = title.toLowerCase();
  if (key.includes("nep") || key.includes("policy")) return CANONICAL_ROUTES.introduction;
  if (key.includes("research") || key.includes("publication")) return "/publications";
  if (key.includes("innovation") || key.includes("startup")) return academicCouncilHash("exhibition");
  if (key.includes("olympiad") || key.includes("talent")) return academicCouncilHash("olympiad");
  if (key.includes("conclave")) return academicCouncilHash("conclave");
  if (key.includes("workshop")) return "/workshops";
  if (key.includes("network")) return CANONICAL_ROUTES.contact;
  return undefined;
}
