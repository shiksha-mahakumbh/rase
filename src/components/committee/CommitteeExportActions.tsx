"use client";

import BrochureDownloadLink from "@/components/analytics/BrochureDownloadLink";
import type { CommitteeEditionData } from "@/data/committee-members";
import {
  getBrochureDownloadUrl,
  getBrochureViewUrl,
  getCommitteeBrochure,
} from "@/data/committee-brochures";
import {
  buildCommitteeListHtml,
  buildCommitteeListText,
  committeeExportFilename,
} from "@/lib/committee/export-committee-list";

interface CommitteeExportActionsProps {
  edition: CommitteeEditionData;
  variant?: "bar" | "compact";
}

function downloadFile(content: string, filename: string, mimeType: string) {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = filename;
  anchor.click();
  URL.revokeObjectURL(url);
}

const btnBase =
  "inline-flex min-h-[44px] items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2";

export default function CommitteeExportActions({
  edition,
  variant = "bar",
}: CommitteeExportActionsProps) {
  const brochure = getCommitteeBrochure(edition.edition);

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadTxt = () => {
    downloadFile(
      buildCommitteeListText(edition),
      committeeExportFilename(edition, "txt"),
      "text/plain;charset=utf-8"
    );
  };

  const handleDownloadHtml = () => {
    downloadFile(
      buildCommitteeListHtml(edition),
      committeeExportFilename(edition, "html"),
      "text/html;charset=utf-8"
    );
  };

  if (variant === "compact") {
    return (
      <BrochureDownloadLink
        href={brochure ? getBrochureViewUrl(brochure.driveFileId) : "#"}
        plan={`committee-brochure-${edition.edition}`}
        className={`${btnBase} border border-brand-saffron/40 bg-brand-saffron/10 text-brand-navy hover:bg-brand-saffron/20 focus-visible:outline-brand-saffron`}
      >
        Brochure PDF
        {brochure ? ` (${brochure.fileSize})` : ""}
      </BrochureDownloadLink>
    );
  }

  return (
    <div className="rounded-2xl border border-slate-200 bg-slate-50/80 p-4 md:p-5 print:hidden">
      <p className="text-xs font-bold uppercase tracking-wider text-brand-saffron-dark">
        Downloads &amp; Export
      </p>
      <p className="mt-1 text-sm text-slate-600">
        Official brochure PDF, printable committee list, or downloadable text/HTML export.
      </p>
      <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
        {brochure ? (
          <>
            <BrochureDownloadLink
              href={getBrochureDownloadUrl(brochure.driveFileId)}
              plan={`committee-brochure-download-${edition.edition}`}
              className={`${btnBase} bg-brand-navy text-white hover:bg-brand-navy-light focus-visible:outline-brand-navy`}
            >
              Download Brochure
              <span className="text-xs font-normal opacity-80">({brochure.fileSize})</span>
            </BrochureDownloadLink>
            <BrochureDownloadLink
              href={getBrochureViewUrl(brochure.driveFileId)}
              plan={`committee-brochure-view-${edition.edition}`}
              className={`${btnBase} border border-brand-navy/20 bg-white text-brand-navy hover:bg-brand-navy/5 focus-visible:outline-brand-navy`}
            >
              View Brochure Online
            </BrochureDownloadLink>
          </>
        ) : null}
        <button
          type="button"
          onClick={handlePrint}
          className={`${btnBase} border border-brand-saffron/40 bg-brand-saffron/15 text-brand-navy hover:bg-brand-saffron/25 focus-visible:outline-brand-saffron`}
        >
          Print Committee List
        </button>
        <button
          type="button"
          onClick={handleDownloadTxt}
          className={`${btnBase} border border-slate-200 bg-white text-brand-navy hover:bg-slate-100 focus-visible:outline-brand-navy`}
        >
          Export .txt
        </button>
        <button
          type="button"
          onClick={handleDownloadHtml}
          className={`${btnBase} border border-slate-200 bg-white text-brand-navy hover:bg-slate-100 focus-visible:outline-brand-navy`}
        >
          Export .html
        </button>
      </div>
      {brochure ? (
        <p className="mt-3 text-xs text-slate-500">
          Brochure: {brochure.fileName}. Use Print → Save as PDF for a committee-only PDF from this
          page.
        </p>
      ) : null}
    </div>
  );
}
