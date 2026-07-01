import type { AdminRole } from "@/types/registration";
import type { PermissionSlug } from "@/lib/permissions";
import {
  canMutateCms,
  roleHasPermission,
} from "@/lib/admin-role-capabilities";

export type AdminNavAccess = "any" | "manage";

export type AdminNavItem = {
  label: string;
  href: string;
  description?: string;
  group: "content" | "organizational" | "site" | "insights" | "operations";
  /** "manage" = Super Admin & Admin only; default "any" = all admin roles */
  access?: AdminNavAccess;
  /** Permission slug required when access is not "manage" */
  permission?: PermissionSlug;
};

export const CMS_NAV: AdminNavItem[] = [
  {
    label: "Dashboard",
    href: "/admin/cms",
    description: "CMS overview",
    group: "content",
  },
  {
    label: "Homepage",
    href: "/admin/cms/homepage",
    description: "Hero, stats, partners, CTA",
    group: "content",
  },
  {
    label: "Articles",
    href: "/admin/cms/articles",
    description: "Press releases & news",
    group: "content",
  },
  {
    label: "Pages",
    href: "/admin/cms/pages",
    description: "Generic CMS pages",
    group: "content",
  },
  {
    label: "FAQ",
    href: "/admin/cms/faq",
    description: "Categories & questions",
    group: "content",
  },
  {
    label: "Notices",
    href: "/admin/cms/notices",
    description: "Notice board",
    group: "content",
  },
  {
    label: "Categories",
    href: "/admin/cms/notices/categories",
    description: "Notice categories",
    group: "content",
  },
  {
    label: "Downloads",
    href: "/admin/cms/downloads",
    description: "Files & brochures",
    group: "content",
  },
  {
    label: "Gallery",
    href: "/admin/cms/gallery",
    description: "Photo albums & editions",
    group: "content",
  },
  {
    label: "Asset Library",
    href: "/admin/cms/media",
    description: "Upload images, PDFs & brochures (folders)",
    group: "content",
  },
  {
    label: "Committees",
    href: "/admin/cms/committees",
    description: "Organizing & advisory boards",
    group: "organizational",
  },
  {
    label: "Speakers",
    href: "/admin/cms/speakers",
    description: "Speaker profiles",
    group: "organizational",
  },
  {
    label: "Partners",
    href: "/admin/cms/partners",
    description: "Sponsors & partners",
    group: "organizational",
  },
  {
    label: "Events",
    href: "/admin/cms/events",
    description: "Summits & ceremonies",
    group: "organizational",
  },
  {
    label: "Media Center",
    href: "/admin/cms/media-center",
    description: "Press releases & news entries (not file uploads)",
    group: "organizational",
  },
  {
    label: "Menus",
    href: "/admin/cms/menus",
    description: "Header & footer nav",
    group: "site",
  },
  {
    label: "Settings",
    href: "/admin/cms/settings",
    description: "Contact & social",
    group: "site",
  },
  {
    label: "Announcement Bars",
    href: "/admin/cms/announcement-bars",
    description: "Ticker & modal",
    group: "site",
  },
  {
    label: "SEO Manager",
    href: "/admin/cms/seo",
    description: "Metadata & previews",
    group: "site",
  },
  {
    label: "Audit Logs",
    href: "/admin/cms/audit-logs",
    description: "CMS & system change history",
    group: "site",
    access: "manage",
  },
  {
    label: "Analytics",
    href: "/admin/cms/analytics",
    description: "Visitors & traffic",
    group: "insights",
    access: "manage",
  },
  {
    label: "Contact Inbox",
    href: "/admin/cms/contact",
    description: "Contact form messages",
    group: "operations",
  },
  {
    label: "Newsletter",
    href: "/admin/cms/newsletter",
    description: "Marketing email subscribers",
    group: "operations",
    access: "manage",
  },
  {
    label: "Feedback Inbox",
    href: "/admin/cms/feedback",
    description: "Visitor feedback",
    group: "operations",
  },
  {
    label: "Registrations",
    href: "/admin",
    description: "Registration records",
    group: "operations",
  },
  {
    label: "Attendees",
    href: "/admin/cms/attendees",
    description: "Unified attendee registry",
    group: "operations",
  },
  {
    label: "Event Check-In",
    href: "/admin/cms/checkin",
    description: "Mobile QR check-in gate",
    group: "operations",
  },
  {
    label: "Accommodation",
    href: "/admin/cms/accommodation-lifecycle",
    description: "Room allocation & check-in",
    group: "operations",
    access: "manage",
  },
  {
    label: "Research Submissions",
    href: "/admin/cms/research",
    description: "Abstract review & acceptance",
    group: "operations",
    access: "manage",
  },
  {
    label: "Communications",
    href: "/admin/cms/communications",
    description: "Email / SMS / WhatsApp campaigns",
    group: "operations",
    access: "manage",
  },
  {
    label: "Event Analytics",
    href: "/admin/cms/event-analytics",
    description: "Check-in, occupancy, certificates",
    group: "operations",
    access: "manage",
  },
  {
    label: "Executive Dashboard",
    href: "/admin/cms/executive-dashboard",
    description: "Live metrics & real-time alerts",
    group: "operations",
    access: "manage",
  },
  {
    label: "AI Insights",
    href: "/admin/cms/ai-insights",
    description: "Trends, forecasts & recommendations",
    group: "operations",
    access: "manage",
  },
  {
    label: "Workflow Automation",
    href: "/admin/cms/workflow-automation",
    description: "Auto email & WhatsApp rules",
    group: "operations",
    access: "manage",
  },
  {
    label: "Volunteers",
    href: "/admin/cms/volunteers",
    description: "Assignments, shifts & rosters",
    group: "operations",
    access: "manage",
  },
  {
    label: "Sessions",
    href: "/admin/cms/sessions",
    description: "Conclaves, workshops & attendance",
    group: "operations",
    access: "manage",
  },
  {
    label: "Speaker Operations",
    href: "/admin/cms/speaker-operations",
    description: "Travel, honorarium & schedules",
    group: "operations",
    access: "manage",
  },
  {
    label: "Alumni",
    href: "/admin/cms/alumni",
    description: "Post-event alumni database",
    group: "operations",
    access: "manage",
  },
  {
    label: "Document Center",
    href: "/admin/cms/documents",
    description: "Letters & bulk generation",
    group: "operations",
    access: "manage",
  },
  {
    label: "WhatsApp Logs",
    href: "/admin/cms/whatsapp-logs",
    description: "Delivery status tracking",
    group: "operations",
    access: "manage",
  },
  {
    label: "Payment Monitoring",
    href: "/admin/cms/payment-monitoring",
    description: "Revenue & payment health dashboard",
    group: "operations",
    access: "manage",
  },
  {
    label: "Payments",
    href: "/admin/cms/payments",
    description: "All registration payments",
    group: "operations",
  },
  {
    label: "Donations",
    href: "/admin/cms/donations",
    description: "80G donations & sponsorships",
    group: "operations",
  },
  {
    label: "Payment Recovery",
    href: "/admin/cms/payment-recovery",
    description: "Orphan payments & repair",
    group: "operations",
    access: "manage",
  },
  {
    label: "Receipts & QR",
    href: "/admin/cms/receipts",
    description: "Receipt and QR management",
    group: "operations",
  },
  {
    label: "Email Logs",
    href: "/admin/cms/email-logs",
    description: "Delivery monitoring & resend",
    group: "operations",
    access: "manage",
  },
  {
    label: "Webhook Logs",
    href: "/admin/cms/webhooks",
    description: "Razorpay webhook events",
    group: "operations",
    access: "manage",
  },
  {
    label: "Payment Audit",
    href: "/admin/cms/payment-audit",
    description: "End-to-end payment audit trail",
    group: "operations",
    access: "manage",
  },
];

