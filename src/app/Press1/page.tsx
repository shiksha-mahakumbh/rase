"use client";
import React from "react";
import CompanyInfo from "../component/CompanyInfo";
import Footer from "../component/Footer";
import NavBar from "../component/NavBar";
import Press1 from "../component/Press1";
import proceeding2 from '/public/2024M/press1.jpg';
import Image from "next/image"; 

const shareUrl = encodeURIComponent("https://www.rase.co.in/Press1"); // Replace with your actual page URL
const shareText = encodeURIComponent(
  "A Grand Start to Shiksha Mahakumbh 2.0! Witness the Baton Ceremony's success & join us Dec 16-17 for an educational revolution at Kurukshetra University!"
);
const shareImage ="/2024M/press1.jpg";

// Sample data for demonstration. Replace this with your actual data source or fetch method.
const data = {
  Press: "1",
  image:"/2024M/press1.jpg",
  title: "A Grand Start to Shiksha Mahakumbh 2.0: Baton Ceremony Successfully Concluded Kurukshetra, November 20, 2024",
  sections: [
    {
      title: "Introduction",
      content: [
        "In preparation for Shiksha Mahakumbh 2.0, the 'Baton Ceremony' was held today at Kurukshetra University, Kurukshetra, with grandeur and enthusiasm. This symbolic event marked the formal commencement of the Mahakumbh and witnessed the participation of several dignitaries from the fields of education, society, and politics.",
      ]
    },

    {
      title: "Highlights of the Event",
      content: [
        <b key="highlight-1">1. Vice-Chancellor, Kurukshetra University</b>,
        "The Vice-Chancellor emphasized the significance of Shiksha Mahakumbh 2.0 in highlighting the role of the Indian education system in global development. He congratulated all participants for their efforts in making this initiative a reality.",

        <b key="highlight-2">2. Dr. Thakur SKR (Sci/Engr-SF, ISRO & Director, Shiksha Mahakumbh)</b>,
        "Dr. Thakur elaborated on the theme 'The Role of the Indian Education System in Global Development' and described the event as a global platform for innovation and dialogue in education. He added, “While sports have the global platform of the Olympics, there is currently no such forum for sustainable development, which is a fundamental aspect of global progress. Shiksha Mahakumbh is a small but significant step to address this gap, drawing inspiration from India’s ancient heritage as a global knowledge leader.”",

        <b key="highlight-3">3. Shri Vijay Nadda (Organizing Secretary, Vidya Bharati North Zone)</b>,
        "Shri Nadda highlighted the objectives of Shiksha Mahakumbh, describing it as a key initiative to uphold the legacy of Indian education and align it with NEP 2020. He emphasized its role in fostering skill-based and entrepreneurial education while promoting meaningful discourse.",

        <b key="highlight-4">4. Shri Virender Garg (Patron, Publicity Department, Shiksha Mahakumbh 2.0)</b>,
        "Shri Garg discussed the interconnection between Indian culture and education and assured his full support for the success of the Mahakumbh.",

        <b key="highlight-5">5. Dr. Amit Kansal (Coordinator, Publicity Department, Shiksha Mahakumbh 2.0)</b>,
        "Dr. Kansal provided insights into the program’s structure and shared details about the preparations for upcoming events.",
      ]
    },

    {
      title: "Key Attractions:-",
      content: [
        "The Baton, symbolizing the inauguration of Shiksha Mahakumbh 2.0, was ceremoniously established by the chief guest.",

        <b key="attractions-1">Special Presentations:-</b>,
        "Thought-provoking discussions on Indian culture enriched the event.",

        <b key="attractions-2">Special Presentations:-</b>,
        "Enthusiastic involvement from educators, students, researchers, and social leaders.",
      ]
    },

    {
      title: "Upcoming Events:-",
      content: [
        "Shri Krishna Pandey, Co-convener, DHE, Haryana, announced that Shiksha Mahakumbh 2.0 will host a series of academic and cultural activities on December 16-17, 2024, at Kurukshetra University. These include:",

        <b key="upcoming-1">Vice-Chancellors and Directors Conclave</b>,
        "Scientists Conclave",
        "YouTubers Conclave",
        "Principals Conclave",
        "Media Conclave",

        <b key="upcoming-2">Entrepreneurs/Administrative Officers Conclave</b>,

        "Student Leadership Workshops",
        "Project & Exhibition Displays",
        "Best Practices Showcases",
      ]
    },

    {
      title: "Invitations:-",
      content: [
        "Honorable member of the Finance Committee of Shiksha Mahakumbh, Shri Sanjay Chaudhary, along with Prof. Sunil Dhingra, Director, UIET, Kurukshetra University, extended an open invitation to all educators, students, and organizations to actively participate in the upcoming sessions of Shiksha Mahakumbh 2.0.",
      ]
    },

    {
      title: "With Regards,",
      content: [
        "Coordinator, Publicity Department, Shiksha Mahakumbh 2.0",
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
        <Press1 data={data} />
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