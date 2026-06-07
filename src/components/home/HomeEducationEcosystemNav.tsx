import Link from "next/link";
import { PILLAR_REGISTRY } from "@/lib/knowledge-graph/pillar-registry";

/**
 * Crawl-friendly pillar discoverability without homepage visual redesign.
 * Visually hidden but available to screen readers and search engines.
 */
export default function HomeEducationEcosystemNav() {
  return (
    <nav
      aria-label="Education ecosystem pillars"
      className="sr-only focus-within:not-sr-only focus-within:mx-auto focus-within:max-w-7xl focus-within:px-4 focus-within:py-4"
    >
      <h2>Education pillars — Shiksha Mahakumbh Abhiyan</h2>
      <ul>
        <li>
          <Link href="/education">Education ecosystem overview</Link>
        </li>
        {PILLAR_REGISTRY.map((p) => (
          <li key={p.slug}>
            <Link href={p.path}>{p.label}</Link>
          </li>
        ))}
        <li>
          <Link href="/knowledge">Knowledge Hub</Link>
        </li>
      </ul>
    </nav>
  );
}
