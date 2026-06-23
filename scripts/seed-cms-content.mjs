/**
 * Phase B.7 — Seed production-ready CMS starter content.
 * Usage: node scripts/seed-cms-content.mjs
 * Requires: DATABASE_URL, optional ADMIN_OPS_SECRET for API verification
 */
import "dotenv/config";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

/** Maps section_key → Prisma PageSectionType (keys may differ from enum names). */
const SECTION_TYPE_BY_KEY = {
  counters: "counter",
  testimonials: "testimonial",
  partners: "partner",
  announcements: "announcement",
};

const HOMEPAGE_SECTIONS = {
  hero: {
    headline: "शिक्षा महाकुंभ अभियान",
    subheadline: "A National Movement for Global Education",
    description:
      "Join policymakers, researchers, institutions, and youth at India's premier multidisciplinary education summit — aligned with NEP 2020 and the Bharat@2047 vision.",
    badge: "Shiksha Mahakumbh 6.0 · Registration Open",
    dates: "📅 9–11 October 2026",
    venue: "📍 NIT Hamirpur, HP",
    imageUrl: "/shiksha.png",
  },
  counters: {
    items: [
      { label: "Major Editions", value: "5" },
      { label: "Current Edition", value: "6", suffix: ".0" },
      { label: "Institutions Engaged", value: "500", suffix: "+" },
      { label: "Bharat@2047 Vision", value: "2047" },
    ],
  },
  stats: {
    tagline: "An initiative of DHE · In collaboration with INIs & national partners",
    features: [
      { title: "Policy & NEP 2020", description: "Engage with national education policy and institutional roadmaps.", badge: "Impact" },
      { title: "Research & Publications", description: "Present abstracts and proceedings aligned with global education research.", badge: "Academic" },
      { title: "Olympiads & Talent", description: "Compete in olympiads and cultural programmes celebrating student excellence." },
    ],
    faqs: [
      { question: "What is Shiksha Mahakumbh Abhiyan?", answer: "A national–international multidisciplinary education movement aligned with NEP 2020 and Bharat@2047." },
      { question: "When and where is SMK 6.0?", answer: "9–11 October 2026 at NIT Hamirpur, Himachal Pradesh, India." },
      { question: "How do I register?", answer: "Use the unified registration portal at rase.co.in/registration." },
    ],
  },
  featured_events: {
    items: [
      { title: "Shiksha Mahakumbh 2026", date: "09–11 October 2026", venue: "NIT Hamirpur", url: "/registration" },
      { title: "Shiksha Mahakumbh 2027", date: "To Be Announced", venue: "IIT Jammu", url: "/upcoming-events" },
    ],
  },
  featured_programs: {
    items: [
      { title: "Multi-Track Conclaves", description: "Holistic education, policy, and Bharatiya knowledge systems.", url: "/departments/academic-council", badge: "Conclave" },
      { title: "Multi Track Conference", description: "Submit papers and abstracts via Microsoft CMT.", url: "https://cmt3.research.microsoft.com/ShikshaMahakumbh2025/", badge: "Research" },
      { title: "Olympiads & Awards", description: "Student olympiads, best practices, and recognition awards.", url: "/registration", badge: "Students" },
    ],
  },
  testimonials: {
    items: [
      { name: "Academic Delegate", role: "Higher Education Institution", quote: "Shiksha Mahakumbh brings together policy, practice, and research in a way few national platforms achieve." },
      { name: "School Coordinator", role: "Vidya Bharati Network", quote: "The multi-track conclaves and olympiads create real opportunities for students beyond classroom learning." },
    ],
  },
  partners: {
    items: [
      { name: "DHE", logoUrl: "/logo.png", website: "https://www.dhe.org.in/", type: "academic" },
      { name: "Vidya Bharati", logoUrl: "/vidyabharti.png", website: "https://vidyabharti.net/", type: "academic" },
    ],
  },
  announcements: {
    items: [
      {
        title: "Programmes @ Shiksha Mahakumbh 6.0",
        body: "7 conclaves, olympiads, exhibitions, awards & more",
        detail:
          "Explore the Academic Council schedule — policy conclaves, DHE Olympiads, best practices, student projects, and Bal Shodh Patrika at NIT Hamirpur.",
        url: "/departments/academic-council",
        cta: "View Programmes",
      },
      {
        title: "Registration Open — Shiksha Mahakumbh 6.0",
        body: "9–11 Oct 2026 · NIT Hamirpur · All registration types",
        detail:
          "Delegates, institutions, volunteers, exhibitors, and accommodation requests — complete unified registration for SMK 6.0.",
        url: "/registration",
        cta: "Register Now",
      },
      {
        title: "Multi-Track Conference — Submit Research",
        body: "Paper & abstract submission via Microsoft CMT",
        detail:
          "Authors may submit to the Multi-Track International Conference. Formatting guidelines and track details are on the abstract portal.",
        url: "https://cmt3.research.microsoft.com/ShikshaMahakumbh2025/",
        cta: "Open CMT Portal",
      },
      {
        title: "Official Notices & Deadlines",
        body: "Campus circulars, accommodation, and programme updates",
        detail:
          "Registration windows, abstract timelines, and venue advisories are published on the notice board.",
        url: "/noticeboard",
        cta: "View Notice Board",
      },
    ],
  },
  cta: {
    editionLabel: "6th Edition",
    headline: "NIT Hamirpur · 9–11 Oct 2026",
    body: "Multi-track conclaves, olympiads, research, exhibitions, and awards.",
    buttonLabel: "View full programme",
    buttonUrl: "/departments/academic-council",
  },
};

