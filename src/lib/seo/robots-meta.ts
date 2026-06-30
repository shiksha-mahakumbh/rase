/** Map seoMetadata.robots string ↔ admin checkbox flags. */

export function robotsToFlags(robots?: string | null): { index: boolean; follow: boolean } {
  const value = (robots ?? "index,follow").toLowerCase();
  return {
    index: !value.includes("noindex"),
    follow: !value.includes("nofollow"),
  };
}

export function flagsToRobots(index: boolean, follow: boolean): string {
  return `${index ? "index" : "noindex"},${follow ? "follow" : "nofollow"}`;
}

/** Map admin SEO form payload → DB `robots` string. */
export function normalizeSeoBody(body: Record<string, unknown>): Record<string, unknown> {
  const { robotsIndex, robotsFollow, ...rest } = body;
  if (robotsIndex !== undefined || robotsFollow !== undefined) {
    return {
      ...rest,
      robots: flagsToRobots(robotsIndex !== false, robotsFollow !== false),
    };
  }
  return rest;
}

/** Enrich DB SEO row with checkbox flags for admin UI. */
export function enrichSeoForAdmin<T extends { robots?: string | null } | null>(
  seo: T
): (T & { robotsIndex: boolean; robotsFollow: boolean }) | null {
  if (!seo) return null;
  const flags = robotsToFlags(seo.robots);
  return { ...seo, robotsIndex: flags.index, robotsFollow: flags.follow };
}
