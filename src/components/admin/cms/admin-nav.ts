export type AdminNavItem = {
  label: string;
  href: string;
  description?: string;
  group: "content" | "organizational" | "site" | "insights" | "operations";
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
    label: "Media Library",
    href: "/admin/cms/media",
    description: "Images, PDFs, assets",
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
    description: "Press, news & media",
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
    label: "Analytics",
    href: "/admin/cms/analytics",
    description: "Visitors & traffic",
    group: "insights",
  },
  {
    label: "Contact Inbox",
    href: "/admin/cms/contact",
    description: "Contact form messages",
    group: "operations",
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
    href: "/event/checkin",
    description: "Mobile QR check-in gate",
    group: "operations",
  },
  {
    label: "Accommodation",
    href: "/admin/cms/accommodation-lifecycle",
    description: "Room allocation & check-in",
    group: "operations",
  },
  {
    label: "Research Submissions",
    href: "/admin/cms/research",
    description: "Abstract review & acceptance",
    group: "operations",
  },
  {
    label: "Communications",
    href: "/admin/cms/communications",
    description: "Email / SMS / WhatsApp campaigns",
    group: "operations",
  },
  {
    label: "Event Analytics",
    href: "/admin/cms/event-analytics",
    description: "Check-in, occupancy, certificates",
    group: "operations",
  },
  {
    label: "Executive Dashboard",
    href: "/admin/cms/executive-dashboard",
    description: "Live metrics & real-time alerts",
    group: "operations",
  },
  {
    label: "AI Insights",
    href: "/admin/cms/ai-insights",
    description: "Trends, forecasts & recommendations",
    group: "operations",
  },
  {
    label: "Workflow Automation",
    href: "/admin/cms/workflow-automation",
    description: "Auto email & WhatsApp rules",
    group: "operations",
  },
  {
    label: "Volunteers",
    href: "/admin/cms/volunteers",
    description: "Assignments, shifts & rosters",
    group: "operations",
  },
  {
    label: "Sessions",
    href: "/admin/cms/sessions",
    description: "Conclaves, workshops & attendance",
    group: "operations",
  },
  {
    label: "Speaker Operations",
    href: "/admin/cms/speaker-operations",
    description: "Travel, honorarium & schedules",
    group: "operations",
  },
  {
    label: "Alumni",
    href: "/admin/cms/alumni",
    description: "Post-event alumni database",
    group: "operations",
  },
  {
    label: "Document Center",
    href: "/admin/cms/documents",
    description: "Letters & bulk generation",
    group: "operations",
  },
  {
    label: "WhatsApp Logs",
    href: "/admin/cms/whatsapp-logs",
    description: "Delivery status tracking",
    group: "operations",
  },
  {
    label: "Payment Monitoring",
    href: "/admin/cms/payment-monitoring",
    description: "Revenue & payment health dashboard",
    group: "operations",
  },
  {
    label: "Payments",
    href: "/admin/cms/payments",
    description: "All registration payments",
    group: "operations",
  },
  {
    label: "Payment Recovery",
    href: "/admin/cms/payment-recovery",
    description: "Orphan payments & repair",
    group: "operations",
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
  },
  {
    label: "Webhook Logs",
    href: "/admin/cms/webhooks",
    description: "Razorpay webhook events",
    group: "operations",
  },
  {
    label: "Payment Audit",
    href: "/admin/cms/payment-audit",
    description: "End-to-end payment audit trail",
    group: "operations",
  },
];

export const CMS_NAV_GROUPS: Record<AdminNavItem["group"], string> = {
  content: "Content",
  organizational: "Organizational",
  site: "Site",
  insights: "Insights",
  operations: "Operations",
};
