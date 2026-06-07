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
      { path: "/VibhagRoute/Vitt24", title: "वित्त विभाग" },
      { path: "/VibhagRoute/Prachar24", title: "प्रचार विभाग" },
      { path: "/VibhagRoute/Sampark24", title: "संपर्क विभाग" },
      { path: "/VibhagRoute/Prabandhan24", title: "प्रबंधन विभाग" },
    ],
  },
  {
    path: ROUTES.home,
    title: "Research",
    subMenu: [
      { path: "https://pub.dhe.org.in", title: "Journal" },
      { path: "/abstract", title: "Abstract Submission" },
      { path: "/proceedings", title: "Proceedings" },
      { path: "/2024M/Souvenir Abstracts_MTC.pdf", title: "Souvenir" },
    ],
  },
  {
    path: ROUTES.home,
    title: "Events",
    subMenu: [
      { path: "/pastevent", title: "Past Events" },
      { path: ROUTES.upcomingEvents, title: "Upcoming Events" },
    ],
  },
  {
    path: ROUTES.home,
    title: "Media",
    subMenu: [
      { path: "/gallery", title: "Photos" },
      { path: "/videos", title: "Videos" },
      { path: "/media", title: "Press & Media" },
    ],
  },
  { path: "/committeepage", title: "Committee" },
  { path: "/ContactUs", title: "Contact" },
];

export const CTA_PATH = ROUTES.registration;
export const MEGA_MENU_INDEX = 2;
