import { getInternalLinksForPath } from "@/lib/knowledge-graph/internal-link-engine";
import InternalLinksBlock from "./InternalLinksBlock";

type Props = {
  path: string;
  title?: string;
  limit?: number;
  excludePaths?: string[];
  className?: string;
};

/** Server-safe related programmes block (authority distribution). */
export default function RelatedContentSection({
  path,
  title = "Related programmes & resources",
  limit = 8,
  excludePaths = [],
  className = "mx-auto max-w-5xl px-4 py-8",
}: Props) {
  const normalized = path.startsWith("/") ? path : `/${path}`;
  const exclude = new Set([normalized, ...excludePaths]);

  const links = getInternalLinksForPath(normalized, limit + exclude.size).filter(
    (l) => !exclude.has(l.href)
  ).slice(0, limit);

  if (!links.length) return null;

  return (
    <div className={className}>
      <InternalLinksBlock title={title} links={links} />
    </div>
  );
}
