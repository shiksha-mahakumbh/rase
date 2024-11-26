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
const slides1 = [
  {
    src: "/2024K/k6.jpg",
    alt: "Image 1",
    legend:
      "Prof. Rajeev Ahuja and Dr. Thakur SKR invited Smt. Droupadi Murmu, the Hon’ble President of Bharat, for the Shiksha Mahakumbh 2024",
  },
  {
    src: "/2023M/up_cm.jpg",
    alt: "Image 1",
    legend:
      "Shiksha Mahakumbh team inviting Hon’ble Chief Minister, UP to 2nd Edition",
  },
  // Add more slides as needed
];

const pageVariants = {
  visible: { opacity: 1, y: 0 },
  hidden: { opacity: 0, y: 20 },
};

const pageTransition = {
  type: "tween",
  ease: "anticipate",
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

const MobileView = () => (
  <div className="flex flex-col space-y-4 items-center w-full">
    <div className="relative flex flex-col w-full">
      <div className="relative flex items-center justify-center w-full">
        <TransitionWrapper>
          <SlideShow slides={slides1} />
        </TransitionWrapper>
      </div>
      <div className="relative flex items-center justify-center">
        <Announcement />
      </div>
      <TransitionWrapper>
        <NoticeBoard />
      </TransitionWrapper>
    </div>
    <div className="relative w-full">
      <TransitionWrapper>
        <Info />
      </TransitionWrapper>
    </div>
    <div className="relative w-full">
      <TransitionWrapper>
        <Conference_Support />
      </TransitionWrapper>
    </div>
    <div className="relative w-full">
      <TransitionWrapper>
        <Media_Partners />
      </TransitionWrapper>
    </div>
    <div className="relative w-full">
      <TransitionWrapper>
        <Organiger />
      </TransitionWrapper>
    </div>
  </div>
);

const DesktopView = () => (
  <div className="flex flex-col items-center w-full">
    <div className="relative w-1/5"></div>
    <div className="relative flex w-full">
      <div className="relative w-1/5 flex items-center justify-center">
        <Announcement />
      </div>
      <div className="relative w-3/5 flex items-center justify-center">
        <TransitionWrapper>
          <SlideShow slides={slides1} />
        </TransitionWrapper>
      </div>
      <div className="relative w-1/4 flex items-center justify-center">
        <TransitionWrapper>
          <NoticeBoard />
        </TransitionWrapper>
      </div>
    </div>
    <div className="relative w-3/5">
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
        <Organiger />
      </TransitionWrapper>
    </div>
  </div>
);

export default function Home() {
  return (
    <div className="bg-white relative">
      <CompanyInfo />
      <NavBar />
      <Marquees />
      <div className="relative">
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