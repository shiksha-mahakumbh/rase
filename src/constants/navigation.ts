import type { Menu } from "@/app/component/navbar/types";
import { ROUTES } from "@/constants/routes";
import { CMT_SUBMISSION_URL } from "@/lib/registration/config";

export const POPULAR_LINKS = [
  { path: ROUTES.registration, title: "Register Now" },
  { path: CMT_SUBMISSION_URL, title: "Multi Track Conference" },
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
      { path: "/abhiyan", title: "Abhiyan Timeline" },
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
      { path: CMT_SUBMISSION_URL, title: "Multi Track Conference" },
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
      { path: "/abhiyan", title: "Abhiyan Timeline" },
      { path: "/past-events", title: "Past Editions" },
      { path: ROUTES.upcomingEvents, title: "शिक्षा महाकुंभ 6.0" },
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
