/** Canonical proceedings PDF paths (local static until hosted on Drive/CDN). */
export const PROCEEDINGS_PDF = {
  vol1: "/Proceeding1.pdf",
  vol2: "/Proceeding2.pdf",
  vol3: "/Proceeding3.pdf",
} as const;

/** When Drive file IDs are available, mirror `committee-brochures.ts` and point pdfHref here. */

export type ProceedingsVolumeKey = keyof typeof PROCEEDINGS_PDF;

export function proceedingsPdfHref(volume: ProceedingsVolumeKey): string {
  return PROCEEDINGS_PDF[volume];
}
