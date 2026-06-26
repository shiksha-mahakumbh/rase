import DOMPurify from "isomorphic-dompurify";

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
];

const CMS_ALLOWED_ATTR = [
  "href",
  "title",
  "target",
  "rel",
  "src",
  "alt",
  "width",
  "height",
  "class",
  "id",
  "colspan",
  "rowspan",
];

/**
 * Sanitize CMS-authored HTML before rendering. Strips scripts, event handlers,
 * and dangerous URLs while preserving semantic markup.
 */
export function sanitizeCmsHtml(html: string): string {
  if (!html?.trim()) return "";
  return DOMPurify.sanitize(html, {
    ALLOWED_TAGS: CMS_ALLOWED_TAGS,
    ALLOWED_ATTR: CMS_ALLOWED_ATTR,
    ALLOW_DATA_ATTR: false,
    ADD_ATTR: ["target"],
    FORBID_TAGS: ["script", "style", "iframe", "object", "embed", "form", "input"],
    FORBID_ATTR: ["onerror", "onload", "onclick", "onmouseover"],
  });
}
