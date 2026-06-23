import Link from "next/link";
import { legalLinks } from "@/components/layout/footer-content";

export default function LegalRelatedLinks({ currentPath }: { currentPath: string }) {
  const links = legalLinks.filter((l) => l.href !== "/sitemap.xml" && l.href !== currentPath);
  if (links.length === 0) return null;

  return (
    <nav
      aria-label="Related legal policies"
      className="not-prose mt-12 border-t border-slate-200 pt-8"
    >
      <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-500">
        Related policies
      </h2>
      <ul className="mt-3 flex flex-wrap gap-x-4 gap-y-2 text-sm">
        {links.map((link) => (
          <li key={link.href}>
            <Link href={link.href} className="font-medium text-brand-saffron hover:underline">
              {link.name}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