export const CMS_NAV_GROUPS: Record<AdminNavItem["group"], string> = {
  content: "Content",
  organizational: "Organizational",
  site: "Site",
  insights: "Insights",
  operations: "Operations",
};

/** Resolve the minimum permission slug for a nav item. */
function navItemPermission(item: AdminNavItem): PermissionSlug {
  if (item.permission) return item.permission;
  if (item.access === "manage") return "media.manage";
  const href = item.href;
  if (href.includes("committees")) return "committees.read";
  if (
    href.includes("payments") ||
    href.includes("donation") ||
    href.includes("payment") ||
    href.includes("webhook")
  ) {
    return "payments.read";
  }
  if (
    href.includes("audit") ||
    href.includes("email-logs") ||
    href.includes("newsletter") ||
    href.includes("analytics") ||
    href.includes("executive") ||
    href.includes("ai-insights") ||
    href.includes("whatsapp") ||
    href.includes("communications")
  ) {
    return "audit_logs.read";
  }
  if (href.includes("contact")) return "contact.read";
  if (href.includes("feedback")) return "feedback.read";
  if (href.includes("settings")) return "settings.manage";
  if (
    href === "/admin" ||
    href.includes("attendees") ||
    href.includes("checkin") ||
    href.includes("accommodation") ||
    href.includes("receipts")
  ) {
    return "registrations.read";
  }
  return "media.read";
}

