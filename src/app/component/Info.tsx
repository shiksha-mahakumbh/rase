"use client";
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

const Info = () => {
  const text = `
  <h2 class="text-3xl font-extrabold text-[#502a2a] mb-4 leading-snug">
    शिक्षा महाकुंभ अभियान: <br/> A National Movement for Global Educational Transformation
  </h2>

  <p class="text-lg leading-relaxed">
    शिक्षा महाकुंभ अभियान is a visionary multi-edition national movement conceptualised by visionary ISRO scientist and accomplished author 
    <strong> Dr. Thakur SKR </strong> under the guidance of 
    <strong> Sh. Vijay Nadda </strong>, Visionary Educationist and Social Reformer. 
    It unites leaders from across education, policy, industry, civil society, and the youth to reimagine and reform the 
    <strong> Bhartiya education system </strong> — while contributing to the evolution of a globally equitable, future-ready learning ecosystem.
  </p>
  `;

  const [isTextExpanded, setIsTextExpanded] = useState(false);
  const [isMobile, setIsMobile] = useState(true);

  const toggleText = () => setIsTextExpanded(!isTextExpanded);

  useEffect(() => {
    const handleWindowResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    handleWindowResize();
    window.addEventListener("resize", handleWindowResize);
    return () => window.removeEventListener("resize", handleWindowResize);
  }, []);

  const splitIndex = text.indexOf("It unites leaders");
  const textBefore = text.slice(0, splitIndex);
  const textAfter = text.slice(splitIndex);

  return (
    <section className="relative bg-gradient-to-b from-[#fff8f6] via-white to-[#fdfdfd] px-6 py-10 rounded-2xl shadow-lg">
      {/* Heading */}
      <h1 className="text-3xl md:text-4xl text-center font-extrabold text-[#502a2a] mb-6 drop-shadow-sm">
        About Shiksha Mahakumbh Abhiyan
      </h1>

      {/* Animated Text Section */}
      <div className="text-black text-justify max-w-5xl mx-auto leading-relaxed">
        <div
          dangerouslySetInnerHTML={{
            __html: isTextExpanded ? text : `${textBefore}...`,
          }}
        />

        {/* Animated Extra Content */}
        <AnimatePresence>
          {isTextExpanded && (
            <motion.div
              key="extra-text"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
              className="mt-4"
              dangerouslySetInnerHTML={{ __html: textAfter }}
            />
          )}
        </AnimatePresence>

        {/* Button */}
        <div className="flex justify-center mt-6">
          <button
            onClick={toggleText}
            className="bg-[#502a2a] text-white px-6 py-2 rounded-full font-semibold hover:bg-[#734040] shadow-md transition duration-300"
          >
            {isTextExpanded ? "Show Less ▲" : "Read More ▼"}
          </button>
        </div>
      </div>
    </section>
  );
};

export default Info;
