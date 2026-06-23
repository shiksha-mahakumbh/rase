import { proceeding1Data } from "@/content/proceedings/proceeding1-data";
import { proceeding2Data } from "@/content/proceedings/proceeding2-data";
import { proceeding3Data } from "@/content/proceedings/proceeding3-data";

const GENERIC_AFFILIATION_SKIP =
  /^(dept\.?\s+of|department of|graduate engineer trainee|project manager|software developer|assistant professor|professor|scientist|teacher|incharge)/i;

const INSTITUTION_HINT =
  /University|Institute|IIT|NIT|IIM|College|School|CSIR|DRDO|ISRO|ICAR|Academy|Board|Council|Society|Foundation|विश्वविद्यालय|संस्थान|महाविद्यालय/i;

function extractAffiliationFromAuthorLine(line: string): string | null {
  const trimmed = line.trim();
  const commaIdx = trimmed.indexOf(",");
  if (commaIdx === -1) return null;

  let affiliation = trimmed
    .slice(commaIdx + 1)
    .trim()
    .replace(/,?\s*India\s*$/i, "")
    .trim();
  if (!affiliation || affiliation.length < 4) return null;

  const parts = affiliation.split(",").map((p) => p.trim()).filter(Boolean);

  for (const part of parts) {
    if (INSTITUTION_HINT.test(part) && !GENERIC_AFFILIATION_SKIP.test(part)) {
      return part;
    }
  }

  for (let i = parts.length - 1; i >= 0; i -= 1) {
    const part = parts[i];
    if (part.length >= 5 && !GENERIC_AFFILIATION_SKIP.test(part)) {
      return part;
    }
  }

  if (GENERIC_AFFILIATION_SKIP.test(affiliation)) return null;
  return affiliation;
}

function collectFromProceedingData(data: {
  sections?: Array<{
    sessionChairs?: string[];
    papers?: Array<{ authors?: string[] }>;
  }>;
}): string[] {
  const names: string[] = [];

  for (const section of data.sections ?? []) {
    for (const chair of section.sessionChairs ?? []) {
      const inst = extractAffiliationFromAuthorLine(chair);
      if (inst) names.push(inst);
    }
    for (const paper of section.papers ?? []) {
      for (const author of paper.authors ?? []) {
        const inst = extractAffiliationFromAuthorLine(author);
        if (inst) names.push(inst);
      }
    }
  }

  return names;
}

/** Unique institution names extracted from indexed proceedings volumes. */
export const PROCEEDINGS_AFFILIATIONS: string[] = Array.from(
  new Set(
    [
      ...collectFromProceedingData(proceeding1Data),
      ...collectFromProceedingData(proceeding2Data),
      ...collectFromProceedingData(proceeding3Data),
    ].map((n) => n.trim())
  )
).filter(Boolean);