async function seedHomepage() {
  let page = await prisma.page.findFirst({
    where: { slug: "home", pageType: "homepage", locale: "en", deletedAt: null },
  });
  if (!page) {
    page = await prisma.page.create({
      data: {
        title: "Homepage",
        slug: "home",
        pageType: "homepage",
        locale: "en",
        status: "draft",
      },
    });
  }

  const keys = Object.keys(HOMEPAGE_SECTIONS);
  for (let i = 0; i < keys.length; i++) {
    const sectionKey = keys[i];
    const content = HOMEPAGE_SECTIONS[sectionKey];
    await prisma.pageSection.upsert({
      where: { pageId_sectionKey: { pageId: page.id, sectionKey } },
      create: {
        pageId: page.id,
        sectionKey,
        sectionType: SECTION_TYPE_BY_KEY[sectionKey] ?? sectionKey,
        title: sectionKey.replace(/_/g, " "),
        content,
        sortOrder: i,
        isVisible: true,
      },
      update: { content, sortOrder: i, isVisible: true },
    });
  }

  await prisma.seoMetadata.upsert({
    where: { entityType_entityId_locale: { entityType: "page", entityId: page.id, locale: "en" } },
    create: {
      entityType: "page",
      entityId: page.id,
      locale: "en",
      seoTitle: "Shiksha Mahakumbh 6.0 — National Education Summit",
      metaDescription:
        "Join Shiksha Mahakumbh 6.0 at NIT Hamirpur, 9–11 October 2026. India's premier multidisciplinary education summit.",
      canonicalUrl: "/",
      sitemapPriority: 1,
      sitemapChangefreq: "daily",
    },
    update: {
      seoTitle: "Shiksha Mahakumbh 6.0 — National Education Summit",
      metaDescription:
        "Join Shiksha Mahakumbh 6.0 at NIT Hamirpur, 9–11 October 2026. India's premier multidisciplinary education summit.",
      canonicalUrl: "/",
    },
  });

  console.log("✓ Homepage sections seeded");
  return page.id;
}

async function seedSettings() {
  await prisma.siteSetting.upsert({
    where: { locale: "en" },
    create: {
      locale: "en",
      organizationName: "Department of Holistic Education (DHE)",
      tagline: "Shiksha Mahakumbh Abhiyan",
      contactEmail: "info@rase.co.in",
      supportEmail: "support@rase.co.in",
      phoneNumbers: ["+91 98765 43210"],
      socialLinks: {
        youtube: "https://www.youtube.com/@ShikshaMahakumbh",
        facebook: "https://www.facebook.com/shikshamahakumbh",
        linkedin: "https://www.linkedin.com/in/shiksha-mahakumbh-abhiyan-3a134a283",
      },
      copyrightText: "© Department of Holistic Education (DHE). All Rights Reserved.",
      registrationOpen: true,
      maintenanceMode: false,
    },
    update: {
      organizationName: "Department of Holistic Education (DHE)",
      tagline: "Shiksha Mahakumbh Abhiyan",
      registrationOpen: true,
      maintenanceMode: false,
    },
  });
  console.log("✓ Site settings seeded");
}

