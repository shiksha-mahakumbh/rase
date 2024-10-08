"use client";
import React, { useState, useEffect } from "react";
import './talk.css'



const TalkShow = () => {
  let text1 = `
    Shiksha ki Baat Shikshavidon ke Saath is a unique and ongoing initiative that has its roots in the Shiksha Mahakumbh 2023 and extends beyond to upcoming Shiksha Mahakumbhs. This initiative centers around open discussions and dialogues, bringing together educators, experts, and thought leaders to address critical issues and trends in the field of education.

    The primary objective of this initiative is to delve into the most pressing topics in education, exploring various dimensions and perspectives. It aims to shed light on the challenges and opportunities that exist in the education sector and seeks to offer fresh insights and innovative solutions.
    
    It engages in discussions on vital educational topics with educators. Further it endeavors to touch upon various facets of education and present new directions for improvement in the field of education.
    
    This initiative aims not only to benefit those directly involved in education but also to provide valuable insights to anyone interested in the world of learning and teaching.

    This initiative is not just a platform for talking about education; it's a catalyst for positive change in the world of learning and teaching. By fostering collaboration, sharing ideas, and promoting innovation, "Shiksha ki Baat Shikshavidon ke Saath" aims to contribute to the continual improvement of the education sector and, ultimately, the betterment of society as a whole.
     `;

  const [isText1Expanded, setIsText1Expanded] = useState(false);
  const [isMobile, setIsMobile] = useState(true); // Default to mobile layout

  const toggleText1 = () => {
    setIsText1Expanded(!isText1Expanded);
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
  const textClassHeading = isMobile ? "text-xl" : "text-xl";

  return (
    <div className="bg-white px-2 py-2 flex flex-col justify-between items-start">
      <h1
        className={`${textClassHeading} headd font-semibold py-6 text-orange-600 text-center text-3xl`}
      >
        Shiksha ki Baat Shikshavidon ke Saath
      </h1>
      <iframe
        className="item-center ytframe"
        width="560"
        height="315"
        src="https://www.youtube.com/embed/yJDM90YAKh8?si=CEsIxwVLep1FUy68"
        title="YouTube video player"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
      ></iframe>

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
    </div>
  );
};

export default TalkShow;
