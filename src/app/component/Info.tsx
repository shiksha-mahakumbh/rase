"use client";
import React, { useState, useEffect } from "react";

const Info = () => {
  const text = `
  <h2 class="text-2xl font-bold text-[#502a2a] mb-4">शिक्षा महाकुंभ अभियान: A National Movement for Global Educational Transformation</h2>

  <p>
  शिक्षा महाकुंभ अभियान is a visionary multi-edition national movement conceptualised by visionary ISRO scientist and accomplished author 
  <strong>Dr. Thakur SKR</strong> under the guidance of <strong>Sh. Vijay Nadda</strong>, Visionary Educationist and Social Reformer, that unites leaders from across education, policy, industry, civil society, and the youth to reimagine and reform the <strong>Bhartiya education system</strong>—while contributing to the evolution of a globally equitable, future-ready learning ecosystem.
  </p>

  <p class="mt-2">
  Rooted in Bhartiya knowledge systems and aligned with global educational priorities, this initiative serves as a vibrant platform for collaboration, innovation, and action. It is designed to influence educational transformation not only in Bhartiya but across the globe—bringing together insights from local classrooms and global think tanks alike.
  </p>

  <p class="mt-2">
  At the heart of Shiksha Mahakumbh Abhiyan lies an ambitious yet grounded vision: to help shape an inclusive, interdisciplinary, ethical, and resilient global education framework. It emphasizes:
  </p>

  <ul class="list-disc pl-6 mt-2 space-y-1">
    <li>Integration of global best practices with Bhartiya values</li>
    <li>Innovative pedagogies and future-ready curriculum</li>
    <li>Harnessing technology and digital learning to enhance accessibility and relevance</li>
  </ul>

  <p class="mt-2">The initiative focuses on urgent educational priorities including:</p>

  <ul class="list-disc pl-6 mt-2 space-y-1">
    <li>Inclusivity and universal access to quality learning</li>
    <li>Teacher training, capacity building, and professional growth</li>
    <li>Policy alignment with UN SDGs and national development goals</li>
    <li>Cultural preservation and global exchange</li>
    <li>Bridging the digital divide through EdTech</li>
    <li>Flexible, skill-based, and multidisciplinary learning models</li>
    <li>Promotion of ethical, sustainable, and local-context education</li>
  </ul>

  <p class="mt-4">
  Each edition of the Mahakumbh is designed not just for discussion but to generate actionable insights, policy roadmaps, and community-driven solutions. Each edition builds upon the outcomes of the previous, weaving a continuous thread of innovation, implementation, and impact:
  </p>

  <ul class="list-none mt-4 space-y-3">
    <li>🔹 <strong>1st Edition – NIT Jalandhar | 9th–11th June 2023</strong><br/>Theme: Recent Advances in School Education (RASE)<br/>Impact: Initiated national dialogue on foundational reforms, introduced community-driven school models, and generated a best practices compendium on K–12 innovations.</li>

    <li>🔹 <strong>2nd Edition – NIT Kurukshetra | 20th December 2023</strong><br/>Theme: Role of Academic-Driven Startups in the Economy (RASE)<br/>Impact: Sparked nationwide collaboration between academia and entrepreneurship, resulting in MoUs, startup incubation, and industry-institution integration plans.</li>

    <li>🔹 <strong>3rd Edition – NIT Srinagar | 29th–30th June 2024</strong><br/>Theme: Academic Innovation for the Economic Development of J&K<br/>Impact: Focused on peace-building and economic empowerment through education in conflict-prone zones; initiated local skilling programs and startup mentorship cells.</li>

    <li>🔹 <strong>4th Edition – Kurukshetra University | 16th–17th December 2024</strong><br/>Theme: Bhartiya Education System for Global Development<br/>Impact: Developed a national vision document for Bhartiya as a global education hub, rooted in NEP 2020 and Bhartiya knowledge systems.</li>

    <li>🔹 <strong>5th Edition – NIPER Mohali | 31st Oct – 2nd Nov 2025</strong><br/>Theme: Empowering Global Health through Pharma Innovation and Education<br/>Expected Impact: Strategic roadmap for linking pharmaceutical education, R&D, and global health; building Bhartiya's role in global medical innovation and knowledge exchange.</li>
  </ul>

  <p class="mt-4">
  Shiksha Mahakumbh Abhiyan is not just a conference series—it is a national implementation accelerator. Each edition contributes to:
  </p>

  <ul class="list-disc pl-6 mt-2 space-y-1">
    <li>Actionable frameworks for educational institutions and policy bodies</li>
    <li>Cross-sector partnerships between academia, industry, NGOs, and government</li>
    <li>White papers, manuals, and policy briefs for stakeholders</li>
    <li>Formation of task forces and working groups for follow-through and monitoring</li>
  </ul>

  <p class="mt-4">
  What sets Shiksha Mahakumbh Abhiyan apart is its commitment to deep inclusion. It moves beyond academic silos to engage:
  </p>

  <ul class="list-disc pl-6 mt-2 space-y-1">
    <li>School teachers, principals, and university leaders</li>
    <li>Youth changemakers, students, and researchers</li>
    <li>Rural educators, grassroots innovators, and panchayat leaders</li>
    <li>Policymakers, industry professionals, and technologists</li>
    <li>NGOs, CSR heads, international diplomats, and media voices</li>
  </ul>

  <p class="mt-4 font-semibold">
  This whole-of-society approach ensures that reforms are not only visionary but also practical, inclusive, and community-driven. The Shiksha Mahakumbh Abhiyan is a clarion call to every citizen, policymaker, and thought leader.
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

  const splitIndex = text.indexOf("Rooted in Bhartiya knowledge systems");
  const textBefore = text.slice(0, splitIndex);
  const textAfter = text.slice(splitIndex);

  return (
    <div className="bg-white px-4 py-2 flex flex-col justify-between items-start">
      <h1 className={`${textClassHeading} py-2 text-[#502a2a] font-bold`}>
        About Shiksha Mahakumbh Abhiyan
      </h1>
      <div className="mb-4 whitespace-pre-line text-justify text-black">
        <div
          dangerouslySetInnerHTML={{
            __html: isTextExpanded ? text : `${textBefore}.....`,
          }}
        />
        <button
          onClick={toggleText}
          className="text-[#502a2a] font-bold mt-2 hover:underline"
        >
          {isTextExpanded ? "Show Less" : "Read More"}
        </button>
      </div>
    </div>
  );
};

export default Info;
