import type { CmsMenu, CmsSiteSettings } from "@/lib/cms/types";
import { sanitizeExternalUrl } from "@/lib/security/safe-external-url";
import { resolveNavHref } from "@/lib/security/safe-nav-url";
import {
  departmentLinks,
  educationLinks,
  footerLogos,
  legalLinks,
  programLinks,
  quickLinks,
  socialLinks,
  type FooterLink,
  type FooterLogo,
} from "@/components/layout/footer-content";

export type { FooterLink, FooterLogo };
export {
  departmentLinks,
  educationLinks,
  footerLogos,
  legalLinks,
  programLinks,
  quickLinks,
  socialLinks,
};

/** Primary organizing logos — compact strip (full list on homepage partners). */
export const CORE_FOOTER_LOGOS: FooterLogo[] = footerLogos;

/** Never show in Quick Links — legal bar, programs column, or retired routes. */
export const FOOTER_QUICK_LINK_EXCLUDED = new Set([
  "/privacy-policy",
  "/terms-and-conditions",
  "/disclaimer",
  "/refund-policy",
  "/cookie-policy",
  "/speakers/directory",
  "/conclave",
  "/past_event/Innovation_and_Entrepreneurship_Dhe_Workshop",
]);

const PROGRAM_HREFS = new Set(programLinks.map((l) => l.href));

export const SOCIAL_ARIA_LABELS: Record<string, string> = {
  youtube: "Shiksha Mahakumbh on YouTube",
  facebook: "Shiksha Mahakumbh on Facebook",
  linkedin: "Shiksha Mahakumbh on LinkedIn",
  instagram: "Shiksha Mahakumbh on Instagram",
  x: "Shiksha Mahakumbh on X",
};

export const SOCIAL_SHORT_LABELS: Record<string, string> = {
  youtube: "YT",
  facebook: "FB",
  linkedin: "in",
  instagram: "IG",
  x: "X",
};

export type FooterSocialLink = {
  id: string;
  href: string;
  label: string;
  shortLabel: string;
};

function dedupeLinksByHref(links: FooterLink[]): FooterLink[] {
  const seen = new Set<string>();
  const out: FooterLink[] = [];
  for (const link of links) {
    if (!link.name?.trim() || !link.href?.trim()) continue;
    const key = link.href.trim();
    if (seen.has(key)) continue;
    seen.add(key);
    out.push({ name: link.name.trim(), href: key });
  }
  return out;
}

/** CMS items extend/override defaults — never replace the full list with a short admin menu. */
export function mergeFooterQuickLinks(
  defaults: FooterLink[],
  cmsItems?: { label: string; url: string }[] | null
): FooterLink[] {
  if (!cmsItems?.length) return defaults;

  const byHref = new Map<string, FooterLink>();
  for (const link of defaults) {
    byHref.set(link.href, link);
  }

  for (const item of cmsItems) {
    const href = item.url?.trim();
    const name = item.label?.trim();
    if (!href || !name) continue;
    byHref.set(href, { name, href });
  }

  const defaultOrder = defaults.map((d) => byHref.get(d.href) ?? d);
  const defaultHrefs = new Set(defaults.map((d) => d.href));

  for (const item of cmsItems) {
    const href = item.url?.trim();
    const name = item.label?.trim();
    if (!href || !name || defaultHrefs.has(href)) continue;
    defaultOrder.push({ name, href });
  }

  return dedupeLinksByHref(defaultOrder);
}

export function resolveFooterQuickLinks(footerMenu: CmsMenu | null | undefined): FooterLink[] {
  const cmsItems = footerMenu?.items?.map((i) => ({ label: i.label, url: i.url }));
  const merged = mergeFooterQuickLinks(quickLinks, cmsItems);
  return merged.filter(
    (link) =>
      !PROGRAM_HREFS.has(link.href) && !FOOTER_QUICK_LINK_EXCLUDED.has(link.href)
  );
}

export function resolveFooterSocialLinks(
  cmsSocial: Record<string, string> | null | undefined
): FooterSocialLink[] {
  const entries =
    cmsSocial && Object.keys(cmsSocial).length > 0
      ? Object.entries(cmsSocial)
      : socialLinks.map((s) => [s.id, s.href] as const);

  const resolved: FooterSocialLink[] = [];
  for (const [id, rawUrl] of entries) {
    const safe = sanitizeExternalUrl(rawUrl);
    if (!safe) continue;
    const fallbackLabel = socialLinks.find((s) => s.id === id)?.label ?? id;
    resolved.push({
      id,
      href: safe,
      label: SOCIAL_ARIA_LABELS[id] ?? fallbackLabel,
      shortLabel: SOCIAL_SHORT_LABELS[id] ?? id.slice(0, 2).toUpperCase(),
    });
  }
  return resolved;
}

export function resolveSafeLogoHref(href: string): string | undefined {
  return sanitizeExternalUrl(href);
}

export function resolveCopyrightLine(
  settings: CmsSiteSettings | null | undefined,
  year: number
): string {
  if (settings?.copyrightText?.trim()) {
    return settings.copyrightText.trim();
  }
  const org = settings?.organizationName?.trim() || "Shiksha Mahakumbh Abhiyan";
  return `© ${year} ${org}. All Rights Reserved.`;
}

export function resolveFooterOrgName(settings: CmsSiteSettings | null | undefined): string {
  return settings?.organizationName?.trim() || "Department of Holistic Education (DHE)";
}

export function resolveFooterTagline(settings: CmsSiteSettings | null | undefined): string | null {
  return settings?.tagline?.trim() || null;
}

export function safeWebsiteLinks(
  sites: { label: string; href: string }[]
): { label: string; href: string }[] {
  return sites
    .map((site) => {
      const nav = resolveNavHref(site.href);
      if (!nav.external) return null;
      return { label: site.label, href: nav.href };
    })
    .filter((s): s is { label: string; href: string } => s !== null);
}
