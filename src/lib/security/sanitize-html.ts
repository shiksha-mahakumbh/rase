import sanitizeHtml from "sanitize-html";

const CMS_ALLOWED_TAGS = [
  "p",
  "br",
  "strong",
  "em",
  "b",
  "i",
  "u",
  "ul",
  "ol",
  "li",
  "h1",
  "h2",
  "h3",
  "h4",
  "h5",
  "h6",
  "a",
  "blockquote",
  "table",
  "thead",
  "tbody",
  "tr",
  "th",
  "td",
  "img",
  "figure",
  "figcaption",
  "hr",
  "span",
  "div",
  "sup",
  "sub",
] as const;

const CMS_ALLOWED_ATTRIBUTES: sanitizeHtml.IOptions["allowedAttributes"] = {
  a: ["href", "title", "target", "rel"],
  img: ["src", "alt", "width", "height"],
  th: ["colspan", "rowspan"],
  td: ["colspan", "rowspan"],
  "*": ["class", "id"],
};

/**
 * Sanitize CMS-authored HTML before rendering. Strips scripts, event handlers,
 * and dangerous URLs while preserving semantic markup.
 * Uses sanitize-html (no jsdom) so Next.js API routes can import this at build time.
 */
export function sanitizeCmsHtml(html: string): string {
  if (!html?.trim()) return "";
  return sanitizeHtml(html, {
    allowedTags: [...CMS_ALLOWED_TAGS],
    allowedAttributes: CMS_ALLOWED_ATTRIBUTES,
    allowVulnerableTags: false,
    disallowedTagsMode: "discard",
  });
}
