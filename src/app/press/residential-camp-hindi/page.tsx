"use client";
import React from "react";
import CompanyInfo from "@/app/component/CompanyInfo";
import Footer from "@/app/component/Footer";
import RelatedContentSectionClient from "@/components/knowledge-graph/RelatedContentSectionClient";
import WhatsAppIcon from "@/components/common/WhatsAppIcon";
import NavBar from "@/app/component/NavBar";
import Press4 from "@/app/component/Press4";
import proceeding4 from '/public/2024M/press4.jpg';
import Image from "next/image";

import { getPressShareUrl } from "@/lib/seo/pressShare";

const shareUrl = getPressShareUrl(4);
const shareText = encodeURIComponent("आवासीय अभ्यास वर्ग – सफलता की ओर एक और कदम");
const shareImage = "/2024M/press3.jpg";
// Sample data for demonstration. Replace this with your actual data source or fetch method.
const data = {
  Press: "4",
  image:"/2024M/press4.jpg",
  title: ``,
  sections: [
    {
      title: "कुरुक्षेत्र, 7 दिसंबर 2024:",
      content: [
        `शिक्षा महाकुंभ 2.0 की तैयारियों के अंतर्गत सुबह 7:30 बजे UIET, कुरुक्षेत्र विश्वविद्यालय में "हवन रश्म" का आयोजन किया गया। यह हवन शिक्षा और समाज के कल्याण के लिए समर्पित है। इसमें प्रमुख गणमान्य व्यक्तियों, विद्वानों और आयोजकों ने भाग लिया। हवन के बाद कोर कमेटी बैठक आयोजित की गई, जिसमें शिक्षा महाकुंभ से संबंधित सभी आवश्यक बिंदुओं पर चर्चा की गई। इस बैठक में शिक्षा महाकुंभ 2.0 को सफल और प्रभावशाली बनाने के लिए योजनाओं और पहलुओं को अंतिम रूप दिया गया।` ]
    },
    {
      title: "अभ्यास वर्ग की मुख्य विशेषताएं:",
      content: [
        <b key="highlight-2">परिचय सत्र:</b>,
        '23 नवम्बर 2024:डॉ. सुदेश जी द्वारा "डिपार्टमेंट ऑफ होलिस्टिक एजुकेशन (DHE) एवं शिक्षा महाकुंभ" का परिचय। इस सत्र में शिक्षा महाकुंभ की संरचना, उद्देश्यों और इसकी प्रमुख गतिविधियों पर चर्चा की जाएगी।',
        <b key="highlight-2">कार्यक्रम योजना:</b>,
        'सुरेंद्र अत्रि जी (उपाध्यक्ष, विद्या भारती उत्तर क्षेत्र) द्वारा शिक्षा महाकुंभ-2024 की विस्तृत योजना और आगामी कार्यों की चर्चा।',
      ]
    },
    {
      title: "शिक्षा महाकुंभ-2024 की मुख्य झलकियां:",
      content: [
        'बैठक में विद्या भारती उत्तर क्षेत्र के संगठन मंत्री श्री विजय कुमार नड्डा और कुरुक्षेत्र विश्वविद्यालय के कुलपति ने उपस्थित सभी सदस्यों को संबोधित किया। उन्होंने समाज के सभी वर्गों से इस अभियान में जुड़ने और इसे सफल बनाने के लिए आह्वान किया। उन्होंने कहा कि शिक्षा महाकुंभ में भाग लेने के लिए कई विकल्प हैं, जैसे:',
        <b key="attractions-1">अनुसंधान और नवाचार का प्रदर्शन:</b>,
        "शोध पत्र प्रस्तुतिकरण ,कन्क्लेव्स (विशेष संवाद) ,विचार प्रस्तुति",
        <b key="attractions-2">सर्वश्रेष्ठ प्रथाओं का आदान-प्रदान:</b>,
        "प्रायोजन (सपोर्टर बनने का अवसर)",
        <b key="attractions-2">प्रतिभा का सम्मान:</b>,
        "विशेष सत्रों में विभिन्न क्षेत्रों की उत्कृष्ट प्रतिभाओं को पहचान और सम्मान ,पारंपरिक ज्ञान और कौशल का प्रदर्शन",
        <b key="attractions-2">प्रतिभा का सम्मान:</b>,
        "स्वयंसेवी सहभागिता ,व्यवसायिक प्रदर्शनियां और स्टॉल्स",
      ]
    },
    {
      title: "शिक्षा महाकुंभ 2.0 ",
      content: [
        'शिक्षा महाकुंभ 2.0 न केवल शिक्षा नीति और कौशल विकास पर चर्चा का मंच प्रदान करता है, बल्कि यह भारतीय शिक्षा प्रणाली को वैश्विक स्तर पर प्रस्तुत करने का एक महत्वपूर्ण प्रयास है। शिक्षा को एक वैश्विक मंच प्रदान करना इसका मूल उद्देश्य है।',
      ]
    },
    {
      title: "मीडिया से अनुरोध:",
      content: [
        ' आप सभी से अनुरोध है कि इस ऐतिहासिक आयोजन के लिए अधिक से अधिक प्रचार-प्रसार करें और जनता तक इसकी विशेषताओं को पहुंचाएं।',
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
          <Press4 data={data} />
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
      <RelatedContentSectionClient path="/press/residential-camp-hindi" title="Related programmes & resources" />
    <Footer />
    </div>
  );
}
