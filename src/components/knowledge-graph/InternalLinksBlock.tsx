import Link from "next/link";
import type { InternalLinkSuggestion } from "@/lib/knowledge-graph/internal-link-engine";

type Props = {
  title?: string;
  links: InternalLinkSuggestion[];
  className?: string;
};

export default function InternalLinksBlock({
  title = "Related programmes",
  links,
  className = "",
}: Props) {
  if (!links.length) return null;

  return (
    <nav
      aria-label={title}
      className={`rounded-2xl border border-slate-200 bg-white p-6 shadow-sm ${className}`}
    >
      <h2 className="text-lg font-bold text-brand-navy">{title}</h2>
      <ul className="mt-4 grid gap-2 sm:grid-cols-2">
        {links.map((link) => (
          <li key={`${link.href}-${link.reason}`}>
            <Link
              href={link.href}
              className="text-sm font-medium text-brand-navy underline-offset-2 hover:text-brand-saffron hover:underline"
            >
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
