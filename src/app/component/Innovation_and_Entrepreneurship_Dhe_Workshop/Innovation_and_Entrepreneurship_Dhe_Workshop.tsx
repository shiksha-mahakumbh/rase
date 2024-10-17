import React from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

// Sample event data
const eventDetails = {
  title: "Innovation and Entrepreneurship for School Students, Teachers, and Atal Tinkering Labs Coordinators",
  introduction: `This workshop aims to foster innovation and entrepreneurship skills among school students, teachers, and coordinators of Atal Tinkering Labs in the tri-city area of Chandigarh, Mohali, and Panchkula. Through insightful sessions, interactive discussions, and hands-on experiences, participants will gain valuable knowledge and inspiration to explore the world of innovation and entrepreneurship from scientists of CSIO, ISRO, DRDO, Industry Experts, Subject Experts, etc.`,
  venue: {
    name: "CSIO Chandigarh",
    address: "CSIO Chandigarh, India",
    date: "10th May 2024",
    description:
      `This workshop aims to foster innovation and entrepreneurship skills among school students, teachers, and coordinators of Atal Tinkering Labs in the tri-city area of Chandigarh, Mohali, and Panchkula. Through insightful sessions, interactive discussions, and hands-on experiences, participants will gain valuable knowledge and inspiration to explore the world of innovation and entrepreneurship from scientists of CSIO, ISRO, DRDO, Industry Experts, Subject Experts, etc.
      **Target Participants**
      - Students (Grades 9-12)
      - ATL Labs Coordinators
      - Science Teachers (TGT & PGT) from Tricity Schools
      
      **Tentative Schedule of Workshop**
      - Session 1: Inaugural Address by Director, CSIO
      - Session 2: Insights into Cutting-Edge Research at CSIO Chandigarh and Opportunities for School Students and Teachers
      - Session 3: Introduction to Innovation and Entrepreneurship
      - Session 4: Interaction Session with Women Entrepreneurs
      - Session 5: Insights into Cutting-Edge Research at DHE Mohali and Opportunities for School Students and Teachers
      - Session 6: Visit of Mechatronics/Electronics Labs at CSIO Chandigarh
      - Session 7: Q&A and Networking`,
  },
  images: [
    "/2023K/b1.JPG", 
    "/2023K/bandaru_dattareya.JPG",
    "/2023K/k1.jpg",
    "/2023K/k2.JPG", 
    "/2023K/Shri Aswini Updhaya.JPG",
  ],
};

const EventPage: React.FC = () => {
  // Slider settings
  const sliderSettings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
    arrows: false,
  };

  return (
    <div className="bg-gray-50 min-h-screen p-8 flex flex-col items-center">
      {/* Event Title Above the Slider */}
      <h1 className="text-3xl font-bold text-center text-blue-700 mb-4 p-4 border-b-2 border-blue-300">
        {eventDetails.title}
      </h1>

      {/* Slider with Images */}
      <div className="mb-6 w-full max-w-4xl">
        <Slider {...sliderSettings} className="w-full">
          {eventDetails.images.map((image, index) => (
            <div key={index} className="flex justify-center">
              <img
                src={image}
                alt={`Event Slide ${index + 1}`}
                className="w-full h-80 object-contain rounded-lg"
              />
            </div>
          ))}
        </Slider>
      </div>

      {/* Event Venue */}
      <div className="p-6 mb-6 w-full max-w-4xl">
        <h2 className="text-2xl font-semibold mb-2 text-center text-blue-600">{eventDetails.venue.name}</h2>
        <p className="text-gray-700 leading-relaxed mb-4 text-center text-base">
          {eventDetails.venue.description}
        </p>
        <p className="text-gray-700 text-center text-base">
          <strong>Address:</strong> {eventDetails.venue.address}
        </p>
        <p className="text-gray-700 text-center text-base">
          <strong>Date:</strong> {eventDetails.venue.date}
        </p>
      </div>

      {/* Workshop Objective */}
      <div className="p-6 mb-6 w-full max-w-4xl">
        <h2 className="text-2xl text-center font-semibold mb-2 text-blue-600">Workshop Objective</h2>
        <p className="text-gray-700 leading-relaxed whitespace-pre-wrap text-base text-justify">
          {eventDetails.introduction}
        </p>
      </div>
    </div>
  );
};

export default EventPage;
