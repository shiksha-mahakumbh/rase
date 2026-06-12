/**
 * Phase S2 — Seed press articles, legal pages, and FAQ starter content.
 * Usage: node scripts/seed-s2-content.mjs [--publish]
 */
import "dotenv/config";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
const publish = process.argv.includes("--publish");

const PRESS_ARTICLES = [
  {
    slug: "education-summit-coverage",
    locale: "en",
    title: "Shiksha Mahakumbh 2024 begins at Kurukshetra University",
    excerpt:
      "Human behaviour has indispensable role in Indian education. Entrepreneurship cells must be established in Higher Education.",
    heroImage: "/2024M/Press7.jpg",
    sections: [
      {
        title: "Inaugural session highlights",
        body: "Kurukshetra University organized the inaugural session of Shiksha Maha Kumbh 2024 on Indian Education System for Global Development under the joint aegis of Department of Holistic Education.",
        type: "text",
      },
    ],
  },
  {
    slug: "baton-ceremony-smk-4",
    locale: "en",
    title: "Baton Ceremony — Shiksha Mahakumbh 2.0",
    excerpt:
      "A Grand Start to Shiksha Mahakumbh 2.0: Baton Ceremony Successfully Concluded at Kurukshetra.",
    heroImage: "/2024M/press1.jpg",
    sections: [],
  },
  {
    slug: "summit-highlights",
    locale: "en",
    title: "Summit Highlights",
    excerpt: "Key highlights from the Shiksha Mahakumbh national education summit.",
    heroImage: "/2024M/press5.jpg",
    sections: [],
  },
  {
    slug: "shiksha-mahakumbh-4-0",
    locale: "hi",
    title: "कुरुक्षेत्र हरियाणा में आयोजित होगा द्वितीय शिक्षा महाकुंभ 2024।",
    excerpt:
      "आगामी 16 तथा 17 दिसंबर 2024 को कुरुक्षेत्र विश्वविद्यालय में द्वितीय शिक्षा महाकुंभ का आयोजन।",
    heroImage: "/2024M/press2.jpg",
    sections: [],
  },
  {
    slug: "residential-camp-success",
    locale: "hi",
    title: "शिक्षा महाकुंभ-2024 (द्वितीय संस्करण)",
    excerpt: "आवासीय अभ्यास वर्ग – सफलता की ओर एक और कदम",
    heroImage: "/2024M/res/res9.jpg",
    sections: [],
  },
  {
    slug: "residential-camp-hindi",
    locale: "hi",
    title: '"हवन रश्म" के साथ शिक्षा महाकुंभ 2.0 का शुरू हुआ काउंटडाउन',
    excerpt:
      'शिक्षा महाकुंभ 2.0 की तैयारियों के अंतर्गत UIET, कुरुक्षेत्र विश्वविद्यालय में "हवन रश्म" का आयोजन।',
    heroImage: "/2024M/press4.jpg",
    sections: [],
  },
  {
    slug: "mahakumbh-programme-update",
    locale: "hi",
    title: "शिक्षा महाकुंभ कार्यक्रम अपडेट",
    excerpt: "कार्यक्रम और सत्रों की नवीनतम जानकारी।",
    heroImage: "/2024M/press5.jpg",
    sections: [],
  },
  {
    slug: "national-coverage",
    locale: "hi",
    title: "राष्ट्रीय शिक्षा नीति से राष्ट्रीय भावना को मिला सम्मानः प्रोफेसर सोमनाथ सचदेवा",
    excerpt:
      "कुवि में डिपार्टमेंट ऑफ होलिस्टिक एजुकेशन तथा केयू के संयुक्त तत्वावधान में दो दिवसीय शिक्षा महाकुंभ का सफल समारोप।",
    heroImage: "/2024M/press5.jpg",
    sections: [],
  },
  {
    slug: "education-movement",
    locale: "hi",
    title: "शिक्षा महाकुंभ अभियान — राष्ट्रीय शिक्षा आंदोलन",
    excerpt: "NEP 2020 और भारत@2047 के साथ संरेखित बहु-विषयक शिक्षा आंदोलन।",
    heroImage: "/2024M/press5.jpg",
    sections: [],
  },
];

