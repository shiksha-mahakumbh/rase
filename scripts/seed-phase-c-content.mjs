/**
 * Phase C — Seed organizational CMS content (committees, speakers, partners, events, media center).
 * Usage: node scripts/seed-phase-c-content.mjs [--publish]
 */
import "dotenv/config";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
const publish = process.argv.includes("--publish");
const status = publish ? "published" : "draft";
const eventStatus = publish ? "published" : "draft";

const COMMITTEES = [
  {
    slug: "organizing-committee-2024",
    edition: "2024",
    locale: "en",
    name: "Organizing Committee — Shiksha Mahakumbh 2024",
    category: "Organizing_Committee",
    description: "National organizing committee for Shiksha Mahakumbh 2024 at Kurukshetra University.",
    members: [
      { fullName: "Prof. Som Nath", designation: "Chairperson", institution: "Kurukshetra University", sortOrder: 0 },
      { fullName: "Dr. Rajesh Kumar", designation: "Convener", institution: "UIET, KUK", sortOrder: 1 },
    ],
  },
  {
    slug: "organizing-committee-2024",
    edition: "2024",
    locale: "hi",
    name: "आयोजन समिति — शिक्षा महाकुंभ 2024",
    category: "Organizing_Committee",
    description: "कुरुक्षेत्र विश्वविद्यालय में शिक्षा महाकुंभ 2024 की राष्ट्रीय आयोजन समिति।",
    members: [
      { fullName: "प्रो. सोम नाथ", designation: "अध्यक्ष", institution: "कुरुक्षेत्र विश्वविद्यालय", sortOrder: 0 },
      { fullName: "डॉ. राजेश कुमार", designation: "संयोजक", institution: "UIET, KUK", sortOrder: 1 },
    ],
  },
];

const SPEAKERS = [
  {
    slug: "prof-som-nath",
    locale: "en",
    fullName: "Prof. Som Nath",
    designation: "Vice Chancellor",
    institution: "Kurukshetra University",
    country: "India",
    category: "keynote",
    bio: "Leading advocate for holistic education reform in India.",
    topics: ["Holistic Education", "Policy Reform"],
    languages: ["en", "hi"],
    isFeatured: true,
    sortOrder: 0,
  },
  {
    slug: "prof-som-nath",
    locale: "hi",
    fullName: "प्रो. सोम नाथ",
    designation: "कुलपति",
    institution: "कुरुक्षेत्र विश्वविद्यालय",
    country: "भारत",
    category: "keynote",
    bio: "भारत में समग्र शिक्षा सुधार के प्रमुख समर्थक।",
    topics: ["समग्र शिक्षा", "नीति सुधार"],
    languages: ["hi", "en"],
    isFeatured: true,
    sortOrder: 0,
  },
];

const PARTNERS = [
  {
    name: "Kurukshetra University",
    slug: "kurukshetra-university",
    locale: "en",
    partnerCategory: "academic",
    website: "https://kuk.ac.in",
    logoUrl: "/partners/kuk.png",
    description: "Host institution for Shiksha Mahakumbh.",
    isFeatured: true,
    sortOrder: 0,
  },
  {
    name: "कुरुक्षेत्र विश्वविद्यालय",
    slug: "kurukshetra-university",
    locale: "hi",
    partnerCategory: "academic",
    website: "https://kuk.ac.in",
    logoUrl: "/partners/kuk.png",
    description: "शिक्षा महाकुंभ की आयोजक संस्था।",
    isFeatured: true,
    sortOrder: 0,
  },
  {
    name: "Ministry of Education",
    slug: "ministry-of-education",
    locale: "en",
    partnerCategory: "government",
    website: "https://www.education.gov.in",
    logoUrl: "/partners/moe.png",
    isFeatured: true,
    sortOrder: 1,
  },
];

const EVENTS = [
  {
    slug: "shiksha-mahakumbh-2024",
    locale: "en",
    title: "Shiksha Mahakumbh 2024",
    category: "summit",
    description: "National education summit at Kurukshetra University, 16–17 December 2024.",
    venue: "Kurukshetra University",
    location: "Kurukshetra, Haryana",
    startDate: new Date("2024-12-16"),
    endDate: new Date("2024-12-17"),
    bannerUrl: "/2024M/banner.jpg",
    registrationLink: "/registration",
    isFeatured: true,
    highlights: ["Keynote sessions", "Panel discussions", "Workshops"],
  },
  {
    slug: "shiksha-mahakumbh-2024",
    locale: "hi",
    title: "शिक्षा महाकुंभ 2024",
    category: "summit",
    description: "कुरुक्षेत्र विश्वविद्यालय में राष्ट्रीय शिक्षा सम्मेलन, 16–17 दिसंबर 2024।",
    venue: "कुरुक्षेत्र विश्वविद्यालय",
    location: "कुरुक्षेत्र, हरियाणा",
    startDate: new Date("2024-12-16"),
    endDate: new Date("2024-12-17"),
    bannerUrl: "/2024M/banner.jpg",
    registrationLink: "/registration",
    isFeatured: true,
    highlights: ["मुख्य भाषण", "पैनल चर्चा", "कार्यशालाएँ"],
  },
];

