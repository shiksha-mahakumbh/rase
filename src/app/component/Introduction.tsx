"use client";
import React, { useState, useEffect } from "react";

const Introduction = () => {
  const text = `
  Shiksha Mahakumbh Abhiyan is the brainchild of Dr. Thakur SKR, a prominent ISRO Scientist and staunch social worker. The Shiksha Mahakumbh Abhiyan is a visionary initiative aimed at redefining the educational landscape of Bharat through implementation of NEP 2020 and the globe. This monumental campaign is spearheaded by Vidya Bharti, the world's largest educational NGO, through its North Zone wing’s newly carved Vidya Bharti Institute of Training and Research Trust and managed by think tank Department of this trust i.e. Department of Holistic Education which collaborates with esteemed Institutions of National Importance like IITs, IIMs, AIIMS, NIDs, NITs, CUs, etc., to spearhead this very Abhiyan. 

The primary objective of this initiative is to provide a platform for entire population to have a dialogue on all aspects of education. Dialogue on achievements, hurdles and future directions at a single platform by keeping Panch Koshiya Bhartiya philosophy at the centre. The experts of every field with proper declarations help in enabling the nation on a progressive and prosperous path.  One of the unique aspects of the Shiksha Mahakumbh Abhiyan is its commitment to addressing regional disparities and global challenges in education. The encouragement of thousands of school students from neighboring states of the host state to participate in this prestigious event underscores this dedication. By providing school students exposure to Institution of National Importance, the initiative aims to inspire and guide them to harness their potential to excel in various fields.  Further this very Abhiyan aid in bridging the gap of school education, higher education, industry and society. The Shiksha Mahakumbh Abhiyan also emphasizes the importance of integrating traditional values with modern education. It seeks to uphold Globe’s rich cultural heritage and knowledge base while addressing contemporary challenges through a holistic approach. This initiative aligns with the broader vision of creating a well-rounded and resilient educational framework that can adapt to the evolving needs of society.  The Shiksha Mahakumbh Abhiyan commenced its journey with the grand event "शिक्षा महाकुंभ 1.0" which was held at NIT Jalandhar on June 9-11, 2023. It’s themed on Recent Advances in School Education (RASE). It garnered significant attention and participation from Governors, Union Ministers, Directors, Vice-chancellors, Bureaucrats, Media Personalities, Dignitaries from various sectors and Members of the society. This grand event set the stage for an annual gathering in terms of two events i.e. "शिक्षा महाकुंभ" and "शिक्षा कुंभ" aimed at fostering dialogue and collaboration among educators, researchers, students, and industry professionals from across the globe. "शिक्षा महाकुंभ" was designed for global participation and dialogue whereas "शिक्षा कुंभ" was planned to have dialogue on region and subject specific topics.  The inaugural edition of "शिक्षा कुंभ" was held at NIT Kurukshetra on December 20, 2023. The event focused on Role of Academic-driven Startups in Economy (RASE 2023) showcasing the potential of education to drive regional economic growth.  Building on the success of the 1st edition of "शिक्षा कुंभ", the 2nd Edition of "शिक्षा कुंभ", themed on Role of Academic-driven Startups in developing Economy of Jammu & Kashmir (RASE 2024) held on June 29-30, 2024 at NIT Srinagar further cemented the initiative's impact.  The 2nd edition of “शिक्षा महाकुंभ" is scheduled to take place from December 16-17, 2024, at Kurukshetra University Kurukshetra, promises to build on the success of its predecessor. This event is designed to serve as a global platform for sharing innovative ideas, research findings, and best practices in education along with staging dialogue on the usage of Indian Education System for Global Development. This journey is continued through passing on the baton year on year from one institute to another. IIT Jammu and JNU Delhi are queued up to host both of these events in 2025.   In recognition of the initiative's significance for shaping the nation through education, it has been decided that "शिक्षा कुंभ" shall be inaugurated by non-political personalities like Hon’ble Governor, Chief Justice, Renowned Entrepreneurs, etc.,  of the host state and “शिक्षा महाकुंभ” shall be inaugurated by esteemed non-political personalities like President of the Country, Chief Justice of the Country, Renowned Entrepreneurs of the country, etc. This endorsement from the highest office and personalities of the host states and highest office and personalities of the country highlights the campaign's importance in weaving the future of education in Bharat and showing the way to the globe through educational reforms.  The Shiksha Mahakumbh Abhiyan is more than just a series of events; it is a movement towards a transformative educational paradigm. By fostering collaboration, innovation, and inclusivity, this initiative aims to create a brighter future for generations to come, not only in Bharat but across the globe. Stay tuned to participate in this revolution and witness the changing wheels of educational landscape in the country and the globe.  

  In recognition of the initiative's significance for shaping the nation through education, it has been decided that "शिक्षा कुंभ" shall be inaugurated by Hon’ble Governor of the host state and “शिक्षा महाकुंभ” shall be inaugurated by esteemed President of Bharat annually. This endorsement from the highest office of the host states and highest office of the country highlights the campaign's importance in weaving the future of education in Bharat and showing the way to the globe through educational reforms.

  The Shiksha Mahakumbh Abhiyan is more than just a series of events; it is a movement towards a transformative educational paradigm. By fostering collaboration, innovation, and inclusivity, this initiative aims to create a brighter future for generations to come, not only in Bharat but across the globe. Stay tuned to participate in this revolution and witness the changing wheels of educational landscape in the country and the globe.
  `;

  const [isTextExpanded, setIsTextExpanded] = useState(false);
  const [isMobile, setIsMobile] = useState(true); // Default to mobile layout

  const toggleText = () => {
    setIsTextExpanded(!isTextExpanded);
  };

  useEffect(() => {
    const handleWindowResize = () => {
      const isMobileScreen = () => window.innerWidth < 640;
      // Update isMobile based on screen width
      setIsMobile(isMobileScreen());
    };

    // Check window size initially
    handleWindowResize();

    // Add a listener for window resize events
    window.addEventListener('resize', handleWindowResize);

    // Remove the listener when the component unmounts
    return () => {
      window.removeEventListener('resize', handleWindowResize);
    };
  }, []); // Empty dependency array to run this effect only once

  // Define the text class based on isMobile
  const textClass = isMobile ? 'text-l' : 'text-l';
  const textClassHeading = isMobile ? 'text-xl' : 'text-xl';

  // Split text at the point where the "Read More" button should appear
  const splitIndex = text.indexOf('progressive and prosperous path') + 35; // Length of "progressive and prosperous path"

  const textBefore = text.slice(0, splitIndex);
  const textAfter = text.slice(splitIndex);

  return (
    <div className="bg-white px-4 py-2 flex flex-col justify-between items-start">
      <h1 className={`${textClassHeading} py-2 text-[#502a2a] font-bold text-2xl`}>
        About Shiksha Mahakumbh Abhiyan
      </h1>
      <div className={`mb-4 whitespace-pre-line text-justify text-black`}>
        <div
          dangerouslySetInnerHTML={{ __html: isTextExpanded ? text : `${textBefore}.....` }}
        />
        <button
          onClick={toggleText}
          className={`text-[#502a2a] font-bold mt-2`}
        >
          {isTextExpanded ? 'Show Less' : 'Read More'}
        </button>
      </div>
    </div>
  );
};

export default Introduction;