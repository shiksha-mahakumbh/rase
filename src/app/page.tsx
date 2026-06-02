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
import Organiger from "./component/organiger";
import Media_Partners from "./component/Media_Partners";
import Conference_Support from "./component/Conference_Support";
import { CustomCard } from "./component/card";
import Announcement from "./component/Annoucement";
import UpcomingEvent from "./component/UpcomingEvent";
import NoticeBoard from "./component/NoticeBoard";
import SectionShell from "./component/home/SectionShell";
import ImpactStatsBar from "./component/home/ImpactStatsBar";
import GlassCard from "./component/home/GlassCard";

const slides1 = [
  {
    src: "/2024M/Vyakhanmala.jpg",
    alt: "Image 1",
    legend:
      '"Vyakhanmala: Lecture Series on Panchakosha & Bharatiya Jnana Parampara" First Lecture (Annamaya Kosha)"',
  },
  {
    src: "/2024M/Press8.jpg",
    alt: "Image 1",
    legend:
      'Release of the official abstract booklet "Indian Education for Global Development" ',
  },
  {
    src: "/2024M/Press7.jpg",
    alt: "Image 1",
    legend:
      "Swami Gyananand inaugrated the event by lighting the jyoti ",
  },
  {
    src: "/2024M/Press6.jpg",
    alt: "Image 1",
    legend:
      "Final closing press conference for the Shiksha Mhakumbh Abhiyan 4.0",
  },
  {
    src: "/2024M/baton/baton1.jpg",
    alt: "Image 1",
    legend:
      "Baton Ceremony Shiksha Mahakumbh Abhiyan 4.0",
  },
  {
    src: "/2024K/k6.jpg",
    alt: "Image 1",
    legend:
      "Prof. Rajeev Ahuja and Dr. Thakur SKR invited Smt. Droupadi Murmu, the Hon'ble President of Bharat, for the Shiksha Mahakumbh Abhiyan 4.0",
  },
  {
    src: "/2023M/up_cm.jpg",
    alt: "Image 1",
    legend:
      "Shiksha Mahakumbh team inviting Hon'ble Chief Minister, UP to 4th Edition",
  },
  {
    src: "/2023M/banwari_lal_purohit.JPG",
    alt: "Image 1",
    legend:
      "Shri Banwari Lal Purohit, the Hon'ble Governor of Punjab, addressed the crowd",
  },
  {
    src: "/2023M/bandaru_dattareya.jpg",
    alt: "Image 1",
    legend:
      "Shri Bandaru Dattatreya, the Hon'ble Governor of Haryana, addressed the crowd",
  },
  {
    src: "/2023M/anurag_singh_thakur.JPG",
    alt: "Image 1",
    legend:
      "Shri Anurag Singh Thakur, the Hon'ble Cabinet Minister, Minister of Sports and Youth Affair, addressed the crowd",
  },
  {
    src: "/2023M/raghunandan.JPG",
    alt: "Image 1",
    legend:
      "Shri Raghunandan, Organising Secretary, Vidya Bharti - Ucch Shiksha Sansthan",
  },
  {
    src: "/2023M/shankarananda.JPG",
    alt: "Image 1",
    legend:
      "Shri Shankarananda, Organising Secretary, Bhartiya Shikshan Mandal",
  },

  {
    src: "/2023M/kashmiri_lal.JPG",
    alt: "Image 1",
    legend: "Shri Kashmiri Lal, Organising Secretary, Swadeshi Jagran Manch",
  },
  {
    src: "/2023M/satish_kumar.JPG",
    alt: "Image 1",
    legend:
      "Shri Satish Kumar, Joint Organising Secretary, Swadeshi Jagran Manch",
  },

  {
    src: "/2023K/bandaru_dattareya.JPG",
    alt: "Image 1",
    legend:
      "Shri Bandaru Dattatreya, the Hon'ble Governor of Haryana, released the proceeding of Shiksha Kumbh 2023",
  },
  {
    src: "/2023K/Shri Aswini Updhaya.JPG",
    alt: "Image 1",
    legend: "Adv. Aswini Updhaya, PIL Man  of Bharat, addressed the crowd",
  },
  {
    src: "/2024K/k12.png",
    alt: "Image 1",
    legend: "Shri Manoj Sinha, Hon'ble Lieutenant Governor, J&K",
  },
  {
    src: "/2024K/k7.png",
    alt: "Image 1",
    legend: "Dr. Jitendra Singh, Hon'ble MoS (IC), Science and Technology",
  },
];

