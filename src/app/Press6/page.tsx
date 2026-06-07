"use client";
import React from "react";
import CompanyInfo from "../component/CompanyInfo";
import Footer from "../component/Footer";
import RelatedContentSectionClient from "@/components/knowledge-graph/RelatedContentSectionClient";
import WhatsAppIcon from "@/components/common/WhatsAppIcon";
import NavBar from "../component/NavBar";
import Press5 from "../component/Press6";
import proceeding5 from '/public/2024M/press5.jpg';
import Image from "next/image";
import { getPressShareUrl } from "@/lib/seo/pressShare";

const shareUrl = getPressShareUrl(6);
const shareText = encodeURIComponent("Shiksha Mahakumbh 2024 begins at Kurukshetra University");
const shareImage = "/2024M/Press7.jpg";
// Sample data for demonstration. Replace this with your actual data source or fetch method.
const data = {
  Press: "6",
  image:"/2024M/Press7.jpg",
  title: ``,
  sections: [
    {
      title: 'Human behaviour has indispensable role in Indian education: Swami Gyananand, Entrepreneurship cells must be established in Higher Education: Sah Sanghatak Satish Kumar',
      content: [
        `Indian Knowledge System integral part of NEP 2020: VC KUK
Kurukshetra, 16 December. Kurukshetra University, Kurukshetra organized the inaugural session of two-day Shiksha Maha Kumbh 2024 on 'Indian Education System for Global Development' under the joint aegis of Department of Holistic Education, Chandigarh. In the inaugural session, the Chief Guest, Gita Manishi Swami Gyananand Maharaj said that the knowledge of books and experiential learning help bring out the inner consciousness and awareness which is usually covered within layers of materialism. Swami added that human behaviour has indispensable role in Indian education system which nurtures the humane values of goodness in a person. The keynote speaker, Sh Satish Kumar, Sah Sanghatak, Swadeshi Jagran Manch said that for the development of Bharat, effective steps should be taken to encourage entrepreneurship and Sah Sanghatak Satish  added that entrepreneurship cells should be established in each college and university so that students become self reliant and job creators. Patron, Shiksha Mahakumbh and Vice Chancellor, Kurukshetra University, Prof Som Nath Sachdeva welcomed the Chief Guest Swami Gyananand Maharaj and all the dignitaries and said that Kurukshetra University is the first university of Haryana to implement NEP 2020 with all its provisions not only in the campus but also in all the affiliated colleges. Prof Sachdeva added that Indian Knowledge System is integrated in the various components of NEP 2020.

` ]
    },
    {
      title: "General Secretary, Vidya Bharti, Desh Raj Sharma",
      content: [
        <b key="highlight-2">परिचय सत्र:</b>,
        'General Secretary, Vidya Bharti, Desh Raj Sharma gave the outline of Shiksha Mahakumbh. North Zone Sangathan Mantri Vidya Bharti, Vijay Kumar Nadda emphasized the importance of educational collaboration. My Home India Founder Sunil Deodhar said that the meaning of practicality of life was understood through the education system in Gurukul Ashram.',
      ]
    },
    {
      title: "General Secretary, Akhil Bharatiya Vidya Sansthan,  Avnish Bhatnagar ",
      content: [
        `General Secretary, Akhil Bharatiya Vidya Sansthan,  Avnish Bhatnagar said that  Indian education works with the spirit of global welfare. At the end of the programme, KU Registrar Professor Sanjeev Sharma thanked all the guests. Deputy Director Public Relations Department Dr Jimmy Sharma informed that a plenary session was organised. In this session, Vice Chancellor Gurugram University, Prof. Dinesh Kumar,  Vice Chancellor, Central University, Mahendragarh, Prof. Tankeshwar Kumar, Vice Chancellor of CBLU, Prof. Deepti Dharmani were the eminent speakers. Dr Jimmy Sharma added that  VC/Directors' conclave, Principals' and innovative teachers' conclave, bureaucrats and entrepreneurs' conclave and student leaders' conclave were the key features of this programme.`
      ]
    
    },
    {
      title: "संपर्क करें:",
      content: [
        <ul key="contact-list">
          <li key="contact-1">
            <a
              href="tel:+917903431900"
              style={{ color: "blue", textDecoration: "none" }}
            >
              Call: +91 94632 31250 - शमशेर सिंह जी
            </a>{" "},
            <a
              href="https://wa.me/917903431900"
              target="_blank"
              style={{ textDecoration: "none" }}
            >
              <WhatsAppIcon />
            </a>
          </li>
          <li key="contact-2">
            <a
              href="tel:+918360990494"
              style={{ color: "blue", textDecoration: "none" }}
            >
              Call: +91 83609 90494 - जितेश पांडेय जी
            </a>
            ,
            <a
              href="https://wa.me/918360990494"
              target="_blank"
              style={{ textDecoration: "none" }}
            >
              <WhatsAppIcon />
            </a>
          </li>
          <li key="contact-3">
            <a
              href="tel:+919416362401"
              style={{ color: "blue", textDecoration: "none" }}
            >
              Call: +91 94163 62401 - सुनील धींगड़ा जी
            </a>{" "},
            <a
              href="https://wa.me/919416362401"
              target="_blank"
              style={{ textDecoration: "none" }}
            >
              <WhatsAppIcon />
            </a>
          </li>
        </ul>,
      ],
    },
    {
        title: "सादर,",
        content: [`संयोजक
                   शिक्षा महाकुंभ 2024`,
        ]
      },
      {
        title: "भागीदारी के लिए अधिक जानकारी के लिए संपर्क करें:",
        content: [`🌐 www.shikshamahakumbh.com
                   ✉️ info@shikshamahakumbh.com`,
        ]
      },
  ],
};

export default function Home() {
  return (
    <div className="bg-white">
      <CompanyInfo />
      <NavBar />
      
      <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 pb-6">
        
        <div className="w-full sm:w-1/5">
          {/* Left sidebar or additional content */}
        </div>
        <div className="w-full sm:w-3/5">
          <Press5 data={data} />
          {/* Social Media Sharing Section */}
          <div className="mt-6 flex justify-center space-x-4">
            <a
              href={`https://wa.me/?text=${shareText}%20${shareUrl}&picture=${shareImage}`}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 bg-green-500 text-white rounded hover:bg-green-600"
            >
              WhatsApp
            </a>
            <a
              href={`https://www.facebook.com/sharer/sharer.php?u=${shareUrl}&quote=${shareText}&picture=${shareImage}`}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Facebook
            </a>
            <a
              href={`https://twitter.com/intent/tweet?text=${shareText}&url=${shareUrl}&picture=${shareImage}`}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 bg-blue-400 text-white rounded hover:bg-blue-500"
            >
              Twitter
            </a>
            <a
              href={`mailto:?subject=Shiksha Mahakumbh 2.0&body=${shareText}%20${shareUrl}&picture=${shareImage}`}
              className="p-2 bg-gray-500 text-white rounded hover:bg-gray-600"
            >
              Email
            </a>
          </div>
        </div>
        <div className="w-full sm:w-1/5">
          {/* Right sidebar or additional content */}
        </div>
      </div>
      <RelatedContentSectionClient path="/Press6" title="Related programmes & resources" />
    <Footer />
    </div>
  );
}
