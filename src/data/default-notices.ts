import type { CmsNotice } from "@/lib/cms/types";
import { event } from "@/design/tokens";
import { ACADEMIC_PUBLICATION_NOTE } from "@/data/academic-council-tracks";
import { CMT_SUBMISSION_URL } from "@/lib/registration/config";

/** Published fallback notices when CMS / database has none (English). */
export const DEFAULT_NOTICES_EN: CmsNotice[] = [
  {
    id: "default-registration-open",
    title: `Registration Open — ${event.name}`,
    slug: "registration-open-smk-6",
    description:
      `Unified registration is open for delegates, academic conclaves, exhibitions, project displays, and accommodation requests. DHE Olympiad exam dates are to be announced — apply via the registration hub when open. The summit runs 9–11 October 2026 at ${event.venue}, ${event.location}.`,
    priority: 10,
    isPinned: true,
    publishAt: "2026-05-01T00:00:00.000Z",
    expireAt: null,
    category: { name: "Registration", slug: "registration" },
    attachments: [],
  },
  {
    id: "default-venue-dates",
    title: `Venue & Dates — ${event.venue}`,
    slug: "venue-dates-smk-6",
    description:
      `${event.name} will be hosted at ${event.venue}, ${event.location} on 9–11 October 2026. Plan travel via Dharamshala (Gaggal) or Chandigarh airports and Una/Amb Andaura railway stations. Venue maps and local stay guidance will be updated on the notice board.`,
    priority: 9,
    isPinned: true,
    publishAt: "2026-05-01T00:00:00.000Z",
    expireAt: null,
    category: { name: "General", slug: "general" },
    attachments: [],
  },
  {
    id: "default-mtc-abstracts",
    title: "Multi-Track Conference — Paper & Abstract Submission",
    slug: "mtc-abstract-submission-2026",
    description:
      `Authors may submit research papers and abstracts for the Multi-Track International Conference through the official CMT portal (${CMT_SUBMISSION_URL}). Review timelines, formatting guidelines, and track listings are on the Academic Council conference page. ${ACADEMIC_PUBLICATION_NOTE}`,
    priority: 7,
    isPinned: false,
    publishAt: "2026-05-15T00:00:00.000Z",
    expireAt: null,
    category: { name: "Programmes", slug: "programmes" },
    attachments: [],
  },
  {
    id: "default-olympiads",
    title: "DHE Olympiads & Talent Programmes — Dates TBA",
    slug: "dhe-olympiads-2026",
    description:
      "DHE Olympiads (Classes 3–10), talent conclave (90%+ achievers), and Bal Shodh Patrika participation will open via the registration hub. Registration and exam dates to be announced; top achievers felicitated at Shiksha Mahakumbh 6.0.",
    priority: 6,
    isPinned: false,
    publishAt: "2026-05-20T00:00:00.000Z",
    expireAt: null,
    category: { name: "Programmes", slug: "programmes" },
    attachments: [],
  },
  {
    id: "default-accommodation",
    title: "Accommodation — Request via Registration",
    slug: "accommodation-smk-6",
    description:
      "Delegates requiring campus or hotel accommodation should indicate preferences during registration. Allotment confirmations, check-in timings, and transport shuttles will be shared by the organising committee closer to the event dates.",
    priority: 5,
    isPinned: false,
    publishAt: "2026-06-01T00:00:00.000Z",
    expireAt: null,
    category: { name: "Registration", slug: "registration" },
    attachments: [],
  },
  {
    id: "default-sponsorship",
    title: "Sponsorship & Institutional Partnership Window",
    slug: "sponsorship-partnership-2026",
    description:
      "CSR, industry, media, and institutional partnership enquiries are invited for Shiksha Mahakumbh 6.0. Sponsors receive brand visibility across conclaves, exhibitions, and national outreach. Contact the organising secretariat or use the sponsorship section on the registration portal.",
    priority: 4,
    isPinned: false,
    publishAt: "2026-06-01T00:00:00.000Z",
    expireAt: null,
    category: { name: "General", slug: "general" },
    attachments: [],
  },
  {
    id: "default-project-display",
    title: "Project Display & Exhibition Registration",
    slug: "project-display-exhibition-2026",
    description:
      "Higher-education institutions and student innovators may register for project displays, best-practice exhibitions, and startup showcases. Space is limited — submit institutional nominations through the HEI project display form linked from registration.",
    priority: 3,
    isPinned: false,
    publishAt: "2026-06-10T00:00:00.000Z",
    expireAt: null,
    category: { name: "Programmes", slug: "programmes" },
    attachments: [],
  },
  {
    id: "default-volunteer",
    title: "Volunteer Orientation & Campus Roles",
    slug: "volunteer-orientation-2026",
    description:
      "Student and faculty volunteers for registration desks, conclave logistics, and exhibition support will receive orientation briefings before the summit. Expression-of-interest forms will be circulated to participating institutions; watch this board for schedule updates.",
    priority: 2,
    isPinned: false,
    publishAt: "2026-06-15T00:00:00.000Z",
    expireAt: null,
    category: { name: "General", slug: "general" },
    attachments: [],
  },
];

