import type { CommitteeEditionData } from "@/data/committee-members/types";
import { extractInstitutionFromDesignation } from "@/lib/cms/affiliation-classify";

const ORG_ONLY_DESIGNATION =
  /^(NIT|IIT|IIM|IIIT|ISRO|CSIR|UGC|NCERT|DHE|AIIMS|CU |Central University|PGIMER|UIET|SLIET|NITTR|NIPER|IISER|Plaksha|Vidya Bharti|Vidya Bharati|Department of)/i;

/** Pull organisation names from SMK committee rosters (e.g. edition 6.0). */
export function extractCommitteeAffiliations(edition: CommitteeEditionData): string[] {
  const names = new Set<string>();

  for (const section of edition.sections) {
    for (const member of section.members) {
      const designation = member.designation?.trim();
      if (!designation) continue;

      const fromComma = extractInstitutionFromDesignation(designation);
      if (fromComma) names.add(fromComma);

      if (ORG_ONLY_DESIGNATION.test(designation) || designation.length < 80) {
        const shortOrg = designation
          .replace(/^(Director|Registrar|President|Manager|Member|COO|Scientist\/Engineer[^,]*),?\s*/i, "")
          .trim();
        if (shortOrg.length >= 3 && shortOrg.length <= 120) {
          names.add(shortOrg);
        }
      }
    }
  }

  return Array.from(names);
}
