import type { Prisma } from "@prisma/client";

export type CmsSectionContent = Record<string, unknown>;

export type CmsSection = {
  sectionKey: string;
  sectionType: string;
  title: string | null;
  content: CmsSectionContent;
  sortOrder: number;
  isVisible: boolean;
};

export type CmsHomepage = {
  page: {
    id: string;
    title: string;
    slug: string;
    excerpt: string | null;
    content: string | null;
  };
  sections: CmsSection[];
  seo: {
    seoTitle?: string | null;
    metaDescription?: string | null;
    ogTitle?: string | null;
    ogDescription?: string | null;
    ogImageUrl?: string | null;
    canonicalUrl?: string | null;
    schemaJsonLd?: Prisma.JsonValue;
  } | null;
};

export type CmsNotice = {
  id: string;
  title: string;
  slug: string;
  description: string;
  priority: number;
  isPinned: boolean;
  publishAt: string | null;
  expireAt: string | null;
  category: { name: string; slug: string } | null;
  attachments: Array<{
    id: string;
    fileName: string;
    fileUrl: string;
    mimeType: string;
  }>;
};

export type CmsDownload = {
  id: string;
  title: string;
  slug: string | null;
  description: string | null;
  category: string | null;
  downloadType: string;
  tags: string[];
  downloadCount: number;
  fileUrl: string;
  expiresAt: string | null;
};

export type CmsSiteSettings = {
  organizationName: string | null;
  tagline: string | null;
  logoUrl: string | null;
  contactEmail: string | null;
  supportEmail: string | null;
  phoneNumbers: unknown;
  officeAddresses: unknown;
  socialLinks: Record<string, string>;
  copyrightText: string | null;
  footerContent: unknown;
  registrationOpen: boolean;
  maintenanceMode: boolean;
};

export type CmsMenuItem = {
  id: string;
  label: string;
  url: string;
  isExternal: boolean;
  openInNewTab: boolean;
  icon: string | null;
  sortOrder: number;
  children?: CmsMenuItem[];
};

export type CmsMenu = {
  id: string;
  name: string;
  slug: string;
  items: CmsMenuItem[];
};

export type CmsAnnouncementBar = {
  id: string;
  title: string;
  message: string;
  barType: string;
  colorTheme: string;
  ctaLabel: string | null;
  ctaUrl: string | null;
  isDismissible: boolean;
};

export type CmsFaqItem = {
  id: string;
  question: string;
  answer: string;
  category: string | null;
  isFeatured: boolean;
};

export type CmsPageData = {
  homepage: CmsHomepage | null;
  notices: CmsNotice[];
  widgetNotices: CmsNotice[];
  settings: CmsSiteSettings | null;
  headerMenu: CmsMenu | null;
  footerMenu: CmsMenu | null;
  announcementBars: CmsAnnouncementBar[];
  featuredFaqs: CmsFaqItem[];
};

export type CmsPageSeo = {
  seoTitle?: string | null;
  metaDescription?: string | null;
  ogTitle?: string | null;
  ogDescription?: string | null;
  ogImageUrl?: string | null;
  canonicalUrl?: string | null;
  robots?: string | null;
};

export type CmsPageRecord = {
  id: string;
  title: string;
  slug: string;
  pageType: string;
  locale: string;
  excerpt: string | null;
  content: string | null;
  sections: CmsSection[];
  publishedAt: string | null;
};

export type CmsArticleCard = {
  id: string;
  title: string;
  slug: string;
  locale: string;
  excerpt: string | null;
  heroImage: string | null;
  href: string;
};

export type CmsLoadedPage = {
  page: CmsPageRecord;
  seo: CmsPageSeo | null;
};

export type CmsSeoSnapshot = {
  seoTitle?: string | null;
  metaDescription?: string | null;
  ogTitle?: string | null;
  ogDescription?: string | null;
  ogImageUrl?: string | null;
  canonicalUrl?: string | null;
  robots?: string | null;
  schemaJsonLd?: Prisma.JsonValue;
};

export type CmsCommitteeMember = {
  id: string;
  fullName: string;
  designation: string | null;
  institution: string | null;
  photoUrl: string | null;
  sortOrder: number;
};

export type CmsCommitteeCard = {
  id: string;
  name: string;
  slug: string;
  edition: string | null;
  description: string | null;
  href: string;
  memberCount: number;
};

export type CmsLoadedCommittee = {
  id: string;
  name: string;
  slug: string;
  edition: string | null;
  description: string | null;
  category: string;
  members: CmsCommitteeMember[];
  seo: CmsSeoSnapshot | null;
};

export type CmsSpeakerCard = {
  id: string;
  fullName: string;
  slug: string;
  title: string | null;
  designation: string | null;
  institution: string | null;
  photoUrl: string | null;
  isFeatured: boolean;
  href: string;
};

export type CmsLoadedSpeaker = {
  id: string;
  fullName: string;
  slug: string;
  title: string | null;
  designation: string | null;
  institution: string | null;
  country: string | null;
  bio: string | null;
  photoUrl: string | null;
  topics: string[];
  tags: string[];
  languages: string[];
  socialLinks: Record<string, string>;
  seo: CmsSeoSnapshot | null;
};

export type CmsPartnerCard = {
  id: string;
  name: string;
  slug: string | null;
  logoUrl: string | null;
  website: string | null;
  description: string | null;
  partnerCategory: string;
  isFeatured: boolean;
};

export type CmsEventCard = {
  id: string;
  title: string;
  slug: string;
  description: string | null;
  edition: string | null;
  venue: string | null;
  location: string | null;
  startDate: string | null;
  endDate: string | null;
  bannerUrl: string | null;
  registrationLink: string | null;
  isFeatured: boolean;
  href: string;
};

export type CmsLoadedEvent = {
  id: string;
  title: string;
  slug: string;
  description: string | null;
  edition: string | null;
  venue: string | null;
  location: string | null;
  startDate: string | null;
  endDate: string | null;
  bannerUrl: string | null;
  registrationLink: string | null;
  highlights: unknown[];
  brochureUrl: string | null;
  seo: CmsSeoSnapshot | null;
};

export type CmsMediaCenterItem = {
  id: string;
  title: string;
  slug: string | null;
  excerpt: string | null;
  category: string;
  href: string;
  imageUrl: string | null;
  publishedAt: string | null;
  isFeatured: boolean;
  tags: string[];
  source: string;
};

export type CmsLoadedMediaEntry = {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  description: string | null;
  url: string;
  mediaType: string | null;
  category: string | null;
  tags: string[];
  publishedAt: string | null;
  seo: CmsSeoSnapshot | null;
};
