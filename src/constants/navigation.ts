import type { Menu, MenuGroup } from "@/components/layout/navbar/types";
import { ROUTES } from "@/constants/routes";
import { CMT_SUBMIT_PATH } from "@/lib/registration/config";

export const POPULAR_LINKS = [
  { path: ROUTES.registration, title: "Register Now" },
  { path: ROUTES.dashboard, title: "My Registration" },
  { path: CMT_SUBMIT_PATH, title: "Multi Track Conference" },
  { path: ROUTES.academicCouncil, title: "Academic Programme" },
  { path: ROUTES.upcomingEvents, title: "Upcoming Events" },
  { path: "/noticeboard", title: "Notice Board" },
  { path: ROUTES.downloads, title: "Brochures" },
  { path: ROUTES.speakers, title: "Speakers" },
  { path: ROUTES.contact, title: "Contact" },
] as const;

/** Flatten grouped or flat submenus for active-state checks and mobile lists. */
export function flattenSubMenu(item: Menu): Menu[] | undefined {
  if (item.subMenuGroups?.length) {
    return item.subMenuGroups.flatMap((group) => group.items);
  }
  return item.subMenu;
}

/** About mega-menu — Overview, programme links (unlabeled), विभाग */
export const ABOUT_NAV_GROUPS: MenuGroup[] = [
  {
    label: "Overview",
    items: [
      { path: ROUTES.introduction, title: "Introduction" },
      { path: "/past-events", title: "Past Editions" },
      { path: "/abhiyaninphotoframe", title: "Photo Frame" },
    ],
  },
  {
    items: [
      { path: ROUTES.committees, title: "Committees" },
      { path: ROUTES.speakers, title: "Speakers" },
      { path: ROUTES.downloads, title: "Brochure" },
      { path: ROUTES.bestWishes, title: "Best Wishes" },
    ],
  },
  {
    label: "विभाग",
    items: [
      { path: ROUTES.academicCouncil, title: "शैक्षिक विभाग" },
      { path: "/departments/vitt", title: "वित्त विभाग" },
      { path: "/departments/prachar", title: "प्रचार विभाग" },
      { path: "/departments/sampark", title: "संपर्क विभाग" },
      { path: "/departments/prabandhan", title: "प्रबंधन विभाग" },
    ],
  },
];

/** Top-level participate links — also merged into CMS header menus when missing. */
export const PARTICIPATE_NAV_ITEMS: Menu[] = [
  { path: ROUTES.dashboard, title: "My Registration" },
  { path: ROUTES.donation, title: "Donation" },
];

export const NAV_MENUS: Menu[] = [
  { path: ROUTES.home, title: "Home" },
  { path: ROUTES.registration, title: "Registration" },
  {
    path: ROUTES.home,
    title: "About",
    subMenuGroups: ABOUT_NAV_GROUPS,
    subMenu: flattenSubMenu({ path: ROUTES.home, title: "About", subMenuGroups: ABOUT_NAV_GROUPS }),
  },
  {
    path: ROUTES.home,
    title: "Research",
    subMenu: [
      { path: "https://pub.dhe.org.in", title: "Journal" },
      { path: CMT_SUBMIT_PATH, title: "Multi Track Conference" },
      { path: "/proceedings", title: "Proceedings" },
      { path: "/publications", title: "Publications" },
      { path: "/books", title: "Books" },
      { path: "/publications/souvenir-abstracts-mtc", title: "Souvenir" },
    ],
  },
  {
    path: ROUTES.home,
    title: "Events",
    subMenu: [
      { path: ROUTES.upcomingEvents, title: "Shiksha Mahakumbh 6.0" },
      { path: ROUTES.registration, title: "Register for SMK 6.0" },
      { path: "/noticeboard", title: "Notice Board" },
      { path: "/workshops", title: "Workshops" },
    ],
  },
  {
    path: ROUTES.home,
    title: "Media",
    subMenu: [
      { path: "/gallery", title: "Gallery" },
      { path: "/media-center", title: "Media Centre" },
      { path: "/press", title: "Press Releases" },
    ],
  },
  ...PARTICIPATE_NAV_ITEMS,
  { path: "/contact-us", title: "Contact" },
];

export const CTA_PATH = ROUTES.registration;
