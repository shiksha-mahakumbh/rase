"use client";
import React, { useState, useEffect  } from "react";

const Topics = () => {
    const [htmlContent, setHtmlContent] = useState("");

    const databases = [
      "Globalizing Bhartiya Education: Strategies for Internationalization",
      "Revolutionizing Pedagogy: Innovations for 21st Century Learning",
      "Technology Integration in Indian Classrooms: A Global Perspective",
      "Rethinking Curriculum: Aligning Indian Education with Global Standards",
      "Inclusive Education Practices for Diverse Global Communities",
      "Quality Assurance in Higher Education: Global Benchmarks and Practices",
      "Research and Development in Indian Education: A Global Outlook",
      "Transformative Teacher Training: Preparing Educators for Global Challenges",
      "Policy Reforms for Global Competitiveness in Indian Education",
      "Student-Centric Approaches to Learning: A Worldwide Exploration",
      "Ethical Education for Sustainable Global Citizenship",
      "Innovative Assessment Methods: Beyond Traditional Exams",
      "Entrepreneurial Education for Global Career Readiness",
      "Cultural Exchange in Education: Bridging Gaps, Building Bridges",
      "Public-Private Partnerships in Indian Education: International Models",
      "Mitigating the Digital Divide: Strategies for Equitable Access",
      "Health and Well-being in Education: A Global Imperative",
      "Community Engagement: Empowering Local Voices in Education",
      "Integrating Sustainable Development Goals into Indian Curriculum",
      "Empowering Students as Leaders: A Global Perspective",
      "Data-Driven Decision-making: Enhancing Educational Effectiveness",
      "Language and Cultural Competency in Global Education",
      "Flexible Learning Pathways: Adapting to Changing Educational Needs",
      "Sustainable Finance Models for Indian Education",
      "Higher Education-Industry Collaboration: A Global Framework",
      "Pedagogy for Lifelong Learning: Nurturing Continuous Skill Development",
      "Multidisciplinary Learning: Breaking Barriers, Fostering Innovation",
      "Promoting Civic Engagement through Education: A Global Vision",
      "Equitable Access to Education: Tackling Socioeconomic Disparities",
      "Digital Literacy: Navigating the Digital World in Education",
      "Innovations in Early Childhood Education: A Global Perspective",
      "Educational Leadership for Global Change: Insights and Strategies",
      "Global Trends in Educational Research and Development",
      "International Collaboration in Educational Technology: Case Studies",
      "Strategies for Inclusive STEM Education: Lessons from Global Practices",
      "Artificial Intelligence in Education: Opportunities and Challenges",
      "Global Best Practices in Educational Governance and Administration",
      "Cultivating Creativity: Arts and Humanities in Global Education",
      "Green Education: Environmental Sustainability in Indian Schools",
      "Promoting Emotional Intelligence in Education: A Global Approach",
      "Future of Work and Education: Anticipating Global Trends",
      "Digital Citizenship Education: Fostering Responsible Online Behavior",
      "Innovations in Language Education: Preparing Global Communicators",
      "Global Perspectives on Online and Blended Learning in Higher Education",
      "Cross-Cultural Learning Experiences: Student Exchanges and Beyond",
      "Education for Global Peace and Conflict Resolution",
      "Inclusive Technologies for Special Education: A Global Overview",
      "International Models of Teacher Evaluation and Professional Development",
      "Holistic Education: Integrating Mind, Body, and Spirit in Learning"
    ];
    
    return (
      <div className="p-4">
         <h1 className="text-black text-xl font-semibold py-2">
      Call for papers
        </h1>
        <h1 className="text-black  font-semibold py-2">
        Academicians, Researchers and Industrialists are invited to submit abstracts on the following areas and related topics:
        </h1>
        <ul className="list-disc list-inside sm:grid sm:grid-cols-2">
          {databases.map((database, index) => (
            <li
              key={index}
              className="relative before:text-xl before:text-black before:mr-2 text-black"
            >
              {database}
            </li>
          ))}
        </ul>
      </div>
    );
}

export default Topics