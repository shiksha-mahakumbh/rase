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
    description: "Firebase registrations",
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
