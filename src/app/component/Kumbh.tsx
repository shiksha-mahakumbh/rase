"use client";
import React, { useState, useEffect  } from "react";
import ShikshaKumbhPage from "./ShikshaKumbhPage"


const Kumbh =()=>{

    let text1 = `
    The Department of Holistic Education, Vidya Bharti, stands at the forefront of a noble mission to promote education rooted in Bhartiya values and culture on a global scale. With unwavering dedication spanning several decades, we have been committed to ensuring the welfare of all through holistic education. This journey has seen the successful launch of the "Shiksha Mahakumbh" initiative, which made its historic debut in June 2023, with the inaugural session held at NIT Jalandhar, marking a momentous stride in our quest to reimagine education.

Owing to the overwhelming demand from educational institutions to host future editions of Shiksha Mahakumbh, we are thrilled to announce that the quota for this groundbreaking initiative has been booked until 2025. However, we recognize the pressing need to reach every corner of our educational ecosystem and maintain the momentum of Shiksha Mahakumbh's transformative impact.

To this end, we introduce "Shiksha Kumbh," a groundbreaking concept designed to complement Shiksha Mahakumbh and ensure that the light of education reaches every institution. The first edition of Shiksha Kumbh is scheduled to take place at NIT Kurukshetra in December 2023. This event represents a focused and area-specific effort, allowing us to concentrate on select groups and address unique challenges while upholding our commitment to holistic and culturally rooted education.

Shiksha Kumbh promises to be a beacon of educational innovation, collaboration, and empowerment, reinforcing our mission to revitalize education and ensure its alignment with India's timeless cultural and philosophical values. We invite you to join us on this incredible journey as we work together to redefine education and ensure the welfare of all. `;

const [isText1Expanded, setIsText1Expanded] = useState(false);
  const [isMobile, setIsMobile] = useState(true); 

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
        Shiksha Kumbh
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
      <div className="ml-auto mr-auto">
        <ShikshaKumbhPage />
      </div>
    </div>
  );
};

export default Kumbh;