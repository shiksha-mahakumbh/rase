import React from "react";
import Image from "next/image";

const CompanyInfo: React.FC = () => {
  return (
    <div className="flex flex-col items-center md:flex justify-between p-2 bg-[#f5f0e7]">
      <h3 className="text-l mb-2 md:text-xl font-semibold text-[#4d1414] ">
          Welcome to
        </h3>
      <a href="/">
        <Image
          src="/shiksha.png"
          alt="Company Logo Right"
          className="w-16 h-16 md:w-16 md:h-16"
          height={500}
          width={500}
        />
      </a>
      <div className="text-center">
        
        
        <h3 className="text-l mb-2 md:text-xl font-semibold text-[#4d1414]">
        शिक्षा महाकुंभ अभियान


        </h3>
        
        <h3 className="text-l mb-2 md:text-xl  font-bold text-[#4d1414]">
        Shiksha MahaKumbh Abhiyan
        </h3>
      </div>
      <a href="https://dhe.org.in" target="_blank" rel="noopener noreferrer">
        <Image
          src="/DHELogo.png"
          alt="Company Logo Left"
          className=" hidden w-16 h-16 md:w-16 md:h-16 lg:w-36 lg:h-36"
          height={500}
          width={500}
        />
      </a>
    </div>
  );
};

export default CompanyInfo;
