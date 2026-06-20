"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";

const Journals: React.FC = () => {
  let text1 = `The turn around was massive in this mass event. The projects and the papers were enormous. To see this much turn around in terms of good works of all strata of society, it was decided to preserve it and further promote it through the official journal of this mass movement. Accordingly, Echoes of Shiksha Mahakumbh transformed into a quarterly journal to be launched i.e., Viksit India's which is an integral component of the Shiksha Mahakumbh initiative, a distinguished effort by the Department of Holistic Education in the realm of education. Your extensive expertise and profound insights in the field of education position you as a valuable contributor to this prestigious platform.
  
    Dedicated to education advancement: "Viksit India" is committed to nurturing discussions, research, and insights that pertain to the global educational landscape. We firmly believe that the wealth of experience and unwavering commitment to education align seamlessly with the objectives of this journal. The active participation has the potential to play a pivotal role in shaping the discourse on education.
   
    Comprehensive coverage of educational aspects: Embark on a profound exploration of the multifaceted world of education through this journal's comprehensive coverage. From pioneering research to visionary perspectives, the team of the journal meticulously examine every facet, ensuring that one stays at the forefront of the ever-evolving domain of learning and teaching.
    
    Viksit India journal is the passport to a realm filled with knowledge, inspiration, and innovation within the field of education.
     `;

  const text2 = `Recent Advances in School Education is a compendium of events from the inauguration to the passing of the world’s first Shiksha Mahakumbh, inspired by the spirit of Kumbh culture in ancient Bharat. Shiksha Mahakumbh is the brainchild of Dr. Thakur SKR, a prominent scientist of ISRO . The inaugural edition of Shiksha Mahakumbh i.e., National Conference on Recent Advances in School Education (RASE 2023) was organised by Sarvhitkari Educational Society, a prominent unit of Vidya Bharti – Akhil Bhartiya Shiksha Sansthan in the state of Punjab, in collaboration with Dr. B. R. Ambedkar National Institute of Technology Jalandhar. The conference was held from June 9to 11, 2023 at the esteemed premises of Dr. B. R. Ambedkar National Institute of Technology, Jalandhar.
  `;
  const [isText1Expanded, setIsText1Expanded] = useState(false);
  const [isText2Expanded, setIsText2Expanded] = useState(false);
  const [isMobile, setIsMobile] = useState(true); 
  const toggleText1 = () => {
    setIsText1Expanded(!isText1Expanded);
  };

  const toggleText2 = () => {
    setIsText2Expanded(!isText2Expanded);
  };
  const handleGoToHome = () => {
     window.location.href = "http://pub.rase.co.in";
  };
  const openPDF = () => {
      window.open("Proceeding.pdf", "_blank");
  };

  useEffect(() => {
    const handleWindowResize = () => {
      function isMobileScreen() {
        return window.innerWidth < 640;
      }
        setIsMobile(isMobileScreen());
    };
    function isMobileScreen() {
          return window.innerWidth < 640;
    }
      setIsMobile(isMobileScreen());
  window.addEventListener("resize", handleWindowResize);
   return () => {
      window.removeEventListener("resize", handleWindowResize);
    };
  }, []); 
  const textClass = isMobile ? "text-l" : "text-l";
  const textClassHeading = isMobile ? "text-2xl" : "text-2xl";

  return (
    <div className="bg-white p-2 flex flex-col justify-between items-start">
      <h1
        className={`${textClassHeading} headd font-bold py-6 text-primary text-center text-3xl`}
      >
        Journals
      </h1>
      <div
        className={`whitespace-pre-line text-justify ${textClass} text-black`}
      >
        {isText1Expanded ? text1 : isMobile ? text1.slice(0, 250) : text1}
        <button
          onClick={toggleText1}
          className={`text-blue-500 ${
            isText1Expanded || !isMobile ? "hidden" : ""
          }`}
        >
          Read More
        </button>
      </div>
      <div
        className={`whitespace-pre-line  ${textClass} cursor-pointer text-blue-400 underline`}
        onClick={handleGoToHome}
      >
        click here for more inforamtion.....
      </div>
      </div>
  );
};

export default Journals;
