import {
  PROCEEDINGS_CDN_FILES,
  PROCEEDINGS_PDF_CDN,
} from "@/config/proceedings-pdf-cdn.cjs";

/** Canonical proceedings PDF URLs — GitHub Releases CDN (~79 MB off-repo). */
export const PROCEEDINGS_PDF = PROCEEDINGS_PDF_CDN;

export type ProceedingsVolumeKey = keyof typeof PROCEEDINGS_PDF;

export function proceedingsPdfHref(volume: ProceedingsVolumeKey): string {
  return PROCEEDINGS_PDF[volume];
}

export function proceedingsPdfFilename(volume: ProceedingsVolumeKey): string {
  return PROCEEDINGS_CDN_FILES[volume];
}

export function isExternalProceedingsPdf(href: string): boolean {
  return href.startsWith("https://");
}

export function proceedingsPdfLinkProps(href: string) {
  const external = isExternalProceedingsPdf(href);
  return external
    ? ({ href, target: "_blank" as const, rel: "noopener noreferrer" as const })
    : ({ href, download: href.substring(href.lastIndexOf("/") + 1) });
}