const MEDIA_ENTRIES = [
  {
    slug: "summit-inauguration-video",
    locale: "en",
    title: "Shiksha Mahakumbh 2024 — Inauguration",
    mediaCenterCategory: "video",
    mediaType: "video",
    url: "https://www.youtube.com/watch?v=example",
    excerpt: "Highlights from the inaugural session.",
    isFeatured: true,
  },
  {
    slug: "summit-inauguration-video",
    locale: "hi",
    title: "शिक्षा महाकुंभ 2024 — उद्घाटन",
    mediaCenterCategory: "video",
    mediaType: "video",
    url: "https://www.youtube.com/watch?v=example",
    excerpt: "उद्घाटन सत्र की झलकियाँ।",
    isFeatured: true,
  },
  {
    slug: "media-mention-dainik",
    locale: "hi",
    title: "दैनिक जागरण — शिक्षा महाकुंभ कवरेज",
    mediaCenterCategory: "media_mention",
    mediaType: "publication",
    url: "/2024M/Press7.jpg",
    excerpt: "राष्ट्रीय मीडिया कवरेज।",
    tags: ["press", "coverage"],
  },
];

async function seedCommittees() {
  for (const c of COMMITTEES) {
    const committee = await prisma.committee.upsert({
      where: { slug_edition_locale: { slug: c.slug, edition: c.edition, locale: c.locale } },
      create: {
        slug: c.slug,
        edition: c.edition,
        locale: c.locale,
        name: c.name,
        category: c.category,
        description: c.description,
        status,
        isPublished: publish,
        publishAt: publish ? new Date() : null,
      },
      update: {
        name: c.name,
        description: c.description,
        ...(publish ? { status: "published", isPublished: true, publishAt: new Date() } : {}),
      },
    });

    await prisma.committeeMember.deleteMany({ where: { committeeId: committee.id } });
    if (c.members?.length) {
      await prisma.committeeMember.createMany({
        data: c.members.map((m) => ({
          committeeId: committee.id,
          fullName: m.fullName,
          designation: m.designation,
          institution: m.institution,
          sortOrder: m.sortOrder,
          isActive: true,
        })),
      });
    }
  }
  console.log(`✓ ${COMMITTEES.length} committees seeded`);
}

async function seedSpeakers() {
  for (const s of SPEAKERS) {
    await prisma.speakerProfile.upsert({
      where: { slug_locale: { slug: s.slug, locale: s.locale } },
      create: { ...s, status, publishAt: publish ? new Date() : null },
      update: {
        fullName: s.fullName,
        designation: s.designation,
        institution: s.institution,
        bio: s.bio,
        topics: s.topics,
        languages: s.languages,
        isFeatured: s.isFeatured,
        ...(publish ? { status: "published", publishAt: new Date() } : {}),
      },
    });
  }
  console.log(`✓ ${SPEAKERS.length} speakers seeded`);
}

async function seedPartners() {
  for (const p of PARTNERS) {
    const existing = await prisma.partner.findFirst({
      where: { slug: p.slug, locale: p.locale, deletedAt: null },
    });
    if (existing) {
      await prisma.partner.update({
        where: { id: existing.id },
        data: {
          name: p.name,
          description: p.description,
          partnerCategory: p.partnerCategory,
          isFeatured: p.isFeatured,
          sortOrder: p.sortOrder,
          ...(publish ? { status: "published" } : {}),
        },
      });
    } else {
      await prisma.partner.create({
        data: { ...p, status, isActive: true },
      });
    }
  }
  console.log(`✓ ${PARTNERS.length} partners seeded`);
}

async function seedEvents() {
  for (const e of EVENTS) {
    await prisma.event.upsert({
      where: { slug_locale: { slug: e.slug, locale: e.locale } },
      create: {
        ...e,
        status: eventStatus,
        isPublished: publish,
        publishAt: publish ? new Date() : null,
      },
      update: {
        title: e.title,
        description: e.description,
        venue: e.venue,
        location: e.location,
        highlights: e.highlights,
        isFeatured: e.isFeatured,
        ...(publish ? { status: "published", isPublished: true, publishAt: new Date() } : {}),
      },
    });
  }
  console.log(`✓ ${EVENTS.length} events seeded`);
}

async function seedMediaCenter() {
  for (const m of MEDIA_ENTRIES) {
    const existing = await prisma.eventMedia.findFirst({
      where: { slug: m.slug, locale: m.locale, deletedAt: null },
    });
    if (existing) {
      await prisma.eventMedia.update({
        where: { id: existing.id },
        data: {
          title: m.title,
          excerpt: m.excerpt,
          url: m.url,
          mediaCenterCategory: m.mediaCenterCategory,
          isFeatured: m.isFeatured,
          tags: m.tags ?? [],
          ...(publish ? { status: "published", publishAt: new Date() } : {}),
        },
      });
    } else {
      await prisma.eventMedia.create({
        data: {
          ...m,
          status,
          publishAt: publish ? new Date() : null,
        },
      });
    }
  }
  console.log(`✓ ${MEDIA_ENTRIES.length} media center entries seeded`);
}

async function main() {
  console.log(`Seeding Phase C organizational content… (publish=${publish})`);
  await seedCommittees();
  await seedSpeakers();
  await seedPartners();
  await seedEvents();
  await seedMediaCenter();
  console.log("Done.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
