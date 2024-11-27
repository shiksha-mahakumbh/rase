"use client";
import React from "react";
import CompanyInfo from "../component/CompanyInfo";
import Footer from "../component/Footer";
import NavBar from "../component/NavBar";
import Press3 from "../component/Press3";
import proceeding3 from '/public/2024M/press3.jpg';
import Image from "next/image";

const shareUrl = encodeURIComponent("https://www.rase.co.in/Press2"); // Replace with your actual page URL
const shareText = encodeURIComponent("आवासीय अभ्यास वर्ग – सफलता की ओर एक और कदम");
const shareImage = "/2024M/press3.jpg";
// Sample data for demonstration. Replace this with your actual data source or fetch method.
const data = {
  Press: "3",
  image:"/2024M/press3.jpg",
  title: " 23 एवं 24 नवम्बर 2024,गीता निकेतन आवासीय विद्यालय, कुरुक्षेत्र",
  sections: [
    {
      title: "शिक्षा महाकुंभ-2024",
      content: [
        "द्वितीय संस्करण का आयोजन 16 एवं 17 दिसम्बर 2024 को कुरुक्षेत्र विश्वविद्यालय, हरियाणा में किया जाएगा। इस महत्वपूर्ण आयोजन की तैयारी के लिए दो दिवसीय आवासीय अभ्यास वर्ग का आयोजन किया जा रहा है। यह अभ्यास वर्ग शिक्षा महाकुंभ के सफल आयोजन की दिशा में एक अहम कदम है, जिसमें सभी प्रतिभागियों को कार्यक्रम के उद्देश्यों और कार्ययोजनाओं से अवगत कराया जाएगा।   " ]
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
        ' 1. नेतृत्व और दृष्टि हेतु विशेष सम्मेलन (Conclaves):कुलपतियों और निदेशकों का सम्मेलन ,प्राचार्यों का सम्मेलन, उद्यमियों और प्रशासकों का सम्मेलन,छात्रों का सम्मेलन, वैज्ञानिकों का सम्मेलन ,यूट्यूबर्स का सम्मेलन ,मीडिया का सम्मेलन',
        <b key="attractions-1">अनुसंधान और नवाचार का प्रदर्शन:</b>,
        "शोध पत्र प्रस्तुति ,स्टार्टअप्स और इनोवेशन का प्रदर्शन ,छात्रों के प्रोजेक्ट्स और प्रदर्शनियां",
        <b key="attractions-2">सर्वश्रेष्ठ प्रथाओं का आदान-प्रदान:</b>,
        "किसी भी क्षेत्र में बेहतरीन कार्य और नवाचारों की प्रस्तुति।",
        <b key="attractions-2">प्रतिभा का सम्मान:</b>,
        "विशेष सत्रों में विभिन्न क्षेत्रों की उत्कृष्ट प्रतिभाओं को पहचान और सम्मान",
      ]
    },
    {
      title: "प्रतिभागियों के लिए सुनहरा अवसर:",
      content: [
        ' शिक्षा महाकुंभ में वैज्ञानिक, शोधकर्ता, छात्र, प्रोफेसर, अधिकारी, प्राचार्य, निदेशक, व्यवसायी और पेशेवर भाग लेंगे। यह एक ऐसा मंच है, जहां ये लोग अपने विचार और अनुभव साझा करेंगे, जिससे शिक्षा, नवाचार और वैश्विक विकास के क्षेत्रों में नई दिशाओं का निर्माण होगा।',
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
              Call: +91 7903431900
            </a>{" "},
            <a
              href="https://wa.me/917903431900"
              target="_blank"
              style={{ textDecoration: "none" }}
            >
              <img
                src="https://img.icons8.com/ios-filled/20/25D366/whatsapp.png"
                alt="WhatsApp"
                style={{
                  width: "20px",
                  height: "20px",
                  verticalAlign: "middle",
                }}
              />
            </a>
          </li>
          <li key="contact-2">
            <a
              href="tel:+918360990494"
              style={{ color: "blue", textDecoration: "none" }}
            >
              Call: +91 8360990494
            </a>
            ,
            <a
              href="https://wa.me/918360990494"
              target="_blank"
              style={{ textDecoration: "none" }}
            >
              <img
                src="https://img.icons8.com/ios-filled/20/25D366/whatsapp.png"
                alt="WhatsApp"
                style={{
                  width: "20px",
                  height: "20px",
                  verticalAlign: "middle",
                }}
              />
            </a>
          </li>
          <li key="contact-3">
            <a
              href="tel:+919416362401"
              style={{ color: "blue", textDecoration: "none" }}
            >
              Call: +91 9416362401
            </a>{" "},
            <a
              href="https://wa.me/919416362401"
              target="_blank"
              style={{ textDecoration: "none" }}
            >
              <img
                src="https://img.icons8.com/ios-filled/20/25D366/whatsapp.png"
                alt="WhatsApp"
                style={{
                  width: "20px",
                  height: "20px",
                  verticalAlign: "middle",
                }}
              />
            </a>
          </li>
        </ul>,
      ],
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
          <Press3 data={data} />
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
      <Footer />
    </div>
  );
}
