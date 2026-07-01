import { sanitizeCmsHtml } from "@/lib/security/sanitize-html";

type SafeHtmlProps = {
  html: string;
  className?: string;
  as?: "div" | "section" | "article";
};

/**
 * Renders CMS HTML through server-safe sanitization before injection.
 */
export default function SafeHtml({
  html,
  className,
  as: Tag = "div",
}: SafeHtmlProps) {
  const safe = sanitizeCmsHtml(html);
  if (!safe) return null;
  return (
    <Tag className={className} dangerouslySetInnerHTML={{ __html: safe }} />
  );
}