const LEGAL_PAGES = [
  {
    slug: "privacy-policy",
    title: "Privacy Policy",
    content: `<p>Last updated: May 2026</p>
<h2>Information we collect</h2>
<p>When you register for Shiksha Mahakumbh events, we collect information you provide voluntarily.</p>
<h2>How we use information</h2>
<p>Data is used for event administration, communication, and programme management.</p>
<h2>Your rights</h2>
<p>Contact <a href="mailto:academics@shikshamahakumbh.com">academics@shikshamahakumbh.com</a> for corrections or deletion requests.</p>`,
  },
  {
    slug: "terms-and-conditions",
    title: "Terms and Conditions",
    content: `<p>Last updated: May 2026</p>
<h2>Acceptance</h2>
<p>By accessing this website you agree to these terms and to provide accurate information.</p>
<h2>Registrations</h2>
<p>Fees are non-refundable unless stated otherwise in the refund policy.</p>`,
  },
  {
    slug: "cookie-policy",
    title: "Cookie Policy",
    content: `<h2>Essential cookies</h2>
<p>Required for security and core registration functionality.</p>
<h2>Analytics cookies</h2>
<p>Loaded only after you accept cookies on the consent banner.</p>`,
  },
  {
    slug: "disclaimer",
    title: "Disclaimer",
    content: `<p>Information is published in good faith. Schedules and programmes may change.</p>`,
  },
  {
    slug: "refund-policy",
    title: "Refund Policy",
    content: `<h2>Registration fees</h2>
<p>Paid registrations are generally non-refundable once confirmed, except where the event is cancelled.</p>`,
  },
];

const FAQ_STARTER = [
  {
    category: "General",
    locale: "en",
    items: [
      {
        question: "What is Shiksha Mahakumbh Abhiyan?",
        answer:
          "A national–international multidisciplinary education movement aligned with NEP 2020 and Bharat@2047.",
        isFeatured: true,
      },
      {
        question: "When and where is SMK 6.0?",
        answer: "9–11 October 2026 at NIT Hamirpur, Himachal Pradesh, India.",
        isFeatured: true,
      },
      {
        question: "How do I register?",
        answer: "Use the unified registration portal at rase.co.in/registration.",
        isFeatured: true,
      },
    ],
  },
];

async function upsertPage({ slug, locale, title, excerpt, content, pageType, sectionContent }) {
  const now = publish ? new Date() : null;
  const page = await prisma.page.upsert({
    where: { slug_locale: { slug, locale } },
    create: {
      title,
      slug,
      locale,
      pageType,
      excerpt: excerpt ?? null,
      content: content ?? null,
      status: publish ? "published" : "draft",
      publishAt: now,
      publishedAt: now,
    },
    update: {
      title,
      excerpt: excerpt ?? null,
      content: content ?? null,
      pageType,
      ...(publish
        ? { status: "published", publishAt: now, publishedAt: now }
        : {}),
    },
  });

  if (sectionContent) {
    await prisma.pageSection.upsert({
      where: { pageId_sectionKey: { pageId: page.id, sectionKey: "article" } },
      create: {
        pageId: page.id,
        sectionKey: "article",
        sectionType: "content",
        content: sectionContent,
      },
      update: { content: sectionContent },
    });
  }

  await prisma.seoMetadata.upsert({
    where: {
      entityType_entityId_locale: {
        entityType: "page",
        entityId: page.id,
        locale,
      },
    },
    create: {
      entityType: "page",
      entityId: page.id,
      locale,
      seoTitle: title,
      metaDescription: excerpt ?? title,
      canonicalUrl: pageType === "article" ? `/press/${slug}` : `/${slug}`,
      ogImageUrl: sectionContent?.heroImage ?? null,
    },
    update: {
      seoTitle: title,
      metaDescription: excerpt ?? title,
      canonicalUrl: pageType === "article" ? `/press/${slug}` : `/${slug}`,
      ogImageUrl: sectionContent?.heroImage ?? null,
    },
  });

  return page;
}

async function seedPress() {
  for (const article of PRESS_ARTICLES) {
    await upsertPage({
      slug: article.slug,
      locale: article.locale,
      title: article.title,
      excerpt: article.excerpt,
      pageType: "article",
      sectionContent: {
        heroImage: article.heroImage,
        excerpt: article.excerpt,
        sections: article.sections,
      },
    });
  }
  console.log(`✓ ${PRESS_ARTICLES.length} press articles seeded (${publish ? "published" : "draft"})`);
}

async function seedLegal() {
  for (const legal of LEGAL_PAGES) {
    await upsertPage({
      slug: legal.slug,
      locale: "en",
      title: legal.title,
      content: legal.content,
      pageType: "policy",
    });
  }
  console.log(`✓ ${LEGAL_PAGES.length} legal pages seeded (${publish ? "published" : "draft"})`);
}

async function seedFaq() {
  for (const group of FAQ_STARTER) {
    const category = await prisma.faqCategory.upsert({
      where: { slug_locale: { slug: group.category.toLowerCase().replace(/\s+/g, "-"), locale: group.locale } },
      create: {
        name: group.category,
        slug: group.category.toLowerCase().replace(/\s+/g, "-"),
        locale: group.locale,
        isActive: true,
      },
      update: { isActive: true },
    });

    for (const [index, item] of group.items.entries()) {
      const existing = await prisma.faq.findFirst({
        where: { question: item.question, locale: group.locale, deletedAt: null },
      });
      if (existing) {
        await prisma.faq.update({
          where: { id: existing.id },
          data: {
            answer: item.answer,
            isFeatured: item.isFeatured,
            categoryId: category.id,
            sortOrder: index,
            status: publish ? "published" : "draft",
          },
        });
      } else {
        await prisma.faq.create({
          data: {
            question: item.question,
            answer: item.answer,
            locale: group.locale,
            categoryId: category.id,
            isFeatured: item.isFeatured,
            sortOrder: index,
            status: publish ? "published" : "draft",
          },
        });
      }
    }
  }
  console.log("✓ FAQ starter content seeded");
}