const pageVariants = {
  visible: { opacity: 1, y: 0 },
  hidden: { opacity: 0, y: 20 },
};

const pageTransition = {
  type: "tween" as const,
  ease: "anticipate" as const,
  duration: 0.8,
};

const TransitionWrapper: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { ref, inView } = useInView({
    triggerOnce: false,
    threshold: 0.1,
  });

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={inView ? "visible" : "hidden"}
      variants={pageVariants}
      transition={pageTransition}
    >
      {children}
    </motion.div>
  );
};

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-[#faf8f6]">
      <CompanyInfo />
      <NavBar />
      <Marquees />

      {/* Hero Bento Zone */}
      <SectionShell
        background="gradient"
        className="px-3 py-6 md:px-6 md:py-10"
        ariaLabel="Hero section"
      >
        <div className="mx-auto max-w-7xl">
          {/* Bento Grid: Announcement | SlideShow | NoticeBoard */}
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-12 lg:gap-6">
            {/* Left Column - Announcements */}
            <div className="order-2 lg:order-1 lg:col-span-3">
              <TransitionWrapper>
                <Announcement />
              </TransitionWrapper>
            </div>

            {/* Center - Immersive Hero Slideshow */}
            <div className="order-1 lg:order-2 lg:col-span-6">
              <TransitionWrapper>
                <SlideShow slides={slides1} />
              </TransitionWrapper>
            </div>

            {/* Right Column - Notices */}
            <div className="order-3 lg:col-span-3">
              <TransitionWrapper>
                <NoticeBoard />
              </TransitionWrapper>
            </div>
          </div>

          {/* Impact Metrics Dashboard */}
          <div className="mt-8 md:mt-10">
            <TransitionWrapper>
              <ImpactStatsBar />
            </TransitionWrapper>
          </div>
        </div>
      </SectionShell>

      {/* About / Info Section */}
      <TransitionWrapper>
        <Info />
      </TransitionWrapper>

      {/* Upcoming Events */}
      <SectionShell
        background="cool"
        className="px-4 py-10 md:px-8 md:py-14"
        ariaLabel="Upcoming events"
      >
        <div className="mx-auto max-w-7xl">
          <GlassCard className="overflow-hidden p-6 md:p-8">
            <TransitionWrapper>
              <UpcomingEvent />
            </TransitionWrapper>
          </GlassCard>
        </div>
      </SectionShell>

      {/* Edition Highlights Cards */}
      <SectionShell
        background="default"
        className="px-4 py-10 md:px-8 md:py-14"
        ariaLabel="Edition highlights"
      >
        <div className="mx-auto max-w-7xl">
          <div className="mb-8 text-center">
            <p className="mb-2 text-sm font-semibold uppercase tracking-[0.2em] text-primary/70">
              Research &amp; Publications
            </p>
            <h2 className="home-section-title">Edition Highlights</h2>
          </div>
          <TransitionWrapper>
            <CustomCard />
          </TransitionWrapper>
        </div>
      </SectionShell>

      {/* Academic Partners */}
      <TransitionWrapper>
        <Conference_Support />
      </TransitionWrapper>

      {/* Media Partners */}
      <TransitionWrapper>
        <Media_Partners />
      </TransitionWrapper>

      {/* Sponsors */}
      <TransitionWrapper>
        <Organiger />
      </TransitionWrapper>

      <Footer />
    </div>
  );
}