async function seedNotices() {
  const categories = [
    { name: "General", slug: "general", sortOrder: 0 },
    { name: "Registration", slug: "registration", sortOrder: 1 },
    { name: "Programmes", slug: "programmes", sortOrder: 2 },
  ];

  const catIds = {};
  for (const c of categories) {
    const row = await prisma.noticeCategory.upsert({
      where: { slug: c.slug },
      create: { name: c.name, slug: c.slug, sortOrder: c.sortOrder },
      update: { name: c.name, sortOrder: c.sortOrder },
    });
    catIds[c.slug] = row.id;
  }

  const notices = [
    {
      title: "Registration Open — Shiksha Mahakumbh 6.0",
      slug: "registration-open-smk-6",
      description:
        "Unified registration is open for delegates, academic conclaves, DHE Olympiads, exhibitions, project displays, and accommodation requests. The summit runs 9–11 October 2026 at NIT Hamirpur, Hamirpur, Himachal Pradesh, India.",
      categoryId: catIds.registration,
      isPinned: true,
      priority: 10,
      status: "published",
    },
    {
      title: "Venue & Dates — NIT Hamirpur",
      slug: "venue-dates-smk-6",
      description:
        "Shiksha Mahakumbh 6.0 will be hosted at NIT Hamirpur, Himachal Pradesh on 9–11 October 2026. Plan travel via Dharamshala (Gaggal) or Chandigarh airports.",
      categoryId: catIds.general,
      isPinned: true,
      priority: 9,
      status: "published",
    },
    {
      title: "Multi-Track Conference — Paper & Abstract Submission",
      slug: "mtc-abstract-submission-2026",
      description:
        "Authors may submit research papers and abstracts through the official CMT portal. Formatting guidelines and track listings are on the abstract submission page.",
      categoryId: catIds.programmes,
      isPinned: false,
      priority: 7,
      status: "published",
    },
    {
      title: "DHE Olympiads & Talent Programmes — Enrolment Open",
      slug: "dhe-olympiads-2026",
      description:
        "School and higher-education olympiad tracks and talent conclave participation are open via the registration hub.",
      categoryId: catIds.programmes,
      isPinned: false,
      priority: 6,
      status: "published",
    },
    {
      title: "Accommodation — Request via Registration",
      slug: "accommodation-smk-6",
      description:
        "Delegates requiring accommodation should indicate preferences during registration. Allotment confirmations will be shared closer to the event.",
      categoryId: catIds.registration,
      isPinned: false,
      priority: 5,
      status: "published",
    },
    {
      title: "Sponsorship & Institutional Partnership Window",
      slug: "sponsorship-partnership-2026",
      description:
        "CSR, industry, media, and institutional partnership enquiries are invited for Shiksha Mahakumbh 6.0.",
      categoryId: catIds.general,
      isPinned: false,
      priority: 4,
      status: "published",
    },
    {
      title: "Project Display & Exhibition Registration",
      slug: "project-display-exhibition-2026",
      description:
        "HEIs and student innovators may register for project displays and best-practice exhibitions via the registration portal.",
      categoryId: catIds.programmes,
      isPinned: false,
      priority: 3,
      status: "published",
    },
    {
      title: "Volunteer Orientation & Campus Roles",
      slug: "volunteer-orientation-2026",
      description:
        "Volunteer orientation briefings for registration desks and conclave logistics will be scheduled before the summit.",
      categoryId: catIds.general,
      isPinned: false,
      priority: 2,
      status: "published",
    },
  ];

  for (const n of notices) {
    await prisma.notice.upsert({
      where: { slug_locale: { slug: n.slug, locale: "en" } },
      create: {
        ...n,
        locale: "en",
        publishAt: new Date(),
        priority: n.priority ?? (n.isPinned ? 10 : 0),
      },
      update: {
        title: n.title,
        description: n.description,
        categoryId: n.categoryId,
        isPinned: n.isPinned,
        priority: n.priority ?? (n.isPinned ? 10 : 0),
        status: n.status,
        publishAt: new Date(),
      },
    });
  }
  console.log(`✓ ${notices.length} notice categories and published notices seeded`);
}