const DEPARTMENTS = [
  { slug: "academic-council", title: "Academic Council", excerpt: "Academic programmes, research tracks, and council initiatives" },
  { slug: "prabandhan", title: "Prabandhan Vibhag", excerpt: "Event management, logistics, and operations coordination" },
  { slug: "prachar", title: "Prachar Vibhag", excerpt: "Outreach, publicity, and communications" },
  { slug: "sampark", title: "Sampark Vibhag", excerpt: "Institutional liaison and stakeholder engagement" },
  { slug: "vitt", title: "Vitt Vibhag", excerpt: "Finance and sponsorship coordination" },
];

const GALLERY_ALBUM = {
  slug: "smk-highlights",
  title: "Shiksha Mahakumbh Highlights",
  description: "Ceremonies, dignitaries, and national participation across editions.",
  items: [
    { imageUrl: "/2024M/Vyakhanmala.jpg", altText: "Vyakhanmala lecture series", caption: "Vyakhanmala: Panchakosha & Bharatiya Jnana Parampara" },
    { imageUrl: "/2024M/Press8.jpg", altText: "Abstract booklet release", caption: "Release of abstract booklet" },
    { imageUrl: "/2024M/Press7.jpg", altText: "Inauguration jyoti", caption: "Inauguration of Shiksha Mahakumbh 4.0" },
    { imageUrl: "/2024K/k6.jpg", altText: "Invitation to President", caption: "Invitation to Hon'ble President of Bharat" },
    { imageUrl: "/2023M/anurag_singh_thakur.JPG", altText: "Minister addressing conference", caption: "Hon'ble Cabinet Minister addressing gathering" },
    { imageUrl: "/2024K/k12.png", altText: "Dignitaries at Mahakumbh", caption: "Dignitaries and policymakers at the platform" },
  ],
};

async function seedDepartments() {
  for (const dept of DEPARTMENTS) {
    await upsertPage({
      slug: dept.slug,
      locale: "en",
      title: dept.title,
      excerpt: dept.excerpt,
      content: `<p>${dept.excerpt}. Full programme details are managed via the department CMS editor.</p>`,
      pageType: "department",
    });
  }
  console.log(`✓ ${DEPARTMENTS.length} department pages seeded`);
}

async function seedGallery() {
  const album = await prisma.mediaAlbum.upsert({
    where: { slug_locale: { slug: GALLERY_ALBUM.slug, locale: "en" } },
    create: {
      title: GALLERY_ALBUM.title,
      slug: GALLERY_ALBUM.slug,
      description: GALLERY_ALBUM.description,
      albumType: "gallery",
      locale: "en",
      status: publish ? "published" : "draft",
    },
    update: {
      title: GALLERY_ALBUM.title,
      description: GALLERY_ALBUM.description,
      ...(publish ? { status: "published" } : {}),
    },
  });

  await prisma.mediaAlbumItem.deleteMany({ where: { albumId: album.id } });
  await prisma.mediaAlbumItem.createMany({
    data: GALLERY_ALBUM.items.map((item, index) => ({
      albumId: album.id,
      imageUrl: item.imageUrl,
      altText: item.altText,
      caption: item.caption,
      sortOrder: index,
    })),
  });

  const homepage = await prisma.page.findFirst({
    where: { slug: "home", pageType: "homepage", locale: "en", deletedAt: null },
  });
  if (homepage) {
    await prisma.pageSection.upsert({
      where: { pageId_sectionKey: { pageId: homepage.id, sectionKey: "gallery" } },
      create: {
        pageId: homepage.id,
        sectionKey: "gallery",
        sectionType: "gallery",
        content: {
          items: GALLERY_ALBUM.items.map((item) => ({
            src: item.imageUrl,
            alt: item.altText,
            legend: item.caption,
          })),
        },
      },
      update: {
        content: {
          items: GALLERY_ALBUM.items.map((item) => ({
            src: item.imageUrl,
            alt: item.altText,
            legend: item.caption,
          })),
        },
      },
    });
  }

  console.log("✓ Gallery album and homepage gallery section seeded");
}

async function main() {
  console.log(`Seeding S2 content… (publish=${publish})`);
  await seedPress();
  await seedLegal();
  await seedFaq();
  await seedDepartments();
  await seedGallery();
  console.log("Done.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
