import { SITE_URL } from "@/config/site";
import type { CommitteeEditionData } from "@/data/committee-members";
import { committeeAbsoluteUrl, committeePathFromSlug } from "@/lib/committee/edition-slugs";

export function buildCommitteeListText(edition: CommitteeEditionData): string {
  const lines: string[] = [
    edition.pageTitle,
    edition.theme,
    `${edition.venue} · ${edition.dates}`,
    "",
    "Shiksha Mahakumbh Abhiyan — Organising Committee",
    committeeAbsoluteUrl(edition.slug, SITE_URL),
    `Generated from rase.co.in`,
    "",
  ];

  for (const section of edition.sections) {
    lines.push(section.title.toUpperCase());
    lines.push("-".repeat(Math.min(section.title.length, 60)));
    section.members.forEach((member, index) => {
      const designation = member.designation ? ` — ${member.designation}` : "";
      lines.push(`${index + 1}. ${member.name}${designation}`);
    });
    lines.push("");
  }

  return lines.join("\n");
}

export function buildCommitteeListHtml(edition: CommitteeEditionData): string {
  const sectionBlocks = edition.sections
    .map((section) => {
      const rows = section.members
        .map(
          (member, index) =>
            `<tr><td>${index + 1}</td><td><strong>${escapeHtml(member.name)}</strong></td><td>${escapeHtml(member.designation)}</td></tr>`
        )
        .join("");

      return `
        <section>
          <h2>${escapeHtml(section.title)}</h2>
          <table>
            <thead><tr><th>#</th><th>Name</th><th>Designation</th></tr></thead>
            <tbody>${rows}</tbody>
          </table>
        </section>`;
    })
    .join("");

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <title>${escapeHtml(edition.pageTitle)} — Committee List</title>
  <style>
    body { font-family: Georgia, "Times New Roman", serif; max-width: 900px; margin: 2rem auto; padding: 0 1rem; color: #0b1f3b; line-height: 1.5; }
    h1 { font-size: 1.5rem; margin-bottom: 0.25rem; }
    .meta { color: #475569; font-size: 0.95rem; margin-bottom: 1.5rem; }
    h2 { font-size: 1.1rem; margin: 1.75rem 0 0.75rem; border-bottom: 2px solid #e8a317; padding-bottom: 0.25rem; }
    table { width: 100%; border-collapse: collapse; font-size: 0.9rem; margin-bottom: 1rem; }
    th, td { border: 1px solid #cbd5e1; padding: 0.45rem 0.6rem; text-align: left; vertical-align: top; }
    th { background: #0b1f3b; color: #fff; }
    tr:nth-child(even) { background: #f8fafc; }
    td:first-child { width: 2.5rem; text-align: center; }
    footer { margin-top: 2rem; font-size: 0.8rem; color: #64748b; }
    @media print { body { margin: 0; } }
  </style>
</head>
<body>
  <h1>${escapeHtml(edition.pageTitle)}</h1>
  <p class="meta"><strong>${escapeHtml(edition.theme)}</strong><br />
  ${escapeHtml(edition.venue)} · ${escapeHtml(edition.dates)}<br />
  Shiksha Mahakumbh Abhiyan · <a href="${committeeAbsoluteUrl(edition.slug, SITE_URL)}">${committeeAbsoluteUrl(edition.slug, SITE_URL)}</a></p>
  ${sectionBlocks}
  <footer>Official committee listing · Shiksha Mahakumbh Abhiyan · Department of Holistic Education</footer>
</body>
</html>`;
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

export function committeeExportFilename(edition: CommitteeEditionData, ext: "txt" | "html"): string {
  const slug = edition.slug.replace(/[^a-z0-9-]/gi, "-");
  return `shiksha-mahakumbh-${edition.edition.replace(".", "-")}-committee-${slug}.${ext}`;
}
