/**
 * Phase S2 — Hindi CMS seed (homepage, settings, notices, FAQ).
 * Usage: node scripts/seed-s2-hi.mjs [--publish]
 */
import "dotenv/config";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
const publish = process.argv.includes("--publish");
const locale = "hi";

const HOMEPAGE_SECTIONS = {
  hero: {
    headline: "शिक्षा महाकुंभ अभियान",
    subheadline: "वैश्विक शिक्षा के लिए राष्ट्रीय आंदोलन",
    description:
      "NEP 2020 और भारत@2047 के साथ संरेखित भारत के प्रमुख बहु-विषयक शिक्षा सम्मेलन में भाग लें।",
    badge: "शिक्षा महाकुंभ 6.0 · पंजीकरण खुला",
    dates: "📅 9–11 अक्टूबर 2026",
    venue: "📍 एनआईटी हमीरपुर, हिमाचल प्रदेश",
    imageUrl: "/shiksha.png",
  },
  stats: {
    tagline: "DHE की पहल · राष्ट्रीय संस्थानों के सहयोग से",
    features: [
      {
        title: "नीति और NEP 2020",
        description: "राष्ट्रीय शिक्षा नीति और संस्थागत रोडमैप पर चर्चा।",
        badge: "प्रभाव",
      },
    ],
    faqs: [],
  },
  gallery: {
    items: [
      {
        src: "/2024M/press5.jpg",
        alt: "शिक्षा महाकुंभ कार्यक्रम",
        legend: "शिक्षा महाकुंभ — राष्ट्रीय समारोह",
      },
    ],
  },
  announcements: {
    items: [
      {
        title: "शिक्षा महाकुंभ 6.0 — कार्यक्रम",
        body: "अधिवेशन, ओलंपियाड, प्रदर्शनी एवं पुरस्कार",
        detail: "शैक्षणिक परिषद के अंतर्गत सभी सत्रों की जानकारी देखें।",
        url: "/departments/academic-council",
        cta: "कार्यक्रम देखें",
      },
      {
        title: "पंजीकरण खुला — SMK 6.0",
        body: "9–11 अक्टूबर 2026 · एनआईटी हमीरपुर",
        detail: "सभी श्रेणियों के लिए एकीकृत पंजीकरण प्रारंभ।",
        url: "/registration",
        cta: "पंजीकरण करें",
      },
      {
        title: "बहु-ट्रैक सम्मेलन — सार-पत्र",
        body: "Microsoft CMT के माध्यम से जमा करें",
        detail: "शोध सार-पत्र और पत्र CMT पोर्टल पर जमा करें।",
        url: "https://cmt3.research.microsoft.com/ShikshaMahakumbh2025/",
        cta: "CMT पोर्टल",
      },
      {
        title: "आधिकारिक सूचनाएँ",
        body: "परिसर सूचनाएँ और समयसीमा",
        detail: "पंजीकरण, आवास और कार्यक्रम अपडेट नोटिस बोर्ड पर।",
        url: "/noticeboard",
        cta: "नोटिस बोर्ड",
      },
    ],
  },
};

const HINDI_NOTICES = [
  {
    slug: "smk-6-registration-hi",
    title: "शिक्षा महाकुंभ 6.0 — पंजीकरण खुला",
    description: "9–11 अक्टूबर 2026, एनआईटी हमीरपुर। सभी श्रेणियों के लिए पंजीकरण प्रारंभ।",
    isPinned: true,
  },
  {
    slug: "academic-programme-hi",
    title: "शैक्षिक कार्यक्रम एवं शोध सत्र",
    description: "बहु-ट्रैक सम्मेलन, ओलंपियाड और प्रदर्शनी की जानकारी।",
    isPinned: false,
  },
  {
    slug: "accommodation-hi",
    title: "आवास सुविधा",
    description: "पंजीकरण के दौरान आवास विकल्प चुनें; पुष्टि आयोजन समिति द्वारा।",
    isPinned: false,
  },
  {
    slug: "abstract-deadline-hi",
    title: "सार-पत्र जमा करने की अंतिम तिथि",
    description: "शोध सार-पत्र के लिए दिशानिर्देश अमूर्त पृष्ठ पर उपलब्ध।",
    isPinned: false,
  },
  {
    slug: "venue-travel-hi",
    title: "स्थान एवं यात्रा",
    description: "एनआईटी हमीरपुर पहुँचने के लिए यात्रा और स्थानीय जानकारी।",
    isPinned: false,
  },
];