/** Hindi fallback notices (used when locale is hi and DB is empty). */
export const DEFAULT_NOTICES_HI: CmsNotice[] = [
  {
    id: "default-registration-hi",
    title: "शिक्षा महाकुंभ 6.0 — पंजीकरण खुला",
    slug: "smk-6-registration-hi",
    description:
      "9–11 अक्टूबर 2026, एनआईटी हमीरपुर। प्रतिनिधि, अधिवेशन, ओलंपियाड, प्रदर्शनी और आवास के लिए एकीकृत पंजीकरण प्रारंभ।",
    priority: 10,
    isPinned: true,
    publishAt: "2026-05-01T00:00:00.000Z",
    expireAt: null,
    category: { name: "पंजीकरण", slug: "registration" },
    attachments: [],
  },
  {
    id: "default-venue-hi",
    title: "स्थान एवं तिथि — एनआईटी हमीरपुर",
    slug: "venue-travel-hi",
    description:
      "शिक्षा महाकुंभ 6.0 एनआईटी हमीरपुर, हिमाचल प्रदेश में 9–11 अक्टूबर 2026 को आयोजित होगा। यात्रा और आवास संबंधी अद्यतन इस बोर्ड पर प्रकाशित होंगे।",
    priority: 9,
    isPinned: true,
    publishAt: "2026-05-01T00:00:00.000Z",
    expireAt: null,
    category: { name: "सामान्य", slug: "general" },
    attachments: [],
  },
  {
    id: "default-programme-hi",
    title: "बहु-ट्रैक सम्मेलन एवं शोध सत्र",
    slug: "academic-programme-hi",
    description:
      "शोध पत्र और सार-पत्र आधिकारिक CMT पोर्टल (SMK2026) के माध्यम से जमा करें। दिशानिर्देश शैक्षिक परिषद पृष्ठ पर उपलब्ध हैं।",
    priority: 7,
    isPinned: false,
    publishAt: "2026-05-15T00:00:00.000Z",
    expireAt: null,
    category: { name: "कार्यक्रम", slug: "programmes" },
    attachments: [],
  },
  {
    id: "default-accommodation-hi",
    title: "आवास सुविधा — पंजीकरण के माध्यम से अनुरोध",
    slug: "accommodation-hi",
    description:
      "पंजीकरण के दौरान आवास विकल्प चुनें; पुष्टि आयोजन समिति द्वारा साझा की जाएगी।",
    priority: 5,
    isPinned: false,
    publishAt: "2026-06-01T00:00:00.000Z",
    expireAt: null,
    category: { name: "पंजीकरण", slug: "registration" },
    attachments: [],
  },
  {
    id: "default-abstract-hi",
    title: "सार-पत्र जमा करने की जानकारी",
    slug: "abstract-deadline-hi",
    description:
      "शोध सार-पत्र के लिए दिशानिर्देश और समयसीमा अमूर्त पृष्ठ पर उपलब्ध।",
    priority: 6,
    isPinned: false,
    publishAt: "2026-05-20T00:00:00.000Z",
    expireAt: null,
    category: { name: "कार्यक्रम", slug: "programmes" },
    attachments: [],
  },
  {
    id: "default-olympiads-hi",
    title: "डीएचई ओलंपियाड एवं प्रतिभा कार्यक्रम — तिथि घोषित होगी",
    slug: "dhe-olympiads-hi",
    description:
      "कक्षा 3–10 के लिए DHE ओलंपियाड, प्रतिभा अधिवेशन और बाल शोध पत्रिका — पंजीकरण व परीक्षा तिथियाँ घोषित की जाएंगी। पंजीकरण हब के माध्यम से आवेदन करें।",
    priority: 6,
    isPinned: false,
    publishAt: "2026-05-20T00:00:00.000Z",
    expireAt: null,
    category: { name: "कार्यक्रम", slug: "programmes" },
    attachments: [],
  },
  {
    id: "default-sponsorship-hi",
    title: "प्रायोजन एवं संस्थागत साझेदारी",
    slug: "sponsorship-hi",
    description:
      "शिक्षा महाकुंभ 6.0 के लिए सीएसआर, उद्योग और मीडिया साझेदारी के लिए संपर्क करें।",
    priority: 4,
    isPinned: false,
    publishAt: "2026-06-01T00:00:00.000Z",
    expireAt: null,
    category: { name: "सामान्य", slug: "general" },
    attachments: [],
  },
  {
    id: "default-project-display-hi",
    title: "परियोजना प्रदर्शन एवं प्रदर्शनी पंजीकरण",
    slug: "project-display-hi",
    description:
      "उच्च शिक्षा संस्थान और छात्र नवाचारकर्ता परियोजना प्रदर्शन के लिए पंजीकरण हब से नामांकन कर सकते हैं।",
    priority: 3,
    isPinned: false,
    publishAt: "2026-06-10T00:00:00.000Z",
    expireAt: null,
    category: { name: "कार्यक्रम", slug: "programmes" },
    attachments: [],
  },
  {
    id: "default-volunteer-hi",
    title: "स्वयंसेवक अभिविन्यास",
    slug: "volunteer-hi",
    description:
      "पंजीकरण डेस्क, अधिवेशन और प्रदर्शनी सहायता के लिए स्वयंसेवक अभिविन्यास की तिथियाँ इस बोर्ड पर साझा की जाएंगी।",
    priority: 2,
    isPinned: false,
    publishAt: "2026-06-15T00:00:00.000Z",
    expireAt: null,
    category: { name: "सामान्य", slug: "general" },
    attachments: [],
  },
];

