import React from "react";
import Image from "next/image";

const CompanyInfo: React.FC = () => {
  return (
    <section
      className="flex flex-col md:flex-row items-center justify-between 
                 bg-gradient-to-r from-[#f5f0e7] to-[#fdfdfc] 
                 p-6 rounded-2xl shadow-lg"
    >
      {/* Left Section - Welcome Text */}
      <div className="flex flex-col items-center md:items-start text-center md:text-left space-y-2 max-w-lg">
        <h2 className="text-2xl md:text-3xl font-bold text-[#4d1414] drop-shadow">
          Welcome to <span className="text-[#b22222]">Shiksha Mahakumbh Abhiyan</span>
        </h2>
        <p className="text-sm md:text-base text-gray-700 leading-relaxed">
          An initiative by the <strong>Department of Holistic Education (DHE)</strong> in collaboration 
          with <strong>INIs</strong>, committed to fostering education, research, innovation, and 
          <em> Indian Knowledge Systems</em> for <strong>Bharat@2047</strong>.
        </p>
      </div>

      {/* Center Logo Section */}
      <div className="flex flex-col items-center mt-6 md:mt-0">
        <a href="/" aria-label="Shiksha Mahakumbh Home">
          <Image
            src="/shiksha.png"
            alt="Shiksha Mahakumbh Abhiyan Logo"
            className="w-24 h-24 md:w-28 md:h-28 drop-shadow-lg transition-transform hover:scale-110"
            height={112}
            width={112}
            priority
          />
        </a>
        <h3 className="mt-3 text-lg md:text-xl font-semibold text-[#4d1414] tracking-wide">
          शिक्षा महाकुंभ अभियान
        </h3>
        <h3 className="text-base md:text-lg font-bold text-[#b22222]">
          Shiksha Mahakumbh Abhiyan
        </h3>
      </div>

      {/* Right Section - DHE Logo */}
      <div className="mt-6 md:mt-0">
        <a
          href="https://dhe.org.in"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Department of Holistic Education"
        >
          <Image
            src="/DHELogo.png"
            alt="Department of Holistic Education (DHE) Logo"
            className="w-20 h-20 md:w-28 md:h-28 lg:w-32 lg:h-32 drop-shadow-md transition-transform hover:scale-110"
            height={128}
            width={128}
          />
        </a>
      </div>
    </section>
  );
};

export default CompanyInfo;