const HINDI_FAQS = [
  {
    question: "शिक्षा महाकुंभ अभियान क्या है?",
    answer: "NEP 2020 और भारत@2047 के साथ संरेखित राष्ट्रीय–अंतर्राष्ट्रीय बहु-विषयक शिक्षा आंदोलन।",
    isFeatured: true,
  },
  {
    question: "SMK 6.0 कब और कहाँ है?",
    answer: "9–11 अक्टूबर 2026, एनआईटी हमीरपुर, हिमाचल प्रदेश।",
    isFeatured: true,
  },
];

async function seedHomepageHi() {
  const page = await prisma.page.upsert({
    where: { slug_locale: { slug: "home", locale } },
    create: {
      title: "मुखपृष्ठ",
      slug: "home",
      pageType: "homepage",
      locale,
      status: publish ? "published" : "draft",
      publishAt: publish ? new Date() : null,
      publishedAt: publish ? new Date() : null,
    },
    update: {
      ...(publish
        ? { status: "published", publishAt: new Date(), publishedAt: new Date() }
        : {}),
    },
  });

  for (const [index, [key, content]] of Object.entries(HOMEPAGE_SECTIONS).entries()) {
    await prisma.pageSection.upsert({
      where: { pageId_sectionKey: { pageId: page.id, sectionKey: key } },
      create: {
        pageId: page.id,
        sectionKey: key,
        sectionType: key === "hero" ? "hero" : key === "gallery" ? "gallery" : "stats",
        content,
        sortOrder: index,
      },
      update: { content },
    });
  }
  console.log("✓ Hindi homepage sections seeded");
}

async function seedSettingsHi() {
  await prisma.siteSetting.upsert({
    where: { locale },
    create: {
      locale,
      organizationName: "शिक्षा महाकुंभ अभियान",
      tagline: "वैश्विक शिक्षा के लिए राष्ट्रीय आंदोलन",
      contactEmail: "academics@shikshamahakumbh.com",
      supportEmail: "academics@shikshamahakumbh.com",
      copyrightText: "© शिक्षा महाकुंभ अभियान",
      registrationOpen: true,
    },
    update: {
      organizationName: "शिक्षा महाकुंभ अभियान",
      tagline: "वैश्विक शिक्षा के लिए राष्ट्रीय आंदोलन",
    },
  });
  console.log("✓ Hindi site settings seeded");
}

async function seedNoticesHi() {
  let category = await prisma.noticeCategory.findFirst({
    where: { slug: "general", deletedAt: null },
  });
  if (!category) {
    category = await prisma.noticeCategory.create({
      data: { name: "सामान्य", slug: "general", isActive: true },
    });
  }

  for (const notice of HINDI_NOTICES) {
    await prisma.notice.upsert({
      where: { slug_locale: { slug: notice.slug, locale } },
      create: {
        ...notice,
        locale,
        categoryId: category.id,
        status: publish ? "published" : "draft",
        publishAt: publish ? new Date() : null,
        priority: notice.isPinned ? 10 : 0,
        description: notice.description,
      },
      update: {
        title: notice.title,
        description: notice.description,
        isPinned: notice.isPinned,
        ...(publish ? { status: "published", publishAt: new Date() } : {}),
      },
    });
  }
  console.log(`✓ ${HINDI_NOTICES.length} Hindi notices seeded`);
}

async function seedFaqHi() {
  const category = await prisma.faqCategory.upsert({
    where: { slug_locale: { slug: "samaanya", locale } },
    create: { name: "सामान्य", slug: "samaanya", locale, isActive: true },
    update: { isActive: true },
  });

  for (const [index, item] of HINDI_FAQS.entries()) {
    const existing = await prisma.faq.findFirst({
      where: { question: item.question, locale, deletedAt: null },
    });
    if (existing) {
      await prisma.faq.update({
        where: { id: existing.id },
        data: {
          answer: item.answer,
          isFeatured: item.isFeatured,
          categoryId: category.id,
          status: publish ? "published" : "draft",
          sortOrder: index,
        },
      });
    } else {
      await prisma.faq.create({
        data: {
          ...item,
          locale,
          categoryId: category.id,
          sortOrder: index,
          status: publish ? "published" : "draft",
        },
      });
    }
  }
  console.log("✓ Hindi FAQ items seeded");
}

async function main() {
  console.log(`Seeding Hindi CMS content… (publish=${publish})`);
  await seedHomepageHi();
  await seedSettingsHi();
  await seedNoticesHi();
  await seedFaqHi();
  console.log("Done.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
