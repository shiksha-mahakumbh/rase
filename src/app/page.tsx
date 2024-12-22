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
      "Final closing press conference for the Shiksha Mhakumbh 2.0",
  },
  {
    src: "/2024M/baton/baton1.jpg",
    alt: "Image 1",
    legend:
      "Baton Ceremony Shiksha Mahakumbh 2024",
  },
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
    legend: "Shri Manoj Sinha, Hon’ble Lieutenant Governor, J&K",
  },
  {
    src: "/2024K/k7.png",
    alt: "Image 1",
    legend: "Dr. Jitendra Singh, Hon’ble MoS (IC), Science and Technology",
  },
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
  <div className="flex flex-col space-y-4 items-center">
    <div className="flex flex-col w-full">
      <div className="flex items-center justify-center">
        <TransitionWrapper>
          <SlideShow slides={slides1} />
        </TransitionWrapper>
      </div>
      <div className="flex items-center justify-center">
        <Announcement />
      </div>
      <TransitionWrapper>
        
        <NoticeBoard />
      </TransitionWrapper>
    </div>
    <div className="w-full">
      <TransitionWrapper>
        <Info />
      </TransitionWrapper>
    </div>
    <div className="w-full">
      <TransitionWrapper>
        <Conference_Support />
      </TransitionWrapper>
    </div>
    <div className="w-full">
      <TransitionWrapper>
        <Media_Partners />
      </TransitionWrapper>
    </div>
    <div className="w-full">
      <TransitionWrapper>
        <Organiger />
      </TransitionWrapper>
    </div>
    
  </div>
);

const DesktopView = () => (
  <div className="flex flex-col items-center space-x-4">
    <div className="w-1/5"></div>
    <div className="flex ">
      <div className="w-1/5 flex items-center justify-center">
        <Announcement />
      </div>
      <div className="w-3/5 flex items-center justify-center">
        <TransitionWrapper>
          <SlideShow slides={slides1} />
        </TransitionWrapper>
      </div>
      <div className="w-1/4 flex items-center justify-center">
        <TransitionWrapper>
          <NoticeBoard />
        </TransitionWrapper>
      </div>
    </div>
    <div className="w-3/5">
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
    <div className="bg-white">
      <CompanyInfo />
      <NavBar />
      <Marquees />

      <div>
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
