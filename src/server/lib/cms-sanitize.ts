import { sanitizeCmsHtml } from "@/lib/security/sanitize-html";

/** Sanitize optional CMS HTML fields (pages: content, excerpt). */
export function sanitizeCmsHtmlField(value: string | null | undefined): string | null {
  if (value == null || value === "") return null;
  return sanitizeCmsHtml(value);
}

/** Notices are plain text — strip any HTML tags on save. */
export function sanitizeNoticeDescription(value: string): string {
  const stripped = value.replace(/<[^>]*>/g, "").trim();
  return stripped;
}
