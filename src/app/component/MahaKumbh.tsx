"use client";
import React, { useState, useEffect  } from "react";
import ShikshaMahaKumbhPage from "./ShikshaMahaKumbhPage"


const MahaKumbh =()=>{

    let text1 = `
  Shiksha Mahakumbh is the brainchild of Dr. Thakur SKR, a prominent ISRO scientis.
  
  The inaugural edition of Shiksha Mahakumbh i.e., National Conference on Recent Advances in School Education (RASE 2023) was organised by Sarvhitkari Educational Society, a prominent unit of Vidya Bharti –Akhil Bhartiya Shiksha Sansthan in the state of Punjab, in collaboration with Dr. B. R. Ambedkar National Institute of Technology Jalandhar. The conference was held from June 9 to 11, 2023, at the esteemed premises of Dr. B. R. Ambedkar National Institute of Technology, Jalandhar.

  During the campaign of Shiksha Mahakumbh, the voice of conducting this very massive and innovative event annually in collaboration with Institutions of National Importance arose. Several Directors of these Institutions and Vice-Chancellors of Central Universities demanded its next edition in their Institutions. Accordingly, the matter was discussed within the committee of this mass movement and it’s decided to book its first 5 editions in collaboration with these Institutions of National Importance. When the agreement of its 2nd edition was signed between Department of Holistic Education, the originating place of this mass movement and Indian Institute of Technology Ropar, the news spread across the country. Thereafter several other Universities demanded for its editions in their institutions. Then the managing committee decided to launch its another franchise i.e., Shiksha Kumbh. Accordingly, the mass movement translated into Shiksha Mahakumbh – an annual event for the entire globe and Shiksha Kumbh – an annual event for field-specific participants of the globe.
`;

  const text2 = `The foremost objective of Shiksha Mahakumbh is to cultivate an environment conducive to the effective implementation of the National Education Policy 2020 (NEP). Moreover, this conference franchise aspires to congregate and facilitate the exchange of insights and research findings among distinguished academic scientists, researchers, research scholars, and industry experts, encompassing all facets of school and higher education. This endeavor, spearheaded by the Department of Holistic Education of Vidya Bharti, is unparalleled on a global scale, aiming to annually unite the 26.5 Crore school students and 4.25 Crore college/university students from across Bharat on a single platform to decide the direction of Bhartiya Education in a similar fashion as was the practice in ancient Bharat. It achieves this laudable goal through its collaboration with Institutions of National Importance. `;
  
  const text3 = `"Shiksha Mahakumbh is managed by the Event Management Cell of the Department of Holistic Education, which is a new generation Think Tank of Vidya Bharti.`;

const [isText1Expanded, setIsText1Expanded] = useState(false);
const [isText2Expanded, setIsText2Expanded] = useState(false);
const [isText3Expanded, setIsText3Expanded] = useState(false);
  const [isMobile, setIsMobile] = useState(true); 

  const toggleText1 = () => {
    setIsText1Expanded(!isText1Expanded);
  };
  const toggleText2 = () => {
    setIsText1Expanded(!isText2Expanded);
  };
  const toggleText3 = () => {
    setIsText1Expanded(!isText3Expanded);
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
    window.addEventListener('resize', handleWindowResize);
    return () => {
      window.removeEventListener('resize', handleWindowResize);
    };
  }, []); 
   const textClass = isMobile ? 'text-l' : 'text-l';
   const textClassHeading = isMobile ? 'text-xl' : 'text-xl';
 
  return (
    <div className="bg-white px-4 py-2 flex flex-col justify-between items-start">
      <h1 className={`${textClassHeading} font-bold text-primary text-center text-[25px]`}>
        Shiksha MahaKumbh
      </h1>
      <div className={`whitespace-pre-line text-justify ${textClass} text-black`}>
        {isText1Expanded ? text1 : (isMobile ? text1.slice(0, 254) : text1)}
        <button
          onClick={toggleText1}
          className={`text-blue-500 ${isText1Expanded || !isMobile ? 'hidden' : ''}`}
        >
          Read More
        </button>
      </div>
      <div className={`whitespace-pre-line text-justify ${textClass} text-black`}>
        {isText2Expanded ? text1 : (isMobile ? text2.slice(0, 254) : text2)}
        <button
          onClick={toggleText1}
          className={`text-blue-500 ${isText2Expanded || !isMobile ? 'hidden' : ''}`}
        >
          Read More
        </button>
      </div>
      <div className={`whitespace-pre-line text-justify ${textClass} text-black`}>
        {isText3Expanded ? text3 : (isMobile ? text3.slice(0, 254) : text3)}
        <button
          onClick={toggleText1}
          className={`text-blue-500 ${isText3Expanded || !isMobile ? 'hidden' : ''}`}
        >
          Read More
        </button>
      </div>
      <div className="ml-auto mr-auto">
        <ShikshaMahaKumbhPage />
      </div>
    </div>
  );
};

export default MahaKumbh;