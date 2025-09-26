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
import Organizer from "./component/organiger"; // src name unchanged
import Media_Partners from "./component/Media_Partners";
import Conference_Support from "./component/Conference_Support";
import Announcement from "./component/Annoucement"; // src name unchanged
import UpcomingEvent from "./component/UpcomingEvent";
import NoticeBoard from "./component/NoticeBoard";

type Slide = {
  src: string;
  alt: string;
  legend: string;
};

const slides1: Slide[] = [
  {
    src: "/2024M/Press8.jpg",
    alt: "Release of the official abstract booklet titled Indian Education for Global Development",
    legend:
      'Release of the official abstract booklet "Indian Education for Global Development"',
  },
  {
    src: "/2024M/Press7.jpg",
    alt: "Swami Gyananand inaugurating the event by lighting the jyoti",
    legend: "Swami Gyananand inaugurated the event by lighting the jyoti",
  },
  {
    src: "/2024M/Press6.jpg",
    alt: "Final closing press conference of Shiksha Mahakumbh Abhiyan 4.0",
    legend: "Final closing press conference for the Shiksha Mahakumbh Abhiyan 4.0",
  },
  {
    src: "/2024M/baton/baton1.jpg",
    alt: "Baton Ceremony of Shiksha Mahakumbh Abhiyan 4.0",
    legend: "Baton Ceremony Shiksha Mahakumbh Abhiyan 4.0",
  },
  {
    src: "/2024K/k6.jpg",
    alt: "Prof. Rajeev Ahuja and Dr. Thakur SKR inviting the Hon’ble President Smt. Droupadi Murmu",
    legend:
      "Prof. Rajeev Ahuja and Dr. Thakur SKR invited Smt. Droupadi Murmu, the Hon’ble President of Bharat, for the Shiksha Mahakumbh Abhiyan 4.0",
  },
  {
    src: "/2023M/up_cm.jpg",
    alt: "Shiksha Mahakumbh team inviting the Hon’ble Chief Minister of Uttar Pradesh",
    legend:
      "Shiksha Mahakumbh team inviting Hon’ble Chief Minister, UP to 4th Edition",
  },
  {
    src: "/2023M/banwari_lal_purohit.JPG",
    alt: "Shri Banwari Lal Purohit, Hon'ble Governor of Punjab addressing the crowd",
    legend:
      "Shri Banwari Lal Purohit, the Hon'ble Governor of Punjab, addressed the crowd",
  },
  {
    src: "/2023M/bandaru_dattareya.jpg",
    alt: "Shri Bandaru Dattatreya, Hon'ble Governor of Haryana addressing the gathering",
    legend:
      "Shri Bandaru Dattatreya, the Hon'ble Governor of Haryana, addressed the crowd",
  },
  {
    src: "/2023M/anurag_singh_thakur.JPG",
    alt: "Shri Anurag Singh Thakur, Cabinet Minister of Sports and Youth Affairs addressing the audience",
    legend:
      "Shri Anurag Singh Thakur, the Hon'ble Cabinet Minister, Minister of Sports and Youth Affair, addressed the crowd",
  },
  {
    src: "/2023M/raghunandan.JPG",
    alt: "Shri Raghunandan, Organising Secretary Vidya Bharti Ucch Shiksha Sansthan",
    legend:
      "Shri Raghunandan, Organising Secretary, Vidya Bharti - Ucch Shiksha Sansthan",
  },
  {
    src: "/2023M/shankarananda.JPG",
    alt: "Shri Shankarananda, Organising Secretary Bhartiya Shikshan Mandal",
    legend: "Shri Shankarananda, Organising Secretary, Bhartiya Shikshan Mandal",
  },
  {
    src: "/2023M/kashmiri_lal.JPG",
    alt: "Shri Kashmiri Lal, Organising Secretary Swadeshi Jagran Manch",
    legend: "Shri Kashmiri Lal, Organising Secretary, Swadeshi Jagran Manch",
  },
  {
    src: "/2023M/satish_kumar.JPG",
    alt: "Shri Satish Kumar, Joint Organising Secretary Swadeshi Jagran Manch",
    legend:
      "Shri Satish Kumar, Joint Organising Secretary, Swadeshi Jagran Manch",
  },
  {
    src: "/2023K/bandaru_dattareya.JPG",
    alt: "Shri Bandaru Dattatreya releasing the proceedings of Shiksha Kumbh 2023",
    legend:
      "Shri Bandaru Dattatreya, the Hon'ble Governor of Haryana, released the proceeding of Shiksha Kumbh 2023",
  },
  {
    src: "/2023K/Shri Aswini Updhaya.JPG",
    alt: "Adv. Aswini Updhaya addressing the audience",
    legend: "Adv. Aswini Updhaya, PIL Man  of Bharat, addressed the crowd",
  },
  {
    src: "/2024K/k12.png",
    alt: "Shri Manoj Sinha, Hon’ble Lieutenant Governor of Jammu and Kashmir",
    legend: "Shri Manoj Sinha, Hon’ble Lieutenant Governor, J&K",
  },
  {
    src: "/2024K/k7.png",
    alt: "Dr. Jitendra Singh, Hon’ble MoS (IC) Science and Technology",
    legend: "Dr. Jitendra Singh, Hon’ble MoS (IC), Science and Technology",
  },
];

const pageVariants = {
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
  hidden: { opacity: 0, y: 20 },
};

const TransitionWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.2,
  });

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={inView ? "visible" : "hidden"}
      variants={pageVariants}
      aria-live="polite"
    >
      {children}
    </motion.div>
  );
};

/* ----------- Mobile Layout ----------- */
const MobileView = () => (
  <main id="main" className="flex flex-col gap-6 px-4 py-6">
    <TransitionWrapper>
      <SlideShow slides={slides1} ariaLabel="Shiksha Mahakumbh highlights" />
    </TransitionWrapper>

    <section aria-labelledby="announcements-heading">
      <h2 id="announcements-heading" className="sr-only">Announcements</h2>
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

/* ----------- Desktop Layout ----------- */
const DesktopView = () => (
  <main id="main" className="w-full max-w-7xl mx-auto px-6 py-8">
    <div className="grid grid-cols-12 gap-6 items-start">
      <aside className="col-span-3 lg:col-span-2" aria-label="Announcements">
        <Announcement />
      </aside>

      <section className="col-span-12 lg:col-span-7" aria-labelledby="hero-heading">
        <h1 id="hero-heading" className="sr-only">Shiksha Mahakumbh Highlights</h1>
        <TransitionWrapper>
          <SlideShow slides={slides1} ariaLabel="Shiksha Mahakumbh highlights" />
        </TransitionWrapper>

        <div className="mt-6 space-y-6">
          <TransitionWrapper>
            <Info />
          </TransitionWrapper>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <TransitionWrapper>
              <Conference_Support />
            </TransitionWrapper>
            <TransitionWrapper>
              <Media_Partners />
            </TransitionWrapper>
          </div>
        </div>
      </section>

      <aside className="col-span-12 lg:col-span-3" aria-label="Notices and Organizers">
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

