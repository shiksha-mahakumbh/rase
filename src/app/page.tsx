// app/(main)/page.tsx  (or components/Home.tsx)
// "use client" is intentional for framer-motion & client hooks
"use client";

import React from "react";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";

import CompanyInfo from "./component/CompanyInfo";
import NavBar from "./component/NavBar";
import SlideShow from "./component/SlideShow";
import Info from "./component/Info";
import Footer from "./component/Footer";
import Marquees from "./component/Marquees";
import Organizer from "./component/Organizer"; // fixed name
import Media_Partners from "./component/Media_Partners";
import Conference_Support from "./component/Conference_Support";
import { CustomCard } from "./component/card";
import Announcement from "./component/Announcement"; // fixed name
import UpcomingEvent from "./component/UpcomingEvent";
import NoticeBoard from "./component/NoticeBoard";

type Slide = {
  src: string;
  alt: string;
  legend: string;
  caption?: string;
  loading?: "eager" | "lazy";
};

const slides1: Slide[] = [
  {
    src: "/2024M/Press8.jpg",
    alt: "Release of the official abstract booklet titled Indian Education for Global Development",
    legend: 'Release of the official abstract booklet "Indian Education for Global Development"',
    loading: "lazy",
  },
  {
    src: "/2024M/Press7.jpg",
    alt: "Swami Gyananand inaugurates the event by lighting the jyoti",
    legend: "Swami Gyananand inaugurated the event by lighting the jyoti",
    loading: "lazy",
  },
  {
    src: "/2024M/Press6.jpg",
    alt: "Final closing press conference - Shiksha Mahakumbh Abhiyan 4.0",
    legend: "Final closing press conference for the Shiksha Mahakumbh Abhiyan 4.0",
    loading: "lazy",
  },
  {
    src: "/2024M/baton/baton1.jpg",
    alt: "Baton ceremony for Shiksha Mahakumbh Abhiyan 4.0",
    legend: "Baton Ceremony Shiksha Mahakumbh Abhiyan 4.0",
    loading: "lazy",
  },
  {
    src: "/2024K/k6.jpg",
    alt: "Prof. Rajeev Ahuja and Dr. Thakur SKR inviting the Hon'ble President Smt. Droupadi Murmu",
    legend:
      "Prof. Rajeev Ahuja and Dr. Thakur SKR invited Smt. Droupadi Murmu, the Hon’ble President of Bharat, for the Shiksha Mahakumbh Abhiyan 4.0",
    loading: "lazy",
  },
  // ... keep the rest similarly descriptive
];

const pageVariants = {
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
  hidden: { opacity: 0, y: 12 },
};

const pageTransition = {
  type: "tween",
  ease: "easeOut",
  duration: 0.6,
};

const TransitionWrapper: React.FC<{
  children: React.ReactNode;
  triggerOnce?: boolean;
}> = ({ children, triggerOnce = true }) => {
  const { ref, inView } = useInView({
    triggerOnce,
    threshold: 0.12,
  });

  return (
    <motion.section
      ref={ref}
      initial="hidden"
      animate={inView ? "visible" : "hidden"}
      variants={pageVariants}
      transition={pageTransition}
      aria-live="polite"
    >
      {children}
    </motion.section>
  );
};

const MobileView = () => (
  <main id="main" className="flex flex-col gap-6 px-4 py-6">
    <TransitionWrapper>
      <SlideShow slides={slides1} ariaLabel="Hero slideshow: Shiksha Mahakumbh highlights" />
    </TransitionWrapper>

    <section aria-labelledby="announcements-heading">
      <h2 id="announcements-heading" className="sr-only">
        Announcements
      </h2>
      <Announcement />
    </section>

    <TransitionWrapper>
      <NoticeBoard />
    </TransitionWrapper>

    <TransitionWrapper>
      <Info />
    </TransitionWrapper>

    <TransitionWrapper>
      <Conference_Support />
    </TransitionWrapper>

    <TransitionWrapper>
      <Media_Partners />
    </TransitionWrapper>

    <TransitionWrapper>
      <Organizer />
    </TransitionWrapper>

    <UpcomingEvent />
  </main>
);

const DesktopView = () => (
  <main id="main" className="w-full max-w-6xl mx-auto px-6 py-8">
    {/* Responsive 12-column grid for better control & symmetry */}
    <div className="grid grid-cols-12 gap-6 items-start">
      <aside className="col-span-3 lg:col-span-2" aria-label="Sidebar announcements">
        <h2 className="text-lg font-semibold mb-4">Announcements</h2>
        <Announcement />
      </aside>

      <section className="col-span-12 lg:col-span-7" aria-labelledby="hero-heading">
        <h1 id="hero-heading" className="sr-only">
          Shiksha Mahakumbh — Highlights and Information
        </h1>

        <TransitionWrapper triggerOnce={false}>
          <SlideShow slides={slides1} ariaLabel="Hero slideshow: Shiksha Mahakumbh highlights" />
        </TransitionWrapper>

        {/* Info blocks below the hero — keep animation sparingly */}
        <div className="mt-6 space-y-6">
          <TransitionWrapper>
            <Info />
          </TransitionWrapper>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
            <TransitionWrapper>
              <Conference_Support />
            </TransitionWrapper>
            <TransitionWrapper>
              <Media_Partners />
            </TransitionWrapper>
          </div>
        </div>
      </section>

      <aside className="col-span-12 lg:col-span-3" aria-label="Notices and organizers">
        <div className="sticky top-20 space-y-6">
          <TransitionWrapper>
            <NoticeBoard />
          </TransitionWrapper>

          <TransitionWrapper>
            <Organizer />
          </TransitionWrapper>

          <TransitionWrapper>
            <UpcomingEvent />
          </TransitionWrapper>
        </div>
      </aside>
    </div>
  </main>
);

export default function Home() {
  return (
    <div className="bg-white text-gray-900 antialiased">
      {/* Skip link for accessibility */}
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 z-50 bg-white p-2 rounded shadow"
      >
        Skip to content
      </a>

      <header>
        <CompanyInfo />
        <NavBar />
      </header>

      <Marquees />

      {/* Responsive container */}
      <div className="min-h-screen">
        <div className="sm:hidden">
          <MobileView />
        </div>
        <div className="hidden sm:block">
          <DesktopView />
        </div>
      </div>

      <Footer />
    </div>
  );
}