async function seedAnnouncementBar() {
  const bars = [
    {
      title: "SMK 6.0 Registration",
      message: "Join the national educational movement at NIT Hamirpur, 9–11 October 2026.",
      barType: "global",
      colorTheme: "navy",
      ctaLabel: "Register now",
      ctaUrl: "/registration",
      priority: 10,
    },
    {
      title: "Programmes & Conclaves",
      message: "Explore 7 thematic conclaves, olympiads, exhibitions, and the Multi-Track Conference.",
      barType: "global",
      colorTheme: "primary",
      ctaLabel: "View programmes",
      ctaUrl: "/departments/academic-council",
      priority: 8,
    },
    {
      title: "Notice Board",
      message: "Official circulars, deadlines, and campus updates for delegates and institutions.",
      barType: "global",
      colorTheme: "primary",
      ctaLabel: "View notices",
      ctaUrl: "/noticeboard",
      priority: 6,
    },
  ];

  for (const bar of bars) {
    const existing = await prisma.announcementBar.findFirst({
      where: { title: bar.title, locale: "en", deletedAt: null },
    });
    if (existing) {
      await prisma.announcementBar.update({
        where: { id: existing.id },
        data: { ...bar, isDismissible: true, isActive: true },
      });
    } else {
      await prisma.announcementBar.create({
        data: {
          ...bar,
          isDismissible: true,
          isActive: true,
          locale: "en",
        },
      });
    }
  }
  console.log(`✓ ${bars.length} announcement bars seeded`);
}

async function seedMenus() {
  for (const def of [
    { name: "Header Navigation", slug: "header", menuType: "header" },
    { name: "Footer Navigation", slug: "footer", menuType: "footer" },
  ]) {
    const menu = await prisma.menu.upsert({
      where: { slug_locale: { slug: def.slug, locale: "en" } },
      create: { ...def, locale: "en", isActive: true },
      update: { isActive: true },
    });

    const items =
      def.slug === "header"
        ? [
            { label: "Home", url: "/", sortOrder: 0 },
            { label: "Registration", url: "/registration", sortOrder: 1 },
            { label: "Notice Board", url: "/noticeboard", sortOrder: 2 },
            { label: "Downloads", url: "/downloads", sortOrder: 3 },
          ]
        : [
            { label: "Home", url: "/", sortOrder: 0 },
            { label: "Registration", url: "/registration", sortOrder: 1 },
            { label: "Shiksha Mahakumbh 6.0", url: "/upcoming-events", sortOrder: 2 },
            { label: "Notice Board", url: "/noticeboard", sortOrder: 3 },
            { label: "Downloads", url: "/downloads", sortOrder: 4 },
            { label: "Introduction", url: "/introduction", sortOrder: 5 },
            { label: "Contact", url: "/contact-us", sortOrder: 6 },
            { label: "Privacy Policy", url: "/privacy-policy", sortOrder: 7 },
          ];

    for (const item of items) {
      const exists = await prisma.menuItem.findFirst({
        where: { menuId: menu.id, label: item.label },
      });
      if (!exists) {
        await prisma.menuItem.create({
          data: { menuId: menu.id, ...item, isExternal: item.url.startsWith("http") },
        });
      }
    }
  }
  console.log("✓ Header and footer menus seeded");
}

async function main() {
  console.log("Seeding CMS starter content…");
  await seedHomepage();
  await seedSettings();
  await seedNotices();
  await seedAnnouncementBar();
  await seedMenus();
  console.log("Done. Publish homepage via /admin/cms/homepage when ready.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
