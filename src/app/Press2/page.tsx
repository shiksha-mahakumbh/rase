"use client";
import React from "react";
import CompanyInfo from "../component/CompanyInfo";
import Footer from "../component/Footer";
import NavBar from "../component/NavBar";
import Press2 from "../component/Press2";
import proceeding1 from '/public/2024M/press2.jpg';
import Image from "next/image"; 

const shareUrl = encodeURIComponent("https://www.rase.co.in/Press2"); // Replace with your actual page URL
const shareText = encodeURIComponent(
  "कुरुक्षेत्र हरियाणा में आयोजित होगा द्वितीय शिक्षा महाकुंभ 2024।"
);
const shareImage = "/2024M/press2.jpg";

// Sample data for demonstration. Replace this with your actual data source or fetch method.
const data = {
  Press: "2",
  image:"/2024M/press2.jpg",
  title: "आगामी 16 तथा 17 दिसंबर 2024 को कुरुक्षेत्र विश्वविद्यालय में द्वितीय शिक्षा महाकुंभ का आयोजन किया जाएगा। ",
  sections: [
    {
      title: "Introduction",
      content: [
        "विद्या भारती अखिल भारतीय शिक्षा संस्थान एवं कुरुक्षेत्र विश्वविद्यालय कुरुक्षेत्र के संयुक्त तत्वावधान में आगामी 16 तथा 17 दिसंबर 2024 को कुरुक्षेत्र विश्वविद्यालय में द्वितीय शिक्षा महाकुंभ का आयोजन किया जाएगा।     " ]
    },

    {
      title: "Highlights of the Event",
      content: [
       
        <b key="highlight-2"> Dr. Thakur SKR (Sci/Engr-SF, ISRO & Director, Shiksha Mahakumbh)</b>,
        "गीता निकेतन आवासीय विद्यालय कुरुक्षेत्र में आयोजित एक प्रेस वार्ता में इसरो के प्रमुख वैज्ञानिक तथा सामाजिक कार्यकर्ता ठाकुर सुदेश कुमार ने आज बताया कि शिक्षा महाकुंभ अभियान एक दूरदर्शी पहल है जिसका उद्देश्य शिक्षा नीति 2020 के कार्यान्वन के माध्यम से भारत के शैक्षिक परिदृश्य को फिर से परिभाषित करना है । उन्होंने बताया कि इस अभियान को आगे बढ़ाने के लिए आई आई टी, आई आई एम , एम्स, एनआईडी, एन आई टी,   आदि  राष्ट्रीय महत्व के प्रतिष्ठित संस्थानों  का सहयोग लिया जा रहा है। इस पहल का मुख्य उद्देश्य शिक्षा के सभी पहलुओं पर संवाद के लिए संपूर्ण जन समूह को एक मंच प्रदान करना है। पंचकोशीय भारतीय दर्शन को केंद्र में रखकर उपलब्धियों, बाधाओं और भविष्य की दिशा- दशा पर एक ही मंच पर संवाद स्थापित करना है। उन्होंने बताया कि हर क्षेत्र के विशेषज्ञ इस मंच पर अपनी राय रखेंगे। शिक्षा में क्षेत्रीय असमानताओं और वैश्विक चुनौतियों को संबोधित करने की दिशा में यह एक अनूठा अभियान है। इस अभियान में अनेक प्रतिष्ठित संस्थाओं के छात्रों को भाग लेने के लिए प्रोत्साहित किया जा रहा है। शिक्षा महाकुंभ अभियान पारंपरिक मूल्यों को आधुनिक शिक्षा के साथ एकीकृत करने के महत्व पर भी जोर देता है । समकालीन चुनौतियों का समाधान करते हुए समृद्ध सांस्कृतिक विरासत और ज्ञान के आधार को बनाए रखने का प्रयास करता है। उन्होंने बताया कि पहला शिक्षा महाकुंभ 9 से 11 जून 2023 को एन आई टी जालंधर में आयोजित किया गया था।",
      ]
    },

    {
      title: "Key Attractions:-",
      content: [
        " विभिन्न राज्यों के राज्यपाल, केंद्रीय मंत्रियों, निर्देशकों, कुलपतियों ,नौकर साह, मीडिया की हस्तियों, और विभिन्न क्षेत्रों के गणमान्य व्यक्तियों और समाज के सदस्यों की भागीदारी प्राप्त हुई थी। इस शिक्षा महाकुंभ में तय किया गया था कि  शिक्षकों, शोधकर्ताओं, छात्रों और उद्योगपतियों के बीच संवाद और सहयोग को बढ़ावा देना है।",

        <b key="attractions-1">Special Presentations:-</b>,
        "शिक्षा महाकुंभ को वैश्विक भागीदारी और संवाद के लिए डिजाइन किया गया है। इस शिक्षा महाकुंभ 2024 में अलग-अलग विषय विशेषज्ञों के सम्मेलन आयोजित किए जाएंगे जिनमें नेतृत्व की दृष्टि से कुलपतियों और निर्देशकों का सम्मेलन, प्राचार्य का सम्मेलन, उद्यमियों और प्रशासकों का सम्मेलन, छात्रों का सम्मेलन, वैज्ञानिकों का सम्मेलन ,यूट्यूबर्ष का सम्मेलन और मीडिया से जुड़े लोगों का सम्मेलन होगा।",

        <b key="attractions-2">Special Presentations:-</b>,
        "अनुसंधान और नवाचार की दृष्टि से शोध पत्र प्रस्तुति, स्टार्टअप इनोवेशन और छात्रों के प्रोजेक्ट का प्रदर्शन होगा। सर्वश्रेष्ठ प्रथाओं का आदान-प्रदान, किसी भी क्षेत्र में बेहतरीन कार्य और नवाचारों की प्रस्तुति करने पर प्रतिभा का सम्मान । विभिन्न क्षेत्रों की उत्कृष्ट प्रतिभाओं को पहचान कर सम्मानित किया जाएगा। शिक्षा महाकुंभ में वैज्ञानिक, शोधकर्ता, छात्र, प्रोफेसर, अधिकारी ,प्राचार्य, निदेशक ,व्यवसायी और पेशेवर भाग लेंगे ।",
      ]
    },

    {
      title: "For Further Information, Contact:-",
      content: [
        <ul key="contact-list">
          <li key="contact-1">
            <a
              href="tel:+917903431900"
              style={{ color: "blue", textDecoration: "none" }}
            >
              Call: +91 7903431900
            </a>{" "}
            ,
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
            </a>{" "}
            ,
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
        <Press2 data={data} />
        {/* Social Media Sharing Section */}
        <div className="mt-6 flex justify-center space-x-4">
          <a
            href={`https://wa.me/?text=${shareText}%20${shareUrl}&picture=${shareImage}`
    }
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