export function canAccessNavItem(
  role: AdminRole | null,
  access: AdminNavAccess = "any",
  permissions?: readonly PermissionSlug[] | null,
  item?: AdminNavItem
): boolean {
  if (!role) return false;
  if (access === "manage" && !canMutateCms(role, permissions)) return false;
  if (item) {
    return roleHasPermission(role, navItemPermission(item), permissions);
  }
  return access !== "manage" || canMutateCms(role, permissions);
}

export function filterCmsNavForRole(
  role: AdminRole | null,
  permissions?: readonly PermissionSlug[] | null
): AdminNavItem[] {
  return CMS_NAV.filter((item) =>
    canAccessNavItem(role, item.access ?? "any", permissions, item)
  );
}

export function getManageOnlyNavHrefs(): string[] {
  return CMS_NAV.filter((item) => item.access === "manage").map((item) => item.href);
}

const CMS_NAV_HREFS = CMS_NAV.map((item) => item.href);

/** Longest-prefix active match — avoids /media highlighting on /media-center. */
export function isNavItemActive(pathname: string, item: AdminNavItem): boolean {
  if (item.href === "/admin") {
    return pathname === "/admin" || pathname.startsWith("/admin/registrations");
  }
  if (item.href === "/admin/cms") {
    return pathname === "/admin/cms";
  }
  if (pathname === item.href) return true;
  if (!pathname.startsWith(`${item.href}/`)) return false;

  for (const other of CMS_NAV_HREFS) {
    if (other === item.href) continue;
    if (other.startsWith(`${item.href}/`) && pathname.startsWith(other)) {
      return false;
    }
  }
  return true;
}

export function getActiveNavItem(pathname: string): AdminNavItem | null {
  let best: AdminNavItem | null = null;
  for (const item of CMS_NAV) {
    if (!isNavItemActive(pathname, item)) continue;
    if (!best || item.href.length > best.href.length) best = item;
  }
  return best;
}

export function getNavGroupForPath(pathname: string): AdminNavItem["group"] | null {
  return getActiveNavItem(pathname)?.group ?? null;
}

export function isManageOnlyPath(pathname: string): boolean {
  return getManageOnlyNavHrefs().some(
    (href) => pathname === href || pathname.startsWith(`${href}/`)
  );
}

/** Whether the signed-in role may open this CMS path (nav + permission matrix). */
export function canAccessCmsPath(
  pathname: string,
  role: AdminRole | null,
  permissions?: readonly PermissionSlug[] | null
): boolean {
  if (!role || !pathname.startsWith("/admin/cms")) return false;

  const item = getActiveNavItem(pathname);
  if (!item) return false;

  return canAccessNavItem(role, item.access ?? "any", permissions, item);
}

/** First CMS module the role may open — used when redirecting from forbidden paths. */
export function getCmsFallbackPath(
  role: AdminRole | null,
  permissions?: readonly PermissionSlug[] | null
): string {
  const items = filterCmsNavForRole(role, permissions);
  const first = items.find((item) => item.href !== "/admin/cms");
  return first?.href ?? "/admin";
}

export const REGISTRATION_NAV = [
  { href: "/admin", label: "Registration dashboard" },
  { href: "/admin/cms/receipts", label: "Receipts & QR" },
  { href: "/admin/cms/payments", label: "Payments" },
  { href: "/admin/cms/checkin", label: "Event check-in" },
  { href: "/admin/cms/attendees", label: "Attendees" },
  { href: "/admin/cms", label: "Full CMS panel →" },
] as const;
