"use client";
import React, { useState, useEffect } from "react";

const Info = () => {
  const text = `
  <h2 class="text-2xl md:text-3xl font-bold text-[#502a2a] mb-3 text-center">
    शिक्षा महाकुंभ अभियान: A National Movement for Global Educational Transformation
  </h2>

  <p class="mb-2 leading-relaxed">
  शिक्षा महाकुंभ अभियान is a visionary multi-edition national movement conceptualised by visionary ISRO scientist and accomplished author 
  <strong>Dr. Thakur SKR</strong> under the guidance of <strong>Sh. Vijay Nadda</strong>, Visionary Educationist and Social Reformer. It unites leaders from across education, policy, industry, civil society, and the youth to reimagine and reform the <strong>Bhartiya education system</strong>.
  </p>

  <p class="mb-2 leading-relaxed">
  Rooted in Bhartiya knowledge systems and aligned with global educational priorities, this initiative serves as a vibrant platform for collaboration, innovation, and action—bringing together insights from local classrooms and global think tanks alike.
  </p>

  <p class="mb-2 leading-relaxed font-semibold">
  Core Focus:
  </p>
  <ul class="list-disc pl-5 space-y-1 text-gray-800">
    <li>Integration of global best practices with Bhartiya values</li>
    <li>Innovative pedagogies & future-ready curriculum</li>
    <li>Harnessing technology and digital learning</li>
  </ul>

  <p class="mt-3 mb-2 font-semibold">Key Priorities:</p>
  <ul class="list-disc pl-5 space-y-1 text-gray-800">
    <li>Inclusivity & universal access to quality learning</li>
    <li>Teacher training & professional growth</li>
    <li>Policy alignment with UN SDGs</li>
    <li>Cultural preservation & global exchange</li>
    <li>Bridging the digital divide through EdTech</li>
  </ul>

  <h3 class="mt-4 mb-2 font-bold text-lg text-[#502a2a]">Past Editions:</h3>
  <ul class="list-none space-y-2">
    <li>🔹 <strong>1st Edition – NIT Jalandhar | June 2023</strong> — Focus on K–12 reforms & best practices compendium.</li>
    <li>🔹 <strong>2nd Edition – NIT Kurukshetra | Dec 2023</strong> — Startup-academia collaborations & MoUs.</li>
    <li>🔹 <strong>3rd Edition – NIT Srinagar | June 2024</strong> — Skilling & innovation for peace-building in J&K.</li>
    <li>🔹 <strong>4th Edition – Kurukshetra University | Dec 2024</strong> — Bhartiya Education Vision for Global Hub.</li>
    <li>🔹 <strong>5th Edition – NIPER Mohali | Oct–Nov 2025</strong> — Linking pharma education with global health.</li>
  </ul>

  <p class="mt-3 font-semibold text-center text-[#502a2a]">
  Shiksha Mahakumbh Abhiyan is not just a conference—it’s a national implementation accelerator shaping policy, partnerships, and real impact.
  </p>
  `;

  const [isTextExpanded, setIsTextExpanded] = useState(false);
  const [isMobile, setIsMobile] = useState(true);

  const toggleText = () => setIsTextExpanded(!isTextExpanded);

  useEffect(() => {
    const handleWindowResize = () => {
      setIsMobile(window.innerWidth < 640);
    };

    handleWindowResize();
    window.addEventListener("resize", handleWindowResize);
    return () => window.removeEventListener("resize", handleWindowResize);
  }, []);

  const textClassHeading = isMobile ? "text-xl" : "text-2xl";

  return (
    <div className="bg-gradient-to-br from-[#fff7f7] to-[#f5f0f0] px-5 py-6 rounded-xl shadow-md border border-[#e7dcdc]">
      <h1 className={`${textClassHeading} mb-3 text-[#502a2a] font-bold text-center`}>
        About Shiksha Mahakumbh Abhiyan
      </h1>

      <div className="text-black leading-relaxed text-justify">
        <div
          dangerouslySetInnerHTML={{
            __html: isTextExpanded ? text : `${text.substring(0, 700)}...`,
          }}
        />
        <div className="flex justify-center">
          <button
            onClick={toggleText}
            className="mt-4 px-6 py-2 bg-[#502a2a] text-white rounded-full shadow hover:bg-[#7a4343] transition duration-300"
          >
            {isTextExpanded ? "Show Less" : "Read More"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Info;
