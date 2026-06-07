import type { Menu } from "@/app/component/navbar/types";
import { ROUTES } from "@/constants/routes";

export const POPULAR_LINKS = [
  { path: ROUTES.registration, title: "Register Now" },
  { path: "/abstract", title: "Submit Paper" },
  { path: ROUTES.academicCouncil, title: "Academic Programme" },
  { path: ROUTES.upcomingEvents, title: "Upcoming Events" },
  { path: ROUTES.contact, title: "Contact" },
] as const;

export const NAV_MENUS: Menu[] = [
  { path: ROUTES.home, title: "Home" },
  { path: ROUTES.registration, title: "Registration" },
  {
    path: ROUTES.home,
    title: "About",
    subMenu: [
      { path: ROUTES.introduction, title: "Introduction" },
      { path: "/abhiyanphotoframe.pdf", title: "Photo Frames" },
      { path: ROUTES.academicCouncil, title: "शैक्षिक विभाग" },
      { path: "/departments/vitt", title: "वित्त विभाग" },
      { path: "/departments/prachar", title: "प्रचार विभाग" },
      { path: "/departments/sampark", title: "संपर्क विभाग" },
      { path: "/departments/prabandhan", title: "प्रबंधन विभाग" },
    ],
  },
  {
    path: ROUTES.home,
    title: "Research",
    subMenu: [
      { path: "https://pub.dhe.org.in", title: "Journal" },
      { path: "/abstract", title: "Abstract Submission" },
      { path: "/proceedings", title: "Proceedings" },
      { path: "/research", title: "Research Hub" },
      { path: "/publications", title: "Publications" },
      { path: "/initiatives", title: "Initiatives" },
      { path: "/2024M/Souvenir Abstracts_MTC.pdf", title: "Souvenir" },
    ],
  },
  {
    path: ROUTES.home,
    title: "Events",
    subMenu: [
      { path: "/past-events", title: "Past Events" },
      { path: ROUTES.upcomingEvents, title: "Upcoming Events" },
    ],
  },
  {
    path: ROUTES.home,
    title: "Media",
    subMenu: [
      { path: "/gallery", title: "Photos" },
      { path: "/videos", title: "Videos" },
      { path: "/media-center", title: "Media Centre" },
      { path: "/press", title: "Press Releases" },
    ],
  },
  { path: "/committees", title: "Committee" },
  { path: "/contact-us", title: "Contact" },
];

export const CTA_PATH = ROUTES.registration;
export const MEGA_MENU_INDEX = 2;