export function getDefaultNotices(locale: string = "en"): CmsNotice[] {
  return locale === "hi" ? DEFAULT_NOTICES_HI : DEFAULT_NOTICES_EN;
}

/** CMS notices when present; otherwise curated defaults (sorted like public API). */
export function resolvePublicNotices(
  notices: CmsNotice[] | null | undefined,
  locale: string = "en"
): CmsNotice[] {
  if (notices && notices.length > 0) return sortNotices(notices);
  return sortNotices(getDefaultNotices(locale));
}

/** Top N for homepage widget. */
export function resolveWidgetNotices(
  widgetNotices: CmsNotice[] | null | undefined,
  allNotices: CmsNotice[] | null | undefined,
  locale: string = "en",
  limit = 5
): CmsNotice[] {
  if (widgetNotices && widgetNotices.length > 0) {
    return sortNotices(widgetNotices).slice(0, limit);
  }
  return resolvePublicNotices(allNotices, locale).slice(0, limit);
}

export function sortNotices(notices: CmsNotice[]): CmsNotice[] {
  return [...notices].sort((a, b) => {
    if (a.isPinned !== b.isPinned) return a.isPinned ? -1 : 1;
    if (a.priority !== b.priority) return b.priority - a.priority;
    const aDate = a.publishAt ? new Date(a.publishAt).getTime() : 0;
    const bDate = b.publishAt ? new Date(b.publishAt).getTime() : 0;
    return bDate - aDate;
  });
}

export function formatNoticeDate(iso: string | null): string | null {
  if (!iso) return null;
  try {
    return new Intl.DateTimeFormat("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    }).format(new Date(iso));
  } catch {
    return null;
  }
}
